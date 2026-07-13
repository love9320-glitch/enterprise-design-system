import { useState } from 'react';
import { User, Settings, Bell, CreditCard, ChevronDown } from 'lucide-react';
import { Tabs } from '../../src/components/Tabs';
import { Popover } from '../../src/components/Popover';
import { PopoverMenu } from '../../src/components/PopoverMenu';
import { ListGroup } from '../../src/components/ListGroup';
import { List } from '../../src/components/List';
import { Checkbox } from '../../src/components/Checkbox';
import { UsageExample } from '../components/UsageExample';
import { Divider } from '../../src/components/Divider';

const USAGE = `import { Tabs } from '../../src/components/Tabs';

const items = [
  { value: 'profile', label: '프로필' },
  { value: 'account', label: '계정', icon: User, tag: true, tagText: 'N', tagType: 'red' },
  { value: 'billing', label: '결제' },
  { value: 'etc', label: '기타', disabled: true },
];

// 기본(hug) — controlled
const [tab, setTab] = useState('profile');
<Tabs items={items} value={tab} onChange={setTab} />

// fill — 균등 분할(전체 폭)
<Tabs items={items} variant="fill" defaultValue="profile" />

// rightSlot — 우측에 임의 요소(예: '설정 ▾' 팝오버로 탭 활성/비활성 토글)
<Tabs
  items={items}
  rightSlot={
    <Popover trigger={<button>설정 ▾</button>}>
      <PopoverMenu width="100%">
        <ListGroup>
          {ALL.map((t) => (
            <List key={t.value} title={t.label} showSwitch
              switchChecked={!disabled.has(t.value)}
              onSwitchChange={(e) => toggle(t.value, e.target.checked)} />
          ))}
        </ListGroup>
      </PopoverMenu>
    </Popover>
  }
/>`;

const USAGE_PROPS = [
  // Tabs
  { name: 'Tabs · items', type: '{value,label,icon?,tag?,tagText?,tagType?,disabled?}[]', default: '[]', desc: '탭 목록 (tagType: blue/red/gray)' },
  { name: 'Tabs · value', type: 'string', default: '—', desc: '선택값 (제어 컴포넌트)' },
  { name: 'Tabs · defaultValue', type: 'string', default: '첫 항목', desc: '초기 선택값 (비제어)' },
  { name: 'Tabs · onChange', type: '(value) => void', default: '—', desc: '선택 변경 핸들러' },
  { name: 'Tabs · variant', type: "'hug' | 'fill'", default: "'hug'", desc: 'hug=내용 폭 / fill=균등 분할(전체 폭)' },
  { name: 'Tabs · rightSlot', type: 'ReactNode', default: 'null', desc: '우측 임의 요소(예: 설정 Select) — justify-between 배치' },
  { name: 'Tabs · className', type: 'string', default: "''", desc: '추가 클래스' },
  // TabMenu (단독 사용 시)
  { name: 'TabMenu · children', type: 'ReactNode', default: '—', desc: '탭 라벨' },
  { name: 'TabMenu · icon', type: 'LucideIcon', default: 'null', desc: '왼쪽 아이콘' },
  { name: 'TabMenu · tag / tagText', type: 'boolean / string', default: 'false / 태그', desc: '오른쪽 태그' },
  { name: 'TabMenu · tagType', type: "'blue' | 'red' | 'gray'", default: "'blue'", desc: '태그 색상 타입' },
  { name: 'TabMenu · selected', type: 'boolean', default: 'false', desc: '선택 상태(하단 2px underline)' },
  { name: 'TabMenu · disabled', type: 'boolean', default: 'false', desc: '비활성' },
  { name: 'TabMenu · onClick', type: '() => void', default: '—', desc: '클릭 핸들러' },
];

const ITEMS = [
  { value: 'profile', label: '프로필' },
  { value: 'account', label: '계정' },
  { value: 'billing', label: '결제' },
  { value: 'etc', label: '기타', disabled: true },
];

const ICON_ITEMS = [
  { value: 'profile', label: '프로필', icon: User, tag: true, tagText: 'N' },
  { value: 'account', label: '계정', icon: Settings, tag: true, tagText: '99+', tagType: 'red' },
  { value: 'billing', label: '결제', icon: CreditCard, tag: true, tagText: '완료', tagType: 'gray' },
  { value: 'notice', label: '알림', icon: Bell, disabled: true },
];

