import preset from './tailwind.preset';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [preset], // 토큰 theme+safelist는 preset(단일 진실 — 패키지로도 배포)
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'], // TS 전환(2026-07-19) — .ts/.tsx 스캔 필수
  plugins: [],
}
