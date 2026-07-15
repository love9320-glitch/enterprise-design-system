// Figma "폰트 시스템" (node 943:35279)에서 추출한 타이포그래피 토큰
// 폰트 패밀리: Pretendard (Regular 400 / SemiBold 600)
// 키는 Figma의 "사이즈/행간" 표기를 그대로 따릅니다 (예: 14 → 14px, 행간 24px)

export const fontFamily = {
  pretendard: ['Pretendard Variable', 'Pretendard', 'system-ui', 'sans-serif'],
};

import { lineHeight } from './lineHeight.js';

// Tailwind fontSize 확장 포맷: [fontSize, { lineHeight, letterSpacing }]
// 기본 행간은 lineHeight 토큰을 참조한다(값은 한 곳=lineHeight.js에서만 정의).
export const fontSize = {
  12: ['12px', { lineHeight: lineHeight[20], letterSpacing: '-0.24px' }],
  13: ['13px', { lineHeight: lineHeight[22], letterSpacing: '-0.26px' }],
  14: ['14px', { lineHeight: lineHeight[24], letterSpacing: '-0.28px' }],
  15: ['15px', { lineHeight: lineHeight[26], letterSpacing: '-0.30px' }],
  16: ['16px', { lineHeight: lineHeight[28], letterSpacing: '-0.32px' }],
  18: ['18px', { lineHeight: lineHeight[30], letterSpacing: '-0.36px' }],
  20: ['20px', { lineHeight: lineHeight[32], letterSpacing: '-0.40px' }],
};

// 두께는 Tailwind 기본 유틸리티로 매핑됩니다: font-normal(400) / font-semibold(600)
