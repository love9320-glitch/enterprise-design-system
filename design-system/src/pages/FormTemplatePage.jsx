import { useState } from 'react';
import { FormTemplate } from '../components/FormTemplate';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { DateField } from '../components/DateField';
import { EmailField, PhoneField } from '../components/SelectOrInput';
import { UsageExample } from '../components/UsageExample';

const USAGE = `import { FormTemplate } from '../components/FormTemplate';

// 12칸 그리드 위에 Field(라벨+컨트롤)를 배치 — 컨트롤은 기존 컴포넌트를 그대로 주입
const FIELDS = [
  { key: 'name', label: '안내 및 발표 명칭', required: true,
    control: <Input width="100%" placeholder="명칭을 입력하세요" /> },
  { key: 'tpl', label: '발송 템플릿',
    control: <Select width="100%" options={templates} placeholder="템플릿을 선택하세요" /> },
  { key: 'time', label: '발송/게시 시간',
    control: <DateField width="fill" showTime placeholder="날짜와 시간을 선택하세요" /> },
];

<FormTemplate
  fields={FIELDS}
  columns={2}         // 1 | 2 | 3 — 필드 기본 폭(12칸 그리드 기준 12/columns)
  columnGap={24}      // 가로 간격: 16 | 20 | 24 | 28 | 32
  rowGap={20}         // 세로 간격: 16 | 20 | 24 | 28 | 32
  labelSize="14"      // 라벨 크기 일괄('12'~'16')
/>

// 혼합 배치 — 필드별 span(12칸 기준)으로 폭 지정
const MIXED = [
  { key: 'name', label: '안내 및 발표 명칭', span: 8, control: <Input width="100%" /> },
  { key: 'tpl',  label: '발송 템플릿',      span: 4, control: <Select width="100%" options={templates} /> },
];`;

const USAGE_PROPS = [
  { name: 'fields', type: '{ key, label, required?, disabled?, description?, span?, control }[]', default: '[]', desc: '필드 정의 — control에 Input/Select/DateField 등 주입, span=12칸 기준 폭(혼합 배치)' },
  { name: 'columns', type: '1 | 2 | 3', default: '1', desc: '필드 기본 폭 — 12칸 그리드에서 12/columns칸(span 미지정 시)' },
  { name: 'columnGap', type: '16 | 20 | 24 | 28 | 32', default: '16', desc: '그리드 가로 간격(px, spacing 토큰 경유)' },
  { name: 'rowGap', type: '16 | 20 | 24 | 28 | 32', default: '16', desc: '그리드 세로 간격(px, spacing 토큰 경유)' },
  { name: 'labelSize', type: "'12'~'16'", default: '— (Field 기본)', desc: '모든 필드 라벨 크기 일괄 변경' },
  { name: 'className', type: 'string', default: "''", desc: '그리드 컨테이너 추가 클래스' },
];

const TEMPLATES = [
  { value: 'pass', label: '합격 안내' },
  { value: 'fail', label: '불합격 안내' },
  { value: 'doc', label: '서류 접수 안내' },
];
const METHODS = [
  { value: 'site', label: '채용사이트' },
  { value: 'email', label: '이메일' },
  { value: 'sms', label: 'SMS' },
];
const EMAILS = ['midasHR@midas.com', 'recruit@midas.com'];
const PHONES = ['010-1234-1234', '02-555-0100'];

