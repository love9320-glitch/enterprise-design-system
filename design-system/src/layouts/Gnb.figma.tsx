// Gnb Code Connect 매핑(2026-07-31) — GNB 단일 컴포넌트(8932:15601, 그룹 구조 개정).
//   - GnbGroup 조립 구조라 예시는 Figma 기본 구성(fill 그룹: 로고+슬롯 / hug 그룹: 아바타)으로 표현.
//   - 그룹·슬롯은 코드에서 children 자유 조립이 대응(규칙 11 — 코드 축소 없음).
// 발행: main 머지 시 자동(.github/workflows/figma-code-connect.yml)
// 파서 제약 — URL·props는 리터럴만(변수·스프레드·as const 금지).
import figma from '@figma/code-connect';
import { Bell, Search } from 'lucide-react';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { ButtonGroup } from '../components/ButtonGroup';
import { Gnb, GnbGroup, GnbLogo } from './Gnb';
import { SearchBar } from '../components/SearchBar';

figma.connect(
  Gnb,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=8932-15601',
  {
    example: () => (
      <Gnb bar>
        <GnbGroup fill justify="between">
          <GnbLogo>LOGO</GnbLogo>
          <div className="flex items-center gap-spacing-6">
            <ButtonGroup gap="6">
              <Button variant="ghost" icon={Search} aria-label="검색" />
              <Button variant="ghost" icon={Bell} aria-label="알림" />
            </ButtonGroup>
            <SearchBar />
          </div>
        </GnbGroup>
        <GnbGroup>
          <Avatar src="/user.jpg" alt="사용자" />
        </GnbGroup>
      </Gnb>
    ),
  },
);
