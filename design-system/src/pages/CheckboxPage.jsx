import { useState } from 'react';
import { Checkbox, CheckboxGroup } from '../components/Checkbox';
import { UsageExample } from '../components/UsageExample';

const USAGE = `import { Checkbox } from '../components/Checkbox';

// 제어 컴포넌트
const [checked, setChecked] = useState(false);
<Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} label="동의" />

// 비제어 (defaultChecked) · 라벨 없음 · 비활성
<Checkbox defaultChecked label="기본 선택" />
<Checkbox />
<Checkbox disabled label="비활성" />`;

const USAGE_PROPS = [
  { name: 'checked', type: 'boolean', default: '—', desc: '체크 여부 (제어 컴포넌트로 쓸 때)' },
  { name: 'defaultChecked', type: 'boolean', default: 'false', desc: '초기 체크 여부 (비제어)' },
  { name: 'onChange', type: '(e) => void', default: '—', desc: '변경 핸들러 (e.target.checked)' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '비활성 — 클릭 차단(회색)' },
  { name: 'label', type: 'string', default: '—', desc: '오른쪽 라벨 텍스트 (생략 시 박스만)' },
  { name: 'className', type: 'string', default: "''", desc: '추가 클래스' },
];

const GROUP_PROPS = [
  { name: 'items', type: '{value,label,disabled?}[]', default: '[]', desc: '체크박스 항목 목록' },
  { name: 'value', type: 'string[]', default: '—', desc: '선택값 배열 (제어 컴포넌트)' },
  { name: 'defaultValue', type: 'string[]', default: '[]', desc: '초기 선택값 배열 (비제어)' },
  { name: 'onChange', type: '(values, {value,checked}) => void', default: '—', desc: '선택 변경 핸들러 (다음 선택값 배열)' },
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

// 인터랙티브 — 그룹 다중 선택
function InteractiveGroup() {
  const [values, setValues] = useState(['apple']);
  return (
    <div className="space-y-spacing-5">
      <CheckboxGroup
        value={values}
        onChange={setValues}
        items={[
          { value: 'apple', label: '사과' },
          { value: 'banana', label: '바나나' },
          { value: 'cherry', label: '체리' },
          { value: 'durian', label: '두리안 (품절)', disabled: true },
        ]}
      />
      <p className="text-12 text-font-icon-3">선택됨: {values.length ? values.join(', ') : '없음'}</p>
    </div>
  );
}

export function CheckboxPage() {
  return (
    <section className="mx-auto max-w-5xl px-spacing-7 py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-20 font-semibold text-font-icon-5">Checkbox</h2>
      <p className="mb-spacing-8 text-14 text-font-icon-4">
        체크박스 — unselected/selected × default/hover/disabled. <span className="text-font-icon-5">Hover</span>는
        마우스를 올려 확인하세요(바깥 ring 표시).<br />색은 checkbox 시멘틱 토큰(base 경유)을 사용합니다.
      </p>

      <UsageExample code={USAGE} props={USAGE_PROPS} />

      <h3 className="mb-spacing-5 text-15 font-semibold text-font-icon-5">
        States
      </h3>
      <div className="space-y-spacing-6">
        {ROWS.map(({ label, props }) => (
          <div key={label} className="grid grid-cols-[160px_1fr] items-center gap-x-spacing-6">
            <p className="text-12 text-font-icon-3">{label}</p>
            <Checkbox label="체크박스" {...props} />
          </div>
        ))}
      </div>

      {/* CheckboxGroup — 다중 선택 */}
      <div className="mt-spacing-9 border-t border-base-gray-100 pt-spacing-8">
        <h3 className="mb-spacing-5 text-15 font-semibold text-font-icon-5">
          CheckboxGroup (다중 선택)
        </h3>
        <UsageExample
          code={`<CheckboxGroup value={values} onChange={setValues} items={items} />`}
          props={GROUP_PROPS}
        />
        <h4 className="mb-spacing-5 text-13 text-font-icon-4">세로 배치 (direction="vertical", 기본)</h4>
        <InteractiveGroup />

        <h4 className="mb-spacing-5 mt-spacing-8 text-13 text-font-icon-4">가로 배치 (direction="horizontal")</h4>
        <CheckboxGroup
          direction="horizontal"
          defaultValue={['m']}
          items={[
            { value: 's', label: 'S' },
            { value: 'm', label: 'M' },
            { value: 'l', label: 'L' },
          ]}
        />
      </div>

      {/* 라벨 없는 체크박스 */}
      <div className="mt-spacing-9 border-t border-base-gray-100 pt-spacing-8">
        <h3 className="mb-spacing-5 text-15 font-semibold text-font-icon-5">
          라벨 없음
        </h3>
        <div className="flex items-center gap-spacing-6">
          <Checkbox />
          <Checkbox defaultChecked />
        </div>
      </div>
    </section>
  );
}
