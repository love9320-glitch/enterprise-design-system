// TableTemplate — 목록 페이지 템플릿 (table control + Table + Pagination 조합)
// 버튼그룹·검색바·테이블·페이지네이션을 한 덩어리로 묶은 완전 옵션형 템플릿(규칙 4).
// 각 요소를 props로 끄고 켤 수 있다:
//   - actions      : 버튼그룹 내용(ReactNode 또는 (ctx) => ReactNode). null이면 버튼그룹 자체를 숨김
//   - title        : 테이블 타이틀. 있으면 헤더 좌측(버튼그룹 왼쪽)에 표시(버튼그룹/검색바와 함께 가능)
//   - searchable   : 검색바 on/off (false면 숨김)
//   - pagination   : 페이지네이션 on/off (false면 전체 행을 한 번에 표시)
//   - bordered     : 테이블 외곽선/라운드 타입
//   - selectable   : 체크박스 선택 컬럼(+ 전체선택 헤더)
// 검색 필터 · 페이지네이션 · 선택은 내부 상태로 동작하며, 선택만 selectedIds/onSelectChange로 제어 가능.
// 좌(셀렉트그룹·버튼그룹) · 우(셀렉트그룹·버튼그룹·검색바) 컨트롤 행은 전부 꺼지면 통째로 사라진다.
//   - rightActions : 우측 슬롯(ReactNode 또는 (ctx)=>) — 검색바 대신/함께 임의 버튼 등을 우측에 배치
//   - selects / rightSelects : 좌/우 셀렉트 그룹 슬롯(ReactNode 또는 (ctx)=>) — SelectGroup으로 감싸 배치.
//     좌=타이틀→셀렉트그룹→버튼그룹(셀렉트가 버튼그룹 앞), 우=버튼그룹→셀렉트그룹→검색바(셀렉트가 버튼그룹과 검색바 사이)
// 색·간격·보더는 하위 컴포넌트(Table/Pagination 등)의 토큰을 그대로 따른다.
import { useMemo, useState } from 'react';
import type { ChangeEvent, ComponentPropsWithoutRef, ReactNode } from 'react';
import { Table } from './Table';
import type { TableColumn } from './Table';
import { applyColumnFilters, applySort } from './tableView';
import type { TableRowData, TableSort } from './tableView';
import { Pagination } from './Pagination';
import { SearchBar } from './SearchBar';
import { ButtonGroup } from './ButtonGroup';
import { SelectGroup } from './SelectGroup';

// 컬럼 정의 — Table 패스스루(headerMenu·sortable·filter 등 추가 옵션 허용)
// Table의 TableColumn과 동일 계약 + 템플릿 전용 부가 옵션 통과(인덱스 시그니처)
interface TableTemplateColumn extends TableColumn {
  [option: string]: unknown;
}

// actions/rightActions/selects/rightSelects 함수형 슬롯에 넘기는 컨텍스트
interface TableTemplateContext {
  selectedIds: (string | number)[];
  clearSelection: () => void;
  visibleRows: TableRowData[];
  query: string;
}
type TableTemplateSlot = ReactNode | ((ctx: TableTemplateContext) => ReactNode);

interface TableTemplateProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title'> {
  columns?: TableTemplateColumn[];
  rows?: TableRowData[];
  rowKey?: string;
  // 요소 on/off
  actions?: TableTemplateSlot; // 버튼그룹 내용 — null이면 버튼그룹 숨김
  rightActions?: TableTemplateSlot; // 우측 슬롯(ReactNode 또는 (ctx)=>) — 검색바 대신/함께 우측에 버튼 등 배치
  selects?: TableTemplateSlot; // 좌측 셀렉트 그룹(ReactNode 또는 (ctx)=>) — 좌측 버튼그룹 앞(왼쪽)
  rightSelects?: TableTemplateSlot; // 우측 셀렉트 그룹(ReactNode 또는 (ctx)=>) — 우측 버튼그룹과 검색바 사이
  title?: ReactNode; // 테이블 타이틀 — 있으면 헤더 좌측(버튼그룹 왼쪽)에 표시
  searchable?: boolean; // 검색바
  pagination?: boolean; // 페이지네이션
  bordered?: boolean; // 테이블 외곽선 타입
  selectable?: boolean; // 체크박스 선택
  // 검색
  searchPlaceholder?: string;
  searchKeys?: string[]; // 검색 대상 컬럼 key 배열 — 기본: render 없는(텍스트) 컬럼 전체
  searchWidth?: number | string;
  // 페이지네이션
  page?: number; // 현재 페이지(1-base) — 외부 제어 시
  onPageChange?: (page: number) => void; // 페이지 변경 콜백
  defaultPageSize?: number; // 페이지당 행 수 초기값(uncontrolled)
  pageSize?: number; // 페이지당 행 수 — 외부 제어 시
  onPageSizeChange?: (size: number) => void; // 행 수 변경 핸들러
  pageSizeOptions?: number[]; // 행 수 선택 옵션(기본 5/10/20/50) — Pagination 내장 셀렉트에 노출
  showPageSize?: boolean; // Pagination의 '페이지 행' 셀렉트 표시 여부
  showTotal?: boolean; // Pagination의 좌측 '총 N개' 표시 여부
  maxButtons?: number; // 페이지 번호 노출 개수(윈도우)
  paginationClassName?: string; // 페이지네이션 영역 전용 클래스
  // 선택(controlled 옵션)
  selectedIds?: (string | number)[];
  onSelectChange?: (ids: (string | number)[]) => void;
  // 테이블 패스스루
  wrap?: boolean;
  minWidth?: number;
  maxHeight?: number | string;
  loading?: boolean;
  emptyMessage?: ReactNode;
  onRowClick?: (row: TableRowData) => void;
  buttonGroupGap?: '3' | '4' | '5' | '6' | '7'; // 좌/우 버튼그룹 간격 토큰 키 — 기본 '5'(8px, 셀렉트 그룹과 통일)
  selectGroupGap?: '3' | '4' | '5' | '6' | '7'; // 좌/우 셀렉트 그룹 간격 토큰 키 — 기본 '5'(8px, 버튼그룹과 통일)
}

