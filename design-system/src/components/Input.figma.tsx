// Input Code Connect 매핑(2026-07-30) — input SET(7202:8720, solid).
//   - state 변형 14종: error 계열('default error' + 'errer' 오타 5종은 그대로 매칭 — Figma 수정 시 함께 갱신),
//     filled 계열→defaultValue, disabled, read only. hover/focused는 CSS 상태라 별도 prop 없음.
//   - size 변형: '32'/'22' → size(코드도 문자열 키).
// 발행: main 머지 시 자동(.github/workflows/figma-code-connect.yml)
// 파서 제약 — URL·props는 리터럴만(변수·스프레드·as const 금지).
import figma from '@figma/code-connect';
import { Input } from './Input';

figma.connect(
  Input,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7202-8720',
  {
    props: {
      size: figma.enum('size', { '32': '32', '22': '22' }),
      error: figma.enum('state', {
        'default error': true,
        'default hover errer': true,
        'default focused errer': true,
        'filled errer': true,
        'filled hover errer': true,
        'filled focused errer': true,
      }),
      disabled: figma.enum('state', { disabled: true }),
      readOnly: figma.enum('state', { 'read only': true }),
      errorMessage: figma.enum('state', {
        'default error': '에러 메시지',
        'default hover errer': '에러 메시지',
        'default focused errer': '에러 메시지',
        'filled errer': '에러 메시지',
        'filled hover errer': '에러 메시지',
        'filled focused errer': '에러 메시지',
      }),
      defaultValue: figma.enum('state', {
        filled: '입력 텍스트',
        'filled hover': '입력 텍스트',
        'filled focused': '입력 텍스트',
        'filled errer': '입력 텍스트',
        'filled hover errer': '입력 텍스트',
        'filled focused errer': '입력 텍스트',
        'read only': '입력 텍스트',
      }),
    },
    example: ({ size, error, errorMessage, disabled, readOnly, defaultValue }) => (
      <Input
        size={size}
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
