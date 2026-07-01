import {
  fontFamily, fontSize, lineHeight,
  baseColors, fontIconColors, buttonColors, textFieldColors, labelFieldColors, dividerColors, chipColors,
  listColors, tagColors, checkboxColors, radioColors, switchColors, tabColors, tableColors, modalColors,
  editorColors, calendarColors,
  spacing, radius, borderWidth,
} from './src/tokens/index.js';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  safelist: [
    ...Object.keys(fontSize).map((size) => `text-${size}`),
    ...Object.keys(lineHeight).map((key) => `leading-${key}`),
    ...Object.keys(radius).map((key) => `rounded-${key}`),
    ...Object.keys(borderWidth).map((key) => `border-${key}`),
  ],
  theme: {
    extend: {
      fontFamily,
      fontSize,
      lineHeight,
      colors: {
        ...baseColors,
        'font-icon': fontIconColors,
        button: buttonColors,
        'text-field': textFieldColors,
        'label-field': labelFieldColors,
        divider: dividerColors,
        chip: chipColors,
        list: listColors,
        tag: tagColors,
        checkbox: checkboxColors,
        radio: radioColors,
        switch: switchColors,
        tab: tabColors,
        table: tableColors,
        modal: modalColors,
        editor: editorColors,
        calendar: calendarColors,
      },
      spacing,
      borderRadius: radius,
      borderWidth,
      ringWidth: borderWidth, // ring 두께도 border 토큰(border-1~4)을 그대로 사용
    },
  },
  plugins: [],
}
