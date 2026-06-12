// 텍스트필드(검색바·인풋) 시멘틱 컬러 토큰
// Figma file: h9jZFkEHfcHUGok1TZjjlP — 02_textfield (node 943:37773)
//   solid 타입의 상태별 bg / line / text / icon 변수(solid/*)와
//   에러 툴팁 변수(errer tooltip *)를 baseColors를 경유해 정의한다.
// 상태별 테두리는 컴포넌트에서 ring으로 구현하므로 line 토큰은 ring 색으로 사용.

import { baseColors } from './colors.js';

const b = baseColors.base;

export const textFieldColors = {
  // default — 값 없음, 인터랙션 없음
  'default-bg':   b['gray-900-25'], // #0d0d0d12
  'default-line': b['gray-900-00'], // #0d0d0d00 (투명)
  'default-text': b.gray[300],      // #878787 — placeholder
  // hover
  'hover-bg':   b['gray-900-25'],
  'hover-line': b['gray-900-200'],  // #0d0d0da6
  'hover-text': b.gray[300],
  // focused
  'focused-bg':   b['gray-900-00'], // 투명
  'focused-line': b['gray-900-200'],
  // filled — 값 있음
  'filled-bg':   b['gray-900-25'],
  'filled-line': b['gray-900-00'],
  'filled-text': b.gray[900],       // #0d0d0d — 입력된 텍스트
  // disabled
  'disabled-bg':   b['gray-900-25'],
  'disabled-line': b['gray-900-00'],
  'disabled-text': b.gray[150],     // #c9c9c9
  'disabled-icon': b.gray[150],
  // read only
  'readonly-bg':   b['gray-900-25'],
  'readonly-line': b['gray-900-00'],
  'readonly-text': b.gray[900],     // #0d0d0d (읽기는 진하게)
  'readonly-icon': b.gray[150],
  // error tooltip
  'error-tooltip-bg':   b.red[400], // #e74a4a
  'error-tooltip-text': b.white,    // #ffffff
};
