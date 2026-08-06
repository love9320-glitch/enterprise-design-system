import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { version as pkgVersion } from '../package.json';
import {
  HomePage,
  TypographyPage, BaseColorsPage, FontIconColorsPage,
  SpacingPage, IconsPage, ButtonPage, SegmentControlPage, ToolBarPage, AccordionPage,
  ComponentColorsPage,
  SearchBarPage, InputPage, TextAreaPage, SelectPage, LabelPage, FieldPage, TagPage, ChipPage, TooltipScrollbarPage, SideNavigationPage, CheckboxPage, RadioPage, SwitchPage, TabsPage, SegmentedTabsPage, OptionListPage,
  UploadMenuPage,
  ConditionOrderSlotPage, JobPositionTemplatePage, JobPostingTemplatePage, ScreeningBuilderTemplatePage, LayoutPage, LayoutPreviewPage, AvatarPage, GnbPage, RightPanelPage, PagePage, StepperPage, SendHistoryPage, BulkSendPage, MultiStepFormTemplatePage,
  PaginationPage, TablePage, TableTemplatePage, FormTemplatePage, SideNavTemplatePage, ModalPage, DatePickerPage, LnbPage,
  RuleOverviewPage, RuleFoundationPage, RuleComponentsPage, RuleTemplatesPage, RuleUsagePage, CustomizationGuidePage, GettingStartedPage,
} from './pages/index';
import { AppLayout } from './components/AppLayout';
import { Lnb } from './components/Lnb';
import { Gnb, GnbGroup } from './components/Gnb';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Select } from './components/Select';
import { Tag } from './components/Tag';
import { NavContext } from './navContext';

// Editor는 Tiptap 엔진이 무거워 초기 번들에서 분리(지연 로드). 컴포넌트 자체는 변경 없음.
const EditorPage = lazy(() =>
  import('./pages/EditorPage').then((m) => ({ default: m.EditorPage })),
);
// Notice Writing Template도 Editor(Tiptap)를 포함하므로 동일하게 지연 로드한다.
const NoticeTemplatePage = lazy(() =>
  import('./pages/NoticeTemplatePage').then((m) => ({ default: m.NoticeTemplatePage })),
);
// 모달 테스트 페이지도 '안내 작성' 모달(NoticeWritingTemplate=Editor 포함) 때문에 지연 로드한다.
const ModalTestPage = lazy(() =>
  import('./pages/ModalTestPage').then((m) => ({ default: m.ModalTestPage })),
);

