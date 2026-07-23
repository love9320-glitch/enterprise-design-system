// SideNavigationTemplate — 좌측 사이드 내비게이션 + 우측 콘텐츠 2단 템플릿
// (Figma side navigation Template 8202:61044 — [SideNavigation 180 | gap 16(spacing-7) | 콘텐츠 슬롯 FILL])
// 메뉴는 데이터(menus)로 렌더하고 선택은 내부 상태 또는 controlled(selectedId/onSelect).
// 추가 행(+)은 SideNavigation 내장 기능을 상단(top)으로 사용 — showAdd/addLabel/onAdd 패스스루.
import { useState, useContext, useRef } from 'react';
import type { ComponentPropsWithoutRef, ElementType } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { ModalBodyMaxContext } from './modalContext';
import { SideNavigation, SideNavigationButton } from './SideNavigation';
import { Button } from './Button';
import { Input } from './Input';

// 메뉴 항목 — [{ id, label, count?, icon?, showNewTag?, newTagColor?, disabled? }] — count는 0이면 표시 안 함
interface SideNavigationMenu {
  id: string;
  label: string;
  count?: number;
  icon?: ElementType;
  showNewTag?: boolean;
  newTagColor?: 'blue' | 'red' | 'black';
  disabled?: boolean;
  editable?: boolean; // 템플릿 editable 모드에서 false면 이 메뉴만 수정·삭제 제외('전체' 같은 고정 메뉴)
  showArrow?: boolean; // 이 메뉴만 chevron(›) 표시 여부 재정의 — 미지정 시 템플릿 showArrow 따름
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
  showArrow?: boolean; // 메뉴 우측 chevron(›) 표시 — 전체 기본값(메뉴별 showArrow로 재정의 가능)
  // 템플릿 높이 — 숫자/CSS 길이(고정), 또는 'fill': 모달 안이면 ModalBody 가용 높이(컨텍스트)를
  // '최대치'로 사용(max-height) — 내용이 적으면 자연 높이, 가용 높이에 닿으면 멈추고 내비가 독립 스크롤.
  // 모달 밖 'fill'은 부모 100%. 숫자/CSS는 기존대로 고정 높이(2026-07-06 fill을 height→max-height로 변경).
  height?: number | string;
  // ── 메뉴 편집 모드(2026-07-23) — hover 시 메뉴 우측에 이름 수정·삭제 아이콘 버튼(chevron 왼쪽, 화살표 유지) ──
  editable?: boolean;
  onRenameMenu?: (id: string, label: string) => void; // 이름 입력 행에서 Enter 확정 시
  onDeleteMenu?: (id: string) => void;
  // 신규 메뉴 추가 플로우 — adding=true면 목록 끝에 이름 입력 행 표시(controlled),
  // Enter=onAddSubmit(name) / Esc·blur=onAddCancel. 이름을 먼저 받는 방식(즉시 생성 아님).
  adding?: boolean;
  onAddSubmit?: (label: string) => void;
  onAddCancel?: () => void;
  addPlaceholder?: string;
  renameLabel?: string; // 수정 아이콘 aria-label
  deleteLabel?: string; // 삭제 아이콘 aria-label
}

// 이름 입력 행 — 추가/이름 수정 공용. Enter=확정(빈 값 무시), Esc·blur=취소.
function NameInputRow({
  initial = '',
  placeholder,
  onSubmit,
  onCancel,
}: {
  initial?: string;
  placeholder?: string;
  onSubmit: (name: string) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState(initial);
  const doneRef = useRef(false); // Enter 확정 후 blur가 뒤따라 취소를 덮어쓰지 않게
  const submit = () => {
    const name = value.trim();
    if (!name) return;
    doneRef.current = true;
    onSubmit(name);
  };
  return (
    <div className="w-full pr-spacing-3">
      <Input
        width="100%"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        inputProps={{
          autoFocus: true,
          onKeyDown: (e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              submit();
            } else if (e.key === 'Escape') {
              e.preventDefault();
              doneRef.current = true;
              onCancel();
            }
          },
          onBlur: () => {
            if (!doneRef.current) onCancel();
          },
        }}
      />
    </div>
  );
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
  showArrow = true,
  height,
  editable = false,
  onRenameMenu,
  onDeleteMenu,
  adding = false,
  onAddSubmit,
  onAddCancel,
  addPlaceholder = '이름 입력',
  renameLabel = '이름 수정',
  deleteLabel = '삭제',
  children, // 우측 콘텐츠 슬롯
  className = '',
  ...props
}: SideNavigationTemplateProps) {
  const modalBodyMax = useContext(ModalBodyMaxContext);
  const [editingId, setEditingId] = useState<string | null>(null); // 이름 수정 중인 메뉴 id
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
        {menus.map((m) => {
          if (editable && editingId === m.id) {
            return (
              <NameInputRow
                key={m.id}
                initial={m.label}
                placeholder={addPlaceholder}
                onSubmit={(name) => {
                  setEditingId(null);
                  onRenameMenu?.(m.id, name);
                }}
                onCancel={() => setEditingId(null)}
              />
            );
          }
          // 이 메뉴가 편집 대상인가 — 대상이면 chevron 왼쪽에 수정·삭제 액션(화살표는 유지)
          const rowEditable = editable && !m.disabled && m.editable !== false;
          return (
            <SideNavigationButton
              key={m.id}
              icon={m.icon}
              selected={selected === m.id}
              disabled={m.disabled}
              showNewTag={m.showNewTag}
              newTagColor={m.newTagColor}
              overflow={overflow}
              line={line}
              showArrow={m.showArrow ?? showArrow}
              onClick={() => select(m.id)}
              actions={
                rowEditable ? (
                  <>
                    <Button
                      variant="ghost"
                      size="18"
                      icon={Pencil}
                      aria-label={`${m.label} ${renameLabel}`}
                      tooltip="수정"
                      onClick={() => setEditingId(m.id)}
                    />
                    <Button
                      variant="ghost"
                      size="18"
                      icon={Trash2}
                      aria-label={`${m.label} ${deleteLabel}`}
                      tooltip="삭제"
                      onClick={() => onDeleteMenu?.(m.id)}
                    />
                  </>
                ) : undefined
              }
            >
              {m.count ? `${m.label} ${m.count}` : m.label}
            </SideNavigationButton>
          );
        })}
        {adding && (
          <NameInputRow
            placeholder={addPlaceholder}
            onSubmit={(name) => onAddSubmit?.(name)}
            onCancel={() => onAddCancel?.()}
          />
        )}
      </SideNavigation>
      {/* 우측 콘텐츠 슬롯 — 세로 스택(gap 12 = Figma 슬롯 규격). min-h-0로 높이 제한이 전파되므로
          내용이 상한을 따르려면 fill형 컴포넌트로 구성한다(예: Table maxHeight='fill' + min-h-0 — 규칙 18.
          일반 div만 넣으면 상한을 넘겨 흐른다 — 의도된 슬롯 자율성) */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-spacing-6">{children}</div>
    </div>
  );
}
