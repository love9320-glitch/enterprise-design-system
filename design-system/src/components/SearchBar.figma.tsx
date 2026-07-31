// SearchBar Code Connect 매핑(2026-07-29) — search bar SET(1507:41084).
//   - state 변형: filled(값 입력됨)→defaultValue. hover/focused는 CSS 상태라 매핑 제외.
//   - type: solid 단일이라 매핑 생략.
// 발행: main 머지 시 자동(.github/workflows/figma-code-connect.yml)
// 파서 제약 — URL·props는 리터럴만(변수·스프레드·as const 금지).
import figma from '@figma/code-connect';
import { SearchBar } from './SearchBar';

figma.connect(
  SearchBar,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=1507-41084',
  {
    props: {
      defaultValue: figma.enum('state', {
        Filled: '검색어',
        'Filled hover': '검색어',
        'Filled focused': '검색어',
      }),
    },
    example: ({ defaultValue }) => (
      <SearchBar placeholder="검색어를 입력하세요" defaultValue={defaultValue} />
    ),
  },
);
