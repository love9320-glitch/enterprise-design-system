// Pagination Code Connect 매핑(2026-08-01) — pagination SET(7332:1755014, page num=10/5) +
// pagination button SET(7263:1752988, 구 'pagenation' 오타는 Figma에서 수정).
//   - page num → maxButtons(번호 노출 개수). 버튼 SET은 내부 구현이라 개별 export 없음 —
//     Pagination 전체 예시로 매핑(규칙 11 — 코드 축소 없음, state/type은 내부 상태).
// 발행: main 머지 시 자동(.github/workflows/figma-code-connect.yml)
// 파서 제약 — URL·props는 리터럴만(변수·스프레드·as const 금지).
import figma from '@figma/code-connect';
import { Pagination } from './Pagination';

// pagination — 페이지 이동 바(번호 노출 개수 10/5)
figma.connect(
  Pagination,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7332-1755014',
  {
    props: {
      maxButtons: figma.enum('page num', { '10': 10, '5': 5 }),
    },
    example: ({ maxButtons }) => (
      <Pagination page={1} totalCount={480} pageSize={20} maxButtons={maxButtons} />
    ),
  },
);

// pagination button — 내부 번호/화살표 버튼(개별 export 없음 → Pagination 사용 예시)
figma.connect(
  Pagination,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7263-1752988',
  {
    example: () => <Pagination page={1} totalCount={480} pageSize={20} />,
  },
);
