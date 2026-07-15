// 디자인 토큰 → Tailwind theme 매핑(단일 출처).
// 개발(쇼케이스)용 tailwind.config.js 와 배포 CSS 빌드용 tailwind.lib.config.js 가 함께 사용한다.
import {
  fontFamily, fontSize, lineHeight,
  baseColors, fontIconColors, buttonColors, textFieldColors, labelFieldColors, dividerColors, chipColors,
  listColors, tagColors, newTagColors, sideNavColors, conditionOrderSlotColors, segmentedColors, checkboxColors, radioColors, switchColors, tabColors, tableColors, modalColors,
  editorColors, calendarColors,
  spacing, radius, borderWidth,
} from './src/tokens/index.ts';

export const safelist = [
  ...Object.keys(fontSize).map((size) => `text-${size}`),
  ...Object.keys(lineHeight).map((key) => `leading-${key}`),
  ...Object.keys(radius).map((key) => `rounded-${key}`),
  ...Object.keys(borderWidth).map((key) => `border-${key}`),
];

export const theme = {
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
};
