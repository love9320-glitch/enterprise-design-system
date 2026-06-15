// Table — 데이터 테이블 (Figma table, node 7257:1925)
// 컬럼 정의(columns)와 데이터(rows)를 받아 렌더하는 완전 옵션형 테이블.
//   - columns: [{ key, label, width?, align?, render? }]  width 없으면 가변(fill). fill 컬럼은 최소 40px 유지
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
import { LoaderCircle } from 'lucide-react';
import { Checkbox } from './Checkbox';
import { ScrollArea } from './ScrollArea';
import { TruncatingText } from './TruncatingText';
import { tableColors } from '../tokens';

const ALIGN_STYLE = {
  left: 'text-left justify-start',
  center: 'text-center justify-center',
  right: 'text-right justify-end',
};

const CHECKBOX_COL_WIDTH = 44;
const COL_MIN_WIDTH = 40; // 가변(fill) 컬럼이 표가 좁아져도 유지하는 최소 너비(px)

export function Table({
  columns = [],
  rows = [],
  rowKey = 'id',
  selectable = false,
  selectedIds,
  onSelectChange,
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
  const allKeys = rows.map(getKey);
  const allChecked = rows.length > 0 && allKeys.every((k) => selectedSet.has(k));
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

  // 헤더 행 하단 구분선 — bordered(스크롤 테이블 스타일) 또는 sticky 헤더일 때.
  // border-collapse 환경에서 스크롤 시 사라지는 버그를 피하려 box-shadow로 안정적으로 그린다.
  const headDivider =
    bordered || hasVScroll ? { boxShadow: `inset 0 -1px 0 ${tableColors['cell-line']}` } : undefined;

  // noneline(외곽선 없음) 테이블은 헤더가 위·아래 모두 둥근 회색 바 → 헤더 바깥 셀에 좌/우 라운드.
  // bordered는 래퍼 overflow-clip이 코너를 처리하므로 셀 라운드를 주지 않는다.
  const headCorner = (isFirst, isLast) =>
    bordered ? '' : `${isFirst ? 'rounded-l-round-4' : ''} ${isLast ? 'rounded-r-round-4' : ''}`;

  // 헤더 셀(<th>) 공통 — 구분선·코너·패딩·하단 구분선(box-shadow). 체크박스/라벨 셀이 함께 사용.
  const headCellProps = (isFirst, isLast, width) => ({
    className: `${cellLine(isLast)} ${headCorner(isFirst, isLast)} px-spacing-6 py-spacing-5 align-middle`,
    style: { ...(width ? { width } : null), ...headDivider },
  });

  const headCell = (c, isFirst, isLast) => (
    <th key={c.key} {...headCellProps(isFirst, isLast, c.width)}>
      {/* 헤더 라벨은 말줄임 처리 — 컬럼이 좁아도 줄바꿈으로 세로로 늘어나지 않게. 잘리면 hover 툴팁. */}
      <div className={`flex items-center ${ALIGN_STYLE[c.align] ?? ALIGN_STYLE.left}`}>
        <TruncatingText as="span" className="min-w-0 text-12 font-normal text-font-icon-5">
          {c.label}
        </TruncatingText>
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
            <th {...headCellProps(true, false, CHECKBOX_COL_WIDTH)}>
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
        ) : rows.length === 0 ? (
          <tr className="bg-table-row-bg">
            <td colSpan={totalCols} className={`${stateLine} px-spacing-6 py-spacing-12 text-center text-14 text-font-icon-3`}>
              {emptyMessage}
            </td>
          </tr>
        ) : (
          rows.map((row, ri) => {
            const key = getKey(row, ri);
            const isLastRow = ri === rows.length - 1;
            // 행 구분선은 td에 적용한다(border-separate에선 tr 보더가 렌더되지 않음).
            // 스크롤 테이블은 마지막 행 구분선을 빼 외곽선과 이중선이 되지 않게 한다.
            const rowLine = hasVScroll && isLastRow ? '' : 'border-b border-table-cell-line';
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
                {columns.map((c, ci) => (
                  <td key={c.key} className={`${cellLine(ci === columns.length - 1)} ${rowLine} h-[49px] px-spacing-6 py-spacing-5 align-middle`}>
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
                ))}
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );

  // 외곽: bordered → 외곽선+라운드+클립(코너 처리) / noneline → 외곽 없음(헤더 셀이 직접 라운드)
  const shell = bordered
    ? 'overflow-clip rounded-round-4 border border-table-outline'
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
