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
import { NewTag } from './Tag';
import { ScrollArea } from './ScrollArea';
import { TruncatingText } from './TruncatingText';

const STATE_STYLE = {
  default:
    'text-side-nav-default-text hover:bg-side-nav-hover-bg hover:text-side-nav-hover-text cursor-pointer',
  select: 'bg-side-nav-select-bg text-side-nav-select-text cursor-pointer',
  disabled: 'text-side-nav-disabled-text cursor-not-allowed',
};

export function SideNavigationButton({
  children = 'side menu',
  icon: Icon,            // 좌측 아이콘(lucide 컴포넌트) — 없으면 생략
  selected = false,      // select 상태(파란 텍스트·알파 배경)
  disabled = false,
  showNewTag = false,    // 라벨 오른쪽 NewTag(N) 표시
  newTagColor = 'blue',  // NewTag color 패스스루
  showArrow = true,      // 우측 chevron(›)
  overflow = 'ellipsis', // 긴 라벨 처리: 'ellipsis'(말줄임 + hover 전체 툴팁) | 'wrap'(멀티라인 줄바꿈)
  line = true,           // true=컨테이너 우측 라인에 붙는 형태(왼쪽만 라운드) / false=전체 라운드
  onClick,
  className = '',
  ...props
}: any) {
  const state = disabled ? 'disabled' : selected ? 'select' : 'default';
  const rounding = line ? 'rounded-l-round-4' : 'rounded-round-4';
  const selectLine = state === 'select' && line;
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-current={selected || undefined}
      className={`relative flex min-h-[32px] w-full items-center px-spacing-6 py-spacing-4 text-left transition-colors ${rounding} ${STATE_STYLE[state]} ${className}`}
      {...props}
    >
      {selectLine && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-spacing-1 bg-side-nav-select-text"
        />
      )}
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
      {showArrow && <ChevronRight size={16} strokeWidth={1.8} className="shrink-0" />}
    </button>
  );
}

export function SideNavigation({
  children,             // SideNavigationButton들
  width = 180,          // 180 | 220 | 260 (Figma variants) 또는 임의 px/CSS 길이
  line = true,          // 우측 1px 구분선(side-nav-right-line) 표시
  showAdd = true,       // 'add menu'(+) 행 표시 — 메뉴 추가 기능 on/off
  addLabel = 'add menu',
  addPosition = 'bottom', // 'bottom' | 'top' — 추가 행 위치(템플릿은 top 사용)
  onAdd,                // (+) 클릭 시 메뉴 추가 동작
  className = '',
  ...props
}: any) {
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
