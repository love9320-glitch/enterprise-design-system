// Label·Field Code Connect 매핑(2026-08-01) — label SET(7942:2175) + field SET(7942:2299).
//   - label: size(12~16) × state(Default/Required/Disabled) × color(Black→default/Gray→gray).
//   - field: layout(Vertical/Horizontal) → direction. 컨트롤 슬롯은 Input 예시.
// 발행: main 머지 시 자동(.github/workflows/figma-code-connect.yml)
// 파서 제약 — URL·props는 리터럴만(변수·스프레드·as const 금지).
import figma from '@figma/code-connect';
import { Field } from './Field';
import { Input } from './Input';
import { Label } from './Label';

// label — 폼 라벨(사이즈 5단·필수 점·색 2종)
figma.connect(
  Label,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7942-2175',
  {
    props: {
      size: figma.enum('size', {
        '12': '12',
        '13': '13',
        '14': '14',
        '15': '15',
        '16': '16',
      }),
      required: figma.enum('state', { Required: true }),
      disabled: figma.enum('state', { Disabled: true }),
      color: figma.enum('color', { Black: 'default', Gray: 'gray' }),
    },
    example: ({ size, required, disabled, color }) => (
      <Label size={size} color={color} required={required} disabled={disabled}>
        라벨
      </Label>
    ),
  },
);

// field — 라벨+컨트롤 레이아웃(세로/가로)
figma.connect(
  Field,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7942-2299',
  {
    props: {
      direction: figma.enum('layout', {
        Vertical: 'vertical',
        Horizontal: 'horizontal',
      }),
    },
    example: ({ direction }) => (
      <Field label="라벨" required direction={direction}>
        <Input width="100%" placeholder="텍스트를 입력하세요" />
      </Field>
    ),
  },
);
