import {
  fontFamily, fontSize,
  baseColors, fontIconColors, buttonColors,
  spacing, radius, borderWidth,
} from './src/tokens/index.js';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  safelist: [
    ...Object.keys(fontSize).map((size) => `text-${size}`),
    ...Object.keys(radius).map((key) => `rounded-${key}`),
    ...Object.keys(borderWidth).map((key) => `border-${key}`),
  ],
  theme: {
    extend: {
      fontFamily,
      fontSize,
      colors: {
        ...baseColors,
        'font-icon': fontIconColors,
        btn: buttonColors,
      },
      spacing,
      borderRadius: radius,
      borderWidth,
    },
  },
  plugins: [],
}
