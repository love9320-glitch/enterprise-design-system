import { useState } from 'react';
import { TextArea } from '../../src/components/TextArea';
import { Checkbox } from '../../src/components/Checkbox';
import { Input } from '../../src/components/Input';
import { UsageExample } from '../components/UsageExample';
import { Divider } from '../../src/components/Divider';

const USAGE = `import { TextArea } from '../../src/components/TextArea';

// 제어 컴포넌트 + 글자수 카운터(maxLength 분모)
const [memo, setMemo] = useState('');
<TextArea value={memo} onChange={(e) => setMemo(e.target.value)} maxLength={100} />

// 카운터 끄기 / readOnly / disabled
<TextArea showCount={false} />
<TextArea value="고정값" readOnly />
<TextArea disabled />

// 자동 높이 — 입력량따라 늘어남. maxRows 주면 그 이상은 스크롤, 없으면 무한 증가
<TextArea autoGrow maxRows={8} />
<TextArea autoGrow />            // 무한 증가

// 에러 — 테두리 대신 하단 툴팁(레이아웃 공간 차지 X)
<TextArea error errorMessage="필수 입력정보 입니다" width={360} />`;

const USAGE_PROPS = [
  { name: 'value / defaultValue', type: 'string', default: '—', desc: '제어/비제어 값' },
  { name: 'onChange', type: '(e) => void', default: '—', desc: '입력 변경 (e.target.value)' },
  { name: 'placeholder', type: 'string', default: "'텍스트를 입력하세요'", desc: '플레이스홀더' },
  { name: 'rows', type: 'number', default: '4', desc: '기본 높이(줄 수). autoGrow면 최소 높이' },
  { name: 'autoGrow', type: 'boolean', default: 'false', desc: '입력량따라 높이 자동 증가' },
  { name: 'maxRows', type: 'number', default: '—', desc: 'autoGrow 시 최대 행(초과 스크롤). 없으면 무한 증가' },
  { name: 'maxLength', type: 'number', default: '—', desc: '최대 글자 수(입력 제한 + 카운터 분모)' },
  { name: 'showCount', type: 'boolean', default: 'true', desc: '글자 수 카운터(Figma countTxt). maxLength 있으면 N/max' },
  { name: 'disabled / readOnly', type: 'boolean', default: 'false', desc: '비활성 / 읽기 전용' },
  { name: 'error / errorMessage', type: 'boolean / string', default: 'false / ""', desc: '에러 상태 + 하단 툴팁' },
  { name: 'width', type: 'number | string', default: '320', desc: '너비 — 숫자=px, 문자열=CSS' },
  { name: 'textareaProps', type: 'object', default: '{}', desc: '내부 <textarea>에 전달할 속성' },
];

const ROWS = [
  { label: 'Default',   props: { maxLength: 100 } },
  { label: 'Filled',    props: { defaultValue: '여러 줄 텍스트가\n입력된 상태입니다.', maxLength: 100 } },
  { label: 'No count',  props: { showCount: false } },
  { label: 'Read only', props: { readOnly: true, defaultValue: '읽기 전용 값', maxLength: 100 } },
  { label: 'Disabled',  props: { disabled: true, defaultValue: '비활성 값', maxLength: 100 } },
];

// Playground 숫자 입력 한 줄 (rows/maxRows/maxLength)
function NumField({ label, value, onChange }) {
  return (
    <label className="inline-flex items-center gap-spacing-5">
      <span className="shrink-0 font-mono text-12 text-font-icon-3">{label}</span>
      <Input width={84} value={String(value)} onChange={onChange} />
    </label>
  );
}

