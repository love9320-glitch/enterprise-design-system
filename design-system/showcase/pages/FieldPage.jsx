import { useState } from 'react';
import { Field } from '../../src/components/Field';
import { Input } from '../../src/components/Input';
import { Select } from '../../src/components/Select';
import { DateField } from '../../src/components/DateField';
import { EmailField, PhoneField } from '../../src/components/SelectOrInput';
import { UsageExample } from '../components/UsageExample';
import { Divider } from '../../src/components/Divider';

const USAGE = `import { Field } from '../../src/components/Field';
import { Input } from '../../src/components/Input';

// 라벨 + 컨트롤(기존 DS 컴포넌트를 children으로 그대로)
<Field label="이름" htmlFor="name" required>
  <Input inputProps={{ id: 'name' }} />
</Field>

// 보조 설명(helper) — 컨트롤 아래
<Field label="이메일" description="회사 이메일을 입력하세요">
  <Input width="100%" />
</Field>

// 가로 레이아웃 — labelWidth로 라벨 영역 고정
<Field label="지원 부서" direction="horizontal" labelWidth={96}>
  <Select options={depts} width="100%" />
</Field>

// 복합 필드 — 한 필드에 컨트롤 2개+ 를 한 줄에 등분 배치
<Field label="기간" controlsDirection="row">
  <DateField width="fill" />
  <DateField width="fill" />
</Field>

// 에러는 컨트롤 자체 툴팁을 그대로 사용 (Field는 라벨만 소유)
<Field label="이름" required>
  <Input error errorMessage="필수 입력정보 입니다" />
</Field>`;

const USAGE_PROPS = [
  { name: 'label', type: 'string | ReactNode', default: '—', desc: '라벨 — 주면 내부 Label 렌더' },
  { name: 'htmlFor', type: 'string', default: '—', desc: '컨트롤 id와 연결 (라벨 클릭 포커스)' },
  { name: 'required', type: 'boolean', default: 'false', desc: '라벨 필수 표시(빨강 점)' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '라벨 비활성 스타일' },
  { name: 'description', type: 'string | ReactNode', default: '—', desc: '보조 설명(helper) — 컨트롤 아래' },
  { name: 'direction', type: "'vertical'|'horizontal'", default: "'vertical'", desc: '라벨↔컨트롤 배치' },
  { name: 'controlsDirection', type: "'column'|'row'", default: "'column'", desc: '컨트롤 여러 개 배치(복합 필드, row=한 줄 등분)' },
  { name: 'labelWidth', type: 'number | string', default: '—', desc: 'horizontal일 때 라벨 영역 너비' },
  { name: 'labelSize', type: "'12'~'16'", default: "'14'", desc: '내부 Label 사이즈 (가로·세로 동일 기본)' },
  { name: 'gap', type: 'spacing 토큰 키', default: "세로 'spacing-3' / 가로 'spacing-6'", desc: '라벨↔컨트롤 간격' },
  { name: 'children', type: 'ReactNode', default: '—', desc: '컨트롤 (Input/Select/DateField 등)' },
  { name: 'className', type: 'string', default: "''", desc: '추가 클래스' },
];

const DEPTS = [
  { value: 'fe', label: '프론트엔드' },
  { value: 'be', label: '백엔드' },
  { value: 'design', label: '디자인' },
];

// ── Email / Phone Field (SelectOrInput) — 등록값 선택 or 직접 입력 ──────────
const CONTACT_USAGE = `import { EmailField, PhoneField } from '../../src/components/SelectOrInput';

// 등록된 값 선택 OR 직접 입력 — 상호 배타(마지막 수단이 값을 갖고 반대쪽은 디폴트로 리셋)
const [email, setEmail] = useState('');
<EmailField
  options={['hong@company.com', 'kim@company.com']}   // 등록된 이메일
  value={email}
  onChange={(e) => setEmail(e.target.value)}          // e.target.source: 'select'|'input'|null
  width="100%"
/>

// PhoneField는 숫자 입력 시 하이픈 자동 삽입(01093589320 → 010-9358-9320)
<PhoneField options={['010-1234-5678', '010-9876-5432']} defaultValue="010-1234-5678" />

// 한쪽만 사용 — showSelect/showInput으로 끄면 남은 컨트롤이 전체 폭
<EmailField options={emails} showInput={false} />   // 등록값 선택 전용
<PhoneField showSelect={false} />                    // 직접 입력 전용

// 라벨·헬프텍스트는 Field로 감싼다(다른 컨트롤과 동일한 조립)
<Field label="이메일" required description="합격 안내 발송에 사용됩니다.">
  <EmailField options={emails} width="100%" />
</Field>`;

