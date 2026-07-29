// SegmentedTabs Code Connect 매핑(2026-07-29) — Segmented Tabs SET(8241:88288, tabs num=2/3)
// + segmented tab button SET(8241:88277, 내부 버튼 — 코드에선 SegmentedTabs가 items로 렌더).
//   - tabs num 변형은 variant 스코프로 나눠 아이템 개수에 맞는 예시를 각각 보여준다.
//   - 탭 라벨·선택 상태는 코드에선 items/value로 표현되므로 예시 값으로 안내.
// 발행: main 머지 시 자동(.github/workflows/figma-code-connect.yml)
// 파서 제약 — URL·props는 리터럴만(변수·스프레드·as const 금지).
import figma from '@figma/code-connect';
import { SegmentedTabs } from './SegmentedTabs';

// tabs num=2
figma.connect(
  SegmentedTabs,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=8241-88288',
  {
    variant: { 'tabs num': '2' },
    example: () => (
      <SegmentedTabs
        items={[
          { value: 'a', label: '탭 1' },
          { value: 'b', label: '탭 2' },
        ]}
        defaultValue="a"
      />
    ),
  },
);

// tabs num=3
figma.connect(
  SegmentedTabs,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=8241-88288',
  {
    variant: { 'tabs num': '3' },
    example: () => (
      <SegmentedTabs
        items={[
          { value: 'a', label: '탭 1' },
          { value: 'b', label: '탭 2' },
          { value: 'c', label: '탭 3' },
        ]}
        defaultValue="a"
      />
    ),
  },
);

// segmented tab button — 내부 버튼(단독 사용 없음): 선택/비활성은 SegmentedTabs의 value·items로 표현
figma.connect(
  SegmentedTabs,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=8241-88277',
  {
    example: () => (
      <SegmentedTabs
        items={[
          { value: 'a', label: '탭 1' },
          { value: 'b', label: '탭 2' },
        ]}
        defaultValue="a"
      />
    ),
  },
);
