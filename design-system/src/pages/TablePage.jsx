import { Table } from '../components/Table';
import { Tag } from '../components/Tag';
import { Button } from '../components/Button';
import { UsageExample } from '../components/UsageExample';
import { Divider } from '../components/Divider';

const USAGE = `import { Table } from '../components/Table';

// columns: width 없으면 가변(fill), render로 셀 커스텀
const columns = [
  { key: 'type', label: '구분', width: 80, render: () => <Tag color="blue">태그</Tag> },
  { key: 'title', label: '공고명' },                 // 가변 폭
  { key: 'period', label: '접수 기간', width: 280, align: 'center' },
];
const rows = [{ id: 1, title: '2026 상반기 통합채용', period: '...' }];

// 기본
<Table columns={columns} rows={rows} rowKey="id" />

// 선택(체크박스) — selectedIds/onSelectChange로 controlled
const [ids, setIds] = useState([]);
<Table columns={columns} rows={rows} selectable selectedIds={ids} onSelectChange={setIds} />

// 외곽선 · 세로 스크롤(헤더 고정) · 가로 스크롤 · 행 클릭
<Table columns={columns} rows={rows} bordered maxHeight={400} minWidth={800} onRowClick={open} />

// 본문 줄바꿈 · 로딩 · 빈 상태
<Table columns={columns} rows={rows} wrap loading emptyMessage="데이터가 없습니다" />

// 헤더 필터 — 컬럼에 filter를 주면 헤더 라벨 자리에 인라인 텍스트형 Select(size 20)가 들어가고
// 선택값으로 그 컬럼(row[key])을 기준으로 행이 걸러진다. 맨 앞 전체 옵션(기본 '구분 전체')은 필터 해제.
const filterColumns = [
  { key: 'group', label: '구분', width: 120, filter: {
    options: [
      { value: '옵션 1', label: '옵션 1' },
      { value: '옵션 2', label: '옵션 2' },
      { value: '옵션 3', label: '옵션 3' },
    ],
  } },
  { key: 'title', label: '공고명' },
];
<Table columns={filterColumns} rows={rows} rowKey="id" />

// 헤더 메뉴 — 컬럼에 headerMenu를 주면 헤더 우측에 ghost 아이콘 버튼(24)이 생기고 클릭 시 Popover 메뉴가 열린다.
// sortable=true면 오름차순/내림차순 정렬 항목이 자동 추가되어 그 컬럼 기준으로 정렬된다. items로 다른 기능을 더 넣을 수 있다.
const sortColumns = [
  { key: 'title', label: '공고명' },
  { key: 'apply', label: '지원서', width: 120, headerMenu: {
    sortable: true,
    items: [{ key: 'export', label: '엑셀 다운로드', onClick: () => {} }],
  } },
];
<Table columns={sortColumns} rows={rows} rowKey="id" />`;

const USAGE_PROPS = [
  { name: 'columns', type: '{ key, label, width?, align?, render?, renderHeader?, filter?, headerMenu? }[]', default: '[]', desc: '컬럼 정의. filter=헤더 필터 Select, headerMenu={sortable,items}=헤더 우측 정렬/기능 메뉴 버튼' },
  { name: 'rows', type: 'object[]', default: '[]', desc: '데이터 배열. 각 컬럼 key로 값 매칭' },
  { name: 'rowKey', type: 'string', default: "'id'", desc: 'row를 구분할 고유 키 필드명' },
  { name: 'selectable', type: 'boolean', default: 'false', desc: '체크박스 선택 컬럼(전체선택 헤더 포함)' },
  { name: 'selectedIds', type: 'array', default: '—', desc: '선택된 row 키 목록 — 제어로 쓸 때' },
  { name: 'onSelectChange', type: '(ids) => void', default: '—', desc: '선택 변경 핸들러' },
  { name: 'filters', type: '{ [colKey]: value }', default: '—', desc: '헤더 필터 선택값 — 제어로 쓸 때(미지정 시 내부 상태)' },
  { name: 'onFilterChange', type: '(filters) => void', default: '—', desc: '헤더 필터 변경 핸들러' },
  { name: 'sort', type: "{ key, dir:'asc'|'desc' } | null", default: '—', desc: '정렬 상태 — 제어로 쓸 때(미지정 시 내부 상태)' },
  { name: 'onSortChange', type: '(sort) => void', default: '—', desc: '헤더 메뉴 정렬 변경 핸들러' },
  { name: 'bordered', type: 'boolean', default: 'false', desc: '외곽선 + 라운드(true) / 외곽선 없는 헤더(false)' },
  { name: 'wrap', type: 'boolean', default: 'false', desc: '본문 줄바꿈 — false=말줄임+행 고정, true=줄바꿈으로 늘어남' },
  { name: 'maxHeight', type: 'number', default: '—', desc: '지정 시 본문 세로 스크롤 + 헤더 고정(px)' },
  { name: 'minWidth', type: 'number', default: '—', desc: '테이블 최소 너비. 좁아지면 가로 스크롤 자동' },
  { name: 'scrollX', type: 'boolean', default: 'false', desc: 'minWidth 없이 가로 스크롤을 수동으로 켬' },
  { name: 'loading', type: 'boolean', default: 'false', desc: '로딩 상태 표시' },
  { name: 'loadingMessage', type: 'string', default: "'불러오는 중…'", desc: '로딩 중 문구' },
  { name: 'emptyMessage', type: 'string', default: "'데이터가 없습니다.'", desc: 'rows가 비었을 때 문구' },
  { name: 'onRowClick', type: '(row) => void', default: '—', desc: '행 클릭 핸들러' },
  { name: 'className', type: 'string', default: "''", desc: '추가 클래스' },
];