const CONTACT_PROPS = [
  { name: 'options', type: 'string[] | {value,label}[]', default: '[]', desc: '등록된 값 목록(Select 선택지)' },
  { name: 'showSelect / showInput', type: 'boolean', default: 'true', desc: '한쪽 컨트롤 숨김 — 남은 쪽이 전체 폭(select 전용이면 에러 툴팁도 Select가 담당)' },
  { name: 'value', type: 'string', default: '—', desc: '최종 값(제어) — options에 있으면 Select, 없으면 Input에 표시' },
  { name: 'defaultValue', type: 'string', default: "''", desc: '초기 값(비제어)' },
  { name: 'onChange', type: '(e) => void', default: '—', desc: 'e.target.value(문자열) · e.target.source(select/input/null)' },
  { name: 'selectPlaceholder', type: 'string', default: "'이메일 선택' 등", desc: 'Select 미선택 문구(Email/Phone 래퍼가 기본값 제공)' },
  { name: 'inputPlaceholder', type: 'string', default: "'…직접 입력하세요'", desc: 'Input 미입력 문구' },
  { name: 'selectWidth', type: 'number | string', default: '160', desc: 'Select 너비 — 나머지는 Input이 채움' },
  { name: 'width', type: 'number | string', default: '400', desc: "전체 너비(px/CSS 길이 '100%' 등)" },
  { name: 'menuWidth / placement / searchable', type: '—', default: '—', desc: 'Select 드롭다운 옵션 그대로 통과' },
  { name: 'disabled / readOnly', type: 'boolean', default: 'false', desc: '두 컨트롤 동시 적용' },
  { name: 'error / errorMessage', type: 'boolean / string', default: 'false', desc: '에러 툴팁(Input 아래 오버레이)' },
  { name: 'inputProps', type: 'object', default: '{}', desc: '내부 <input> 속성 통과(Email=inputMode email · Phone=tel 기본)' },
  { name: 'formatInput', type: '(raw) => string', default: 'Phone=하이픈 자동', desc: '직접 입력값 변환. PhoneField는 기본으로 하이픈 자동 삽입(01093589320→010-9358-9320), null로 끔' },
];

const EMAILS = ['hong@company.com', 'kim@company.com', 'recruit@company.com'];
const PHONES = ['010-1234-5678', '010-9876-5432', '02-555-0100'];

// 제어 데모 — 현재 값·입력 수단을 아래에 표시
function ContactLiveDemo({ Comp, options }) {
  const [val, setVal] = useState('');
  const [src, setSrc] = useState(null);
  return (
    <div>
      <Comp
        options={options}
        value={val}
        onChange={(e) => {
          setVal(e.target.value);
          setSrc(e.target.source);
        }}
        width="100%"
      />
      <p className="mt-spacing-4 font-mono text-12 text-font-icon-3">
        value: {val || '(없음)'} · source: {src ?? '—'}
      </p>
    </div>
  );
}

// 필수 입력 검증 — 컨트롤 자체 에러 툴팁 사용(Field는 라벨만 소유)
function ValidationDemo() {
  const [value, setValue] = useState('');
  const isEmpty = value.trim() === '';
  return (
    <Field label="이름" htmlFor="v-name" required>
      <Input
        inputProps={{ id: 'v-name' }}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        error={isEmpty}
        errorMessage="필수 입력정보 입니다"
        width="100%"
      />
    </Field>
  );
}

