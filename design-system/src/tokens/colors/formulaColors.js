// 스크리닝 수식(ScreeningFormula) 시멘틱 컬러 토큰
// Figma file: h9jZFkEHfcHUGok1TZjjlP — Formula (8383:112161)·함수 조건 색상표 (8384:114813),
//   변수 Formula/* 매핑. 함수 계열마다 고유 텍스트 컬러(2026-07-13 추가한 base 유채색이 이 용도).
//   default 아웃라인은 전 계열 공통(#e3e3e3), hover 아웃라인은 계열 색을 따른다.
//   ※ hover-logical/hover-evaluation 아웃라인은 Figma에서 미확인(사용 노드 없음) —
//     확인된 계열 패턴(aggregate=violet.400, score-limit=pink.400)을 따라 각 400으로 등록. 상이하면 조정.

import { baseColors } from '../colors.js';

const b = baseColors.base;

export const formulaColors = {
  'default-bg': b.white,          // Formula/default bg
  'default-text': b.gray[900],    // #0d0d0d (설명 코멘트 텍스트 — Formula/default-text)
  'hover-bg': b.gray[25],         // #fafafa (2026-07-16 사용자 지정 — hover 시 수식 배경)
  'default-outline': b.gray[100], // Formula/default * outline (#e3e3e3, 전 계열 공통)
  parentheses: b.gray[150],       // 괄호 ( ) — #c9c9c9
  comparison: b.gray[900],        // 비교 연산자 ==, 콤마 — #0d0d0d
  // 함수 계열 텍스트 컬러 (Formula/{family} functions)
  logical: b.green[400],          // AND, OR — #0daf4e
  conditional: b.blue[400],       // IF — #0f85f2
  aggregate: b.violet[400],       // SUM, MAX, MIN, COUNTIF — #7c57ef
  'score-limit': b.pink[400],     // CAPMAX, CAPMIN — #f246b9
  evaluation: b.orange[400],      // FITBYSCORE, UNFITBYSCORE — #f06e2d
  // hover 아웃라인 (Formula/hover {family} outline) — 계열 색 추종
  'hover-logical-outline': b.green[400],     // (패턴 유추 — Figma 확인 시 조정)
  'hover-conditional-outline': b.blue[300],  // #41a2fd (IF만 300 — Figma 확정값)
  'hover-aggregate-outline': b.violet[400],  // #7c57ef (확정)
  'hover-score-limit-outline': b.pink[400],  // #f246b9 (확정)
  'hover-evaluation-outline': b.orange[400], // (패턴 유추 — Figma 확인 시 조정)
  // '조건 추가' dashed 드롭 존 (Formula/add default|drop * — FormulaAdd 8384:113414, 카드 드롭 대상)
  'add-text': b.gray[300],         // #878787
  'add-bg': b.white,
  'add-outline': b.gray[150],      // #c9c9c9
  'add-drop-text': b.gray[900],    // #0d0d0d (드래그 중 위에 올렸을 때)
  'add-drop-bg': b.gray[100],      // #e3e3e3
  'add-drop-outline': b.gray[300], // #878787
  // compact(요약) 칩 — 파란 텍스트·연파랑 라인 (Figma compact 변형의 chip 값)
  'compact-chip-text': b.blue[400], // #0f85f2
  'compact-chip-line': b.blue[100], // #e6f3fe
};
