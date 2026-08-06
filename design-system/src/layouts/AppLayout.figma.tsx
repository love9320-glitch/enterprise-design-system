// AppLayout Code Connect 매핑(2026-08-02) — layout 심볼(8941:17252, 101_layout).
//   사이트 골격 조립 예시: gnb=Gnb(그룹 구조), lnb=Lnb(데이터 모드), rightPanel=RightPanel(fill).
//   gnb/lnb/rightPanel 불리언 토글은 코드에서 슬롯 null이 대응(규칙 11 — 코드 축소 없음).
// 발행: main 머지 시 자동(.github/workflows/figma-code-connect.yml)
// 파서 제약 — URL·props는 리터럴만(변수·스프레드·as const 금지).
import figma from '@figma/code-connect';
import { Users } from 'lucide-react';
import { AppLayout } from './AppLayout';
import { Avatar } from '../components/Avatar';
import { Gnb, GnbGroup, GnbLogo } from './Gnb';
import { Lnb } from './Lnb';
import { RightPanel } from './RightPanel';
import { SearchBar } from '../components/SearchBar';

figma.connect(
  AppLayout,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=8941-17252',
  {
    example: () => (
      <AppLayout
        gnb={
          <Gnb>
            <GnbGroup fill justify="between">
              <GnbLogo>LOGO</GnbLogo>
              <SearchBar />
            </GnbGroup>
            <GnbGroup>
              <Avatar src="/user.jpg" alt="사용자" />
            </GnbGroup>
          </Gnb>
        }
        lnb={
          <Lnb
            width="100%"
            height="100%"
            siteTitle="DESIGN SYSTEM"
            groups={[
              {
                title: '메뉴 카테고리',
                items: [
                  { value: 'a', label: '메뉴명입니다', icon: Users },
                  { value: 'b', label: '메뉴명입니다', icon: Users },
                ],
              },
            ]}
            defaultValue="a"
          />
        }
        rightPanel={<RightPanel width="fill" title="라이트 패널 타이틀" onClose={() => {}} />}
        onPanelClose={() => {}}
      >
        페이지/템플릿 콘텐츠
      </AppLayout>
    ),
  },
);