// 헤더 필터 — '구분' 컬럼 헤더에 인라인 텍스트형 Select(size 20). 선택값(row.type)으로 행을 거른다.
// 옵션 맨 앞에 전체 옵션(기본 '구분 전체')이 자동 추가되며, 그걸 고르면 필터 해제. render(Tag)로 셀을 꾸며도 필터는 원본 값(type) 기준.
const TYPE_FILTER = {
  options: [
    { value: '옵션 1', label: '옵션 1' },
    { value: '옵션 2', label: '옵션 2' },
    { value: '옵션 3', label: '옵션 3' },
  ],
};

// 헤더 메뉴 — 헤더 우측 ghost 아이콘 버튼(24)이 Popover 메뉴를 연다. sortable이면 오름/내림차순 정렬 자동 제공.
// items로 임의 기능(예: 엑셀 다운로드)을 추가할 수 있다.
const APPLY_MENU = {
  sortable: true,
  items: [{ key: 'export', label: '엑셀 다운로드', onClick: () => {} }],
};

// Figma table 가이드(node 7257:1925) 예시 데이터 — 채용 공고 목록
const COLUMNS = [
  { key: 'type',   label: '구분',     width: 120, filter: TYPE_FILTER, render: (row) => <Tag color="blue">{row.type}</Tag> },
  { key: 'title',  label: '공고명' }, // width 미지정 → 가변(나머지 폭 채움)
  { key: 'period', label: '접수 기간', width: 280 },
  { key: 'apply',  label: '지원서',   width: 120, headerMenu: APPLY_MENU },
  { key: 'eval',   label: '평가',     width: 120, headerMenu: { sortable: true } },
];

const ROWS = [
  { id: 1, type: '옵션 1', title: '2026 상반기 통합채용',  period: '26.04.17 (10:00) ~ 26.05.20 (10:00)', apply: '2개', eval: '2개' },
  { id: 2, type: '옵션 2', title: '2026 신입 개발자 공채', period: '26.05.01 (09:00) ~ 26.05.31 (18:00)', apply: '5개', eval: '3개' },
  { id: 3, type: '옵션 1', title: '2026 하계 인턴십',     period: '26.06.10 (10:00) ~ 26.06.24 (10:00)', apply: '1개', eval: '1개' },
  { id: 4, type: '옵션 3', title: '2026 경력직 수시채용',  period: '26.06.10 (10:00) ~ 26.06.24 (10:00)', apply: '1개', eval: '1개' },
  { id: 5, type: '옵션 2', title: '2026 디자이너 채용',   period: '26.06.10 (10:00) ~ 26.06.24 (10:00)', apply: '1개', eval: '1개' },
];

// Scroll — Horizontal 전용 — '지원서' 셀을 Underline 텍스트 Button(size 32)으로 렌더(값이 버튼 텍스트).
const H_SCROLL_COLUMNS = COLUMNS.map((c) =>
  c.key === 'apply'
    ? { ...c, render: (row) => <Button variant="underline" size="32">{row.apply}</Button> }
    : c,
);

// wrap 옵션 비교용 — 공고명 컬럼을 고정 폭(200)으로 좁혀, 긴 텍스트가 그 안에서 잘리거나 줄바꿈되게 한다.
const WRAP_COLUMNS = [
  { key: 'type',  label: '구분',   width: 120, filter: TYPE_FILTER, render: (row) => <Tag color="blue">{row.type}</Tag> },
  { key: 'title', label: '공고명', width: 200 },
  { key: 'apply', label: '지원서', width: 100 },
];

const ROWS_LONG = [
  { id: 1, type: '옵션 1', title: '2026 상반기 신입·경력 통합 공개채용 (서울/부산/대전 동시 진행)', apply: '2개' },
  { id: 2, type: '옵션 2', title: '2026 신입 개발자 공개채용 — 프론트엔드/백엔드/모바일 전 직군',  apply: '5개' },
];

