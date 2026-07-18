// Pagination — 페이지네이션 (Figma node 7263:1752839)
// 구성: [총 N개] · [« ‹ 번호들 › »] · [페이지 행 Select]
//  - « / »(chevrons): 처음/마지막 페이지, ‹ / ›(chevron): 이전/다음 페이지
//  - 현재 페이지: state="selected" (ghost select 토큰 — 회색 원형 배경 + 흰 텍스트)
//  - 경계에서 이동 아이콘은 state="disabled" (ghost disabled 토큰으로 흐림) 처리하고 클릭을 막는다
//  - 페이지 번호는 maxButtons(기본 10) 단위 블록으로 노출(슬라이딩 X, 번호 5개/10개 등)
//  - 색·간격·라운드는 모두 토큰 사용, 인라인 style 금지
import { useState } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { iconTokens } from '../tokens';
import { Select } from './Select';
import { useHoverTooltip } from './useHoverTooltip';

const DEFAULT_PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

// 공통 버튼 박스 — 최소 24px 정사각(min-w/min-h) + 좌우 패딩.
// 라운드는 모든 상태에서 round-10(24px)로 통일 → 1~2자리는 원형, 3자리(100~)부터
// 고정폭이 아니라 내용폭만큼 좌우로 늘어난다.
const BTN_BASE =
  'inline-flex items-center justify-center min-w-[24px] min-h-[24px] px-spacing-3 ' +
  'rounded-round-10 font-pretendard font-normal text-14 transition-colors select-none focus:outline-none';

// hover = ghost-hover-bg, pressed(active) = 투명. 색은 기존 ghost 버튼 시멘틱 토큰 재사용.
const BTN_INTERACTIVE =
  'cursor-pointer hover:bg-button-ghost-hover-bg active:bg-transparent ' +
  'focus-visible:bg-button-ghost-hover-bg'; // 포커스=호버(2026-07-16)

// 현재 페이지가 속한 '블록'의 번호 목록 계산.
// maxButtons 단위로 페이지를 고정 그룹핑한다(슬라이딩 X) — 같은 블록 안의 번호를
// 눌러도 윈도우가 움직이지 않고 selected만 바뀐다. (예: max=5, 총 10 → [1-5],[6-10])
function getPageWindow(current: number, total: number, maxButtons: number) {
  const block = Math.floor((current - 1) / maxButtons);
  const start = block * maxButtons + 1;
  const end = Math.min(start + maxButtons - 1, total);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

// 버튼 상태별 스타일 — 배경 라운드는 모든 상태에서 BTN_BASE의 round-10(24px)
//  default : hover 시 ghost-hover-bg, pressed 시 투명 (텍스트색은 type별로 분기)
//  selected: 현재 페이지 — 회색 원형 + 흰 텍스트(고정)
//  disabled: 경계 아이콘 — 흐림 + 클릭 불가
const STATE_STYLES = {
  selected: 'cursor-default bg-button-ghost-selected-bg text-button-ghost-selected-text',
  disabled: 'cursor-not-allowed text-button-ghost-disabled-fg',
};

// default 상태 텍스트색 — 번호는 pagination 토큰(연함)에서 hover/pressed 시 default-fg로 진해지고,
// 아이콘은 항상 default-fg(진함). (Figma: ghost/gray default text (pagination) = gray.300)
const DEFAULT_TEXT = {
  number: 'text-button-ghost-pagination-fg hover:text-button-ghost-default-fg active:text-button-ghost-default-fg focus-visible:text-button-ghost-default-fg',
  icon: 'text-button-ghost-default-fg',
};

// 페이지네이션 버튼 — number/icon 타입 × state(default/selected/disabled)
interface PaginationButtonProps {
  state?: 'default' | 'selected' | 'disabled';
  type?: 'number' | 'icon';
  icon?: LucideIcon;
  label?: string;
  children?: ReactNode;
  onClick?: () => void;
}

function PaginationButton({ state = 'default', type = 'number', icon: Icon, label, children, onClick }: PaginationButtonProps) {
  const interactive = state === 'default';
  const stateStyle =
    state === 'default' ? `${DEFAULT_TEXT[type]} ${BTN_INTERACTIVE}` : STATE_STYLES[state];
  // 아이콘 버튼(첫/이전/다음/마지막)은 명칭이 안 보이므로 hover 툴팁으로 알려준다(base Button과 동일 패턴)
  const hoverTip = useHoverTooltip(type === 'icon' ? label : null);
  return (
    <>
    <button
      type="button"
      className={`${BTN_BASE} ${stateStyle}`}
      aria-current={state === 'selected' ? 'page' : undefined}
      aria-label={type === 'icon' ? label : undefined}
      disabled={state === 'disabled'}
      onClick={interactive ? onClick : undefined}
      onMouseEnter={hoverTip.onMouseEnter}
      onMouseLeave={hoverTip.onMouseLeave}
    >
      {type === 'icon' && Icon ? (
        <Icon size={iconTokens.size} strokeWidth={iconTokens.strokeWidth} />
      ) : (
        children
      )}
    </button>
    {hoverTip.tooltip}
    </>
  );
}

export interface PaginationProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange'> {
  /** 현재 페이지(1-base) — controlled */
  page?: number;
  /** uncontrolled 초기값 */
  defaultPage?: number;
  /** (page: number) => void */
  onChange?: (page: number) => void;
  /** 총 항목 수 — totalPages 미지정 시 페이지 수 계산에 사용 */
  totalCount?: number;
  /** 총 페이지 수(지정 시 totalCount/pageSize보다 우선) */
  totalPages?: number;
  /** 페이지당 행 수 — controlled */
  pageSize?: number;
  /** 페이지당 행 수 초기값(옵션 5/10/20/50 중 기본 10) */
  defaultPageSize?: number;
  /** (size: number) => void */
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  /** 번호 노출 개수(윈도우) — 보통 10 또는 5 */
  maxButtons?: number;
  /** 좌측 '총 N개' 표시 */
  showTotal?: boolean;
  /** 우측 '페이지 행' Select 표시 */
  showPageSize?: boolean;
}

