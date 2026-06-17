import { useLayoutEffect, useRef } from 'react';
import { LoaderCircle } from 'lucide-react';
import { TruncatingText } from './TruncatingText';

export function Button({
  children,
  size = '32',
  variant = 'fill',       // 'fill' | 'line' | 'ghost' | 'underline'(밑줄 텍스트 버튼)
  leftIcon: LeftIcon = null,
  rightIcon: RightIcon = null,
  icon: Icon = null,
  disabled = false,
  loading = false,
  truncate = false,       // 라벨이 부모 폭을 넘으면 말줄임(테이블 셀 등 좁은 영역용)
  width = 'hug',          // 'hug'(콘텐츠 폭) | 'fill'(부모 전체 폭) — underline 변형엔 미적용
  onClick,
  className = '',
  ...props
}) {
  const inactive = disabled || loading;
  const iconOnly = !!Icon;
  const iconSize = size === '24' ? 14 : 16;
  // fill: 부모 폭을 100% 채운다(밑줄 텍스트 버튼은 박스가 없어 제외).
  const isFill = width === 'fill' && variant !== 'underline';
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    // truncate(셀 폭 추종)·fill(부모 폭 100%)이면 콘텐츠 기준 너비 고정을 하지 않는다.
    if (!el || truncate || isFill) {
      if (el && isFill) el.style.width = '';
      return;
    }
    el.style.width = '';
    el.style.width = el.offsetWidth + 'px';
  }, [children, size, variant, LeftIcon, RightIcon, Icon, disabled, loading, truncate, isFill]);

  const base =
    'inline-flex items-center justify-center relative font-pretendard font-normal ' +
    'whitespace-nowrap rounded-round-4 transition-colors select-none';
  // truncate: 버튼이 부모 폭 안에서 줄어들고(min-w-0/max-w-full) 라벨이 말줄임되게 한다.
  const truncStyle = truncate ? 'min-w-0 max-w-full' : '';
  // fill: 부모 전체 폭(inline-flex라도 width:100% 적용됨).
  const widthStyle = isFill ? 'w-full' : '';

  let sizeStyle;
  if (variant === 'underline') {
    // 밑줄 텍스트 버튼 — 배경/패딩 없이 텍스트(+아이콘)만. 높이만 맞춘다.
    sizeStyle =
      size === '24'
        ? 'min-h-[24px] text-[12px] leading-5 tracking-[0px]'
        : 'min-h-[32px] text-[14px] leading-6 tracking-[0px]';
  } else if (iconOnly) {
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
  } else if (variant === 'underline') {
    // 밑줄 텍스트 버튼 — 배경 없이 ghost 텍스트색 재사용, hover 시 밑줄만(active=눌렸을 땐 밑줄 제거)
    colorStyle = inactive
      ? 'bg-transparent text-btn-ghost-disabled-fg cursor-not-allowed'
      : 'bg-transparent text-btn-ghost-default-fg cursor-pointer ' +
        'hover:underline active:no-underline';
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
      className={`${base} ${sizeStyle} ${colorStyle} ${truncStyle} ${widthStyle} ${className}`}
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
      <span className={`inline-flex items-center gap-spacing-3 ${truncate ? 'min-w-0' : ''} ${loading ? 'opacity-0' : ''}`}>
        {iconOnly ? (
          <Icon size={iconSize} strokeWidth={1.8} />
        ) : (
          <>
            {LeftIcon && <LeftIcon size={iconSize} strokeWidth={1.8} className="shrink-0" />}
            {truncate ? (
              <TruncatingText as="span" className="min-w-0">{children}</TruncatingText>
            ) : (
              children
            )}
            {RightIcon && <RightIcon size={iconSize} strokeWidth={1.8} className="shrink-0" />}
          </>
        )}
      </span>
    </button>
  );
}