// 데모 필드 — Figma form template 내용 그대로(발신 이메일/SMS는 disabled 상태)
function buildFields(mixed) {
  return [
    {
      key: 'name',
      label: '안내 및 발표 명칭',
      required: true,
      span: mixed ? 8 : undefined,
      control: <Input width="100%" placeholder="명칭을 입력하세요" />,
    },
    {
      key: 'template',
      label: '발송 템플릿',
      span: mixed ? 4 : undefined,
      control: <Select width="100%" options={TEMPLATES} placeholder="템플릿을 선택하세요" />,
    },
    {
      key: 'time',
      label: '발송/게시 시간',
      span: mixed ? 4 : undefined,
      control: <DateField width="fill" showTime placeholder="날짜와 시간을 선택하세요" />,
    },
    {
      key: 'method',
      label: '전형안내 방법',
      span: mixed ? 4 : undefined,
      control: <Select width="100%" options={METHODS} defaultValue="site" />,
    },
    {
      key: 'email',
      label: '발신 이메일 주소',
      disabled: true,
      span: mixed ? 4 : undefined,
      control: (
        <EmailField
          options={EMAILS}
          defaultValue="midasHR@midas.com"
          disabled
          width="100%"
          selectWidth="45%"
          inputPlaceholder="이메일을 직접 입력"
        />
      ),
    },
    {
      key: 'sms',
      label: 'SMS 발신번호',
      disabled: true,
      span: mixed ? 12 : undefined,
      control: (
        <PhoneField
          options={PHONES}
          defaultValue="010-1234-1234"
          disabled
          width="100%"
          selectWidth="45%"
          inputPlaceholder="전화번호를 직접 입력"
        />
      ),
    },
  ];
}

const GAPS = [16, 20, 24, 28, 32].map((g) => ({ value: String(g), label: `${g}px` }));
const LABEL_SIZES = ['12', '13', '14', '15', '16'].map((s) => ({ value: s, label: `${s}px` }));
const LAYOUTS = [
  { value: '1', label: '1 column' },
  { value: '2', label: '2 column' },
  { value: '3', label: '3 column' },
  { value: 'mixed', label: 'mixed column' },
];

// Playground — 레이아웃 · 가로/세로 간격 · 라벨 크기를 바꿔가며 확인
function Playground() {
  const [layout, setLayout] = useState('2');
  const [colGap, setColGap] = useState('16');
  const [rowGap, setRowGap] = useState('16');
  const [labelSize, setLabelSize] = useState('14');
  const mixed = layout === 'mixed';

  const control = (label, node) => (
    <div className="flex items-center gap-spacing-5">
      <span className="text-12 text-font-icon-3">{label}</span>
      {node}
    </div>
  );

  return (
    <div className="flex flex-col gap-spacing-7">
      <div className="flex flex-wrap items-center gap-x-spacing-9 gap-y-spacing-5 rounded-round-4 border border-base-gray-100 p-spacing-7">
        {control('layout', (
          <Select value={layout} onChange={(e) => setLayout(e.target.value)} options={LAYOUTS} width={140} />
        ))}
        {control('columnGap', (
          <Select value={colGap} onChange={(e) => setColGap(e.target.value)} options={GAPS} width={100} />
        ))}
        {control('rowGap', (
          <Select value={rowGap} onChange={(e) => setRowGap(e.target.value)} options={GAPS} width={100} />
        ))}
        {control('labelSize', (
          <Select value={labelSize} onChange={(e) => setLabelSize(e.target.value)} options={LABEL_SIZES} width={100} />
        ))}
      </div>

      <div className="rounded-round-5 border border-base-gray-100 bg-white p-spacing-8">
        <FormTemplate
          fields={buildFields(mixed)}
          columns={mixed ? 3 : Number(layout)}
          columnGap={Number(colGap)}
          rowGap={Number(rowGap)}
          labelSize={labelSize}
        />
      </div>
    </div>
  );
}

export function FormTemplatePage() {
  return (
    <section className="mx-auto max-w-5xl px-spacing-7 py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-20 font-semibold text-font-icon-5">Form Template</h2>
      <p className="mb-spacing-9 text-14 text-font-icon-4">
        폼 템플릿 — <span className="text-font-icon-5">12칸 그리드</span> 위에{' '}
        <span className="text-font-icon-5">Field(라벨+컨트롤)</span>를 배치합니다(1/2/3/mixed column).
        컨트롤은 Input·Select·DateField·EmailField 등 기존 컴포넌트를 그대로 주입하고,
        그리드 가로/세로 간격(16~32px)과 라벨 크기를 옵션으로 일괄 변경할 수 있습니다.
      </p>

      <UsageExample code={USAGE} props={USAGE_PROPS} />

      <h3 className="mb-spacing-5 text-15 font-semibold text-font-icon-5">Playground — 레이아웃 · 간격 · 라벨 크기</h3>
      <Playground />
    </section>
  );
}
