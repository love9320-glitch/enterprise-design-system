import { Select } from '../components/Select';
import { UsageExample } from '../components/UsageExample';
import { Divider } from '../components/Divider';

const USAGE = `import { Select } from '../components/Select';

const options = [
  { value: 'a', label: '옵션 A' },
  { value: 'b', label: '옵션 B' },
];

// 제어 컴포넌트 — onChange는 { target: { value } } 형태
const [v, setV] = useState('');
<Select options={options} value={v} onChange={(e) => setV(e.target.value)} />

// 검색 가능 · 너비(hug=콘텐츠 맞춤, maxWidth로 제한)
<Select options={options} searchable width="hug" maxWidth={240} menuWidth={280} />

// 펼침 방향 수동 지정 · 에러 툴팁
<Select options={options} placement="top-left" />
<Select options={options} error errorMessage="필수 선택입니다" />

// 인라인 텍스트형 (필터·테이블 바디·문단 사이) — 박스 없이 텍스트+화살표, hug + maxWidth만
<Select variant="text" options={options} placeholder="전체" />
<Select variant="text" size="20" options={options} maxWidth={160} />
// disabled·readOnly·error도 지원 (box와 동일)
<Select variant="text" options={options} readOnly defaultValue="a" />
<Select variant="text" options={options} error errorMessage="필수 선택입니다" />`;

const USAGE_PROPS = [
  { name: 'options', type: '{ value, label }[]', default: '[]', desc: '선택지 목록' },
  { name: 'variant', type: "'box' | 'text'", default: "'box'", desc: "필드형(box) / 인라인 텍스트형(text — 필터·문단 사이용)" },
  { name: 'size', type: "'24' | '20'", default: "'24'", desc: 'text variant 글자 크기 — 24=14px / 20=12px (box는 항상 14px)' },
  { name: 'value', type: 'string', default: '—', desc: '선택값 (제어 컴포넌트로 쓸 때)' },
  { name: 'defaultValue', type: 'string', default: "''", desc: '초기 선택값 (비제어)' },
  { name: 'onChange', type: '(e) => void', default: '—', desc: '선택 변경 — e.target.value 형태로 전달' },
  { name: 'placeholder', type: 'string', default: "'선택하세요'", desc: '미선택 시 표시 문구' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '비활성 — 열기/선택 차단' },
  { name: 'readOnly', type: 'boolean', default: 'false', desc: '읽기 전용 — 값 표시, 변경 불가' },
  { name: 'error', type: 'boolean', default: 'false', desc: '에러 상태 — errorMessage 툴팁 표시' },
  { name: 'errorMessage', type: 'string', default: "''", desc: '에러 툴팁 문구' },
  { name: 'width', type: "number | string | 'hug'", default: '200', desc: "트리거 너비 — px/CSS 길이/'hug'(콘텐츠 맞춤)" },
  { name: 'maxWidth', type: 'number | string', default: '—', desc: 'hug일 때 최대 너비 제한(넘으면 말줄임)' },
  { name: 'menuWidth', type: 'number | string', default: '—', desc: '드롭다운 너비 (미지정 시 box=트리거와 동일 / text=120px)' },
  { name: 'placement', type: "'auto' | 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'", default: "'auto'", desc: '드롭다운 펼침 방향 (auto=공간 따라 자동)' },
  { name: 'searchable', type: 'boolean', default: 'false', desc: '드롭다운 상단 검색바로 옵션 필터' },
  { name: 'searchPlaceholder', type: 'string', default: "'검색어를 입력하세요'", desc: '검색바 플레이스홀더' },
  { name: 'emptyMessage', type: 'string', default: "'옵션이 없습니다.'", desc: 'options가 비었을 때 문구' },
  { name: 'noResultMessage', type: 'string', default: "'검색 결과가 없습니다.'", desc: '검색 결과 없을 때 문구' },
  { name: 'className', type: 'string', default: "''", desc: '트리거 추가 클래스' },
];

const OPTIONS = [
  { value: 'opt1', label: '옵션' },
  { value: 'opt2', label: '짧은 항목' },
  { value: 'opt3', label: '중간 길이 옵션 이름' },
  { value: 'opt4', label: '아주 길어서 잘릴 수도 있는 옵션 이름 예시입니다' },
  { value: 'opt5', label: 'A' },
  { value: 'opt6', label: '꽤 긴 옵션 텍스트 항목' },
  { value: 'opt7', label: '메모' },
];

const ROWS = [
  { label: 'Default',   props: {} },
  { label: 'Filled',    props: { defaultValue: 'opt1' } },
  { label: 'Read only', props: { readOnly: true, defaultValue: 'opt2' } },
  { label: 'Disabled',  props: { disabled: true, defaultValue: 'opt3' } },
];

