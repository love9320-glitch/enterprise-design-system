import { useState } from 'react';
import { User } from 'lucide-react';
import { List } from '../components/List';
import { ListGroup } from '../components/ListGroup';
import { PopoverMenu } from '../components/PopoverMenu';
import { Checkbox } from '../components/Checkbox';
import { UsageExample } from '../components/UsageExample';
import { Divider } from '../components/Divider';

const USAGE = `import { PopoverMenu } from '../components/PopoverMenu';
import { ListGroup } from '../components/ListGroup';
import { List } from '../components/List';

// List 한 행 — 요소(tag·icon·checkbox·switch·rightButton·endIcon)는 props로 on/off
<List title="옵션 이름" tag endIcon rightButton onClick={select} />
// left: 아이콘 · 체크박스 / right: 스위치
<List title="알림" icon={User} checkbox checked={c} onCheckChange={...}
      showSwitch switchChecked={s} onSwitchChange={...} />
<List title="선택됨" selected />
<List title="비활성" disabled />

// ListGroup — maxVisible(기본 6) 초과 시 내부 스크롤.
// 항목이 없으면 그룹 안에서 빈 상태(ListEmpty)를 자동 표시 — empty로 명시도 가능.
<ListGroup maxVisible={6}>
  {items.map((it) => <List key={it.id} title={it.label} />)}
</ListGroup>
<ListGroup empty emptyMessage="검색 결과가 없습니다" />

// PopoverMenu — topArea로 상단 영역 선택('none'|'search'|'input'). 목록은 항상 ListGroup(빈 상태 내부 처리)
const [q, setQ] = useState('');
<PopoverMenu topArea="search" searchValue={q} onSearchChange={(e) => setQ(e.target.value)}>
  <ListGroup>{filtered.map((it) => <List key={it.id} title={it.label} />)}</ListGroup>
</PopoverMenu>

// footer — 좌측 기능은 전용 props, 우측은 취소/확인 버튼
<PopoverMenu footer footerText="10개 선택됨" onCancel={close} onConfirm={apply}>
  <ListGroup>{...}</ListGroup>
</PopoverMenu>
<PopoverMenu footer footerCheckbox footerChecked={all} onFooterCheckChange={...}>...</PopoverMenu>
<PopoverMenu footer footerReset onFooterReset={...}>...</PopoverMenu>
// 그 외 커스텀은 footerStart 범용 슬롯에 임의 노드를 넣는다
<PopoverMenu footer footerStart={<커스텀 />}>...</PopoverMenu>

// topArea="input" — 검색 대신 일반 입력 영역 + fill 버튼(목록 없이도 사용)
const [url, setUrl] = useState('');
<PopoverMenu topArea="input" inputValue={url} onInputChange={(e) => setUrl(e.target.value)}
  inputPlaceholder="http://example.com"
  footer footerButtonsFill cancelText="해제" confirmText="저장" onConfirm={save} />
// 저장 단일 버튼만
<PopoverMenu topArea="input" footer footerButtonsFill showCancel={false} confirmText="저장" />`;

