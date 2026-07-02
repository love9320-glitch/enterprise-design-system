// Table — 데이터 테이블 (Figma table, node 7257:1925)
// 컬럼 정의(columns)와 데이터(rows)를 받아 렌더하는 완전 옵션형 테이블.
//   - columns: [{ key, label, width?, align?, render?, renderHeader?, filter?, headerMenu? }]  width 없으면 가변(fill). fill 컬럼은 최소 40px 유지
//     renderHeader: () => ReactNode — 헤더 셀(라벨 영역)을 직접 렌더(가장 우선). 없으면 filter → label 순으로 처리
//     filter: { options:[{value,label}], allLabel?, placeholder? } — 헤더 라벨 자리에 인라인 텍스트형 Select(size 20)를
//       넣고, 선택값으로 그 컬럼(row[key])을 기준으로 행을 거른다. 옵션 맨 앞에 전체 옵션(value '')이 자동 추가되고
//       그걸 고르면 필터가 해제된다. 전체 옵션 라벨은 allLabel(기본 '{컬럼명} 전체')로 정한다.
//       필터 상태는 filters/onFilterChange로 controlled, 미지정 시 내부 상태.
//     headerMenu: { sortable?, items?, icon?, width? } — 헤더 우측에 ghost 아이콘 버튼(size 24)을 두고, 클릭 시 Popover 메뉴를 연다.
//       sortable=true면 '오름차순/내림차순 정렬' 항목이 자동 추가되고 그 컬럼(row[key]) 기준으로 Table이 내부 정렬한다(현재 정렬은 항목에 selected 표시).
//       items=[{ key?, label, icon?, onClick(column) }] 로 임의 기능을 더 넣을 수 있다. 정렬 상태는 sort/onSortChange로 controlled, 미지정 시 내부 상태.
//       sortable도 items도 없으면(빈 메뉴) 버튼을 렌더하지 않는다.
//   - selectable: 체크박스 선택 컬럼(전체선택 헤더 포함). selectedIds/onSelectChange로 controlled, 미지정 시 내부 상태
//   - bordered: 외곽선 + 라운드(true) / 외곽선 없는 라운드 헤더(false)
//   - wrap: 본문 셀 텍스트 줄바꿈 여부. false(기본)=말줄임+행 높이 고정(잘리면 hover 툴팁) / true=줄바꿈으로 행이 세로로 늘어남
//     (render로 직접 렌더한 셀은 사용자 책임이라 wrap 영향을 받지 않음)
//   - maxHeight: 지정 시 본문 세로 스크롤 + 헤더 고정(sticky) + 헤더 하단 구분선
//   - minWidth: 테이블 최소 너비. 실제 최소 너비는 max(minWidth, 컬럼 최소폭 합)이며,
//     컨테이너가 이보다 좁아지면 가로 스크롤이 자동 활성화되고 fill 컬럼은 40px를 유지한다
//   - scrollX: minWidth 없이도 가로 스크롤을 켜는 수동 옵션. 세로·가로 모두 ScrollArea 오버레이 스크롤바
//   - loading / emptyMessage: 로딩 · 빈 상태 처리
// 색·간격·보더는 table-*/spacing-*/border-* 토큰만 사용(하드코딩 금지).
// sticky 헤더의 하단 구분선은 border-collapse 환경에서 스크롤 시 사라지는 브라우저 버그를 피하려
// box-shadow(토큰 색 인라인)로 그린다. — Tooltip/ScrollArea의 토큰값 인라인 적용과 동일한 예외.
import { useState } from 'react';
import { LoaderCircle, MoreVertical } from 'lucide-react';
import { Checkbox } from './Checkbox';
import { ScrollArea } from './ScrollArea';
import { TruncatingText } from './TruncatingText';
import { Select } from './Select';
import { Button } from './Button';
import { Popover } from './Popover';
import { PopoverMenu } from './PopoverMenu';
import { ListGroup } from './ListGroup';
import { List } from './List';
import { applyColumnFilters, applySort } from './tableView';
import { tableColors } from '../tokens';

