// 칩(chip) 시멘틱 컬러 토큰
// Figma file: h9jZFkEHfcHUGok1TZjjlP — chip 컴포넌트 (state Default/hover/pressed × size 22 × color gray/red/blue/black)
//   chip/* 변수를 baseColors 경유로 정의. pressed는 Figma에서 default 토큰 재사용(별도 없음).
//   color별로 default/hover 두 상태를 둔다(text=icon 동일 값).

import { baseColors } from '../colors.js';

const b = baseColors.base;

// (defText, defBg, defLine, hovText, hovBg, hovLine) — icon은 text와 동일 값이라 별도로 두지 않고 상속시킨다.
const make = (defText, defBg, defLine, hovText, hovBg, hovLine) => ({
  'default-text': defText,
  'default-icon': defText,
  'default-bg': defBg,
  'default-line': defLine,
  'hover-text': hovText,
  'hover-icon': hovText,
  'hover-bg': hovBg,
  'hover-line': hovLine,
});

export const chipColors = {
  // gray  : text/icon gray900 · bg white · line gray100 / hover bg gray50 · line gray150
  gray: make(b.gray[900], b.white, b.gray[100], b.gray[900], b.gray[50], b.gray[150]),
  // red   : text/icon red400 · bg white · line red100 / hover bg red50 · line red150
  red: make(b.red[400], b.white, b.red[100], b.red[400], b.red[50], b.red[150]),
  // blue  : text/icon blue400 · bg white · line blue100 / hover bg blue50 · line blue150
  blue: make(b.blue[400], b.white, b.blue[100], b.blue[400], b.blue[50], b.blue[150]),
  // black : text/icon white · bg/line gray500 / hover text/icon gray150 · bg/line gray400
  black: make(b.white, b.gray[500], b.gray[500], b.gray[150], b.gray[400], b.gray[400]),
};
