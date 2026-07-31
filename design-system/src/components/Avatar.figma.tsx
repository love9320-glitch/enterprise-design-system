// Avatar Code Connect 매핑(2026-07-31) — avater SET(8942:19658, Figma 세트명 오타 그대로).
//   - type: image→src 예시 / text→initial. size 6단(text는 Figma에 32만 있으나 코드는 전 사이즈 지원 — 규칙 11).
//   - state(Default/Hover/Pressed)는 CSS 상태라 매핑 제외. interactive 옵션은 코드 전용(기본 true).
// 발행: main 머지 시 자동(.github/workflows/figma-code-connect.yml)
// 파서 제약 — URL·props는 리터럴만(변수·스프레드·as const 금지).
import figma from '@figma/code-connect';
import { Avatar } from './Avatar';

// image 타입 — 사진 아바타
figma.connect(
  Avatar,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=8942-19658',
  {
    variant: { type: 'image' },
    props: {
      size: figma.enum('size', {
        '16': '16',
        '24': '24',
        '32': '32',
        '40': '40',
        '48': '48',
        '56': '56',
      }),
    },
    example: ({ size }) => <Avatar src="/user.jpg" alt="사용자" size={size} />,
  },
);

// text 타입 — 이니셜 아바타
figma.connect(
  Avatar,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=8942-19658',
  {
    variant: { type: 'text' },
    props: {
      size: figma.enum('size', {
        '16': '16',
        '24': '24',
        '32': '32',
        '40': '40',
        '48': '48',
        '56': '56',
      }),
    },
    example: ({ size }) => <Avatar initial="G" size={size} />,
  },
);
