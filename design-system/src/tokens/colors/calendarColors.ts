// 캘린더(DatePicker) 날짜 셀 시멘틱 컬러 토큰
// Figma file: h9jZFkEHfcHUGok1TZjjlP — date picker / calendar day button (node 7592:3061)
//   day(기본)·muted(다른 달)·today·select(선택/범위 끝)·range(범위 안) 상태별 색을
//   baseColors 경유로 정의한다(하드코딩 금지).
import { baseColors } from '../colors.js';

const b = baseColors.base;

export const calendarColors = {
  // 기본(선택 가능한 이번 달 날짜)
  'day-bg':   b.white,      // #ffffff
  'day-text': b.gray[900],  // #0d0d0d
  'hover-bg': b.gray[50],   // #f2f2f2 — 기본 날짜 hover(List hover와 동일)
  // 다른 달 날짜(흐림)
  'muted-text': b.gray[150], // #c9c9c9
  // 오늘
  'today-bg':   b.gray[500], // #505050
  'today-text': b.white,     // #ffffff
  // 선택 / 범위 시작·끝
  'selected-bg':   b.blue[400], // #0f85f2
  'selected-text': b.white,     // #ffffff
  // 범위 안(start~end 사이)
  'range-bg':   b.blue[100],  // #e6f3fe
  'range-text': b.blue[400],  // #0f85f2
};
