// 옵션 목록(List/ListGroup/ListEmpty/PopoverMenu) 시멘틱 컬러 토큰
// Figma file: h9jZFkEHfcHUGok1TZjjlP — option list (node 7207:1652)
//   list/* , empty/* , popover-menu/* , scroll(default-bar) 변수를 baseColors 경유로 정의.

import { baseColors } from '../colors';

const b = baseColors.base;

export const listColors = {
  // list 행 상태별
  'default-bg':   b.white,      // #ffffff
  'default-text': b.gray[900],  // #0d0d0d
  'default-icon': b.gray[900],  // #0d0d0d
  'hover-bg':     b.gray[50],   // #f2f2f2
  'pressed-bg':   b.white,      // #ffffff (default와 동일 — 눌림은 순간 효과)
  'selected-text':  b.blue[400],  // #0f85f2 (선택 시 텍스트 파란색)
  'selected-icon':  b.blue[400],  // #0f85f2 (선택 시 chevron 파란색)
  'disabled-text': b.gray[150], // #c9c9c9
  'disabled-icon': b.gray[150], // #c9c9c9
  // list group
  'group-bg': b.white,
  // empty
  'empty-bg':   b.white,        // #ffffff
  'empty-text': b.gray[300],    // #878787
  // popover menu
  'popover-bg':      b.gray[100], // #e3e3e3
  'popover-outline': b['gray-900-75'], // #0d0d0d54 (gray.900 알파 75)
  // scroll thumb (default / hover)
  'scroll-bar':       b['gray-900-50'], // #0d0d0d29
  'scroll-bar-hover': b['gray-900-75'], // #0d0d0d54
  // scroll thumb — light(어두운 배경 위) 변형
  'scroll-bar-light':       b['white-75'], // #ffffff54
  'scroll-bar-light-hover': b['white-100'], // #ffffff7a
};
