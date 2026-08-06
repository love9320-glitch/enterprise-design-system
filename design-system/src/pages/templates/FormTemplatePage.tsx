// FormTemplatePage — 폼 템플릿 타입 A(여백 그리드형) + 타입 B(테이블형) 통합 데모
// 양식 통일(2026-07-28 지시): 타입별 [사용 예시 → Playground] 구성. 둘 다 플레이그라운드로
// 옵션을 실시간 변경하며, B는 셀 간격이 1px 헤어라인 고정이라 갭 옵션이 없다.
import { useState } from 'react';
import type { ElementType, ReactNode } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { FormTemplateA } from '@gusun/design-system';
import { FormTemplateB } from '@gusun/design-system';
import { Input } from '@gusun/design-system';
import { Select } from '@gusun/design-system';
import { DateField } from '@gusun/design-system';
import { Checkbox } from '@gusun/design-system';
import { Button } from '@gusun/design-system';
import { EmailField, PhoneField } from '@gusun/design-system';
import { UsageExample } from '../../components/UsageExample';
import { Divider } from '@gusun/design-system';

// ── 타입 A — 여백 그리드형 ─────────────────────────────────────────────
const USAGE_A = `import { FormTemplateA } from '@gusun/design-system';

// 12칸 그리드 위에 Field(라벨+컨트롤)를 배치 — 컨트롤은 기존 컴포넌트를 그대로 주입
const FIELDS = [
  { key: 'name', label: '안내 및 발표 명칭', required: true,
    control: <Input width="100%" placeholder="명칭을 입력하세요" /> },
  { key: 'tpl', label: '발송 템플릿',
    control: <Select width="100%" options={templates} placeholder="템플릿을 선택하세요" /> },
  { key: 'time', label: '발송/게시 시간',
    control: <DateField width="fill" showTime placeholder="날짜와 시간을 선택하세요" /> },
];

<FormTemplateA
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

const USAGE_A_PROPS = [
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
function buildAFields(mixed: boolean) {
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
      label: '이메일 안내문 발신주소',
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
      label: 'SMS 안내문 발신번호',
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

// 플레이그라운드 공통 옵션 행 조각 — A/B 양식 통일
function OptionControl({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-center gap-spacing-5">
      <span className="text-12 text-font-icon-3">{label}</span>
      {children}
    </div>
  );
}

// Playground A — 레이아웃 · 가로/세로 간격 · 라벨 크기
function PlaygroundA() {
  const [layout, setLayout] = useState('2');
  const [colGap, setColGap] = useState('16');
  const [rowGap, setRowGap] = useState('16');
  const [labelSize, setLabelSize] = useState('14');
  const mixed = layout === 'mixed';

  return (
    <div className="flex flex-col gap-spacing-7">
      <div className="flex flex-wrap items-center gap-x-spacing-9 gap-y-spacing-5 rounded-round-4 border border-base-gray-100 p-spacing-7">
        <OptionControl label="layout">
          <Select value={layout} onChange={(e) => setLayout(e.target.value)} options={LAYOUTS} width={140} />
        </OptionControl>
        <OptionControl label="columnGap">
          <Select value={colGap} onChange={(e) => setColGap(e.target.value)} options={GAPS} width={100} />
        </OptionControl>
        <OptionControl label="rowGap">
          <Select value={rowGap} onChange={(e) => setRowGap(e.target.value)} options={GAPS} width={100} />
        </OptionControl>
        <OptionControl label="labelSize">
          <Select value={labelSize} onChange={(e) => setLabelSize(e.target.value)} options={LABEL_SIZES} width={100} />
        </OptionControl>
      </div>

      <div className="rounded-round-5 border border-base-gray-100 bg-white p-spacing-8">
        <FormTemplateA
          fields={buildAFields(mixed)}
          columns={mixed ? 3 : (Number(layout) as 1 | 2 | 3)}
          columnGap={Number(colGap) as 16 | 20 | 24 | 28 | 32}
          rowGap={Number(rowGap) as 16 | 20 | 24 | 28 | 32}
          labelSize={labelSize as '12' | '13' | '14' | '15' | '16'}
        />
      </div>
    </div>
  );
}

// ── 타입 B — 테이블형 ─────────────────────────────────────────────────
const USAGE_B = `import { FormTemplateB } from '@gusun/design-system';

