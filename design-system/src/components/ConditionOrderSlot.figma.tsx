// ConditionOrderSlot Code Connect 매핑(2026-08-02) — ConditionOrderSlot SET(8219:80583, layout) +
// ConditionSlotCard SET(8219:80364, state — Hover/Pressed는 CSS).
// 발행: main 머지 시 자동(.github/workflows/figma-code-connect.yml)
// 파서 제약 — URL·props는 리터럴만(변수·스프레드·as const 금지).
import figma from '@figma/code-connect';
import { ConditionOrderSlot, ConditionSlotCard } from './ConditionOrderSlot';

// ConditionOrderSlot — 조건 카드 순서 슬롯(세로 ↓ / 가로 › 커넥터)
figma.connect(
  ConditionOrderSlot,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=8219-80583',
  {
    props: {
      direction: figma.enum('layout', {
        Vertical: 'vertical',
        Horizontal: 'horizontal',
      }),
    },
    example: ({ direction }) => (
      <ConditionOrderSlot
        direction={direction}
        items={[
          { id: 'a', body: '조건 1' },
          { id: 'b', body: '조건 2' },
          { id: 'c', body: '조건 3' },
        ]}
      />
    ),
  },
);

// ConditionSlotCard — 카드 한 장(Hover/Pressed는 CSS)
figma.connect(
  ConditionSlotCard,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=8219-80364',
  {
    example: () => <ConditionSlotCard title="조건 1." enabled />,
  },
);