// rightSlot 데모 — 우측 '설정 ▾' 팝오버 메뉴에서 각 탭의 활성/비활성을 스위치로 토글한다.
function TabsControlDemo() {
  const ALL = [
    { value: 'profile', label: '프로필' },
    { value: 'account', label: '계정' },
    { value: 'billing', label: '결제' },
    { value: 'etc', label: '기타' },
  ];
  const [disabledSet, setDisabledSet] = useState(() => new Set(['etc']));
  const [tab, setTab] = useState('profile');

  const items = ALL.map((t) => ({ ...t, disabled: disabledSet.has(t.value) }));

  const toggleEnabled = (value, enabled) => {
    setDisabledSet((prev) => {
      const next = new Set(prev);
      if (enabled) next.delete(value);
      else next.add(value);
      return next;
    });
    // 보고 있는 탭을 비활성화하면 선택을 첫 활성 탭으로 옮긴다
    if (!enabled && value === tab) {
      const firstEnabled = ALL.find((t) => t.value !== value && !disabledSet.has(t.value));
      if (firstEnabled) setTab(firstEnabled.value);
    }
  };

  const trigger = (
    <button
      type="button"
      className="inline-flex items-center gap-spacing-3 text-14 text-font-icon-5"
    >
      설정
      <ChevronDown size={16} strokeWidth={1.8} className="text-font-icon-3" />
    </button>
  );

  return (
    <Tabs
      items={items}
      value={tab}
      onChange={setTab}
      rightSlot={
        <Popover placement="auto-right" menuWidth={200} trigger={trigger}>
          <PopoverMenu width="100%">
            <ListGroup>
              {ALL.map((t) => (
                <List
                  key={t.value}
                  title={t.label}
                  showSwitch
                  switchChecked={!disabledSet.has(t.value)}
                  onSwitchChange={(e) => toggleEnabled(t.value, e.target.checked)}
                />
              ))}
            </ListGroup>
          </PopoverMenu>
        </Popover>
      }
    />
  );
}

// 실시간 옵션 토글 플레이그라운드 — 탭 요소·옵션을 체크박스로 끄고 켠다.
// (OptionList/TableTemplate 페이지의 Playground와 동일한 패턴)
const PLAYGROUND_BASE = [
  { value: 'profile', label: '프로필', icon: User },
  { value: 'account', label: '계정', icon: Settings },
  { value: 'billing', label: '결제', icon: CreditCard },
  { value: 'notice', label: '알림', icon: Bell },
];

function Playground() {
  const [opts, setOpts] = useState({
    icon: true, tag: false, fill: false, rightSlot: true,
  });
  const toggle = (k) => setOpts((o) => ({ ...o, [k]: !o[k] }));
  const [tab, setTab] = useState('profile');
  const [disabledSet, setDisabledSet] = useState(() => new Set());

  const items = PLAYGROUND_BASE.map((t) => ({
    value: t.value,
    label: t.label,
    icon: opts.icon ? t.icon : undefined,
    tag: opts.tag,
    tagText: 'N',
    disabled: disabledSet.has(t.value),
  }));

  // 우측 팝오버의 스위치로 각 탭을 활성/비활성 토글
  const toggleEnabled = (value, enabled) => {
    setDisabledSet((prev) => {
      const next = new Set(prev);
      if (enabled) next.delete(value);
      else next.add(value);
      return next;
    });
    // 보고 있는 탭을 비활성화하면 선택을 첫 활성 탭으로 옮긴다
    if (!enabled && value === tab) {
      const firstEnabled = PLAYGROUND_BASE.find((t) => t.value !== value && !disabledSet.has(t.value));
      if (firstEnabled) setTab(firstEnabled.value);
    }
  };

  const rightSlot = opts.rightSlot ? (
    <Popover
      placement="auto-right"
      menuWidth={200}
      trigger={
        <button type="button" className="inline-flex items-center gap-spacing-3 text-14 text-font-icon-5">
          설정
          <ChevronDown size={16} strokeWidth={1.8} className="text-font-icon-3" />
        </button>
      }
    >
      <PopoverMenu width="100%">
        <ListGroup>
          {PLAYGROUND_BASE.map((t) => (
            <List
              key={t.value}
              title={t.label}
              showSwitch
              switchChecked={!disabledSet.has(t.value)}
              onSwitchChange={(e) => toggleEnabled(t.value, e.target.checked)}
            />
          ))}
        </ListGroup>
      </PopoverMenu>
    </Popover>
  ) : null;

  const label = PLAYGROUND_BASE.find((t) => t.value === tab)?.label;

  return (
    <div>
      <div className="mb-spacing-7 rounded-round-4 border border-base-gray-100 px-spacing-7 py-spacing-6">
        <div className="flex min-h-[32px] flex-nowrap items-center gap-x-spacing-7 whitespace-nowrap">
          <Checkbox checked={opts.icon}      onChange={() => toggle('icon')}      label="아이콘" />
          <Checkbox checked={opts.tag}       onChange={() => toggle('tag')}       label="태그" />
          <Checkbox checked={opts.fill}      onChange={() => toggle('fill')}      label="fill (균등 분할)" />
          <Checkbox checked={opts.rightSlot} onChange={() => toggle('rightSlot')} label="rightSlot (설정 팝오버로 탭 비활성)" />
        </div>
      </div>

      <div>
        <Tabs
          items={items}
          value={tab}
          onChange={setTab}
          variant={opts.fill ? 'fill' : 'hug'}
          rightSlot={rightSlot}
        />
        <div className="px-spacing-5 py-spacing-7 text-14 text-font-icon-4">
          <span className="text-font-icon-5">{label}</span> 탭의 내용 영역입니다.
        </div>
      </div>
    </div>
  );
}

