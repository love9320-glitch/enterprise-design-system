// 모달(Modal) 시멘틱 컬러 토큰
// Figma file: h9jZFkEHfcHUGok1TZjjlP — modal (node 7349:1758474)
//   overlay-bg(딤 배경) / inline(헤더·바디·푸터 사이 1px 구분선) / outline(ModalBox 외곽선) /
//   panel-bg(헤더·바디·푸터 배경)을 baseColors 경유로 정의한다.
//   타이틀·본문 텍스트는 font-icon(semanticColors), 푸터 버튼은 Button(buttonColors) 재사용.

import { baseColors } from './colors.js';

const b = baseColors.base;

export const modalColors = {
  overlay:    b['gray-900-25'], // #0d0d0d12 (rgba 13,13,13,0.07) — 딤 배경
  inline:     b.gray[100],      // #e3e3e3 — ModalBox 배경(1px gap이 구분선으로 비침)
  outline:    b['gray-900-50'], // #0d0d0d29 — ModalBox 외곽선(1px)
  'panel-bg': b.white,          // #ffffff — 헤더·바디·푸터 배경
};
