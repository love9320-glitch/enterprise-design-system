// SideNavigation — 사이드 내비게이션 (Figma side navigation 8200:51519 / side navigation button 8200:51452)
// 버튼: [아이콘] [라벨] [NewTag] … [chevron ›] 한 행(높이 32, px spacing-6·py spacing-4, 내부 gap spacing-5).
//   state: default / hover(CSS) / select / disabled — 색은 side-nav-* 시멘틱 토큰만 사용.
//   line(attached): 컨테이너 우측 구분선에 붙는 형태(왼쪽만 라운드) / false면 독립형(전체 라운드).
//   select+line은 우측 1px 라인(side-nav-select-text)을 버튼이 직접 가진다(2026-07-06 Figma 개정) —
//   컨테이너 회색 구분선(내부 absolute 라인) 위에 그 행 높이만큼 정확히 겹쳐 선택 표시가 된다.
//   none line(독립형)에는 없음. 이 라인은 border-r이 아니라 absolute 오버레이로 그린다 —
//   border는 border-box 콘텐츠 폭을 1px 줄여 선택 시 화살표가 왼쪽으로 밀린다(2026-07-06 사용자 지적).
// 컨테이너: 세로 스택(gap spacing-2), width 180/220/260(또는 임의 px), line=우측 1px 구분선(side-nav-right-line).
//   구분선은 border가 아니라 내부 absolute 라인으로 그린다 — 행(w-full)이 그 위까지 깔려서
//   선택 행의 파란 오버레이 라인이 구분선과 같은 픽셀 열에 정확히 겹친다(border-r 방식이면 1px 어긋남).
//   add menu(+)는 컨테이너 내장 기능 — showAdd로 on/off, onAdd로 메뉴 추가 동작 연결(2026-07-06 지시).
//   메뉴 목록은 ScrollArea(규칙 9) — 상위 DOM이 높이를 제한하면(h-full·고정 px 부모 등) 내비만 독립 스크롤되고,
//   제한이 없으면 콘텐츠 높이 그대로(스크롤 없음). 추가(+) 행은 스크롤 밖에 고정된다.
import { ChevronRight, Plus } from 'lucide-react';
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { NewTag } from './Tag';
import { ScrollArea } from './ScrollArea';
import { TruncatingText } from './TruncatingText';

const STATE_STYLE = {
  default:
    'text-side-nav-default-text hover:bg-side-nav-hover-bg hover:text-side-nav-hover-text cursor-pointer ' +
    'focus-visible:bg-side-nav-hover-bg focus-visible:text-side-nav-hover-text', // 포커스=호버(2026-07-16)
  select: 'bg-side-nav-select-bg text-side-nav-select-text cursor-pointer',
  disabled: 'text-side-nav-disabled-text cursor-not-allowed',
};

// actions(호버 액션 버튼) 지정 시 — 버튼 안에 버튼을 중첩할 수 없으므로 행 스타일을 wrapper(span)가
// 갖고, 본체 버튼과 액션 버튼들을 형제로 나란히 둔다. hover/키보드 포커스(has-[:focus-visible],
// 포커스=호버 정책 — 클릭 포커스 무표시)에 같은 행 스타일을 적용한다.
const WRAP_STATE_STYLE = {
  default:
    'text-side-nav-default-text hover:bg-side-nav-hover-bg hover:text-side-nav-hover-text cursor-pointer ' +
    'has-[:focus-visible]:bg-side-nav-hover-bg has-[:focus-visible]:text-side-nav-hover-text',
  select: 'bg-side-nav-select-bg text-side-nav-select-text cursor-pointer',
  disabled: 'text-side-nav-disabled-text cursor-not-allowed',
};

export interface SideNavigationButtonProps extends ComponentPropsWithoutRef<'button'> {
  /** 좌측 아이콘(lucide 컴포넌트) — 없으면 생략 */
  icon?: ElementType; // lucide 외 커스텀 아이콘 컴포넌트도 허용
  /** select 상태(파란 텍스트·알파 배경) */
  selected?: boolean;
  /** 라벨 오른쪽 NewTag(N) 표시 */
  showNewTag?: boolean;
  /** NewTag color 패스스루 */
  newTagColor?: 'blue' | 'red' | 'black';
  /** 우측 chevron(›) */
  showArrow?: boolean;
  /** 긴 라벨 처리: 'ellipsis'(말줄임 + hover 전체 툴팁) | 'wrap'(멀티라인 줄바꿈) */
  overflow?: 'ellipsis' | 'wrap';
  /** true=컨테이너 우측 라인에 붙는 형태(왼쪽만 라운드) / false=전체 라운드 */
  line?: boolean;
  /** 행 hover/키보드 포커스 시 우측에 나타나는 아이콘 전용 버튼들(이름 수정·삭제 등).
   *  chevron(›)은 그대로 유지되고 액션은 그 왼쪽에 놓인다(2026-07-23 지시 — 화살표 유지).
   *  디폴트 상태에선 라벨이 액션 자리까지 확장되고, hover/포커스 시 액션이 펼쳐지며 라벨이 줄어든다. */
  actions?: ReactNode;
}