export function TableTemplate({
  columns = [],
  rows = [],
  rowKey = 'id',
  // 요소 on/off
  actions = null,
  rightActions = null,
  selects = null,
  rightSelects = null,
  title = null,
  searchable = true,
  pagination = true,
  bordered = false,
  selectable = false,
  // 검색
  searchPlaceholder = '검색어를 입력하세요',
  searchKeys,
  searchWidth = 200,
  // 페이지네이션
  page: pageProp,
  onPageChange,
  defaultPageSize = 10,
  pageSize: pageSizeProp,
  onPageSizeChange,
  pageSizeOptions,
  showPageSize = true,
  showTotal = true,
  maxButtons,
  paginationClassName = '',
  // 선택(controlled 옵션)
  selectedIds: selectedIdsProp,
  onSelectChange,
  // 테이블 패스스루
  wrap = false,
  minWidth = 720,
  maxHeight,
  loading = false,
  emptyMessage,
  onRowClick,
  buttonGroupGap = '5',
  selectGroupGap = '5',
  className = '',
  ...props
}: TableTemplateProps) {
  const [query, setQuery] = useState('');

  // 헤더 필터(filter 컬럼)·정렬(headerMenu sortable) 상태 — 템플릿이 보유.
  // 페이지네이션 전에 전체 행에 적용해야 하므로 여기서 처리하고, 같은 상태를 Table에 controlled로 넘겨 헤더 UI를 동기화한다.
  const [colFilters, setColFilters] = useState<Record<string, unknown>>({});
  const [sort, setSort] = useState<TableSort | null>(null);

  // 현재 페이지 — controlled(pageProp) 또는 내부 상태.
  const pageControlled = pageProp !== undefined;
  const [internalPage, setInternalPage] = useState(1);
  const page = pageControlled ? pageProp : internalPage;
  const goToPage = (next: number) => {
    if (!pageControlled) setInternalPage(next);
    onPageChange?.(next);
  };

  // 행 수(pageSize) — controlled(pageSizeProp) 또는 내부 상태. 변경 시 1페이지로 리셋.
  const sizeControlled = pageSizeProp !== undefined;
  const [internalSize, setInternalSize] = useState(defaultPageSize);
  const pageSize = sizeControlled ? pageSizeProp : internalSize;
  const changePageSize = (size: number) => {
    if (!sizeControlled) setInternalSize(size);
    onPageSizeChange?.(size);
    goToPage(1);
  };

  // 선택 상태 — controlled(selectedIdsProp) 또는 내부 상태
  const selControlled = selectedIdsProp !== undefined;
  const [internalSel, setInternalSel] = useState<(string | number)[]>([]);
  const selectedIds = selControlled ? selectedIdsProp : internalSel;
  const setSelectedIds = (next: (string | number)[]) => {
    if (!selControlled) setInternalSel(next);
    onSelectChange?.(next);
  };

  // 검색 대상 key — 미지정 시 render 없는(텍스트) 컬럼 전체
  const keys = useMemo(
    () => searchKeys ?? columns.filter((c) => !c.render).map((c) => c.key),
    [searchKeys, columns],
  );

  // 검색 필터(searchable일 때만)
  const searched = useMemo(() => {
    if (!searchable || !query) return rows;
    const q = query.toLowerCase();
    return rows.filter((r) => keys.some((k) => String(r[k] ?? '').toLowerCase().includes(q)));
  }, [rows, query, searchable, keys]);

  // 헤더 필터 → 정렬을 전체(검색 후) 행에 적용한 뒤에 페이지를 자른다(헤더 요소가 현재 페이지 안에서만 동작하지 않게).
  const filtered = useMemo(
    () => applySort(applyColumnFilters(searched, columns, colFilters), sort),
    [searched, columns, colFilters, sort],
  );

  // 헤더 필터/정렬 변경 — 상태 갱신 + 1페이지로 리셋(보이는 범위가 바뀌므로).
  const handleFilterChange = (next: Record<string, unknown>) => {
    setColFilters(next);
    goToPage(1);
  };
  const handleSortChange = (next: TableSort | null) => {
    setSort(next);
    goToPage(1);
  };

  // 페이지네이션이 꺼지면 전체 행을 그대로 노출. 켜지면 현재 페이지 슬라이스만.
  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(page, totalPages); // 필터/삭제로 범위를 벗어나면 보정
  const visibleRows = pagination
    ? filtered.slice((safePage - 1) * pageSize, (safePage - 1) * pageSize + pageSize)
    : filtered;

  // actions가 함수면 현재 컨텍스트를 넘겨준다(선택 항목으로 삭제 등 구현 가능).
  const ctx: TableTemplateContext = { selectedIds, clearSelection: () => setSelectedIds([]), visibleRows, query };
  const resolvedActions = typeof actions === 'function' ? actions(ctx) : actions;
  // 우측 슬롯 — 검색바 대신/함께 임의 요소(버튼 등)를 우측에 배치. actions와 동일하게 (ctx) => 함수 지원
  const resolvedRightActions = typeof rightActions === 'function' ? rightActions(ctx) : rightActions;
  // 좌/우 셀렉트 그룹 슬롯 — actions와 동일하게 (ctx) => 함수 지원
  const resolvedSelects = typeof selects === 'function' ? selects(ctx) : selects;
  const resolvedRightSelects = typeof rightSelects === 'function' ? rightSelects(ctx) : rightSelects;
  const showHeader =
    !!resolvedActions || searchable || !!title || !!resolvedRightActions || !!resolvedSelects || !!resolvedRightSelects; // 하나라도 있으면 헤더 렌더

  return (
    <div className={`flex flex-col gap-spacing-6 ${className}`} {...props}>
      {showHeader && (
        <div className="flex items-center justify-between gap-spacing-6">
          {/* 좌: 타이틀 → 셀렉트그룹 → 버튼그룹 (셀렉트그룹이 버튼그룹 앞). 전부 없으면 빈 자리로 우측(검색바 등)을 고정.
              그룹 간 간격 8px(spacing-5) — 그룹 내부 갭과 통일 */}
          <div className="flex items-center gap-spacing-5">
            {title && <h3 className="flex h-[32px] items-center text-15 font-semibold text-font-icon-5">{title}</h3>}
            {resolvedSelects && <SelectGroup gap={selectGroupGap}>{resolvedSelects}</SelectGroup>}
            {resolvedActions && <ButtonGroup gap={buttonGroupGap}>{resolvedActions}</ButtonGroup>}
          </div>
          {/* 우: rightActions 버튼그룹 → 셀렉트그룹 → 검색바(맨 오른쪽) — 셀렉트그룹은 버튼그룹과 검색바 사이.
              좌 actions처럼 각 그룹으로 감싸 스타일 혼합 요소를 일정 간격으로 배치 */}
          {(searchable || resolvedRightActions || resolvedRightSelects) && (
            <div className="flex items-center gap-spacing-5">
              {resolvedRightActions && (
                <ButtonGroup gap={buttonGroupGap}>{resolvedRightActions}</ButtonGroup>
              )}
              {resolvedRightSelects && (
                <SelectGroup gap={selectGroupGap}>{resolvedRightSelects}</SelectGroup>
              )}
              {searchable && (
                <SearchBar
                  value={query}
                  placeholder={searchPlaceholder}
                  width={searchWidth}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setQuery(e.target.value);
                    goToPage(1);
                  }}
                />
              )}
            </div>
          )}
        </div>
      )}

      <Table
        columns={columns}
        rows={visibleRows}
        rowKey={rowKey}
        bordered={bordered}
        selectable={selectable}
        selectedIds={selectable ? selectedIds : undefined}
        onSelectChange={selectable ? setSelectedIds : undefined}
        filters={colFilters}
        onFilterChange={handleFilterChange}
        sort={sort}
        onSortChange={handleSortChange}
        wrap={wrap}
        minWidth={minWidth}
        maxHeight={maxHeight}
        loading={loading}
        emptyMessage={emptyMessage}
        onRowClick={onRowClick}
      />

      {pagination && (
        <Pagination
          page={safePage}
          onChange={goToPage}
          totalCount={totalCount}
          pageSize={pageSize}
          pageSizeOptions={pageSizeOptions}
          showPageSize={showPageSize}
          showTotal={showTotal}
          maxButtons={maxButtons}
          onPageSizeChange={changePageSize}
          className={paginationClassName}
        />
      )}
    </div>
  );
}
