import {
  fontFamily, fontSize, lineHeight,
  baseColors, fontIconColors, buttonColors, textFieldColors, labelFieldColors, dividerColors, chipColors,
  listColors, tagColors, newTagColors, sideNavColors, conditionOrderSlotColors, conditionCardColors, formulaColors, builderAreaColors, toolbarColors, accordionColors, segmentedColors, checkboxColors, radioColors, switchColors, tabColors, tableColors, modalColors,
  editorColors, calendarColors,
  spacing, radius, borderWidth,
} from './src/tokens/index';

// Tailwind preset — 디자인 시스템 토큰 theme+safelist(2026-07-19 패키지화).
// 이 저장소의 tailwind.config.js와 소비 팀의 config가 함께 사용하는 단일 진실.
// 소비 팀: presets: [require('@love9320-glitch/design-system/preset')] + content에 자기 소스 지정.
/** @type {Partial<import('tailwindcss').Config>} */
export default {
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
        'new-tag': newTagColors,
        'side-nav': sideNavColors,
        'condition-slot': conditionOrderSlotColors,
        'condition-card': conditionCardColors,
        formula: formulaColors,
        'builder-area': builderAreaColors,
        toolbar: toolbarColors,
        accordion: accordionColors,
        segmented: segmentedColors,
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
};
