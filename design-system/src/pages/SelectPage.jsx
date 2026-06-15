import { Select } from '../components/Select';

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
    <section className="mx-auto max-w-3xl px-spacing-7 py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-18 font-semibold text-font-icon-5">Select</h2>
      <p className="mb-spacing-8 text-14 text-font-icon-4">
        드롭다운 선택 (solid 타입). Input과 같은 필드 컨테이너에 오른쪽 화살표를 둔 형태로,
        <span className="text-font-icon-5"> Hover·Focus</span>는 ring으로 표시합니다. 에러는 테두리를
        바꾸지 않고 <span className="text-font-icon-5">툴팁 오버레이</span>로 표시하며, 아래 공간을
        차지하지 않습니다.
      </p>

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
      <div className="mt-spacing-9 border-t border-base-gray-100 pt-spacing-8">
        <h3 className="mb-spacing-3 text-13 font-semibold text-font-icon-5">Width 옵션</h3>
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
      <div className="mt-spacing-9 border-t border-base-gray-100 pt-spacing-8">
        <h3 className="mb-spacing-3 text-13 font-semibold text-font-icon-5">
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
      <div className="mt-spacing-9 border-t border-base-gray-100 pt-spacing-8">
        <h3 className="mb-spacing-3 text-13 font-semibold text-font-icon-5">
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
    </section>
  );
}
