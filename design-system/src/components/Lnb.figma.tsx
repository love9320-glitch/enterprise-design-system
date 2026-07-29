// Lnb 계열 Code Connect 매핑(2026-07-29) — menu(8843:8836) / menu group 1depth(8843:9185) ·
// 2depth(8844:9428) / site title area(8844:9348) / LNB(8844:9329).
//   - menu: depth(1depth/2depth/sub depth)·state(select→selected, disabled — hover/click은 CSS 상태).
//   - 아이콘 스왑은 대표 아이콘(Users) 예시. 2depth의 select는 '펼침'이라 open도 함께 표기.
// 발행: main 머지 시 자동(.github/workflows/figma-code-connect.yml)
// 파서 제약 — URL·props는 리터럴만(변수·스프레드·as const 금지).
import figma from '@figma/code-connect';
import { Users } from 'lucide-react';
import { Lnb, LnbMenu, LnbMenuGroup } from './Lnb';

// menu — 메뉴 한 줄. depth별로 매핑 분리(2026-07-29): 1depth·sub의 select는 selected,
// 2depth의 select는 '펼침'이라 open으로 번역(1depth 스니펫에 open이 붙던 오류 수정)
figma.connect(
  LnbMenu,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=8843-8836',
  {
    props: {
      depth: figma.enum('depth', { '1depth': '1', 'sub depth': 'sub' }),
      selected: figma.enum('state', { select: true }),
      disabled: figma.enum('state', { disabled: true }),
      label: figma.string('menu name'),
    },
    example: ({ depth, selected, disabled, label }) => (
      <LnbMenu depth={depth} icon={Users} selected={selected} disabled={disabled} label={label} />
    ),
  },
);
figma.connect(
  LnbMenu,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=8843-8836',
  {
    variant: { depth: '2depth' },
    props: {
      open: figma.enum('state', { select: true }),
      disabled: figma.enum('state', { disabled: true }),
      label: figma.string('menu name'),
    },
    example: ({ open, disabled, label }) => (
      <LnbMenu depth="2" open={open} disabled={disabled} label={label} />
    ),
  },
);

// menu group 1depth — 카테고리 + 1depth 메뉴 스택
figma.connect(
  LnbMenuGroup,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=8843-9185',
  {
    example: () => (
      <LnbMenuGroup title="메뉴 카테고리">
        <LnbMenu label="메뉴명입니다" icon={Users} />
        <LnbMenu label="메뉴명입니다" icon={Users} selected />
        <LnbMenu label="메뉴명입니다" icon={Users} />
      </LnbMenuGroup>
    ),
  },
);

// menu group 2depth — 펼침 부모 + sub depth 하위
figma.connect(
  LnbMenuGroup,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=8844-9428',
  {
    example: () => (
      <LnbMenuGroup title="메뉴 카테고리">
        <LnbMenu label="메뉴명입니다" depth="2" />
        <LnbMenu label="메뉴명입니다" depth="2" open selected />
        <LnbMenu label="메뉴명입니다" depth="sub" selected />
        <LnbMenu label="메뉴명입니다" depth="sub" />
      </LnbMenuGroup>
    ),
  },
);

// site title area — Lnb의 siteTitle 슬롯으로 표현
figma.connect(
  Lnb,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=8844-9348',
  {
    example: () => (
      <Lnb
        siteTitle={
          <>
            DESIGN
            <br />
            SYSTEM
          </>
        }
      />
    ),
  },
);

// LNB — 컨테이너 전체(데이터 모드)
figma.connect(
  Lnb,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=8844-9329',
  {
    example: () => (
      <Lnb
        siteTitle={
          <>
            DESIGN
            <br />
            SYSTEM
          </>
        }
        groups={[
          {
            title: '메뉴 카테고리',
            items: [
              { value: 'a', label: '메뉴명입니다', icon: Users },
              { value: 'b', label: '메뉴명입니다', icon: Users },
            ],
          },
          {
            title: '메뉴 카테고리',
            items: [
              {
                value: 'c',
                label: '메뉴명입니다',
                children: [
                  { value: 'c-1', label: '메뉴명입니다' },
                  { value: 'c-2', label: '메뉴명입니다' },
                ],
              },
            ],
          },
        ]}
        defaultExpanded={['c']}
        defaultValue="a"
      />
    ),
  },
);
