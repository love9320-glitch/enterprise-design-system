// TableTemplatePage — 테이블 템플릿 데모
// 재사용 컴포넌트 TableTemplate(버튼그룹 + 검색 + Table + Pagination)의 옵션을 보여준다.
// 각 요소(버튼그룹/검색바/페이지네이션/외곽선/선택)는 props로 끄고 켤 수 있다.
// Figma:
//   - table (bordered = false) template (node 7332:1754663)
//   - list page template (table control + table bordered = true) (node 7332:1755608)
import { useState } from 'react';
import { Plus, Upload, Download, Trash2 } from 'lucide-react';
import { TableTemplate } from '../components/TableTemplate';
import { Button } from '../components/Button';
import { Checkbox } from '../components/Checkbox';
import { Select } from '../components/Select';
import { Tag } from '../components/Tag';
import { UsageExample } from '../components/UsageExample';

const USAGE = `import { TableTemplate } from '../components/TableTemplate';

const columns = [
  { key: 'type', label: '구분', width: 80, render: () => <Tag color="blue">태그</Tag> },
  // 헤더 요소: filter=헤더 인라인 Select로 그 컬럼 필터, headerMenu=헤더 ⋮ 메뉴(오름/내림차순 정렬 등)
  { key: 'status', label: '상태', width: 120, filter: { options: STATUS_OPTIONS } },
  { key: 'title', label: '공고명', headerMenu: { sortable: true } },
  { key: 'period', label: '접수 기간', width: 280, headerMenu: { sortable: true } },
];

// 모든 요소 ON (기본)
<TableTemplate columns={columns} rows={rows} actions={<Button variant="line">추가</Button>} />

// 페이지네이션 끄기 / 검색 끄기 / 버튼그룹 끄기
<TableTemplate columns={columns} rows={rows} pagination={false} />
<TableTemplate columns={columns} rows={rows} searchable={false} />
<TableTemplate columns={columns} rows={rows} actions={null} />

// 페이지네이션 없이 — maxHeight로 표 높이를 제한(초과 시 세로 스크롤, 헤더 고정)
<TableTemplate columns={columns} rows={rows} pagination={false} maxHeight={320} />

// 페이지네이션 있을 때 — 페이지당 행 수 설정(초기값/선택 옵션). 행 수 셀렉트는 Pagination에 내장
<TableTemplate columns={columns} rows={rows} defaultPageSize={20} pageSizeOptions={[10, 20, 50]} />

// 외곽선 + 체크박스 선택(list page 타입). actions에 함수를 주면 선택 항목 접근 가능
<TableTemplate
  columns={columns} rows={rows} bordered selectable
  actions={({ selectedIds, clearSelection }) => (
    <Button variant="line" disabled={!selectedIds.length} onClick={() => { remove(selectedIds); clearSelection(); }}>
      삭제
    </Button>
  )}
/>`;

const USAGE_PROPS = [
  { name: 'columns', type: '{ key, label, width?, align?, render?, renderHeader?, filter?, headerMenu? }[]', default: '[]', desc: 'Table 컬럼 정의. filter=헤더 필터 Select, headerMenu=헤더 정렬/기능 메뉴 — 검색·페이지네이션과 함께 전체 행에 적용됨' },
  { name: 'rows', type: 'object[]', default: '[]', desc: '데이터 배열(전체) — 검색/페이지네이션은 내부에서 처리' },
  { name: 'rowKey', type: 'string', default: "'id'", desc: 'row 고유 키 필드명' },
  { name: 'actions', type: 'ReactNode | (ctx) => ReactNode', default: 'null', desc: '버튼그룹 내용. null이면 버튼그룹 숨김. 함수면 ctx={selectedIds, clearSelection, visibleRows, query} 전달' },
  { name: 'title', type: 'ReactNode', default: 'null', desc: '테이블 타이틀 — 있으면 헤더 좌측(버튼그룹 왼쪽)에 표시(버튼그룹/검색바와 함께 표시 가능)' },
  { name: 'searchable', type: 'boolean', default: 'true', desc: '검색바 on/off' },
  { name: 'pagination', type: 'boolean', default: 'true', desc: '페이지네이션 on/off (false면 전체 행 표시)' },
  { name: 'bordered', type: 'boolean', default: 'false', desc: '테이블 외곽선/라운드 타입' },
  { name: 'selectable', type: 'boolean', default: 'false', desc: '체크박스 선택 컬럼(전체선택 헤더 포함)' },
  { name: 'searchPlaceholder', type: 'string', default: "'검색어를 입력하세요'", desc: '검색바 placeholder' },
  { name: 'searchKeys', type: 'string[]', default: '텍스트 컬럼 전체', desc: '검색 대상 컬럼 key 목록' },
  { name: 'defaultPageSize', type: 'number', default: '10', desc: '페이지당 행 수 초기값(uncontrolled)' },
  { name: 'pageSize / onPageSizeChange', type: 'number / (size)=>void', default: '—', desc: '페이지당 행 수를 외부에서 제어할 때' },
  { name: 'pageSizeOptions', type: 'number[]', default: '[5,10,20,50]', desc: '행 수 선택 옵션 — Pagination 내장 ‘페이지 행’ 셀렉트에 노출' },
  { name: 'page / onPageChange', type: 'number / (page)=>void', default: '—', desc: '현재 페이지를 외부에서 제어/관찰할 때' },
  { name: 'showPageSize', type: 'boolean', default: 'true', desc: "우측 '페이지 행' 셀렉트 표시 여부" },
  { name: 'showTotal', type: 'boolean', default: 'true', desc: "좌측 '총 N개' 표시 여부" },
  { name: 'maxButtons', type: 'number', default: '10', desc: '페이지 번호 노출 개수(윈도우)' },
  { name: 'paginationClassName', type: 'string', default: "''", desc: '페이지네이션 영역 전용 클래스' },
  { name: 'selectedIds / onSelectChange', type: 'array / (ids)=>void', default: '—', desc: '선택 상태를 외부에서 제어할 때' },
  { name: 'minWidth', type: 'number', default: '720', desc: '테이블 최소 너비(좁아지면 가로 스크롤)' },
  { name: 'maxHeight', type: 'number', default: '—', desc: '표 높이 제한(px). 주로 pagination=false일 때 사용 — 초과하면 세로 스크롤 + 헤더 고정' },
  { name: 'emptyMessage', type: 'string', default: "'데이터가 없습니다.'", desc: 'rows가 비었을 때 문구' },
];

