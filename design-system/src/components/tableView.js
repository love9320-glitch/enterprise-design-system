// tableView — Table 헤더 요소(필터·정렬)의 순수 데이터 헬퍼.
// Table 내부와 TableTemplate(페이지 자르기 전 전체 행)이 같은 규칙을 공유하도록 컴포넌트 파일과 분리해 둔다.

// 정렬 비교 — 둘 다 숫자로 해석되면 수치 비교, 아니면 한국어 로케일 문자열 비교. null은 뒤로.
export function compareValues(a, b) {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  const na = Number(a);
  const nb = Number(b);
  if (!Number.isNaN(na) && !Number.isNaN(nb) && a !== '' && b !== '') return na - nb;
  return String(a).localeCompare(String(b), 'ko');
}

// 헤더 필터(filter 컬럼) 적용 — filters={[colKey]:value}, ''/없음이면 그 컬럼 필터 해제. render 셀도 원본 값(row[key]) 기준.
export function applyColumnFilters(rows, columns, filters = {}) {
  return rows.filter((row) =>
    columns.every((c) => {
      const v = filters[c.key];
      return c.filter == null || v == null || v === '' || String(row[c.key]) === String(v);
    }),
  );
}

// 헤더 메뉴 정렬(sort={key,dir}) 적용 — 원본 배열은 건드리지 않게 복사 후 정렬. sort 없으면 그대로.
export function applySort(rows, sort) {
  if (sort?.key == null) return rows;
  return [...rows].sort((a, b) => {
    const r = compareValues(a[sort.key], b[sort.key]);
    return sort.dir === 'desc' ? -r : r;
  });
}
