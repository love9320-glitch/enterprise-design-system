// LNB 메뉴 시멘틱 컬러 토큰
// Figma file: h9jZFkEHfcHUGok1TZjjlP — menu(8843:8836) / menu group / LNB(8844:9329)
//   lnb/* 변수(default text / hover / select / disabled / category)를 baseColors 경유로 정의한다.
import { baseColors } from '../colors';

const b = baseColors.base;

export const lnbColors = {
  'title-text': b.black, // #000000 — 사이트 타이틀(DESIGN SYSTEM)
  'default-text': b.gray[900], // #0d0d0d — 기본 메뉴 텍스트
  'hover-text': b.gray[900], // #0d0d0d — hover/2depth click 텍스트(기본과 동일 값, 의미 분리)
  'select-text': b.blue[400], // #0f85f2 — 선택 메뉴 텍스트
  'disabled-text': b.gray[150], // #c9c9c9 — 비활성 메뉴 텍스트(아이콘 공용)
  'hover-bg': b['gray-900-25'], // #0d0d0d12(7%) — hover 배경
  'select-bg': b['blue-400-50'], // #0f85f229(16%) — 선택 배경
  'menu-category-text': b.gray[250], // #999999 — 메뉴 카테고리(그룹 타이틀)
};
