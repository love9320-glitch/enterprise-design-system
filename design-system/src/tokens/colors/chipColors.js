// 칩(chip) 시멘틱 컬러 토큰
// Figma file: h9jZFkEHfcHUGok1TZjjlP — chip 컴포넌트 (state Default/hover/pressed × size 22)
//   chip/* 변수를 baseColors 경유로 정의. pressed는 Figma에서 default 토큰 재사용(별도 없음).

import { baseColors } from '../colors.js';

const b = baseColors.base;

export const chipColors = {
  'default-text': b.gray[900], // #0d0d0d
  'default-icon': b.gray[900], // #0d0d0d
  'default-bg': b.white,       // #ffffff
  'default-line': b.gray[100], // #e3e3e3
  'hover-text': b.gray[900],   // #0d0d0d
  'hover-icon': b.gray[900],   // #0d0d0d
  'hover-bg': b.gray[50],      // #f2f2f2
  'hover-line': b.gray[150],   // #c9c9c9
};
