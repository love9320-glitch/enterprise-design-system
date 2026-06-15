// 버튼 시멘틱 컬러 토큰
// Figma file: h9jZFkEHfcHUGok1TZjjlP
//   Fill  → node 7057:6710  (변수명: fill/gray-*)
//   Ghost → node 7060:6712  (변수명: ghost/gray-*)
//   Line  → node 7057:6711  (변수명: line/gray-*)

import { baseColors } from './colors.js';

const b = baseColors.base;

export const buttonColors = {
  fill: {
    'default-bg':  b.gray[900],         // fill/gray default bg    → #0d0d0d
    'default-fg':  b.white,             // fill/gray default text  → #ffffff
    'hover-bg':    b['gray-900-200'],   // fill/gray hover bg      → #0d0d0da6
    'disabled-bg': b['gray-900-50'],    // fill/gray disableld bg  → #0d0d0d29
    'disabled-fg': b.gray[300],         // fill/gray disabled text → #878787
  },
  ghost: {
    'default-fg':  b.gray[900],         // ghost/gray default text → #0d0d0d
    'hover-bg':    b['gray-900-25'],    // ghost/gray hover bg     → #0d0d0d12
    'disabled-bg': b['gray-900-50'],    // ghost/gray disableld bg → #0d0d0d29
    'disabled-fg': b.gray[300],         // ghost/gray disabled text → #878787
    'select-bg':   b.gray[400],         // ghost/gray select bg    → #6a6a6a (선택/현재 항목)
    'select-text': b.white,             // ghost/gray select text  → #ffffff
    'pagination-fg': b.gray[300],       // ghost/gray default text (pagination) → #878787
                                        // 페이지네이션 번호 기본색(연함) — hover/pressed 시 default-fg로 진해짐
  },
  line: {
    'default-bg':   b.white,            // line/gray default bg    → #ffffff
    'default-fg':   b.gray[900],        // line/gray default text  → #0d0d0d
    'default-line': b.gray[150],        // line/gray default line  → #c9c9c9
    'hover-bg':     b['gray-900-25'],   // line/gray hover bg      → #0d0d0d12
    'hover-line':   b.gray[250],        // line/gray hover line    → #999999
    'disabled-bg':  b['gray-900-50'],   // line/gray disableld bg  → #0d0d0d29
    'disabled-fg':  b.gray[300],        // line/gray disabled text → #878787
    'disabled-line':b['gray-900-75'],   // line/gray disableld line → #0d0d0d54
  },
};
