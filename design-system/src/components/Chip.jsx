// Chip — 제거형 칩 (Figma chip: state Default/hover/pressed × size 22)
// 텍스트 + X(삭제) 버튼. 색은 chip 시멘틱 토큰 경유(default/hover, pressed=default 재사용).
//  - onRemove가 있으면 X 노출(클릭 시 삭제, 칩 onClick과 분리)
//  - onClick 주면 칩 전체가 클릭 가능(선택 등)
// (disabled 변형은 Figma에 없어 미제공 — 필요 시 추후 추가)
import { X } from 'lucide-react';

export function Chip({
  children,
  onRemove,                 // X 클릭 콜백 — 있으면 X 노출
  onClick,                  // 칩 전체 클릭(선택 등)
  removeAriaLabel = '삭제',
  className = '',
  ...props
}) {
  const clickable = !!onClick;
  const base =
    'inline-flex items-center gap-spacing-3 rounded-round-4 border border-chip-default-line ' +
    'bg-chip-default-bg pl-spacing-5 pr-spacing-4 py-spacing-1 font-pretendard font-normal text-12 text-chip-default-text transition-colors ' +
    'hover:border-chip-hover-line hover:bg-chip-hover-bg active:border-chip-hover-line active:bg-chip-hover-bg';

  return (
    <span
      onClick={clickable ? onClick : undefined}
      className={`${base} ${clickable ? 'cursor-pointer' : ''} ${className}`}
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
          className="flex shrink-0 items-center justify-center text-chip-default-icon"
        >
          <X size={12} strokeWidth={1.8} />
        </button>
      )}
    </span>
  );
}
