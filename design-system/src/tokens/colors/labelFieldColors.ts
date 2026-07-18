// 라벨(label) 시멘틱 컬러 토큰
// Figma file: h9jZFkEHfcHUGok1TZjjlP — label 컴포넌트 (node 7942:2175)
//   label-field/* 변수(default text / required mark / disabled text)를
//   baseColors를 경유해 정의한다.

import { baseColors } from '../colors';

const b = baseColors.base;

export const labelFieldColors = {
  'default-text':  b.gray[900], // #0d0d0d — 기본 라벨 텍스트
  'required-mark': b.red[400],  // #e74a4a — 필수 표시(점)
  'disabled-text': b.gray[150], // #c9c9c9 — 비활성 라벨 텍스트
  'helper-text':   b.gray[600], // #3f3f3f — Field 헬퍼(description) 텍스트
};
