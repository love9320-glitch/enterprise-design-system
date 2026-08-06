import { useState } from 'react';
import { PanelRight, PanelRightClose } from 'lucide-react';
import { LAYOUT_DEMO_MENU } from './layoutDemoMenu';
import { AppLayout } from '../../layouts/AppLayout';
import { Page } from '../../layouts/Page';
import { Lnb } from '../../layouts/Lnb';
import { Gnb, GnbGroup, GnbLogo } from '../../layouts/Gnb';
import { RightPanel } from '../../layouts/RightPanel';
import { Avatar } from '../../components/Avatar';
import DEMO_IMG from '../../assets/avatar-sample.png';
import { Button } from '../../components/Button';

// 레이아웃 전체 화면 미리보기(데모 전용 숨은 라우트 — 내비게이션 미등록).
// LayoutPage의 "전체 화면으로 보기"가 플레이그라운드 상태를 해시 쿼리로 넘겨 새 창으로 연다:
//   #layout-preview?gnb=1&lnb=1&lnbw=260&panel=auto&panelw=360&pw=standard&pp=32
// 새 창은 100vh 레이아웃만 렌더하므로 브라우저 창 크기로 반응형(auto push↔overlay)을 확인한다.

// 해시의 '?' 이후를 파싱 — '#layout-preview?gnb=1&…'
function readParams() {
  const hash = window.location.hash;
  const qs = hash.includes('?') ? hash.slice(hash.indexOf('?') + 1) : '';
  return new URLSearchParams(qs);
}

export function LayoutPreviewPage() {
  const [params] = useState(readParams);
  const showGnb = params.get('gnb') !== '0';
  const showLnb = params.get('lnb') !== '0';
  const lnbWidth = params.get('lnbw') || '220';
  const initialPanel = params.get('panel') || 'auto'; // none(미사용) | closed | auto | push | overlay | fullscreen
  const panelUsed = initialPanel !== 'none'; // 미사용이면 패널 열기 버튼도 없는 화면
  const panelWidth = Number(params.get('panelw') || 360);
  const pageWidth = params.get('pw') || 'standard';
  const pagePadding = params.get('pp') || '32';
  const stickyHeader = params.get('sticky') !== '0'; // Page 헤더 스크롤 시 상단 고정(기본 켬)

  const [panelState, setPanelState] = useState(panelUsed ? initialPanel : 'closed');
  const [lnbValue, setLnbValue] = useState('layout');
  const panelOpen = panelUsed && panelState !== 'closed';
  const openMode = initialPanel === 'closed' || initialPanel === 'none' ? 'auto' : initialPanel;

  return (
    <AppLayout
      gnb={
        showGnb ? (
          /* GNB 컴포넌트(그룹 구조) 적용 — fill 그룹(로고) + 아바타 그룹(2026-07-31) */
          <Gnb>
            <GnbGroup fill justify="between">
              <GnbLogo>GNB</GnbLogo>
            </GnbGroup>
            <GnbGroup>
              <Avatar src={DEMO_IMG} alt="사용자" interactive={false} />
            </GnbGroup>
          </Gnb>
        ) : null
      }
      lnb={
        showLnb ? (
          <Lnb
            width="100%"
            height="100%"
            groups={LAYOUT_DEMO_MENU}
            value={lnbValue}
            onChange={setLnbValue}
          />
        ) : null
      }
      lnbWidth={lnbWidth}
      rightPanel={
        panelOpen ? (
          /* RightPanel 컴포넌트 조립(2026-07-31) — 헤더/바디 표준 구조 */
          <RightPanel
            width="fill"
            title="라이트 패널 타이틀"
            onClose={() => setPanelState('closed')}
            bodyPadding
          >
            <p className="text-14 text-font-icon-4">
              AI Assistant·지원자/채용 상세 정보·속성 및 조건 편집·활동 기록·미리보기·다음 액션 등 현재
              작업에 필요한 보조 기능을 수용하는 Secondary Workspace입니다(AI 전용 영역으로 고정하지 않음).
            </p>
          </RightPanel>
        ) : null
      }
      panelMode={panelOpen ? panelState : 'auto'}
      rightPanelWidth={panelWidth}
      onPanelClose={() => setPanelState('closed')}
      pageWidth={pageWidth}
      pagePadding={pagePadding}
    >
      {/* Page 컴포넌트 도그푸딩(2026-08-04 지시) — 본문을 Page(PageHeader+body 슬롯)로 조립 */}
      <Page
        title="Main Content / Page Container"
        description="Content는 App Shell이 확보한 fill 영역이고, 이 Page는 실제 UI가 배치되는 내부 컨테이너입니다."
        stickyHeader={stickyHeader}
        actions={
          panelUsed ? (
            <Button
              variant="ghost"
              leftIcon={panelOpen ? PanelRightClose : PanelRight}
              onClick={() => setPanelState(panelOpen ? 'closed' : openMode)}
            >
              {panelOpen ? '패널 닫기' : '패널 열기'}
            </Button>
          ) : undefined
        }
      >
        <p className="text-14 text-font-icon-4">
          둘을 분리해야 LNB 축소·Right Panel 열림/닫힘·해상도 변화에 대응할 수 있습니다. 이 창의
          크기를 직접 바꿔가며 반응형(auto Push↔Overlay, 1440 기준)을 확인하세요.
        </p>
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className="rounded-round-4 bg-builder-area-bg p-spacing-7 text-14 text-font-icon-3">
            콘텐츠 블록 {i + 1}
          </div>
        ))}
      </Page>
    </AppLayout>
  );
}
