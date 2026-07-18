// 사이드 내비게이션(SideNavigation) 시멘틱 컬러 토큰
// Figma file: h9jZFkEHfcHUGok1TZjjlP — side navigation button (8200:51452) / side navigation (8200:51519)
//   변수 add side navi/* 매핑. 값은 전부 기존 base 토큰(누락 0 — ask 불필요 판례).

import { baseColors } from '../colors';

const b = baseColors.base;

export const sideNavColors = {
  'default-text':  b.gray[600],        // #3f3f3f (add side navi/default text·icon)
  'default-icon':  b.gray[600],
  'hover-text':    b.gray[900],        // #0d0d0d (hover text·icon)
  'hover-icon':    b.gray[900],
  'hover-bg':      b['gray-900-25'],   // #0d0d0d12 (hover bg)
  'select-text':   b.blue[400],        // #0f85f2 (select text·icon)
  'select-icon':   b.blue[400],
  'select-bg':     b['blue-400-50'],   // #0f85f229 (select bg)
  'disabled-text': b.gray[150],        // #c9c9c9 (disabled text·icon)
  'disabled-icon': b.gray[150],
  'right-line':    b.gray[100],        // #e3e3e3 (컨테이너 우측 구분선, add side navi/right line)
};
