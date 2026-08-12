// Input Code Connect 매핑(2026-07-30) — input SET(7202:8720, solid) + input transparent SET(8616:41229).
//   - state 변형 14종: error 계열(2026-07-30 Figma 오타 'errer' 수정됨 — 전부 'error'),
//     filled 계열→defaultValue, disabled, read only. hover/focused는 CSS 상태라 별도 prop 없음.
//   - size 변형: '32'/'22' → size(코드도 문자열 키). transparent SET은 32 단일이라 size 매핑 생략.
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

// input transparent — 박스·링 없이 텍스트만(variant='transparent')
figma.connect(
  Input,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=8616-41229',
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
      <Input
        variant="transparent"
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

// ── input unit(9275:316) — 우측 단위 suffix(solid). 단위 텍스트는 코드 unit prop(2026-08-12) ──
figma.connect(
  Input,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=9275-316',
  {
    props: {
      size: figma.enum('size', { '32': '32', '22': '22' }),
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
      defaultValue: figma.enum('state', {
        Filled: '텍스트 입력 완료',
        'Filled hover': '텍스트 입력 완료',
        'Filled focused': '텍스트 입력 완료',
        'Filled error': '텍스트 입력 완료',
        'Filled hover error': '텍스트 입력 완료',
        'Filled focused error': '텍스트 입력 완료',
        'Read only': '텍스트 입력 완료',
      }),
    },
    example: ({ size, error, disabled, readOnly, defaultValue }) => (
      <Input
        type="number"
        comma
        unit="만원"
        size={size}
        placeholder="텍스트를 입력하세요"
        defaultValue={defaultValue}
        error={error}
        disabled={disabled}
        readOnly={readOnly}
      />
    ),
  },
);

// ── input transparent unit(9275:364) — 단위 suffix(transparent, 32 단일) ──
figma.connect(
  Input,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=9275-364',
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
      defaultValue: figma.enum('state', {
        Filled: '텍스트 입력 완료',
        'Filled hover': '텍스트 입력 완료',
        'Filled focused': '텍스트 입력 완료',
        'Filled error': '텍스트 입력 완료',
        'Filled hover error': '텍스트 입력 완료',
        'Filled focused error': '텍스트 입력 완료',
        'Read only': '텍스트 입력 완료',
      }),
    },
    example: ({ error, disabled, readOnly, defaultValue }) => (
      <Input
        variant="transparent"
        type="number"
        comma
        unit="만원"
        placeholder="텍스트를 입력하세요"
        defaultValue={defaultValue}
        error={error}
        disabled={disabled}
        readOnly={readOnly}
      />
    ),
  },
);

// ── input password(9275:519) — 마스킹+눈 토글(solid). 점 색=default-text 회색(2026-08-12) ──
figma.connect(
  Input,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=9275-519',
  {
    props: {
      size: figma.enum('size', { '32': '32', '22': '22' }),
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
      defaultValue: figma.enum('state', {
        Filled: 'password1234',
        'Filled hover': 'password1234',
        'Filled focused': 'password1234',
        'Filled error': 'password1234',
        'Filled hover error': 'password1234',
        'Filled focused error': 'password1234',
        'Read only': 'password1234',
      }),
    },
    example: ({ size, error, disabled, readOnly, defaultValue }) => (
      <Input
        type="password"
        size={size}
        placeholder="비밀번호를 입력하세요"
        defaultValue={defaultValue}
        error={error}
        disabled={disabled}
        readOnly={readOnly}
      />
    ),
  },
);

// ── input transparent password(9275:589) — 마스킹+눈 토글(transparent, 32 단일) ──
figma.connect(
  Input,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=9275-589',
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
      defaultValue: figma.enum('state', {
        Filled: 'password1234',
        'Filled hover': 'password1234',
        'Filled focused': 'password1234',
        'Filled error': 'password1234',
        'Filled hover error': 'password1234',
        'Filled focused error': 'password1234',
        'Read only': 'password1234',
      }),
    },
    example: ({ error, disabled, readOnly, defaultValue }) => (
      <Input
        variant="transparent"
        type="password"
        placeholder="비밀번호를 입력하세요"
        defaultValue={defaultValue}
        error={error}
        disabled={disabled}
        readOnly={readOnly}
      />
    ),
  },
);
