// 버튼 시멘틱 컬러 토큰
// Figma file: h9jZFkEHfcHUGok1TZjjlP
//   Fill  → node 7057:6710  (변수명: fill/gray-*)
//   Ghost → node 7060:6712  (변수명: ghost/gray-*)
//   Line  → node 7057:6711  (변수명: line/gray-*)

import { baseColors } from '../colors';

const b = baseColors.base;

export const buttonColors = {
  fill: {
    'default-bg':  b.gray[900],         // fill/gray default bg    → #0d0d0d
    'default-fg':  b.white,             // fill/gray default text  → #ffffff
    'hover-bg':    b['gray-900-200'],   // fill/gray hover bg      → #0d0d0da6
    'disabled-bg': b['gray-900-25'],    // fill/gray disabled bg  → #0d0d0d12 (2026-07-02 900-50→900-25)
    'disabled-fg': b.gray[150],         // fill/gray disabled text/icon → #c9c9c9 (=font-icon-2)
  },
  ghost: {
    'default-fg':  b.gray[900],         // ghost/gray default text → #0d0d0d
    'hover-bg':    b['gray-900-25'],    // ghost/gray hover bg     → #0d0d0d12
    'disabled-bg': b['gray-900-25'],    // ghost/gray disabled bg → #0d0d0d12 (2026-07-02 900-50→900-25)
    'disabled-fg': b.gray[150],         // ghost/gray disabled text/icon → #c9c9c9 (=font-icon-2)
    'selected-bg':   b.gray[400],         // ghost/gray select bg    → #6a6a6a (선택/현재 항목)
    'selected-text': b.white,             // ghost/gray select text  → #ffffff
    'pagination-fg': b.gray[300],       // ghost/gray default text (pagination) → #878787
                                        // 페이지네이션 번호 기본색(연함) — hover/pressed 시 default-fg로 진해짐
  },
  line: {
    'default-bg':   b.white,            // line/gray default bg    → #ffffff
    'default-fg':   b.gray[900],        // line/gray default text  → #0d0d0d
    'default-line': b.gray[150],        // line/gray default line  → #c9c9c9
    'hover-bg':     b['gray-900-25'],   // line/gray hover bg      → #0d0d0d12
    'hover-line':   b.gray[250],        // line/gray hover line    → #999999
    'disabled-bg':  b['gray-900-25'],   // line/gray disabled bg  → #0d0d0d12 (2026-07-02 900-50→900-25)
    'disabled-fg':  b.gray[150],        // line/gray disabled text/icon → #c9c9c9 (=font-icon-2)
    'disabled-line':b['gray-900-75'],   // line/gray disableld line → #0d0d0d54
  },
  // underline(밑줄 텍스트 버튼) 색 변형(2026-07-15) — black(기본, 기존 색)=gray900,
  // 유채색 6종은 칩 컬러와 짝(각 400). gray는 제외(사용자 지정).
  underline: {
    'black-fg':  b.gray[900],
    'red-fg':    b.red[400],
    'blue-fg':   b.blue[400],
    'green-fg':  b.green[400],
    'violet-fg': b.violet[400],
    'pink-fg':   b.pink[400],
    'orange-fg': b.orange[400],
  },
};
