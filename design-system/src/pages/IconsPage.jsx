import * as LucideIcons from 'lucide-react';
import { iconTokens } from '../tokens/index';

const ICON_CATEGORIES = [
  {
    label: 'Navigation',
    names: [
      'Home', 'Menu', 'ChevronDown', 'ChevronUp', 'ChevronLeft', 'ChevronRight',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'MoreHorizontal', 'MoreVertical', 'ExternalLink', 'CornerDownRight',
    ],
  },
  {
    label: 'Actions',
    names: [
      'Plus', 'Minus', 'Edit', 'Pencil', 'Trash2', 'Copy', 'Save',
      'Download', 'Upload', 'Share2', 'RefreshCw', 'Search', 'Filter',
      'Settings', 'SlidersHorizontal', 'Check', 'X',
    ],
  },
  {
    label: 'Status & Feedback',
    names: [
      'CheckCircle', 'XCircle', 'AlertTriangle', 'AlertCircle', 'Info',
      'HelpCircle', 'Loader', 'Bell', 'BellOff', 'ShieldCheck', 'ShieldAlert',
    ],
  },
  {
    label: 'Communication',
    names: [
      'Mail', 'MessageCircle', 'MessageSquare', 'Phone', 'PhoneCall',
      'Send', 'Inbox', 'AtSign',
    ],
  },
  {
    label: 'Files & Data',
    names: [
      'File', 'FileText', 'Folder', 'FolderOpen', 'Image', 'Paperclip',
      'Database', 'HardDrive', 'Archive', 'ClipboardList',
    ],
  },
  {
    label: 'Media',
    names: [
      'Play', 'Pause', 'SkipBack', 'SkipForward', 'Volume2', 'VolumeX',
      'Music', 'Video', 'Camera', 'Mic',
    ],
  },
  {
    label: 'User & Account',
    names: [
      'User', 'Users', 'UserPlus', 'UserCheck', 'LogIn', 'LogOut',
      'Lock', 'Unlock', 'Shield', 'Key',
    ],
  },
  {
    label: 'Commerce',
    names: [
      'ShoppingCart', 'ShoppingBag', 'CreditCard', 'DollarSign', 'Tag',
      'Gift', 'Package', 'Truck',
    ],
  },
  {
    label: 'Layout & UI',
    names: [
      'Grid', 'List', 'LayoutGrid', 'Columns', 'PanelLeft', 'Maximize',
      'Minimize', 'Eye', 'EyeOff', 'Star', 'Heart', 'Bookmark',
    ],
  },
  {
    label: 'Time & Calendar',
    names: [
      'Calendar', 'CalendarDays', 'CalendarCheck', 'Clock', 'Timer', 'History',
    ],
  },
  {
    label: 'Loading & Spinner',
    names: ['Loader', 'LoaderCircle', 'LoaderPinwheel'],
  },
];

export function IconsPage() {
  return (
    <section className="mx-auto max-w-3xl px-spacing-7 py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-lg font-semibold">Icons</h2>
      <p className="mb-spacing-8 text-sm text-font-icon-4">
        Lucide 아이콘(lucide-react) 기반 아이콘 시스템 — 기본 사이즈{' '}
        <code className="text-font-icon-3">{iconTokens.size}×{iconTokens.size}</code>,
        선 두께(strokeWidth){' '}
        <code className="text-font-icon-3">{iconTokens.strokeWidth}</code>의 윤곽선(stroke)
        형태로 표시하며, 기본 색상은 폰트 기본 색상과 동일한 시멘틱 토큰{' '}
        <code className="text-font-icon-3">font / icon color 5</code> (
        <code className="text-font-icon-3">{iconTokens.color}</code>)를 그대로 참조합니다.
        자주 사용하는 아이콘을 의미별 카테고리로 분류했습니다.
      </p>

      {ICON_CATEGORIES.map((category) => (
        <div key={category.label} className="mb-spacing-9">
          <h3 className="mb-spacing-5 text-xs font-semibold uppercase tracking-wide text-font-icon-3">
            {category.label}
          </h3>
          <div className="grid grid-cols-3 gap-spacing-7 sm:grid-cols-6">
            {category.names.map((name) => {
              const Icon = LucideIcons[name];
              return (
                <div
                  key={name}
                  className="flex flex-col items-center gap-spacing-4 rounded-round-4 border border-gray-200 p-spacing-6"
                >
                  <Icon
                    size={iconTokens.size}
                    strokeWidth={iconTokens.strokeWidth}
                    className="text-font-icon-5"
                  />
                  <p className="text-xs text-font-icon-3">{name}</p>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
