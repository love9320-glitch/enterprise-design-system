// 스크리닝 조건 카드(ScreeningConditionCard) 시멘틱 컬러 토큰
// Figma file: h9jZFkEHfcHUGok1TZjjlP — ConditionCard (8243:88380), 변수 condition-card/* 매핑.
//   값은 전부 기존 base 토큰(누락 0 — ask 불필요).
//   drop = 드래그 중 상태(파란 아웃라인·텍스트, bg는 hover와 공유 — Figma state3이 hover-card-bg 참조).

import { baseColors } from '../colors';

const b = baseColors.base;

export const conditionCardColors = {
  'default-card-bg':   b.white,      // #ffffff
  'default-card-line': b['gray-900-25'], // #0d0d0d12 (2026-07-16 — gray-900 알파 3단계, 배경 투영. 원값 gray.150→100→알파)
  'default-card-text': b.gray[900],  // #0d0d0d
  'hover-card-bg':     b.gray[25],   // #fafafa (blue.25 시도 후 원복 — 2026-07-16)
  'hover-card-line':   b['gray-900-75'], // #0d0d0d54 (2026-07-16 — gray-900 알파 5단계(33%), 배경 투영. 원값 gray.250)
  'hover-card-text':   b.blue[400],  // #0f85f2 (2026-07-16 — hover 시 grip·카드명 파랑. 원값 gray.900)
  'drop-outline':      b.blue[400],  // #0f85f2 (드래그 중 라인)
  'drop-text':         b.blue[400],  // #0f85f2 (드래그 중 텍스트·아이콘)
};