const USAGE_PROPS = [
  // List
  { name: 'List · title', type: 'string', default: "'list'", desc: '행 제목' },
  { name: 'List · tag', type: 'boolean', default: 'false', desc: '왼쪽 태그 표시 여부' },
  { name: 'List · tagText', type: 'string', default: "'태그'", desc: '태그 텍스트' },
  { name: 'List · icon', type: 'LucideIcon', default: 'null', desc: '왼쪽 아이콘 컴포넌트 (예: User)' },
  { name: 'List · checkbox', type: 'boolean', default: 'false', desc: '왼쪽 체크박스 표시' },
  { name: 'List · checked', type: 'boolean', default: 'false', desc: '체크박스 상태' },
  { name: 'List · onCheckChange', type: '(e) => void', default: '—', desc: '체크박스 변경 핸들러' },
  { name: 'List · showSwitch', type: 'boolean', default: 'false', desc: '오른쪽 스위치 표시' },
  { name: 'List · switchChecked', type: 'boolean', default: 'false', desc: '스위치 상태' },
  { name: 'List · onSwitchChange', type: '(e) => void', default: '—', desc: '스위치 변경 핸들러' },
  { name: 'List · rightButton', type: 'boolean', default: 'false', desc: '오른쪽 고스트 ⋯ 버튼 표시' },
  { name: 'List · endIcon', type: 'boolean', default: 'false', desc: '오른쪽 chevron(>) 표시' },
  { name: 'List · selected', type: 'boolean', default: 'false', desc: '선택 상태 (chevron 파랑)' },
  { name: 'List · highlighted', type: 'boolean', default: 'false', desc: '키보드 내비게이션 강조(hover 색)' },
  { name: 'List · disabled', type: 'boolean', default: 'false', desc: '비활성 (회색·클릭 차단)' },
  { name: 'List · onClick', type: '() => void', default: '—', desc: '행 클릭 핸들러' },
  { name: 'List · onButtonClick', type: '() => void', default: '—', desc: '⋯ 버튼 클릭 핸들러' },
  { name: 'List · className', type: 'string', default: "''", desc: '추가 클래스' },
  // ListGroup
  { name: 'ListGroup · children', type: 'ReactNode', default: '—', desc: '내부 List들 (0개면 빈 상태 자동)' },
  { name: 'ListGroup · maxVisible', type: 'number', default: '6', desc: '이 개수 초과 시 내부 스크롤' },
  { name: 'ListGroup · empty', type: 'boolean', default: 'false', desc: '빈 상태 강제 표시 (그룹 안에 ListEmpty 렌더)' },
  { name: 'ListGroup · emptyMessage', type: 'string', default: "'검색 결과가 없습니다.'", desc: '빈 상태 문구' },
  { name: 'ListGroup · className', type: 'string', default: "''", desc: '추가 클래스' },
  // (빈 상태 ListEmpty는 ListGroup이 내부에서 렌더 — empty/emptyMessage로 제어)
  // PopoverMenu
  { name: 'PopoverMenu · children', type: 'ReactNode', default: '—', desc: '내부 목록(ListGroup)' },
  { name: 'PopoverMenu · topArea', type: "'none' | 'search' | 'input'", default: "'none'", desc: '상단 영역 선택(없음/검색바/일반 입력 — 셋 중 하나)' },
  { name: 'PopoverMenu · searchValue', type: 'string', default: '—', desc: "검색값 (제어, topArea='search')" },
  { name: 'PopoverMenu · onSearchChange', type: '(e) => void', default: '—', desc: '검색 변경 (e.target.value)' },
  { name: 'PopoverMenu · searchPlaceholder', type: 'string', default: "'검색어를 입력하세요'", desc: '검색바 플레이스홀더' },
  { name: 'PopoverMenu · searchInputProps', type: 'object', default: '{}', desc: '검색 input 속성(autoFocus 등)' },
  { name: 'PopoverMenu · inputValue', type: 'string', default: '—', desc: "입력값 (제어, topArea='input')" },
  { name: 'PopoverMenu · onInputChange', type: '(e) => void', default: '—', desc: '입력 변경 (e.target.value)' },
  { name: 'PopoverMenu · inputPlaceholder', type: 'string', default: "'텍스트를 입력하세요'", desc: '입력 영역 플레이스홀더' },
  { name: 'PopoverMenu · inputProps', type: 'object', default: '{}', desc: '입력 input 속성(autoFocus 등)' },
  { name: 'PopoverMenu · footer', type: 'boolean', default: 'false', desc: '하단 푸터 영역 표시' },
  { name: 'PopoverMenu · footerButtonsFill', type: 'boolean', default: 'false', desc: '푸터 버튼을 fill(균등 분할 전체폭)로 — 좌측 슬롯 없음' },
  { name: 'PopoverMenu · footerText', type: 'string', default: 'null', desc: '좌측 텍스트(선택 개수·가이드 문구)' },
  { name: 'PopoverMenu · footerCheckbox', type: 'boolean', default: 'false', desc: '좌측 전체 선택 체크박스' },
  { name: 'PopoverMenu · footerChecked', type: 'boolean', default: 'false', desc: '체크박스 상태' },
  { name: 'PopoverMenu · onFooterCheckChange', type: '(e) => void', default: '—', desc: '체크박스 변경' },
  { name: 'PopoverMenu · footerCheckLabel', type: 'string', default: "'전체 선택'", desc: '체크박스 라벨' },
  { name: 'PopoverMenu · footerReset', type: 'boolean', default: 'false', desc: '좌측 초기화 언더라인 버튼' },
  { name: 'PopoverMenu · onFooterReset', type: '() => void', default: '—', desc: '초기화 버튼 클릭' },
  { name: 'PopoverMenu · footerResetLabel', type: 'string', default: "'초기화'", desc: '초기화 버튼 라벨' },
  { name: 'PopoverMenu · footerResetIcon', type: 'LucideIcon', default: 'RotateCcw', desc: '초기화 버튼 아이콘' },
  { name: 'PopoverMenu · footerStart', type: 'string | ReactNode', default: 'null', desc: '좌측 범용 슬롯(전용 props로 안 되는 커스텀용, 최우선)' },
  { name: 'PopoverMenu · cancelText', type: 'string', default: "'취소'", desc: '취소 버튼 텍스트' },
  { name: 'PopoverMenu · onCancel', type: '() => void', default: '—', desc: '취소 버튼 클릭' },
  { name: 'PopoverMenu · confirmText', type: 'string', default: "'확인'", desc: '확인 버튼 텍스트' },
  { name: 'PopoverMenu · onConfirm', type: '() => void', default: '—', desc: '확인 버튼 클릭' },
  { name: 'PopoverMenu · confirmVariant', type: "'fill' | 'line' | 'ghost'", default: "'fill'", desc: '확인 버튼 variant' },
  { name: 'PopoverMenu · confirmDisabled', type: 'boolean', default: 'false', desc: '확인 버튼 비활성' },
  { name: 'PopoverMenu · confirmLoading', type: 'boolean', default: 'false', desc: '확인 버튼 로딩' },
  { name: 'PopoverMenu · showCancel', type: 'boolean', default: 'true', desc: '취소 버튼 표시' },
  { name: 'PopoverMenu · showConfirm', type: 'boolean', default: 'true', desc: '확인 버튼 표시' },
  { name: 'PopoverMenu · width', type: 'number | string', default: '304', desc: '팝오버 너비' },
  { name: 'PopoverMenu · className', type: 'string', default: "''", desc: '추가 클래스' },
];

