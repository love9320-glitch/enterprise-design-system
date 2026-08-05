// FormTemplate A/B Code Connect 매핑(2026-08-02) — form template type a SET(8071:35916, '3 columnnt'
// 오타는 Figma에서 수정) + form template type b SET(8620:13367).
//   - A(여백 그리드형): Property 1 → columns 1/2/3, Mixed는 span 혼합 예시.
//   - B(테이블형 1px 헤어라인 박스): column → columns, Mixed는 span 혼합 예시.
// 발행: main 머지 시 자동(.github/workflows/figma-code-connect.yml)
// 파서 제약 — URL·props는 리터럴만(변수·스프레드·as const 금지).
import figma from '@figma/code-connect';
import { FormTemplateA } from './FormTemplateA';
import { FormTemplateB } from './FormTemplateB';
import { Input } from './Input';
import { Select } from './Select';

// form template type a — 균등 컬럼(1/2/3)
figma.connect(
  FormTemplateA,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=8071-35916',
  {
    props: {
      columns: figma.enum('Property 1', { '1 column': 1, '2 column': 2, '3 column': 3 }),
    },
    example: ({ columns }) => (
      <FormTemplateA
        columns={columns}
        fields={[
          { key: 'a', label: '라벨', required: true, control: <Input width="100%" placeholder="텍스트를 입력하세요" /> },
          { key: 'b', label: '라벨', control: <Select width="100%" options={[{ value: 'a', label: '옵션' }]} /> },
          { key: 'c', label: '라벨', control: <Input width="100%" placeholder="텍스트를 입력하세요" /> },
        ]}
      />
    ),
  },
);

// form template type a — 혼합 배치(span 12칸 기준)
figma.connect(
  FormTemplateA,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=8071-35916',
  {
    variant: { 'Property 1': 'Mixed column' },
    example: () => (
      <FormTemplateA
        fields={[
          { key: 'a', label: '라벨', span: 8, control: <Input width="100%" placeholder="텍스트를 입력하세요" /> },
          { key: 'b', label: '라벨', span: 4, control: <Select width="100%" options={[{ value: 'a', label: '옵션' }]} /> },
        ]}
      />
    ),
  },
);

// form template type b — 균등 컬럼(1/2/3)
figma.connect(
  FormTemplateB,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=8620-13367',
  {
    props: {
      columns: figma.enum('column', { '1 column': 1, '2 column': 2, '3 column': 3 }),
    },
    example: ({ columns }) => (
      <FormTemplateB
        columns={columns}
        title="TITLE"
        subtitle="Sub title"
        labelWidth={60}
        cells={[
          { key: 'a', label: '라벨', required: true, control: <Input variant="transparent" width="100%" placeholder="텍스트를 입력하세요" /> },
          { key: 'b', label: '라벨', control: <Select variant="text" options={[{ value: 'a', label: '옵션' }]} /> },
          { key: 'c', label: '라벨', control: <Input variant="transparent" width="100%" placeholder="텍스트를 입력하세요" /> },
        ]}
      />
    ),
  },
);

// form template type b — 혼합 배치(span 12칸 기준)
figma.connect(
  FormTemplateB,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=8620-13367',
  {
    variant: { column: 'Mixed column' },
    example: () => (
      <FormTemplateB
        title="TITLE"
        subtitle="Sub title"
        labelWidth={60}
        cells={[
          { key: 'a', label: '라벨', span: 8, control: <Input variant="transparent" width="100%" placeholder="텍스트를 입력하세요" /> },
          { key: 'b', label: '라벨', span: 4, control: <Select variant="text" options={[{ value: 'a', label: '옵션' }]} /> },
        ]}
      />
    ),
  },
);