// 콘텐츠 전환 인터랙티브
function InteractiveTabs() {
  const [tab, setTab] = useState('profile');
  const label = ITEMS.find((i) => i.value === tab)?.label;
  return (
    <div>
      <Tabs items={ITEMS} value={tab} onChange={setTab} />
      <div className="px-spacing-5 py-spacing-7 text-14 text-font-icon-4">
        <span className="text-font-icon-5">{label}</span> 탭의 내용 영역입니다.
      </div>
    </div>
  );
}

function Block({ title, desc, first = false, children }) {
  return (
    <>
      {!first && <Divider className="mt-spacing-10 mb-spacing-9" />}
      <div>
        <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">{title}</h3>
        {desc && <p className="mb-spacing-6 text-12 text-font-icon-4">{desc}</p>}
        {children}
      </div>
    </>
  );
}

export function TabsPage() {
  return (
    <section className="mx-auto max-w-5xl px-spacing-7 py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-20 font-semibold text-font-icon-5">Tabs</h2>
      <p className="mb-spacing-9 text-14 text-font-icon-4">
        탭 — 여러 화면/섹션을 전환합니다. 선택 탭은 하단 2px underline, 그룹은 하단 1px 구분선.<br />
        <span className="text-font-icon-5">Hover</span>는 마우스로 확인하세요(미선택 탭에 진한 텍스트+underline).
        색은 tab 시멘틱 토큰(base 경유)을 사용합니다.
      </p>

      <UsageExample code={USAGE} props={USAGE_PROPS} />

      <Block first title="Playground — 요소 끄고 켜기" desc="체크박스로 탭 요소(아이콘·태그)와 옵션(fill·rightSlot)을 실시간 토글해 보세요. rightSlot을 켜면 우측 '설정 ▾' 팝오버의 스위치로 각 탭을 활성/비활성할 수 있습니다(보고 있는 탭을 끄면 첫 활성 탭으로 이동).">
        <Playground />
      </Block>

      <Block title="기본 (hug) + 콘텐츠 전환">
        <InteractiveTabs />
      </Block>

      <Block title="아이콘 · 태그" desc="items에 icon·tag/tagText를 주면 라벨 좌측 아이콘, 우측 태그가 붙습니다. tagType(blue/red/gray)으로 태그 색을 고릅니다. disabled 탭은 회색·클릭 차단.">
        <Tabs items={ICON_ITEMS} defaultValue="profile" />
      </Block>

      <Block title="fill (균등 분할)" desc='variant="fill"이면 탭들이 전체 폭을 균등하게 나눠 채웁니다.'>
        <Tabs items={ITEMS.slice(0, 3)} defaultValue="profile" variant="fill" />
      </Block>

      <Block title="rightSlot (우측 요소) — 탭 활성/비활성 제어" desc="rightSlot으로 우측에 임의 요소를 둘 수 있습니다. 여기선 '설정 ▾' 팝오버 메뉴(Popover + List 스위치)로 왼쪽 탭을 켜고 끕니다. 보고 있는 탭을 끄면 선택이 첫 활성 탭으로 이동합니다.">
        <TabsControlDemo />
      </Block>
    </section>
  );
}
