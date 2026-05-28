import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Sidebar({ items, collapsed, onToggle, activeId, onSelect, logo, bottomItems }) {
  return (
    <aside
      className={[
        'flex flex-col h-full bg-gray-900 dark:bg-gray-950 text-white',
        'transition-all duration-300 ease-in-out',
        collapsed ? 'w-16' : 'w-60',
        'flex-shrink-0',
      ].join(' ')}
    >
      {/* Logo */}
      <div className={`flex items-center h-16 px-4 border-b border-gray-700/50 ${collapsed ? 'justify-center' : 'gap-3'}`}>
        <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">E</span>
        </div>
        {!collapsed && (
          <span className="font-semibold text-sm tracking-wide truncate">{logo || 'Enterprise'}</span>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-0.5 px-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === activeId;
          const isGroup = item.type === 'group';

          if (isGroup) {
            return !collapsed ? (
              <p key={item.id} className="px-2 pt-4 pb-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {item.label}
              </p>
            ) : (
              <div key={item.id} className="border-t border-gray-700/50 my-2" />
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onSelect?.(item.id)}
              title={collapsed ? item.label : undefined}
              className={[
                'w-full flex items-center rounded-lg transition-colors duration-150',
                'focus:outline-none focus:ring-2 focus:ring-brand-500/50',
                collapsed ? 'justify-center h-10 w-10 mx-auto' : 'gap-3 px-3 py-2.5',
                isActive
                  ? 'bg-brand-600 text-white'
                  : 'text-gray-400 hover:bg-gray-700/60 hover:text-white',
              ].join(' ')}
            >
              {Icon && <Icon size={18} className="flex-shrink-0" />}
              {!collapsed && (
                <span className="text-sm font-medium truncate flex-1 text-left">{item.label}</span>
              )}
              {!collapsed && item.badge != null && (
                <span className={`ml-auto text-xs font-semibold px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-gray-700 text-gray-300'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Items */}
      {bottomItems && (
        <div className="py-2 px-2 border-t border-gray-700/50 space-y-0.5">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onSelect?.(item.id)}
                title={collapsed ? item.label : undefined}
                className={[
                  'w-full flex items-center rounded-lg transition-colors text-gray-400 hover:bg-gray-700/60 hover:text-white',
                  collapsed ? 'justify-center h-10 w-10 mx-auto' : 'gap-3 px-3 py-2.5',
                ].join(' ')}
              >
                {Icon && <Icon size={18} className="flex-shrink-0" />}
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            );
          })}
        </div>
      )}

      {/* Collapse toggle */}
      <div className="p-3 border-t border-gray-700/50">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center h-8 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-gray-700/50 transition-colors focus:outline-none"
        >
          {collapsed ? <ChevronRight size={16} /> : (
            <span className="flex items-center gap-2 text-xs text-gray-500">
              <ChevronLeft size={16} /> 접기
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
