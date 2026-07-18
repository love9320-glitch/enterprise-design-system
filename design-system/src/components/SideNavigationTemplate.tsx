// SideNavigationTemplate — 좌측 사이드 내비게이션 + 우측 콘텐츠 2단 템플릿
// (Figma side navigation Template 8202:61044 — [SideNavigation 180 | gap 16(spacing-7) | 콘텐츠 슬롯 FILL])
// 메뉴는 데이터(menus)로 렌더하고 선택은 내부 상태 또는 controlled(selectedId/onSelect).
// 추가 행(+)은 SideNavigation 내장 기능을 상단(top)으로 사용 — showAdd/addLabel/onAdd 패스스루.
import { useState, useContext } from 'react';
import type { ComponentPropsWithoutRef, ElementType } from 'react';
import { ModalBodyMaxContext } from './modalContext';
import { SideNavigation, SideNavigationButton } from './SideNavigation';

// 메뉴 항목 — [{ id, label, count?, icon?, showNewTag?, newTagColor?, disabled? }] — count는 0이면 표시 안 함
interface SideNavigationMenu {
  id: string;
  label: string;
  count?: number;
  icon?: ElementType;
  showNewTag?: boolean;
  newTagColor?: 'blue' | 'red' | 'black';
  disabled?: boolean;
}

interface SideNavigationTemplateProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange' | 'onSelect'> {
  menus?: SideNavigationMenu[];
  selectedId?: string; // controlled 선택 id
  defaultSelectedId?: string; // uncontrolled 초기 선택
  onSelect?: (id: string) => void;
  navWidth?: number; // 좌측 내비 너비 (Figma 180/220/260)
  line?: boolean; // 내비 우측 구분선
  showAdd?: boolean; // 추가(+) 행 — 메뉴 추가 기능 on/off
  addLabel?: string;
  addPosition?: 'top' | 'bottom'; // 'top'(Figma 템플릿 기본) | 'bottom' — 추가 행 위치
  onAdd?: () => void;
  overflow?: 'ellipsis' | 'wrap'; // 메뉴 라벨 긴 경우 처리 — SideNavigationButton 패스스루
  // 템플릿 높이 — 숫자/CSS 길이(고정), 또는 'fill': 모달 안이면 ModalBody 가용 높이(컨텍스트)를
  // '최대치'로 사용(max-height) — 내용이 적으면 자연 높이, 가용 높이에 닿으면 멈추고 내비가 독립 스크롤.
  // 모달 밖 'fill'은 부모 100%. 숫자/CSS는 기존대로 고정 높이(2026-07-06 fill을 height→max-height로 변경).
  height?: number | string;
}

export function SideNavigationTemplate({
  menus = [],
  selectedId: selectedProp, // controlled 선택 id
  defaultSelectedId, // uncontrolled 초기 선택
  onSelect,
  navWidth = 180,
  line = true,
  showAdd = true,
  addLabel = 'add menu',
  addPosition = 'top',
  onAdd,
  overflow = 'ellipsis',
  height,
  children, // 우측 콘텐츠 슬롯
  className = '',
  ...props
}: SideNavigationTemplateProps) {
  const modalBodyMax = useContext(ModalBodyMaxContext);
  // fill=최대치(max-height — 내용 적으면 자연 높이), 숫자/CSS=고정(height)
  const isFill = height === 'fill';
  const fillMax = isFill ? (modalBodyMax != null ? `${modalBodyMax}px` : '100%') : null;
  const fixedHeight = !isFill ? (typeof height === 'number' ? `${height}px` : height) : null;

  const controlled = selectedProp !== undefined;
  const [internal, setInternal] = useState<string | undefined>(defaultSelectedId);
  // 첫 메뉴 폴백은 렌더 파생값 — mount 시 menus가 빈 배열(비동기 로드)이어도 도착 후 첫 메뉴가 선택된다
  const selected = controlled ? selectedProp : (internal ?? menus[0]?.id ?? null);
  const select = (id: string) => {
    if (!controlled) setInternal(id);
    onSelect?.(id);
  };

  return (
    <div style={fixedHeight ? { height: fixedHeight } : fillMax ? { maxHeight: fillMax } : undefined} className={`flex min-h-0 items-stretch gap-spacing-7 ${className}`} {...props}>
      <SideNavigation
        width={navWidth}
        line={line}
        showAdd={showAdd}
        addLabel={addLabel}
        addPosition={addPosition}
        onAdd={onAdd}
        className="shrink-0"
      >
        {menus.map((m) => (
          <SideNavigationButton
            key={m.id}
            icon={m.icon}
            selected={selected === m.id}
            disabled={m.disabled}
            showNewTag={m.showNewTag}
            newTagColor={m.newTagColor}
            overflow={overflow}
            line={line}
            onClick={() => select(m.id)}
          >
            {m.count ? `${m.label} ${m.count}` : m.label}
          </SideNavigationButton>
        ))}
      </SideNavigation>
      {/* 우측 콘텐츠 슬롯 — 세로 스택(gap 12 = Figma 슬롯 규격) */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-spacing-6">{children}</div>
    </div>
  );
}
