import { useState } from 'react';
import { Checkbox } from '../components/Checkbox';

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
    <section className="mx-auto max-w-3xl px-spacing-7 py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-18 font-semibold text-font-icon-5">Checkbox</h2>
      <p className="mb-spacing-8 text-14 text-font-icon-4">
        체크박스 — unselected/selected × default/hover/disabled. <span className="text-font-icon-5">Hover</span>는
        마우스를 올려 확인하세요(바깥 ring 표시). 색은 checkbox 시멘틱 토큰(base 경유)을 사용합니다.
      </p>

      <h3 className="mb-spacing-5 text-xs font-semibold uppercase tracking-wide text-font-icon-3">
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
        <h3 className="mb-spacing-5 text-xs font-semibold uppercase tracking-wide text-font-icon-3">
          Interactive
        </h3>
        <InteractiveDemo />
      </div>

      {/* 라벨 없는 체크박스 */}
      <div className="mt-spacing-9 border-t border-base-gray-100 pt-spacing-8">
        <h3 className="mb-spacing-5 text-xs font-semibold uppercase tracking-wide text-font-icon-3">
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