// 테이블형 폼 박스 — 12칸 그리드 셀이 1px 헤어라인으로 나뉜다(외곽선+그림자, 갭 없음 고정).
// 셀 컨트롤은 투명 계열을 주입한다: Input variant="transparent" · Select variant="text" · DateField variant="text"
<FormTemplateB
  labelWidth={60}
  cells={[
    { key: 'title', label: '공고명', required: true,
      control: <Input variant="transparent" width="100%" placeholder="공고명을 입력하세요" /> },
    { key: 'type', label: '채용구분',
      control: <Select variant="text" width="fill" options={TYPES} placeholder="채용 구분을 선택하세요" /> },
    { key: 'period', label: '채용기간',
      control: <DateField variant="text" mode="range" showTime disablePast />, // 지난 날짜 선택 불가(2026-07-28 통일)
      trailing: <Checkbox label="마감일 없음" /> },
  ]}
/>

// columns — 셀 기본 폭(1=한 줄 하나 · 2=6칸 · 3=4칸). 혼합은 셀별 span(12칸 기준)으로
<FormTemplateB columns={2} cells={...} />

// 타이틀 — title(폼 밖 상단)·subtitle(폼 안 최상단 전체폭 로우)은 각각 지정 시에만 렌더
<FormTemplateB title="채용 공고" subtitle="기본 정보" cells={...} />

