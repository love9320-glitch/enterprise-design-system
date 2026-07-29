// Lnb — LNB 메뉴 (Figma menu 8843:8836 / menu group 1depth 8843:9185 · 2depth 8844:9428 /
// site title area 8844:9348 / LNB 8844:9329)
// 조립(규칙 4): LnbMenu(아이템) + LnbMenuGroup(카테고리+스택) + Lnb(컨테이너+사이트 타이틀).
//   - LnbMenu depth: '1'(아이콘 메뉴) | '2'(펼침 부모 — chevron, 닫힘 ▸/열림 ▾) | 'sub'(들여쓴 하위)
//   - 상태: hover(회색 bg)·click(1/sub=선택색, 2=회색 — CSS active)·selected(1/sub=파란 bg+텍스트,
//     2depth의 selected는 '펼침' 표현)·disabled. 색은 lnb/* 시멘틱 토큰만 사용.
//   - Lnb는 데이터 모드(groups+value/onChange, 2depth 펼침 내부 상태)와 조립 모드(children)를 모두 지원.
// 선택·펼침 데이터는 onChange(value)/onToggleExpand로 반출(데이터 반출 계약).
import { useState } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { TruncatingText } from './TruncatingText';

// ── LnbMenu — 메뉴 한 줄 ─────────────────────────────────────────────
interface LnbMenuProps extends ComponentPropsWithoutRef<'button'> {
  label?: ReactNode; // 메뉴명 — 잘리면 hover 툴팁(규칙 8)
  depth?: '1' | '2' | 'sub'; // '1'(아이콘 메뉴, 기본) | '2'(펼침 부모) | 'sub'(들여쓴 하위)
  icon?: LucideIcon | null; // 1depth 왼쪽 아이콘(lucide) — null이면 빈 아이콘 영역 유지
  open?: boolean; // 2depth 전용 — 펼침 여부(chevron 방향)
  selected?: boolean; // 1/sub=파란 배경+텍스트 · 2depth=펼침 상태 표현(배경 없음)
  labelLines?: 1 | 2; // 긴 메뉴명 처리 — 1(말줄임+hover 툴팁, 기본) | 2(2줄까지 줄바꿈 후 클램프+툴팁)
}

export function LnbMenu({
  label,
  depth = '1', // '1' | '2' | 'sub'
  icon: Icon = null, // 1depth 왼쪽 아이콘 — null이면 빈 아이콘 영역 유지
  open = false, // 2depth 전용 — 펼침 여부(chevron 방향)
  selected = false,
  disabled = false,
  labelLines = 1, // 1(말줄임+툴팁) | 2(2줄 클램프+툴팁)
  onClick,
  className = '',
  ...props
}: LnbMenuProps) {
  // 들여쓰기·간격 — sub는 아이콘 영역 없이 좌 32px(spacing-11), 그 외 좌 6px(spacing-4)+아이콘 24px
  const padStyle =
    depth === 'sub' ? 'gap-spacing-3 pl-spacing-11' : 'gap-spacing-2 pl-spacing-4';
  // 상태색 — click(active)은 1/sub=선택색, 2depth=회색(hover와 동일). 포커스=호버 규약.
  const stateStyle = disabled
    ? 'cursor-not-allowed text-lnb-disabled-text'
    : selected && depth !== '2'
      ? 'bg-lnb-select-bg text-lnb-select-text'
      : `cursor-pointer text-lnb-default-text hover:bg-lnb-hover-bg focus-visible:bg-lnb-hover-bg ${
          depth === '2'
            ? 'active:bg-lnb-hover-bg active:text-lnb-hover-text'
            : 'active:bg-lnb-select-bg active:text-lnb-select-text'
        }`;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      aria-expanded={depth === '2' ? open : undefined}
      aria-current={selected && depth !== '2' ? 'page' : undefined}
      // items-start — 메뉴명이 2줄일 때 아이콘(24px 영역=첫 줄 행간)이 첫 줄에 정렬되게(1줄일 땐 동일)
      className={`flex w-full items-start rounded-round-4 py-spacing-3 pr-spacing-5-5 text-left text-14 transition-colors focus:outline-none ${padStyle} ${stateStyle} ${className}`}
      {...props}
    >
      {/* 아이콘 영역 24px — 1depth=커스텀 아이콘, 2depth=펼침 chevron(닫힘 ▸ / 열림 ▾).
          chevron은 컴포넌트 교체 대신 회전 트랜지션으로 접힘/펼침을 부드럽게(2026-07-29 지시) */}
      {depth !== 'sub' && (
        <span className="flex size-[24px] shrink-0 items-center justify-center">
          {depth === '2' ? (
            <ChevronRight
              size={16}
              strokeWidth={1.8}
              className={`transition-transform ${open ? 'rotate-90' : ''}`}
            />
          ) : (
            Icon && <Icon size={16} strokeWidth={1.8} />
          )}
        </span>
      )}
      <TruncatingText as="span" lines={labelLines} className="min-w-0">
        {label}
      </TruncatingText>
    </button>
  );
}

