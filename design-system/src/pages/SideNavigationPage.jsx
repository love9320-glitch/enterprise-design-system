import { useState } from 'react';
import { Users, FolderOpen, Settings } from 'lucide-react';
import { SideNavigation, SideNavigationButton } from '../components/SideNavigation';
import { Divider } from '../components/Divider';
import { UsageExample } from '../components/UsageExample';

const USAGE = `import { SideNavigation, SideNavigationButton } from '../components/SideNavigation';
import { Users, Plus } from 'lucide-react';

// add menu(+)는 내장 기능 — showAdd로 on/off, onAdd로 추가 동작 연결
<SideNavigation width={180} line onAdd={() => addMenu()}>
  <SideNavigationButton icon={Users} selected showNewTag>side menu</SideNavigationButton>
  <SideNavigationButton icon={Users} showNewTag>side menu</SideNavigationButton>
  <SideNavigationButton icon={Users} disabled>side menu</SideNavigationButton>
</SideNavigation>

// add menu 끄기 · 독립형(우측 라인 없음)
<SideNavigation width={220} line={false} showAdd={false}>
  <SideNavigationButton icon={Users} line={false}>side menu</SideNavigationButton>
</SideNavigation>`;

const USAGE_PROPS = [
  { name: 'SideNavigation · width', type: "number | string", default: '180', desc: '컨테이너 너비 — Figma variants 180/220/260 또는 임의 px/CSS' },
  { name: 'SideNavigation · line', type: 'boolean', default: 'true', desc: '우측 1px 구분선(side-nav-right-line) 표시' },
  { name: 'SideNavigation · children', type: 'ReactNode', default: '—', desc: 'SideNavigationButton들(행 간격 spacing-2)' },
  { name: 'SideNavigation · showAdd', type: 'boolean', default: 'true', desc: "하단 'add menu'(+) 행 — 메뉴 추가 기능 on/off" },
  { name: 'SideNavigation · addLabel / onAdd', type: "string / (e) => void", default: "'add menu' / —", desc: '추가 행 라벨 · 클릭 시 메뉴 추가 동작' },
  { name: 'Button · children', type: 'ReactNode', default: "'side menu'", desc: '메뉴 라벨' },
  { name: 'Button · overflow', type: "'ellipsis' | 'wrap'", default: "'ellipsis'", desc: '긴 라벨 처리 — 말줄임(+hover 전체 툴팁) / 멀티라인 줄바꿈' },
  { name: 'Button · icon', type: 'Component', default: '—', desc: '좌측 lucide 아이콘(16)' },
  { name: 'Button · selected', type: 'boolean', default: 'false', desc: 'select 상태 — 파란 텍스트·알파 배경(side-nav-select-*)' },
  { name: 'Button · disabled', type: 'boolean', default: 'false', desc: '비활성(#c9c9c9, hover 없음)' },
  { name: 'Button · showNewTag / newTagColor', type: "boolean / 'blue'|'red'|'black'", default: "false / 'blue'", desc: "라벨 오른쪽 NewTag(N) 표시" },
  { name: 'Button · showArrow', type: 'boolean', default: 'true', desc: '우측 chevron(›) 표시' },
  { name: 'Button · line', type: 'boolean', default: 'true', desc: 'true=우측 라인 접합형(왼쪽만 라운드) / false=독립형(전체 라운드)' },
  { name: 'Button · onClick', type: '(e) => void', default: '—', desc: '클릭 핸들러' },
];

const MENUS = [
  { id: 'a', label: 'side menu', icon: Users, tag: true },
  { id: 'b', label: 'side menu', icon: Users, tag: true },
  { id: 'c', label: 'side menu', icon: FolderOpen, tag: false },
  { id: 'd', label: 'side menu', icon: Settings, tag: false },
];

function Playground({ width, line, showAdd = true }) {
  const [active, setActive] = useState('a');
  const [added, setAdded] = useState([]);
  return (
    <SideNavigation
      width={width}
      line={line}
      showAdd={showAdd}
      onAdd={() => setAdded((prev) => [...prev, `new menu ${prev.length + 1}`])}
    >
      {MENUS.map((m) => (
        <SideNavigationButton
          key={m.id}
          icon={m.icon}
          selected={active === m.id}
          showNewTag={m.tag}
          line={line}
          onClick={() => setActive(m.id)}
        >
          {m.label}
        </SideNavigationButton>
      ))}
      {added.map((label) => (
        <SideNavigationButton
          key={label}
          icon={FolderOpen}
          selected={active === label}
          line={line}
          onClick={() => setActive(label)}
        >
          {label}
        </SideNavigationButton>
      ))}
    </SideNavigation>
  );
}

