// Divider Code Connect 매핑(2026-08-02) — Divider SET(7970:17558, Direction×color).
// 발행: main 머지 시 자동(.github/workflows/figma-code-connect.yml)
// 파서 제약 — URL·props는 리터럴만(변수·스프레드·as const 금지).
import figma from '@figma/code-connect';
import { Divider } from './Divider';

figma.connect(
  Divider,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7970-17558',
  {
    props: {
      direction: figma.enum('Direction', {
        Horizontal: 'horizontal',
        Vertical: 'vertical',
      }),
      color: figma.enum('color', {
        Subtle: 'subtle',
        Default: 'default',
        Strong: 'strong',
      }),
    },
    example: ({ direction, color }) => <Divider direction={direction} color={color} />,
  },
);
