// Switch Code Connect 매핑(2026-07-29) — switch SET(7370:115).
//   - 변형 속성 'state'(2026-07-29 사용자가 Property 1→state 개명·오타 수정 — checkbox/radio와 통일).
//     hover 상태는 CSS 상호작용이라 별도 prop 없음(selected hover→checked로만 반영).
//   - 라벨 실명 'right text'(공백 포함).
// 발행: FIGMA_ACCESS_TOKEN=… npx figma connect publish --force
// 파서 제약 — URL·props는 리터럴만(변수·스프레드·as const 금지).
import figma from '@figma/code-connect';
import { Switch } from './Switch';

figma.connect(
  Switch,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7370-115',
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
      <Switch checked={checked} disabled={disabled} label={label} />
    ),
  },
);
