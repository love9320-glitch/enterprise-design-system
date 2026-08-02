// TimeField Code Connect 매핑(2026-08-02) — timefield SET(7626:4428, state 14종).
//   - error 계열은 표준 카피(규칙 21) '필수 선택사항입니다.', Filled 계열→defaultValue 'HH:MM'.
// 발행: main 머지 시 자동(.github/workflows/figma-code-connect.yml)
// 파서 제약 — URL·props는 리터럴만(변수·스프레드·as const 금지).
import figma from '@figma/code-connect';
import { TimeField } from './TimeField';

figma.connect(
  TimeField,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7626-4428',
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
      defaultValue: figma.enum('state', {
        Filled: '12:30',
        'Filled hover': '12:30',
        'Filled focused': '12:30',
        'Filled error': '12:30',
        'Filled hover error': '12:30',
        'Filled focused error': '12:30',
        'Read only': '12:30',
      }),
    },
    example: ({ error, errorMessage, disabled, readOnly, defaultValue }) => (
      <TimeField
        defaultValue={defaultValue}
        error={error}
        errorMessage={errorMessage}
        disabled={disabled}
        readOnly={readOnly}
      />
    ),
  },
);
