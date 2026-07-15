// 디바이더(구분선) 시멘틱 컬러 토큰
// Figma file: h9jZFkEHfcHUGok1TZjjlP — Divider 컴포넌트 (color variant subtle/default/strong)
//   divider/* 변수를 baseColors(그레이 스케일)를 경유해 정의한다.

import { baseColors } from '../colors.js';

const b = baseColors.base;

export const dividerColors = {
  subtle: b.gray[50],   // #f2f2f2
  default: b.gray[100], // #e3e3e3
  strong: b.gray[150],  // #c9c9c9
};