export function FieldPage() {
  return (
    <section className="mx-auto max-w-5xl px-spacing-7 py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-20 font-semibold text-font-icon-5">Field</h2>
      <p className="mb-spacing-8 text-14 text-font-icon-4">
        라벨 + 컨트롤(Input·Select·DateField 등)을 묶는 폼 행. 컨트롤은 손으로 다시 짜지 않고
        기존 컴포넌트를 <code className="text-font-icon-5">children</code>으로 그대로 받습니다.
        Field는 <span className="text-font-icon-5">라벨·필수표시·보조설명·레이아웃</span>만 소유하고,
        에러는 컨트롤 자체 <span className="text-font-icon-5">툴팁</span>을 그대로 사용해 중복을
        피합니다.
      </p>

      <UsageExample code={USAGE} props={USAGE_PROPS} />

      {/* 세로 레이아웃 (기본) */}
      <div className="grid grid-cols-2 gap-x-spacing-9 gap-y-spacing-8">
        <Field label="이름" htmlFor="f-name" required>
          <Input inputProps={{ id: 'f-name' }} width="100%" />
        </Field>
        <Field label="이메일" description="회사 이메일을 입력하세요">
          <Input width="100%" placeholder="name@company.com" />
        </Field>
        <Field label="지원 부서">
          <Select options={DEPTS} width="100%" placeholder="부서 선택" />
        </Field>
        <Field label="지원일">
          <DateField width="fill" />
        </Field>
      </div>

      {/* 가로 레이아웃 */}
      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div>
        <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">가로 레이아웃</h3>
        <p className="mb-spacing-7 text-12 text-font-icon-4">
          <code className="text-font-icon-5">direction="horizontal"</code> +{' '}
          <code className="text-font-icon-5">labelWidth</code>로 라벨 영역을 고정합니다.
        </p>
        <div className="max-w-md space-y-spacing-7">
          <Field label="이름" direction="horizontal" labelWidth={96} required>
            <Input width="100%" />
          </Field>
          <Field label="지원 부서" direction="horizontal" labelWidth={96}>
            <Select options={DEPTS} width="100%" placeholder="부서 선택" />
          </Field>
        </div>
      </div>

      {/* 복합 필드 — 한 필드에 컨트롤 2개+ 한 줄 등분 */}
      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div>
        <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">복합 필드 (controlsDirection="row")</h3>
        <p className="mb-spacing-7 text-12 text-font-icon-4">
          한 필드에 컨트롤을 여러 개 — 인풋+셀렉트·셀렉트 2개·인풋+데이트픽커 등 — 한 줄에 등분 배치합니다.
        </p>
        <div className="grid grid-cols-2 gap-x-spacing-9 gap-y-spacing-8">
          <Field label="기간" controlsDirection="row">
            <DateField width="fill" />
            <DateField width="fill" />
          </Field>
          <Field label="구분 / 상세" controlsDirection="row">
            <Select options={DEPTS} width="100%" placeholder="구분" />
            <Input width="100%" placeholder="상세 입력" />
          </Field>
          <Field label="전형 단계" controlsDirection="row" description="시작/종료 단계를 선택하세요">
            <Select options={DEPTS} width="100%" placeholder="시작" />
            <Select options={DEPTS} width="100%" placeholder="종료" />
          </Field>
        </div>
      </div>

      {/* 인터랙티브 — 필수 입력 검증 (컨트롤 툴팁) */}
      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div>
        <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">
          인터랙티브 — 필수 입력 검증
        </h3>
        <p className="mb-spacing-7 text-12 text-font-icon-4">
          비어 있으면 컨트롤의 에러 툴팁이 뜨고, 입력하면 사라집니다. 에러 UI는 Field가 아니라
          컨트롤이 담당합니다.
        </p>
        <div className="max-w-sm pb-spacing-9">
          <ValidationDemo />
        </div>
      </div>

      {/* Email / Phone Field — 등록값 선택 or 직접 입력 (SelectOrInput 조립) */}
      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div>
        <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">
          Email / Phone Field — 등록값 선택 or 직접 입력
        </h3>
        <p className="mb-spacing-6 text-12 text-font-icon-4">
          등록된 값을 <span className="text-font-icon-5">Select로 선택</span>하거나{' '}
          <span className="text-font-icon-5">Input에 직접 입력</span>하는 상호 배타 필드(Select+Input 조립).
          직접 입력하면 Select가 선택 전 상태로, Select에서 선택하면 Input이 입력 전 상태로 되돌아가며,
          값은 최종 문자열 하나로 전달됩니다.
        </p>
        <UsageExample code={CONTACT_USAGE} props={CONTACT_PROPS} />

        <p className="mb-spacing-4 text-12 text-font-icon-3">EmailField — 직접 입력·선택을 번갈아 해보세요</p>
        <ContactLiveDemo Comp={EmailField} options={EMAILS} />

        <p className="mb-spacing-4 mt-spacing-8 text-12 text-font-icon-3">PhoneField — 동일 로직</p>
        <ContactLiveDemo Comp={PhoneField} options={PHONES} />

        {/* Field 조합 — 라벨·헬프텍스트 */}
        <p className="mb-spacing-4 mt-spacing-8 text-12 text-font-icon-3">
          Field 조합 (라벨 · 헬프텍스트) — 다른 컨트롤과 동일하게 Field로 감쌉니다
        </p>
        <div className="max-w-md space-y-spacing-8">
          <Field label="이메일" required description="합격 안내 발송에 사용됩니다.">
            <EmailField options={EMAILS} width="100%" />
          </Field>
          <Field label="전화번호" description="면접 일정 안내 문자를 받을 번호입니다.">
            <PhoneField options={PHONES} width="100%" />
          </Field>
        </div>

        {/* 한쪽만 사용 — showSelect / showInput */}
        <p className="mb-spacing-4 mt-spacing-8 text-12 text-font-icon-3">
          한쪽만 사용 (showSelect / showInput) — 남은 컨트롤이 전체 폭을 차지합니다
        </p>
        <div className="space-y-spacing-7">
          <div className="grid grid-cols-[140px_1fr] items-center gap-x-spacing-6">
            <p className="text-12 text-font-icon-3">showInput=false</p>
            <EmailField options={EMAILS} showInput={false} width="100%" />
          </div>
          <div className="grid grid-cols-[140px_1fr] items-center gap-x-spacing-6">
            <p className="text-12 text-font-icon-3">showSelect=false</p>
            <PhoneField showSelect={false} width="100%" />
          </div>
        </div>

        {/* 상태 */}
        <p className="mb-spacing-4 mt-spacing-8 text-12 text-font-icon-3">상태</p>
        <div className="space-y-spacing-7">
          <div className="grid grid-cols-[140px_1fr] items-center gap-x-spacing-6">
            <p className="text-12 text-font-icon-3">defaultValue(등록값)</p>
            <EmailField options={EMAILS} defaultValue="kim@company.com" width="100%" />
          </div>
          <div className="grid grid-cols-[140px_1fr] items-center gap-x-spacing-6">
            <p className="text-12 text-font-icon-3">defaultValue(직접입력)</p>
            <EmailField options={EMAILS} defaultValue="me@personal.io" width="100%" />
          </div>
          <div className="grid grid-cols-[140px_1fr] items-center gap-x-spacing-6">
            <p className="text-12 text-font-icon-3">disabled</p>
            <PhoneField options={PHONES} disabled width="100%" />
          </div>
          <div className="grid grid-cols-[140px_1fr] items-start gap-x-spacing-6 pb-spacing-9">
            <p className="pt-spacing-4 text-12 text-font-icon-3">error</p>
            <EmailField options={EMAILS} error errorMessage="이메일을 선택하거나 입력해 주세요" width="100%" />
          </div>
        </div>
      </div>
    </section>
  );
}