export function SideNavigationPage() {
  return (
    <section className="mx-auto max-w-5xl px-spacing-7 py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-20 font-semibold text-font-icon-5">Side Navigation</h2>
      <p className="mb-spacing-9 text-14 text-font-icon-4">
        사이드 메뉴 내비게이션. 버튼 한 행은 [아이콘 · 라벨 · <span className="text-font-icon-5">NewTag</span> · ›]로
        구성되고 <span className="text-font-icon-5">default / hover / select / disabled</span> 상태를 가집니다.
        컨테이너는 세로 스택(행 간격 2px) + 우측 1px 구분선(<code className="text-font-icon-5">line</code>)이며,
        색은 모두 side-nav-* 시멘틱 토큰(base 경유)을 사용합니다.
      </p>

      <UsageExample code={USAGE} props={USAGE_PROPS} note="add menu 행도 별도 컴포넌트가 아니라 같은 SideNavigationButton으로 조립합니다(아이콘 Plus, showArrow=false)." />

      {/* 상태 */}
      <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">상태 (state)</h3>
      <p className="mb-spacing-6 text-12 text-font-icon-4">
        default(회색, hover 시 진해짐+배경) · select(파란 텍스트·알파 배경) · disabled(연회색, 클릭 불가)
      </p>
      <div className="w-[240px] space-y-spacing-2">
        <SideNavigationButton icon={Users} selected showNewTag>select</SideNavigationButton>
        <SideNavigationButton icon={Users} showNewTag>default (hover 해보세요)</SideNavigationButton>
        <SideNavigationButton icon={Users} disabled showNewTag>disabled</SideNavigationButton>
      </div>

      {/* 긴 명칭 — overflow */}
      <Divider className="mt-spacing-9 mb-spacing-8" />
      <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">긴 명칭 — overflow</h3>
      <p className="mb-spacing-6 text-12 text-font-icon-4">
        기본 <code className="text-font-icon-5">ellipsis</code>는 말줄임 + hover 시 전체 명칭 툴팁(TruncatingText),{' '}
        <code className="text-font-icon-5">wrap</code>은 멀티라인으로 줄바꿈되며 행 높이가 늘어납니다.
      </p>
      <div className="flex flex-wrap items-start gap-spacing-9">
        <div className="w-[180px] space-y-spacing-2">
          <p className="mb-spacing-4 text-12 text-font-icon-3">ellipsis (hover 해보세요)</p>
          <SideNavigationButton icon={Users} showNewTag>아주 길어서 반드시 잘리는 사이드 메뉴 명칭</SideNavigationButton>
        </div>
        <div className="w-[180px] space-y-spacing-2">
          <p className="mb-spacing-4 text-12 text-font-icon-3">wrap (멀티라인)</p>
          <SideNavigationButton icon={Users} showNewTag overflow="wrap">아주 길어서 반드시 잘리는 사이드 메뉴 명칭</SideNavigationButton>
        </div>
      </div>

      {/* 독립 스크롤 — 부모 높이 제한 */}
      <Divider className="mt-spacing-9 mb-spacing-8" />
      <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">독립 스크롤 — 부모 높이 제한</h3>
      <p className="mb-spacing-6 text-12 text-font-icon-4">
        상위 DOM이 높이를 제한하면(아래 박스 240px) 메뉴 목록만 내비 안에서 독립적으로 스크롤됩니다.
        추가(+) 행은 스크롤 밖에 고정되고, 높이 제한이 없으면 스크롤 없이 콘텐츠 높이를 따릅니다.
      </p>
      <div className="h-[240px] w-[220px] overflow-hidden rounded-round-4 border border-base-gray-100 p-spacing-5">
        <SideNavigation width={200} line={false} addLabel="add menu" className="h-full">
          {Array.from({ length: 12 }, (_, i) => (
            <SideNavigationButton key={i} icon={Users} line={false} selected={i === 0}>
              {`side menu ${i + 1}`}
            </SideNavigationButton>
          ))}
        </SideNavigation>
      </div>

      {/* 컨테이너 — 너비·라인 */}
      <Divider className="mt-spacing-9 mb-spacing-8" />
      <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">컨테이너 — width · line (클릭해서 선택 이동)</h3>
      <p className="mb-spacing-6 text-12 text-font-icon-4">
        Figma variants와 동일한 180 / 220 / 260 너비. 위 행은 <code className="text-font-icon-5">line</code>(우측
        구분선 + 버튼 왼쪽만 라운드), 아래 행은 <code className="text-font-icon-5">line=false</code>(독립형·전체 라운드)입니다.
        하단 <span className="text-font-icon-5">add menu(+)</span>는 내장 기능 — 눌러보면 메뉴가 실제로 추가되고,
        마지막 컬럼은 <code className="text-font-icon-5">showAdd=false</code>로 끈 상태입니다.
      </p>
      <div className="mb-spacing-8 flex flex-wrap items-start gap-spacing-9">
        <Playground width={180} line />
        <Playground width={220} line />
        <Playground width={260} line />
      </div>
      <div className="flex flex-wrap items-start gap-spacing-9">
        <Playground width={180} line={false} />
        <Playground width={220} line={false} />
        <Playground width={260} line={false} showAdd={false} />
      </div>
    </section>
  );
}