export function Pagination({
  page,
  defaultPage = 1,
  onChange,
  totalCount = 0,
  totalPages,
  pageSize,
  defaultPageSize = 10,
  onPageSizeChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  maxButtons = 10,
  showTotal = true,
  showPageSize = true,
  className = '',
  ...props
}: PaginationProps) {
  const isPageControlled = page !== undefined;
  const [internalPage, setInternalPage] = useState(defaultPage);
  const current = isPageControlled ? (page as number) : internalPage;

  const isSizeControlled = pageSize !== undefined;
  const [internalSize, setInternalSize] = useState(defaultPageSize);
  const size = isSizeControlled ? (pageSize as number) : internalSize;

  // 총 페이지 수 — totalPages가 있으면 우선, 없으면 totalCount/페이지크기로 계산.
  const getTotalPages = (s: number) =>
    totalPages != null ? totalPages : Math.max(1, Math.ceil(totalCount / s));
  const computedTotalPages = getTotalPages(size);

  const goTo = (next: number) => {
    const clamped = Math.min(Math.max(next, 1), computedTotalPages);
    if (clamped === current) return;
    if (!isPageControlled) setInternalPage(clamped);
    onChange?.(clamped);
  };

  const handleSizeChange = (e: { target: { value: string | number } }) => {
    const next = Number(e.target.value);
    if (!isSizeControlled) setInternalSize(next);
    onPageSizeChange?.(next);
    // 페이지 수가 줄면 현재 페이지가 범위를 벗어날 수 있어 보정
    const nextTotal = getTotalPages(next);
    if (current > nextTotal) goTo(nextTotal);
  };

  const pages = getPageWindow(current, computedTotalPages, maxButtons);
  const atFirst = current <= 1;
  const atLast = current >= computedTotalPages;

  // totalPages를 외부에서 고정했는데 onPageSizeChange가 없으면 '페이지 행' Select는
  // 바꿔도 아무것도 달라지지 않는 무반응 UI가 된다(기본값 조합 충돌) → 자동 숨김.
  const pageSizeVisible = showPageSize && !(totalPages != null && !onPageSizeChange);

  const sizeSelectOptions = pageSizeOptions.map((n) => ({ value: n, label: `${n}개` }));

  return (
    <div
      // min-h-[32px]: '페이지 행' Select(32px)가 숨겨져도(showPageSize=false) 행 높이가
      // 번호 버튼(24px) 기준으로 줄지 않도록 고정한다.
      className={`grid min-h-[32px] grid-cols-3 items-center gap-spacing-9 ${className}`}
      {...props}
    >
      {/* 좌: 총 개수 */}
      <div className="justify-self-start">
        {showTotal && (
          <p className="text-14 text-font-icon-5">총 {totalCount}개</p>
        )}
      </div>

      {/* 중: 페이지 이동 컨트롤 */}
      <div className="flex items-center justify-center gap-spacing-3 justify-self-center">
        <PaginationButton type="icon" icon={ChevronsLeft} label="첫 페이지" state={atFirst ? 'disabled' : 'default'} onClick={() => goTo(1)} />
        <PaginationButton type="icon" icon={ChevronLeft} label="이전 페이지" state={atFirst ? 'disabled' : 'default'} onClick={() => goTo(current - 1)} />
        {pages.map((p) => (
          <PaginationButton key={p} state={p === current ? 'selected' : 'default'} onClick={() => goTo(p)}>
            {p}
          </PaginationButton>
        ))}
        <PaginationButton type="icon" icon={ChevronRight} label="다음 페이지" state={atLast ? 'disabled' : 'default'} onClick={() => goTo(current + 1)} />
        <PaginationButton type="icon" icon={ChevronsRight} label="마지막 페이지" state={atLast ? 'disabled' : 'default'} onClick={() => goTo(computedTotalPages)} />
      </div>

      {/* 우: 페이지 행 선택 */}
      <div className="flex items-center gap-spacing-5 justify-self-end">
        {pageSizeVisible && (
          <>
            <span className="whitespace-nowrap text-14 text-font-icon-5">페이지 행</span>
            <Select
              variant="text"
              size="24"
              placement="auto-right"
              menuWidth={80}
              // 옵션 값은 숫자(pageSizeOptions) 그대로 사용 — Select 타입 계약(string)과 다르지만
              // 런타임 비교(===)는 양쪽 다 숫자라 기존 동작과 동일(타입 단언만, 값 변환 없음)
              options={sizeSelectOptions as unknown as { value: string; label: string }[]}
              value={size as unknown as string}
              onChange={handleSizeChange}
            />
          </>
        )}
      </div>
    </div>
  );
}
