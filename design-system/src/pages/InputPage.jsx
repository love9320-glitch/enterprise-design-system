import { useState } from 'react';
import { Input } from '../components/Input';
import { UsageExample } from '../components/UsageExample';

const USAGE = `import { Input } from '../components/Input';

// 제어 컴포넌트
const [name, setName] = useState('');
<Input value={name} onChange={(e) => setName(e.target.value)} placeholder="이름" />

// readOnly / disabled
<Input value="고정값" readOnly />
<Input disabled />

// 에러 — 테두리 대신 하단 툴팁으로 표시(레이아웃 공간 차지 X)
<Input error errorMessage="필수 입력정보 입니다" width={320} />`;

const USAGE_PROPS = [
  { name: 'value', type: 'string', default: '—', desc: '입력값 (제어 컴포넌트로 쓸 때)' },
  { name: 'defaultValue', type: 'string', default: '—', desc: '초기값 (비제어로 쓸 때)' },
  { name: 'onChange', type: '(e) => void', default: '—', desc: '입력 변경 핸들러 (e.target.value)' },
  { name: 'placeholder', type: 'string', default: "'텍스트를 입력하세요'", desc: '플레이스홀더 문구' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '비활성 — 입력 차단(회색)' },
  { name: 'readOnly', type: 'boolean', default: 'false', desc: '읽기 전용 — 값은 보이되 편집 불가' },
  { name: 'error', type: 'boolean', default: 'false', desc: '에러 상태 — errorMessage 툴팁 표시' },
  { name: 'errorMessage', type: 'string', default: "''", desc: '에러 툴팁 문구 (error=true일 때 하단 오버레이)' },
  { name: 'width', type: 'number | string', default: '200', desc: '너비 — 숫자=px, 문자열=CSS 길이' },
  { name: 'inputProps', type: 'object', default: '{}', desc: '내부 <input>에 전달할 속성' },
  { name: 'className', type: 'string', default: "''", desc: '컨테이너 추가 클래스' },
];

const ROWS = [
  { label: 'Default',   props: {} },
  { label: 'Filled',    props: { defaultValue: '텍스트 입력 완료' } },
  { label: 'Read only', props: { readOnly: true, defaultValue: '읽기 전용 값' } },
  { label: 'Disabled',  props: { disabled: true, defaultValue: '비활성 값' } },
];

// 필수 입력 검증 데모 — 비어 있으면 에러 툴팁, 입력하면 사라진다.
function ValidationDemo() {
  const [value, setValue] = useState('');
  const isEmpty = value.trim() === '';

  return (
    <Input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      error={isEmpty}
      errorMessage="필수 입력정보 입니다"
    />
  );
}

export function InputPage() {
  return (
    <section className="mx-auto max-w-5xl px-spacing-7 py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-20 font-semibold text-font-icon-5">Input</h2>
      <p className="mb-spacing-8 text-14 text-font-icon-4">
        텍스트 입력 필드 (solid 타입). <span className="text-font-icon-5">Hover</span>·
        <span className="text-font-icon-5">Focus</span>는 직접 확인하세요.<br />에러는 테두리를 바꾸지 않고
        <span className="text-font-icon-5"> 툴팁 오버레이</span>로 표시하며, 인풋 아래 공간을 차지하지 않아
        다른 컴포넌트 영역에 영향을 주지 않습니다.
      </p>

      <UsageExample code={USAGE} props={USAGE_PROPS} />

      <div className="space-y-spacing-7">
        {ROWS.map(({ label, props }) => (
          <div key={label} className="grid grid-cols-[100px_1fr] items-center gap-x-spacing-6">
            <p className="text-12 text-font-icon-3">{label}</p>
            <Input {...props} />
          </div>
        ))}

        {/* Error — 툴팁이 아래로 오버레이되므로 행 하단에 여백을 둔다 */}
        <div className="grid grid-cols-[100px_1fr] items-start gap-x-spacing-6 pb-spacing-9">
          <p className="pt-spacing-4 text-12 text-font-icon-3">Error</p>
          <Input error errorMessage="필수 입력정보 입니다" />
        </div>
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
            <Input />
          </div>
          <div className="grid grid-cols-[120px_1fr] items-center gap-x-spacing-6">
            <p className="text-12 text-font-icon-3">width=320</p>
            <Input width={320} defaultValue="320px 너비" />
          </div>
          <div className="grid grid-cols-[120px_1fr] items-center gap-x-spacing-6">
            <p className="text-12 text-font-icon-3">width="100%"</p>
            <Input width="100%" defaultValue="가로 100%" />
          </div>
        </div>
      </div>

      {/* 인터랙티브 — 필수 입력 검증 + 오버레이가 아래 인풋에 영향 없음 시연 */}
      <div className="mt-spacing-9 border-t border-base-gray-100 pt-spacing-8">
        <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">
          인터랙티브 — 필수 입력 검증
        </h3>
        <p className="mb-spacing-7 text-12 text-font-icon-4">
          위 인풋이 비어 있으면 에러 툴팁이 뜨고, 입력하면 사라집니다. 에러 툴팁은 absolute 오버레이라
          <span className="text-font-icon-5"> 아래 인풋의 위치·영역을 전혀 밀지 않습니다</span> —
          위 인풋에 타이핑하며 툴팁이 나타났다 사라져도 아래 인풋이 고정인지 확인하세요.
        </p>
        <div className="space-y-spacing-7">
          <div className="grid grid-cols-[100px_1fr] items-center gap-x-spacing-6">
            <p className="text-12 text-font-icon-3">Validation</p>
            <ValidationDemo />
          </div>
          <div className="grid grid-cols-[100px_1fr] items-center gap-x-spacing-6">
            <p className="text-12 text-font-icon-3">다음 인풋</p>
            <Input defaultValue="고정된 다음 인풋" />
          </div>
        </div>
      </div>
    </section>
  );
}
