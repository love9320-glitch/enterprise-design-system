import { useState } from 'react';
import { Plus } from 'lucide-react';
import { SideNavigationTemplate } from '../components/SideNavigationTemplate';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Table } from '../components/Table';
import { Field } from '../components/Field';
import { Checkbox } from '../components/Checkbox';
import { Select } from '../components/Select';
import { Divider } from '../components/Divider';
import { UsageExample } from '../components/UsageExample';

const USAGE = `import { SideNavigationTemplate } from '../components/SideNavigationTemplate';

const MENUS = [
  { id: 'all',  label: '전체', count: 58 },
  { id: 'area', label: '지역', count: 3 },
  { id: 'rank', label: '직책', count: 12, showNewTag: true },
];

<SideNavigationTemplate
  menus={MENUS}
  defaultSelectedId="all"
  onSelect={(id) => setFilter(id)}
  addLabel="카테고리 추가"
  onAdd={() => addCategory()}
>
  {/* 우측 콘텐츠 슬롯 — Figma 구조 그대로 Field+Table 조립 */}
  <Field label="채용 코드 생성">
    <div className="flex items-center gap-spacing-5">…Input + 추가 Button…</div>
  </Field>
  <Table columns={columns} rows={rows} />
</SideNavigationTemplate>`;

const USAGE_PROPS = [
  { name: 'menus', type: '{ id, label, count?, icon?, showNewTag?, newTagColor?, disabled? }[]', default: '[]', desc: '좌측 메뉴 목록 — count는 라벨 뒤에 표시(0 또는 미지정이면 숨김)' },
  { name: 'selectedId / defaultSelectedId / onSelect', type: 'string / string / (id)=>void', default: '— / 첫 메뉴 / —', desc: '선택 제어(controlled) 또는 초기값(uncontrolled)' },
  { name: 'navWidth', type: 'number | string', default: '180', desc: '좌측 내비 너비 (Figma 180/220/260)' },
  { name: 'line', type: 'boolean', default: 'true', desc: '내비 우측 1px 구분선' },
  { name: 'showAdd / addLabel / onAdd', type: "boolean / string / (e)=>void", default: "true / 'add menu' / —", desc: '추가(+) 행 — 메뉴 추가 기능 on/off' },
  { name: 'addPosition', type: "'top' | 'bottom'", default: "'top'", desc: '추가 행 위치 — 최상위/최하위(어느 쪽이든 스크롤 밖 고정)' },
  { name: 'overflow', type: "'ellipsis' | 'wrap'", default: "'ellipsis'", desc: '긴 메뉴 라벨 처리(버튼 패스스루)' },
  { name: 'height', type: "number | string | 'fill'", default: '—', desc: "템플릿 높이 — 숫자/CSS=고정. 'fill'=모달 본문 가용 높이를 '최대치'로(내용 적으면 자연 높이, 상한 도달 시 내비 독립 스크롤. 밖에선 부모 100%). 우측 콘텐츠도 상한을 따르려면 fill형으로(예: Table maxHeight='fill' + min-h-0 — 규칙 18)" },
  { name: 'children', type: 'ReactNode', default: '—', desc: '우측 콘텐츠 슬롯(세로 스택, gap 12)' },
];

const INITIAL_ROWS = [
  { id: 1, category: '지역', name: '경기' },
  { id: 2, category: '지역', name: '서울' },
  { id: 3, category: '지역', name: '부산' },
  { id: 4, category: '직책', name: '사원' },
  { id: 5, category: '직책', name: '대리' },
  { id: 6, category: '직책', name: '과장' },
  { id: 7, category: '직책', name: '차장' },
  { id: 8, category: '직무', name: '개발자' },
  { id: 9, category: '직무', name: '기획자' },
  { id: 10, category: '직무', name: '디자이너' },
  { id: 11, category: '경력', name: '신입' },
  { id: 12, category: '경력', name: '경력' },
];

const COLUMNS = [
  { key: 'category', label: '카테고리', width: 120 },
  { key: 'name', label: '채용 코드명' },
];

const CATEGORY_BY_MENU = { area: '지역', rank: '직책', duty: '직무', career: '경력' };

