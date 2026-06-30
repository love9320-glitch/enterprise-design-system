import { useState } from 'react';
import { Field } from '../components/Field';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { DateField } from '../components/DateField';
import { UsageExample } from '../components/UsageExample';
import { Divider } from '../components/Divider';

const USAGE = `import { Field } from '../components/Field';
import { Input } from '../components/Input';

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
  { name: 'labelSize', type: "'12'~'16'", default: "가로 '14' / 세로 '12'", desc: '내부 Label 사이즈 (미지정 시 layout 기본값)' },
  { name: 'gap', type: 'spacing 토큰 키', default: "세로 'spacing-3' / 가로 'spacing-6'", desc: '라벨↔컨트롤 간격' },
  { name: 'children', type: 'ReactNode', default: '—', desc: '컨트롤 (Input/Select/DateField 등)' },
  { name: 'className', type: 'string', default: "''", desc: '추가 클래스' },
];

const DEPTS = [
  { value: 'fe', label: '프론트엔드' },
  { value: 'be', label: '백엔드' },
  { value: 'design', label: '디자인' },
];

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
    </section>
  );
}
