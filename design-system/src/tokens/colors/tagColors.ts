// 태그(Tag) 시멘틱 컬러 토큰
// Figma "solid/*" 변수(solid/bg · solid/title) — color별 bg / text.
//   blue  : bg blue 400 알파 16%(#0f85f229) / text blue 400(#0f85f2)
//   red   : bg red 400 알파 16%(#e74a4a29)  / text red 400(#e74a4a)
//   gray  : bg gray 900 알파(#0d0d0d12)      / text gray 600(#3f3f3f)
//   black : bg gray 500 솔리드(#505050)      / text white(#ffffff)  ← Figma 변형명 'color4'
//           (Chip black과 동일 값. Figma 변형명은 추후 black으로 정리 권장)

import { baseColors } from '../colors';

const b = baseColors.base;

export const tagColors = {
  'blue-bg':   b['blue-400-50'], // #0f85f229
  'blue-text': b.blue[400],      // #0f85f2
  'red-bg':    b['red-400-50'],  // #e74a4a29
  'red-text':  b.red[400],       // #e74a4a
  'gray-bg':   b['gray-900-25'], // #0d0d0d12
  'gray-text': b.gray[600],      // #3f3f3f
  'black-bg':   b.gray[500],     // #505050
  'black-text': b.white,         // #ffffff
};
