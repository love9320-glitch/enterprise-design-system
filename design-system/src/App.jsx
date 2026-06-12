import { useEffect, useState } from 'react';
import {
  TypographyPage, BaseColorsPage, FontIconColorsPage,
  SpacingPage, IconsPage, ButtonPage,
  SearchBarPage, InputPage, SelectPage, TagPage, OptionListPage,
} from './pages/index';

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
      { id: 'search-bar', label: 'Search Bar', Page: SearchBarPage },
      { id: 'input',      label: 'Input',      Page: InputPage },
      { id: 'select',      label: 'Select',      Page: SelectPage },
      { id: 'tag',         label: 'Tag',         Page: TagPage },
      { id: 'option-list', label: 'Option List', Page: OptionListPage },
    ],
  },
];

const ALL_ITEMS = NAV_GROUPS.flatMap((g) => g.items);

function Sidebar({ active, onSelect }) {
  return (
    <nav className="w-56 shrink-0 border-r border-gray-200 px-spacing-6 py-spacing-7">
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
    </nav>
  );
}

function getHashId() {
  const id = window.location.hash.replace('#', '');
  return ALL_ITEMS.some((item) => item.id === id) ? id : 'typography';
}

export default function App() {
  const [activeId, setActiveId] = useState(getHashId);

  useEffect(() => {
    const onHashChange = () => setActiveId(getHashId());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  function navigate(id) {
    window.location.hash = id;
    setActiveId(id);
  }

  const { Page } = ALL_ITEMS.find((item) => item.id === activeId) ?? {};

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center border-b border-gray-200 px-spacing-7 py-spacing-6">
        <h1 className="text-lg font-semibold">Design System</h1>
      </header>

      <div className="flex flex-1">
        <Sidebar active={activeId} onSelect={navigate} />
        <main className="flex-1">{Page && <Page />}</main>
      </div>
    </div>
  );
}