const NAV_GROUPS = [
  {
    label: '',
    items: [
      { id: 'home', label: '디자인 시스템 소개', Page: HomePage },
    ],
  },
  {
    label: '파운데이션',
    items: [
      { id: 'typography',       label: 'Typography',          Page: TypographyPage },
      { id: 'colors',           label: 'Base Colors',         Page: BaseColorsPage },
      { id: 'font-icon-colors', label: 'Font/Icon Colors',    Page: FontIconColorsPage },
      { id: 'component-colors', label: 'Component Colors',    Page: ComponentColorsPage },
      { id: 'spacing',          label: 'Spacing/Round/Border',Page: SpacingPage },
      { id: 'icons',            label: 'Icons',               Page: IconsPage },
    ],
  },
  {
    label: '컴포넌트',
    // 2뎁스 — 용도별 서브그룹(접기/펼치기). 활성 항목이 든 서브그룹은 자동으로 펼쳐진다.
    subgroups: [
      {
        label: '액션',
        items: [
          { id: 'button',          label: 'Button',          Page: ButtonPage },
          { id: 'segment-control', label: 'Segment Control', Page: SegmentControlPage },
          { id: 'tool-bar',        label: 'Tool Bar',        Page: ToolBarPage },
        ],
      },
      {
        label: '입력',
        items: [
          { id: 'search-bar',  label: 'Search Bar',  Page: SearchBarPage },
          { id: 'input',       label: 'Input',       Page: InputPage },
          { id: 'textarea',    label: 'TextArea',    Page: TextAreaPage },
          { id: 'editor',      label: 'Editor',      Page: EditorPage },
          { id: 'select',      label: 'Select',      Page: SelectPage },
          { id: 'checkbox',    label: 'Checkbox',    Page: CheckboxPage },
          { id: 'radio',       label: 'Radio',       Page: RadioPage },
          { id: 'switch',      label: 'Switch',      Page: SwitchPage },
          { id: 'date-picker', label: 'Date Picker', Page: DatePickerPage },
          { id: 'condition-order-slot', label: 'Condition Order Slot', Page: ConditionOrderSlotPage },
        ],
      },
      {
        label: '폼 구성',
        items: [
          { id: 'label', label: 'Label', Page: LabelPage },
          { id: 'field', label: 'Field', Page: FieldPage },
        ],
      },
      {
        label: '내비게이션',
        items: [
          { id: 'tabs',       label: 'Tabs',       Page: TabsPage },
          { id: 'segmented-tabs', label: 'Segmented Tabs', Page: SegmentedTabsPage },
          { id: 'pagination', label: 'Pagination', Page: PaginationPage },
          { id: 'side-navigation', label: 'Side Navigation', Page: SideNavigationPage },
          { id: 'lnb', label: 'LNB Menu', Page: LnbPage },
          { id: 'gnb', label: 'GNB', Page: GnbPage },
          { id: 'stepper', label: 'Stepper', Page: StepperPage },
        ],
      },
      {
        label: '데이터 표시',
        items: [
          { id: 'table', label: 'Table', Page: TablePage },
          { id: 'tag',   label: 'Tag',  Page: TagPage },
          { id: 'chip',  label: 'Chip', Page: ChipPage },
          { id: 'avatar', label: 'Avatar', Page: AvatarPage },
          { id: 'tooltip-scrollbar', label: 'Tooltip / Scrollbar / Divider', Page: TooltipScrollbarPage },
          { id: 'accordion', label: 'Accordion', Page: AccordionPage },
        ],
      },
      {
        label: '오버레이·메뉴',
        items: [
          { id: 'modal',       label: 'Modal',       Page: ModalPage },
          { id: 'option-list', label: 'Option List', Page: OptionListPage },
          { id: 'upload-menu', label: 'Upload Menu', Page: UploadMenuPage },
        ],
      },
    ],
  },
  {
    // 레이아웃 — 템플릿보다 한 단위 큰 계층(사이트 구조: GNB·LNB·Main·Right Panel)
    label: '레이아웃',
    items: [
      { id: 'layout', label: 'Layout', Page: LayoutPage },
      { id: 'page', label: 'Page', Page: PagePage },
      { id: 'right-panel', label: 'Right Panel', Page: RightPanelPage },
    ],
  },
  {
    label: '템플릿',
    items: [
      { id: 'table-template', label: 'Table Template', Page: TableTemplatePage },
      { id: 'form-template', label: 'Form Template', Page: FormTemplatePage },
      { id: 'multi-step-form-template', label: 'Multi-step Form Template', Page: MultiStepFormTemplatePage },
      { id: 'side-nav-template', label: 'Side Navigation Template', Page: SideNavTemplatePage },
      { id: 'notice-template', label: 'Notice Writing Template', Page: NoticeTemplatePage },
      { id: 'job-position-template', label: 'Job Position Template', Page: JobPositionTemplatePage },
      { id: 'job-posting-template', label: 'Job Posting Template', Page: JobPostingTemplatePage },
      { id: 'screening-builder-template', label: 'Screening Builder Template', Page: ScreeningBuilderTemplatePage },
    ],
  },
  {
    // 페이지 — 템플릿을 실제 화면으로 조립한 실전 예제(페이지>템플릿>컴포넌트 계층의 최상위 단위)
    label: '페이지',
    items: [
      { id: 'send-history', label: '발송 이력', Page: SendHistoryPage },
      { id: 'bulk-send', label: '대량 메일/문자 발송', Page: BulkSendPage },
    ],
  },
  {
    label: '디자인시스템 규칙',
    items: [
      { id: 'getting-started', label: '시작 가이드',     Page: GettingStartedPage },
      { id: 'rule-overview',   label: '규칙 개요',       Page: RuleOverviewPage },
      { id: 'rule-foundation', label: 'Foundation 규칙', Page: RuleFoundationPage },
      { id: 'rule-components', label: '컴포넌트 규칙',    Page: RuleComponentsPage },
      { id: 'rule-templates',  label: '템플릿 규칙',      Page: RuleTemplatesPage },
      { id: 'rule-usage',      label: '규칙 사용 원장',   Page: RuleUsagePage },
      { id: 'customization',   label: '커스텀 가이드',    Page: CustomizationGuidePage },
    ],
  },
  {
    label: 'test',
    items: [
      { id: 'modal-test', label: '모달 테스트 구현', Page: ModalTestPage },
    ],
  },
];

