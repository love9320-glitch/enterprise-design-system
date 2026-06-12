// 태그(Tag) 시멘틱 컬러 토큰
// Figma "solid/blue-*" 변수 — 현재 blue 타입만. 추후 색상 타입이 추가될 수 있다.
//   blue-bg    → blue 400 알파 16% (#0f85f229)
//   blue-text  → blue 400 (#0f85f2)

import { baseColors } from './colors.js';

const b = baseColors.base;

export const tagColors = {
  'blue-bg':   b['blue-400-50'], // #0f85f229
  'blue-text': b.blue[400],      // #0f85f2
};
