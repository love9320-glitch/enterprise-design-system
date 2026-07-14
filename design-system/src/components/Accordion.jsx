// Accordion — 아코디언 (Figma accordion 8416:35290 / accordion list SET 8416:35043)
// 항목을 세로로 쌓고 위·아래·사이를 Divider(default)로 구분한다.
//  - Accordion     : 컨테이너 — children(AccordionItem들)을 Divider로 감싸 배치
//  - AccordionItem : 항목 — [∨/∧ + 리스트 네임] 헤더 + 본문(펼침/접힘)
// 옵션(완전 옵션화):
//  - nameEditable + onTitleChange : 이름 편집(SquarePen → 헤더가 Input+취소/저장으로 전환 — Figma name edit 변형)
//  - deletable + onDelete         : 내부 삭제 버튼(Trash2)
//  - open/defaultOpen/onOpenChange: controlled/uncontrolled 펼침
//  - keepMounted / maxHeight      : 볼륨 콘텐츠 대응 — 본문은 첫 펼침 때 마운트 후 유지(lazy),
//                                   keepMounted=true면 접힌 상태에서도 미리 마운트. maxHeight 지정 시
//                                   본문 내부 스크롤(ScrollArea, 규칙 9)
// 펼침 애니메이션은 grid-rows(0fr→1fr) — 콘텐츠 높이와 무관하게 부드럽고 측정 JS 불필요.
// 색은 accordion-*(list-name)·divider 시멘틱 토큰만 사용. 항목 추가는 외부(사용처 버튼)에서 배열로 관리.
import { Children, Fragment, useState } from 'react';
import { ChevronDown, SquarePen, Trash2 } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { Divider } from './Divider';
import { ScrollArea } from './ScrollArea';
import { TruncatingText } from './TruncatingText';

export function Accordion({ children, className = '', ...props }) {
  const items = Children.toArray(children);
  return (
    <div className={`flex w-full flex-col ${className}`} {...props}>
      <Divider />
      {items.map((child) => (
        <Fragment key={child.key ?? undefined}>
          {child}
          <Divider />
        </Fragment>
      ))}
    </div>
  );
}

export function AccordionItem({
  title = '',
  children,
  defaultOpen = false,
  open: openProp,          // controlled 펼침(선택)
  onOpenChange,            // (open) => void
  nameEditable = false,    // 이름 편집 버튼(SquarePen) 노출
  onTitleChange,           // (title) => void — 저장 시에만(취소/Esc는 폐기)
  deletable = false,       // 삭제 버튼(Trash2) 노출
  deleteDisabled = false,  // 삭제 버튼 비활성(예: 마지막 항목은 삭제 불가)
  onDelete,                // () => void
  keepMounted = false,     // 접힌 상태에서도 본문 마운트(폼 상태 유지 등)
  maxHeight,               // 본문 내부 스크롤 상한(px) — 미지정 시 자연 확장(페이지 스크롤)
  className = '',
  ...props
}) {
  const controlled = openProp !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = controlled ? openProp : internalOpen;
  const setOpen = (v) => {
    if (!controlled) setInternalOpen(v);
    onOpenChange?.(v);
  };

  // 볼륨 콘텐츠 대응 — 본문은 첫 펼침 때 마운트하고 이후 유지(닫힘 애니메이션 중 내용 유지 + 초기 비용 지연)
  const [openedOnce, setOpenedOnce] = useState(defaultOpen || keepMounted);
  if (open && !openedOnce) setOpenedOnce(true); // 렌더 파생 래치(controlled 열림도 포착)
  const mounted = keepMounted || openedOnce;

  // 이름 편집 — 헤더가 Input + 취소/저장(ghost 텍스트 버튼)으로 전환(Figma name edit 변형)
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const startEdit = () => {
    setDraft(title ?? '');
    setEditing(true);
  };
  const cancelEdit = () => setEditing(false);
  const saveEdit = () => {
    setEditing(false);
    const next = draft.trim();
    if (next && next !== title) onTitleChange?.(next);
  };

  return (
    <div className={`w-full ${className}`} {...props}>
      {/* 헤더 */}
      {editing ? (
        <div className="flex w-full items-start gap-spacing-5 py-spacing-5">
          <div className="min-w-0 flex-1">
            <Input
              width="100%"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              inputProps={{
                autoFocus: true,
                onKeyDown: (e) => {
                  if (e.key === 'Enter') saveEdit();
                  if (e.key === 'Escape') cancelEdit();
                },
              }}
            />
          </div>
          <div className="flex shrink-0 items-center gap-spacing-3">
            <Button variant="ghost" size="32" onClick={cancelEdit}>
              취소
            </Button>
            <Button variant="ghost" size="32" onClick={saveEdit}>
              저장
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex w-full items-start gap-spacing-3 p-spacing-5">
          <button
            type="button"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            className="flex h-[32px] min-w-0 flex-1 cursor-pointer items-center gap-spacing-5 text-left"
          >
            {/* Figma: 열림=∨(chevron-down) / 닫힘=∧(180° 회전) */}
            <ChevronDown
              size={16}
              strokeWidth={1.8}
              className={`shrink-0 text-font-icon-5 transition-transform ${open ? '' : 'rotate-180'}`}
            />
            <TruncatingText className="min-w-0 text-14 text-accordion-list-name">{title}</TruncatingText>
          </button>
          {nameEditable && (
            <Button variant="ghost" icon={SquarePen} aria-label="이름 편집" onClick={startEdit} />
          )}
          {deletable && (
            <Button
              variant="ghost"
              icon={Trash2}
              aria-label="리스트 삭제"
              disabled={deleteDisabled}
              onClick={onDelete}
            />
          )}
        </div>
      )}

      {/* 본문 — grid 0fr→1fr 전환(콘텐츠 높이 무관 부드러운 펼침) */}
      <div
        className={`grid transition-[grid-template-rows] duration-200 ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          {mounted && (
            <div className="pb-spacing-6">
              {maxHeight ? <ScrollArea maxHeight={maxHeight}>{children}</ScrollArea> : children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
