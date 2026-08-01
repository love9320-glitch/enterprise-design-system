// Select 계열 Code Connect 매핑(2026-08-01) — select - text SET(7334:1756247) +
// select group SET(8174:36980) + select chip SET(8219:81717).
//   - text: state(Default/Filled·hover·focused ×error·Disabled·Read only — hover/focused는 CSS) × size(24/20).
//     error 계열은 표준 카피(규칙 21) '필수 선택사항입니다.' 사용.
//   - group: direction(Horizontal/Vertical) × gap(3~7).
//   - chip: color 4종(Gray/Red/Blue/Black — state는 CSS, size 22 단일).
//   - 변형 값은 첫 글자 대문자 규칙 — 코드 prop은 소문자 API 그대로.
// 발행: main 머지 시 자동(.github/workflows/figma-code-connect.yml)
// 파서 제약 — URL·props는 리터럴만(변수·스프레드·as const 금지).
import figma from '@figma/code-connect';
import { Select, SelectChip } from './Select';
import { SelectGroup } from './SelectGroup';

// select - text — 인라인 텍스트형(필터·문단 사이용)
figma.connect(
  Select,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7334-1756247',
  {
    props: {
      size: figma.enum('size', { '24': '24', '20': '20' }),
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
        Filled: 'a',
        'Filled hover': 'a',
        'Filled focused': 'a',
        'Filled error': 'a',
        'Filled hover error': 'a',
        'Filled focused error': 'a',
        Disabled: 'a',
        'Read only': 'a',
      }),
    },
    example: ({ size, error, errorMessage, disabled, readOnly, defaultValue }) => (
      <Select
        variant="text"
        size={size}
        options={[
          { value: 'a', label: '옵션' },
          { value: 'b', label: '다른 옵션' },
        ]}
        placeholder="전체"
        defaultValue={defaultValue}
        error={error}
        errorMessage={errorMessage}
        disabled={disabled}
        readOnly={readOnly}
      />
    ),
  },
);

// select group — 셀렉트 나열 래퍼(간격 규칙은 ButtonGroup과 동일)
figma.connect(
  SelectGroup,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=8174-36980',
  {
    props: {
      direction: figma.enum('direction', {
        Horizontal: 'horizontal',
        Vertical: 'vertical',
      }),
      gap: figma.enum('gap', { '3': '3', '4': '4', '5': '5', '6': '6', '7': '7' }),
    },
    example: ({ direction, gap }) => (
      <SelectGroup direction={direction} gap={gap}>
        <Select options={[{ value: 'a', label: '옵션' }]} width={160} />
        <Select options={[{ value: 'a', label: '옵션' }]} width={160} />
      </SelectGroup>
    ),
  },
);

// select chip — 칩형 트리거(색 4종, 동작은 Select와 동일)
figma.connect(
  SelectChip,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=8219-81717',
  {
    props: {
      color: figma.enum('color', {
        Gray: 'gray',
        Red: 'red',
        Blue: 'blue',
        Black: 'black',
      }),
    },
    example: ({ color }) => (
      <SelectChip
        color={color}
        options={[
          { value: 'a', label: '옵션' },
          { value: 'b', label: '다른 옵션' },
        ]}
        placeholder="선택"
      />
    ),
  },
);
