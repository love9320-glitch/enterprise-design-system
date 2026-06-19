import { Switch } from '../components/Switch';
import { UsageExample } from '../components/UsageExample';

const USAGE = `import { Switch } from '../components/Switch';

// 제어 컴포넌트
const [on, setOn] = useState(false);
<Switch checked={on} onChange={(e) => setOn(e.target.checked)} label="알림 받기" />

// 비제어 (defaultChecked) · 라벨 없음 · 비활성
<Switch defaultChecked label="기본 켜짐" />
<Switch />
<Switch disabled label="비활성" />`;

const USAGE_PROPS = [
  { name: 'checked', type: 'boolean', default: '—', desc: '켜짐 여부 (제어 컴포넌트로 쓸 때)' },
  { name: 'defaultChecked', type: 'boolean', default: 'false', desc: '초기 켜짐 여부 (비제어)' },
  { name: 'onChange', type: '(e) => void', default: '—', desc: '변경 핸들러 (e.target.checked)' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '비활성 — 클릭 차단(회색)' },
  { name: 'label', type: 'string', default: '—', desc: '오른쪽 라벨 텍스트 (생략 시 토글만)' },
  { name: 'className', type: 'string', default: "''", desc: '추가 클래스' },
];

const ROWS = [
  { label: 'Off',          props: {} },
  { label: 'On',           props: { defaultChecked: true } },
  { label: 'Off disabled', props: { disabled: true } },
  { label: 'On disabled',  props: { disabled: true, defaultChecked: true } },
];

export function SwitchPage() {
  return (
    <section className="mx-auto max-w-5xl px-spacing-7 py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-20 font-semibold text-font-icon-5">Switch</h2>
      <p className="mb-spacing-8 text-14 text-font-icon-4">
        스위치 토글 — off/on × default/hover/disabled. <span className="text-font-icon-5">Hover</span>는
        마우스를 올려 확인하세요(바깥 ring 표시).<br />색은 switch 시멘틱 토큰(base 경유)을 사용합니다.
      </p>

      <UsageExample code={USAGE} props={USAGE_PROPS} />

      <h3 className="mb-spacing-5 text-15 font-semibold text-font-icon-5">
        States
      </h3>
      <div className="space-y-spacing-6">
        {ROWS.map(({ label, props }) => (
          <div key={label} className="grid grid-cols-[160px_1fr] items-center gap-x-spacing-6">
            <p className="text-12 text-font-icon-3">{label}</p>
            <Switch label="스위치" {...props} />
          </div>
        ))}
      </div>

      {/* 라벨 없음 */}
      <div className="mt-spacing-9 border-t border-base-gray-100 pt-spacing-8">
        <h3 className="mb-spacing-5 text-15 font-semibold text-font-icon-5">
          라벨 없음
        </h3>
        <div className="flex items-center gap-spacing-6">
          <Switch />
          <Switch defaultChecked />
        </div>
      </div>
    </section>
  );
}
