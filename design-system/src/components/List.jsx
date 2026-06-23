// List — 옵션 목록의 한 행 (Figma option list / list, node 7206:9327)
// 상태: default / hover / pressed / selected / disabled
//   - hover/pressed는 CSS(:hover/:active), selected·disabled는 props
//   - selected 시 chevron·아이콘이 파란색(list-selected-icon)
// 요소(필요에 따라 on/off):
//   left  : tag · checkbox · icon(lucide) · title
//   right : switch · rightButton(고스트 ⋯) · endIcon(chevron)
// 색은 list-* 시멘틱 토큰만 사용. checkbox/switch는 공용 컴포넌트 재사용.
// checkbox가 있으면 행 전체가 체크박스 클릭 영역이 된다(행 어디를 눌러도 토글). switch는 행 클릭과 분리(stopPropagation).
import { ChevronRight, MoreHorizontal } from 'lucide-react';
import { Tag } from './Tag';
import { Checkbox } from './Checkbox';
import { Switch } from './Switch';
import { TruncatingText } from './TruncatingText';

export function List({
  title = 'list',
  tag = false,            // 태그 표시 여부
  tagText = '태그',
  icon: Icon = null,      // 왼쪽 lucide 아이콘 (예: User)
  checkbox = false,       // 왼쪽 체크박스 표시
  checked = false,        // 체크박스 상태
  onCheckChange,          // (e) => void — 체크박스 변경
  showSwitch = false,     // 오른쪽 스위치 표시
  switchChecked = false,  // 스위치 상태
  onSwitchChange,         // (e) => void — 스위치 변경
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
      ? 'text-list-selected-text'
      : 'text-list-default-text';
  const ellipsisColor = disabled ? 'text-list-disabled-icon' : 'text-list-default-icon';
  // 아이콘(왼쪽 lucide · 오른쪽 chevron) 공통 색: disabled→회색, selected→파랑, 그 외 기본
  const iconColor = disabled
    ? 'text-list-disabled-icon'
    : selected
      ? 'text-list-selected-icon'
      : 'text-list-default-icon';

  // 체크박스·스위치는 행 onClick과 분리한다(직접 클릭 시 각자 onChange만 발화 → 행 핸들러로 전파 차단)
  const stop = (e) => e.stopPropagation();

  // 체크박스가 있으면 행 전체를 체크박스 클릭 영역으로 — 행 어디를 눌러도 토글된다.
  // (체크박스를 직접 누른 경우는 stop으로 전파가 막혀 여기로 오지 않으므로 이중 토글이 없다.)
  const handleRowClick = (e) => {
    if (!interactive) return;
    if (checkbox) onCheckChange?.({ target: { checked: !checked } });
    onClick?.(e);
  };

  return (
    <div
      role="option"
      aria-selected={selected || undefined}
      aria-disabled={disabled || undefined}
      onClick={interactive ? handleRowClick : undefined}
      className={`flex min-h-[32px] w-full items-center justify-between px-spacing-6 py-spacing-3 transition-colors ${rowBg} ${className}`}
      {...props}
    >
      {/* left: tag · checkbox · icon · title (말줄임 시 hover 툴팁 — TruncatingText) */}
      <div className="flex min-w-0 flex-1 items-center gap-spacing-4">
        {tag && <Tag>{tagText}</Tag>}
        {checkbox && (
          <span className="flex shrink-0 items-center" onClick={stop}>
            <Checkbox checked={checked} onChange={onCheckChange} disabled={disabled} />
          </span>
        )}
        {Icon && <Icon size={16} strokeWidth={1.8} className={`shrink-0 ${iconColor}`} />}
        <TruncatingText className={`min-w-0 flex-1 text-14 ${titleColor}`}>
          {title}
        </TruncatingText>
      </div>

      {/* right: switch · 고스트 ⋯ 버튼 · chevron */}
      {(showSwitch || rightButton || endIcon) && (
        <div className="flex shrink-0 items-center gap-spacing-2">
          {showSwitch && (
            <span className="flex shrink-0 items-center" onClick={stop}>
              <Switch checked={switchChecked} onChange={onSwitchChange} disabled={disabled} />
            </span>
          )}
          {rightButton && (
            <button
              type="button"
              disabled={disabled}
              onClick={(e) => {
                e.stopPropagation();
                onButtonClick?.(e);
              }}
              className="flex min-h-[24px] min-w-[24px] items-center justify-center rounded-round-4 p-spacing-2 opacity-80 transition-colors hover:bg-button-ghost-hover-bg disabled:cursor-not-allowed"
              aria-label="더보기"
            >
              <MoreHorizontal size={14} strokeWidth={1.8} className={ellipsisColor} />
            </button>
          )}
          {endIcon && <ChevronRight size={16} strokeWidth={1.8} className={iconColor} />}
        </div>
      )}
    </div>
  );
}
