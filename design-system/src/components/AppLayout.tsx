// AppLayout — 사이트 전체 구조 레이아웃 (Figma 101_layout / layout, node 8941:17252)
// 템플릿보다 한 단위 큰 계층: 페이지/템플릿을 담는 사이트 골격(GNB·LNB·Main·Right Panel)을 컨트롤한다.
// 2026-07-30 레이아웃 가이드라인(ATS Layout Guideline) 반영:
//   - Content/Page 분리 — Main Content는 App Shell이 확보한 fill 영역(min-w-0), Page Container는
//     실제 UI가 배치되는 내부 컨테이너로 pageWidth 타입(readable 840 / standard 1200 / wide 1440 /
//     fluid 무제한)에 따라 최대 폭 + 중앙 정렬. 좌우 패딩은 pagePadding(32/40px 토큰).
//   - Right Panel 모드 — push(본문 폭을 줄여 공간 확보·지속 병행 작업) / overlay(본문 위 겹침 —
//     dim 없음·좌측 구분선+그림자·독립 스크롤·일시적 보조 작업) / fullscreen(작업 영역 전체·집중형).
//     onPanelClose를 주면 명시적 닫기 버튼 + ESC(overlay·fullscreen) 닫기를 제공한다.
//   - Divider 점유 규칙 — 각 영역 폭(GNB 54 / LNB 180·220·260 / Panel 360·480)은 '콘텐츠 크기'
//     기준이고 구분선 1px는 별도 요소로 점유(+1). 내부 레이아웃은 구분선의 영향을 받지 않는다.
// 각 영역은 슬롯(ReactNode)이며 null이면 그 영역 자체가 빠진다(Figma gnb/lnb/rightPanel 토글과 동일).
// 색은 layout-* 시멘틱 토큰, 구분선은 DS Divider(divider-* 토큰) 재사용.
// 스크롤 규칙(규칙 9): 메인·우측 패널은 각자 ScrollArea 내부 스크롤 — 루트에 height가 있어야
//   % 상한이 동작하므로(ScrollArea 판례) 영역 래퍼에 h-full을 명시한다.
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { Divider } from './Divider';
import { ScrollArea } from './ScrollArea';

// Page Container 타입 — 최대 폭 + 중앙 정렬(fluid는 가용 공간 전체)
const PAGE_WIDTH_CLASS = {
  readable: 'max-w-[840px]', // 안내문·문서·긴 텍스트
  standard: 'max-w-[1200px]', // 설정·상세·일반 입력 폼
  wide: 'max-w-[1440px]', // 대시보드·복수 컬럼
  fluid: '', // 테이블·빌더·채용 플로우 — 제한 없음
};

// LNB 폭 3단(2026-07-30 지시 — 기존 280 기본 제거). 콘텐츠 폭 기준, 구분선 1px 별도.
const LNB_WIDTH = {
  '180': 180,
  '220': 220,
  '260': 260,
};

// Page 좌우 패딩 — 24/32/40px(토큰 spacing-9/11/13, 2026-07-30 24 추가)
const PAGE_PADDING_CLASS = {
  '24': 'px-spacing-9',
  '32': 'px-spacing-11',
  '40': 'px-spacing-13',
  none: '', // 템플릿이 자체 패딩을 가질 때
};

