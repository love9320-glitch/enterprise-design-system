import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, SquareStack, Type, CreditCard, Tag, TableProperties,
  Layers, PanelLeft, AlignJustify, Settings, HelpCircle, TrendingUp,
  Users, ShoppingCart, DollarSign, ArrowUpRight, Search, Mail, Lock, AtSign,
  Plus, Download, Trash2, Edit2, Eye, Send, Check, X as XIcon, ALargeSmall,
} from 'lucide-react';
import { Button } from './components/Button.jsx';
import { Input } from './components/Input.jsx';
import { Card, CardHeader, CardBody, CardFooter } from './components/Card.jsx';
import { Badge } from './components/Badge.jsx';
import { Table } from './components/Table.jsx';
import { Modal } from './components/Modal.jsx';
import { Sidebar } from './components/Sidebar.jsx';
import { Header } from './components/Header.jsx';

const SECTIONS = [
  { id: 'overview',  label: 'Overview',   icon: LayoutDashboard },
  { id: 'buttons',   label: 'Button',     icon: SquareStack, type: 'group', groupLabel: '컴포넌트' },
  { id: 'buttons',   label: 'Button',     icon: SquareStack },
  { id: 'inputs',    label: 'Input',      icon: Type },
  { id: 'cards',     label: 'Card',       icon: CreditCard },
  { id: 'badges',    label: 'Badge',      icon: Tag },
  { id: 'tables',    label: 'Table',      icon: TableProperties },
  { id: 'modals',    label: 'Modal',      icon: Layers },
  { id: 'sidebar',   label: 'Sidebar',    icon: PanelLeft },
  { id: 'header',    label: 'Header',     icon: AlignJustify },
];

const NAV_ITEMS = [
  { id: 'overview',    label: 'Overview',    icon: LayoutDashboard },
  { id: 'group1',      label: '파운데이션',  type: 'group' },
  { id: 'typography',  label: 'Typography',  icon: ALargeSmall },
  { id: 'group2',      label: '컴포넌트',    type: 'group' },
  { id: 'buttons',     label: 'Button',      icon: SquareStack },
  { id: 'inputs',      label: 'Input',       icon: Type },
  { id: 'cards',       label: 'Card',        icon: CreditCard },
  { id: 'badges',      label: 'Badge',       icon: Tag },
  { id: 'tables',      label: 'Table',       icon: TableProperties },
  { id: 'modals',      label: 'Modal',       icon: Layers },
  { id: 'sidebar',     label: 'Sidebar',     icon: PanelLeft },
  { id: 'header',      label: 'Header',      icon: AlignJustify },
];

const BOTTOM_ITEMS = [
  { id: 'settings', label: '설정', icon: Settings },
  { id: 'help',     label: '도움말', icon: HelpCircle },
];

/* ───────── Sample data ───────── */
const TABLE_COLS = [
  { key: 'name',    label: '사용자명', sortable: true },
  { key: 'email',   label: '이메일',  sortable: true },
  { key: 'role',    label: '역할',    sortable: true, render: (v) => (
    <Badge variant={v === 'Admin' ? 'blue' : v === 'Editor' ? 'purple' : 'gray'} size="sm">{v}</Badge>
  )},
  { key: 'status',  label: '상태', align: 'center', render: (v) => (
    <Badge variant={v === 'Active' ? 'green' : 'red'} dot size="sm">{v === 'Active' ? '활성' : '비활성'}</Badge>
  )},
  { key: 'joined',  label: '가입일', sortable: true, align: 'right' },
  { key: 'actions', label: '', align: 'center', render: (_, row) => (
    <div className="flex items-center justify-center gap-1">
      <button className="p-1.5 rounded text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/30 transition-colors"><Eye size={14} /></button>
      <button className="p-1.5 rounded text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors"><Edit2 size={14} /></button>
      <button className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"><Trash2 size={14} /></button>
    </div>
  )},
];

const TABLE_DATA = [
  { name: '김민준', email: 'minjun@company.com', role: 'Admin',  status: 'Active',   joined: '2024-01-15' },
  { name: '이서연', email: 'seoyeon@company.com', role: 'Editor', status: 'Active',   joined: '2024-02-20' },
  { name: '박지훈', email: 'jihun@company.com',   role: 'Viewer', status: 'Inactive', joined: '2024-03-05' },
  { name: '최유나', email: 'yuna@company.com',    role: 'Editor', status: 'Active',   joined: '2024-03-18' },
  { name: '정도현', email: 'dohyun@company.com',  role: 'Viewer', status: 'Active',   joined: '2024-04-02' },
];

