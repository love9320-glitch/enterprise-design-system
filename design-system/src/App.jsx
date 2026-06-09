import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import {
  TypographyPage, BaseColorsPage, FontIconColorsPage,
  SpacingPage, IconsPage, ButtonPage,
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
      { id: 'button', label: 'Button', Page: ButtonPage },
    ],
  },
];

const ALL_ITEMS = NAV_GROUPS.flatMap((g) => g.items);

function Sidebar({ active, onSelect }) {
  return (
    <nav className="w-56 shrink-0 border-r border-gray-200 px-spacing-6 py-spacing-7 dark:border-gray-800">
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
                      ? 'bg-gray-100 font-semibold text-font-icon-5 dark:bg-gray-800 dark:text-white'
                      : 'text-font-icon-4 hover:bg-gray-50 hover:text-font-icon-5 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-white'
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
  const [dark, setDark] = useState(false);
  const [activeId, setActiveId] = useState(getHashId);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

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
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b border-gray-200 px-spacing-7 py-spacing-6 dark:border-gray-800">
        <h1 className="text-lg font-semibold">Design System</h1>
        <button
          onClick={() => setDark((v) => !v)}
          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-round-4 border border-gray-200 text-font-icon-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          aria-label="다크모드 전환"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </header>

      <div className="flex">
        <Sidebar active={activeId} onSelect={navigate} />
        <main className="flex-1">{Page && <Page />}</main>
      </div>
    </div>
  );
}
