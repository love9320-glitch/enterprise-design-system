// 칩(chip) 시멘틱 컬러 토큰
// Figma file: h9jZFkEHfcHUGok1TZjjlP — chip 컴포넌트 (state Default/hover/pressed × size 22 × color gray/red/blue/black)
//   chip/* 변수를 baseColors 경유로 정의. pressed는 Figma에서 default 토큰 재사용(별도 없음).
//   color별로 default/hover 두 상태를 둔다(text=icon 동일 값).

import { baseColors } from '../colors';

const b = baseColors.base;

// (defText, defBg, defLine, hovText, hovBg, hovLine) — icon은 text와 동일 값이라 별도로 두지 않고 상속시킨다.
const make = (defText: string, defBg: string, defLine: string, hovText: string, hovBg: string, hovLine: string) => ({
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
  // ── 함수 계열 대응 색(2026-07-15 추가) — 수식 함수 컬러(formula-*)와 짝: green=AND·OR /
  //    violet=SUM계열 / pink=CAPMAX계열 / orange=FITBYSCORE계열 (blue=IF는 기존). 사다리 동일(400/100/50/150).
  green: make(b.green[400], b.white, b.green[100], b.green[400], b.green[50], b.green[150]),
  violet: make(b.violet[400], b.white, b.violet[100], b.violet[400], b.violet[50], b.violet[150]),
  pink: make(b.pink[400], b.white, b.pink[100], b.pink[400], b.pink[50], b.pink[150]),
  orange: make(b.orange[400], b.white, b.orange[100], b.orange[400], b.orange[50], b.orange[150]),
};
