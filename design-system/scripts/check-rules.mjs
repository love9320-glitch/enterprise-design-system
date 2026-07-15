#!/usr/bin/env node
// check-rules — 문서 규칙 중 '기계로 잡을 수 있는 것'을 자동 검사한다 (규칙은 기계에게, 문서는 얇게).
// 사용: node scripts/check-rules.mjs  (커밋 전 실행 — package.json "check:rules")
// 오류(exit 1): 규칙 위반 확정 / 경고(exit 0): 사람이 확인할 후보.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const SRC = join(ROOT, 'src');

// 검사 대상 수집 (tokens 제외 — 토큰 정의 파일은 값의 출처)
const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (!p.includes('/tokens')) walk(p);
    } else if (/\.(tsx|ts|jsx|js)$/.test(name)) files.push(p);
  }
})(SRC);

const errors = [];
const warnings = [];
const push = (list, file, line, rule, text) =>
  list.push(`${relative(ROOT, file)}:${line} [${rule}] ${text.trim().slice(0, 90)}`);

// ── 규칙 2b: 간격·행간 임의값 금지 (고정 치수 h-[]/w-[]는 허용) ──
const ARBITRARY_SPACING = /\b(p|px|py|pl|pr|pt|pb|m|mx|my|ml|mr|mt|mb|gap|gap-x|gap-y|space-x|space-y|leading)-\[/;
// ── 규칙 2a: Tailwind 기본 스페이싱 클래스 금지 (spacing 토큰만 — p-spacing-N) ──
const DEFAULT_SPACING = /(?:^|["'`\s])(p|px|py|pl|pr|pt|pb|m|mx|my|ml|mr|mt|mb|gap|gap-x|gap-y|space-x|space-y)-\d+(?:\.\d+)?(?:["'`\s]|$)/;
// ── 규칙 1b: 하드코딩 HEX (컴포넌트/페이지 — 데모 표기·주석 제외 후보라 경고) ──
const HEX = /#[0-9a-fA-F]{6}\b/;
// ── 규칙 15: 카피 띄어쓰기 오류 후보 ──
const COPY = /(할수|볼수|될수|만들수|쓸수|첫번째|두번째|세번째|여러개|몇개|선택시|입력시|클릭시)/;

for (const f of files) {
  const lines = readFileSync(f, 'utf8').split('\n');
  const isModalFile = lines.some((l) => l.includes('<Modal'));
  lines.forEach((raw, i) => {
    const n = i + 1;
    const code = raw.replace(/\/\/.*$/, ''); // 주석 제거본(코드 검사용)
    if (ARBITRARY_SPACING.test(code)) push(errors, f, n, '2b 임의 간격/행간', raw);
    if (DEFAULT_SPACING.test(code)) push(errors, f, n, '2a 기본 스페이싱 클래스', raw);
    if (HEX.test(code) && !/tokens|swatch|checker/i.test(raw)) push(warnings, f, n, '1b HEX 하드코딩 후보', raw);
    if (COPY.test(raw) && !raw.trim().startsWith('//')) push(warnings, f, n, '15 카피 띄어쓰기 후보', raw);
    // ── 규칙 18: 모달 파일에서 페이지네이션 없는 고정 maxHeight 테이블 후보 ──
    if (isModalFile && /<Table[\s\S]*maxHeight=\{\d+\}/.test(code) && !/pagination/.test(code))
      push(warnings, f, n, '18 모달 고정 maxHeight 테이블 — fill 검토', raw);
  });
}

if (errors.length) {
  console.log('❌ 규칙 위반 (수정 필요):');
  errors.forEach((e) => console.log('  ' + e));
}
if (warnings.length) {
  console.log('⚠️  확인 후보 (사람 판단):');
  warnings.forEach((w) => console.log('  ' + w));
}
if (!errors.length && !warnings.length) console.log('✅ 규칙 검사 통과 (오류 0 · 후보 0)');
else if (!errors.length) console.log(`✅ 오류 0 · 후보 ${warnings.length}건`);
process.exit(errors.length ? 1 : 0);