// 버튼 셀 — flush(패딩 0) + Button area(영역 채움)로 셀 전체가 버튼이 된다
{ key: 'register', span: 2, flush: true,
  control: <Button variant="ghost" area leftIcon={Plus}>채용 분야 등록</Button> }`;

const USAGE_B_PROPS = [
  { name: 'cells', type: '{ key, label?, required?, span?, control, trailing?, flush?, labelWidth?, paddingTop?, paddingBottom?, disabled? }[]', default: '[]', desc: '셀 목록. label=회색 라벨(Field horizontal), trailing=셀 오른쪽 끝 부가 요소, flush=패딩 제거(Button area용), span=1~12(12칸 기준), paddingTop/paddingBottom=이 셀의 상/하 패딩(공통 cellPadding*보다 우선), disabled=라벨 비활성(컨트롤 disabled는 컨트롤에 직접)' },
  { name: 'columns', type: '1 | 2 | 3', default: '1', desc: '셀 기본 폭 — 12/columns칸. 혼합 배치는 셀별 span으로' },
  { name: 'labelWidth', type: 'number | string', default: '—', desc: '라벨 영역 공통 너비(셀별 labelWidth 우선) — 컨트롤 시작점 정렬용' },
  { name: 'shadow', type: 'boolean', default: 'true', desc: '박스 그림자(0 2px 5px 12%) on/off — 끄면 외곽선이 inline 색(셀 구분선과 동일)으로 낮아짐' },
  { name: 'round', type: "'6' | '12' | '16' | '20'", default: "'6'", desc: '모서리 라운드(px) — 등록 라운드 토큰 경유(round-4/7/8/9)' },
  { name: 'cellPaddingTop', type: "'12' | '20'", default: "'12'", desc: '셀 위 패딩(px) — subtitle 로우 포함 공통, spacing 토큰 경유(좌우는 20 고정)' },
  { name: 'cellPaddingBottom', type: "'12' | '20'", default: "'12'", desc: '셀 아래 패딩(px) — subtitle 로우 포함 공통. 셀별 paddingTop/paddingBottom 지정이 우선' },
  { name: 'title', type: 'ReactNode', default: '—', desc: '폼 밖 상단 타이틀(text-15 semibold, 박스와 6px 간격) — 지정 시에만 렌더' },
  { name: 'subtitle', type: 'ReactNode', default: '—', desc: '폼 안 최상단 전체폭(span 12) 타이틀 로우(text-14 semibold) — 지정 시에만 렌더' },
  { name: 'className', type: 'string', default: "''", desc: '추가 클래스' },
];

// 채용구분 — 채용 방식 구분(Job Posting Template과 표기 통일)
const TYPE_OPTIONS = [
  { value: 'open', label: '공개 채용' },
  { value: 'rolling', label: '수시 채용' },
  { value: 'always', label: '상시 채용' },
  { value: 'special', label: '특별 채용' },
];

// B 데모 셀 조각 — 레이아웃별로 같은 필드 구성을 재사용
const titleCell = (key: string, span?: number) => ({
  key,
  span,
  label: '공고명',
  control: <Input variant="transparent" width="100%" placeholder="공고명을 입력하세요" />,
});
const typeCell = (key: string, span?: number) => ({
  key,
  span,
  label: '채용구분',
  control: <Select variant="text" width="fill" options={TYPE_OPTIONS} placeholder="채용 구분을 선택하세요" />,
});
// noTrailing=true면 '마감일 없음' 체크박스 없이 — 3컬럼처럼 좁은 셀용(2026-07-28 지시)
const periodCell = (key: string, span?: number, { noTrailing = false }: { noTrailing?: boolean } = {}) => ({
  key,
  span,
  label: '채용기간',
  control: <DateField variant="text" mode="range" showTime disablePast />, // 지난 날짜 선택 불가(2026-07-28 통일)
  ...(noTrailing ? {} : { trailing: <Checkbox label="마감일 없음" /> }),
});
const buttonCell = (key: string, span: number, icon: ElementType, text: string) => ({
  key,
  span,
  flush: true,
  control: (
    <Button variant="ghost" area leftIcon={icon}>
      {text}
    </Button>
  ),
});

// 레이아웃별 B 셀 구성 — mixed는 버튼 셀(flush + Button area) 포함
function buildBCells(layout: string) {
  if (layout === '2') {
    return [titleCell('t'), typeCell('c1'), periodCell('p'), typeCell('c2'), typeCell('c3'), typeCell('c4')];
  }
  if (layout === '3') {
    return [
      titleCell('t'), typeCell('c1'), typeCell('c2'),
      periodCell('p', undefined, { noTrailing: true }), typeCell('c3'), typeCell('c4'),
      typeCell('c5'), typeCell('c6'), typeCell('c7'),
    ];
  }
  if (layout === 'mixed') {
    return [
      titleCell('t', 8),
      typeCell('c', 4),
      periodCell('p', 8),
      buttonCell('register', 2, Plus, '채용 분야 등록'),
      buttonCell('delete', 2, Trash2, '공고 삭제'),
    ];
  }
  return [titleCell('t'), typeCell('c'), periodCell('p')];
}

const LABEL_WIDTHS = [
  { value: 'hug', label: 'hug' },
  { value: '60', label: '60px' },
  { value: '80', label: '80px' },
  { value: '100', label: '100px' },
];

const ROUNDS = [
  { value: '6', label: '6px (기본)' },
  { value: '12', label: '12px' },
  { value: '16', label: '16px' },
  { value: '20', label: '20px' },
];

// 셀 위/아래 패딩 옵션 — spacing-6/spacing-8 토큰 경유
const CELL_PADDINGS = [
  { value: '12', label: '12px (기본)' },
  { value: '20', label: '20px' },
];

// Playground B — 레이아웃 · 라벨 너비 · 그림자 · 라운드 · 타이틀 (셀 간격은 1px 헤어라인 고정이라 갭 옵션 없음)
function PlaygroundB() {
  const [layout, setLayout] = useState('1');
  const [labelWidth, setLabelWidth] = useState('60');
  const [shadow, setShadow] = useState(true);
  const [round, setRound] = useState('6');
  const [withTitle, setWithTitle] = useState(true);
  const [withSubtitle, setWithSubtitle] = useState(true);
  const [padTop, setPadTop] = useState('12');
  const [padBottom, setPadBottom] = useState('12');
  const mixed = layout === 'mixed';

  return (
    <div className="flex flex-col gap-spacing-7">
      <div className="flex flex-wrap items-center gap-x-spacing-9 gap-y-spacing-5 rounded-round-4 border border-base-gray-100 p-spacing-7">
        <OptionControl label="layout">
          <Select value={layout} onChange={(e) => setLayout(e.target.value)} options={LAYOUTS} width={140} />
        </OptionControl>
        <OptionControl label="labelWidth">
          <Select value={labelWidth} onChange={(e) => setLabelWidth(e.target.value)} options={LABEL_WIDTHS} width={100} />
        </OptionControl>
        <OptionControl label="round">
          <Select value={round} onChange={(e) => setRound(e.target.value)} options={ROUNDS} width={110} />
        </OptionControl>
        <OptionControl label="cellPaddingTop">
          <Select value={padTop} onChange={(e) => setPadTop(e.target.value)} options={CELL_PADDINGS} width={110} />
        </OptionControl>
        <OptionControl label="cellPaddingBottom">
          <Select value={padBottom} onChange={(e) => setPadBottom(e.target.value)} options={CELL_PADDINGS} width={110} />
        </OptionControl>
        <Checkbox checked={shadow} onChange={() => setShadow((s) => !s)} label="그림자(shadow)" />
        <Checkbox checked={withTitle} onChange={() => setWithTitle((s) => !s)} label="타이틀(title)" />
        <Checkbox checked={withSubtitle} onChange={() => setWithSubtitle((s) => !s)} label="서브 타이틀(subtitle)" />
      </div>

      <div className="rounded-round-5 border border-base-gray-100 bg-white p-spacing-8">
        <FormTemplateB
          cells={buildBCells(layout)}
          columns={mixed ? 1 : (Number(layout) as 1 | 2 | 3)}
          labelWidth={labelWidth === 'hug' ? undefined : Number(labelWidth)}
          shadow={shadow}
          round={round as '6' | '12' | '16' | '20'}
          cellPaddingTop={padTop as '12' | '20'}
          cellPaddingBottom={padBottom as '12' | '20'}
          title={withTitle ? '채용 공고' : undefined}
          subtitle={withSubtitle ? '기본 정보' : undefined}
        />
      </div>
    </div>
  );
}

export function FormTemplatePage() {
  return (
    <section className="py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-20 font-semibold text-font-icon-5">Form Template</h2>
      <p className="mb-spacing-9 text-14 text-font-icon-4">
        폼 템플릿 — 두 타입을 제공합니다. <span className="text-font-icon-5">타입 A(여백 그리드형)</span>는
        12칸 그리드 위에 Field를 여백 간격으로 배치하고,{' '}
        <span className="text-font-icon-5">타입 B(테이블형)</span>는 셀들이 1px 헤어라인으로 나뉘는
        외곽선+그림자 박스에 투명 계열 컨트롤을 담습니다. 각 타입의 옵션은 플레이그라운드에서 실시간으로
        바꿔볼 수 있습니다.
      </p>

      <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">Type A — 여백 그리드형</h3>
      <p className="mb-spacing-6 text-12 text-font-icon-4">
        12칸 그리드 위에 Field(라벨+컨트롤)를 배치합니다(1/2/3/mixed column). 그리드 가로/세로
        간격(16~32px)과 라벨 크기를 옵션으로 일괄 변경할 수 있습니다.
      </p>
      <UsageExample code={USAGE_A} props={USAGE_A_PROPS} />
      <h4 className="mb-spacing-5 text-14 font-semibold text-font-icon-5">Playground — 레이아웃 · 간격 · 라벨 크기</h4>
      <PlaygroundA />

      <Divider className="mt-spacing-10 mb-spacing-9" />

      <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">Type B — 테이블형</h3>
      <p className="mb-spacing-6 text-12 text-font-icon-4">
        12칸 그리드 셀들이 1px 헤어라인으로 나뉘는 외곽선+그림자 박스입니다. 셀에는 투명 계열
        컨트롤(Input transparent · Select text · DateField text)을 주입하고, mixed 레이아웃은 flush +
        Button area 버튼 셀을 포함합니다. 셀 간격은 헤어라인 고정이라 갭 옵션이 없습니다.
      </p>
      <UsageExample code={USAGE_B} props={USAGE_B_PROPS} note="라벨은 회색(label-field/gray-text)이며 labelWidth로 컨트롤 시작점을 정렬합니다." />
      <h4 className="mb-spacing-5 text-14 font-semibold text-font-icon-5">Playground — 레이아웃 · 라벨 너비 · 그림자 · 라운드 · 셀 패딩 · 타이틀</h4>
      <PlaygroundB />
    </section>
  );
}
