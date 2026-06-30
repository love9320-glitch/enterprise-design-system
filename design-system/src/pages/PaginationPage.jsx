import { useState } from 'react';
import { Pagination } from '../components/Pagination';
import { UsageExample } from '../components/UsageExample';
import { Divider } from '../components/Divider';

const USAGE = `import { Pagination } from '../components/Pagination';

// 제어 컴포넌트 — page/pageSize를 직접 관리
const [page, setPage] = useState(1);
const [pageSize, setPageSize] = useState(10);
<Pagination
  page={page}
  onChange={setPage}
  pageSize={pageSize}
  onPageSizeChange={setPageSize}
  totalCount={100}
/>

// 비제어(defaultPage) · 번호 윈도우 5개
<Pagination defaultPage={3} totalCount={100} maxButtons={5} />

// 번호 컨트롤만 (총 개수·페이지 행 숨김)
<Pagination defaultPage={1} totalCount={50} showTotal={false} showPageSize={false} />`;

const USAGE_PROPS = [
  { name: 'page', type: 'number', default: '—', desc: '현재 페이지(1-base) — 제어 컴포넌트로 쓸 때' },
  { name: 'defaultPage', type: 'number', default: '1', desc: '초기 페이지 (비제어)' },
  { name: 'onChange', type: '(page) => void', default: '—', desc: '페이지 이동 핸들러' },
  { name: 'totalCount', type: 'number', default: '0', desc: '총 항목 수 (totalPages 미지정 시 페이지 수 계산)' },
  { name: 'totalPages', type: 'number', default: '—', desc: '총 페이지 수 (지정 시 totalCount보다 우선)' },
  { name: 'pageSize', type: 'number', default: '—', desc: '페이지당 행 수 — 제어로 쓸 때' },
  { name: 'defaultPageSize', type: 'number', default: '10', desc: '초기 페이지당 행 수 (비제어)' },
  { name: 'onPageSizeChange', type: '(size) => void', default: '—', desc: '페이지 행 변경 핸들러' },
  { name: 'pageSizeOptions', type: 'number[]', default: '[5, 10, 20, 50]', desc: '페이지 행 Select 선택지' },
  { name: 'maxButtons', type: 'number', default: '10', desc: '번호 노출 개수(윈도우) — 보통 10 또는 5' },
  { name: 'showTotal', type: 'boolean', default: 'true', desc: "좌측 '총 N개' 표시" },
  { name: 'showPageSize', type: 'boolean', default: 'true', desc: "우측 '페이지 행' Select 표시" },
  { name: 'className', type: 'string', default: "''", desc: '추가 클래스' },
];

export function PaginationPage() {
  const [page, setPage] = useState(3);
  const [pageSize, setPageSize] = useState(10);

  return (
    <section className="mx-auto max-w-5xl px-spacing-7 py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-20 font-semibold text-font-icon-5">Pagination</h2>
      <p className="mb-spacing-8 text-14 text-font-icon-4">
        <span className="text-font-icon-5">총 개수</span> · 페이지 이동 컨트롤
        (<span className="text-font-icon-5">« ‹ 번호 › »</span>) ·
        <span className="text-font-icon-5"> 페이지 행</span> Select로 구성됩니다.<br />현재 페이지는 회색
        원형으로 강조하고, 처음/마지막에서는 이동 아이콘을 흐리게 비활성화합니다. <br/> 페이지 번호는{' '}
        <code className="text-font-icon-5">maxButtons</code> 윈도우(보통 10개·5개)로 노출됩니다.
      </p>

      <UsageExample code={USAGE} props={USAGE_PROPS} />

      {/* 인터랙티브 */}
      <div className="mb-spacing-9 rounded-round-5 border border-base-gray-100 p-spacing-8">
        <p className="mb-spacing-6 text-15 font-semibold text-font-icon-5">
          인터랙티브 (현재 {page} 페이지 / {pageSize}개씩)
        </p>
        <Pagination
          page={page}
          onChange={setPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          totalCount={100}
        />
      </div>

      <div>
        {/* 번호 10개 */}
        <Divider className="mt-spacing-9 mb-spacing-8" />
        <div>
          <p className="mb-spacing-5 text-12 text-font-icon-3">번호 10개 (maxButtons=10)</p>
          <Pagination defaultPage={3} totalCount={100} maxButtons={10} />
        </div>

        {/* 총 200개 — 10개씩이면 20페이지(블록 [1-10]/[11-20]) */}
        <Divider className="mt-spacing-9 mb-spacing-8" />
        <div>
          <p className="mb-spacing-5 text-12 text-font-icon-3">총 200개 (20페이지 · 두 번째 블록)</p>
          <Pagination defaultPage={12} totalCount={200} maxButtons={10} />
        </div>

        {/* 번호 5개 */}
        <Divider className="mt-spacing-9 mb-spacing-8" />
        <div>
          <p className="mb-spacing-5 text-12 text-font-icon-3">번호 5개 (maxButtons=5)</p>
          <Pagination defaultPage={3} totalCount={100} maxButtons={5} />
        </div>

        {/* 페이지 3개뿐 — 마지막 페이지에서 다음/마지막 비활성 */}
        <Divider className="mt-spacing-9 mb-spacing-8" />
        <div>
          <p className="mb-spacing-5 text-12 text-font-icon-3">페이지가 3개뿐 (마지막 페이지 = 비활성)</p>
          <Pagination defaultPage={3} totalCount={30} maxButtons={10} />
        </div>

        {/* 총/행 숨김 — 번호 컨트롤만 */}
        <Divider className="mt-spacing-9 mb-spacing-8" />
        <div>
          <p className="mb-spacing-5 text-12 text-font-icon-3">컨트롤만 (showTotal·showPageSize=false)</p>
          <Pagination defaultPage={1} totalCount={50} maxButtons={5} showTotal={false} showPageSize={false} />
        </div>
      </div>
    </section>
  );
}