/* ───────── Section components ───────── */
function SectionTitle({ title, desc }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
      {desc && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{desc}</p>}
    </div>
  );
}

function DemoBlock({ title, children }) {
  return (
    <div className="mb-8">
      <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">{title}</p>
      {children}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, change, color }) {
  return (
    <Card variant="default" className="flex-1 min-w-0">
      <CardBody>
        <div className="flex items-start justify-between">
          <div className={`p-2.5 rounded-lg ${color}`}>
            <Icon size={20} className="text-white" />
          </div>
          <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <ArrowUpRight size={13} />{change}
          </span>
        </div>
        <p className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{label}</p>
      </CardBody>
    </Card>
  );
}

/* ───────── Sections ───────── */
function OverviewSection() {
  return (
    <>
      <SectionTitle title="Enterprise Design System" desc="블루 계열 전문 대시보드 UI 컴포넌트 라이브러리" />
      <div className="flex flex-wrap gap-4 mb-8">
        <StatCard icon={DollarSign}    label="이번 달 매출"   value="₩82,350,000" change="+12.5%" color="bg-brand-600" />
        <StatCard icon={Users}         label="활성 사용자"    value="2,840"        change="+8.1%"  color="bg-purple-500" />
        <StatCard icon={ShoppingCart}  label="신규 주문"      value="1,293"        change="+23.4%" color="bg-emerald-500" />
        <StatCard icon={TrendingUp}    label="전환율"         value="4.6%"         change="+1.2%"  color="bg-amber-500" />
      </div>
      <Card variant="default">
        <CardHeader title="사용자 목록" description="최근 등록된 팀 구성원" action={<Button size="24" leftIcon={Plus}>사용자 추가</Button>} />
        <CardBody className="!px-0 !py-0">
          <Table columns={TABLE_COLS} data={TABLE_DATA} />
        </CardBody>
      </Card>
    </>
  );
}

/* ── Figma 디자인 시스템 Typography 섹션 ── */
const BODY_SCALE = [
  { label: 'main / regular 12/20',  cls: 'text-body-xs',      semi: 'text-body-xs-semi' },
  { label: 'main / regular 13/22',  cls: 'text-body-sm',      semi: 'text-body-sm-semi' },
  { label: 'main / regular 14/24',  cls: 'text-body-base',    semi: 'text-body-base-semi' },
  { label: 'main / regular 16/28',  cls: 'text-body-md',      semi: 'text-body-md-semi' },
  { label: 'main / regular 18/30',  cls: 'text-body-lg',      semi: 'text-body-lg-semi' },
  { label: 'main / regular 20/32',  cls: 'text-body-xl',      semi: 'text-body-xl-semi' },
];

const COMP_SCALE = [
  { label: 'components / regular 12/18', cls: 'text-comp-xs',   semi: 'text-comp-xs-semi' },
  { label: 'components / regular 14/20', cls: 'text-comp-sm',   semi: 'text-comp-sm-semi' },
  { label: 'components / regular 16/24', cls: 'text-comp-base', semi: 'text-comp-base-semi' },
];