// first=true(첫 블록)는 구분선 없이 flush, 이후 블록은 상단 구분선으로 단락을 나눈다.
function Block({ title, desc, first = false, children }) {
  return (
    <>
      {!first && <Divider className="mt-spacing-9 mb-spacing-8" />}
      <div>
        <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">{title}</h3>
        {desc && <p className="mb-spacing-5 text-12 text-font-icon-4">{desc}</p>}
        {children}
      </div>
    </>
  );
}

export function TablePage() {
  return (
    <section className="mx-auto max-w-5xl px-spacing-7 py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-20 font-semibold text-font-icon-5">Table</h2>
      <p className="mb-spacing-9 text-14 text-font-icon-4">
        데이터 테이블 — 컬럼 정의(columns)와 데이터(rows)를 받아 렌더합니다.<br />선택(체크박스)·세로 스크롤(헤더 고정)·가로
        스크롤·빈 상태·로딩을 props로 옵션화했고, 색·간격·보더는 table 시멘틱 토큰(base 경유)만 사용합니다.
      </p>

      <UsageExample code={USAGE} props={USAGE_PROPS} note="columns의 render로 셀을 자유롭게 렌더하고, key는 row 데이터의 필드명과 매칭됩니다." />

      <Block
        first
        title="Default"
        desc="기본 테이블 — 외곽선 없는 라운드 헤더(noneline). 구분 컬럼은 필터 Select(기본 '구분 전체'), 지원서·평가 컬럼은 헤더 우측 ⇅ 메뉴 버튼(오름/내림차순 정렬·기능)을 가집니다."
      >
        <Table columns={COLUMNS} rows={ROWS} minWidth={420} />
      </Block>

      <Block
        title="Header — 정렬·기능 메뉴"
        desc="컬럼에 headerMenu를 주면 헤더 우측에 ghost 아이콘 버튼(24)이 생기고, 클릭 시 Popover 메뉴가 열립니다. sortable이면 오름/내림차순 정렬이 자동 제공되어 그 컬럼 기준으로 정렬되고(현재 정렬은 파란색 표시), items로 '엑셀 다운로드' 같은 다른 기능도 넣을 수 있습니다. (지원서: 정렬+기능 / 평가: 정렬만)"
      >
        <Table columns={COLUMNS} rows={ROWS} minWidth={420} />
      </Block>

      <Block title="Default — Empty" desc="기본(noneline) 테이블의 빈 상태. emptyMessage로 문구 지정.">
        <Table columns={COLUMNS} rows={[]} minWidth={420} />
      </Block>

      <Block title="Default — Loading" desc="기본(noneline) 테이블의 로딩 상태 — 스피너 + 안내 문구.">
        <Table columns={COLUMNS} rows={[]} loading minWidth={420} />
      </Block>

      <Block
        title="Row — 말줄임 (wrap=false, 기본)"
        desc="공고명(고정 200px) 긴 텍스트를 한 줄로 말줄임 → 행 높이 고정. 잘리면 hover로 전체 텍스트 툴팁."
      >
        <Table columns={WRAP_COLUMNS} rows={ROWS_LONG} />
      </Block>

      <Block
        title="Row — 줄바꿈 (wrap=true)"
        desc="같은 공고명(고정 200px)이 줄바꿈되어 행이 세로로 늘어남."
      >
        <Table columns={WRAP_COLUMNS} rows={ROWS_LONG} wrap />
      </Block>

      <Block
        title="Scroll"
        desc="스크롤 테이블 — 외곽선 + 체크박스 선택(전체선택 헤더) + 세로 스크롤. 헤더 고정, 세로 스크롤은 오버레이로 표시됩니다."
      >
        <Table columns={COLUMNS} rows={ROWS} selectable bordered maxHeight={200} minWidth={420} />
      </Block>

      <Block
        title="Scroll — Horizontal"
        desc="minWidth(테이블 최소 너비)만 지정하면 컨테이너(560px)보다 좁아질 때 가로 스크롤이 자동으로 생깁니다. 세로·가로 모두 오버레이 스크롤바(ScrollArea)."
      >
        <div className="max-w-[560px]">
          <Table columns={H_SCROLL_COLUMNS} rows={ROWS} selectable bordered maxHeight={200} minWidth={960} />
        </div>
      </Block>

      <Block title="Scroll — Empty" desc="스크롤 테이블의 빈 상태.">
        <Table columns={COLUMNS} rows={[]} bordered minWidth={420} />
      </Block>

      <Block title="Scroll — Loading" desc="스크롤 테이블의 로딩 상태 — 스피너 + 안내 문구.">
        <Table columns={COLUMNS} rows={[]} loading bordered minWidth={420} />
      </Block>
    </section>
  );
}