// 상태값 → Tag 색
const STATUS_TAG = { 진행: 'blue', 마감: 'gray', 예정: 'red' };
const STATUSES = ['진행', '마감', '예정'];

// 인라인 텍스트형 Select 옵션 — 헤더 상태 필터 / 바디 지원서·평가
const STATUS_OPTIONS = STATUSES.map((s) => ({ value: s, label: s }));
const APPLY_OPTIONS = [1, 2, 3, 4, 5].map((n) => ({ value: `${n}개`, label: `${n}개` }));
const EVAL_OPTIONS = [1, 2, 3].map((n) => ({ value: `${n}개`, label: `${n}개` }));

// 컬럼 정의 — 규칙 4(상수 배열). 구분은 Tag, 공고명은 가변(fill) 폭.
// 헤더 요소(Table 내장): 상태 컬럼은 filter(헤더 인라인 Select, 실제 행 필터), 공고명·접수 기간은 headerMenu(정렬 메뉴 버튼).
// 본문: 지원서·평가는 인라인 텍스트형 Select로 렌더.
const COLUMNS = [
  { key: 'type',   label: '구분',     width: 80,  render: () => <Tag color="blue">태그</Tag> },
  {
    key: 'status', label: '상태', width: 120,
    filter: { options: STATUS_OPTIONS }, // 헤더 인라인 Select(size 20) + 실제 필터('상태 전체'=해제)
    render: (row) => <Tag color={STATUS_TAG[row.status]}>{row.status}</Tag>,
  },
  {
    key: 'title', label: '공고명',
    headerMenu: { sortable: true }, // 헤더 우측 ⋮ 메뉴 — 오름/내림차순 정렬
    render: (row) => (
      <Button variant="underline" truncate onClick={(e) => e.stopPropagation()}>{row.title}</Button>
    ),
  },
  { key: 'period', label: '접수 기간', width: 280, headerMenu: { sortable: true } },
  {
    key: 'apply', label: '지원서', width: 110,
    render: (row) => <Select variant="text" size="24" menuWidth={80} options={APPLY_OPTIONS} defaultValue={row.apply} />,
  },
  {
    key: 'eval', label: '평가', width: 110,
    render: (row) => <Select variant="text" size="24" menuWidth={80} options={EVAL_OPTIONS} defaultValue={row.eval} />,
  },
];

// 샘플 데이터(총 100개) — 페이지네이션이 의미 있도록 충분히 생성.
const TITLES = [
  '2026 상반기 통합채용', '2026 신입 개발자 공채', '2026 하계 인턴십',
  '2026 경력직 수시채용', '2026 디자이너 채용', '2026 마케팅 부문 공채', '2026 영업관리직 채용',
];
const PERIODS = [
  '26.04.17 (10:00) ~ 26.05.20 (10:00)',
  '26.05.01 (09:00) ~ 26.05.31 (18:00)',
  '26.06.10 (10:00) ~ 26.06.24 (10:00)',
];
const ALL_ROWS = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  title: TITLES[i % TITLES.length],
  status: STATUSES[i % STATUSES.length],
  period: PERIODS[i % PERIODS.length],
  apply: `${(i % 5) + 1}개`,
  eval: `${(i % 3) + 1}개`,
}));

