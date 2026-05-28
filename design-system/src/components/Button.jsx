import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Figma: 01_buttons (node 943:36646)
 *
 * variant : 'primary' | 'line' | 'ghost'
 * color   : 'theme'(#0285ff) | 'mono'(#0c0c0c) | 'error'(#fa423e, primary only)
 * size    : '32'(h-32, font 14px) | '24'(h-24, font 12px)
 */

/* ── 공통 베이스 ── */
const base =
  'inline-flex items-center justify-center font-["Pretendard_Variable",Pretendard,system-ui] ' +
  'rounded-[6px] transition-colors duration-150 ' +
  'focus:outline-none focus:ring-2 focus:ring-offset-1 ' +
  'disabled:cursor-not-allowed select-none';

/* ── 크기 ── */
const sizeMap = {
  '32': { wrap: 'min-h-[32px] px-[10px] py-[6px] gap-[4px] text-[14px] leading-[20px] tracking-[-0.28px]', icon: 16 },
  '24': { wrap: 'min-h-[24px] px-[6px] py-[3px] gap-[3px] text-[12px] leading-[18px] tracking-[-0.24px]', icon: 14 },
};

/* ── variant × color 스타일 ── */
const variantStyles = {
  primary: {
    theme: {
      default:  'bg-[#0285ff] text-white focus:ring-[#0285ff]',
      hover:    'hover:bg-[rgba(2,133,255,0.65)]',
      active:   'active:bg-[#0285ff]',
      disabled: 'disabled:bg-[rgba(12,12,12,0.16)] disabled:text-[rgba(12,12,12,0.16)]',
    },
    mono: {
      default:  'bg-[#0c0c0c] text-white focus:ring-[#0c0c0c]',
      hover:    'hover:bg-[rgba(12,12,12,0.65)]',
      active:   'active:bg-[#0c0c0c]',
      disabled: 'disabled:bg-[rgba(12,12,12,0.16)] disabled:text-[rgba(12,12,12,0.16)]',
    },
    error: {
      default:  'bg-[#fa423e] text-white focus:ring-[#fa423e]',
      hover:    'hover:bg-[rgba(250,66,62,0.81)]',
      active:   'active:bg-[#fa423e]',
      disabled: 'disabled:bg-[rgba(12,12,12,0.16)] disabled:text-[rgba(12,12,12,0.16)]',
    },
  },
  line: {
    theme: {
      default:  'bg-white border border-[rgba(12,12,12,0.16)] text-[#0f85f2] focus:ring-[#0f85f2]',
      hover:    'hover:bg-[#f6fafe] hover:border-[#0f85f2]',
      active:   'active:bg-white active:border-[rgba(12,12,12,0.16)]',
      disabled: 'disabled:bg-[rgba(12,12,12,0.16)] disabled:border-transparent disabled:text-[rgba(12,12,12,0.16)]',
    },
    mono: {
      default:  'bg-white border border-[rgba(12,12,12,0.16)] text-[#0c0c0c] focus:ring-[#0c0c0c]',
      hover:    'hover:bg-[#f2f2f2] hover:border-[rgba(12,12,12,0.48)]',
      active:   'active:bg-white active:border-[#0c0c0c]',
      disabled: 'disabled:bg-[rgba(12,12,12,0.16)] disabled:border-transparent disabled:text-[rgba(12,12,12,0.16)]',
    },
    error: {
      default:  'bg-white border border-[#fa423e] text-[#fa423e] focus:ring-[#fa423e]',
      hover:    'hover:bg-[rgba(250,66,62,0.06)] hover:border-[#fa423e]',
      active:   'active:bg-white',
      disabled: 'disabled:bg-[rgba(12,12,12,0.16)] disabled:border-transparent disabled:text-[rgba(12,12,12,0.16)]',
    },
  },
  ghost: {
    theme: {
      default:  'bg-transparent text-[#0f85f2] focus:ring-[#0285ff]',
      hover:    'hover:bg-[rgba(2,133,255,0.08)]',
      active:   'active:bg-transparent',
      disabled: 'disabled:text-[rgba(12,12,12,0.33)]',
    },
    mono: {
      default:  'bg-transparent text-[#0c0c0c] focus:ring-[#0c0c0c]',
      hover:    'hover:bg-[rgba(12,12,12,0.07)]',
      active:   'active:bg-transparent',
      disabled: 'disabled:text-[rgba(12,12,12,0.33)]',
    },
    error: {
      default:  'bg-transparent text-[#fa423e] focus:ring-[#fa423e]',
      hover:    'hover:bg-[rgba(250,66,62,0.08)]',
      active:   'active:bg-transparent',
      disabled: 'disabled:text-[rgba(12,12,12,0.33)]',
    },
  },
};

export function Button({
  variant = 'primary',
  color = 'theme',
  size = '32',
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  children,
  className = '',
  ...props
}) {
  const s = variantStyles[variant]?.[color] ?? variantStyles.primary.theme;
  const sz = sizeMap[size] ?? sizeMap['32'];
  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      className={[
        base,
        sz.wrap,
        s.default,
        s.hover,
        s.active,
        s.disabled,
        fullWidth ? 'w-full' : '',
        className,
      ].filter(Boolean).join(' ')}
      {...props}
    >
      {loading ? (
        <Loader2 size={sz.icon} className="animate-spin" />
      ) : LeftIcon ? (
        <LeftIcon size={sz.icon} />
      ) : null}
      {children && (
        <span className={loading ? 'opacity-0' : ''}>{children}</span>
      )}
      {!loading && RightIcon && <RightIcon size={sz.icon} />}
    </button>
  );
}
