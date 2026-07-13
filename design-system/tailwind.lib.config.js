// 배포용 CSS(dist/style.css) 빌드 전용 Tailwind 설정.
// 실제 배포되는 컴포넌트(src)만 스캔해 CSS를 최소화한다(데모 페이지 클래스는 포함하지 않음).
import { theme, safelist } from './tailwind.theme.js';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx}'],
  safelist,
  theme,
  plugins: [],
};
