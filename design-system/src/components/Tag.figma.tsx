// Tag·NewTag Code Connect 매핑(2026-08-01) — tag SET(7206:9375, color 8종)·new tag SET(8187:40848, 3종).
//   - 변형 값은 첫 글자 대문자 규칙(Blue/Green/…) — 코드 prop은 소문자 API 그대로.
//   - width(hug/fill)는 Figma 변형에 없어 기본값(hug) 사용(규칙 11 — 코드 축소 없음).
// 발행: main 머지 시 자동(.github/workflows/figma-code-connect.yml)
// 파서 제약 — URL·props는 리터럴만(변수·스프레드·as const 금지).
import figma from '@figma/code-connect';
import { NewTag, Tag } from './Tag';

// tag — 작은 칩 라벨(색 8종)
figma.connect(
  Tag,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7206-9375',
  {
    props: {
      color: figma.enum('color', {
        Blue: 'blue',
        Red: 'red',
        Gray: 'gray',
        Black: 'black',
        Green: 'green',
        Violet: 'violet',
        Pink: 'pink',
        Orange: 'orange',
      }),
    },
    example: ({ color }) => <Tag color={color}>태그</Tag>,
  },
);

// new tag — 원형 N 뱃지(색 3종)
figma.connect(
  NewTag,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=8187-40848',
  {
    props: {
      color: figma.enum('color', {
        Blue: 'blue',
        Red: 'red',
        Black: 'black',
      }),
    },
    example: ({ color }) => <NewTag color={color} />,
  },
);