const ALIGN_STYLE = {
  left: 'text-left justify-start',
  center: 'text-center justify-center',
  right: 'text-right justify-end',
};

const CHECKBOX_COL_WIDTH = 44;
const COL_MIN_WIDTH = 40; // 가변(fill) 컬럼이 표가 좁아져도 유지하는 최소 너비(px)

// HeaderMenu — 헤더 우측 ghost 아이콘 버튼(size 24) + Popover 메뉴.
// sortable면 오름차순/내림차순 정렬 항목을 자동 제공(현재 정렬은 selected로 표시), items로 임의 기능 추가.
function HeaderMenu({ column, sort, onSort }) {
  const menu = column.headerMenu;
  const TriggerIcon = menu.icon ?? MoreVertical;
  const sortDir = sort?.key === column.key ? sort.dir : null;
  const items = menu.items ?? [];
  return (
    <Popover
      placement="bottom-right"
      menuWidth={menu.width ?? 120}
      trigger={<Button variant="ghost" size="24" icon={TriggerIcon} aria-label={`${column.label ?? ''} 컬럼 메뉴`} />}
    >
      {(close) => (
        <PopoverMenu width="100%">
          <ListGroup>
            {menu.sortable && [
              <List
                key="__asc"
                title="오름차순 정렬"
                selected={sortDir === 'asc'}
                onClick={() => {
                  onSort({ key: column.key, dir: 'asc' });
                  close();
                }}
              />,
              <List
                key="__desc"
                title="내림차순 정렬"
                selected={sortDir === 'desc'}
                onClick={() => {
                  onSort({ key: column.key, dir: 'desc' });
                  close();
                }}
              />,
            ]}
            {items.map((it, i) => (
              <List
                key={it.key ?? i}
                title={it.label}
                onClick={() => {
                  it.onClick?.(column);
                  close();
                }}
              />
            ))}
          </ListGroup>
        </PopoverMenu>
      )}
    </Popover>
  );
}