const SEARCH_OPTIONS = [
  '사과', '바나나', '아주 길어서 반드시 잘리는 스무 글자짜리 과일', '두리안', '포도', '키위',
  '레몬', '망고', '오렌지', '복숭아', '딸기', '수박',
].map((name, i) => ({ value: `f${i}`, label: name }));

export function SelectPage() {
  return (
    <section className="mx-auto max-w-5xl px-spacing-7 py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-20 font-semibold text-font-icon-5">Select</h2>
      <p className="mb-spacing-8 text-14 text-font-icon-4">
        드롭다운 선택 (solid 타입). Input과 같은 필드 컨테이너에 오른쪽 화살표를 둔 형태로,
        <span className="text-font-icon-5"> Hover·Focus</span>는 ring으로 표시합니다.<br />에러는 테두리를
        바꾸지 않고 <span className="text-font-icon-5">툴팁 오버레이</span>로 표시하며, 아래 공간을
        차지하지 않습니다.
      </p>

      <UsageExample code={USAGE} props={USAGE_PROPS} note="options는 { value, label } 배열입니다. width/maxWidth/menuWidth로 트리거와 드롭다운 너비를 따로 제어합니다." />

      <div className="space-y-spacing-7">
        {ROWS.map(({ label, props }) => (
          <div key={label} className="grid grid-cols-[100px_1fr] items-center gap-x-spacing-6">
            <p className="text-12 text-font-icon-3">{label}</p>
            <Select options={OPTIONS} {...props} />
          </div>
        ))}
      </div>

      {/* Error — 툴팁이 아래로 오버레이되므로 행 하단에 여백을 둔다 */}
      <div className="mt-spacing-7 grid grid-cols-[100px_1fr] items-start gap-x-spacing-6 pb-spacing-9">
        <p className="pt-spacing-4 text-12 text-font-icon-3">Error</p>
        <Select options={OPTIONS} error errorMessage="필수 선택입니다" />
      </div>

      {/* Width 옵션 */}
      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div>
        <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">Width 옵션</h3>
        <p className="mb-spacing-7 text-12 text-font-icon-4">
          <code className="text-font-icon-5">width</code> 미지정 시 기본 200px. 숫자는 px,
          문자열은 CSS 길이(<code className="text-font-icon-5">'100%'</code> 등)로 적용됩니다.
        </p>
        <div className="space-y-spacing-7">
          <div className="grid grid-cols-[120px_1fr] items-center gap-x-spacing-6">
            <p className="text-12 text-font-icon-3">기본 (200px)</p>
            <Select options={OPTIONS} />
          </div>
          <div className="grid grid-cols-[120px_1fr] items-center gap-x-spacing-6">
            <p className="text-12 text-font-icon-3">width=320</p>
            <Select options={OPTIONS} width={320} defaultValue="opt1" />
          </div>
          <div className="grid grid-cols-[120px_1fr] items-center gap-x-spacing-6">
            <p className="text-12 text-font-icon-3">width="100%"</p>
            <Select options={OPTIONS} width="100%" defaultValue="opt2" />
          </div>
          <div className="grid grid-cols-[120px_1fr] items-center gap-x-spacing-6">
            <p className="text-12 text-font-icon-3">hug (값 따라 확장)</p>
            <Select options={OPTIONS} width="hug" menuWidth={320} defaultValue="opt6" />
          </div>
          <div className="grid grid-cols-[120px_1fr] items-center gap-x-spacing-6">
            <p className="text-12 text-font-icon-3">hug + maxWidth=180</p>
            <Select options={OPTIONS} width="hug" maxWidth={180} menuWidth={320} defaultValue="opt6" />
          </div>
          <div className="grid grid-cols-[120px_1fr] items-center gap-x-spacing-6">
            <p className="text-12 text-font-icon-3">menuWidth=320</p>
            <Select options={OPTIONS} menuWidth={320} placeholder="드롭다운만 넓게" />
          </div>
        </div>
        <p className="mt-spacing-5 text-12 text-font-icon-4">
          <code className="text-font-icon-5">menuWidth</code> 미지정 시 드롭다운은 트리거(select)와
          같은 너비입니다. 드롭다운은 트리거 위치를 고려해 위/아래·좌/우로 자동 정렬됩니다(공간 부족 시 flip).
        </p>
      </div>

      {/* 검색 가능 */}
      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div>
        <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">
          검색 가능 (searchable)
        </h3>
        <p className="mb-spacing-7 text-12 text-font-icon-4">
          <code className="text-font-icon-5">searchable</code>를 켜면 드롭다운 상단에 검색바가
          생겨 옵션을 필터링합니다. 키보드 <span className="text-font-icon-5">↑↓·Enter·Esc</span>도
          동작하며, 결과가 없으면 List Empty가 표시됩니다. (예: "사" 입력)
        </p>
        <div className="space-y-spacing-7">
          <div className="grid grid-cols-[180px_1fr] items-start gap-x-spacing-6">
            <p className="pt-spacing-4 text-12 text-font-icon-3">width=240</p>
            <Select options={SEARCH_OPTIONS} searchable placeholder="과일 선택" width={240} />
          </div>
          <div className="grid grid-cols-[180px_1fr] items-start gap-x-spacing-6">
            <p className="pt-spacing-4 text-12 text-font-icon-3">hug + menuWidth=280</p>
            <Select
              options={SEARCH_OPTIONS}
              searchable
              placeholder="과일 선택"
              width="hug"
              menuWidth={280}
            />
          </div>
          <div className="grid grid-cols-[180px_1fr] items-start gap-x-spacing-6">
            <p className="pt-spacing-4 text-12 text-font-icon-3">hug + maxWidth=140 · menuWidth=280</p>
            <Select
              options={SEARCH_OPTIONS}
              searchable
              placeholder="검색해서 선택하세요"
              width="hug"
              maxWidth={140}
              menuWidth={280}
              defaultValue="f2"
            />
          </div>
        </div>
        <p className="mt-spacing-5 text-12 text-font-icon-4">
          width 관련 옵션(<code className="text-font-icon-5">width</code>·
          <code className="text-font-icon-5">maxWidth</code>·<code className="text-font-icon-5">menuWidth</code>·
          hug)은 검색 가능한 Select에서도 동일하게 동작합니다. 트리거는 좁게(hug),
          드롭다운·검색바는 넓게(menuWidth) 두는 조합이 검색에 특히 잘 맞습니다.
        </p>
      </div>

      {/* 드롭다운 위치 — 박스 네 모서리 시연 */}
      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div>
        <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">
          드롭다운 위치 (위/아래 · 좌/우)
        </h3>
        <p className="mb-spacing-7 text-12 text-font-icon-4">
          기본은 <code className="text-font-icon-5">placement="auto"</code> — 트리거 위치와 뷰포트
          공간에 맞춰 자동 정렬됩니다. 아래 박스는 네 모서리의 Select를 각 방향으로 고정해, 드롭다운이
          박스 <span className="text-font-icon-5">안쪽으로 펼쳐지는</span> 모습을 보여줍니다.
        </p>
        <div className="relative h-[340px] w-full rounded-round-5 border border-base-gray-200 bg-base-gray-25">
          <div className="absolute left-spacing-7 top-spacing-7">
            <Select options={OPTIONS} placement="bottom-left" placeholder="아래·왼쪽" width={150} />
          </div>
          <div className="absolute right-spacing-7 top-spacing-7">
            <Select options={OPTIONS} placement="bottom-right" placeholder="아래·오른쪽" width={150} menuWidth={250} />
          </div>
          <div className="absolute bottom-spacing-7 left-spacing-7">
            <Select options={OPTIONS} placement="top-left" placeholder="위·왼쪽" width={150} menuWidth={250} />
          </div>
          <div className="absolute bottom-spacing-7 right-spacing-7">
            <Select options={OPTIONS} placement="top-right" placeholder="위·오른쪽" width={150} />
          </div>
          <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-12 text-font-icon-3">
            각 모서리 Select를 열어보세요
          </p>
        </div>
      </div>

      {/* 인라인 텍스트형 (variant="text") */}
      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div>
        <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">
          인라인 텍스트형 (variant="text")
        </h3>
        <p className="mb-spacing-7 text-12 text-font-icon-4">
          필터처럼 <span className="text-font-icon-5">부가적인 선택</span>을 제공할 때 쓰는 타입입니다.
          박스·테두리 없이 <span className="text-font-icon-5">텍스트 + 화살표</span>만 두며, 항상
          콘텐츠 너비(hug)로 줄어들어 <span className="text-font-icon-5">테이블 헤더·문단 사이</span>에
          자연스럽게 끼워 넣습니다. Hover 시 밑줄, 열리면 화살표가 뒤집힙니다. 드롭다운·키보드·검색
          동작은 box 타입과 동일하고, <span className="text-font-icon-5">disabled·readOnly·error</span>도
          지원합니다(테이블 바디·폼 양식용). 너비는 <code className="text-font-icon-5">maxWidth</code>로만
          제한합니다(넘으면 말줄임 + hover 툴팁).
        </p>

        {/* 사이즈 × 상태 */}
        <div className="space-y-spacing-7">
          <div className="grid grid-cols-[140px_1fr] items-center gap-x-spacing-6">
            <p className="text-12 text-font-icon-3">size="24" · default</p>
            <Select variant="text" options={OPTIONS} placeholder="전체" />
          </div>
          <div className="grid grid-cols-[140px_1fr] items-center gap-x-spacing-6">
            <p className="text-12 text-font-icon-3">size="24" · filled</p>
            <Select variant="text" options={OPTIONS} defaultValue="opt3" />
          </div>
          <div className="grid grid-cols-[140px_1fr] items-center gap-x-spacing-6">
            <p className="text-12 text-font-icon-3">size="20" · default</p>
            <Select variant="text" size="20" options={OPTIONS} placeholder="전체" />
          </div>
          <div className="grid grid-cols-[140px_1fr] items-center gap-x-spacing-6">
            <p className="text-12 text-font-icon-3">size="20" · filled</p>
            <Select variant="text" size="20" options={OPTIONS} defaultValue="opt6" />
          </div>
          <div className="grid grid-cols-[140px_1fr] items-center gap-x-spacing-6">
            <p className="text-12 text-font-icon-3">readOnly</p>
            <Select variant="text" options={OPTIONS} readOnly defaultValue="opt1" />
          </div>
          <div className="grid grid-cols-[140px_1fr] items-center gap-x-spacing-6">
            <p className="text-12 text-font-icon-3">disabled</p>
            <Select variant="text" options={OPTIONS} disabled defaultValue="opt1" />
          </div>
        </div>

        {/* Error — 툴팁이 아래로 오버레이되므로 행 하단에 여백 */}
        <div className="mt-spacing-7 grid grid-cols-[140px_1fr] items-start gap-x-spacing-6 pb-spacing-9">
          <p className="text-12 text-font-icon-3">error</p>
          <Select variant="text" options={OPTIONS} error errorMessage="필수 선택입니다" placeholder="전체" />
        </div>

        {/* 너비 (maxWidth) */}
        <Divider className="mt-spacing-9 mb-spacing-8" />
        <div>
          <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">인라인 텍스트형 — 너비 (maxWidth)</h3>
          <p className="mb-spacing-7 text-12 text-font-icon-4">
            너비는 항상 <code className="text-font-icon-5">hug</code>(콘텐츠 맞춤)이며,
            <code className="text-font-icon-5"> maxWidth</code>로 상한만 둡니다. 값이 상한을 넘으면
            말줄임 + hover 툴팁으로 전체 값을 보여줍니다.
          </p>
          <div className="space-y-spacing-7">
            <div className="grid grid-cols-[180px_1fr] items-center gap-x-spacing-6">
              <p className="text-12 text-font-icon-3">기본 (hug · 값 따라 확장)</p>
              <Select variant="text" options={OPTIONS} defaultValue="opt3" menuWidth={280} />
            </div>
            <div className="grid grid-cols-[180px_1fr] items-center gap-x-spacing-6">
              <p className="text-12 text-font-icon-3">maxWidth=160 (말줄임)</p>
              <Select variant="text" options={OPTIONS} maxWidth={160} defaultValue="opt4" menuWidth={280} />
            </div>
            <div className="grid grid-cols-[180px_1fr] items-center gap-x-spacing-6">
              <p className="text-12 text-font-icon-3">maxWidth=240</p>
              <Select variant="text" options={OPTIONS} maxWidth={240} defaultValue="opt4" menuWidth={280} />
            </div>
          </div>
        </div>

        {/* 검색 가능 (searchable) */}
        <Divider className="mt-spacing-9 mb-spacing-8" />
        <div>
          <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">인라인 텍스트형 — 검색 가능 (searchable)</h3>
          <p className="mb-spacing-7 text-12 text-font-icon-4">
            <code className="text-font-icon-5">searchable</code>를 켜면 드롭다운 상단에 검색바가
            생겨 옵션을 필터링합니다. 트리거는 좁게(hug), 드롭다운은 넓게(menuWidth) 두는 조합이
            잘 맞습니다. (예: "사" 입력)
          </p>
          <div className="space-y-spacing-7">
            <div className="grid grid-cols-[180px_1fr] items-start gap-x-spacing-6">
              <p className="pt-spacing-3 text-12 text-font-icon-3">menuWidth=240</p>
              <Select variant="text" options={SEARCH_OPTIONS} searchable placeholder="과일 필터" menuWidth={240} />
            </div>
            <div className="grid grid-cols-[180px_1fr] items-start gap-x-spacing-6">
              <p className="pt-spacing-3 text-12 text-font-icon-3">maxWidth=140 · menuWidth=240</p>
              <Select variant="text" options={SEARCH_OPTIONS} searchable maxWidth={140} menuWidth={240} defaultValue="f2" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
