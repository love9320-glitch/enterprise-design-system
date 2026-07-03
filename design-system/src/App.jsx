import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import {
  HomePage,
  TypographyPage, BaseColorsPage, FontIconColorsPage,
  SpacingPage, IconsPage, ButtonPage, SegmentControlPage,
  ComponentColorsPage,
  SearchBarPage, InputPage, TextAreaPage, SelectPage, LabelPage, FieldPage, TagPage, CheckboxPage, RadioPage, SwitchPage, TabsPage, OptionListPage,
  UploadMenuPage,
  PaginationPage, TablePage, TableTemplatePage, FormTemplatePage, ModalPage, DatePickerPage,
  RuleOverviewPage, RuleFoundationPage, RuleComponentsPage, RuleTemplatesPage, RuleUsagePage,
} from './pages/index';
import { ScrollArea } from './components/ScrollArea';
import { ErrorBoundary } from './components/ErrorBoundary';

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
        ],
      },
      {
        label: '입력',
        items: [
          { id: 'search-bar',  label: 'Search Bar',  Page: SearchBarPage },
          { id: 'input',       label: 'Input',       Page: InputPage },
          { id: 'textarea',    label: 'TextArea',    Page: TextAreaPage },
          { id: 'select',      label: 'Select',      Page: SelectPage },
          { id: 'checkbox',    label: 'Checkbox',    Page: CheckboxPage },
          { id: 'radio',       label: 'Radio',       Page: RadioPage },
          { id: 'switch',      label: 'Switch',      Page: SwitchPage },
          { id: 'date-picker', label: 'Date Picker', Page: DatePickerPage },
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
          { id: 'pagination', label: 'Pagination', Page: PaginationPage },
        ],
      },
      {
        label: '데이터 표시',
        items: [
          { id: 'table', label: 'Table', Page: TablePage },
          { id: 'tag',   label: 'Tag / Tooltip / Scrollbar', Page: TagPage },
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
      {
        label: '에디터',
        items: [{ id: 'editor', label: 'Editor', Page: EditorPage }],
      },
    ],
  },
  {
    label: '템플릿',
    items: [
      { id: 'table-template', label: 'Table Template', Page: TableTemplatePage },
      { id: 'form-template', label: 'Form Template', Page: FormTemplatePage },
      { id: 'notice-template', label: 'Notice Writing Template', Page: NoticeTemplatePage },
    ],
  },
  {
    label: '디자인시스템 규칙',
    items: [
      { id: 'rule-overview',   label: '규칙 개요',       Page: RuleOverviewPage },
      { id: 'rule-foundation', label: 'Foundation 규칙', Page: RuleFoundationPage },
      { id: 'rule-components', label: '컴포넌트 규칙',    Page: RuleComponentsPage },
      { id: 'rule-templates',  label: '템플릿 규칙',      Page: RuleTemplatesPage },
      { id: 'rule-usage',      label: '규칙 사용 원장',   Page: RuleUsagePage },
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

// 1뎁스 메뉴 항목 버튼 (서브그룹 하위 항목은 indent로 들여쓴다)
function NavItem({ item, active, onSelect, indent = false }) {
  return (
    <li>
      <button
        onClick={() => onSelect(item.id)}
        className={`w-full cursor-pointer rounded-round-4 py-spacing-4 text-left text-sm transition-colors ${
          indent ? 'pl-spacing-9 pr-spacing-4' : 'px-spacing-4'
        } ${
          active === item.id
            ? 'bg-gray-100 font-semibold text-font-icon-5'
            : 'text-font-icon-4 hover:bg-gray-50 hover:text-font-icon-5'
        }`}
      >
        {item.label}
      </button>
    </li>
  );
}

function Sidebar({ active, onSelect }) {
  // 서브그룹 접기/펼치기 — 수동 토글 상태. 미지정 시 활성 항목이 든 서브그룹만 자동 펼침.
  // 활성 항목이 바뀌면 그 항목이 든 서브그룹의 수동 '접힘'은 해제한다(선택했는데 접혀 있는 모순 방지) — 렌더 시 파생.
  const [openMap, setOpenMap] = useState({});
  const [prevActive, setPrevActive] = useState(active);
  if (active !== prevActive) {
    setPrevActive(active);
    const sub = NAV_GROUPS.flatMap((g) => g.subgroups ?? []).find((s) => s.items.some((it) => it.id === active));
    if (sub && openMap[sub.label] === false) setOpenMap((m) => ({ ...m, [sub.label]: true }));
  }
  const isOpen = (sub) => openMap[sub.label] ?? sub.items.some((it) => it.id === active);
  const toggle = (sub) => setOpenMap((m) => ({ ...m, [sub.label]: !isOpen(sub) }));

  return (
    <aside className="relative w-56 shrink-0 border-r border-gray-200">
      <ScrollArea className="absolute inset-0" contentClassName="h-full px-spacing-6 py-spacing-7">
      {NAV_GROUPS.map((group) => (
        <div key={group.label || groupItems(group)[0].id} className="mb-spacing-9">
          {group.label && (
            <p className="mb-spacing-4 px-spacing-4 text-xs font-semibold uppercase tracking-wide text-font-icon-2">
              {group.label}
            </p>
          )}
          {group.items && (
            <ul className="space-y-spacing-3">
              {group.items.map((item) => (
                <NavItem key={item.id} item={item} active={active} onSelect={onSelect} />
              ))}
            </ul>
          )}
          {group.subgroups && (
            <ul className="space-y-spacing-3">
              {group.subgroups.map((sub) => {
                const open = isOpen(sub);
                return (
                  <li key={sub.label}>
                    <button
                      onClick={() => toggle(sub)}
                      aria-expanded={open}
                      className="flex w-full cursor-pointer items-center gap-spacing-3 rounded-round-4 px-spacing-4 py-spacing-4 text-left text-sm text-font-icon-5 transition-colors hover:bg-gray-50"
                    >
                      {open ? (
                        <ChevronDown size={14} strokeWidth={1.8} className="shrink-0 text-font-icon-3" />
                      ) : (
                        <ChevronRight size={14} strokeWidth={1.8} className="shrink-0 text-font-icon-3" />
                      )}
                      {sub.label}
                    </button>
                    {open && (
                      <ul className="mt-spacing-3 space-y-spacing-3">
                        {sub.items.map((item) => (
                          <NavItem key={item.id} item={item} active={active} onSelect={onSelect} indent />
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ))}
      </ScrollArea>
    </aside>
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

  const { Page } = ALL_ITEMS.find((item) => item.id === activeId) ?? {};

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <header className="flex shrink-0 items-center border-b border-gray-200 px-spacing-7 py-spacing-6">
        <h1 className="text-lg font-semibold">Design System</h1>
      </header>

      {/* min-h-0: 헤더 아래 영역이 남은 높이만큼만 차지하고, 그 안에서 LNB·본문이 각각 스크롤되도록 한다. */}
      <div className="flex min-h-0 flex-1">
        <Sidebar active={activeId} onSelect={navigate} />
        {/* min-w-0 / min-h-0: flex 아이템 기본 min-width/height:auto 때문에 콘텐츠(테이블)보다
            작아지지 못하는 것을 풀어, ScrollArea가 컨테이너 크기에 맞춰 줄고 가로·세로 스크롤이
            ScrollArea 안에서만 일어나게 한다. min-h-0가 없으면 긴 콘텐츠가 main을 밀어 올려
            root(h-screen)를 넘치고, 내부 focusable 요소로 포커스가 갈 때 전체 화면이 위로 밀린다. */}
        {/* relative + ScrollArea를 absolute inset-0로: flex로 stretch된 main은 CSS상 height가 auto라
            자식 h-full이 콘텐츠만큼 늘어나 root(h-screen)를 넘치고, 내부 focusable로 포커스가 갈 때
            전체 화면이 위로 밀린다. ScrollArea를 main 박스(inset-0)에 절대 고정해 explicit height를
            주면 내부 스크롤이 ScrollArea 안에서만 일어난다. */}
        <main className="relative min-h-0 min-w-0 flex-1 overflow-hidden">
          <ScrollArea
            className="absolute inset-0"
            contentClassName="h-full"
            onViewport={(el) => {
              viewportRef.current = el;
            }}
          >
            {/* 페이지 하나가 렌더 중 throw해도 셸·메뉴는 유지되도록 ErrorBoundary로 감싼다.
                resetKey=activeId: 다른 메뉴로 이동하면 에러가 자동 해제된다. */}
            <ErrorBoundary resetKey={activeId}>
              <Suspense
                fallback={
                  <div className="px-spacing-7 py-spacing-10 text-14 text-font-icon-3">
                    불러오는 중…
                  </div>
                }
              >
                {Page && <Page />}
              </Suspense>
            </ErrorBoundary>
          </ScrollArea>
        </main>
      </div>
    </div>
  );
}
