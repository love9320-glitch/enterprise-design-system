// 스크리닝 빌더 영역(AddFormulaArea) 시멘틱 컬러 토큰
// Figma file: h9jZFkEHfcHUGok1TZjjlP — AddFormulaArea (8391:127196), 변수 builder-area/* 매핑.
//   수식 존의 카드 드롭 대상 스트립("+ 다른 조건을 여기에 끌어다 놓기"). Default/hover(드래그 오버) 2상태.
//   값은 전부 기존 base 토큰(누락 0).

import { baseColors } from '../colors';

const b = baseColors.base;

export const builderAreaColors = {
  'add-default-bg': b.gray[25],       // #fafafa
  'add-default-outline': b.gray[150], // #c9c9c9 (dashed)
  'add-default-text': b.gray[900],    // #0d0d0d
  'add-hover-bg': b.gray[100],        // #e3e3e3 (드래그 오버)
  'add-hover-outline': b.gray[250],   // #999999
  // 빌더 전체(카드+수식 영역)를 감싸는 라인 박스(2026-07-16 사용자 지정 — 흰 bg·gray.100 라인)
  'box-bg': b.white,
  'box-line': b.gray[100],            // #e3e3e3 (박스 외곽선 + 카드↔빌더 구분선 공용)
  'card-area-bg': b.gray[25],         // #fafafa (조건 카드 영역 배경 — 2026-07-16 지정)
  // 수식 영역 고정 헤더 배경 — 위(흰색 100%)→아래(흰색 0%) 세로 그라디언트(2026-07-14 지시).
  // 스크롤 콘텐츠가 헤더 아래로 지나가며 점차 사라져 보인다.
  'header-fade-top': b.white,         // #ffffff (불투명)
  'header-fade-bottom': b['white-00'], // #ffffff00 (투명)
};
