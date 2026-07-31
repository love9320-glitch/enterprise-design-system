import { useRef, useState } from 'react';
import { PanelRight, PanelRightClose, ExternalLink } from 'lucide-react';
import { LAYOUT_DEMO_MENU } from './layoutDemoMenu';
import { AppLayout } from '../components/AppLayout';
import { Lnb } from '../components/Lnb';
import { Gnb, GnbGroup, GnbLogo } from '../components/Gnb';
import { RightPanel } from '../components/RightPanel';
import { Button } from '../components/Button';
import { ButtonGroup } from '../components/ButtonGroup';
import { Avatar } from '../components/Avatar';
import DEMO_IMG from '../assets/avatar-sample.png';
import { Button } from '../components/Button';
import { Checkbox } from '../components/Checkbox';
import { Select } from '../components/Select';
import { Divider } from '../components/Divider';
import { UsageExample } from '../components/UsageExample';

const USAGE = `import { AppLayout } from '../components/AppLayout';
import { Lnb } from '../components/Lnb';
import { Gnb, GnbGroup, GnbLogo } from '../components/Gnb';
import { RightPanel } from '../components/RightPanel';
import { Button } from '../components/Button';
import { ButtonGroup } from '../components/ButtonGroup';
import { Avatar } from '../components/Avatar';
import DEMO_IMG from '../assets/avatar-sample.png';

// App Shell — GNB·LNB·Main·Right Panel을 슬롯으로 조립(템플릿보다 한 단위 큰 계층)
<AppLayout
  gnb={<span className="text-20 font-semibold text-font-icon-5">GNB</span>}
  lnb={<Lnb width="100%" height="100%" groups={GROUPS} />} // site title 없이(레이아웃에선 GNB가 대신)
  pageWidth="standard" // readable(840) | standard(1200) | wide(1440) | fluid(무제한)
  pagePadding="32"     // Page 좌우 패딩 24 | 32 | 40 | none
>
  페이지/템플릿 콘텐츠 — Page Container(중앙 정렬) 안에 배치된다
</AppLayout>

// Right Panel — push(병행 작업·Pinned) / overlay(일시적 보조) / fullscreen(집중형)
<AppLayout
  rightPanel={open ? <PanelContent /> : null} // null = Closed
  panelMode="overlay"
  rightPanelWidth={360} // 기본 360 · 상세 작업 밀도 480
  onPanelClose={() => setOpen(false)} // 명시적 닫기 버튼 + ESC
>…</AppLayout>

// 테이블·빌더 화면 — Fluid Page(가용 공간 전체)
<AppLayout pageWidth="fluid" pagePadding="none">…</AppLayout>`;

const USAGE_PROPS = [
  { name: 'children', type: 'ReactNode', default: '—', desc: 'Page Container 콘텐츠 — Content(fill 영역)와 분리된 실제 UI 컨테이너. pageWidth 최대 폭 + 중앙 정렬' },
  { name: 'gnb', type: 'ReactNode', default: 'null', desc: 'GNB 바(56px+하단 구분선 1px=57) — Gnb 컴포넌트(그룹 구조) 권장. null이면 미표시(집중 모드 등 세로 공간 확보)' },
  { name: 'lnb', type: 'ReactNode', default: 'null', desc: 'LNB — 현재 제품/업무 영역 로컬 탐색. <Lnb width="100%" height="100%"> 권장. null이면 Hidden' },
  { name: 'rightPanel', type: 'ReactNode', default: 'null', desc: 'Right Panel 슬롯 — RightPanel 컴포넌트(width="fill", onClose 연결) 조립 권장. null이면 Closed' },
  { name: 'panelMode', type: "'auto' | 'push' | 'overlay' | 'fullscreen'", default: "'auto'", desc: 'auto=레이아웃 폭 반응형(breakpoint 이상 Push·미만 Overlay 자동 전환) / push=본문 축소·지속 병행(Pinned) / overlay=본문 위 겹침·dim 없음·일시적 보조 / fullscreen=작업 영역 전체·집중형' },
  { name: 'panelBreakpoint', type: 'number', default: '1440', desc: 'auto 모드 전환 기준 폭(px) — 레이아웃 폭이 이상이면 Push, 미만이면 Overlay' },
  { name: 'onPanelClose', type: '() => void', default: '—', desc: 'overlay/fullscreen ESC 닫기 — 명시적 닫기 버튼은 RightPanel onClose로 제공(닫은 뒤 포커스 복귀는 호출부 책임)' },
  { name: 'pageWidth', type: "'readable' | 'standard' | 'wide' | 'fluid'", default: "'standard'", desc: 'Page 최대 폭 — 840(문서·긴 텍스트) / 1200(폼·상세) / 1440(대시보드) / 무제한(테이블·빌더)' },
  { name: 'pagePadding', type: "'24' | '32' | '40' | 'none'", default: "'32'", desc: 'Page 좌우 패딩(spacing-9/11/13) — none은 템플릿이 자체 패딩을 가질 때' },
  { name: 'height', type: 'number | string', default: "'100vh'", desc: '레이아웃 전체 높이 — 앱 셸은 100vh, 데모 등 부분 배치는 px/CSS 길이' },
  { name: 'lnbWidth', type: "'180' | '220' | '260'", default: "'220'", desc: 'LNB 콘텐츠 폭 3단 — 구분선 1px는 별도 점유(+1)' },
  { name: 'rightPanelWidth', type: 'number | string', default: '360', desc: '패널 콘텐츠 폭 — 기본 360, 상세 작업 밀도 480. 구분선 1px 별도(실제 361)' },
  { name: 'mainScroll', type: 'boolean', default: 'true', desc: '메인 내부 스크롤(ScrollArea) — 본문과 패널은 독립 스크롤' },
];

