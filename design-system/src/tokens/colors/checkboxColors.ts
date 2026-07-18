// 체크박스(Checkbox) 시멘틱 컬러 토큰
// Figma "check/*" 변수 — 상태별 box 채움(bg) · point(체크마크) · outline(hover ring) · text.
//   unselected: 회색 채움 / selected: blue 채움 + 흰 체크
//   hover: 바깥 ring 색 표시 / disabled: 연하게

import { baseColors } from '../colors';

const b = baseColors.base;

export const checkboxColors = {
  // unselected — box 채움(bg)
  'unselected-bg':   b['gray-900-75'],   // #0d0d0d54
  'hover-outline':   b['gray-900-100'],  // #0d0d0d7a (hover ring)
  'disabled-bg':     b['gray-900-25'],   // #0d0d0d12
  // selected — box 채움(bg)
  'selected-bg':            b.blue[400],        // #0f85f2
  'selected-hover-outline': b['blue-400-200'],  // #0f85f2a6 (hover ring)
  'selected-disabled-bg':   b['blue-400-50'],   // #0f85f229
  // 체크마크(point)
  'check':          b.white,     // #ffffff
  'disabled-check': b.blue[400], // #0f85f2 (selected disabled)
  // 라벨
  'text':          b.gray[900], // #0d0d0d
  'disabled-text': b.gray[300], // #878787
};
