import { useState, Fragment } from 'react';
import { LayoutGrid, List as ListIcon, Calendar } from 'lucide-react';
import { SegmentControlButton, SegmentControlGroup } from '../../src/components/SegmentControl';
import { UsageExample } from '../components/UsageExample';
import { Divider } from '../../src/components/Divider';

const USAGE = `import { SegmentControlGroup } from '../../src/components/SegmentControl';
import { LayoutGrid, List, Calendar } from 'lucide-react';

// 그룹 — 단일 선택 관리(uncontrolled)
<SegmentControlGroup
  defaultValue="board"
  onChange={(v) => console.log(v)}
  items={[
    { value: 'board', label: '보드' },
    { value: 'list',  label: '리스트' },
    { value: 'cal',   label: '캘린더' },
  ]}
/>

// controlled
const [view, setView] = useState('board');
<SegmentControlGroup value={view} onChange={setView} items={...} />

// 아이콘 — 컴포넌트 자체를 전달(<LayoutGrid /> 아님)
items={[
  { value: 'board', label: '보드', leftIcon: LayoutGrid },
  { value: 'list',  label: '리스트', leftIcon: List },
]}

// 아이콘 전용 — icon + ariaLabel
items={[
  { value: 'board', icon: LayoutGrid, ariaLabel: '보드' },
  { value: 'list',  icon: List, ariaLabel: '리스트' },
]}

// 사이즈 24 · 간격 변경
<SegmentControlGroup size="24" gap="6" items={...} />`;

const GROUP_PROPS = [
  { name: 'items', type: '{ value, label, leftIcon?, rightIcon?, icon?, disabled?, ariaLabel? }[]', default: '[]', desc: '세그먼트 목록. 아이콘은 lucide 컴포넌트 자체를 전달' },
  { name: 'value', type: 'any', default: '—', desc: 'controlled 선택값(주면 외부에서 제어)' },
  { name: 'defaultValue', type: 'any', default: '—', desc: 'uncontrolled 초기 선택값' },
  { name: 'onChange', type: '(value) => void', default: '—', desc: '선택 변경 핸들러' },
  { name: 'size', type: "'32' | '24'", default: "'32'", desc: '버튼 높이(px) — 모든 버튼에 적용' },
  { name: 'gap', type: "'3' | '4' | '5' | '6' | '7'", default: "'5'", desc: "버튼 간격 토큰 — '5'=8px(기본)" },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '그룹 전체 비활성' },
  { name: 'className', type: 'string', default: "''", desc: '추가 클래스' },
];

const BUTTON_PROPS = [
  { name: 'children', type: 'ReactNode', default: '—', desc: '버튼 라벨(icon 전용일 땐 생략)' },
  { name: 'size', type: "'32' | '24'", default: "'32'", desc: '버튼 높이(px)' },
  { name: 'selected', type: 'boolean', default: 'false', desc: '선택 상태 — 배경/진한 텍스트' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '비활성 — 흐림 + 클릭 차단' },
  { name: 'leftIcon', type: 'lucide 컴포넌트', default: 'null', desc: '텍스트 왼쪽 아이콘' },
  { name: 'rightIcon', type: 'lucide 컴포넌트', default: 'null', desc: '텍스트 오른쪽 아이콘' },
  { name: 'icon', type: 'lucide 컴포넌트', default: 'null', desc: '아이콘 전용 버튼(텍스트 없음)' },
  { name: 'onClick', type: '(e) => void', default: '—', desc: '클릭 핸들러(비활성 시 차단)' },
  { name: 'className', type: 'string', default: "''", desc: '추가 클래스' },
];

// 버튼 종류 × 상태 매트릭스
const BUTTON_ROWS = [
  { rowLabel: 'Text only',  props: {}, text: '다음 단계' },
  { rowLabel: 'Left icon',  props: { leftIcon: Calendar }, text: '다음 단계' },
  { rowLabel: 'Right icon', props: { rightIcon: Calendar }, text: '다음 단계' },
  { rowLabel: 'Icon only',  props: { icon: Calendar, 'aria-label': '다음 단계' } },
];

const BUTTON_STATES = [
  { label: 'Default',  extra: {} },
  { label: 'Selected', extra: { selected: true } },
  { label: 'Disabled', extra: { disabled: true } },
];