function TypographySection() {
  const sample = '설정 화면으로 이동';
  return (
    <>
      <SectionTitle title="Typography" desc="Pretendard 기반 Figma 폰트 시스템 — 본문용 / 컴포넌트용 스케일" />

      <DemoBlock title="본문용 폰트 (main body)">
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {BODY_SCALE.map(({ label, cls, semi }) => (
            <div key={label} className="grid grid-cols-[220px_1fr_1fr] items-center py-4 gap-6">
              <span className="text-comp-xs text-gray-400 dark:text-gray-500 font-mono">{label}</span>
              <span className={`${cls} text-gray-900 dark:text-gray-100`}>{sample}</span>
              <span className={`${semi} text-gray-900 dark:text-gray-100`}>{sample}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-[220px_1fr_1fr] text-comp-xs text-gray-400 dark:text-gray-500 mt-1">
          <span />
          <span>Regular (400)</span>
          <span>SemiBold (600)</span>
        </div>
      </DemoBlock>

      <DemoBlock title="컴포넌트용 폰트 (components)">
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {COMP_SCALE.map(({ label, cls, semi }) => (
            <div key={label} className="grid grid-cols-[220px_1fr_1fr] items-center py-4 gap-6">
              <span className="text-comp-xs text-gray-400 dark:text-gray-500 font-mono">{label}</span>
              <span className={`${cls} text-gray-900 dark:text-gray-100`}>{sample}</span>
              <span className={`${semi} text-gray-900 dark:text-gray-100`}>{sample}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-[220px_1fr_1fr] text-comp-xs text-gray-400 dark:text-gray-500 mt-1">
          <span />
          <span>Regular (400)</span>
          <span>SemiBold (600)</span>
        </div>
      </DemoBlock>

      <DemoBlock title="폰트 스펙">
        <Card variant="bordered">
          <CardBody>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: '폰트 패밀리', value: 'Pretendard Variable' },
                { label: '자간 (Letter Spacing)', value: '-0.02em (−2%)' },
                { label: '텍스트 색상 (메인)', value: '#0c0c0c' },
                { label: '사용 웨이트', value: 'Regular 400 · SemiBold 600' },
              ].map(({ label, value }) => (
                <div key={label} className="space-y-1">
                  <p className="text-comp-xs text-gray-400 dark:text-gray-500">{label}</p>
                  <p className="text-comp-sm font-semibold text-gray-800 dark:text-gray-200 font-mono">{value}</p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </DemoBlock>
    </>
  );
}

function ButtonSection() {
  const COLORS = ['theme', 'mono', 'error'];
  const VARIANTS = [
    { key: 'primary', label: '01_primary — 채움형' },
    { key: 'line',    label: '02_line — 테두리형' },
    { key: 'ghost',   label: '03_ghost — 투명형' },
  ];

  return (
    <>
      <SectionTitle title="Button" desc="Figma 01_buttons 기반 — 3 variant × 3 color × 2 size × 5 state" />

      {VARIANTS.map(({ key, label }) => (
        <DemoBlock key={key} title={label}>
          <div className="space-y-4">
            {COLORS.filter(c => key !== 'line' || c !== 'error' || key === 'primary').map((color) => (
              <div key={color} className="flex flex-wrap items-center gap-3">
                <span className="w-14 text-comp-xs text-gray-400 shrink-0">{color}</span>
                {/* size 32 */}
                <Button variant={key} color={color} size="32">다음 단계</Button>
                <Button variant={key} color={color} size="32" leftIcon={Plus}>추가</Button>
                <Button variant={key} color={color} size="32" loading>로딩 중</Button>
                <Button variant={key} color={color} size="32" disabled>비활성</Button>
                {/* size 24 */}
                <Button variant={key} color={color} size="24">다음 단계</Button>
                <Button variant={key} color={color} size="24" loading>로딩 중</Button>
                <Button variant={key} color={color} size="24" disabled>비활성</Button>
              </div>
            ))}
          </div>
        </DemoBlock>
      ))}

      <DemoBlock title="Sizes (32 vs 24)">
        <div className="flex flex-wrap items-center gap-3">
          <Button size="32">size 32 — 기본</Button>
          <Button size="24">size 24 — 소형</Button>
          <Button variant="line" size="32">line 32</Button>
          <Button variant="line" size="24">line 24</Button>
          <Button variant="ghost" size="32">ghost 32</Button>
          <Button variant="ghost" size="24">ghost 24</Button>
        </div>
      </DemoBlock>

      <DemoBlock title="아이콘 조합">
        <div className="flex flex-wrap gap-3">
          <Button size="32" leftIcon={Plus}>새로 만들기</Button>
          <Button size="32" variant="line" leftIcon={Download}>내보내기</Button>
          <Button size="32" variant="ghost" leftIcon={Send}>전송하기</Button>
          <Button size="32" color="error" leftIcon={Trash2}>삭제</Button>
          <Button size="24" leftIcon={Plus}>추가</Button>
          <Button size="24" variant="line" color="mono" rightIcon={Send}>전송</Button>
        </div>
      </DemoBlock>
    </>
  );
}

function InputSection() {
  const [pw, setPw] = useState('');
  return (
    <>
      <SectionTitle title="Input" desc="레이블, 아이콘, 상태를 지원하는 입력 필드" />

      <DemoBlock title="기본">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
          <Input label="이름" placeholder="홍길동" />
          <Input label="이메일" type="email" placeholder="user@company.com" leftIcon={AtSign} />
        </div>
      </DemoBlock>

      <DemoBlock title="States">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
          <Input label="오류 상태" state="error" defaultValue="잘못된 값" helperText="올바른 형식으로 입력해 주세요." />
          <Input label="성공 상태" state="success" defaultValue="valid@email.com" helperText="사용 가능한 이메일입니다." />
          <Input label="비활성화" disabled defaultValue="편집 불가" />
          <Input label="비밀번호" type="password" placeholder="••••••••" value={pw} onChange={(e) => setPw(e.target.value)} helperText="8자 이상 입력하세요." />
        </div>
      </DemoBlock>

      <DemoBlock title="Addon">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
          <Input label="URL" leftAddon="https://" placeholder="company.com" />
          <Input label="검색" leftIcon={Search} placeholder="검색어 입력..." rightAddon="⌘K" />
          <Input label="이메일" rightAddon="@company.com" placeholder="username" />
        </div>
      </DemoBlock>
    </>
  );
}

function CardSection() {
  return (
    <>
      <SectionTitle title="Card" desc="헤더, 바디, 푸터 섹션을 지원하는 카드 레이아웃" />

      <DemoBlock title="Variants">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {['default', 'bordered', 'elevated'].map((v) => (
            <Card key={v} variant={v}>
              <CardBody>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">{v}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">카드 본문 내용이 들어갑니다.</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </DemoBlock>

      <DemoBlock title="Header + Footer">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
          <Card>
            <CardHeader title="월간 보고서" description="2024년 5월 기준" action={<Badge variant="green" dot>최신</Badge>} />
            <CardBody><p className="text-sm text-gray-500 dark:text-gray-400">주요 KPI 및 팀 성과 요약 내용이 표시됩니다.</p></CardBody>
            <CardFooter><div className="flex justify-end gap-2"><Button size="24" variant="ghost">취소</Button><Button size="24">확인</Button></div></CardFooter>
          </Card>
          <Card variant="bordered" hoverable>
            <CardBody>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Hoverable</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">마우스를 올려보세요. 그림자가 생깁니다.</p>
            </CardBody>
          </Card>
        </div>
      </DemoBlock>
    </>
  );
}

function BadgeSection() {
  const [tags, setTags] = useState(['디자인', '개발', '기획', '마케팅']);
  return (
    <>
      <SectionTitle title="Badge" desc="상태, 카테고리, 레이블 표시용 배지 컴포넌트" />

      <DemoBlock title="Color Variants">
        <div className="flex flex-wrap gap-2">
          {['blue', 'green', 'yellow', 'red', 'purple', 'gray', 'indigo'].map((v) => (
            <Badge key={v} variant={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</Badge>
          ))}
        </div>
      </DemoBlock>

      <DemoBlock title="With Dot">
        <div className="flex flex-wrap gap-2">
          <Badge variant="green" dot>Active</Badge>
          <Badge variant="yellow" dot>Pending</Badge>
          <Badge variant="red" dot>Inactive</Badge>
          <Badge variant="blue" dot>In Review</Badge>
        </div>
      </DemoBlock>

      <DemoBlock title="Sizes">
        <div className="flex flex-wrap items-center gap-2">
          <Badge size="sm">Small</Badge>
          <Badge size="md">Medium</Badge>
          <Badge size="lg">Large</Badge>
        </div>
      </DemoBlock>

      <DemoBlock title="Removable Tags">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="blue" onRemove={() => setTags((t) => t.filter((x) => x !== tag))}>
              {tag}
            </Badge>
          ))}
          {tags.length === 0 && <p className="text-sm text-gray-400">모두 제거되었습니다.</p>}
        </div>
      </DemoBlock>
    </>
  );
}

function TableSection() {
  return (
    <>
      <SectionTitle title="Table" desc="정렬, 로딩 스켈레톤, 커스텀 렌더러 지원" />
      <DemoBlock title="데이터 테이블 (헤더 클릭으로 정렬)">
        <Table columns={TABLE_COLS} data={TABLE_DATA} />
      </DemoBlock>
      <DemoBlock title="로딩 상태">
        <Table columns={TABLE_COLS} data={[]} loading />
      </DemoBlock>
      <DemoBlock title="빈 상태">
        <Table columns={TABLE_COLS} data={[]} emptyMessage="조건에 맞는 데이터가 없습니다." />
      </DemoBlock>
    </>
  );
}

function ModalSection() {
  const [open, setOpen] = useState({ sm: false, md: false, lg: false, confirm: false });
  const toggle = (k) => setOpen((s) => ({ ...s, [k]: !s[k] }));

  return (
    <>
      <SectionTitle title="Modal" desc="다양한 크기와 구성의 모달 다이얼로그" />

      <DemoBlock title="Sizes">
        <div className="flex flex-wrap gap-3">
          <Button size="24" variant="line" onClick={() => toggle('sm')}>Small 모달</Button>
          <Button size="24" variant="line" onClick={() => toggle('md')}>Medium 모달</Button>
          <Button size="24" variant="line" onClick={() => toggle('lg')}>Large 모달</Button>
        </div>
      </DemoBlock>

      <DemoBlock title="Confirm Dialog">
        <Button variant="primary" color="error" size="24" leftIcon={Trash2} onClick={() => toggle('confirm')}>삭제 확인</Button>
      </DemoBlock>

      {/* Modals */}
      <Modal open={open.sm} onClose={() => toggle('sm')} size="24" title="Small 모달"
        footer={<div className="flex justify-end gap-2"><Button size="24" variant="ghost" onClick={() => toggle('sm')}>취소</Button><Button size="24">확인</Button></div>}>
        <p className="text-sm text-gray-600 dark:text-gray-300">작은 크기의 모달입니다. 간단한 메시지나 확인 용도로 사용합니다.</p>
      </Modal>

      <Modal open={open.md} onClose={() => toggle('md')} size="md" title="사용자 초대" description="이메일로 새 팀원을 초대합니다."
        footer={<div className="flex justify-end gap-2"><Button size="24" variant="ghost" onClick={() => toggle('md')}>취소</Button><Button size="24" leftIcon={Send}>초대 전송</Button></div>}>
        <div className="space-y-4">
          <Input label="이메일 주소" type="email" placeholder="colleague@company.com" leftIcon={Mail} />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">역할 선택</label>
            <div className="flex gap-2">
              {['관리자', '편집자', '뷰어'].map((r) => (
                <button key={r} className="flex-1 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 hover:border-brand-500 hover:text-brand-600 dark:hover:border-brand-400 dark:hover:text-brand-400 transition-colors">
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      <Modal open={open.lg} onClose={() => toggle('lg')} size="lg" title="Large 모달">
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} variant="bordered">
              <CardBody>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">항목 {i + 1}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Large 모달 내 카드 컴포넌트 예시</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </Modal>

      <Modal open={open.confirm} onClose={() => toggle('confirm')} size="24" title="정말 삭제하시겠습니까?"
        footer={
          <div className="flex justify-end gap-2">
            <Button size="24" variant="ghost" onClick={() => toggle('confirm')}>취소</Button>
            <Button size="24" variant="primary" color="error" leftIcon={Trash2} onClick={() => toggle('confirm')}>삭제</Button>
          </div>
        }>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          이 작업은 되돌릴 수 없습니다. 선택한 항목이 영구적으로 삭제됩니다.
        </p>
      </Modal>
    </>
  );
}

function SidebarSection() {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState('buttons');

  return (
    <>
      <SectionTitle title="Sidebar" desc="접기/펼치기, 배지, 그룹을 지원하는 사이드바" />
      <DemoBlock title="미리보기 (실제 좌측 사이드바와 동일)">
        <div className="h-96 flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <Sidebar
            items={NAV_ITEMS}
            bottomItems={BOTTOM_ITEMS}
            collapsed={collapsed}
            onToggle={() => setCollapsed((v) => !v)}
            activeId={active}
            onSelect={setActive}
            logo="DesignSys"
          />
          <div className="flex-1 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <p className="text-sm text-gray-400">활성 항목: <strong className="text-brand-600 dark:text-brand-400">{active}</strong></p>
          </div>
        </div>
      </DemoBlock>
    </>
  );
}

function HeaderSection({ darkMode, onToggleDark }) {
  return (
    <>
      <SectionTitle title="Header" desc="검색, 알림, 다크모드, 사용자 메뉴를 포함한 상단 헤더" />
      <DemoBlock title="미리보기 (실제 상단 헤더와 동일)">
        <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <Header darkMode={darkMode} onToggleDark={onToggleDark} title="대시보드" notificationCount={3} />
        </div>
      </DemoBlock>
    </>
  );
}

/* ───────── Main App ───────── */
export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const sectionMap = {
    overview:   <OverviewSection />,
    typography: <TypographySection />,
    buttons:    <ButtonSection />,
    inputs:     <InputSection />,
    cards:      <CardSection />,
    badges:     <BadgeSection />,
    tables:     <TableSection />,
    modals:     <ModalSection />,
    sidebar:    <SidebarSection />,
    header:     <HeaderSection darkMode={darkMode} onToggleDark={() => setDarkMode((v) => !v)} />,
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <Sidebar
        items={NAV_ITEMS}
        bottomItems={BOTTOM_ITEMS}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((v) => !v)}
        activeId={activeSection}
        onSelect={setActiveSection}
        logo="DesignSys"
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          darkMode={darkMode}
          onToggleDark={() => setDarkMode((v) => !v)}
          title={NAV_ITEMS.find((i) => i.id === activeSection)?.label || ''}
          notificationCount={3}
        />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            {sectionMap[activeSection] || <OverviewSection />}
          </div>
        </main>
      </div>
    </div>
  );
}
