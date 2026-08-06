// MultiStepFormTemplate Code Connect 매핑(2026-08-05) — multi-step form Template SET(9249:4529, step=1/2/3).
// Figma step 변형 → value(현재 스텝 인덱스). 스텝·콘텐츠는 소비자 주입이라 예시는 골격만.
// 발행: main 머지 시 자동(.github/workflows/figma-code-connect.yml)
// 파서 제약 — URL·props는 리터럴만(변수·스프레드·as const 금지).
import figma from '@figma/code-connect';
import { MultiStepFormTemplate } from './MultiStepFormTemplate';
import { FormTemplateB } from './FormTemplateB';
import { Input } from '../components/Input';

figma.connect(
  MultiStepFormTemplate,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=9249-4529',
  {
    props: {
      value: figma.enum('step', { '1': 0, '2': 1, '3': 2 }),
    },
    example: ({ value }) => (
      <MultiStepFormTemplate
        value={value}
        steps={[
          {
            title: 'Step 1. 고객사 발신정보 입력',
            description: '발송 회사, 발송 방식을 선택하세요.',
            content: (
              <FormTemplateB
                subtitle="Step 1. 고객사 발신정보 입력"
                cells={[
                  { key: 'a', label: '라벨', control: <Input variant="transparent" width="100%" placeholder="텍스트를 입력하세요" /> },
                ]}
              />
            ),
          },
          { title: 'Step 2. 발송 대상자 업로드', description: '발송 대상자 파일을 업로드하세요.' },
          { title: 'Step 3. 내용 검토 및 발송', description: '내용 확인 후 발송하세요.' },
        ]}
      />
    ),
  },
);
