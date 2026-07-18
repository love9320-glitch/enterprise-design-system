// 조건 정렬 슬롯(ConditionOrderSlot) 시멘틱 컬러 토큰
// Figma file: h9jZFkEHfcHUGok1TZjjlP — ConditionSlotCard (8219:80364) / ConditionOrderSlot (8219:80583)
//   변수 ConditionOrderSlot/* 매핑. 값은 전부 기존 base 토큰(누락 0 — ask 불필요 판례).
//   pressed = 드래그 앤 드롭 중 유지되는 상태(blue.400 라인·텍스트).

import { baseColors } from '../colors';

const b = baseColors.base;

export const conditionOrderSlotColors = {
  'card-default-text': b.gray[900],  // #0d0d0d (default card text·icon)
  'card-default-icon': b.gray[900],
  'card-default-bg':   b.white,      // #ffffff
  'card-default-line': b.gray[150],  // #c9c9c9
  'card-hover-text':   b.gray[900],  // #0d0d0d
  'card-hover-icon':   b.gray[900],
  'card-hover-bg':     b.gray[25],   // #fafafa
  'card-hover-line':   b.gray[250],  // #999999
  'card-pressed-text': b.blue[400],  // #0f85f2 (드래그 중)
  'card-pressed-icon': b.blue[400],
  'card-pressed-bg':   b.blue[25],   // #f6fafe (2026-07-07 재조정 — blue.50 → blue.25)
  'card-pressed-line': b.blue[400],
  'slot-bg':           b.gray[50],   // #f2f2f2 (컨테이너 슬롯 배경)
};
