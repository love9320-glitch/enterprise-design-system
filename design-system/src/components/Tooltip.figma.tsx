// Tooltip Code Connect 매핑(2026-07-29) — tooltip SET(7202:8648).
//   - type 변형: 'errer'(Figma 오타 그대로 매칭 — 수정 시 함께 갱신)→error / normal.
// 발행: main 머지 시 자동(.github/workflows/figma-code-connect.yml)
// 파서 제약 — URL·props는 리터럴만(변수·스프레드·as const 금지).
import figma from '@figma/code-connect';
import { Tooltip } from './Tooltip';

figma.connect(
  Tooltip,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7202-8648',
  {
    props: {
      variant: figma.enum('type', { errer: 'error', normal: 'normal' }),
    },
    example: ({ variant }) => <Tooltip variant={variant}>안내 문구</Tooltip>,
  },
);