let nextId = ALL_ROWS.length + 1;

// 추가/삭제가 동작하는 데모 래퍼 — rows 상태를 보유하고 actions를 만들어 TableTemplate에 넘긴다.
// (추가/삭제는 앱 로직이라 템플릿이 아닌 사용처에서 구현한다 — actions 슬롯의 의도)
// actionSet='rich'이면 버튼그룹에 여러 버튼(추가/가져오기/내보내기 + 선택 시 삭제)을 보여준다.
function DemoTemplate({ withActions = true, actionSet = 'default', ...templateProps }) {
  const { initialRows, selectable, ...rest } = templateProps;
  const [rows, setRows] = useState(initialRows ?? ALL_ROWS);
  const rich = actionSet === 'rich';

  const addRow = () => {
    const id = nextId++;
    setRows((prev) => [
      { id, title: `신규 공고 ${id}`, status: '예정', period: PERIODS[0], apply: '0개', eval: '0개' },
      ...prev,
    ]);
  };

  const actions = !withActions
    ? null
    : ({ selectedIds, clearSelection }) => (
        <>
          <Button variant="line" leftIcon={rich ? Plus : undefined} onClick={addRow}>추가</Button>
          {rich && (
            <>
              <Button variant="line" leftIcon={Upload}>가져오기</Button>
              <Button variant="line" leftIcon={Download}>내보내기</Button>
            </>
          )}
          {selectable && (
            <Button
              variant="line"
              leftIcon={rich ? Trash2 : undefined}
              disabled={selectedIds.length === 0}
              onClick={() => {
                const removing = new Set(selectedIds);
                setRows((prev) => prev.filter((r) => !removing.has(r.id)));
                clearSelection();
              }}
            >
              삭제{rich && selectedIds.length > 0 ? ` (${selectedIds.length})` : ''}
            </Button>
          )}
        </>
      );

  return <TableTemplate columns={COLUMNS} rows={rows} actions={actions} selectable={selectable} {...rest} />;
}

// 페이지네이션 없이일 때 고를 수 있는 표 높이 옵션
const HEIGHT_OPTIONS = [
  { value: 0,   label: '제한 없음' },
  { value: 240, label: '240px' },
  { value: 320, label: '320px' },
  { value: 400, label: '400px' },
];

// 페이지네이션 있을 때 고를 수 있는 페이지당 행 수 옵션
const PAGE_SIZE_OPTIONS = [
  { value: 5,  label: '5개씩' },
  { value: 10, label: '10개씩' },
  { value: 20, label: '20개씩' },
  { value: 50, label: '50개씩' },
];

// 페이지 번호 노출 개수(윈도우) 옵션
const MAX_BUTTONS_OPTIONS = [
  { value: 5,  label: '5개' },
  { value: 10, label: '10개' },
];

