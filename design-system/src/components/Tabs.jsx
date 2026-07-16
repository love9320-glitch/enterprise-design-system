// Tabs — 탭 (Figma tab, node 7371:3233)
//   - TabMenu : 탭 1개 (아이콘 / 텍스트 / 태그). 상태 default·select·disabled(+hover)
//   - Tabs    : 탭들을 묶어 단일 선택을 관리하는 그룹. variant hug(내용 폭) / fill(균등 분할)
//     · 선택 탭은 하단 2px underline, 그룹은 하단 1px 구분선(겹쳐서 표시)
//     · rightSlot으로 우측에 임의 요소(예: '설정' Select)를 둘 수 있다(justify-between)
// 색은 tab-* 시멘틱 토큰만 사용. controlled/uncontrolled 모두 지원.
import { useState } from 'react';
import { Tag } from './Tag';

export function TabMenu({
  children,
  icon: Icon = null,
  tag = false,
  tagText = '태그',
  tagType = 'blue',       // Tag 타입: 'blue' | 'red' | 'gray'
  selected = false,
  disabled = false,
  onClick,
  className = '',
  ...props
}) {
  const base =
    'relative inline-flex h-[32px] items-center justify-center gap-spacing-4 ' +
    'px-spacing-5 border-b-2 -mb-px font-pretendard text-14 whitespace-nowrap ' +
    'transition-colors select-none focus:outline-none';

  let colorStyle;
  if (disabled) {
    colorStyle = 'text-tab-disabled-text border-transparent cursor-not-allowed';
  } else if (selected) {
    colorStyle = 'text-tab-selected-text border-tab-selected-underline cursor-pointer';
  } else {
    colorStyle =
      'text-tab-default-text border-transparent cursor-pointer ' +
      'hover:text-tab-hover-text hover:border-tab-hover-underline ' +
      'focus-visible:text-tab-hover-text focus-visible:border-tab-hover-underline'; // 포커스=호버(2026-07-16)
  }

  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      disabled={disabled}
      onClick={!disabled ? onClick : undefined}
      className={`${base} ${colorStyle} ${className}`}
      {...props}
    >
      {Icon && <Icon size={16} strokeWidth={1.8} className="shrink-0" />}
      {children}
      {tag && <Tag color={tagType}>{tagText}</Tag>}
    </button>
  );
}

export function Tabs({
  items = [],             // [{ value, label, icon?, tag?, tagText?, tagType?, disabled? }]
  value,                  // controlled 선택값
  defaultValue,           // uncontrolled 초기 선택값
  onChange,               // (value) => void
  variant = 'hug',        // 'hug' | 'fill'
  rightSlot = null,       // 우측 임의 요소(ReactNode)
  className = '',
  ...props
}) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue);
  // 첫 탭 폴백은 렌더 파생값 — mount 시 items가 빈 배열(비동기 로드)이어도 도착 후 첫 탭이 선택된다
  const selected = isControlled ? value : (internal ?? items[0]?.value);

  const handleSelect = (val) => {
    if (!isControlled) setInternal(val);
    onChange?.(val);
  };

  const isFill = variant === 'fill';

  const tabEls = items.map((it) => (
    <TabMenu
      key={it.value}
      icon={it.icon}
      tag={it.tag}
      tagText={it.tagText}
      tagType={it.tagType}
      selected={selected === it.value}
      disabled={it.disabled}
      onClick={() => handleSelect(it.value)}
      className={isFill ? 'flex-1 min-w-px' : ''}
    >
      {it.label}
    </TabMenu>
  ));

  return (
    <div
      role="tablist"
      className={`flex w-full border-b border-tab-group-underline ${
        rightSlot ? 'items-center justify-between' : ''
      } ${className}`}
      {...props}
    >
      <div className={`flex items-center gap-spacing-5 ${isFill ? 'w-full' : ''}`}>
        {tabEls}
      </div>
      {rightSlot && <div className="flex shrink-0 items-center">{rightSlot}</div>}
    </div>
  );
}
