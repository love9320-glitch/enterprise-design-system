// TextArea Code Connect 매핑(2026-07-30) — text area SET(7963:1674).
//   - state 변형 14종: error 계열(2026-07-30 Figma 오타 'errer' 수정됨 — 전부 'error'),
//     filled 계열→defaultValue, disabled, read only. hover/focused는 CSS 상태라 별도 prop 없음.
//   - 에러 카피는 표준(규칙 21) '필수 입력사항입니다.' 사용.
// 발행: main 머지 시 자동(.github/workflows/figma-code-connect.yml)
// 파서 제약 — URL·props는 리터럴만(변수·스프레드·as const 금지).
import figma from '@figma/code-connect';
import { TextArea } from './TextArea';

figma.connect(
  TextArea,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7963-1674',
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
      disabled: figma.enum('state', { Disabled: true }),
      readOnly: figma.enum('state', { 'Read only': true }),
      errorMessage: figma.enum('state', {
        'Default error': '필수 입력사항입니다.',
        'Default hover error': '필수 입력사항입니다.',
        'Default focused error': '필수 입력사항입니다.',
        'Filled error': '필수 입력사항입니다.',
        'Filled hover error': '필수 입력사항입니다.',
        'Filled focused error': '필수 입력사항입니다.',
      }),
      defaultValue: figma.enum('state', {
        Filled: '입력 텍스트',
        'Filled hover': '입력 텍스트',
        'Filled focused': '입력 텍스트',
        'Filled error': '입력 텍스트',
        'Filled hover error': '입력 텍스트',
        'Filled focused error': '입력 텍스트',
        'Read only': '입력 텍스트',
      }),
    },
    example: ({ error, errorMessage, disabled, readOnly, defaultValue }) => (
      <TextArea
        placeholder="텍스트를 입력하세요"
        defaultValue={defaultValue}
        error={error}
        errorMessage={errorMessage}
        disabled={disabled}
        readOnly={readOnly}
      />
    ),
  },
);
