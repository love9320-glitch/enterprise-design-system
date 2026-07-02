// 테이블(Table) 시멘틱 컬러 토큰
// Figma file: h9jZFkEHfcHUGok1TZjjlP — table (node 7257:1925)
//   header row bg / table inline(셀 구분선) / table outline(외곽선) / body row bg 변수를
//   baseColors 경유로 정의. 텍스트는 font-icon-5(메인), 스크롤 thumb는 ScrollArea(listColors) 재사용.
//   row-hover-bg는 Figma "table body hover row" 상태값으로, list-page 규칙(gray-25)과 동일 톤.

import { baseColors } from '../colors.js';

const b = baseColors.base;

export const tableColors = {
  'header-bg':    b['gray-900-25'], // #0d0d0d12 — 알파 배경(헤더 행, 2026-07-02 gray.50→gray-900-25)
  'cell-line':    b.gray[100], // #e3e3e3 (셀 사이 구분선)
  'outline':      b.gray[100], // #e3e3e3 (테이블 외곽선)
  'row-bg':       b.white,     // #ffffff (바디 행 기본 배경)
  'row-hover-bg': b.gray[25],  // #fafafa (행 hover 배경)
};
