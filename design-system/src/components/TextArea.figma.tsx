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
        'default error': true,
        'default hover error': true,
        'default focused error': true,
        'filled error': true,
        'filled hover error': true,
        'filled focused error': true,
      }),
      disabled: figma.enum('state', { disabled: true }),
      readOnly: figma.enum('state', { 'read only': true }),
      errorMessage: figma.enum('state', {
        'default error': '필수 입력사항입니다.',
        'default hover error': '필수 입력사항입니다.',
        'default focused error': '필수 입력사항입니다.',
        'filled error': '필수 입력사항입니다.',
        'filled hover error': '필수 입력사항입니다.',
        'filled focused error': '필수 입력사항입니다.',
      }),
      defaultValue: figma.enum('state', {
        filled: '입력 텍스트',
        'filled hover': '입력 텍스트',
        'filled focused': '입력 텍스트',
        'filled error': '입력 텍스트',
        'filled hover error': '입력 텍스트',
        'filled focused error': '입력 텍스트',
        'read only': '입력 텍스트',
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
