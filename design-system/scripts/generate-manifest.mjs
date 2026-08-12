// generate-manifest — AI가 읽는 컴포넌트 매니페스트(components.json) 생성기 (2026-08-12, Astryx 벤치마킹)
//
// 목적: 소비자(회사 개발자)의 AI 도구가 이 패키지의 컴포넌트·props·사용 규칙을
// 정확히 이해하도록 기계가 읽는 카탈로그를 npm 패키지에 동봉한다.
//
// Source of Truth 설계(드리프트 원천 차단):
//   - props(이름·타입·필수·기본값·설명) = TypeScript 소스에서 자동 추출(react-docgen-typescript,
//     JSDoc/인라인 주석 포함) — 코드가 진실
//   - 사용 지식(usage) = 규칙서 카탈로그(components.md 표 행) 파싱 — 카탈로그가 진실
//   - 생성 시점 = build:package(배포 산출물) — 커밋된 사본이 없으므로 낡을 수 없다
//
// 실행: node scripts/generate-manifest.mjs [출력경로]   (기본 dist-lib/components.json)
import { withCustomConfig } from 'react-docgen-typescript';
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = process.argv[2] ?? join(ROOT, 'dist-lib', 'components.json');

// ── 1) 규칙서 카탈로그(components.md) 표 파싱 — 컴포넌트명 → 사용 지식 ──
// 행 형식: | 이름 | `파일` | 주요 옵션(운영 지식 프로즈) | 데모 페이지 |
function parseCatalog() {
  const md = readFileSync(
    join(ROOT, '..', '.claude', 'skills', 'design-system', 'components.md'),
    'utf8',
  );
  const usage = new Map();
  for (const line of md.split('\n')) {
    if (!line.startsWith('| ')) continue;
    const cells = line.split('|').map((c) => c.trim());
    // [ '', 이름, 파일, 옵션 프로즈, 데모, '' ] 형태만
    if (cells.length < 5 || cells[1] === '컴포넌트' || cells[1].startsWith('---')) continue;
    const names = cells[1]
      .replace(/\(.*?\)/g, '') // "(내부용)" 등 괄호 제거
      .split(/[/+·]| \/ /)
      .map((n) => n.replace(/[*`]/g, '').trim())
      .filter((n) => /^[A-Z][A-Za-z]+$/.test(n));
    for (const name of names) {
      if (!usage.has(name)) {
        usage.set(name, { notes: cells[3], demoPage: cells[4].replace(/`/g, '') });
      }
    }
  }
  return usage;
}

// ── 2) TypeScript 소스에서 props 추출 ──
const parser = withCustomConfig(join(ROOT, 'tsconfig.json'), {
  savePropValueAsString: true,
  shouldExtractLiteralValuesFromEnum: true,
  shouldRemoveUndefinedFromOptional: true,
  // DOM 상속 props(div의 onClick 등 수백 개)는 제외 — 우리 파일에서 선언된 것만
  propFilter: (prop) => {
    if (!prop.parent) return true;
    return !prop.parent.fileName.includes('node_modules');
  },
});

function componentFiles() {
  const dirs = ['src/components', 'src/layouts', 'src/templates'];
  const files = [];
  for (const dir of dirs) {
    for (const f of readdirSync(join(ROOT, dir))) {
      if (!/\.tsx$/.test(f)) continue;
      if (/\.figma\.tsx$/.test(f)) continue; // Code Connect 매핑 파일 제외
      files.push(join(ROOT, dir, f));
    }
  }
  return files;
}

// ── 1.5) 접근성 계약(ACCESSIBILITY.md) 파싱 — "## 컴포넌트명" 절 → accessibility 필드 ──
function parseA11yContracts() {
  const map = new Map();
  let md;
  try {
    md = readFileSync(join(ROOT, 'ACCESSIBILITY.md'), 'utf8');
  } catch {
    return map;
  }
  const sections = md.split(/^## /m).slice(1); // 첫 조각은 머리말
  for (const sec of sections) {
    const nl = sec.indexOf('\n');
    const name = sec.slice(0, nl).trim();
    if (/^[A-Z][A-Za-z]+$/.test(name)) map.set(name, sec.slice(nl + 1).trim());
  }
  return map;
}

const catalog = parseCatalog();
const a11y = parseA11yContracts();
const docs = parser.parse(componentFiles());

const components = docs
  .filter((d) => /^[A-Z]/.test(d.displayName))
  .map((d) => {
    const cat = catalog.get(d.displayName);
    return {
      name: d.displayName,
      description: d.description || undefined,
      // 카탈로그의 운영 지식(한국어 프로즈) — 언제/어떻게 쓰는지, 규칙, 판례
      usageNotes: cat?.notes,
      demoPage: cat?.demoPage,
      // 접근성 계약(역할·키보드·포커스·ARIA — ACCESSIBILITY.md가 원본, 마크다운 프로즈)
      accessibility: a11y.get(d.displayName),
      props: Object.values(d.props ?? {}).map((p) => ({
        name: p.name,
        type: p.type?.name,
        required: p.required || undefined,
        defaultValue: p.defaultValue?.value ?? undefined,
        description: p.description || undefined,
      })),
    };
  })
  // 문서 정보가 하나도 없는 잔여물(내부 헬퍼가 잡힌 경우) 제거
  .filter((c) => c.props.length > 0 || c.usageNotes)
  .sort((a, b) => a.name.localeCompare(b.name));

const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const manifest = {
  $schema: 'design-system component manifest (AI-readable)',
  package: pkg.name,
  version: pkg.version,
  generatedFrom: 'TypeScript sources (props) + design-system rulebook catalog (usage notes)',
  quickstart: {
    styles: "import '@gusun/design-system/styles.css'; // Tailwind 불필요, 토큰 유틸 포함",
    entries: {
      '.': '컴포넌트 전체 + 기능 훅 + 유틸',
      './editor': 'Editor 계열(Tiptap peer 필요)',
      './tokens': '디자인 토큰 값',
      './preset': 'Tailwind preset',
    },
    conventions: [
      '색·간격·라운드는 시멘틱 토큰 클래스만 사용(하드코딩 금지)',
      "벨리데이션 표준 카피: 필수 입력='필수 입력사항입니다.' · 필수 선택='필수 선택사항입니다.' · 형식 오류='잘못된 양식입니다.'",
      '컴포넌트는 data-state/data-variant/data-size 꼬리표를 DOM에 노출(테스트 셀렉터용, prop 아님)',
      '페이지 조립 순서: Page 셸 → 템플릿(TableTemplate/FormTemplate 등) → 개별 컴포넌트',
    ],
  },
  componentCount: components.length,
  components,
};

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(manifest, null, 2) + '\n');
console.log(`✅ components.json 생성 — 컴포넌트 ${components.length}개 → ${OUT}`);

// 기본 무결성 검사(생성기 자체 고장 감지) — 핵심 컴포넌트 존재 + props 추출 확인
const need = ['Button', 'Input', 'Select', 'Modal', 'Table', 'TableTemplate'];
const missing = need.filter((n) => !components.some((c) => c.name === n));
const inputComp = components.find((c) => c.name === 'Input');
if (missing.length) {
  console.error('❌ 핵심 컴포넌트 누락:', missing);
  process.exit(1);
}
if (!inputComp?.props.some((p) => p.name === 'type')) {
  console.error('❌ Input props 추출 실패(type 없음)');
  process.exit(1);
}
