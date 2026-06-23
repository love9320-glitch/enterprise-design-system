import { useEffect, useRef, useState } from 'react';
import {
  TypographyPage, BaseColorsPage, FontIconColorsPage,
  SpacingPage, IconsPage, ButtonPage, SegmentControlPage,
  SearchBarPage, InputPage, SelectPage, TagPage, CheckboxPage, RadioPage, SwitchPage, TabsPage, OptionListPage,
  PaginationPage, TablePage, TableTemplatePage, ModalPage, EditorPage, DatePickerPage,
} from './pages/index';
import { ScrollArea } from './components/ScrollArea';

const NAV_GROUPS = [
  {
    label: '파운데이션',
    items: [
      { id: 'typography',       label: 'Typography',          Page: TypographyPage },
      { id: 'colors',           label: 'Base Colors',         Page: BaseColorsPage },
      { id: 'font-icon-colors', label: 'Font/Icon Colors',    Page: FontIconColorsPage },
      { id: 'spacing',          label: 'Spacing/Round/Border',Page: SpacingPage },
      { id: 'icons',            label: 'Icons',               Page: IconsPage },
    ],
  },
  {
    label: '컴포넌트',
    items: [
      { id: 'button',     label: 'Button',     Page: ButtonPage },
      { id: 'segment-control', label: 'Segment Control', Page: SegmentControlPage },
      { id: 'search-bar', label: 'Search Bar', Page: SearchBarPage },
      { id: 'input',      label: 'Input',      Page: InputPage },
      { id: 'select',      label: 'Select',      Page: SelectPage },
      { id: 'tag',         label: 'Tag / Tooltip / Scrollbar', Page: TagPage },
      { id: 'checkbox',    label: 'Checkbox',    Page: CheckboxPage },
      { id: 'radio',       label: 'Radio',       Page: RadioPage },
      { id: 'switch',      label: 'Switch',      Page: SwitchPage },
      { id: 'tabs',        label: 'Tabs',        Page: TabsPage },
      { id: 'option-list', label: 'Option List', Page: OptionListPage },
      { id: 'date-picker', label: 'Date Picker', Page: DatePickerPage },
      { id: 'pagination',  label: 'Pagination',  Page: PaginationPage },
      { id: 'table',       label: 'Table',       Page: TablePage },
      { id: 'modal',       label: 'Modal',       Page: ModalPage },
      { id: 'editor',      label: 'Editor',      Page: EditorPage },
    ],
  },
  {
    label: '템플릿',
    items: [
      { id: 'table-template', label: 'Table Template', Page: TableTemplatePage },
    ],
  },
];

const ALL_ITEMS = NAV_GROUPS.flatMap((g) => g.items);

function Sidebar({ active, onSelect }) {
  return (
    <aside className="relative w-56 shrink-0 border-r border-gray-200">
      <ScrollArea className="absolute inset-0" contentClassName="h-full px-spacing-6 py-spacing-7">
      {NAV_GROUPS.map((group) => (
        <div key={group.label} className="mb-spacing-7">
          <p className="mb-spacing-4 px-spacing-4 text-xs font-semibold uppercase tracking-wide text-font-icon-3">
            {group.label}
          </p>
          <ul className="space-y-spacing-3">
            {group.items.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onSelect(item.id)}
                  className={`w-full cursor-pointer rounded-round-4 px-spacing-4 py-spacing-4 text-left text-sm transition-colors ${
                    active === item.id
                      ? 'bg-gray-100 font-semibold text-font-icon-5'
                      : 'text-font-icon-4 hover:bg-gray-50 hover:text-font-icon-5'
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
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
  return isValidId(id) ? id : 'typography';
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
            {Page && <Page />}
          </ScrollArea>
        </main>
      </div>
    </div>
  );
}