export function Table({
  columns = [],
  rows = [],
  rowKey = 'id',
  selectable = false,
  selectedIds,
  onSelectChange,
  filters,
  onFilterChange,
  sort,
  onSortChange,
  bordered = false,
  wrap = false,
  maxHeight,
  minWidth,
  scrollX = false,
  loading = false,
  loadingMessage = '불러오는 중…',
  emptyMessage = '데이터가 없습니다.',
  onRowClick,
  className = '',
  ...props
}) {
  // 헤더 필터 상태 — controlled(filters+onFilterChange) 또는 내부 상태. { [colKey]: value }, ''=전체(해제)
  const filtersControlled = filters !== undefined;
  const [internalFilters, setInternalFilters] = useState({});
  const activeFilters = filtersControlled ? filters : internalFilters;
  const setFilter = (key, val) => {
    const next = { ...activeFilters, [key]: val };
    if (!filtersControlled) setInternalFilters(next);
    onFilterChange?.(next);
  };
  // 활성 필터를 적용해 행을 거른다(공유 헬퍼).
  const filteredRows = applyColumnFilters(rows, columns, activeFilters);

  // 정렬 상태 — controlled(sort+onSortChange) 또는 내부 상태. { key, dir:'asc'|'desc' } | null
  const sortControlled = sort !== undefined;
  const [internalSort, setInternalSort] = useState(null);
  const activeSort = sortControlled ? sort : internalSort;
  const setSort = (next) => {
    if (!sortControlled) setInternalSort(next);
    onSortChange?.(next);
  };
  // 정렬 적용(필터 뒤, 공유 헬퍼) — 헤더 메뉴 항목 기준(row[key]).
  const displayRows = applySort(filteredRows, activeSort);

  // 선택 상태 — controlled(selectedIds+onSelectChange) 또는 내부 상태
  const isControlled = selectedIds !== undefined;
  const [internalSel, setInternalSel] = useState([]);
  const selected = isControlled ? selectedIds : internalSel;
  const selectedSet = new Set(selected); // O(1) 조회 — 행마다 includes 하지 않게

  const getKey = (row, i) => row[rowKey] ?? i;
  const emit = (next) => {
    if (!isControlled) setInternalSel(next);
    onSelectChange?.(next);
  };
  // 전체선택은 현재 보이는(필터·정렬된) 행 기준
  const allKeys = displayRows.map(getKey);
  const allChecked = displayRows.length > 0 && allKeys.every((k) => selectedSet.has(k));
  const toggleAll = () => emit(allChecked ? [] : allKeys);
  const toggleRow = (key) =>
    emit(selectedSet.has(key) ? selected.filter((k) => k !== key) : [...selected, key]);

  const totalCols = columns.length + (selectable ? 1 : 0);
  const hasVScroll = maxHeight != null;

  // 컬럼 최소 너비 보장 — 가변(width 미지정=fill) 컬럼은 COL_MIN_WIDTH(40px), 고정 컬럼은 지정 폭.
  // 이들의 합을 테이블 최소 너비로 삼아, 그보다 좁아지면 fill 컬럼이 40px 아래로 줄지 않고 가로 스크롤이 생긴다.
  const hasFill = columns.some((c) => c.width == null);
  const contentMinWidth =
    (selectable ? CHECKBOX_COL_WIDTH : 0) +
    columns.reduce((sum, c) => sum + (c.width ?? COL_MIN_WIDTH), 0);

  // 최소 너비(minWidth)·가변 컬럼·scrollX 중 하나라도 있으면 가로 스크롤(오버레이)을 활성화한다.
  const hasHScroll = scrollX || minWidth != null || hasFill;
  const tableMinWidth = hasHScroll ? Math.max(minWidth ?? 0, contentMinWidth) : minWidth;
  const needsScroll = hasVScroll || hasHScroll;

  // 셀 공통 — 마지막 컬럼 제외 우측 구분선
  const cellLine = (isLast) => (isLast ? '' : 'border-r border-table-cell-line');

  // empty/loading 행: noneline은 데이터 행처럼 하단 구분선, bordered는 외곽선이 처리하므로 생략.
  const stateLine = bordered ? '' : 'border-b border-table-cell-line';

  // 헤더 행 하단 구분선 — bordered 타입에만 적용한다.
  // noneline(외곽선 없음)은 가이드상 둥근 회색 바만 있고 헤더 언더라인이 없어야 하므로,
  // 세로 스크롤(sticky 헤더)이어도 구분선을 긋지 않는다(회색 바 배경으로 본문과 구분).
  // border-collapse 환경에서 스크롤 시 사라지는 버그를 피하려 box-shadow로 안정적으로 그린다.
  const headDivider = bordered
    ? { boxShadow: `inset 0 -1px 0 ${tableColors['cell-line']}` }
    : undefined;

  // noneline(외곽선 없음) 테이블은 헤더가 위·아래 모두 둥근 회색 바 → 헤더 바깥 셀에 좌/우 라운드.
  // bordered는 래퍼 overflow-clip이 코너를 처리하므로 셀 라운드를 주지 않는다.
  const headCorner = (isFirst, isLast) =>
    bordered ? '' : `${isFirst ? 'rounded-l-round-4' : ''} ${isLast ? 'rounded-r-round-4' : ''}`;

  // 헤더 셀(<th>) 공통 — 구분선·코너·패딩·하단 구분선(box-shadow). 체크박스/라벨 셀이 함께 사용.
  // 오른쪽 패딩은 spacing-5(8px) — 헤더 우측 메뉴 버튼이 가장자리에 너무 떨어지지 않게.
  // 높이는 spacing-12(36px)로 고정(상하 패딩 없음).
  const headCellProps = (isFirst, isLast, width) => ({
    className: `${cellLine(isLast)} ${headCorner(isFirst, isLast)} pl-spacing-6 pr-spacing-5 h-spacing-12 align-middle`,
    style: { ...(width ? { width } : null), ...headDivider },
  });

  const headCell = (c, isFirst, isLast) => (
    <th key={c.key} {...headCellProps(isFirst, isLast, c.width)}>
      {/* 좌: 라벨 영역(renderHeader → filter → label) / 우: headerMenu(ghost 아이콘 버튼 + Popover). */}
      <div className="flex items-center gap-spacing-3">
      <div className={`flex min-w-0 flex-1 items-center ${ALIGN_STYLE[c.align] ?? ALIGN_STYLE.left}`}>
        {/* 우선순위: renderHeader(직접 렌더) → filter(인라인 텍스트형 Select, size 20) → label(말줄임).
            컬럼이 좁아도 줄바꿈으로 세로로 늘어나지 않게. 잘리면 hover 툴팁. */}
        {c.renderHeader ? (
          c.renderHeader()
        ) : c.filter ? (
          (() => {
            // 전체(필터 해제) 옵션 라벨 — allLabel이 있으면 그대로, 없으면 '{컬럼명} 전체'(label 없으면 '전체')
            const allLabel = c.filter.allLabel ?? (c.label ? `${c.label} 전체` : '전체');
            return (
              <Select
                variant="text"
                size="20"
                value={activeFilters[c.key] ?? ''}
                onChange={(e) => setFilter(c.key, e.target.value)}
                options={[{ value: '', label: allLabel }, ...c.filter.options]}
                placeholder={c.filter.placeholder ?? allLabel}
              />
            );
          })()
        ) : (
          <TruncatingText as="span" className="min-w-0 text-12 font-normal text-font-icon-5">
            {c.label}
          </TruncatingText>
        )}
      </div>
        {/* headerMenu는 정렬(sortable)이나 항목(items)이 하나라도 있을 때만 버튼을 렌더(빈 메뉴 방지) */}
        {c.headerMenu && (c.headerMenu.sortable || c.headerMenu.items?.length > 0) && (
          <div className="shrink-0">
            <HeaderMenu column={c} sort={activeSort} onSort={setSort} />
          </div>
        )}
      </div>
    </th>
  );

  const table = (
    <table
      className="w-full table-fixed border-separate"
      style={{ borderSpacing: 0, ...(tableMinWidth ? { minWidth: tableMinWidth } : null) }}
    >
      <colgroup>
        {selectable && <col style={{ width: CHECKBOX_COL_WIDTH }} />}
        {columns.map((c) => (
          <col key={c.key} style={c.width ? { width: c.width } : undefined} />
        ))}
      </colgroup>

      <thead className={hasVScroll ? 'sticky top-0 z-10' : ''} data-scroll-sticky-top={hasVScroll ? '' : undefined}>
        <tr className="bg-table-header-bg">
          {selectable && (
            // 체크박스 컬럼 헤더만 상하좌우 패딩을 8px(spacing-5)로 통일 — 공통 headCellProps의 좌(spacing-6) 패딩 대신.
            <th
              className={`${cellLine(false)} ${headCorner(true, false)} p-spacing-5 align-middle`}
              style={{ width: CHECKBOX_COL_WIDTH, ...headDivider }}
            >
              <div className="flex items-center justify-center">
                <Checkbox checked={allChecked} onChange={toggleAll} />
              </div>
            </th>
          )}
          {columns.map((c, i) =>
            headCell(c, !selectable && i === 0, i === columns.length - 1),
          )}
        </tr>
      </thead>

      <tbody>
        {loading ? (
          <tr className="bg-table-row-bg">
            <td colSpan={totalCols} className={`${stateLine} px-spacing-6 py-spacing-12`}>
              <div className="flex items-center justify-center gap-spacing-4 text-14 text-font-icon-3">
                <LoaderCircle size={16} strokeWidth={1.8} className="animate-spin" />
                {loadingMessage}
              </div>
            </td>
          </tr>
        ) : displayRows.length === 0 ? (
          <tr className="bg-table-row-bg">
            <td colSpan={totalCols} className={`${stateLine} px-spacing-6 py-spacing-12 text-center text-14 text-font-icon-3`}>
              {emptyMessage}
            </td>
          </tr>
        ) : (
          displayRows.map((row, ri) => {
            const key = getKey(row, ri);
            const isLastRow = ri === displayRows.length - 1;
            // 행 구분선은 td에 적용한다(border-separate에선 tr 보더가 렌더되지 않음).
            // 바닥이 이미 닫히는 경우(bordered=외곽선 / noneline+세로스크롤=컨테이너 하단선)엔
            // 마지막 행 구분선을 빼 이중선(2px)이 되지 않게 한다.
            const bottomClosed = bordered || hasVScroll;
            const rowLine = bottomClosed && isLastRow ? '' : 'border-b border-table-cell-line';
            return (
              <tr
                key={key}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={`bg-table-row-bg transition-colors hover:bg-table-row-hover-bg ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
              >
                {selectable && (
                  <td className={`${cellLine(false)} ${rowLine} h-[49px] px-spacing-6 py-spacing-5 align-middle`}>
                    <div className="flex items-center justify-center">
                      <Checkbox
                        checked={selectedSet.has(key)}
                        onChange={() => toggleRow(key)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </td>
                )}
                {columns.map((c, ci) => {
                  // 셀 세로 병합 — 컬럼 cellSpan((row, rowIndex, rows) => n): n>1=아래로 n행 병합,
                  // 0=위 셀의 병합 범위에 포함(이 행에선 td 생략), 1/미지정=일반 셀.
                  const span = c.cellSpan ? c.cellSpan(row, ri, displayRows) : 1;
                  if (span === 0) return null;
                  // 병합 셀의 행 구분선은 셀이 '끝나는' 행 기준으로 판정(마지막 행에서 끝나면 이중선 방지)
                  const endsLast = ri + Math.max(span, 1) - 1 >= displayRows.length - 1;
                  const spanRowLine =
                    bottomClosed && endsLast ? '' : 'border-b border-table-cell-line';
                  return (
                    <td
                      key={c.key}
                      rowSpan={span > 1 ? span : undefined}
                      className={`${cellLine(ci === columns.length - 1)} ${spanRowLine} h-[49px] px-spacing-6 py-spacing-5 align-middle`}
                    >
                      <div className={`flex items-center ${ALIGN_STYLE[c.align] ?? ALIGN_STYLE.left} min-w-0 text-14 text-font-icon-5`}>
                        {/* wrap=false면 말줄임(행이 세로로 안 늘어남), wrap=true면 줄바꿈으로 늘어남. */}
                        {c.render ? (
                          c.render(row)
                        ) : wrap ? (
                          <span className="break-words">{row[c.key]}</span>
                        ) : (
                          <TruncatingText as="span" className="min-w-0">
                            {row[c.key]}
                          </TruncatingText>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );

  // 외곽: bordered → 외곽선+라운드+클립(코너 처리)
  //       noneline → 외곽 없음(헤더 셀이 직접 라운드). 단, 세로 스크롤이 생기면 하단에
  //       구분선을 그어 스크롤 영역의 끝을 표시한다. (마지막 행 구분선은 위 rowLine에서 제거되고,
  //       그 선은 스크롤돼야만 보이므로, 스크롤 위치와 무관하게 항상 보이도록 컨테이너에 고정 underline을 둔다.)
  const shell = bordered
    ? 'overflow-clip rounded-round-4 border border-table-outline'
    : hasVScroll
      ? 'border-b border-table-cell-line'
      : '';

  // 스크롤 래핑 — 세로·가로 모두 ScrollArea 오버레이 스크롤바로 처리
  const body = needsScroll ? (
    <ScrollArea maxHeight={maxHeight} horizontal={hasHScroll}>
      {table}
    </ScrollArea>
  ) : (
    table
  );

  return (
    <div className={`${shell} ${className}`} {...props}>
      {body}
    </div>
  );
}
