// Button 계열 Code Connect 매핑(2026-07-28) — 01_buttons 페이지의 버튼 세트 13종 전부.
// Dev Mode에서 변형(state·size)·텍스트에 맞는 실제 <Button> 스니펫을 보여준다.
//   - Hover/Pressed는 CSS 상호작용 상태라 prop 매핑에서 제외(Disabled/Loading만 prop).
//   - 아이콘 세트의 아이콘 스왑은 코드로 자동 번역이 안 되므로 대표 아이콘(Plus)으로 예시 —
//     실제 아이콘은 lucide-react에서 골라 교체한다.
// 발행: FIGMA_ACCESS_TOKEN=… npx figma connect publish --force
// 주의: 이 파일은 앱 번들에 포함되지 않는 메타데이터 전용(규칙 11 — 코드 기능 무영향).
//       파서 제약 — URL은 문자열 리터럴, props는 인라인 객체 리터럴만(변수·스프레드·as const 금지).
import figma from '@figma/code-connect';
import { Plus } from 'lucide-react';
import { Button } from './Button';

// 01_fill_text button
figma.connect(
  Button,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7045-203781',
  {
    props: {
      size: figma.enum('size', { '32': '32', '24': '24' }),
      label: figma.string('text'),
      disabled: figma.enum('state', { Disabled: true }),
      loading: figma.enum('state', { Loading: true }),
    },
    example: ({ size, disabled, loading, label }) => (
      <Button variant="fill" size={size} disabled={disabled} loading={loading}>
        {label}
      </Button>
    ),
  },
);

// 01_fill_left icon text button
figma.connect(
  Button,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7051-6',
  {
    props: {
      size: figma.enum('size', { '32': '32', '24': '24' }),
      label: figma.string('text'),
      disabled: figma.enum('state', { Disabled: true }),
      loading: figma.enum('state', { Loading: true }),
    },
    example: ({ size, disabled, loading, label }) => (
      <Button variant="fill" size={size} leftIcon={Plus} disabled={disabled} loading={loading}>
        {label}
      </Button>
    ),
  },
);

// 01_fill_right icon text button
figma.connect(
  Button,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7051-974',
  {
    props: {
      size: figma.enum('size', { '32': '32', '24': '24' }),
      label: figma.string('text'),
      disabled: figma.enum('state', { Disabled: true }),
      loading: figma.enum('state', { Loading: true }),
    },
    example: ({ size, disabled, loading, label }) => (
      <Button variant="fill" size={size} rightIcon={Plus} disabled={disabled} loading={loading}>
        {label}
      </Button>
    ),
  },
);

// 01_fill_icon button
figma.connect(
  Button,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7054-62',
  {
    props: {
      size: figma.enum('size', { '32': '32', '24': '24' }),
      disabled: figma.enum('state', { Disabled: true }),
      loading: figma.enum('state', { Loading: true }),
    },
    example: ({ size, disabled, loading }) => (
      <Button variant="fill" size={size} icon={Plus} aria-label="버튼 이름" disabled={disabled} loading={loading} />
    ),
  },
);

// 02_line_text button (파일럿)
figma.connect(
  Button,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7057-208',
  {
    props: {
      size: figma.enum('size', { '32': '32', '24': '24' }),
      label: figma.string('text'),
      disabled: figma.enum('state', { Disabled: true }),
      loading: figma.enum('state', { Loading: true }),
    },
    example: ({ size, disabled, loading, label }) => (
      <Button variant="line" size={size} disabled={disabled} loading={loading}>
        {label}
      </Button>
    ),
  },
);

// 02_line_left icon text button
figma.connect(
  Button,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7045-203828',
  {
    props: {
      size: figma.enum('size', { '32': '32', '24': '24' }),
      label: figma.string('text'),
      disabled: figma.enum('state', { Disabled: true }),
      loading: figma.enum('state', { Loading: true }),
    },
    example: ({ size, disabled, loading, label }) => (
      <Button variant="line" size={size} leftIcon={Plus} disabled={disabled} loading={loading}>
        {label}
      </Button>
    ),
  },
);

// 02_line_right icon text button
figma.connect(
  Button,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7057-283',
  {
    props: {
      size: figma.enum('size', { '32': '32', '24': '24' }),
      label: figma.string('text'),
      disabled: figma.enum('state', { Disabled: true }),
      loading: figma.enum('state', { Loading: true }),
    },
    example: ({ size, disabled, loading, label }) => (
      <Button variant="line" size={size} rightIcon={Plus} disabled={disabled} loading={loading}>
        {label}
      </Button>
    ),
  },
);

