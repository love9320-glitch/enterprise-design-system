// Figma "폰트 시스템" (node 943:35279)에서 추출한 타이포그래피 토큰
// 폰트 패밀리: Pretendard (Regular 400 / SemiBold 600)
// 키는 Figma의 "사이즈/행간" 표기를 그대로 따릅니다 (예: 14 → 14px, 행간 24px)

export const fontFamily = {
  pretendard: ['Pretendard Variable', 'Pretendard', 'system-ui', 'sans-serif'],
};

// Tailwind fontSize 확장 포맷: [fontSize, { lineHeight, letterSpacing }]
export const fontSize = {
  12: ['12px', { lineHeight: '20px', letterSpacing: '-0.24px' }],
  13: ['13px', { lineHeight: '22px', letterSpacing: '-0.26px' }],
  14: ['14px', { lineHeight: '24px', letterSpacing: '-0.28px' }],
  15: ['15px', { lineHeight: '26px', letterSpacing: '-0.30px' }],
  16: ['16px', { lineHeight: '28px', letterSpacing: '-0.32px' }],
  18: ['18px', { lineHeight: '30px', letterSpacing: '-0.36px' }],
  20: ['20px', { lineHeight: '32px', letterSpacing: '-0.40px' }],
};

// 두께는 Tailwind 기본 유틸리티로 매핑됩니다: font-normal(400) / font-semibold(600)