// 그룹은 items(1뎁스) 또는 subgroups(2뎁스) 중 하나를 가진다 — 항목 평탄화는 둘 다 지원
const groupItems = (g) => g.items ?? g.subgroups.flatMap((s) => s.items);
const ALL_ITEMS = NAV_GROUPS.flatMap(groupItems);

// Page 셸 기반 페이지 — PageHeader/바디가 자체 패딩(20)을 가지므로 셸 pagePadding을 none으로(이중 패딩 방지)
const PAGE_SHELL_IDS = new Set(['send-history', 'bulk-send']);

// 사이드바 — DS Lnb 컴포넌트로 조립(도그푸딩, 2026-07-29 — site title은 헤더 로고가 대신하므로 숨김).
// NAV_GROUPS를 Lnb 데이터로 변환: items=1depth(아이콘 없음), subgroups=2depth 펼침 부모+sub 하위.
function Sidebar({ active, onSelect }) {
  const groups = NAV_GROUPS.map((g) => ({
    key: g.label || 'root',
    title: g.label || undefined,
    items: g.items
      ? // 1뎁스 단순 그룹(파운데이션·템플릿·규칙·테스트 등)은 아이콘 영역 없이 플레인하게(2026-07-29 지시)
        g.items.map((it) => ({ value: it.id, label: it.label, iconArea: false }))
      : g.subgroups.map((sub) => ({
          value: `sub:${sub.label}`,
          label: sub.label,
          children: sub.items.map((it) => ({ value: it.id, label: it.label })),
        })),
  }));
  // 활성 항목이 든 서브그룹은 처음부터 펼침(기존 자동 펼침 동작 유지)
  const initialExpanded = NAV_GROUPS.flatMap((g) => g.subgroups ?? [])
    .filter((s) => s.items.some((it) => it.id === active))
    .map((s) => `sub:${s.label}`);

  // AppLayout lnb 슬롯이 absolute 캔버스·우측 구분선을 제공하므로 Lnb만 반환한다(2026-07-30 도그푸딩)
  return (
    <Lnb
      width="100%"
      height="100%"
      groups={groups}
      value={active}
      onChange={onSelect}
      defaultExpanded={initialExpanded}
    />
  );
}

function isValidId(id) {
  return ALL_ITEMS.some((item) => item.id === id);
}

function getInitialId() {
  const id = window.location.hash.replace('#', '');
  return isValidId(id) ? id : 'home';
}

