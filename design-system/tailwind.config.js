// 개발(쇼케이스) 사이트용 Tailwind 설정.
// 컴포넌트(src)와 데모 페이지(showcase) 모두를 스캔한다.
import { theme, safelist } from './tailwind.theme.js';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx}',
    './showcase/**/*.{js,jsx,html}',
  ],
  safelist,
  theme,
  plugins: [],
};
