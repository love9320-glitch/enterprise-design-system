// SegmentControl — 세그먼트 컨트롤
// 여러 선택지 중 하나를 고르는 ghost 기반 토글 버튼 묶음.
// - SegmentControlButton : 세그먼트 컨트롤 버튼 1개(텍스트 / 아이콘 / 좌·우 아이콘+텍스트)
// - SegmentControlGroup  : 버튼들을 묶어 단일 선택을 관리하는 컨테이너
//
// Figma file: h9jZFkEHfcHUGok1TZjjlP (node 7365:1436)
// 컬러는 기존 ghost 시멘틱 토큰 재사용(하드코딩 금지):
//   기본(미선택) 텍스트 → font-icon-3(#878787)
//   선택/hover 배경     → btn-ghost-hover-bg(#0d0d0d12)
//   선택/hover 텍스트   → font-icon-5(#0d0d0d)
//   비활성 텍스트       → font-icon-2(#c9c9c9)
import { useState } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

// gap 토큰 키 → gap 클래스 (Tailwind purge 안전하게 정적 매핑) — ButtonGroup과 동일 규약
const GAP_STYLE = {
  '3': 'gap-spacing-3', // 4px
  '4': 'gap-spacing-4', // 6px
  '5': 'gap-spacing-5', // 8px (기본 — Figma 세그먼트 그룹 간격)
  '6': 'gap-spacing-6', // 12px
  '7': 'gap-spacing-7', // 16px
};

interface SegmentControlButtonProps extends ComponentPropsWithoutRef<'button'> {
  size?: '32' | '24';
  selected?: boolean;
  leftIcon?: LucideIcon | null;
  rightIcon?: LucideIcon | null;
  icon?: LucideIcon | null; // 아이콘 전용(텍스트 없음)
}

export function SegmentControlButton({
  children,
  size = '32',            // '32' | '24'
  selected = false,
  disabled = false,
  leftIcon: LeftIcon = null,
  rightIcon: RightIcon = null,
  icon: Icon = null,      // 아이콘 전용(텍스트 없음)
  onClick,
  className = '',
  ...props
}: SegmentControlButtonProps) {
  const iconOnly = !!Icon;
  const iconSize = size === '24' ? 14 : 16;

  const base =
    'inline-flex items-center justify-center relative font-pretendard font-normal ' +
    'whitespace-nowrap rounded-round-4 transition-colors select-none focus:outline-none';

  // 사이즈·레이아웃 — Button과 동일한 패딩 규약(토큰만 사용)
  let sizeStyle;
  if (iconOnly) {
    sizeStyle =
      size === '24'
        ? 'min-h-[24px] min-w-[24px] p-spacing-2'
        : 'min-h-[32px] min-w-[32px] px-spacing-5 py-spacing-3';
  } else {
    sizeStyle =
      size === '24'
        ? 'min-h-[24px] min-w-[24px] px-spacing-5 py-spacing-2 text-12'
        : 'min-h-[32px] min-w-[32px] px-spacing-6 py-spacing-3 text-14';
  }

  // 컬러 — ghost 시멘틱 토큰 재사용
  let colorStyle;
  if (disabled) {
    colorStyle = 'bg-transparent text-font-icon-2 cursor-not-allowed';
  } else if (selected) {
    colorStyle = 'bg-button-ghost-hover-bg text-font-icon-5 cursor-pointer';
  } else {
    // 미선택 — 회색 텍스트, hover 시 ghost 배경 + 진한 텍스트(active=눌렀을 땐 배경 제거)
    colorStyle =
      'bg-transparent text-font-icon-3 cursor-pointer ' +
      'hover:bg-button-ghost-hover-bg hover:text-font-icon-5 active:bg-transparent ' +
      'focus-visible:bg-button-ghost-hover-bg focus-visible:text-font-icon-5'; // 포커스=호버(2026-07-16)
  }

  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      className={`${base} ${sizeStyle} ${colorStyle} ${className}`}
      disabled={disabled}
      onClick={!disabled ? onClick : undefined}
      {...props}
    >
      <span className="inline-flex items-center gap-spacing-3">
        {iconOnly ? (
          <Icon size={iconSize} strokeWidth={1.8} />
        ) : (
          <>
            {LeftIcon && <LeftIcon size={iconSize} strokeWidth={1.8} className="shrink-0" />}
            {children}
            {RightIcon && <RightIcon size={iconSize} strokeWidth={1.8} className="shrink-0" />}
          </>
        )}
      </span>
    </button>
  );
}

// 그룹 항목 — [{ value, label, leftIcon, rightIcon, icon, disabled, ariaLabel }]
interface SegmentControlItem {
  value: string | number;
  label?: ReactNode;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  icon?: LucideIcon;
  disabled?: boolean;
  ariaLabel?: string;
}

interface SegmentControlGroupProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange'> {
  items?: SegmentControlItem[];    // [{ value, label, leftIcon, rightIcon, icon, disabled, ariaLabel }]
  value?: string | number;         // controlled 선택값
  defaultValue?: string | number;  // uncontrolled 초기 선택값
  onChange?: (value: string | number) => void; // (value) => void
  size?: '32' | '24';              // '32' | '24' — 모든 버튼에 적용
  gap?: keyof typeof GAP_STYLE;    // 간격 토큰 키 — 기본 '5'(8px)
  disabled?: boolean;              // 그룹 전체 비활성
}

export function SegmentControlGroup({
  items = [],             // [{ value, label, leftIcon, rightIcon, icon, disabled, ariaLabel }]
  value,                  // controlled 선택값
  defaultValue,           // uncontrolled 초기 선택값
  onChange,               // (value) => void
  size = '32',            // '32' | '24' — 모든 버튼에 적용
  gap = '5',              // 간격 토큰 키 — 기본 '5'(8px)
  disabled = false,       // 그룹 전체 비활성
  className = '',
  ...props
}: SegmentControlGroupProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue);
  const selected = isControlled ? value : internal;

  const handleSelect = (val: string | number) => {
    if (!isControlled) setInternal(val);
    onChange?.(val);
  };

  const gapStyle = GAP_STYLE[gap] ?? GAP_STYLE['5'];

  return (
    <div
      role="tablist"
      className={`inline-flex items-center ${gapStyle} ${className}`}
      {...props}
    >
      {items.map((item) => (
        <SegmentControlButton
          key={item.value}
          size={size}
          selected={selected === item.value}
          disabled={disabled || item.disabled}
          leftIcon={item.leftIcon}
          rightIcon={item.rightIcon}
          icon={item.icon}
          aria-label={item.ariaLabel}
          onClick={() => handleSelect(item.value)}
        >
          {item.label}
        </SegmentControlButton>
      ))}
    </div>
  );
}
