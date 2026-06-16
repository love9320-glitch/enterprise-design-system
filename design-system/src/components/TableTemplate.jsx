// TableTemplate — 목록 페이지 템플릿 (table control + Table + Pagination 조합)
// 버튼그룹·검색바·테이블·페이지네이션을 한 덩어리로 묶은 완전 옵션형 템플릿(규칙 4).
// 각 요소를 props로 끄고 켤 수 있다:
//   - actions      : 버튼그룹 내용(ReactNode 또는 (ctx) => ReactNode). null이면 버튼그룹 자체를 숨김
//   - searchable   : 검색바 on/off (false면 숨김)
//   - pagination   : 페이지네이션 on/off (false면 전체 행을 한 번에 표시)
//   - bordered     : 테이블 외곽선/라운드 타입
//   - selectable   : 체크박스 선택 컬럼(+ 전체선택 헤더)
// 검색 필터 · 페이지네이션 · 선택은 내부 상태로 동작하며, 선택만 selectedIds/onSelectChange로 제어 가능.
// 좌(버튼그룹) · 우(검색바) 컨트롤 행은 actions·searchable이 모두 꺼지면 통째로 사라진다.
// 색·간격·보더는 하위 컴포넌트(Table/Pagination 등)의 토큰을 그대로 따른다.
import { useMemo, useState } from 'react';
import { Table } from './Table';
import { Pagination } from './Pagination';
import { SearchBar } from './SearchBar';
import { ButtonGroup } from './ButtonGroup';

export function TableTemplate({
  columns = [],
  rows = [],
  rowKey = 'id',
  // 요소 on/off
  actions = null,                 // 버튼그룹 내용 — null이면 버튼그룹 숨김
  searchable = true,              // 검색바
  pagination = true,              // 페이지네이션
  bordered = false,               // 테이블 외곽선 타입
  selectable = false,             // 체크박스 선택
  // 검색
  searchPlaceholder = '검색어를 입력하세요',
  searchKeys,                     // 검색 대상 컬럼 key 배열 — 기본: render 없는(텍스트) 컬럼 전체
  searchWidth = 200,
  // 페이지네이션
  page: pageProp,                 // 현재 페이지(1-base) — 외부 제어 시
  onPageChange,                   // (page) => void — 페이지 변경 콜백
  defaultPageSize = 10,           // 페이지당 행 수 초기값(uncontrolled)
  pageSize: pageSizeProp,         // 페이지당 행 수 — 외부 제어 시
  onPageSizeChange,               // (size) => void — 행 수 변경 핸들러
  pageSizeOptions,                // 행 수 선택 옵션(기본 5/10/20/50) — Pagination 내장 셀렉트에 노출
  showPageSize = true,            // Pagination의 '페이지 행' 셀렉트 표시 여부
  showTotal = true,               // Pagination의 좌측 '총 N개' 표시 여부
  maxButtons,                     // 페이지 번호 노출 개수(윈도우)
  paginationClassName = '',       // 페이지네이션 영역 전용 클래스
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
  className = '',
  ...props
}) {
  const [query, setQuery] = useState('');

  // 현재 페이지 — controlled(pageProp) 또는 내부 상태.
  const pageControlled = pageProp !== undefined;
  const [internalPage, setInternalPage] = useState(1);
  const page = pageControlled ? pageProp : internalPage;
  const goToPage = (next) => {
    if (!pageControlled) setInternalPage(next);
    onPageChange?.(next);
  };

  // 행 수(pageSize) — controlled(pageSizeProp) 또는 내부 상태. 변경 시 1페이지로 리셋.
  const sizeControlled = pageSizeProp !== undefined;
  const [internalSize, setInternalSize] = useState(defaultPageSize);
  const pageSize = sizeControlled ? pageSizeProp : internalSize;
  const changePageSize = (size) => {
    if (!sizeControlled) setInternalSize(size);
    onPageSizeChange?.(size);
    goToPage(1);
  };

  // 선택 상태 — controlled(selectedIdsProp) 또는 내부 상태
  const selControlled = selectedIdsProp !== undefined;
  const [internalSel, setInternalSel] = useState([]);
  const selectedIds = selControlled ? selectedIdsProp : internalSel;
  const setSelectedIds = (next) => {
    if (!selControlled) setInternalSel(next);
    onSelectChange?.(next);
  };

  // 검색 대상 key — 미지정 시 render 없는(텍스트) 컬럼 전체
  const keys = useMemo(
    () => searchKeys ?? columns.filter((c) => !c.render).map((c) => c.key),
    [searchKeys, columns],
  );

  // 검색 필터(searchable일 때만)
  const filtered = useMemo(() => {
    if (!searchable || !query) return rows;
    const q = query.toLowerCase();
    return rows.filter((r) => keys.some((k) => String(r[k] ?? '').toLowerCase().includes(q)));
  }, [rows, query, searchable, keys]);

  // 페이지네이션이 꺼지면 전체 행을 그대로 노출. 켜지면 현재 페이지 슬라이스만.
  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(page, totalPages); // 필터/삭제로 범위를 벗어나면 보정
  const visibleRows = pagination
    ? filtered.slice((safePage - 1) * pageSize, (safePage - 1) * pageSize + pageSize)
    : filtered;

  // actions가 함수면 현재 컨텍스트를 넘겨준다(선택 항목으로 삭제 등 구현 가능).
  const ctx = { selectedIds, clearSelection: () => setSelectedIds([]), visibleRows, query };
  const resolvedActions = typeof actions === 'function' ? actions(ctx) : actions;
  const showToolbar = !!resolvedActions || searchable;

  return (
    <div className={`flex flex-col gap-spacing-6 ${className}`} {...props}>
      {showToolbar && (
        <div className="flex items-center justify-between gap-spacing-6">
          {/* 좌: 버튼그룹(없으면 빈 자리로 검색바를 우측에 고정) */}
          {resolvedActions ? <ButtonGroup gap={buttonGroupGap}>{resolvedActions}</ButtonGroup> : <span />}
          {/* 우: 검색바 */}
          {searchable && (
            <SearchBar
              value={query}
              placeholder={searchPlaceholder}
              width={searchWidth}
              onChange={(e) => {
                setQuery(e.target.value);
                goToPage(1);
              }}
            />
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