// ── LnbMenuGroup — 카테고리 타이틀 + 메뉴 스택 ───────────────────────
interface LnbMenuGroupProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title'> {
  title?: ReactNode; // 카테고리 텍스트 — null이면 숨김(Figma category text BOOL)
}

export function LnbMenuGroup({ title = null, children, className = '', ...props }: LnbMenuGroupProps) {
  return (
    <div className={`flex w-full flex-col gap-spacing-3 ${className}`} {...props}>
      {title != null && (
        <p className="px-spacing-4 text-12 leading-20 text-lnb-menu-category-text">{title}</p>
      )}
      <div className="flex w-full flex-col gap-spacing-3">{children}</div>
    </div>
  );
}

// ── Lnb — 컨테이너(사이트 타이틀 + 그룹 목록) ────────────────────────
// 데이터 모드 항목 — children이 있으면 2depth 펼침 부모가 된다
export interface LnbItem {
  value: string;
  label: ReactNode;
  icon?: LucideIcon | null; // 1depth 아이콘
  disabled?: boolean;
  children?: { value: string; label: ReactNode; disabled?: boolean }[];
}
export interface LnbGroup {
  key?: string;
  title?: ReactNode; // 카테고리 — 없으면 타이틀 숨김
  items: LnbItem[];
}

interface LnbProps extends Omit<ComponentPropsWithoutRef<'nav'>, 'onChange'> {
  siteTitle?: ReactNode; // 상단 사이트 타이틀(예: DESIGN SYSTEM) — null이면 숨김
  groups?: LnbGroup[]; // 데이터 모드 — 미지정 시 children 조립 모드
  value?: string | null; // controlled 선택 메뉴 value
  defaultValue?: string; // uncontrolled 초기 선택
  onChange?: (value: string) => void; // 메뉴(1depth·sub) 선택 시
  defaultExpanded?: string[]; // 처음부터 펼칠 2depth 부모 value 목록
  onToggleExpand?: (value: string, open: boolean) => void; // 부모 펼침/접힘 알림
  width?: number | string; // 기본 138(Figma) — 숫자(px)/CSS 길이
  menuLabelLines?: 1 | 2; // 메뉴명 처리 일괄 — 1(말줄임+툴팁) | 2(2줄 클램프+툴팁)
}

export function Lnb({
  siteTitle = null,
  groups,
  value: valueProp,
  defaultValue,
  onChange,
  defaultExpanded = [],
  onToggleExpand,
  width = 138, // Figma LNB 기본 폭
  menuLabelLines = 1, // 메뉴명 일괄 — 1(말줄임) | 2(2줄 클램프)
  children,
  className = '',
  ...props
}: LnbProps) {
  // 선택(controlled/uncontrolled) — 부모(2depth)는 선택 대상이 아니라 펼침 토글만 한다
  const controlled = valueProp !== undefined;
  const [internalValue, setInternalValue] = useState<string | null>(defaultValue ?? null);
  const selected = controlled ? valueProp : internalValue;
  const select = (v: string) => {
    if (!controlled) setInternalValue(v);
    onChange?.(v);
  };
  // 2depth 펼침 상태 — 내부 소유, 토글 알림만 반출
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(defaultExpanded));
  const toggle = (v: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      const willOpen = !next.has(v);
      if (willOpen) next.add(v);
      else next.delete(v);
      onToggleExpand?.(v, willOpen);
      return next;
    });
  };

  return (
    <nav
      style={{ width: typeof width === 'number' ? `${width}px` : width }}
      className={`flex shrink-0 flex-col gap-spacing-9 p-spacing-6 ${className}`}
      {...props}
    >
      {siteTitle != null && (
        <div className="text-20 font-semibold leading-25 text-lnb-title-text">{siteTitle}</div>
      )}
      {groups
        ? groups.map((g, gi) => (
            <LnbMenuGroup key={g.key ?? gi} title={g.title}>
              {g.items.map((item) => {
                const isParent = (item.children?.length ?? 0) > 0;
                const open = expanded.has(item.value);
                return (
                  <div key={item.value} className="flex w-full flex-col gap-spacing-3">
                    <LnbMenu
                      label={item.label}
                      labelLines={menuLabelLines}
                      depth={isParent ? '2' : '1'}
                      icon={item.icon}
                      open={open}
                      selected={isParent ? open : selected === item.value}
                      disabled={item.disabled}
                      onClick={() => (isParent ? toggle(item.value) : select(item.value))}
                    />
                    {isParent &&
                      open &&
                      item.children!.map((sub) => (
                        <LnbMenu
                          key={sub.value}
                          label={sub.label}
                          labelLines={menuLabelLines}
                          depth="sub"
                          selected={selected === sub.value}
                          disabled={sub.disabled}
                          onClick={() => select(sub.value)}
                        />
                      ))}
                  </div>
                );
              })}
            </LnbMenuGroup>
          ))
        : children}
    </nav>
  );
}
