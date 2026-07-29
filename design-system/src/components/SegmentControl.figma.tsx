// SegmentControl 계열 Code Connect 매핑(2026-07-29) — 세그먼트 컨트롤 버튼 4세트 + 그룹.
//   - 버튼: state(Selected→selected, Disabled→disabled — Hover/Pressed는 CSS 상태라 제외) × size(32/24).
//   - 그룹(7626:3942)은 gap 변형명이 미정리(Default/Variant2/gap3~5)라 gap 매핑 없이 기본 예시만 —
//     Figma에서 gap=3~7로 개명되면 figma.enum('gap', …) 추가 예정.
//   - 아이콘 스왑은 대표 아이콘(Plus) 예시.
// 발행: main 머지 시 자동(.github/workflows/figma-code-connect.yml)
// 파서 제약 — URL·props는 리터럴만(변수·스프레드·as const 금지).
import figma from '@figma/code-connect';
import { Plus } from 'lucide-react';
import { SegmentControlButton, SegmentControlGroup } from './SegmentControl';

// segmented control group — 버튼 나열(단일 선택). 아이템은 items로 주입
figma.connect(
  SegmentControlGroup,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7626-3942',
  {
    example: () => (
      <SegmentControlGroup
        items={[
          { value: 'a', label: '옵션 1' },
          { value: 'b', label: '옵션 2' },
          { value: 'c', label: '옵션 3' },
        ]}
        defaultValue="a"
      />
    ),
  },
);

// 01_segmented control_text button
figma.connect(
  SegmentControlButton,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7365-1304',
  {
    props: {
      size: figma.enum('size', { '32': '32', '24': '24' }),
      selected: figma.enum('state', { Selected: true }),
      disabled: figma.enum('state', { Disabled: true }),
      label: figma.string('text'),
    },
    example: ({ size, selected, disabled, label }) => (
      <SegmentControlButton size={size} selected={selected} disabled={disabled}>
        {label}
      </SegmentControlButton>
    ),
  },
);

// 01_segmented control_left icon text button
figma.connect(
  SegmentControlButton,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7365-1185',
  {
    props: {
      size: figma.enum('size', { '32': '32', '24': '24' }),
      selected: figma.enum('state', { Selected: true }),
      disabled: figma.enum('state', { Disabled: true }),
      label: figma.string('text'),
    },
    example: ({ size, selected, disabled, label }) => (
      <SegmentControlButton size={size} selected={selected} disabled={disabled} leftIcon={Plus}>
        {label}
      </SegmentControlButton>
    ),
  },
);

// 01_segmented control_right icon text button
figma.connect(
  SegmentControlButton,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7365-1228',
  {
    props: {
      size: figma.enum('size', { '32': '32', '24': '24' }),
      selected: figma.enum('state', { Selected: true }),
      disabled: figma.enum('state', { Disabled: true }),
      label: figma.string('text'),
    },
    example: ({ size, selected, disabled, label }) => (
      <SegmentControlButton size={size} selected={selected} disabled={disabled} rightIcon={Plus}>
        {label}
      </SegmentControlButton>
    ),
  },
);

// 01_segmented control_icon button — 아이콘 전용(aria-label 필수)
figma.connect(
  SegmentControlButton,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7365-1271',
  {
    props: {
      size: figma.enum('size', { '32': '32', '24': '24' }),
      selected: figma.enum('state', { Selected: true }),
      disabled: figma.enum('state', { Disabled: true }),
    },
    example: ({ size, selected, disabled }) => (
      <SegmentControlButton size={size} selected={selected} disabled={disabled} icon={Plus} aria-label="버튼 이름" />
    ),
  },
);
