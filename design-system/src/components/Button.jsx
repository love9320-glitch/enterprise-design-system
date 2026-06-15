import { useLayoutEffect, useRef } from 'react';
import { LoaderCircle } from 'lucide-react';

export function Button({
  children,
  size = '32',
  variant = 'fill',
  leftIcon: LeftIcon = null,
  rightIcon: RightIcon = null,
  icon: Icon = null,
  disabled = false,
  loading = false,
  onClick,
  className = '',
  ...props
}) {
  const inactive = disabled || loading;
  const iconOnly = !!Icon;
  const iconSize = size === '24' ? 14 : 16;
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.width = '';
    el.style.width = el.offsetWidth + 'px';
  }, [children, size, variant, LeftIcon, RightIcon, Icon, disabled, loading]);

  const base =
    'inline-flex items-center justify-center relative font-pretendard font-normal ' +
    'whitespace-nowrap rounded-round-4 transition-colors select-none';

  let sizeStyle;
  if (iconOnly) {
    sizeStyle =
      size === '24'
        ? 'min-h-[24px] min-w-[24px] p-spacing-2'
        : 'min-h-[32px] min-w-[32px] p-spacing-3';
  } else {
    sizeStyle =
      size === '24'
        ? 'min-h-[24px] min-w-[24px] px-spacing-5 py-spacing-2 text-[12px] leading-5 tracking-[0px]'
        : 'min-h-[32px] min-w-[32px] px-spacing-6 py-spacing-3 text-[14px] leading-6 tracking-[0px]';
  }

  let colorStyle;
  if (variant === 'fill') {
    colorStyle = inactive
      ? 'bg-btn-fill-disabled-bg text-btn-fill-disabled-fg cursor-not-allowed'
      : 'bg-btn-fill-default-bg text-btn-fill-default-fg cursor-pointer ' +
        'hover:bg-btn-fill-hover-bg ' +
        'active:bg-btn-fill-default-bg';
  } else if (variant === 'line') {
    colorStyle = inactive
      ? 'bg-btn-line-disabled-bg text-btn-line-disabled-fg cursor-not-allowed'
      : 'bg-btn-line-default-bg text-btn-line-default-fg ring-1 ring-inset ring-btn-line-default-line cursor-pointer ' +
        'hover:bg-btn-line-hover-bg hover:ring-btn-line-hover-line ' +
        'active:bg-btn-line-default-bg active:ring-btn-line-default-line';
  } else {
    // ghost
    colorStyle = inactive
      ? 'bg-btn-ghost-disabled-bg text-btn-ghost-disabled-fg cursor-not-allowed'
      : 'bg-transparent text-btn-ghost-default-fg cursor-pointer ' +
        'hover:bg-btn-ghost-hover-bg ' +
        'active:bg-transparent';
  }

  return (
    <button
      ref={ref}
      className={`${base} ${sizeStyle} ${colorStyle} ${className}`}
      disabled={inactive}
      onClick={!inactive ? onClick : undefined}
      {...props}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <LoaderCircle
            size={iconSize}
            strokeWidth={1.8}
            className="animate-spin text-font-icon-3"
          />
        </span>
      )}
      <span className={`inline-flex items-center gap-spacing-3 ${loading ? 'opacity-0' : ''}`}>
        {iconOnly ? (
          <Icon size={iconSize} strokeWidth={1.8} />
        ) : (
          <>
            {LeftIcon && <LeftIcon size={iconSize} strokeWidth={1.8} />}
            {children}
            {RightIcon && <RightIcon size={iconSize} strokeWidth={1.8} />}
          </>
        )}
      </span>
    </button>
  );
}
