// Radio 계열 Code Connect 매핑(2026-07-28) — radio SET(7368:1243) + radio group SET(7626:3318).
//   - 속성 실명은 REST componentPropertyDefinitions로 확인: 변형 'state' · 라벨 'right text'(공백 포함).
//     hover 상태는 CSS 상호작용이라 별도 prop 없음(selected hover→checked로만 반영).
// 발행: FIGMA_ACCESS_TOKEN=… npx figma connect publish --force
// 파서 제약 — URL·props는 리터럴만(변수·스프레드·as const 금지).
import figma from '@figma/code-connect';
import { Radio, RadioGroup } from './Radio';

// radio — 단일 라디오(상태 6종 × 우측 라벨)
figma.connect(
  Radio,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7368-1243',
  {
    props: {
      checked: figma.enum('state', {
        'selected default': true,
        'selected hover': true,
        'selected disabled': true,
      }),
      disabled: figma.enum('state', {
        'unselected disabled': true,
        'selected disabled': true,
      }),
      label: figma.string('right text'),
    },
    example: ({ checked, disabled, label }) => (
      <Radio checked={checked} disabled={disabled} label={label} />
    ),
  },
);

// radio group — 라디오 나열(gap 3~7 × direction, 단일 선택)
figma.connect(
  RadioGroup,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7626-3318',
  {
    props: {
      direction: figma.enum('direction', { horizontal: 'horizontal', vertical: 'vertical' }),
      gap: figma.enum('gap', { '3': '3', '4': '4', '5': '5', '6': '6', '7': '7' }),
    },
    example: ({ direction, gap }) => (
      <RadioGroup
        direction={direction}
        gap={gap}
        items={[
          { value: 'a', label: '옵션 1' },
          { value: 'b', label: '옵션 2' },
        ]}
      />
    ),
  },
);
