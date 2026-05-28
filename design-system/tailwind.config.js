/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Pretendard Variable"', 'Pretendard', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        // Figma 디자인 시스템 색상 토큰
        ds: {
          main: '#0c0c0c',  // --font_icon-5-(main), --color/gray/da1000
        },
      },
      // Figma 타이포그래피 스케일
      fontSize: {
        // 본문용 (main body)
        'body-xs':   ['12px', { lineHeight: '20px', letterSpacing: '-0.24px' }],
        'body-sm':   ['13px', { lineHeight: '22px', letterSpacing: '-0.26px' }],
        'body-base': ['14px', { lineHeight: '24px', letterSpacing: '-0.28px' }],
        'body-md':   ['16px', { lineHeight: '28px', letterSpacing: '-0.32px' }],
        'body-lg':   ['18px', { lineHeight: '30px', letterSpacing: '-0.36px' }],
        'body-xl':   ['20px', { lineHeight: '32px', letterSpacing: '-0.40px' }],
        // 컴포넌트용 (component)
        'comp-xs':   ['12px', { lineHeight: '18px', letterSpacing: '-0.24px' }],
        'comp-sm':   ['14px', { lineHeight: '20px', letterSpacing: '-0.28px' }],
        'comp-base': ['16px', { lineHeight: '24px', letterSpacing: '-0.32px' }],
      },
      letterSpacing: {
        // Figma 전체 자간: -0.02em (letter-spacing: -2%)
        'ds': '-0.02em',
      },
    },
  },
  plugins: [],
};
