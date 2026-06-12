import { SearchBar } from '../components/SearchBar';

const ROWS = [
  { label: 'Default',  props: {} },
  { label: 'Filled',   props: { defaultValue: '검색어 입력 완료' } },
  { label: 'Disabled', props: { disabled: true, defaultValue: '검색 비활성' } },
];

export function SearchBarPage() {
  return (
    <section className="mx-auto max-w-3xl px-spacing-7 py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-18 font-semibold text-font-icon-5">Search Bar</h2>
      <p className="mb-spacing-8 text-14 text-font-icon-4">
        돋보기 아이콘 + 입력 (solid 타입). <span className="text-font-icon-5">Hover</span>·
        <span className="text-font-icon-5">Focus</span> 상태는 마우스를 올리거나 클릭해 직접 확인하세요.
        테두리는 ring으로 구현해 두께가 바뀌어도 레이아웃이 밀리지 않습니다.
      </p>

      <div className="space-y-spacing-7">
        {ROWS.map(({ label, props }) => (
          <div key={label} className="grid grid-cols-[100px_1fr] items-center gap-x-spacing-6">
            <p className="text-12 text-font-icon-3">{label}</p>
            <SearchBar {...props} />
          </div>
        ))}
      </div>

      {/* Width 옵션 — 미지정 시 200px, 숫자(px)나 '100%' 등 지정 가능 */}
      <div className="mt-spacing-9 border-t border-base-gray-100 pt-spacing-8">
        <h3 className="mb-spacing-3 text-13 font-semibold text-font-icon-5">Width 옵션</h3>
        <p className="mb-spacing-7 text-12 text-font-icon-4">
          <code className="text-font-icon-5">width</code> 미지정 시 기본 200px. 숫자는 px,
          문자열은 CSS 길이(<code className="text-font-icon-5">'100%'</code>,{' '}
          <code className="text-font-icon-5">'24rem'</code> 등)로 적용됩니다.
        </p>
        <div className="space-y-spacing-7">
          <div className="grid grid-cols-[120px_1fr] items-center gap-x-spacing-6">
            <p className="text-12 text-font-icon-3">기본 (200px)</p>
            <SearchBar />
          </div>
          <div className="grid grid-cols-[120px_1fr] items-center gap-x-spacing-6">
            <p className="text-12 text-font-icon-3">width=320</p>
            <SearchBar width={320} />
          </div>
          <div className="grid grid-cols-[120px_1fr] items-center gap-x-spacing-6">
            <p className="text-12 text-font-icon-3">width="100%"</p>
            <SearchBar width="100%" />
          </div>
        </div>
      </div>
    </section>
  );
}