const PAGE_WIDTH_OPTIONS = [
  { value: 'readable', label: 'Readable · 840' },
  { value: 'standard', label: 'Standard · 1200' },
  { value: 'wide', label: 'Wide · 1440' },
  { value: 'fluid', label: 'Fluid · 무제한' },
];
const LNB_WIDTH_OPTIONS = [
  { value: '180', label: '180' },
  { value: '220', label: '220 (기본)' },
  { value: '260', label: '260' },
];
// 미사용(체크 해제)=패널 기능 자체가 없는 화면 / Closed=패널은 쓰지만 지금 닫힘(열기 버튼 존재)
const PANEL_MODE_OPTIONS = [
  { value: 'closed', label: 'Closed' },
  { value: 'auto', label: 'Auto (반응형)' },
  { value: 'push', label: 'Push (Pinned)' },
  { value: 'overlay', label: 'Overlay' },
  { value: 'fullscreen', label: 'Fullscreen' },
];
const PANEL_WIDTH_OPTIONS = [
  { value: '360', label: '360 (기본)' },
  { value: '480', label: '480 (상세 작업)' },
];
const PAGE_PADDING_OPTIONS = [
  { value: '24', label: '24px' },
  { value: '32', label: '32px (기본)' },
  { value: '40', label: '40px' },
  { value: 'none', label: 'none' },
];

function DemoMainContent({ panelUsed, panelOpen, onTogglePanel }) {
  return (
    <div className="space-y-spacing-7">
      <div className="flex h-[32px] items-center justify-between">
        <p className="text-20 font-semibold leading-20 text-font-icon-5">Main Content / Page Container</p>
        {panelUsed && (
          <Button variant="ghost" leftIcon={panelOpen ? PanelRightClose : PanelRight} onClick={onTogglePanel}>
            {panelOpen ? '패널 닫기' : '패널 열기'}
          </Button>
        )}
      </div>
      <p className="text-14 text-font-icon-4">
        Content는 App Shell이 확보한 fill 영역이고, 이 Page Container는 실제 UI가 배치되는 내부
        컨테이너입니다.
        <br />
        둘을 분리해야 LNB 축소·Right Panel 열림/닫힘·해상도 변화에 대응할 수 있습니다.
      </p>
      {Array.from({ length: 12 }, (_, i) => (
        <div key={i} className="rounded-round-4 bg-builder-area-bg p-spacing-7 text-14 text-font-icon-3">
          콘텐츠 블록 {i + 1}
        </div>
      ))}
    </div>
  );
}

