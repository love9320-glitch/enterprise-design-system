import { useState } from 'react';
import { Pagination } from '../components/Pagination';

export function PaginationPage() {
  const [page, setPage] = useState(3);
  const [pageSize, setPageSize] = useState(10);

  return (
    <section className="mx-auto max-w-5xl px-spacing-7 py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-18 font-semibold text-font-icon-5">Pagination</h2>
      <p className="mb-spacing-8 text-14 text-font-icon-4">
        <span className="text-font-icon-5">총 개수</span> · 페이지 이동 컨트롤
        (<span className="text-font-icon-5">« ‹ 번호 › »</span>) ·
        <span className="text-font-icon-5"> 페이지 행</span> Select로 구성됩니다. 현재 페이지는 회색
        원형으로 강조하고, 처음/마지막에서는 이동 아이콘을 흐리게 비활성화합니다. 페이지 번호는{' '}
        <code className="text-font-icon-5">maxButtons</code> 윈도우(보통 10개·5개)로 노출됩니다.
      </p>

      {/* 인터랙티브 */}
      <div className="mb-spacing-9 rounded-round-5 border border-base-gray-100 p-spacing-8">
        <p className="mb-spacing-6 text-13 font-semibold text-font-icon-5">
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

      <div className="space-y-spacing-10">
        {/* 번호 10개 */}
        <div>
          <p className="mb-spacing-5 text-12 text-font-icon-3">번호 10개 (maxButtons=10)</p>
          <Pagination defaultPage={3} totalCount={100} maxButtons={10} />
        </div>

        {/* 총 200개 — 10개씩이면 20페이지(블록 [1-10]/[11-20]) */}
        <div>
          <p className="mb-spacing-5 text-12 text-font-icon-3">총 200개 (20페이지 · 두 번째 블록)</p>
          <Pagination defaultPage={12} totalCount={200} maxButtons={10} />
        </div>

        {/* 번호 5개 */}
        <div>
          <p className="mb-spacing-5 text-12 text-font-icon-3">번호 5개 (maxButtons=5)</p>
          <Pagination defaultPage={3} totalCount={100} maxButtons={5} />
        </div>

        {/* 페이지 3개뿐 — 마지막 페이지에서 다음/마지막 비활성 */}
        <div>
          <p className="mb-spacing-5 text-12 text-font-icon-3">페이지가 3개뿐 (마지막 페이지 = 비활성)</p>
          <Pagination defaultPage={3} totalCount={30} maxButtons={10} />
        </div>

        {/* 총/행 숨김 — 번호 컨트롤만 */}
        <div>
          <p className="mb-spacing-5 text-12 text-font-icon-3">컨트롤만 (showTotal·showPageSize=false)</p>
          <Pagination defaultPage={1} totalCount={50} maxButtons={5} showTotal={false} showPageSize={false} />
        </div>
      </div>
    </section>
  );
}
