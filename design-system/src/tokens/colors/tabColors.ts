// 탭(Tabs) 시멘틱 컬러 토큰 — Figma "tab *" 변수 (node 7371:3233)
//   default: 회색 텍스트 / hover·select: 진한 텍스트 + 하단 underline
//   disabled: 연한 회색 / group: 그룹 하단 구분선
// 색은 base 그레이를 경유해 정의(하드코딩 금지).

import { baseColors } from '../colors.js';

const b = baseColors.base;

export const tabColors = {
  'default-text':    b.gray[300], // #878787 (미선택)
  'hover-text':      b.gray[900], // #0d0d0d
  'selected-text':     b.gray[900], // #0d0d0d (선택)
  'disabled-text':   b.gray[150], // #c9c9c9 (비활성)
  'selected-underline': b.gray[900], // #0d0d0d (선택 하단 2px)
  'hover-underline':  b.gray[900], // #0d0d0d (hover 하단 2px)
  'group-underline':  b.gray[100], // #e3e3e3 (그룹 하단 1px)
};
