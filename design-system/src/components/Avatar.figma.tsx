// Avatar Code Connect 매핑(2026-07-31) — avater SET(8942:19658, Figma 세트명 오타 그대로).
//   - type: image→src 예시 / text→initial. size 24~56(코드에서 16 제외 — 2026-07-31 지시,
//     Figma 16 변형은 size 미매칭으로 기본 32 스니펫 폴백. Figma에서 16 삭제 시 자연 정리).
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
    variant: { type: 'Image' },
    props: {
      size: figma.enum('size', {
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
    variant: { type: 'Text' },
    props: {
      size: figma.enum('size', {
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
