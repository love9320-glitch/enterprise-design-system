// Tabs 계열 Code Connect 매핑(2026-07-29) — tab menu SET(7371:3004) + tab group SET(7371:3057).
//   - tab menu: state(tab select→selected, tab disabled→disabled — hover는 CSS 상태).
//   - tab group: Property 1(hug/fill → variant, 'hug onoff'는 hug + rightSlot(스위치 등) 구성 예시).
// 발행: main 머지 시 자동(.github/workflows/figma-code-connect.yml)
// 파서 제약 — URL·props는 리터럴만(변수·스프레드·as const 금지).
import figma from '@figma/code-connect';
import { Switch } from './Switch';
import { TabMenu, Tabs } from './Tabs';

// tab menu — 탭 버튼 한 개(단독)
figma.connect(
  TabMenu,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7371-3004',
  {
    props: {
      selected: figma.enum('state', { 'tab select': true }),
      disabled: figma.enum('state', { 'tab disabled': true }),
    },
    example: ({ selected, disabled }) => (
      <TabMenu selected={selected} disabled={disabled}>
        탭 메뉴
      </TabMenu>
    ),
  },
);

// tab group — hug(내용 폭)
figma.connect(
  Tabs,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7371-3057',
  {
    variant: { 'Property 1': 'hug' },
    example: () => (
      <Tabs
        items={[
          { value: 'a', label: '탭 메뉴' },
          { value: 'b', label: '탭 메뉴' },
          { value: 'c', label: '탭 메뉴' },
        ]}
        defaultValue="a"
      />
    ),
  },
);

// tab group — hug + 우측 요소(onoff 스위치 등은 rightSlot으로)
figma.connect(
  Tabs,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7371-3057',
  {
    variant: { 'Property 1': 'hug onoff' },
    example: () => (
      <Tabs
        items={[
          { value: 'a', label: '탭 메뉴' },
          { value: 'b', label: '탭 메뉴' },
        ]}
        defaultValue="a"
        rightSlot={<Switch label="스위치" />}
      />
    ),
  },
);

// tab group — fill(균등 분할)
figma.connect(
  Tabs,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7371-3057',
  {
    variant: { 'Property 1': 'fill' },
    example: () => (
      <Tabs
        variant="fill"
        items={[
          { value: 'a', label: '탭 메뉴' },
          { value: 'b', label: '탭 메뉴' },
          { value: 'c', label: '탭 메뉴' },
        ]}
        defaultValue="a"
      />
    ),
  },
);
