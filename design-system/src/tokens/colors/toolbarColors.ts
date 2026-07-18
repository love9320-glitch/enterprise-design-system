// 툴바(ToolBar) 시멘틱 컬러 토큰
// Figma file: h9jZFkEHfcHUGok1TZjjlP — tool bar (8389:126993).
//   체크 선택 시 나타나는 플로팅 액션 툴바. 배경은 위(white)→아래(gray.50) 그라데이션,
//   라인은 gray-900 알파 50(배경 투영). 값은 전부 기존 base 토큰(누락 0).

import { baseColors } from '../colors';

const b = baseColors.base;

export const toolbarColors = {
  'bg-top': b.white,            // 그라데이션 위쪽 (Figma to-white)
  'bg-bottom': b.gray[50],      // 그라데이션 아래쪽 #f2f2f2 (Figma from-gray/50)
  line: b['gray-900-50'],       // #0d0d0d29 (알파 — 배경 투영)
};