interface AppLayoutProps {
  children?: ReactNode; // Page Container 콘텐츠 — 페이지/템플릿이 이 안에 조립된다
  gnb?: ReactNode; // GNB 바 내용(전역 탐색·제품 전환·계정 등) — null이면 GNB 영역 미표시
  lnb?: ReactNode; // 좌측 내비게이션(현재 제품/업무 영역 로컬 탐색) — <Lnb width="100%" height="100%"> 권장. null이면 미표시
  rightPanel?: ReactNode; // 우측 패널(AI·상세 정보·활동 기록 등 보조 작업 영역) — null이면 닫힘(Closed)
  panelMode?: 'auto' | 'push' | 'overlay' | 'fullscreen'; // 패널 표시 방식 — auto(레이아웃 폭 반응형: breakpoint 이상 push/미만 overlay) | push(본문 축소·병행) | overlay(본문 위 겹침·일시적) | fullscreen(작업 영역 전체·집중형)
  panelBreakpoint?: number; // auto 모드 전환 기준 폭(px) — 기본 1440(이상 push / 미만 overlay)
  onPanelClose?: () => void; // overlay/fullscreen 명시적 닫기 버튼 + ESC 닫기 콜백 — 미지정 시 닫기 UI 없음
  height?: number | string; // 레이아웃 전체 높이 — 기본 '100vh'(앱 셸). 데모 등 부분 배치 시 숫자(px)/CSS 길이
  lnbWidth?: keyof typeof LNB_WIDTH; // LNB 콘텐츠 폭 3단 — '180' | '220' | '260'(구분선 1px 별도)
  rightPanelWidth?: number | string; // 패널 콘텐츠 폭(구분선 1px 별도) — 기본 360, 상세 작업 밀도는 480
  pageWidth?: keyof typeof PAGE_WIDTH_CLASS; // Page Container 타입 — readable(840)|standard(1200)|wide(1440)|fluid(무제한)
  pagePadding?: keyof typeof PAGE_PADDING_CLASS; // Page 좌우 패딩 — '24'|'32'|'40'|'none'
  mainScroll?: boolean; // 메인 콘텐츠 내부 스크롤(ScrollArea) — 기본 true. false면 콘텐츠가 영역을 직접 관리
  onMainViewport?: (el: HTMLElement | null) => void; // mainScroll ScrollArea 뷰포트 참조 — 페이지 전환 시 스크롤 리셋 등 호출부 제어용(2026-08-05 셸 도그푸딩 승격)
  className?: string;
}

const toLen = (v: number | string) => (typeof v === 'number' ? `${v}px` : v);

