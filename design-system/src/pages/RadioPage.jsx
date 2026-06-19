import { useState } from 'react';
import { Radio, RadioGroup } from '../components/Radio';
import { UsageExample } from '../components/UsageExample';

const USAGE = `import { Radio, RadioGroup } from '../components/Radio';

// 라디오 그룹 (단일 선택) — 권장
const [value, setValue] = useState('a');
<RadioGroup
  value={value}
  onChange={setValue}
  items={[
    { value: 'a', label: '옵션 A' },
    { value: 'b', label: '옵션 B' },
    { value: 'c', label: '옵션 C', disabled: true },
  ]}
/>

// 단일 라디오 (제어/비제어)
<Radio checked={value === 'a'} onChange={() => setValue('a')} label="옵션 A" name="g" />
<Radio defaultChecked label="기본 선택" name="g" />
<Radio disabled label="비활성" />`;

const RADIO_PROPS = [
  { name: 'checked', type: 'boolean', default: '—', desc: '선택 여부 (제어 컴포넌트로 쓸 때)' },
  { name: 'defaultChecked', type: 'boolean', default: 'false', desc: '초기 선택 여부 (비제어)' },
  { name: 'onChange', type: '(e) => void', default: '—', desc: '변경 핸들러' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '비활성 — 클릭 차단(회색)' },
  { name: 'label', type: 'string', default: '—', desc: '오른쪽 라벨 텍스트 (생략 시 원만)' },
  { name: 'name', type: 'string', default: '—', desc: '라디오 그룹 name (단일 선택 묶음)' },
  { name: 'value', type: 'string', default: '—', desc: 'input value' },
  { name: 'className', type: 'string', default: "''", desc: '추가 클래스' },
];

const GROUP_PROPS = [
  { name: 'items', type: '{value,label,disabled?}[]', default: '[]', desc: '라디오 항목 목록' },
  { name: 'value', type: 'string', default: '—', desc: '선택값 (제어 컴포넌트)' },
  { name: 'defaultValue', type: 'string', default: '—', desc: '초기 선택값 (비제어)' },
  { name: 'onChange', type: '(value) => void', default: '—', desc: '선택 변경 핸들러' },
  { name: 'name', type: 'string', default: '자동', desc: '그룹 name (미지정 시 자동 생성)' },
  { name: 'direction', type: "'vertical' | 'horizontal'", default: "'vertical'", desc: '배치 방향' },
  { name: 'gap', type: 'spacing 토큰 키', default: "'7'", desc: '항목 간격 (기본 16px)' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '그룹 전체 비활성' },
  { name: 'className', type: 'string', default: "''", desc: '추가 클래스' },
];

const ROWS = [
  { label: 'Unselected',          props: {} },
  { label: 'Selected',            props: { defaultChecked: true } },
  { label: 'Unselected disabled', props: { disabled: true } },
  { label: 'Selected disabled',   props: { disabled: true, defaultChecked: true } },
];

// 인터랙티브 — 그룹 단일 선택
function InteractiveGroup() {
  const [value, setValue] = useState('apple');
  return (
    <RadioGroup
      value={value}
      onChange={setValue}
      items={[
        { value: 'apple', label: '사과' },
        { value: 'banana', label: '바나나' },
        { value: 'cherry', label: '체리' },
        { value: 'durian', label: '두리안 (품절)', disabled: true },
      ]}
    />
  );
}

export function RadioPage() {
  return (
    <section className="mx-auto max-w-5xl px-spacing-7 py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-20 font-semibold text-font-icon-5">Radio</h2>
      <p className="mb-spacing-8 text-14 text-font-icon-4">
        라디오 버튼 — unselected/selected × default/hover/disabled. <span className="text-font-icon-5">Hover</span>는
        마우스를 올려 확인하세요(바깥 ring 표시).<br />여러 항목 중 하나를 고를 때는 <span className="text-font-icon-5">RadioGroup</span>을
        사용합니다. 색은 radio 시멘틱 토큰(base 경유)을 사용합니다.
      </p>

      <UsageExample code={USAGE} props={RADIO_PROPS} />

      <h3 className="mb-spacing-5 text-15 font-semibold text-font-icon-5">
        States
      </h3>
      <div className="space-y-spacing-6">
        {ROWS.map(({ label, props }) => (
          <div key={label} className="grid grid-cols-[160px_1fr] items-center gap-x-spacing-6">
            <p className="text-12 text-font-icon-3">{label}</p>
            <Radio label="라디오버튼" {...props} />
          </div>
        ))}
      </div>

      {/* RadioGroup — 단일 선택 */}
      <div className="mt-spacing-9 border-t border-base-gray-100 pt-spacing-8">
        <h3 className="mb-spacing-5 text-15 font-semibold text-font-icon-5">
          RadioGroup (단일 선택)
        </h3>
        <UsageExample
          code={`<RadioGroup value={value} onChange={setValue} items={items} />`}
          props={GROUP_PROPS}
        />
        <h4 className="mb-spacing-5 text-13 text-font-icon-4">세로 배치 (direction="vertical", 기본)</h4>
        <InteractiveGroup />

        <h4 className="mb-spacing-5 mt-spacing-8 text-13 text-font-icon-4">가로 배치 (direction="horizontal")</h4>
        <RadioGroup
          direction="horizontal"
          defaultValue="m"
          items={[
            { value: 's', label: 'S' },
            { value: 'm', label: 'M' },
            { value: 'l', label: 'L' },
          ]}
        />
      </div>

      {/* 라벨 없음 */}
      <div className="mt-spacing-9 border-t border-base-gray-100 pt-spacing-8">
        <h3 className="mb-spacing-5 text-15 font-semibold text-font-icon-5">
          라벨 없음
        </h3>
        <div className="flex items-center gap-spacing-6">
          <Radio name="bare" />
          <Radio name="bare" defaultChecked />
        </div>
      </div>
    </section>
  );
}