function ButtonMatrix() {
  return (
    <div className="mb-spacing-7 overflow-hidden rounded-round-4 border border-base-gray-100">
      <div className="border-b border-base-gray-100 bg-white px-spacing-7 py-spacing-5">
        <p className="text-16 font-semibold text-base-gray-900">세그먼트 컨트롤 버튼 (종류 × 상태)</p>
      </div>
      <div className="bg-base-gray-50 px-spacing-7 py-spacing-7">
        {['32', '24'].map((size, idx) => (
          <Fragment key={size}>
            {idx > 0 && <Divider className="mt-spacing-8 mb-spacing-8" />}
            <div>
            <p className="mb-spacing-5 text-14 font-semibold uppercase tracking-wide text-font-icon-3">
              Size {size}
            </p>

            <div className="mb-spacing-3 grid grid-cols-[80px_1fr_1fr_1fr] items-center gap-x-spacing-5">
              <div />
              {BUTTON_STATES.map(({ label }) => (
                <p key={label} className="text-center text-xs text-font-icon-3">{label}</p>
              ))}
            </div>

            <div className="space-y-spacing-4">
              {BUTTON_ROWS.map(({ rowLabel, props, text }) => (
                <div
                  key={rowLabel}
                  className="grid grid-cols-[80px_1fr_1fr_1fr] items-center gap-x-spacing-5"
                >
                  <p className="text-xs text-font-icon-3">{rowLabel}</p>
                  {BUTTON_STATES.map(({ label, extra }) => (
                    <div key={label} className="flex justify-center">
                      <SegmentControlButton size={size} {...props} {...extra}>
                        {text}
                      </SegmentControlButton>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

const VIEW_ITEMS = [
  { value: 'board', label: '보드', leftIcon: LayoutGrid },
  { value: 'list',  label: '리스트', leftIcon: ListIcon },
  { value: 'cal',   label: '캘린더', leftIcon: Calendar },
];

const TEXT_ITEMS = [
  { value: 's1', label: '세그먼트 컨트롤 1' },
  { value: 's2', label: '세그먼트 컨트롤 2' },
  { value: 's3', label: '세그먼트 컨트롤 3' },
  { value: 's4', label: '세그먼트 컨트롤 4' },
];

const ICON_ITEMS = [
  { value: 'board', icon: LayoutGrid, ariaLabel: '보드' },
  { value: 'list',  icon: ListIcon, ariaLabel: '리스트' },
  { value: 'cal',   icon: Calendar, ariaLabel: '캘린더' },
];

export function SegmentControlPage() {
  const [view, setView] = useState('board');

  return (
    <section className="mx-auto max-w-5xl px-spacing-7 py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-20 font-semibold">Segment Control</h2>
      <p className="mb-spacing-8 text-14 text-font-icon-4">
        여러 선택지 중 하나를 고르는 ghost 기반 토글 버튼 묶음. 버튼 1개(SegmentControlButton)와 단일 선택을
        관리하는 그룹(SegmentControlGroup)으로 구성됩니다.
      </p>

      <UsageExample
        code={USAGE}
        props={GROUP_PROPS}
        note="아이콘은 lucide-react 컴포넌트를 그대로 prop으로 넘깁니다. 그룹은 items 배열로 구성하며 controlled/uncontrolled 모두 지원합니다."
      />

      {/* 버튼 종류 × 상태 */}
      <ButtonMatrix />

      {/* 그룹 — 텍스트 (Figma 기준) */}
      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div>
        <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">그룹 — 텍스트</h3>
        <p className="mb-spacing-7 text-14 text-font-icon-4">
          <code className="text-font-icon-3">SegmentControlGroup</code>은 클릭 시 하나의 항목을 선택합니다.
          아래는 uncontrolled(<code className="text-font-icon-3">defaultValue</code>) 예시입니다.
        </p>
        <SegmentControlGroup defaultValue="s2" items={TEXT_ITEMS} />
      </div>

      {/* 그룹 — controlled + 아이콘 */}
      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div>
        <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">그룹 — 아이콘 + 텍스트 (controlled)</h3>
        <p className="mb-spacing-7 text-14 text-font-icon-4">
          현재 선택: <code className="text-font-icon-5">{view}</code>
        </p>
        <SegmentControlGroup value={view} onChange={setView} items={VIEW_ITEMS} />
      </div>

      {/* 그룹 — 아이콘 전용 + 사이즈 24 */}
      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div>
        <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">그룹 — 아이콘 전용 · Size 24</h3>
        <UsageExample code={`<SegmentControlButton selected leftIcon={Calendar}>다음 단계</SegmentControlButton>`} props={BUTTON_PROPS} title="SegmentControlButton 옵션" />
        <div className="flex flex-wrap items-center gap-spacing-9">
          <div>
            <p className="mb-spacing-4 text-12 text-font-icon-3">아이콘 전용 · Size 32</p>
            <SegmentControlGroup defaultValue="board" items={ICON_ITEMS} />
          </div>
          <div>
            <p className="mb-spacing-4 text-12 text-font-icon-3">아이콘 전용 · Size 24</p>
            <SegmentControlGroup defaultValue="list" size="24" items={ICON_ITEMS} />
          </div>
          <div>
            <p className="mb-spacing-4 text-12 text-font-icon-3">텍스트 · Size 24 · gap 12px</p>
            <SegmentControlGroup defaultValue="s1" size="24" gap="6" items={TEXT_ITEMS.slice(0, 3)} />
          </div>
        </div>
      </div>

      {/* 그룹 비활성 */}
      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div>
        <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">그룹 — 비활성</h3>
        <SegmentControlGroup defaultValue="s2" disabled items={TEXT_ITEMS.slice(0, 3)} />
      </div>
    </section>
  );
}
