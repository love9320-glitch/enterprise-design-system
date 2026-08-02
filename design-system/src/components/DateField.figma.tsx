// DateField Code Connect 매핑(2026-08-02) — datefield SET(7593:4139, box) + datefield inline SET(8609:16991).
//   - state 14종: error 계열(표준 카피 '필수 선택사항입니다.')·Filled(값 표시)·Disabled·Read only.
//     hover/focused는 CSS 상태. inline SET은 variant="text"(직접 입력 없는 트리거형).
// 발행: main 머지 시 자동(.github/workflows/figma-code-connect.yml)
// 파서 제약 — URL·props는 리터럴만(변수·스프레드·as const 금지).
import figma from '@figma/code-connect';
import { DateField } from './DateField';

// datefield — box(인풋+팝오버)
figma.connect(
  DateField,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7593-4139',
  {
    props: {
      error: figma.enum('state', {
        'Default error': true,
        'Default hover error': true,
        'Default focused error': true,
        'Filled error': true,
        'Filled hover error': true,
        'Filled focused error': true,
      }),
      errorMessage: figma.enum('state', {
        'Default error': '필수 선택사항입니다.',
        'Default hover error': '필수 선택사항입니다.',
        'Default focused error': '필수 선택사항입니다.',
        'Filled error': '필수 선택사항입니다.',
        'Filled hover error': '필수 선택사항입니다.',
        'Filled focused error': '필수 선택사항입니다.',
      }),
      disabled: figma.enum('state', { Disabled: true }),
      readOnly: figma.enum('state', { 'Read only': true }),
    },
    example: ({ error, errorMessage, disabled, readOnly }) => (
      <DateField
        mode="single"
        error={error}
        errorMessage={errorMessage}
        disabled={disabled}
        readOnly={readOnly}
      />
    ),
  },
);

// datefield inline — 텍스트 트리거형(variant="text")
figma.connect(
  DateField,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=8609-16991',
  {
    props: {
      error: figma.enum('state', {
        'Default error': true,
        'Default hover error': true,
        'Default focused error': true,
        'Filled error': true,
        'Filled hover error': true,
        'Filled focused error': true,
      }),
      errorMessage: figma.enum('state', {
        'Default error': '필수 선택사항입니다.',
        'Default hover error': '필수 선택사항입니다.',
        'Default focused error': '필수 선택사항입니다.',
        'Filled error': '필수 선택사항입니다.',
        'Filled hover error': '필수 선택사항입니다.',
        'Filled focused error': '필수 선택사항입니다.',
      }),
      disabled: figma.enum('state', { Disabled: true }),
      readOnly: figma.enum('state', { 'Read only': true }),
    },
    example: ({ error, errorMessage, disabled, readOnly }) => (
      <DateField
        variant="text"
        mode="single"
        error={error}
        errorMessage={errorMessage}
        disabled={disabled}
        readOnly={readOnly}
      />
    ),
  },
);
