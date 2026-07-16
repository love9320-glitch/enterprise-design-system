import { useLayoutEffect, useRef } from 'react';
import { LoaderCircle } from 'lucide-react';
import { TruncatingText } from './TruncatingText';
import { useHoverTooltip } from './useHoverTooltip';

export function Button({
  children,
  size = '32',            // '32' | '24' | '18'(아이콘 전용 소형 — 버튼 18×18·아이콘 14×14)
  variant = 'fill',       // 'fill' | 'line' | 'ghost' | 'underline'(밑줄 텍스트 버튼)
  color = 'black',        // underline 전용 색 — 'black'(기본) | 'red' | 'blue' | 'green' | 'violet' | 'pink' | 'orange'
  weight = 'normal',      // underline 전용 두께 — 'normal'(기본) | 'semibold'
  leftIcon: LeftIcon = null,
  rightIcon: RightIcon = null,
  icon: Icon = null,
  disabled = false,
  loading = false,
  truncate = false,       // 라벨이 부모 폭을 넘으면 말줄임(테이블 셀 등 좁은 영역용)
  width = 'hug',          // 'hug'(콘텐츠 폭) | 'fill'(부모 전체 폭) — underline 변형엔 미적용
  showTooltip = true,     // 아이콘 전용 버튼 hover 명칭 툴팁 on/off (기본 켬)
  tooltip,                // 툴팁 문구 커스텀. 미지정 시 aria-label 사용
  onClick,
  onMouseEnter,
  onMouseLeave,
  className = '',
  ...props
}) {
  const inactive = disabled || loading;
  const iconOnly = !!Icon;
  // 아이콘만 있는 버튼은 명칭이 안 보이므로 hover 툴팁으로 알려준다(showTooltip으로 on/off,
  // 문구=tooltip prop ?? aria-label).
  const tipLabel = iconOnly && showTooltip ? (tooltip ?? props['aria-label']) : null;
  const hoverTip = useHoverTooltip(tipLabel);
  const iconSize = size === '18' || size === '24' ? 14 : 16;
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

  // 텍스트 두께 — underline 변형만 semibold 옵션 지원(2026-07-15), 그 외는 400 고정
  const weightClass =
    variant === 'underline' && weight === 'semibold' ? 'font-semibold' : 'font-normal';
  // 포커스 디자인 = 호버 디자인(2026-07-16 지시) — 기본 아웃라인을 끄고, 변형별로
  // focus-visible(키보드 포커스)에 hover와 같은 효과를 준다(마우스 클릭에는 표시 없음).
  const base =
    `inline-flex items-center justify-center relative font-pretendard ${weightClass} ` +
    'whitespace-nowrap rounded-round-4 transition-colors select-none focus:outline-none';
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
    // 18 = 아이콘 전용 소형(18×18, 아이콘 14 → 상하좌우 2px 패딩). 24/32는 min-h/w로 높이 확보.
    sizeStyle =
      size === '18'
        ? 'min-h-[18px] min-w-[18px] p-spacing-2'
        : size === '24'
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
      ? 'bg-button-fill-disabled-bg text-button-fill-disabled-fg cursor-not-allowed'
      : 'bg-button-fill-default-bg text-button-fill-default-fg cursor-pointer ' +
        'hover:bg-button-fill-hover-bg focus-visible:bg-button-fill-hover-bg ' +
        'active:bg-button-fill-default-bg';
  } else if (variant === 'line') {
    colorStyle = inactive
      ? 'bg-button-line-disabled-bg text-button-line-disabled-fg cursor-not-allowed'
      : 'bg-button-line-default-bg text-button-line-default-fg ring-1 ring-inset ring-button-line-default-line cursor-pointer ' +
        'hover:bg-button-line-hover-bg hover:ring-button-line-hover-line ' +
        'focus-visible:bg-button-line-hover-bg focus-visible:ring-button-line-hover-line ' +
        'active:bg-button-line-default-bg active:ring-button-line-default-line';
  } else if (variant === 'underline') {
    // 밑줄 텍스트 버튼 — 배경 없이 텍스트색만, hover 시 밑줄(active=눌렸을 땐 밑줄 제거).
    // color 변형(2026-07-15): black 기본 + 칩 컬러 대응 6색(button-underline-* 토큰, 정적 맵=purge 안전)
    const UNDERLINE_COLOR = {
      black: 'text-button-underline-black-fg',
      red: 'text-button-underline-red-fg',
      blue: 'text-button-underline-blue-fg',
      green: 'text-button-underline-green-fg',
      violet: 'text-button-underline-violet-fg',
      pink: 'text-button-underline-pink-fg',
      orange: 'text-button-underline-orange-fg',
    };
    colorStyle = inactive
      ? 'bg-transparent text-font-icon-2 cursor-not-allowed'
      : `bg-transparent ${UNDERLINE_COLOR[color] ?? UNDERLINE_COLOR.black} cursor-pointer ` +
        'hover:underline focus-visible:underline active:no-underline';
  } else {
    // ghost — 비활성은 세그먼트 컨트롤과 동일(투명 배경 + font-icon-2 텍스트)
    colorStyle = inactive
      ? 'bg-transparent text-font-icon-2 cursor-not-allowed'
      : 'bg-transparent text-button-ghost-default-fg cursor-pointer ' +
        'hover:bg-button-ghost-hover-bg focus-visible:bg-button-ghost-hover-bg ' +
        'active:bg-transparent';
  }

  return (
    <>
    <button
      ref={ref}
      className={`${base} ${sizeStyle} ${colorStyle} ${truncStyle} ${widthStyle} ${className}`}
      disabled={inactive}
      onClick={!inactive ? onClick : undefined}
      onMouseEnter={(e) => {
        onMouseEnter?.(e);
        hoverTip.onMouseEnter(e);
      }}
      onMouseLeave={(e) => {
        onMouseLeave?.(e);
        hoverTip.onMouseLeave(e);
      }}
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
    {hoverTip.tooltip}
    </>
  );
}
