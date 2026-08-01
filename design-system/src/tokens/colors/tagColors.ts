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
  // 유채 4색 확장(2026-08-01, Figma tag 8색) — blue/red와 동일 사다리(bg=400 알파 16%, text=400)
  'green-bg':    b['green-400-50'],  // #0daf4e29
  'green-text':  b.green[400],       // #0daf4e
  'violet-bg':   b['violet-400-50'], // #7c57ef29
  'violet-text': b.violet[400],      // #7c57ef
  'pink-bg':     b['pink-400-50'],   // #f246b929
  'pink-text':   b.pink[400],        // #f246b9
  'orange-bg':   b['orange-400-50'], // #f06e2d29
  'orange-text': b.orange[400],      // #f06e2d
};
