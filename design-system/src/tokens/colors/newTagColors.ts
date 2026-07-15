// 뉴 태그(NewTag) 시멘틱 컬러 토큰
// Figma file: h9jZFkEHfcHUGok1TZjjlP — new tag (node 8187:40848, 변수 new tag/bg·new tag/title)
//   원형 'N' 뱃지. color variant(blue/red/black)별 배경 + 공통 흰 텍스트.
//   값은 전부 기존 base 토큰 매핑(blue.400/red.400/gray.500/white) — 누락 0.

import { baseColors } from '../colors.js';

const b = baseColors.base;

export const newTagColors = {
  'title':    b.white,     // #ffffff — 'N' 텍스트(new tag/title)
  'blue-bg':  b.blue[400], // #0f85f2 (new tag/bg, color=blue)
  'red-bg':   b.red[400],  // #e74a4a (color=red)
  'black-bg': b.gray[500], // #505050 (color=black — Tag/Chip black과 동일 계열)
};
