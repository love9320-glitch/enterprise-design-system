// SideNavigation Code Connect 매핑(2026-08-02) — side navigation SET(8200:51519, line On/Off×width 3단) +
// side navigation button SET(8200:51452, state×line — Hover는 CSS).
// 발행: main 머지 시 자동(.github/workflows/figma-code-connect.yml)
// 파서 제약 — URL·props는 리터럴만(변수·스프레드·as const 금지).
import figma from '@figma/code-connect';
import { SideNavigation, SideNavigationButton } from './SideNavigation';

// side navigation — 컨테이너(우측 구분선 On/Off × 폭 3단)
figma.connect(
  SideNavigation,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=8200-51519',
  {
    props: {
      width: figma.enum('width', { '180': 180, '220': 220, '260': 260 }),
      line: figma.enum('line', { On: true, Off: false }),
    },
    example: ({ width, line }) => (
      <SideNavigation width={width} line={line} onAdd={() => {}}>
        <SideNavigationButton selected line={line}>카테고리 이름</SideNavigationButton>
        <SideNavigationButton line={line}>카테고리 이름</SideNavigationButton>
        <SideNavigationButton line={line}>카테고리 이름</SideNavigationButton>
      </SideNavigation>
    ),
  },
);

// side navigation button — 항목 버튼(state Select/Disabled — Hover는 CSS, line=우측 구분선 부착형)
figma.connect(
  SideNavigationButton,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=8200-51452',
  {
    props: {
      selected: figma.enum('state', { Select: true }),
      disabled: figma.enum('state', { Disabled: true }),
      line: figma.enum('line', { Line: true, 'None line': false }),
    },
    example: ({ selected, disabled, line }) => (
      <SideNavigationButton selected={selected} disabled={disabled} line={line}>
        카테고리 이름
      </SideNavigationButton>
    ),
  },
);
