// Stepper Code Connect 매핑(2026-08-05) — 라인 타입 스텝퍼 3세트를 모두 Stepper로 연결.
//   - stepper - line type(9216:12963): 4스텝 조립 심볼 → 전체 사용 예시
//   - step - line type(9131:24616): state 변형 5종 — value·disabled로 표현(variant 스코프),
//     Hover는 CSS 상태라 스코프 없는 기본 매핑이 폴백. description/description text는 items로.
//   - step number - line type(9129:24254): 내부 숫자 원(단독 사용 없음) → Stepper 사용 예시(규칙 11)
// 발행: main 머지 시 자동(.github/workflows/figma-code-connect.yml)
// 파서 제약 — URL·props는 리터럴만(변수·스프레드·as const 금지).
import figma from '@figma/code-connect';
import { Stepper } from './Stepper';

// stepper - line type(조립 심볼) — 전체 예시
figma.connect(
  Stepper,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=9216-12963',
  {
    example: () => (
      <Stepper
        value="write"
        items={[
          { value: 'sender', title: 'Step 1. 고객사 발신정보', description: '발송 회사, 발송 방식을 선택하세요.' },
          { value: 'write', title: 'Step 2. 안내문 작성' },
          { value: 'target', title: 'Step 3. 발송 대상 선택' },
          { value: 'send', title: 'Step 4. 발송' },
        ]}
      />
    ),
  },
);

// step - line type — 기본(스코프 없음): Hover 등 모든 변형의 폴백
figma.connect(
  Stepper,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=9131-24616',
  {
    example: () => (
      <Stepper
        value="write"
        items={[
          { value: 'sender', title: 'Step 1. 고객사 발신정보', description: '발송 회사, 발송 방식을 선택하세요.' },
          { value: 'write', title: 'Step 2. 안내문 작성' },
        ]}
      />
    ),
  },
);

// state=Default — 현재(value) 이후의 대기 스텝
figma.connect(
  Stepper,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=9131-24616',
  {
    variant: { state: 'Default' },
    example: () => (
      <Stepper
        value="sender"
        items={[
          { value: 'sender', title: 'Step 1. 고객사 발신정보' },
          { value: 'write', title: 'Step 2. 대기 스텝(default)', description: '발송 회사, 발송 방식을 선택하세요.' },
        ]}
      />
    ),
  },
);

// state=Progress — 현재(value) 스텝
figma.connect(
  Stepper,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=9131-24616',
  {
    variant: { state: 'Progress' },
    example: () => (
      <Stepper
        value="sender"
        items={[
          { value: 'sender', title: 'Step 1. 진행 중(progress)', description: '발송 회사, 발송 방식을 선택하세요.' },
          { value: 'write', title: 'Step 2. 안내문 작성' },
        ]}
      />
    ),
  },
);

// state=Complete — 현재(value) 이전의 완료 스텝
figma.connect(
  Stepper,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=9131-24616',
  {
    variant: { state: 'Complete' },
    example: () => (
      <Stepper
        value="write"
        items={[
          { value: 'sender', title: 'Step 1. 완료(complete)', description: '발송 회사, 발송 방식을 선택하세요.' },
          { value: 'write', title: 'Step 2. 안내문 작성' },
        ]}
      />
    ),
  },
);

// state=Disabled — item.disabled
figma.connect(
  Stepper,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=9131-24616',
  {
    variant: { state: 'Disabled' },
    example: () => (
      <Stepper
        value="sender"
        items={[
          { value: 'sender', title: 'Step 1. 고객사 발신정보' },
          { value: 'write', title: 'Step 2. 비활성(disabled)', description: '발송 회사, 발송 방식을 선택하세요.', disabled: true },
        ]}
      />
    ),
  },
);

// step number - line type — 내부 숫자 원(단독 사용 없음): 상위 Stepper 예시로 안내
figma.connect(
  Stepper,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=9129-24254',
  {
    example: () => (
      <Stepper
        value="write"
        items={[
          { value: 'sender', title: 'Step 1. 고객사 발신정보' },
          { value: 'write', title: 'Step 2. 안내문 작성' },
        ]}
      />
    ),
  },
);
