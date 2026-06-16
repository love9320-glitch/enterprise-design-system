import { useState } from 'react';
import { Checkbox } from '../components/Checkbox';
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

const ROWS = [
  { label: 'Unselected',          props: {} },
  { label: 'Selected',            props: { defaultChecked: true } },
  { label: 'Unselected disabled', props: { disabled: true } },
  { label: 'Selected disabled',   props: { disabled: true, defaultChecked: true } },
];

// 인터랙티브 — 클릭으로 토글
function InteractiveDemo() {
  const [checked, setChecked] = useState(false);
  return (
    <Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} label="클릭해서 토글" />
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

      {/* 인터랙티브 */}
      <div className="mt-spacing-9 border-t border-base-gray-100 pt-spacing-8">
        <h3 className="mb-spacing-5 text-15 font-semibold text-font-icon-5">
          Interactive
        </h3>
        <InteractiveDemo />
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