export function AppLayout({
  children,
  gnb = null, // GNB 바 내용 — null이면 GNB 영역 미표시
  lnb = null, // 좌측 내비게이션 — null이면 미표시
  rightPanel = null, // 우측 패널 내용 — null이면 닫힘(Closed)
  panelMode = 'auto', // auto(폭 반응형 push↔overlay) | push | overlay | fullscreen
  panelBreakpoint = 1440, // auto 전환 기준 폭 — 이상 push / 미만 overlay
  onPanelClose, // overlay/fullscreen 명시적 닫기 버튼 + ESC 닫기
  height = '100vh', // 레이아웃 전체 높이 — 데모 등 부분 배치 시 숫자(px)/CSS 길이
  lnbWidth = '220', // LNB 콘텐츠 폭 3단('180'|'220'|'260', 구분선 1px 별도) — 기본 220
  rightPanelWidth = 360, // 패널 콘텐츠 폭(구분선 1px 별도, Figma 360 — 상세 작업은 480)
  pageWidth = 'standard', // Page Container 타입(가이드라인 — 일반 폼 기본 1200 중앙 정렬)
  pagePadding = '32', // Page 좌우 패딩('24'|'32'|'40'|'none')
  mainScroll = true, // 메인 콘텐츠 내부 스크롤(ScrollArea)
  onMainViewport, // mainScroll 뷰포트 참조 콜백(스크롤 리셋 등)
  className = '',
}: AppLayoutProps) {
  const rootStyle: CSSProperties = { height: toLen(height) };
  const panelOpen = rightPanel != null;

  // auto 모드 — 레이아웃(루트) 폭을 관측해 breakpoint 이상이면 push, 미만이면 overlay로 자동 전환
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [narrow, setNarrow] = useState(false);
  useLayoutEffect(() => {
    if (panelMode !== 'auto') return undefined;
    const el = rootRef.current;
    if (!el) return undefined;
    const measure = () => setNarrow(el.getBoundingClientRect().width < panelBreakpoint);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [panelMode, panelBreakpoint]);
  const effectiveMode = panelMode === 'auto' ? (narrow ? 'overlay' : 'push') : panelMode;

  const isOverlay = panelOpen && effectiveMode === 'overlay';
  const isFullscreen = panelOpen && effectiveMode === 'fullscreen';
  const isPush = panelOpen && effectiveMode === 'push';

  // ESC 닫기 — overlay/fullscreen에서만(접근성 규칙: 닫은 뒤 포커스 복귀는 호출부 책임)
  useEffect(() => {
    if (!(isOverlay || isFullscreen) || !onPanelClose) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onPanelClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOverlay, isFullscreen, onPanelClose]);

  // Page Container — Content(fill 영역) 안의 실제 UI 컨테이너(중앙 정렬).
  // fluid + none이면 래퍼 없이 그대로 — 페이지/템플릿이 폭·패딩·(mainScroll=false 시)스크롤을
  // 직접 관리하는 조합(데모 사이트 셸처럼 children이 h-full 체인을 이어야 할 때 필수).
  const isBare = pageWidth === 'fluid' && pagePadding === 'none';
  // pagePadding은 문서 그대로 '좌우' 패딩만 담당한다 — 상하 여백은 페이지(Page 바디 p 20,
  // 데모 페이지 py 40 등)가 소유(2026-08-05 정리: 기존 py-spacing-8 동반 지급이 이중 여백을 만들던 것 제거)
  const pageInner = isBare ? (
    children
  ) : (
    <div
      className={`mx-auto w-full ${PAGE_WIDTH_CLASS[pageWidth] ?? PAGE_WIDTH_CLASS.standard} ${
        PAGE_PADDING_CLASS[pagePadding] ?? PAGE_PADDING_CLASS['32']
      }`}
    >
      {children}
    </div>
  );

  // 패널 본체 — 크롬(헤더·닫기 버튼·스크롤·패딩)은 슬롯 콘텐츠가 담당.
  // RightPanel 컴포넌트(width="fill", onClose=onPanelClose 연결) 조립을 권장한다(2026-07-31 개정).
  const panelBody = <div className="h-full min-w-0">{rightPanel}</div>;

  return (
    <div ref={rootRef} style={rootStyle} className={`flex min-h-0 flex-col ${className}`}>
      {gnb != null && (
        <header className="shrink-0">
          {/* 크롬(배경·패딩)은 슬롯 콘텐츠가 담당 — Gnb(그룹 구조: 흰 그룹+1px 갭 배경) 권장.
              일반 노드를 넣으면 GnbGroup fill로 감싸는 조립을 권장한다(2026-07-31 그룹 개정) */}
          <div className="h-[54px] bg-layout-gnb-bg">{gnb}</div>
          <Divider />
        </header>
      )}
      {/* 작업 영역(body row) — overlay/fullscreen 패널의 기준 컨테이너 */}
      <div className="relative flex min-h-0 flex-1 items-stretch">
        {lnb != null && (
          <aside
            className="relative h-full shrink-0"
            style={{ width: `${LNB_WIDTH[lnbWidth] ?? LNB_WIDTH['220']}px` }}
          >
            {/* Lnb가 width/height 100%로 채우도록 absolute 캔버스 제공(데모 사이트 도그푸딩과 동일 패턴) */}
            <div className="absolute inset-0">{lnb}</div>
          </aside>
        )}
        {lnb != null && <Divider direction="vertical" className="h-full" />}
        <main className="h-full min-w-0 flex-1 bg-layout-main-bg">
          {mainScroll ? (
            <ScrollArea maxHeight="100%" style={{ height: '100%' }} onViewport={onMainViewport}>
              {pageInner}
            </ScrollArea>
          ) : (
            pageInner
          )}
        </main>
        {/* push — 본문 폭을 줄이고 패널 공간 확보(지속 병행 작업·Pinned) */}
        {isPush && <Divider direction="vertical" className="h-full" />}
        {isPush && (
          <aside
            className="h-full shrink-0 bg-layout-panel-bg"
            style={{ width: toLen(rightPanelWidth) }}
          >
            {panelBody}
          </aside>
        )}
        {/* overlay — 본문 레이아웃 유지한 채 위에 겹침(dim 없음·좌측 구분선+그림자·일시적 보조) */}
        {isOverlay && (
          <aside
            className="absolute inset-y-0 right-0 z-20 flex items-stretch bg-layout-panel-bg shadow-[-4px_0px_8px_0px_rgba(0,0,0,0.06)]"
            style={{ width: toLen(rightPanelWidth) }}
          >
            <Divider direction="vertical" className="h-full" />
            <div className="h-full min-w-0 flex-1">{panelBody}</div>
          </aside>
        )}
        {/* fullscreen — 패널이 작업 영역 전체를 차지(작은 화면·집중형 상세 작업) */}
        {isFullscreen && (
          <aside className="absolute inset-0 z-20 bg-layout-panel-bg">{panelBody}</aside>
        )}
      </div>
    </div>
  );
}
