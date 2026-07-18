// CalendarDayButton — 캘린더(DatePicker)의 날짜 한 칸 (Figma date picker / calendar day button, node 7592:3061)
// 36×24 셀: 뒤쪽 좌/우 반쪽 배경(범위 연속 효과) + 중앙 24px 원형 위에 날짜 텍스트.
//   - 범위(start~end)를 가로로 끊김 없이 칠하기 위해, 셀을 좌/우 18px 두 반쪽으로 나눠
//     반쪽 배경(range-bg)을 이어 붙이고, 그 위에 원형 하이라이트를 올린다.
// 상태(state):
//   default     — 이번 달 선택 가능 날짜(검정 텍스트, hover 시 회색 원)
//   muted       — 흐린 회색 날짜(DatePicker에선 이전/다음 달 또는 선택 불가(disablePast 등))
//   today       — 오늘(진회색 원 + 흰 텍스트)
//   selected    — 단일 선택 / 범위 시작=끝(파란 원 + 흰 텍스트)
//   range-start — 범위 시작(파란 원 + 오른쪽 반쪽 range-bg)
//   range-end   — 범위 끝(파란 원 + 왼쪽 반쪽 range-bg)
//   in-range    — 범위 안(연한 파란 배경 + 파란 텍스트)
// 색은 cal-* 시멘틱 토큰만 사용.

import type { ComponentPropsWithoutRef } from 'react';

// 좌/우 반쪽 배경 — 범위 연속 칠을 위한 lookup. (range-bg를 칠할지 day-bg(투명)로 둘지)
const HALF_FILL = {
  'default':     { left: 'bg-calendar-day-bg', right: 'bg-calendar-day-bg' },
  'muted':       { left: 'bg-calendar-day-bg', right: 'bg-calendar-day-bg' },
  'today':       { left: 'bg-calendar-day-bg', right: 'bg-calendar-day-bg' },
  'selected':    { left: 'bg-calendar-day-bg', right: 'bg-calendar-day-bg' },
  'range-start': { left: 'bg-calendar-day-bg', right: 'bg-calendar-range-bg' },
  'range-end':   { left: 'bg-calendar-range-bg', right: 'bg-calendar-day-bg' },
  'in-range':    { left: 'bg-calendar-range-bg', right: 'bg-calendar-range-bg' },
};

// 중앙 원형 배경 + 텍스트 색 lookup.
const CIRCLE_STYLE = {
  'default':     { circle: 'bg-calendar-day-bg', text: 'text-calendar-day-text' },
  'muted':       { circle: 'bg-transparent', text: 'text-calendar-muted-text' },
  'today':       { circle: 'bg-calendar-today-bg', text: 'text-calendar-today-text' },
  'selected':    { circle: 'bg-calendar-selected-bg', text: 'text-calendar-selected-text' },
  'range-start': { circle: 'bg-calendar-selected-bg', text: 'text-calendar-selected-text' },
  'range-end':   { circle: 'bg-calendar-selected-bg', text: 'text-calendar-selected-text' },
  'in-range':    { circle: 'bg-calendar-range-bg', text: 'text-calendar-range-text' },
};

// hover 시 원에 회색 배경을 줄 수 있는(=아직 강조되지 않은) 상태
const HOVERABLE = new Set(['default', 'muted']);

// ...props는 루트 <button>으로 전달된다.
interface CalendarDayButtonProps extends ComponentPropsWithoutRef<'button'> {
  state?: keyof typeof HALF_FILL; // 'default' | 'muted' | 'today' | 'selected' | 'range-start' | 'range-end' | 'in-range'
  edge?: 'left' | 'right';        // 'left'(행 첫 칸) | 'right'(행 마지막 칸) — 범위 띠가 줄에서 끊길 때 바깥 모서리를 둥글게
}

export function CalendarDayButton({
  children,
  state = 'default', // 'default' | 'muted' | 'today' | 'selected' | 'range-start' | 'range-end' | 'in-range'
  edge,              // 'left'(행 첫 칸) | 'right'(행 마지막 칸) — 범위 띠가 줄에서 끊길 때 바깥 모서리를 둥글게
  disabled = false,
  onClick,
  className = '',
  ...props
}: CalendarDayButtonProps) {
  const half = HALF_FILL[state] ?? HALF_FILL.default;
  const circle = CIRCLE_STYLE[state] ?? CIRCLE_STYLE.default;
  // 포커스=호버(2026-07-16) — group=버튼 자신이므로 group-focus-visible로 같은 배경
  const hover =
    !disabled && HOVERABLE.has(state)
      ? 'group-hover:bg-calendar-hover-bg group-focus-visible:bg-calendar-hover-bg'
      : '';
  // muted는 이미 회색(비활성)으로 읽히므로, disabled여도 추가 dimming(opacity)을 주지 않는다.
  const dimmed = disabled && state !== 'muted';
  // 행 가장자리 + 해당 반쪽이 범위색일 때만 바깥 모서리를 둥글게(줄바꿈으로 각지게 끊기는 것 방지)
  const leftRound =
    edge === 'left' && half.left.includes('range-bg') ? 'rounded-l-round-00' : '';
  const rightRound =
    edge === 'right' && half.right.includes('range-bg') ? 'rounded-r-round-00' : '';

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      aria-disabled={disabled || undefined}
      className={`group relative flex h-[24px] w-[36px] items-center justify-center focus:outline-none ${
        disabled ? 'cursor-not-allowed' : 'cursor-pointer'
      } ${dimmed ? 'opacity-40' : ''} ${className}`}
      {...props}
    >
      {/* 뒤쪽 좌/우 반쪽 배경 — 범위 연속 칠 (행 가장자리는 바깥 모서리 둥글게) */}
      <span className={`absolute inset-y-0 left-0 w-1/2 ${half.left} ${leftRound}`} aria-hidden="true" />
      <span className={`absolute inset-y-0 right-0 w-1/2 ${half.right} ${rightRound}`} aria-hidden="true" />
      {/* 중앙 원형 하이라이트 + 날짜 텍스트 */}
      <span
        className={`relative z-10 flex size-[24px] items-center justify-center rounded-round-00 transition-colors ${circle.circle} ${hover}`}
      >
        <span className={`text-12 ${circle.text}`}>{children}</span>
      </span>
    </button>
  );
}
