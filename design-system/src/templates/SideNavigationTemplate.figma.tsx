// SideNavigationTemplate Code Connect 매핑(2026-08-02) — side navigation Template SET(8202:61044).
//   - type: Add code type(좌 내비+코드 등록 콘텐츠) / Form type(좌 내비+폼 콘텐츠) — 우측은 children
//     자유 슬롯이라 type별 대표 조립 예시로 표현(콘텐츠 상세는 데모 페이지가 진실).
// 발행: main 머지 시 자동(.github/workflows/figma-code-connect.yml)
// 파서 제약 — URL·props는 리터럴만(변수·스프레드·as const 금지).
import figma from '@figma/code-connect';
import { Button } from '../components/Button';
import { Field } from '../components/Field';
import { FormTemplateA } from './FormTemplateA';
import { Input } from '../components/Input';
import { SideNavigationTemplate } from './SideNavigationTemplate';

// Add code type — 코드(항목) 등록형 콘텐츠
figma.connect(
  SideNavigationTemplate,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=8202-61044',
  {
    variant: { type: 'Add code type' },
    example: () => (
      <SideNavigationTemplate
        menus={[
          { id: 'a', label: '카테고리 이름' },
          { id: 'b', label: '카테고리 이름' },
        ]}
        defaultSelectedId="a"
        onAdd={() => {}}
      >
        <Field label="채용 코드명" required>
          <div className="flex w-full items-center gap-spacing-5">
            <Input width="100%" placeholder="코드명을 입력하세요" />
            <Button variant="line">추가</Button>
          </div>
        </Field>
      </SideNavigationTemplate>
    ),
  },
);

// Form type — 폼(FormTemplateA) 콘텐츠
figma.connect(
  SideNavigationTemplate,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=8202-61044',
  {
    variant: { type: 'Form type' },
    example: () => (
      <SideNavigationTemplate
        menus={[
          { id: 'a', label: '카테고리 이름' },
          { id: 'b', label: '카테고리 이름' },
        ]}
        defaultSelectedId="a"
        onAdd={() => {}}
      >
        <FormTemplateA
          columns={2}
          fields={[
            { key: 'a', label: '라벨', required: true, control: <Input width="100%" placeholder="텍스트를 입력하세요" /> },
            { key: 'b', label: '라벨', control: <Input width="100%" placeholder="텍스트를 입력하세요" /> },
          ]}
        />
      </SideNavigationTemplate>
    ),
  },
);
