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
import type { LucideIcon } from 'lucide-react';
import type { ComponentPropsWithoutRef, MouseEvent, ReactNode } from 'react';
import { Tag } from './Tag';
import { Checkbox } from './Checkbox';
import { Radio } from './Radio';
import { Switch } from './Switch';
import { TruncatingText } from './TruncatingText';

// 체크박스/라디오/스위치 변경 이벤트 — 행 클릭 합성 이벤트({ target:{ checked } })와 실제 change 이벤트 겸용
type CheckChangeEvent = { target: { checked: boolean } };

interface ListProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title'> {
  title?: ReactNode;
  tag?: boolean;                 // 태그 표시 여부
  tagText?: ReactNode;
  icon?: LucideIcon | null;      // 왼쪽 lucide 아이콘 (예: User)
  checkbox?: boolean;            // 왼쪽 체크박스 표시(다중 선택)
  radio?: boolean;               // 왼쪽 라디오 표시(단일 선택) — checkbox와 배타. checked/onCheckChange 공용
  checked?: boolean;             // 체크박스/라디오 선택 상태
  onCheckChange?: (e: CheckChangeEvent) => void; // (e) => void — 체크박스/라디오 변경(e.target.checked)
  showSwitch?: boolean;          // 오른쪽 스위치 표시
  switchChecked?: boolean;       // 스위치 상태
  onSwitchChange?: (e: CheckChangeEvent) => void; // (e) => void — 스위치 변경
  rightButton?: boolean;         // 고스트 아이콘 버튼 (기본 ⋯)
  rightButtonIcon?: LucideIcon;  // 우측 버튼 아이콘(lucide) — 예: Trash2(삭제)
  rightButtonAriaLabel?: string; // 우측 버튼 aria-label
  endIcon?: boolean;             // chevron-right
  rightSlot?: ReactNode;         // 우측 임의 콘텐츠(입력칸+단위 등) — 행 클릭과 분리(자체 stopPropagation은 사용처가)
  selected?: boolean;
  highlighted?: boolean;         // 키보드 내비게이션 강조 (hover 색)
  disabled?: boolean;
  onButtonClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

export function List({
  title = 'list',
  tag = false,            // 태그 표시 여부
  tagText = '태그',
  icon: Icon = null,      // 왼쪽 lucide 아이콘 (예: User)
  checkbox = false,       // 왼쪽 체크박스 표시(다중 선택)
  radio = false,          // 왼쪽 라디오 표시(단일 선택) — checkbox와 배타. checked/onCheckChange 공용
  checked = false,        // 체크박스/라디오 선택 상태
  onCheckChange,          // (e) => void — 체크박스/라디오 변경(e.target.checked)
  showSwitch = false,     // 오른쪽 스위치 표시
  switchChecked = false,  // 스위치 상태
  onSwitchChange,         // (e) => void — 스위치 변경
  rightButton = false,    // 고스트 아이콘 버튼 (기본 ⋯)
  rightButtonIcon: RightButtonIcon = MoreHorizontal, // 우측 버튼 아이콘(lucide) — 예: Trash2(삭제)
  rightButtonAriaLabel = '더보기', // 우측 버튼 aria-label
  endIcon = false,        // chevron-right
  rightSlot = null,       // 우측 임의 콘텐츠(입력칸+단위 등) — 행 클릭과 분리(자체 stopPropagation은 사용처가)
  selected = false,
  highlighted = false, // 키보드 내비게이션 강조 (hover 색)
  disabled = false,
  onClick,
  onButtonClick,
  className = '',
  ...props
}: ListProps) {
  const interactive = !disabled;
  // 라디오 행은 hover/pressed 배경 없음(선택 표시는 라디오가 담당) + 내부 상하 패딩 제거(2026-07-09 지시)
  const noHover = radio;

  const rowBg = disabled
    ? 'bg-list-default-bg cursor-not-allowed'
    : highlighted && !noHover
      ? 'bg-list-hover-bg cursor-pointer' // 키보드 강조 우선
      : selected || noHover
        ? 'bg-list-default-bg cursor-pointer' // 선택·라디오: hover/pressed 효과 없음
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
  const stop = (e: MouseEvent<HTMLSpanElement>) => e.stopPropagation();

  // 체크박스/라디오가 있으면 행 전체가 클릭 영역이 된다 — 행 어디를 눌러도 체크박스는 토글, 라디오는 선택.
  // (컨트롤을 직접 누른 경우는 stop으로 전파가 막혀 여기로 오지 않으므로 이중 처리가 없다.)
  const handleRowClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    if (checkbox) onCheckChange?.({ target: { checked: !checked } });
    else if (radio && !checked) onCheckChange?.({ target: { checked: true } }); // 라디오는 선택만(해제 없음)
    onClick?.(e);
  };

  return (
    <div
      role="option"
      aria-selected={selected || undefined}
      aria-disabled={disabled || undefined}
      onClick={interactive ? handleRowClick : undefined}
      className={`flex min-h-[32px] w-full items-center justify-between px-spacing-6 ${
        noHover ? '' : 'py-spacing-3'
      } transition-colors ${rowBg} ${className}`}
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
        {radio && !checkbox && (
          <span className="flex shrink-0 items-center" onClick={stop}>
            <Radio checked={checked} onChange={onCheckChange} disabled={disabled} />
          </span>
        )}
        {Icon && <Icon size={16} strokeWidth={1.8} className={`shrink-0 ${iconColor}`} />}
        <TruncatingText className={`min-w-0 flex-1 text-14 ${titleColor}`}>
          {title}
        </TruncatingText>
      </div>

      {/* right: 임의 슬롯 · switch · 고스트 ⋯ 버튼 · chevron */}
      {(rightSlot || showSwitch || rightButton || endIcon) && (
        <div className="flex shrink-0 items-center gap-spacing-2">
          {rightSlot}
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
              className="flex min-h-[24px] min-w-[24px] items-center justify-center rounded-round-4 p-spacing-2 opacity-80 transition-colors hover:bg-button-ghost-hover-bg focus:outline-none focus-visible:bg-button-ghost-hover-bg disabled:cursor-not-allowed"
              aria-label={rightButtonAriaLabel}
            >
              <RightButtonIcon size={14} strokeWidth={1.8} className={ellipsisColor} />
            </button>
          )}
          {endIcon && <ChevronRight size={16} strokeWidth={1.8} className={iconColor} />}
        </div>
      )}
    </div>
  );
}