export function SideNavigationButton({
  children = 'side menu',
  icon: Icon,
  selected = false,
  disabled = false,
  showNewTag = false,
  newTagColor = 'blue',
  showArrow = true,
  overflow = 'ellipsis',
  line = true,
  actions,
  onClick,
  className = '',
  ...props
}: SideNavigationButtonProps) {
  const state = disabled ? 'disabled' : selected ? 'select' : 'default';
  const rounding = line ? 'rounded-l-round-4' : 'rounded-round-4';
  const selectLine = state === 'select' && line;

  const content = (
    <span className="flex min-w-0 flex-1 items-center gap-spacing-5">
      {Icon && <Icon size={16} strokeWidth={1.8} className="shrink-0" />}
      {overflow === 'wrap' ? (
        <span className="min-w-0 whitespace-normal break-words text-14 leading-20">{children}</span>
      ) : (
        <TruncatingText as="span" className="truncate text-14 leading-20">
          {children}
        </TruncatingText>
      )}
      {showNewTag && <NewTag color={newTagColor} />}
    </span>
  );

  // actions 지정 — 행 스타일은 wrapper가 갖고 본체/액션 버튼을 형제로 배치(버튼 중첩 불가).
  // 우측 순서: [액션(hover 시 표시)] → [chevron]. 액션 영역은 기본 폭 0(디폴트 상태에선 라벨이
  // 그 자리까지 확장)이고 hover/키보드 포커스 시에만 펼쳐져 라벨이 그만큼 줄어든다(2026-07-23 지시).
  // display:none이 아니라 w-0 + overflow-hidden이라 Tab으로 액션 버튼에 진입 가능(진입하면 펼쳐짐).
  // chevron 영역 클릭도 행 선택으로 동작해야 하므로 wrapper가 클릭을 받되,
  // 본체/액션 버튼에서 버블된 클릭은 무시한다(중복 방지).
  if (actions) {
    return (
      <span
        className={`group relative flex min-h-[32px] w-full items-center pr-spacing-6 transition-colors ${rounding} ${WRAP_STATE_STYLE[state]} ${className}`}
        onClick={
          disabled
            ? undefined
            : (e) => {
                if ((e.target as HTMLElement).closest('button')) return; // 버튼 클릭은 각자 처리
                (onClick as unknown as ((ev: unknown) => void) | undefined)?.(e);
              }
        }
      >
        {selectLine && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-spacing-1 bg-side-nav-select-text"
          />
        )}
        <button
          type="button"
          disabled={disabled}
          onClick={onClick}
          aria-current={selected || undefined}
          className={`flex min-h-[32px] min-w-0 flex-1 items-center py-spacing-4 pl-spacing-6 pr-spacing-2 text-left focus:outline-none ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          {...props}
        >
          {content}
        </button>
        <span className="pointer-events-none flex w-0 shrink-0 items-center gap-spacing-2 overflow-hidden opacity-0 group-hover:pointer-events-auto group-hover:w-auto group-hover:pr-spacing-4 group-hover:opacity-100 group-has-[:focus-visible]:pointer-events-auto group-has-[:focus-visible]:w-auto group-has-[:focus-visible]:pr-spacing-4 group-has-[:focus-visible]:opacity-100">
          {actions}
        </span>
        {showArrow && <ChevronRight size={16} strokeWidth={1.8} className="shrink-0" />}
      </span>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-current={selected || undefined}
      className={`relative flex min-h-[32px] w-full items-center px-spacing-6 py-spacing-4 text-left transition-colors focus:outline-none ${rounding} ${STATE_STYLE[state]} ${className}`}
      {...props}
    >
      {selectLine && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-spacing-1 bg-side-nav-select-text"
        />
      )}
      {content}
      {showArrow && <ChevronRight size={16} strokeWidth={1.8} className="shrink-0" />}
    </button>
  );
}

export interface SideNavigationProps extends ComponentPropsWithoutRef<'nav'> {
  /** 180 | 220 | 260 (Figma variants) 또는 임의 px/CSS 길이 */
  width?: number | string;
  /** 우측 1px 구분선(side-nav-right-line) 표시 */
  line?: boolean;
  /** 'add menu'(+) 행 표시 — 메뉴 추가 기능 on/off */
  showAdd?: boolean;
  addLabel?: ReactNode;
  /** 'bottom' | 'top' — 추가 행 위치(템플릿은 top 사용) */
  addPosition?: 'bottom' | 'top';
  /** (+) 클릭 시 메뉴 추가 동작 */
  onAdd?: () => void;
}

export function SideNavigation({
  children,             // SideNavigationButton들
  width = 180,
  line = true,
  showAdd = true,
  addLabel = 'add menu',
  addPosition = 'bottom',
  onAdd,
  className = '',
  ...props
}: SideNavigationProps) {
  const widthStyle = typeof width === 'number' ? `${width}px` : width;
  return (
    <nav
      style={{ width: widthStyle }}
      className={`relative flex flex-col gap-spacing-2 ${className}`}
      {...props}
    >
      {line && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-spacing-1 bg-side-nav-right-line"
        />
      )}
      {showAdd && addPosition === 'top' && (
        <SideNavigationButton icon={Plus} showArrow={false} line={line} onClick={onAdd}>
          {addLabel}
        </SideNavigationButton>
      )}
      <ScrollArea className="min-h-0 flex-1" contentClassName="max-h-full flex flex-col gap-spacing-2">
        {children}
      </ScrollArea>
      {showAdd && addPosition === 'bottom' && (
        <SideNavigationButton icon={Plus} showArrow={false} line={line} onClick={onAdd}>
          {addLabel}
        </SideNavigationButton>
      )}
    </nav>
  );
}