function Demo({ navWidth = 180, line = true, showAdd = true, addPosition = 'top', overflow = 'ellipsis', height, extraMenus = 0 }) {
  const [rows, setRows] = useState(INITIAL_ROWS);
  const [menu, setMenu] = useState('all');
  const [draft, setDraft] = useState('');
  const [userCats, setUserCats] = useState([]); // '카테고리 추가'로 사용자가 더한 카테고리명들

  // 메뉴 id → 필터할 카테고리명(추가 더미 메뉴는 라벨 자체를 카테고리로 사용)
  const catNameOf = (id) =>
    CATEGORY_BY_MENU[id] ??
    (id.startsWith('extra-')
      ? `카테고리 ${Number(id.slice(6)) + 6}`
      : id.startsWith('user-')
        ? userCats[Number(id.slice(5))]
        : null);
  const visible = menu === 'all' ? rows : rows.filter((r) => r.category === catNameOf(menu));
  const countOf = (key) => (key === 'all' ? rows.length : rows.filter((r) => r.category === catNameOf(key)).length);
  const menus = [
    { id: 'all', label: '전체', count: countOf('all') },
    { id: 'area', label: '지역', count: countOf('area') },
    { id: 'rank', label: '직책', count: countOf('rank'), showNewTag: true },
    { id: 'duty', label: '직무', count: countOf('duty') },
    { id: 'career', label: '경력', count: countOf('career') },
    { id: 'long', label: '아주 길어서 잘리는 카테고리 명칭 예시', count: 0 },
    // 스크롤 데모용 더미 카테고리 — extraMenus 개수만큼
    ...Array.from({ length: extraMenus }, (_, i) => ({ id: `extra-${i}`, label: `카테고리 ${i + 6}`, count: countOf(`extra-${i}`) })),
    // '카테고리 추가'로 사용자가 더한 카테고리
    ...userCats.map((name, i) => ({ id: `user-${i}`, label: name, count: countOf(`user-${i}`) })),
  ];

  // '카테고리 추가'(+) — 새 카테고리를 만들고 바로 선택해 추가된 것이 즉시 보이게
  const addCategory = () => {
    setUserCats((prev) => {
      const next = [...prev, `새 카테고리 ${prev.length + 1}`];
      setMenu(`user-${next.length - 1}`);
      return next;
    });
  };

  const addCode = () => {
    const name = draft.trim();
    if (!name) return;
    const category = menu === 'all' ? '지역' : catNameOf(menu) ?? '지역';
    setRows((prev) => [...prev, { id: Date.now(), category, name }]);
    setDraft('');
  };

  return (
    <SideNavigationTemplate
      menus={menus}
      selectedId={menu}
      onSelect={setMenu}
      navWidth={navWidth}
      line={line}
      showAdd={showAdd}
      addPosition={addPosition}
      overflow={overflow}
      height={height}
      addLabel="카테고리 추가"
      onAdd={addCategory}
    >
      {/* Figma 구조 그대로: field 인스턴스(label=채용 코드 생성, slot=인풋+추가 버튼) + table 인스턴스 (규칙 4) */}
      <Field label="채용 코드 생성">
        <div className="flex items-center gap-spacing-5">
          <div className="min-w-0 flex-1">
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="채용코드명을 입력하세요"
              width="100%"
              inputProps={{
                onKeyDown: (e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCode();
                  }
                },
              }}
            />
          </div>
          <Button variant="line" leftIcon={Plus} onClick={addCode}>
            추가
          </Button>
        </div>
      </Field>
      {/* 높이 제한(height) 시 우측도 상한을 따르도록 표는 fill(부모 가용 높이 상한, 규칙 18) —
          제한 없으면 자연 높이 그대로라 항상 켜 둬도 안전 */}
      <Table columns={COLUMNS} rows={visible} bordered minWidth={0} maxHeight="fill" className="min-h-0" />
    </SideNavigationTemplate>
  );
}

const WIDTH_OPTIONS = [
  { value: 180, label: '180 (기본)' },
  { value: 220, label: '220' },
  { value: 260, label: '260' },
];
const OVERFLOW_OPTIONS = [
  { value: 'ellipsis', label: 'ellipsis (말줄임+툴팁)' },
  { value: 'wrap', label: 'wrap (멀티라인)' },
];
const ADD_POSITION_OPTIONS = [
  { value: 'top', label: 'top (최상위, 기본)' },
  { value: 'bottom', label: 'bottom (최하위)' },
];
const HEIGHT_OPTIONS = [
  { value: 'none', label: '없음 (자연 높이)' },
  { value: 200, label: '200px (기본 메뉴로도 스크롤)' },
  { value: 360, label: '360px' },
  { value: 480, label: '480px' },
  { value: 'fill', label: "fill (부모 높이 채움 — 200px 박스로 재현)" },
];