const SAMPLE = Array.from({ length: 12 }, (_, i) => `옵션 ${i + 1}`);

// 검색 가능한 팝오버 — 검색어로 필터. 결과가 없으면 ListGroup이 내부에서 빈 상태 표시.
function SearchablePopover() {
  const [q, setQ] = useState('');
  const filtered = SAMPLE.filter((s) => s.includes(q.trim()));
  return (
    <PopoverMenu topArea="search" searchValue={q} onSearchChange={(e) => setQ(e.target.value)}>
      <ListGroup>
        {filtered.map((s) => (
          <List key={s} title={s} tag endIcon rightButton />
        ))}
      </ListGroup>
    </PopoverMenu>
  );
}

// 실시간 옵션 토글 플레이그라운드 — 각 요소(슬롯)와 행 상태를 체크박스로 끄고 켠다.
// (TableTemplate 페이지의 Playground와 동일한 패턴)
const PLAYGROUND_ROWS = [
  { id: 'r1', title: '알림 받기' },
  { id: 'r2', title: '마케팅 수신 동의' },
  { id: 'r3', title: '위치 정보 사용' },
];

function Playground() {
  const [opts, setOpts] = useState({
    // left 슬롯
    tag: false, icon: true, checkbox: true,
    // right 슬롯
    showSwitch: true, rightButton: true, endIcon: false,
    // 행 상태
    selected: false, disabled: false,
  });
  const toggle = (k) => setOpts((o) => ({ ...o, [k]: !o[k] }));

  // 행별 체크박스/스위치 상태(controlled)
  const [checks, setChecks] = useState({ r1: true, r2: false, r3: false });
  const [switches, setSwitches] = useState({ r1: true, r2: false, r3: false });

  return (
    <div>
      <div className="mb-spacing-7 rounded-round-4 border border-base-gray-100 px-spacing-7 py-spacing-6">
        {/* 슬롯(요소) + 행 상태 — 한 줄 */}
        <div className="flex min-h-[32px] flex-nowrap items-center gap-x-spacing-7 whitespace-nowrap">
          <Checkbox checked={opts.tag}         onChange={() => toggle('tag')}         label="태그" />
          <Checkbox checked={opts.icon}        onChange={() => toggle('icon')}        label="아이콘" />
          <Checkbox checked={opts.checkbox}    onChange={() => toggle('checkbox')}    label="체크박스" />
          <Checkbox checked={opts.showSwitch}  onChange={() => toggle('showSwitch')}  label="스위치" />
          <Checkbox checked={opts.rightButton} onChange={() => toggle('rightButton')} label="더보기(⋯)" />
          <Checkbox checked={opts.endIcon}     onChange={() => toggle('endIcon')}     label="chevron(>)" />
          <Checkbox checked={opts.selected}    onChange={() => toggle('selected')}    label="selected" />
          <Checkbox checked={opts.disabled}    onChange={() => toggle('disabled')}    label="disabled" />
        </div>
      </div>

      {/* 결과 목록 */}
      <div>
        <div className="w-[304px] overflow-hidden rounded-round-4 border border-list-popover-outline">
          {PLAYGROUND_ROWS.map((r) => (
            <List
              key={r.id}
              title={r.title}
              tag={opts.tag}
              icon={opts.icon ? User : null}
              checkbox={opts.checkbox}
              checked={checks[r.id]}
              onCheckChange={(e) => setChecks((s) => ({ ...s, [r.id]: e.target.checked }))}
              showSwitch={opts.showSwitch}
              switchChecked={switches[r.id]}
              onSwitchChange={(e) => setSwitches((s) => ({ ...s, [r.id]: e.target.checked }))}
              rightButton={opts.rightButton}
              endIcon={opts.endIcon}
              selected={opts.selected}
              disabled={opts.disabled}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// 푸터 데모 한 칸 — 목록 체크박스를 controlled로 묶어 좌측 기능이 실제 동작하게 한다.
// variant: 'count'(선택 개수 텍스트) | 'guide'(가이드 문구) | 'checkbox'(전체 선택) | 'reset'(초기화)
function FooterDemo({ variant, label }) {
  const rows = SAMPLE.slice(0, 6);
  const [checked, setChecked] = useState({});
  const selectedCount = rows.filter((r) => checked[r]).length;
  const allSelected = selectedCount === rows.length;

  const toggleRow = (r, val) => setChecked((c) => ({ ...c, [r]: val }));
  const selectAll = (val) =>
    setChecked(val ? Object.fromEntries(rows.map((r) => [r, true])) : {});
  const reset = () => setChecked({});

  const footerProps = {
    count: { footerText: `${selectedCount}개 선택됨` },
    guide: { footerText: '가이드 문구가 들어갑니다.' },
    checkbox: {
      footerCheckbox: true,
      footerChecked: allSelected,
      onFooterCheckChange: (e) => selectAll(e.target.checked),
    },
    reset: { footerReset: true, onFooterReset: reset },
  }[variant];

  return (
    <div>
      <p className="mb-spacing-4 text-12 text-font-icon-3">{label}</p>
      <PopoverMenu topArea="search" onSearchChange={() => {}} footer {...footerProps}>
        <ListGroup maxVisible={6}>
          {rows.map((r) => (
            <List
              key={r}
              title={r}
              tag
              checkbox
              checked={!!checked[r]}
              onCheckChange={(e) => toggleRow(r, e.target.checked)}
            />
          ))}
        </ListGroup>
      </PopoverMenu>
    </div>
  );
}

// 입력 영역 + fill 버튼 팝오버 — 목록 없이 input area + 전체폭 버튼 그룹(Figma input button1·input button2).
function InputPopovers() {
  const [url, setUrl] = useState('');
  const [img, setImg] = useState('');
  return (
    <div className="flex flex-wrap items-start gap-spacing-9">
      <div>
        <p className="mb-spacing-4 text-12 text-font-icon-3">input button1 — 입력 + 해제/저장 (fill)</p>
        <PopoverMenu
          topArea="input"
          inputValue={url}
          onInputChange={(e) => setUrl(e.target.value)}
          inputPlaceholder="http://example.com"
          footer
          footerButtonsFill
          cancelText="해제"
          confirmText="저장"
          onCancel={() => setUrl('')}
        >
          {null}
        </PopoverMenu>
      </div>
      <div>
        <p className="mb-spacing-4 text-12 text-font-icon-3">input button2 — 입력 + 저장 단일 버튼 (fill)</p>
        <PopoverMenu
          topArea="input"
          inputValue={img}
          onInputChange={(e) => setImg(e.target.value)}
          inputPlaceholder="이미지 링크를 입력하세요"
          footer
          footerButtonsFill
          showCancel={false}
          confirmText="저장"
        >
          {null}
        </PopoverMenu>
      </div>
    </div>
  );
}

// 푸터가 있는 팝오버 — Figma의 4가지 좌측 슬롯(개수 텍스트·가이드 텍스트·전체 선택 체크박스·초기화 버튼).
function FooterPopovers() {
  return (
    <div className="flex flex-wrap items-start gap-spacing-9">
      <FooterDemo variant="count" label="좌측: 선택 개수 텍스트 (footerText)" />
      <FooterDemo variant="guide" label="좌측: 가이드 문구 (footerText)" />
      <FooterDemo variant="checkbox" label="좌측: 전체 선택 체크박스 (footerCheckbox)" />
      <FooterDemo variant="reset" label="좌측: 초기화 버튼 (footerReset)" />
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h3 className="mb-spacing-5 text-15 font-semibold text-font-icon-5">
      {children}
    </h3>
  );
}

export function OptionListPage() {
  return (
    <section className="mx-auto max-w-5xl px-spacing-7 py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-20 font-semibold text-font-icon-5">Option List</h2>
      <p className="mb-spacing-8 text-14 text-font-icon-4">
        드롭다운 옵션 목록 시스템 — List · ListGroup · PopoverMenu (빈 상태 ListEmpty는 ListGroup 내장).<br />
        색상은 모두 list 시멘틱 토큰(base 경유)을 사용합니다. 현재는 컴포넌트 단위이며,
        Select와의 연결은 다음 단계입니다. (Tag는 별도 페이지)
      </p>

      <UsageExample code={USAGE} props={USAGE_PROPS} note="이 페이지의 세 컴포넌트(List · ListGroup · PopoverMenu)의 전체 옵션을 한 표에 모았습니다. 빈 상태(ListEmpty)는 ListGroup 내부에서 처리됩니다." />

      {/* List — Playground: 요소 끄고 켜기 */}
      <div className="mb-spacing-9">
        <SectionTitle>List — Playground (요소 끄고 켜기)</SectionTitle>
        <p className="mb-spacing-5 text-12 text-font-icon-4">
          체크박스로 각 슬롯(left: <code className="text-font-icon-5">태그·아이콘·체크박스</code> / right:{' '}
          <code className="text-font-icon-5">스위치·더보기·chevron</code>)과 행 상태(selected·disabled)를
          실시간으로 토글해 보세요. 모두 개별 props라 자유롭게 조합됩니다. 행의 체크박스·스위치는 행 클릭과
          분리되어(클릭 전파 차단) 각자 토글되고, disabled 행은 전체가 비활성화됩니다.
        </p>
        <Playground />
      </div>

      {/* ListGroup — 기본 / 빈 상태 */}
      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div>
        <SectionTitle>ListGroup — 기본 / 빈 상태</SectionTitle>
        <p className="mb-spacing-7 text-12 text-font-icon-4">
          <code className="text-font-icon-5">maxVisible</code>(기본 6) 초과 시 내부 스크롤합니다.
          항목이 없으면 빈 상태(ListEmpty)를 그룹 안에서 렌더해 패딩·배경을 그대로 따르며,
          자식이 없으면 자동 · <code className="text-font-icon-5">empty</code>로 강제할 수 있습니다.
        </p>
        <div className="flex flex-wrap items-start gap-spacing-9">
          <div>
            <p className="mb-spacing-4 text-12 text-font-icon-3">기본 (6개 초과 → 내부 스크롤)</p>
            <div className="w-[304px] overflow-hidden rounded-round-4 border border-list-popover-outline">
              <ListGroup>
                {SAMPLE.map((s) => (
                  <List key={s} title={s} tag rightButton endIcon />
                ))}
              </ListGroup>
            </div>
          </div>
          <div>
            <p className="mb-spacing-4 text-12 text-font-icon-3">빈 상태 (empty)</p>
            <div className="w-[304px] overflow-hidden rounded-round-4 border border-list-popover-outline">
              <ListGroup empty />
            </div>
          </div>
        </div>
      </div>

      {/* PopoverMenu — 검색바 없음 / 있음 */}
      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div>
        <SectionTitle>PopoverMenu — 검색바 없음 / 있음</SectionTitle>
        <p className="mb-spacing-7 text-12 text-font-icon-4">
          <code className="text-font-icon-5">topArea="search"</code>로 상단 검색바를 켭니다(기본 <code className="text-font-icon-5">'none'</code>).
          검색바가 있으면 입력으로 목록을 필터링하고, 결과가 없으면 List Empty가 표시됩니다.
        </p>
        <div className="flex flex-wrap items-start gap-spacing-9">
          <div>
            <p className="mb-spacing-4 text-12 text-font-icon-3">검색바 없음</p>
            <PopoverMenu>
              <ListGroup>
                {SAMPLE.slice(0, 5).map((s) => (
                  <List key={s} title={s} tag rightButton endIcon />
                ))}
              </ListGroup>
            </PopoverMenu>
          </div>
          <div>
            <p className="mb-spacing-4 text-12 text-font-icon-3">검색바 있음 (입력 시 필터)</p>
            <SearchablePopover />
          </div>
          <div>
            <p className="mb-spacing-4 text-12 text-font-icon-3">검색바 있음 — 결과 없음</p>
            <PopoverMenu topArea="search" searchValue="없는 옵션" onSearchChange={() => {}}>
              <ListGroup empty />
            </PopoverMenu>
          </div>
        </div>
      </div>

      {/* PopoverMenu — 푸터 영역 */}
      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div>
        <SectionTitle>PopoverMenu — 푸터 영역</SectionTitle>
        <p className="mb-spacing-7 text-12 text-font-icon-4">
          <code className="text-font-icon-5">footer</code> 옵션으로 하단 푸터를 켭니다. 좌측{' '}
          <code className="text-font-icon-5">footerStart</code> 슬롯에는 선택 개수·가이드 문구(문자열)나
          체크박스·언더라인 버튼 같은 임의 노드를 넣을 수 있고, 우측에는 취소/확인 버튼이 들어갑니다
          (<code className="text-font-icon-5">showCancel·showConfirm</code>으로 개별 on/off,{' '}
          <code className="text-font-icon-5">confirmDisabled·confirmLoading</code> 지원).
        </p>
        <FooterPopovers />
      </div>

      {/* PopoverMenu — 입력 영역 + fill 버튼 */}
      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div>
        <SectionTitle>PopoverMenu — 입력 영역 + fill 버튼</SectionTitle>
        <p className="mb-spacing-7 text-12 text-font-icon-4">
          <code className="text-font-icon-5">topArea="input"</code>은 검색 아이콘 없는 일반 텍스트 입력 영역을
          상단에 둡니다(<code className="text-font-icon-5">'search'</code> 대신). 푸터의{' '}
          <code className="text-font-icon-5">footerButtonsFill</code>은 좌측 슬롯 없이 취소/확인 버튼을
          fill(균등 분할 전체폭)로 채웁니다. <code className="text-font-icon-5">showCancel={'{false}'}</code>로
          저장 단일 버튼만 둘 수도 있습니다(링크·이미지 URL 입력 등).
        </p>
        <InputPopovers />
      </div>
    </section>
  );
}
