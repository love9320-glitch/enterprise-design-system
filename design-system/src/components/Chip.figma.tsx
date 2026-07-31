// Chip Code Connect 매핑(2026-07-30) — chip SET(7977:31602).
//   - color 변형 8종(gray/red/blue/black/green/violet/pink/orange) → color prop.
//   - state(Default/hover/pressed)는 CSS 상태, size는 22 단일이라 매핑 생략.
//   - Figma 칩의 X 아이콘은 onRemove 콜백이 있을 때 노출되는 제거형이라 예시에 포함.
// 발행: main 머지 시 자동(.github/workflows/figma-code-connect.yml)
// 파서 제약 — URL·props는 리터럴만(변수·스프레드·as const 금지).
import figma from '@figma/code-connect';
import { Chip } from './Chip';

figma.connect(
  Chip,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7977-31602',
  {
    props: {
      color: figma.enum('color', {
        Gray: 'gray',
        Red: 'red',
        Blue: 'blue',
        Black: 'black',
        Green: 'green',
        Violet: 'violet',
        Pink: 'pink',
        Orange: 'orange',
      }),
    },
    example: ({ color }) => (
      <Chip color={color} onRemove={() => {}}>
        칩 텍스트
      </Chip>
    ),
  },
);
