import {
  fontFamily, fontSize, lineHeight,
  baseColors, fontIconColors, buttonColors, textFieldColors, labelFieldColors, jobPostingTemplateColors, lnbColors, layoutColors, avatarColors, rightPanelColors, dividerColors, chipColors, headingColors, stepperLineTypeColors,
  listColors, tagColors, newTagColors, sideNavColors, conditionOrderSlotColors, conditionCardColors, formulaColors, builderAreaColors, toolbarColors, accordionColors, segmentedColors, checkboxColors, radioColors, switchColors, tabColors, tableColors, modalColors,
  editorColors, calendarColors,
  spacing, radius, borderWidth,
} from './src/tokens/index';

// Tailwind preset — 디자인 시스템 토큰 theme+safelist(2026-07-19 패키지화).
// 이 저장소의 tailwind.config.js와 소비 팀의 config가 함께 사용하는 단일 진실.
// 소비 팀: presets: [require('@gusun/design-system/preset')] + content에 자기 소스 지정.
// 사용처 마크업이 쓰는 토큰 유틸을 purge와 무관하게 항상 생성하는 safelist(2026-08-06 확장).
// styles.css(테일윈드 없는 소비자용 컴파일 CSS)도 이 safelist로 빌드되므로, 소비자가 문서/데모
// 예제처럼 `gap-spacing-5`·`text-font-icon-4` 등을 자기 코드에 써도 스타일이 항상 존재한다.
//   - spacing: p/m/gap 계열 접두 × spacing 토큰 전 조합(문서가 권하는 레이아웃 유틸)
//   - 컬러: text/bg/border/outline × 등록 토큰 — 정규식 패턴(임의값·미등록 색은 미생성)
const SPACING_PREFIXES = [
  'p', 'px', 'py', 'pt', 'pb', 'pl', 'pr',
  'm', 'mx', 'my', 'mt', 'mb', 'ml', 'mr',
  'gap', 'gap-x', 'gap-y',
];

// 중첩 컬러 토큰 객체 → 'a-b-c' 클래스 키 목록으로 평탄화(정확한 조합만 생성 — 패턴 safelist는
// 후보 폭발로 CSS가 MB 단위로 비대해져 사용하지 않는다)
const flattenColorKeys = (obj, prefix = []) =>
  Object.entries(obj).flatMap(([key, value]) =>
    typeof value === 'object' && value !== null
      ? flattenColorKeys(value, [...prefix, key])
      : [[...prefix, key].join('-')],
  );

// 사용처 마크업에 직접 쓰라고 안내하는 색 그룹만(문단·캡션·배경·구분선·헤딩) — 컴포넌트 내부
// 전용 팔레트(button/list/...)는 소비자 직접 사용 대상이 아니라 제외해 CSS 크기를 관리한다.
const CONSUMER_COLOR_KEYS = [
  ...flattenColorKeys(baseColors),
  ...flattenColorKeys({ 'font-icon': fontIconColors }),
  ...flattenColorKeys({ 'label-field': labelFieldColors }),
  ...flattenColorKeys({ divider: dividerColors }),
  ...flattenColorKeys({ heading: headingColors }),
];

/** @type {Partial<import('tailwindcss').Config>} */
export default {
  safelist: [
    ...Object.keys(fontSize).map((size) => `text-${size}`),
    ...Object.keys(lineHeight).map((key) => `leading-${key}`),
    ...Object.keys(radius).map((key) => `rounded-${key}`),
    ...Object.keys(borderWidth).map((key) => `border-${key}`),
    ...SPACING_PREFIXES.flatMap((p) => Object.keys(spacing).map((key) => `${p}-${key}`)),
    ...CONSUMER_COLOR_KEYS.flatMap((key) => [`text-${key}`, `bg-${key}`, `border-${key}`]),
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
        layout: layoutColors,
        avatar: avatarColors,
        'right-panel': rightPanelColors,
        'label-field': labelFieldColors,
        'job-posting-template': jobPostingTemplateColors,
        lnb: lnbColors,
        heading: headingColors,
        'stepper-line-type': stepperLineTypeColors,
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
