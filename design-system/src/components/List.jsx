// List — 옵션 목록의 한 행 (Figma option list / list)
// 상태: default / hover / pressed / selected / disabled
//   - hover/pressed는 CSS(:hover/:active), selected·disabled는 props
//   - selected 시 chevron이 파란색(list-select-icon)
// 요소(필요에 따라 on/off, 추후 추가 예정): tag · title · rightButton(고스트 ⋯) · endIcon(chevron)
// 색은 list-* 시멘틱 토큰만 사용.
import { ChevronRight, MoreHorizontal } from 'lucide-react';
import { Tag } from './Tag';
import { TruncatingText } from './TruncatingText';

export function List({
  title = 'list',
  tag = false,            // 태그 표시 여부
  tagText = '태그',
  rightButton = false,    // 고스트 ⋯ 버튼
  endIcon = false,        // chevron-right
  selected = false,
  highlighted = false, // 키보드 내비게이션 강조 (hover 색)
  disabled = false,
  onClick,
  onButtonClick,
  className = '',
  ...props
}) {
  const interactive = !disabled;

  const rowBg = disabled
    ? 'bg-list-default-bg cursor-not-allowed'
    : highlighted
      ? 'bg-list-hover-bg cursor-pointer' // 키보드 강조 우선
      : selected
        ? 'bg-list-default-bg cursor-pointer' // 선택 상태: hover/pressed 효과 없음
        : 'bg-list-default-bg cursor-pointer hover:bg-list-hover-bg active:bg-list-pressed-bg';

  const titleColor = disabled
    ? 'text-list-disabled-text'
    : selected
      ? 'text-list-select-text'
      : 'text-list-default-text';
  const ellipsisColor = disabled ? 'text-list-disabled-icon' : 'text-list-default-icon';
  const chevronColor = disabled
    ? 'text-list-disabled-icon'
    : selected
      ? 'text-list-select-icon'
      : 'text-list-default-icon';

  return (
    <div
      role="option"
      aria-selected={selected || undefined}
      aria-disabled={disabled || undefined}
      onClick={interactive ? onClick : undefined}
      className={`flex min-h-[32px] w-full items-center justify-between px-spacing-6 py-spacing-3 transition-colors ${rowBg} ${className}`}
      {...props}
    >
      {/* left: tag + title (말줄임 시 hover 툴팁 — TruncatingText) */}
      <div className="flex min-w-0 flex-1 items-center gap-spacing-4">
        {tag && <Tag>{tagText}</Tag>}
        <TruncatingText className={`min-w-0 flex-1 text-14 ${titleColor}`}>
          {title}
        </TruncatingText>
      </div>

      {/* right: 고스트 ⋯ 버튼 + chevron */}
      {(rightButton || endIcon) && (
        <div className="flex shrink-0 items-center gap-spacing-2">
          {rightButton && (
            <button
              type="button"
              disabled={disabled}
              onClick={(e) => {
                e.stopPropagation();
                onButtonClick?.(e);
              }}
              className="flex min-h-[24px] min-w-[24px] items-center justify-center rounded-round-4 p-spacing-2 opacity-80 transition-colors hover:bg-btn-ghost-hover-bg disabled:cursor-not-allowed"
              aria-label="더보기"
            >
              <MoreHorizontal size={14} strokeWidth={1.8} className={ellipsisColor} />
            </button>
          )}
          {endIcon && <ChevronRight size={16} strokeWidth={1.8} className={chevronColor} />}
        </div>
      )}
    </div>
  );
}
