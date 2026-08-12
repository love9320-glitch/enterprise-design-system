// 공개 API 변경 감지 (2026-08-12) — API 표면 스냅샷 생성·비교
//
// 표면 = ① 엔트리별 export 이름(index/editor/tokens, TS 컴파일러로 배럴 해석)
//        ② 컴포넌트별 공개 props(이름·타입·필수·기본값 — generate-manifest와 동일한 docgen)
// 스냅샷(api-surface.json)은 커밋되며, CI가 재생성본과 비교해 다르면 실패한다.
//   - 의도한 변경: `npm run update:api` 후 스냅샷을 같은 PR에 커밋(diff가 리뷰 근거,
//     README 릴리스 정책의 major/minor 판정 기준)
//   - 의도 안 한 변경(export 삭제·prop 제거 등): 머지 전에 발각
// 사용: node scripts/api-surface.mjs check | update
import ts from 'typescript';
import { withCustomConfig } from 'react-docgen-typescript';
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SNAPSHOT = join(ROOT, 'api-surface.json');
const mode = process.argv[2] ?? 'check';

// ── ① 엔트리별 export 이름 — TS 컴파일러가 export * 배럴을 끝까지 해석 ──
const ENTRIES = {
  '.': 'src/index.ts',
  './editor': 'src/editor.ts',
  './tokens': 'src/tokens/index.ts',
};
function collectExports() {
  const files = Object.values(ENTRIES).map((f) => join(ROOT, f));
  const cfg = ts.readConfigFile(join(ROOT, 'tsconfig.json'), ts.sys.readFile).config;
  const parsed = ts.parseJsonConfigFileContent(cfg, ts.sys, ROOT);
  const program = ts.createProgram(files, parsed.options);
  const checker = program.getTypeChecker();
  const result = {};
  for (const [entry, rel] of Object.entries(ENTRIES)) {
    const sf = program.getSourceFile(join(ROOT, rel));
    const moduleSymbol = checker.getSymbolAtLocation(sf);
    result[entry] = checker
      .getExportsOfModule(moduleSymbol)
      .map((s) => s.getName())
      .sort();
  }
  return result;
}

// ── ② 컴포넌트별 공개 props — generate-manifest와 동일 설정(설명 텍스트는 제외) ──
function collectProps() {
  const parser = withCustomConfig(join(ROOT, 'tsconfig.json'), {
    savePropValueAsString: true,
    shouldExtractLiteralValuesFromEnum: true,
    shouldRemoveUndefinedFromOptional: true,
    propFilter: (prop) => !prop.parent || !prop.parent.fileName.includes('node_modules'),
  });
  const files = [];
  for (const dir of ['src/components', 'src/layouts', 'src/templates']) {
    for (const f of readdirSync(join(ROOT, dir))) {
      if (/\.tsx$/.test(f) && !/\.figma\.tsx$/.test(f)) files.push(join(ROOT, dir, f));
    }
  }
  const out = {};
  for (const d of parser.parse(files)) {
    if (!/^[A-Z]/.test(d.displayName)) continue;
    const props = Object.values(d.props ?? {})
      .map((p) => ({
        name: p.name,
        type: p.type?.name,
        required: p.required || undefined,
        defaultValue: p.defaultValue?.value ?? undefined,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
    if (props.length) out[d.displayName] = props;
  }
  return Object.fromEntries(Object.entries(out).sort(([a], [b]) => a.localeCompare(b)));
}

const surface = { exports: collectExports(), componentProps: collectProps() };
const next = JSON.stringify(surface, null, 2) + '\n';

if (mode === 'update') {
  writeFileSync(SNAPSHOT, next);
  console.log(`✅ api-surface.json 갱신 — export ${Object.values(surface.exports).flat().length}개 · 컴포넌트 ${Object.keys(surface.componentProps).length}개`);
  process.exit(0);
}

// ── check — 스냅샷과 비교, 다르면 사람이 읽을 수 있는 차이 출력 후 실패 ──
if (!existsSync(SNAPSHOT)) {
  console.error('✗ api-surface.json 스냅샷이 없습니다. `npm run update:api`로 생성 후 커밋하세요.');
  process.exit(1);
}
const prev = JSON.parse(readFileSync(SNAPSHOT, 'utf8'));
const diffs = [];

for (const entry of new Set([...Object.keys(prev.exports), ...Object.keys(surface.exports)])) {
  const a = new Set(prev.exports[entry] ?? []);
  const b = new Set(surface.exports[entry] ?? []);
  for (const n of a) if (!b.has(n)) diffs.push(`❌ BREAKING  export 제거: ${entry} → ${n}`);
  for (const n of b) if (!a.has(n)) diffs.push(`➕ minor     export 추가: ${entry} → ${n}`);
}
const comps = new Set([...Object.keys(prev.componentProps), ...Object.keys(surface.componentProps)]);
for (const c of comps) {
  const a = new Map((prev.componentProps[c] ?? []).map((p) => [p.name, p]));
  const b = new Map((surface.componentProps[c] ?? []).map((p) => [p.name, p]));
  for (const [n, p] of a) {
    if (!b.has(n)) { diffs.push(`❌ BREAKING  prop 제거: ${c}.${n}`); continue; }
    const q = b.get(n);
    if (p.type !== q.type) diffs.push(`⚠️ 확인 필요  prop 타입 변경: ${c}.${n} — ${p.type} → ${q.type}`);
    if (!p.required && q.required) diffs.push(`❌ BREAKING  prop 필수화: ${c}.${n}`);
    if (String(p.defaultValue) !== String(q.defaultValue))
      diffs.push(`⚠️ 확인 필요  기본값 변경: ${c}.${n} — ${p.defaultValue} → ${q.defaultValue}`);
  }
  for (const n of b.keys()) if (!a.has(n)) diffs.push(`➕ minor     prop 추가: ${c}.${n}`);
}

if (diffs.length) {
  console.error(`✗ 공개 API 변경 감지 (${diffs.length}건):\n`);
  for (const d of diffs.sort()) console.error('  ' + d);
  console.error('\n의도한 변경이면 `npm run update:api` 실행 후 api-surface.json을 같은 PR에 커밋하세요.');
  console.error('BREAKING 항목이 있으면 README 릴리스 정책에 따라 major(또는 deprecated 병행)를 검토하세요.');
  process.exit(1);
}
console.log('✅ 공개 API 변경 없음 — 스냅샷과 일치');