// 내비 옵션 실시간 토글 플레이그라운드 — TableTemplatePage와 동일 패턴
function Playground() {
  const [opts, setOpts] = useState({ line: true, showAdd: true, manyMenus: false });
  const [navWidth, setNavWidth] = useState(180);
  const [overflow, setOverflow] = useState('ellipsis');
  const [height, setHeight] = useState('none');
  const [addPosition, setAddPosition] = useState('top');
  const toggle = (k) => setOpts((o) => ({ ...o, [k]: !o[k] }));

  return (
    <div>
      <div className="mb-spacing-7 rounded-round-4 border border-base-gray-100 px-spacing-7 py-spacing-6">
        <div className="flex min-h-[32px] flex-wrap items-center gap-x-spacing-9 gap-y-spacing-5">
          <label className="inline-flex items-center gap-spacing-4 text-14 text-font-icon-5">
            내비 너비
            <Select options={WIDTH_OPTIONS} value={navWidth} onChange={(e) => setNavWidth(Number(e.target.value))} width={140} />
          </label>
          <Checkbox checked={opts.line} onChange={() => toggle('line')} label="우측 구분선(line)" />
          <Checkbox checked={opts.showAdd} onChange={() => toggle('showAdd')} label="카테고리 추가(+) 행" />
          <label className="inline-flex items-center gap-spacing-4 text-14 text-font-icon-5">
            추가 행 위치
            <Select options={ADD_POSITION_OPTIONS} value={addPosition} onChange={(e) => setAddPosition(e.target.value)} width={170} />
          </label>
          <label className="inline-flex items-center gap-spacing-4 text-14 text-font-icon-5">
            긴 명칭(overflow)
            <Select options={OVERFLOW_OPTIONS} value={overflow} onChange={(e) => setOverflow(e.target.value)} width={190} />
          </label>
          <label className="inline-flex items-center gap-spacing-4 text-14 text-font-icon-5">
            높이 제한(height)
            <Select options={HEIGHT_OPTIONS} value={height} onChange={(e) => setHeight(['none', 'fill'].includes(e.target.value) ? e.target.value : Number(e.target.value))} width={230} />
          </label>
          <Checkbox checked={opts.manyMenus} onChange={() => toggle('manyMenus')} label="카테고리 많음(스크롤 확인용)" />
        </div>
      </div>
      <Divider className="mt-spacing-9 mb-spacing-7" />
      {height === 'fill' ? (
        // fill은 '부모가 높이를 줄 때' 동작 — 데모에선 200px 박스가 부모(모달에선 ModalBody 가용 높이) 역할
        <div className="h-[200px]">
          <Demo navWidth={navWidth} line={opts.line} showAdd={opts.showAdd} addPosition={addPosition} overflow={overflow} height="fill" extraMenus={opts.manyMenus ? 14 : 0} />
        </div>
      ) : (
        <Demo
          navWidth={navWidth}
          line={opts.line}
          showAdd={opts.showAdd}
          addPosition={addPosition}
          overflow={overflow}
          height={height === 'none' ? undefined : height}
          extraMenus={opts.manyMenus ? 14 : 0}
        />
      )}
    </div>
  );
}

export function SideNavTemplatePage() {
  return (
    <section className="mx-auto max-w-5xl px-spacing-7 py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-20 font-semibold text-font-icon-5">Side Navigation Template</h2>
      <p className="mb-spacing-9 text-14 text-font-icon-4">
        좌측 <span className="text-font-icon-5">사이드 내비게이션</span>(추가 행 상단 내장) + 우측{' '}
        <span className="text-font-icon-5">콘텐츠 슬롯</span> 2단 레이아웃 템플릿. 메뉴는 데이터로 렌더하고
        선택은 controlled/uncontrolled 모두 지원합니다. 간격은 Figma 규격(내비 180 · 사이 16px · 콘텐츠 세로 12px)입니다.
      </p>

      <UsageExample code={USAGE} props={USAGE_PROPS} note="우측 콘텐츠는 슬롯(children) — 아래 데모처럼 Input·Table 등 기존 컴포넌트를 자유 조립합니다. 메뉴를 클릭하면 테이블이 필터링되고, 코드를 입력·추가하면 카운트가 갱신됩니다." />

      <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">Playground — 내비 옵션</h3>
      <p className="mb-spacing-6 text-12 text-font-icon-4">
        내비 너비(180/220/260) · 우측 구분선 · 카테고리 추가 행 · 긴 명칭 처리(ellipsis/wrap) ·
        높이 제한(height)을 실시간으로 토글해 보세요. 마지막 메뉴는 일부러 긴 명칭이라 overflow 차이가 바로 보입니다.
        <span className="text-font-icon-5"> 높이 제한 + 카테고리 많음</span>을 켜면 내비가 독립 스크롤되는 상황을 볼 수 있습니다
        (추가 행은 고정, 모달에서는 height="fill"로 같은 동작).
      </p>
      <Playground />
    </section>
  );
}