// 실시간 옵션 토글 플레이그라운드 — 각 요소를 체크박스로 끄고 켜본다.
function Playground() {
  const [opts, setOpts] = useState({
    title: false, actions: true, search: true, pagination: true, bordered: false, selectable: false,
    showTotal: true, showPageSize: true, // 페이지네이션 세부 요소
  });
  const [maxHeight, setMaxHeight] = useState(320); // 페이지네이션 없이일 때 표 높이(px), 0=제한 없음
  const [pageSize, setPageSize] = useState(10);    // 페이지네이션 있을 때 페이지당 행 수
  const [maxButtons, setMaxButtons] = useState(10); // 페이지 번호 노출 개수(윈도우)
  const toggle = (k) => setOpts((o) => ({ ...o, [k]: !o[k] }));

  return (
    <div>
      <div className="mb-spacing-7 rounded-round-4 border border-base-gray-100 px-spacing-7 py-spacing-6">
        {/* 1행: 요소 on/off 토글 */}
        <div className="flex min-h-[32px] flex-wrap items-center gap-x-spacing-9 gap-y-spacing-5">
          <Checkbox checked={opts.title}      onChange={() => toggle('title')}      label="타이틀" />
          <Checkbox checked={opts.actions}    onChange={() => toggle('actions')}    label="버튼그룹" />
          <Checkbox checked={opts.search}     onChange={() => toggle('search')}     label="검색바" />
          <Checkbox checked={opts.pagination} onChange={() => toggle('pagination')} label="페이지네이션" />
          <Checkbox checked={opts.bordered}   onChange={() => toggle('bordered')}   label="외곽선(bordered)" />
          <Checkbox checked={opts.selectable} onChange={() => toggle('selectable')} label="체크박스 선택" />
        </div>

        {/* 2행: 페이지네이션 세부 옵션(켜짐) / 표 높이(꺼짐) — 상단 구분선으로 1행과 분리 */}
        <div className="mt-spacing-5 flex min-h-[32px] flex-wrap items-center gap-x-spacing-9 gap-y-spacing-5 border-t border-base-gray-100 pt-spacing-5">
          {opts.pagination ? (
            <>
              <Checkbox checked={opts.showTotal}    onChange={() => toggle('showTotal')}    label="총 N개 표시" />
              <Checkbox checked={opts.showPageSize} onChange={() => toggle('showPageSize')} label="페이지 행 셀렉트" />
              <label className="inline-flex items-center gap-spacing-4 text-14 text-font-icon-5">
                행 수
                <Select
                  options={PAGE_SIZE_OPTIONS}
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  width={120}
                />
              </label>
              <label className="inline-flex items-center gap-spacing-4 text-14 text-font-icon-5">
                번호 개수
                <Select
                  options={MAX_BUTTONS_OPTIONS}
                  value={maxButtons}
                  onChange={(e) => setMaxButtons(Number(e.target.value))}
                  width={100}
                />
              </label>
            </>
          ) : (
            /* 페이지네이션을 끄면 표 높이(maxHeight)를 고를 수 있다 — 초과 시 세로 스크롤 + 헤더 고정 */
            <label className="inline-flex items-center gap-spacing-4 text-14 text-font-icon-5">
              표 높이
              <Select
                options={HEIGHT_OPTIONS}
                value={maxHeight}
                onChange={(e) => setMaxHeight(Number(e.target.value))}
                width={120}
              />
            </label>
          )}
        </div>
      </div>
      {/* 옵션 박스와 테이블 템플릿 사이 구분선 */}
      <div className="border-t border-base-gray-100 pt-spacing-7">
        <DemoTemplate
          actionSet="rich"
          withActions={opts.actions}
          title={opts.title ? '공고 목록' : null}
          searchable={opts.search}
          pagination={opts.pagination}
          bordered={opts.bordered}
          selectable={opts.selectable}
          pageSize={opts.pagination ? pageSize : undefined}
          onPageSizeChange={setPageSize}
          pageSizeOptions={[5, 10, 20, 50]}
          showTotal={opts.showTotal}
          showPageSize={opts.showPageSize}
          maxButtons={maxButtons}
          maxHeight={!opts.pagination && maxHeight ? maxHeight : undefined}
        />
      </div>
    </div>
  );
}

// first=true(첫 블록)는 구분선 없이 flush, 이후 블록은 상단 구분선으로 단락을 나눈다.
function Block({ title, desc, first = false, children }) {
  return (
    <div className={first ? '' : 'mt-spacing-10 border-t border-base-gray-100 pt-spacing-9'}>
      <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">{title}</h3>
      {desc && <p className="mb-spacing-6 text-12 text-font-icon-4">{desc}</p>}
      {children}
    </div>
  );
}

export function TableTemplatePage() {
  return (
    <section className="mx-auto max-w-5xl px-spacing-7 py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-20 font-semibold text-font-icon-5">Table Template</h2>
      <p className="mb-spacing-9 text-14 text-font-icon-4">
        table control(버튼그룹 + 검색바) · Table · Pagination을 묶은 목록 페이지 템플릿입니다.<br />
        각 요소를 props로 끄고 켤 수 있고, 검색·페이지네이션·선택·추가/삭제가 실제로 동작합니다. 색·간격·보더는 토큰만 사용합니다.
      </p>

      <UsageExample code={USAGE} props={USAGE_PROPS} note="actions=null로 버튼그룹을, searchable=false로 검색을, pagination=false로 페이지네이션을 끌 수 있습니다. bordered/selectable로 테이블 타입을 바꿉니다." />

      <Block
        first
        title="Playground — 요소 끄고 켜기"
        desc={
          <>
            체크박스로 버튼그룹·검색바·페이지네이션·외곽선·선택을 실시간 토글해 보세요.<br />
            버튼그룹에는 추가·가져오기·내보내기(+선택 시 삭제) 버튼을 넣어 두었고, 테이블 헤더에는 상태 필터 Select와 공고명·접수 기간 정렬 메뉴(⋮)를 달아 두었습니다(필터·정렬은 검색·페이지네이션과 함께 전체 행에 적용됩니다).<br />
            <code className="text-font-icon-5">title</code>을 켜면 <strong className="font-semibold text-font-icon-5">버튼그룹 왼쪽</strong>에 "공고 목록"이 함께 표시됩니다.
          </>
        }
      >
        <Playground />
      </Block>
    </section>
  );
}