// Playground — 옵션을 끄고 켜며 동작 확인(특히 autoGrow / maxRows)
function Playground() {
  const [opts, setOpts] = useState({
    autoGrow: true,
    capRows: true, // maxRows 제한 on/off (끄면 무한 증가)
    showCount: true,
    error: false,
    disabled: false,
    readOnly: false,
  });
  const [rows, setRows] = useState(3);
  const [maxRows, setMaxRows] = useState(6);
  const [maxLength, setMaxLength] = useState(200);
  const [value, setValue] = useState('여러 줄을 입력하면\n높이가 늘어납니다.\nautoGrow를 끄면 고정 높이 + 스크롤.');
  const toggle = (k) => (e) => setOpts((o) => ({ ...o, [k]: e.target.checked }));
  const num = (setter) => (e) => setter(Math.max(1, Number(e.target.value) || 1));

  return (
    <div className="flex flex-col gap-spacing-7">
      {/* 컨트롤 — 요소 끄고 켜기 (가로 배치, 미리보기는 아래에 세로로) */}
      <div className="flex flex-col gap-spacing-6 rounded-round-4 border border-base-gray-100 p-spacing-7">
        <div className="flex flex-wrap gap-x-spacing-9 gap-y-spacing-5">
        <Checkbox label="autoGrow (자동 높이 증가)" checked={opts.autoGrow} onChange={toggle('autoGrow')} />
        <Checkbox
          label="maxRows 제한 (끄면 무한 증가)"
          checked={opts.capRows}
          onChange={toggle('capRows')}
          disabled={!opts.autoGrow}
        />
        <Checkbox label="showCount (글자 수 카운터)" checked={opts.showCount} onChange={toggle('showCount')} />
        <Checkbox label="error" checked={opts.error} onChange={toggle('error')} />
        <Checkbox label="disabled" checked={opts.disabled} onChange={toggle('disabled')} />
        <Checkbox label="readOnly" checked={opts.readOnly} onChange={toggle('readOnly')} />
        </div>
        <Divider className="mt-spacing-9 mb-spacing-6" />
        <div className="flex flex-wrap items-center gap-x-spacing-9 gap-y-spacing-5">
          <NumField label="rows" value={rows} onChange={num(setRows)} />
          <NumField label="maxRows" value={maxRows} onChange={num(setMaxRows)} />
          <NumField label="maxLength" value={maxLength} onChange={num(setMaxLength)} />
        </div>
      </div>

      {/* 라이브 미리보기 (컨트롤 아래, 전체폭) */}
      <div>
        <TextArea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={rows}
          autoGrow={opts.autoGrow}
          maxRows={opts.autoGrow && opts.capRows ? maxRows : undefined}
          showCount={opts.showCount}
          maxLength={maxLength}
          error={opts.error}
          errorMessage="에러 메시지 예시"
          disabled={opts.disabled}
          readOnly={opts.readOnly}
          width="100%"
        />
        <p className="mt-spacing-6 text-12 text-font-icon-4">
          <span className="text-font-icon-5">autoGrow</span> 켜고 줄을 늘려보세요 — maxRows 제한을 끄면{' '}
          <span className="text-font-icon-5">무한히</span> 늘어나고, 켜면 maxRows 이상은{' '}
          <span className="text-font-icon-5">스크롤</span>됩니다.
        </p>
      </div>
    </div>
  );
}

// 필수 입력 검증 — 비어 있으면 에러 툴팁, 입력하면 사라진다.
function ValidationDemo() {
  const [value, setValue] = useState('');
  return (
    <TextArea
      value={value}
      onChange={(e) => setValue(e.target.value)}
      maxLength={100}
      error={value.trim() === ''}
      errorMessage="필수 입력정보 입니다"
      width="100%"
    />
  );
}

export function TextAreaPage() {
  return (
    <section className="mx-auto max-w-5xl px-spacing-7 py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-20 font-semibold text-font-icon-5">TextArea</h2>
      <p className="mb-spacing-8 text-14 text-font-icon-4">
        여러 줄 텍스트 입력 (solid 타입). Input의 멀티라인 버전으로, 하단에{' '}
        <span className="text-font-icon-5">글자 수 카운터</span>를 옵션으로 표시합니다.{' '}
        <span className="text-font-icon-5">Hover</span>·<span className="text-font-icon-5">Focus</span>는 직접 확인하세요.
        에러는 테두리를 바꾸지 않고 <span className="text-font-icon-5">툴팁 오버레이</span>로 표시합니다.
      </p>

      <UsageExample code={USAGE} props={USAGE_PROPS} />

      {/* Playground — 요소 끄고 켜기 (autoGrow / maxRows 중심) */}
      <div className="mb-spacing-9">
        <h3 className="mb-spacing-5 text-15 font-semibold text-font-icon-5">Playground — 요소 끄고 켜기</h3>
        <Playground />
      </div>

      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div className="space-y-spacing-8">
        {ROWS.map(({ label, props }) => (
          <div key={label} className="grid grid-cols-[100px_1fr] items-start gap-x-spacing-6">
            <p className="pt-spacing-3 text-12 text-font-icon-3">{label}</p>
            <TextArea {...props} />
          </div>
        ))}

        {/* Error — 툴팁이 아래로 오버레이되므로 행 하단에 여백을 둔다 */}
        <div className="grid grid-cols-[100px_1fr] items-start gap-x-spacing-6 pb-spacing-9">
          <p className="pt-spacing-3 text-12 text-font-icon-3">Error</p>
          <TextArea error errorMessage="필수 입력정보 입니다" maxLength={100} />
        </div>
      </div>

      {/* 인터랙티브 — 필수 입력 검증 + 카운터 */}
      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div>
        <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">인터랙티브 — 검증 + 카운터</h3>
        <p className="mb-spacing-7 text-12 text-font-icon-4">
          비어 있으면 에러 툴팁, 입력하면 사라집니다. 카운터(N/100)도 타이핑에 따라 갱신됩니다.
        </p>
        <div className="max-w-md">
          <ValidationDemo />
        </div>
      </div>
    </section>
  );
}
