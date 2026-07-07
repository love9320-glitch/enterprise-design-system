// Chip — 제거형 칩 (Figma chip: state Default/hover/pressed × size 22 × color gray/red/blue/black)
// 텍스트 + X(삭제) 버튼. 색은 chip 시멘틱 토큰 경유(default/hover, pressed=default 재사용).
//  - color: gray(기본) · red · blue · black — 분류/의미 색(variant). recolor 금지, prop으로 표현(규칙 5)
//  - onRemove가 있으면 X 노출(클릭 시 삭제, 칩 onClick과 분리)
//  - onClick 주면 칩 전체가 클릭 가능(선택 등)
// (disabled 변형은 Figma에 없어 미제공 — 필요 시 추후 추가)
import { X } from 'lucide-react';

// color별 전체 클래스(Tailwind purge를 위해 동적 문자열이 아닌 완전한 클래스명으로 나열).
// text 색만 지정하면 X 아이콘(lucide, stroke=currentColor)이 상속받는다. icon 토큰=text 토큰 값.
const COLOR_CLASS = {
  gray: 'text-chip-gray-default-text border-chip-gray-default-line bg-chip-gray-default-bg hover:text-chip-gray-hover-text hover:border-chip-gray-hover-line hover:bg-chip-gray-hover-bg',
  red: 'text-chip-red-default-text border-chip-red-default-line bg-chip-red-default-bg hover:text-chip-red-hover-text hover:border-chip-red-hover-line hover:bg-chip-red-hover-bg',
  blue: 'text-chip-blue-default-text border-chip-blue-default-line bg-chip-blue-default-bg hover:text-chip-blue-hover-text hover:border-chip-blue-hover-line hover:bg-chip-blue-hover-bg',
  black: 'text-chip-black-default-text border-chip-black-default-line bg-chip-black-default-bg hover:text-chip-black-hover-text hover:border-chip-black-hover-line hover:bg-chip-black-hover-bg',
};

export function Chip({
  children,
  onRemove,                 // X 클릭 콜백 — 있으면 X 노출
  onClick,                  // 칩 전체 클릭(선택 등)
  color = 'gray',           // gray | red | blue | black
  removeAriaLabel = '삭제',
  className = '',
  ...props
}) {
  const clickable = !!onClick;
  const base =
    'inline-flex items-center gap-spacing-3 rounded-round-4 border pl-spacing-4 pr-spacing-3 py-spacing-1 ' +
    'font-pretendard font-normal text-12 transition-colors';

  return (
    <span
      onClick={clickable ? onClick : undefined}
      className={`${base} ${COLOR_CLASS[color] ?? COLOR_CLASS.gray} ${clickable ? 'cursor-pointer' : ''} ${className}`}
      {...props}
    >
      <span className="whitespace-nowrap">{children}</span>
      {onRemove && (
        <button
          type="button"
          aria-label={removeAriaLabel}
          onClick={(e) => {
            e.stopPropagation();
            onRemove(e);
          }}
          className="flex shrink-0 items-center justify-center"
        >
          <X size={12} strokeWidth={1.8} />
        </button>
      )}
    </span>
  );
}