// 02_line_icon button
figma.connect(
  Button,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7057-358',
  {
    props: {
      size: figma.enum('size', { '32': '32', '24': '24' }),
      disabled: figma.enum('state', { Disabled: true }),
      loading: figma.enum('state', { Loading: true }),
    },
    example: ({ size, disabled, loading }) => (
      <Button variant="line" size={size} icon={Plus} aria-label="버튼 이름" disabled={disabled} loading={loading} />
    ),
  },
);

// 03_ghost_text button
figma.connect(
  Button,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7060-6832',
  {
    props: {
      size: figma.enum('size', { '32': '32', '24': '24' }),
      label: figma.string('text'),
      disabled: figma.enum('state', { Disabled: true }),
      loading: figma.enum('state', { Loading: true }),
    },
    example: ({ size, disabled, loading, label }) => (
      <Button variant="ghost" size={size} disabled={disabled} loading={loading}>
        {label}
      </Button>
    ),
  },
);

// 03_ghost_left icon text button
figma.connect(
  Button,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7060-6713',
  {
    props: {
      size: figma.enum('size', { '32': '32', '24': '24' }),
      label: figma.string('text'),
      disabled: figma.enum('state', { Disabled: true }),
      loading: figma.enum('state', { Loading: true }),
    },
    example: ({ size, disabled, loading, label }) => (
      <Button variant="ghost" size={size} leftIcon={Plus} disabled={disabled} loading={loading}>
        {label}
      </Button>
    ),
  },
);

// 03_ghost_right icon text button
figma.connect(
  Button,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7060-6756',
  {
    props: {
      size: figma.enum('size', { '32': '32', '24': '24' }),
      label: figma.string('text'),
      disabled: figma.enum('state', { Disabled: true }),
      loading: figma.enum('state', { Loading: true }),
    },
    example: ({ size, disabled, loading, label }) => (
      <Button variant="ghost" size={size} rightIcon={Plus} disabled={disabled} loading={loading}>
        {label}
      </Button>
    ),
  },
);

// 03_ghost_icon button — 유일하게 size 18 변형 보유
figma.connect(
  Button,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7060-6799',
  {
    props: {
      size: figma.enum('size', { '32': '32', '24': '24', '18': '18' }),
      disabled: figma.enum('state', { Disabled: true }),
      loading: figma.enum('state', { Loading: true }),
    },
    example: ({ size, disabled, loading }) => (
      <Button variant="ghost" size={size} icon={Plus} aria-label="버튼 이름" disabled={disabled} loading={loading} />
    ),
  },
);

// 04_underline_text button
figma.connect(
  Button,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7335-1756787',
  {
    props: {
      size: figma.enum('size', { '32': '32', '24': '24' }),
      label: figma.string('text'), // 2026-07-28 사용자가 text 속성 추가 — 타 버튼과 통일
      disabled: figma.enum('state', { Disabled: true }),
      loading: figma.enum('state', { Loading: true }),
    },
    example: ({ size, disabled, loading, label }) => (
      <Button variant="underline" size={size} disabled={disabled} loading={loading}>
        {label}
      </Button>
    ),
  },
);

// 04_underline_left icon text button
figma.connect(
  Button,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7335-1756668',
  {
    props: {
      size: figma.enum('size', { '32': '32', '24': '24' }),
      label: figma.string('text'), // 2026-07-28 사용자가 text 속성 추가 — 타 버튼과 통일
      disabled: figma.enum('state', { Disabled: true }),
      loading: figma.enum('state', { Loading: true }),
    },
    example: ({ size, disabled, loading, label }) => (
      <Button variant="underline" size={size} leftIcon={Plus} disabled={disabled} loading={loading}>
        {label}
      </Button>
    ),
  },
);

// 04_underline_right icon text button
figma.connect(
  Button,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7335-1756711',
  {
    props: {
      size: figma.enum('size', { '32': '32', '24': '24' }),
      label: figma.string('text'),
      disabled: figma.enum('state', { Disabled: true }),
      loading: figma.enum('state', { Loading: true }),
    },
    example: ({ size, disabled, loading, label }) => (
      <Button variant="underline" size={size} rightIcon={Plus} disabled={disabled} loading={loading}>
        {label}
      </Button>
    ),
  },
);
