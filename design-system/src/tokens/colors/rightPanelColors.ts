// 라이트 패널(RightPanel) 시멘틱 컬러 토큰
// Figma file: h9jZFkEHfcHUGok1TZjjlP — Right Panel SET(8985:21064)의 변수 1:1 매핑.
//   헤더/바디/푸터 영역(bg) 사이 1px 갭으로 비치는 헤어라인(in-line)과 타이틀 색.

import { baseColors } from '../colors';

const b = baseColors.base;

export const rightPanelColors = {
  bg: b.white, // #ffffff — 헤더·바디·푸터 영역 배경 (Figma bg)
  line: b.gray[100], // #e3e3e3 — 영역 사이 1px 갭으로 비치는 헤어라인 (Figma in-line)
  'title-text': b.gray[900], // #0d0d0d — 헤더 타이틀 (Figma title-text)
};
