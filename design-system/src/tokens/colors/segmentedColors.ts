// 세그먼트 탭(SegmentedTabs) 시멘틱 컬러 토큰
// Figma file h9jZFkEHfcHUGok1TZjjlP — segmented tab button (8241:88277) / Segmented Tabs (8241:88288)
//   segmented/* 변수 매핑. 값은 전부 기존 base 토큰(누락 0 — ask 불필요).
import { baseColors } from '../colors.js';

const b = baseColors.base;

export const segmentedColors = {
  'tab-bg':        b.gray[50],   // #f2f2f2 (트랙 배경, segmented/tab bg)
  'select-bg':     b.white,      // #ffffff (선택 배경 pill, segmented/select bg)
  'select-line':   b['gray-900-10'], // #0d0d0d08 (선택 pill 1px 아웃라인 — 한 단계 더 투명, 2026-07-08 지시)
  'select-text':   b.gray[900],  // #0d0d0d (선택 탭 텍스트, segmented/select text)
  'unselect-text': b.gray[300],  // #878787 (미선택 텍스트, segmented/unselect text)
  'hover-text':    b.blue[400],  // #0f85f2 (hover 텍스트, segmented/hover text)
  'disabled-text': b.gray[150],  // #c9c9c9 (비활성 텍스트 — unselect보다 한 단계 옅게, DS 표준 disabled=font-icon-2, 2026-07-08)
};
