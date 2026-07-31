// Checkbox 계열 Code Connect 매핑(2026-07-28) — check box SET(7257:2441) + check group SET(7626:2874).
//   - 변형 속성명은 'state'(REST componentPropertyDefinitions로 확인 — 심볼명 표기와 다를 수 있음).
//     hover 상태는 CSS 상호작용이라 별도 prop 없음(selected hover→checked로만 반영).
//   - 라벨 속성 실명은 'right text'(공백 포함) — right text Boolean이 꺼진 사용은 label 제거.
// 발행: FIGMA_ACCESS_TOKEN=… npx figma connect publish --force
// 파서 제약 — URL·props는 리터럴만(변수·스프레드·as const 금지).
import figma from '@figma/code-connect';
import { Checkbox, CheckboxGroup } from './Checkbox';

// check box — 단일 체크박스(상태 6종 × 우측 라벨)
figma.connect(
  Checkbox,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7257-2441',
  {
    props: {
      checked: figma.enum('state', {
        'Selected default': true,
        'Selected hover': true,
        'Selected disabled': true,
      }),
      disabled: figma.enum('state', {
        'Unselected disabled': true,
        'Selected disabled': true,
      }),
      label: figma.string('right text'),
    },
    example: ({ checked, disabled, label }) => (
      <Checkbox checked={checked} disabled={disabled} label={label} />
    ),
  },
);

// check group — 체크박스 나열(gap 3~7 × direction)
figma.connect(
  CheckboxGroup,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7626-2874',
  {
    props: {
      direction: figma.enum('direction', { Horizontal: 'horizontal', Vertical: 'vertical' }),
      gap: figma.enum('gap', { '3': '3', '4': '4', '5': '5', '6': '6', '7': '7' }),
    },
    example: ({ direction, gap }) => (
      <CheckboxGroup
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
