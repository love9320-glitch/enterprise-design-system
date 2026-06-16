import { SearchBar } from '../components/SearchBar';
import { UsageExample } from '../components/UsageExample';

const USAGE = `import { SearchBar } from '../components/SearchBar';

// 비제어 + 제출(Enter) 콜백
<SearchBar onSubmit={(value) => search(value)} />

// 제어 컴포넌트
const [q, setQ] = useState('');
<SearchBar value={q} onChange={(e) => setQ(e.target.value)} />

// 너비(숫자=px, 문자열=CSS 길이) · placeholder · 비활성
<SearchBar width={320} placeholder="이름 검색" />
<SearchBar width="100%" disabled />`;

const USAGE_PROPS = [
  { name: 'value', type: 'string', default: '—', desc: '입력값 (제어 컴포넌트로 쓸 때)' },
  { name: 'defaultValue', type: 'string', default: '—', desc: '초기값 (비제어로 쓸 때)' },
  { name: 'onChange', type: '(e) => void', default: '—', desc: '입력 변경 핸들러 (e.target.value)' },
  { name: 'onSubmit', type: '(value) => void', default: '—', desc: 'Enter 제출 시 현재 값을 전달' },
  { name: 'placeholder', type: 'string', default: "'검색어를 입력하세요'", desc: '플레이스홀더 문구' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '비활성 — 입력 차단' },
  { name: 'width', type: 'number | string', default: '200', desc: '너비 — 숫자=px, 문자열=CSS 길이(예: "100%")' },
  { name: 'inputProps', type: 'object', default: '{}', desc: '내부 <input>에 전달할 속성(autoFocus 등)' },
  { name: 'className', type: 'string', default: "''", desc: '컨테이너 추가 클래스' },
];

const ROWS = [
  { label: 'Default',  props: {} },
  { label: 'Filled',   props: { defaultValue: '검색어 입력 완료' } },
  { label: 'Disabled', props: { disabled: true, defaultValue: '검색 비활성' } },
];

export function SearchBarPage() {
  return (
    <section className="mx-auto max-w-5xl px-spacing-7 py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-20 font-semibold text-font-icon-5">Search Bar</h2>
      <p className="mb-spacing-8 text-14 text-font-icon-4">
        돋보기 아이콘 + 입력 (solid 타입). <span className="text-font-icon-5">Hover</span>·
        <span className="text-font-icon-5">Focus</span> 상태는 마우스를 올리거나 클릭해 직접 확인하세요.<br />
        테두리는 ring으로 구현해 두께가 바뀌어도 레이아웃이 밀리지 않습니다.
      </p>

      <UsageExample code={USAGE} props={USAGE_PROPS} />

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
        <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">Width 옵션</h3>
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
