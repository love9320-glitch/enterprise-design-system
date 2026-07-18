// 라디오 버튼(Radio) 시멘틱 컬러 토큰
// Figma "check/*" 변수 — 상태별 circle 채움(bg) · point(가운데 점) · outline(hover ring) · text.
//   unselected: 회색 채움 / selected: blue 채움 + 흰 점(point)
//   hover: 바깥 ring 색 표시 / disabled: 연하게(selected disabled는 연한 blue + blue 점)
// 값은 Checkbox와 동일한 check/* 토큰을 공유하지만, 컴포넌트별 컬러 파일 관례를 따라 별도 정의한다.

import { baseColors } from '../colors';

const b = baseColors.base;

export const radioColors = {
  // unselected — circle 채움(bg)
  'unselected-bg':   b['gray-900-75'],   // #0d0d0d54
  'hover-outline':   b['gray-900-100'],  // #0d0d0d7a (hover ring)
  'disabled-bg':     b['gray-900-25'],   // #0d0d0d12
  // selected — circle 채움(bg)
  'selected-bg':            b.blue[400],        // #0f85f2
  'selected-hover-outline': b['blue-400-200'],  // #0f85f2a6 (hover ring)
  'selected-disabled-bg':   b['blue-400-50'],   // #0f85f229
  // 가운데 점(point)
  'point':          b.white,     // #ffffff (selected default/hover)
  'disabled-point': b.blue[400], // #0f85f2 (selected disabled)
  // 라벨
  'text':          b.gray[900], // #0d0d0d
  'disabled-text': b.gray[300], // #878787
};