function DemoRightPanel({ onClose }) {
  // RightPanel 컴포넌트 조립(2026-07-31) — 헤더(타이틀+닫기)/바디(스크롤)/푸터 3단 표준 구조
  return (
    <RightPanel
      width="fill"
      title="라이트 패널 타이틀"
      onClose={onClose}
      bodyPadding
      footer={
        <div className="flex w-full items-center justify-between">
          <p className="text-14 text-font-icon-5">컴포넌트 영역</p>
          <ButtonGroup gap="5">
            <Button variant="line">취소</Button>
            <Button variant="fill">저장</Button>
          </ButtonGroup>
        </div>
      }
    >
      <p className="text-14 text-font-icon-4">
        AI Assistant·지원자/채용 상세 정보·속성 및 조건 편집·활동 기록·미리보기·다음 액션 등 현재
        작업에 필요한 보조 기능을 수용하는 Secondary Workspace입니다(AI 전용 영역으로 고정하지 않음).
      </p>
    </RightPanel>
  );
}

export function LayoutPage() {
  const [showGnb, setShowGnb] = useState(true);
  const [showLnb, setShowLnb] = useState(true);
  const [lnbWidth, setLnbWidth] = useState('220');
  const [panelUsed, setPanelUsed] = useState(true); // 미사용이면 패널 기능 자체가 없는 화면(열기 버튼도 없음)
  const [panelState, setPanelState] = useState('auto'); // closed | auto | push | overlay | fullscreen
  const lastOpenModeRef = useRef('auto'); // 닫았다 다시 열 때 직전 모드 복원
  const [panelWidth, setPanelWidth] = useState('360');
  const [pageWidth, setPageWidth] = useState('standard');
  const [pagePadding, setPagePadding] = useState('32');
  const [lnbValue, setLnbValue] = useState('layout');

  const panelOpen = panelUsed && panelState !== 'closed';
  const togglePanel = () => {
    if (panelOpen) {
      lastOpenModeRef.current = panelState;
      setPanelState('closed');
    } else {
      setPanelState(lastOpenModeRef.current || 'auto');
    }
  };

  // 데모 전용 — 현재 플레이그라운드 상태를 해시 쿼리로 넘겨 새 창(#layout-preview)으로 연다
  const openPreviewWindow = () => {
    const qs = new URLSearchParams({
      gnb: showGnb ? '1' : '0',
      lnb: showLnb ? '1' : '0',
      lnbw: lnbWidth,
      panel: panelUsed ? panelState : 'none', // none=미사용(패널 기능 없음)
      panelw: panelWidth,
      pw: pageWidth,
      pp: pagePadding,
    });
    window.open(`${window.location.pathname}${window.location.search}#layout-preview?${qs}`, '_blank');
  };

  const renderLayout = (height) => (
        <AppLayout
          height={height}
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
          rightPanel={panelOpen ? <DemoRightPanel onClose={() => setPanelState('closed')} /> : null}
          panelMode={panelOpen ? panelState : 'auto'}
          rightPanelWidth={Number(panelWidth)}
          onPanelClose={() => setPanelState('closed')}
          pageWidth={pageWidth}
          pagePadding={pagePadding}
        >
          <DemoMainContent panelUsed={panelUsed} panelOpen={panelOpen} onTogglePanel={togglePanel} />
        </AppLayout>
  );

  return (
    <section className="py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-20 font-semibold text-font-icon-5">Layout</h2>
      <p className="mb-spacing-8 text-14 text-font-icon-4">
        사이트 전체 구조를 컨트롤하는 <span className="text-font-icon-5">템플릿보다 한 단위 큰 계층</span>입니다.
        핵심 원칙 — ① LNB·Right Panel은 고정/제한된 폭, Main Content는 남는 공간을 채우는{' '}
        <span className="text-font-icon-5">Fill 구조</span> ② <span className="text-font-icon-5">Content</span>(App
        Shell 영역)와 <span className="text-font-icon-5">Page</span>(실제 UI 컨테이너)를 분리 ③ Right Panel은
        화면 너비·작업 성격에 따라 <span className="text-font-icon-5">Push · Overlay · Fullscreen</span> 모드 전환
        ④ Page는 <span className="text-font-icon-5">Readable · Standard · Wide · Fluid</span> 타입으로 구분.
      </p>

      <UsageExample
        code={USAGE}
        props={USAGE_PROPS}
        note="영역 폭(GNB 56 / LNB 180·220·260 / Panel 360·480)은 콘텐츠 크기 기준이고 구분선 1px는 별도 점유(+1)입니다. 레이아웃 계산에는 점유 크기를 사용하세요."
      />

      {/* 통합 플레이그라운드 */}
      <div className="mb-spacing-6 flex flex-wrap items-center gap-x-spacing-8 gap-y-spacing-5">
        <div className="flex items-center gap-spacing-6">
          <p className="text-12 text-font-icon-3">영역</p>
          <Checkbox label="GNB" checked={showGnb} onChange={() => setShowGnb((v) => !v)} />
          <Checkbox label="LNB" checked={showLnb} onChange={() => setShowLnb((v) => !v)} />
          <Select width="hug" options={LNB_WIDTH_OPTIONS} value={lnbWidth} onChange={(e) => setLnbWidth(e.target.value)} disabled={!showLnb} />
        </div>
        <div className="flex items-center gap-spacing-4">
          <p className="text-12 text-font-icon-3">Right Panel</p>
          <Checkbox label="사용" checked={panelUsed} onChange={() => setPanelUsed((v) => !v)} />
          <Select width="hug" options={PANEL_MODE_OPTIONS} value={panelState} onChange={(e) => setPanelState(e.target.value)} disabled={!panelUsed} />
          <Select width="hug" options={PANEL_WIDTH_OPTIONS} value={panelWidth} onChange={(e) => setPanelWidth(e.target.value)} disabled={!panelUsed} />
        </div>
        <div className="flex items-center gap-spacing-4">
          <p className="text-12 text-font-icon-3">Page</p>
          <Select width="hug" options={PAGE_WIDTH_OPTIONS} value={pageWidth} onChange={(e) => setPageWidth(e.target.value)} />
          <Select width="hug" options={PAGE_PADDING_OPTIONS} value={pagePadding} onChange={(e) => setPagePadding(e.target.value)} />
        </div>
        <Button variant="line" leftIcon={ExternalLink} onClick={openPreviewWindow}>
          새 창으로 보기
        </Button>
      </div>
      <div className="overflow-hidden rounded-round-6 ring-1 ring-modal-outline">
        {renderLayout(520)}
      </div>

      <Divider className="mt-spacing-9 mb-spacing-8" />

      {/* App Shell 구조 */}
      <h3 className="mb-spacing-5 text-16 font-semibold text-font-icon-5">App Shell 구조와 Divider 점유 규칙</h3>
      <ul className="list-disc space-y-spacing-3 pl-spacing-8 text-14 text-font-icon-4">
        <li><span className="text-font-icon-5">GNB</span> — 56px(+하단 구분선 1px = 57), Gnb 그룹 구조(흰 그룹+1px 갭) · 전역 탐색, 제품 전환, 계정 및 공통 액션</li>
        <li><span className="text-font-icon-5">LNB</span> — 180 | 220 | 260px 3단(+우측 구분선 1px) · 현재 제품/업무 영역의 로컬 탐색</li>
        <li><span className="text-font-icon-5">Main Content</span> — Fill(min-width 0) · 화면에 따라 유동적으로 확장되는 핵심 작업 영역. 계산식: Main = Viewport − LNB − Right Panel</li>
        <li><span className="text-font-icon-5">Right Panel</span> — 360px(+좌측 구분선 1px = 361) · AI, 상세 정보, 속성, 활동 기록 등 보조 작업 영역</li>
        <li>폭 토큰은 <span className="text-font-icon-5">콘텐츠 크기</span> 기준으로 관리하고, 레이아웃 계산에는 구분선을 포함한 <span className="text-font-icon-5">점유 크기</span>(65/281/361)를 사용한다 — 구분선은 별도 시각 요소라 내부 레이아웃에 영향을 주지 않는다</li>
      </ul>

      <Divider className="mt-spacing-9 mb-spacing-8" />

      {/* Page Width 정책 */}
      <h3 className="mb-spacing-5 text-16 font-semibold text-font-icon-5">Content와 Page Width 정책</h3>
      <ul className="list-disc space-y-spacing-3 pl-spacing-8 text-14 text-font-icon-4">
        <li><span className="text-font-icon-5">Readable · 840px</span> — 안내문·문서·긴 텍스트 (중앙 정렬)</li>
        <li><span className="text-font-icon-5">Standard · 1200px</span> — 설정·상세·일반 입력 폼 (중앙 정렬, 기본값)</li>
        <li><span className="text-font-icon-5">Wide · 1440px</span> — 대시보드·복수 컬럼 (중앙 정렬 또는 Fill)</li>
        <li><span className="text-font-icon-5">Fluid · 제한 없음</span> — 테이블·빌더·채용 플로우 (가용 공간 전체)</li>
        <li>구현 규칙: Main Content는 width Fill + min-width 0, Page는 width 100% + max-width + margin auto, 좌우 패딩 24~40px(spacing-9/11/13)</li>
        <li>해상도별 Main Content(LNB 220 + Panel 360 기준): 1440→860 · 1600→1020 · 1920→1340 · 2560→1980. 테이블·빌더 화면은 본문 최소 1100~1200px 확보 권장</li>
      </ul>

      <Divider className="mt-spacing-9 mb-spacing-8" />

      {/* Right Panel 정책 */}
      <h3 className="mb-spacing-5 text-16 font-semibold text-font-icon-5">Right Panel — Secondary Workspace</h3>
      <ul className="list-disc space-y-spacing-3 pl-spacing-8 text-14 text-font-icon-4">
        <li><span className="text-font-icon-5">Push(Pinned)</span> — 본문 폭을 줄여 패널 공간 확보. 본문과 패널을 동시에 비교·편집하는 지속 병행 작업(지원자 평가+이력서 비교, 조건·속성 연속 편집, 드래그 앤 드롭 상호작용). 좁은 화면에선 본문이 과도하게 축소될 수 있음</li>
        <li><span className="text-font-icon-5">Overlay</span> — 본문 레이아웃을 유지한 채 위에 겹침. 일시적 확인·AI 질문·상세 보기·알림 등 열고 닫는 빈도가 높은 보조 작업. dim 없이 좌측 구분선+그림자만, 본문과 독립 스크롤, 명시적 닫기 버튼+ESC 제공(작성 중 데이터가 있으면 외부 클릭 닫기 금지)</li>
        <li><span className="text-font-icon-5">Fullscreen</span> — 패널이 작업 영역 전체를 차지. 작은 화면·집중형 상세 작업(본문과 동시 비교 불가)</li>
        <li>기본 폭 360px, 상세 작업은 480px까지 허용</li>
        <li>반응형 권장 — 1920px 이상: Push(패널 열어도 본문 1280px 확보) · 1600~1919px: 유형별 Push/Overlay · 1440~1599px: Overlay · 1440px 미만: Overlay 또는 Fullscreen. <span className="text-font-icon-5">panelMode=auto(기본)가 레이아웃 폭 1440 기준으로 Push↔Overlay를 자동 전환</span>하며, 기준은 panelBreakpoint로 조정</li>
      </ul>

      <Divider className="mt-spacing-9 mb-spacing-8" />

      {/* Workspace 표시 상태 */}
      <h3 className="mb-spacing-5 text-16 font-semibold text-font-icon-5">Workspace 표시 상태와 집중 모드</h3>
      <ul className="list-disc space-y-spacing-3 pl-spacing-8 text-14 text-font-icon-4">
        <li>상태 모델 — GNB: <span className="text-font-icon-5">Visible | Hidden</span>(세로 공간 확보) · LNB: <span className="text-font-icon-5">Expanded(180/220/260) | Compact | Hidden</span>(가로 공간 확보 — Compact 64~72px 아이콘 모드는 Lnb 컴포넌트 확장 예정) · Right Panel: <span className="text-font-icon-5">Closed | Overlay | Pinned</span> · Main Content: 항상 표시</li>
        <li><span className="text-font-icon-5">Focus Mode</span> — GNB·LNB 숨김 + 패널 Closed로 Main Content만 남기는 상태. 스크리닝 빌더·대규모 테이블처럼 작업 공간이 중요한 화면에 적합. 진입/종료는 동일 위치의 명시적 컨트롤로, 복구 수단(버튼·단축키)을 항상 제공</li>
        <li>공간 부족 시 우선순위 — ① GNB 숨김/축소 → ② Panel Pinned→Overlay → ③ LNB Compact→Hidden → ④ Main Content 최소 폭 유지. 숨김은 공간 확보를 위한 선택이며 복구 가능성과 작업 연속성(현재 위치·저장 상태·필수 알림)을 항상 보장한다</li>
      </ul>
    </section>
  );
}
