// Tooltip Code Connect 매핑(2026-07-29) — tooltip SET(7202:8648).
//   - type 변형: error / normal (2026-07-29 Figma 오타 'errer' 수정됨).
// 발행: main 머지 시 자동(.github/workflows/figma-code-connect.yml)
// 파서 제약 — URL·props는 리터럴만(변수·스프레드·as const 금지).
import figma from '@figma/code-connect';
import { Tooltip } from './Tooltip';

figma.connect(
  Tooltip,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7202-8648',
  {
    props: {
      variant: figma.enum('type', { Error: 'error', Normal: 'normal' }),
    },
    example: ({ variant }) => <Tooltip variant={variant}>안내 문구</Tooltip>,
  },
);
