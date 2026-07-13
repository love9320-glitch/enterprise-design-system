import { Fragment } from 'react';
// `import * as`(배럴)는 lucide 전체(1,000개+ ≈ 620KB)를 번들에 끌어들여 트리셰이킹을 깬다
// (2026-07-07 감사 — 메인 번들 비대의 주범). 갤러리에 노출하는 아이콘만 named import한다.
import {
  Home, Menu, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowLeft, ArrowRight,
  ArrowUp, ArrowDown, MoreHorizontal, MoreVertical, ExternalLink, CornerDownRight, Plus, Minus, Edit, Pencil,
  Trash2, Copy, Save, Download, Upload, Share2, RefreshCw, Search, Filter, Settings,
  SlidersHorizontal, Check, X, CheckCircle, XCircle, AlertTriangle, AlertCircle, Info, HelpCircle, Loader,
  Bell, BellOff, ShieldCheck, ShieldAlert, Mail, MessageCircle, MessageSquare, Phone, PhoneCall, Send,
  Inbox, AtSign, File, FileText, Folder, FolderOpen, Image, Paperclip, Database, HardDrive,
  Archive, ClipboardList, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music, Video,
  Camera, Mic, User, Users, UserPlus, UserCheck, LogIn, LogOut, Lock, Unlock,
  Shield, Key, ShoppingCart, ShoppingBag, CreditCard, DollarSign, Tag, Gift, Package, Truck,
  Grid, List, LayoutGrid, Columns, PanelLeft, Maximize, Minimize, Eye, EyeOff, Star,
  Heart, Bookmark, Calendar, CalendarDays, CalendarCheck, Clock, Timer, History, LoaderCircle, LoaderPinwheel,
} from 'lucide-react';
import { iconTokens } from '../../src/tokens/index';
import { Divider } from '../../src/components/Divider';

// 이름 → 컴포넌트 조회 맵(카테고리 정의는 문자열 이름을 유지)
const LucideIcons = {
  Home, Menu, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowLeft, ArrowRight,
  ArrowUp, ArrowDown, MoreHorizontal, MoreVertical, ExternalLink, CornerDownRight, Plus, Minus, Edit, Pencil,
  Trash2, Copy, Save, Download, Upload, Share2, RefreshCw, Search, Filter, Settings,
  SlidersHorizontal, Check, X, CheckCircle, XCircle, AlertTriangle, AlertCircle, Info, HelpCircle, Loader,
  Bell, BellOff, ShieldCheck, ShieldAlert, Mail, MessageCircle, MessageSquare, Phone, PhoneCall, Send,
  Inbox, AtSign, File, FileText, Folder, FolderOpen, Image, Paperclip, Database, HardDrive,
  Archive, ClipboardList, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music, Video,
  Camera, Mic, User, Users, UserPlus, UserCheck, LogIn, LogOut, Lock, Unlock,
  Shield, Key, ShoppingCart, ShoppingBag, CreditCard, DollarSign, Tag, Gift, Package, Truck,
  Grid, List, LayoutGrid, Columns, PanelLeft, Maximize, Minimize, Eye, EyeOff, Star,
  Heart, Bookmark, Calendar, CalendarDays, CalendarCheck, Clock, Timer, History, LoaderCircle, LoaderPinwheel,
};

const ICON_CATEGORIES = [
  {
    label: 'Navigation',
    names: [
      'Home', 'Menu', 'ChevronDown', 'ChevronUp', 'ChevronLeft', 'ChevronRight',
      'ChevronsLeft', 'ChevronsRight',
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
    <section className="mx-auto max-w-5xl px-spacing-7 py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-20 font-semibold">Icons</h2>
      <p className="mb-spacing-8 text-14 text-font-icon-4">
        Lucide 아이콘(lucide-react) 기반 아이콘 시스템 — 기본 사이즈{' '}
        <code className="text-font-icon-3">{iconTokens.size}×{iconTokens.size}</code>,
        선 두께(strokeWidth){' '}
        <code className="text-font-icon-3">{iconTokens.strokeWidth}</code>의 윤곽선(stroke)
        형태로 표시하며,<br />기본 색상은 폰트 기본 색상과 동일한 시멘틱 토큰{' '}
        <code className="text-font-icon-3">font / icon color 5</code> (
        <code className="text-font-icon-3">{iconTokens.color}</code>)를 그대로 참조합니다. <br/>
        자주 사용하는 아이콘을 의미별 카테고리로 분류했습니다.
      </p>

      {ICON_CATEGORIES.map((category, i) => (
        <Fragment key={category.label}>
          {i > 0 && <Divider className="mt-spacing-9 mb-spacing-8" />}
          <div className={i === 0 ? 'mb-spacing-9' : undefined}>
          <h3 className="mb-spacing-5 text-15 font-semibold text-font-icon-5">
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
        </Fragment>
      ))}
    </section>
  );
}