export default function App() {
  const [activeId, setActiveId] = useState(getInitialId);
  // 본문 스크롤 영역(ScrollArea 내부 뷰포트) — 페이지 전환 시 스크롤을 최상단으로 되돌리기 위해 참조
  const viewportRef = useRef(null);

  // 페이지가 바뀌면 본문 스크롤을 최상단으로 리셋(이전 페이지의 스크롤 위치가 남는 문제 방지)
  useEffect(() => {
    const el = viewportRef.current;
    if (el) {
      el.scrollTop = 0;
      el.scrollLeft = 0;
    }
  }, [activeId]);

  useEffect(() => {
    // 해시가 바뀌면 따라가되, 알 수 없는 해시면 현재 위치를 유지한다.
    // (typography로 강제 복귀시키면, 방금 navigate로 옮긴 페이지를 덮어쓰는 race가 생긴다)
    const onHashChange = () => {
      const id = window.location.hash.replace('#', '');
      setActiveId((prev) => (isValidId(id) ? id : prev));
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  function navigate(id) {
    window.location.hash = id;
    setActiveId(id);
  }

  // 숨은 라우트(데모 전용) — #layout-preview?…는 셸 없이 레이아웃 미리보기만 단독 렌더(새 창용).
  // activeId는 내비 목록 검증(getInitialId)에서 'home'으로 폴백되므로 원본 해시로 직접 판별한다.
  if (window.location.hash.startsWith('#layout-preview')) return <LayoutPreviewPage />;

  const { Page } = ALL_ITEMS.find((item) => item.id === activeId) ?? {};

  return (
    <NavContext.Provider value={{ navigate, groups: NAV_GROUPS }}>
      {/* 셸 = AppLayout 도그푸딩(2026-07-30) — GNB 64 + LNB 220 + Right Panel 미사용.
          콘텐츠 영역은 Page Container 정식 옵션 사용(2026-08-05 전환): 기본 standard(1200)+24,
          레이아웃 데모만 fluid, Page 셸 기반 페이지(자체 패딩 20)는 padding none으로 이중 패딩 방지.
          스크롤은 mainScroll(ScrollArea) + onMainViewport로 페이지 전환 시 최상단 리셋. */}
      <AppLayout
        height="100vh"
        lnbWidth="220"
        pageWidth={activeId === 'layout' ? 'fluid' : 'standard'}
        pagePadding={PAGE_SHELL_IDS.has(activeId) ? 'none' : '24'}
        onMainViewport={(el) => {
          viewportRef.current = el;
        }}
        gnb={
          /* GNB 그룹 구조 도그푸딩(2026-07-31) — 단일 fill 그룹(좌 로고 · 우 검색 셀렉트) */
          <Gnb>
            <GnbGroup fill justify="between">
              <div className="flex items-center gap-spacing-5">
                {/* 심볼 — font-icon-5 사각 + 흰 이니셜(임시 로고, 추후 브랜드 자산으로 교체 가능) */}
                <span className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-round-4 bg-font-icon-5 text-12 font-semibold text-font-icon-1">
                  DS
                </span>
                <h1 className="text-16 font-semibold text-font-icon-5">ATS Design System</h1>
                {/* 버전 배지 — package.json version 직접 참조(하드코딩 금지, 2026-07-28) */}
                <Tag color="gray">v{pkgVersion}</Tag>
              </div>
              {/* 전역 컴포넌트 검색 — 선택 즉시 해당 데모 페이지로 이동(선택 후 트리거는 비움) */}
              <Select
                width={240}
                searchable
                placeholder="컴포넌트 검색"
                searchPlaceholder="이름으로 검색"
                options={ALL_ITEMS.map((it) => ({ value: it.id, label: it.label }))}
                value={null}
                onChange={(e) => {
                  window.location.hash = e.target.value;
                }}
              />
            </GnbGroup>
          </Gnb>
        }
        lnb={<Sidebar active={activeId} onSelect={navigate} />}
      >
        {/* 폭·좌우 패딩·스크롤은 AppLayout(Page Container)이 담당 — 수제 래퍼 제거(2026-08-05).
            페이지 하나가 렌더 중 throw해도 셸·메뉴는 유지되도록 ErrorBoundary로 감싼다.
            resetKey=activeId: 다른 메뉴로 이동하면 에러가 자동 해제된다. */}
        <ErrorBoundary resetKey={activeId}>
          <Suspense
            fallback={<div className="py-spacing-10 text-14 text-font-icon-3">불러오는 중…</div>}
          >
            {Page && <Page />}
          </Suspense>
        </ErrorBoundary>
      </AppLayout>
    </NavContext.Provider>
  );
}
