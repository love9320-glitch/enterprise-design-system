import { Table } from '../components/Table';
import { Tag } from '../components/Tag';
import { Button } from '../components/Button';

// Figma table 가이드(node 7257:1925) 예시 데이터 — 채용 공고 목록
const COLUMNS = [
  { key: 'type',   label: '구분',     width: 80,  render: () => <Tag type="blue">태그</Tag> },
  { key: 'title',  label: '공고명' }, // width 미지정 → 가변(나머지 폭 채움)
  { key: 'period', label: '접수 기간', width: 280 },
  { key: 'apply',  label: '지원서',   width: 100 },
  { key: 'eval',   label: '평가',     width: 100 },
];

const ROWS = [
  { id: 1, title: '2026 상반기 통합채용',  period: '26.04.17 (10:00) ~ 26.05.20 (10:00)', apply: '2개', eval: '2개' },
  { id: 2, title: '2026 신입 개발자 공채', period: '26.05.01 (09:00) ~ 26.05.31 (18:00)', apply: '5개', eval: '3개' },
  { id: 3, title: '2026 하계 인턴십',     period: '26.06.10 (10:00) ~ 26.06.24 (10:00)', apply: '1개', eval: '1개' },
  { id: 4, title: '2026 경력직 수시채용',  period: '26.06.10 (10:00) ~ 26.06.24 (10:00)', apply: '1개', eval: '1개' },
  { id: 5, title: '2026 디자이너 채용',   period: '26.06.10 (10:00) ~ 26.06.24 (10:00)', apply: '1개', eval: '1개' },
];

// Scroll — Horizontal 전용 — '지원서' 셀을 고스트 Button(size 32)으로 렌더(값이 버튼 텍스트).
const H_SCROLL_COLUMNS = COLUMNS.map((c) =>
  c.key === 'apply'
    ? { ...c, render: (row) => <Button variant="ghost" size="32">{row.apply}</Button> }
    : c,
);

// wrap 옵션 비교용 — 공고명 컬럼을 고정 폭(200)으로 좁혀, 긴 텍스트가 그 안에서 잘리거나 줄바꿈되게 한다.
const WRAP_COLUMNS = [
  { key: 'type',  label: '구분',   width: 80,  render: () => <Tag type="blue">태그</Tag> },
  { key: 'title', label: '공고명', width: 200 },
  { key: 'apply', label: '지원서', width: 100 },
];

const ROWS_LONG = [
  { id: 1, title: '2026 상반기 신입·경력 통합 공개채용 (서울/부산/대전 동시 진행)', apply: '2개' },
  { id: 2, title: '2026 신입 개발자 공개채용 — 프론트엔드/백엔드/모바일 전 직군',  apply: '5개' },
];

function Block({ title, desc, children }) {
  return (
    <div className="mb-spacing-10">
      <h3 className="mb-spacing-3 text-xs font-semibold uppercase tracking-wide text-font-icon-3">{title}</h3>
      {desc && <p className="mb-spacing-5 text-12 text-font-icon-4">{desc}</p>}
      {children}
    </div>
  );
}

export function TablePage() {
  return (
    <section className="mx-auto max-w-5xl px-spacing-7 py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-18 font-semibold text-font-icon-5">Table</h2>
      <p className="mb-spacing-9 text-14 text-font-icon-4">
        데이터 테이블 — 컬럼 정의(columns)와 데이터(rows)를 받아 렌더합니다. 선택(체크박스)·세로 스크롤(헤더 고정)·가로
        스크롤·빈 상태·로딩을 props로 옵션화했고, 색·간격·보더는 table 시멘틱 토큰(base 경유)만 사용합니다.
      </p>

      <Block title="Default" desc="기본 테이블 — 외곽선 없는 라운드 헤더(noneline). 구분 컬럼은 Tag로 렌더.">
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
