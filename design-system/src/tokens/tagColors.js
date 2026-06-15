// 태그(Tag) 시멘틱 컬러 토큰
// Figma "solid/{blue|red|gray}-*" 변수 — type별 bg / text.
//   blue : bg blue 400 알파 16%(#0f85f229) / text blue 400(#0f85f2)
//   red  : bg red 400 알파 16%(#e74a4a29)  / text red 400(#e74a4a)
//   gray : bg gray 900 알파(#0d0d0d12)      / text gray 600(#3f3f3f)

import { baseColors } from './colors.js';

const b = baseColors.base;

export const tagColors = {
  'blue-bg':   b['blue-400-50'], // #0f85f229
  'blue-text': b.blue[400],      // #0f85f2
  'red-bg':    b['red-400-50'],  // #e74a4a29
  'red-text':  b.red[400],       // #e74a4a
  'gray-bg':   b['gray-900-25'], // #0d0d0d12
  'gray-text': b.gray[600],      // #3f3f3f
};
