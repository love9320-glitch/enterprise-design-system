import { Users, ChevronDown, MoreHorizontal } from 'lucide-react';
import { Button } from '../components/Button';
import { ButtonGroup } from '../components/ButtonGroup';
import { Popover } from '../components/Popover';
import { PopoverMenu } from '../components/PopoverMenu';
import { ListGroup } from '../components/ListGroup';
import { List } from '../components/List';
import { UsageExample } from '../components/UsageExample';

const GROUP_USAGE = `import { ButtonGroup } from '../components/ButtonGroup';
import { Button } from '../components/Button';

// 버튼들을 8px(기본) 간격으로 묶음
<ButtonGroup>
  <Button variant="line">취소</Button>
  <Button>확인</Button>
</ButtonGroup>

// 간격 변경 — gap은 spacing 토큰 키('3'~'7'). 기본 '5'(8px)
<ButtonGroup gap="4">{/* 6px */}…</ButtonGroup>
<ButtonGroup gap="7">{/* 16px */}…</ButtonGroup>

// 세로 배치 (간격은 동일 8px 기본 · gap 토큰으로 조절 가능)
<ButtonGroup direction="vertical">
  <Button>위</Button>
  <Button>아래</Button>
</ButtonGroup>`;

const GROUP_PROPS = [
  { name: 'children', type: 'ReactNode', default: '—', desc: '묶을 Button들' },
  { name: 'direction', type: "'horizontal' | 'vertical'", default: "'horizontal'", desc: '버튼 배치 방향' },
  { name: 'gap', type: "'3' | '4' | '5' | '6' | '7'", default: "'5'", desc: "버튼 간격 토큰 — '5'=8px(기본), '7'=16px 등" },
  { name: 'className', type: 'string', default: "''", desc: '추가 클래스' },
];

const POPOVER_USAGE = `import { Popover } from '../components/Popover';
import { PopoverMenu } from '../components/PopoverMenu';
import { ListGroup } from '../components/ListGroup';
import { List } from '../components/List';
import { ChevronDown } from 'lucide-react';

// 버튼을 트리거로 메뉴 띄우기 — children은 close를 받는 함수
<Popover
  menuWidth={180}
  trigger={<Button variant="line" rightIcon={ChevronDown}>메뉴</Button>}
>
  {(close) => (
    <PopoverMenu width="100%">
      <ListGroup>
        <List title="이름 변경" onClick={close} />
        <List title="삭제" onClick={close} />
      </ListGroup>
    </PopoverMenu>
  )}
</Popover>

// 펼침 방향 수동 지정
<Popover placement="bottom-right" trigger={<Button icon={MoreHorizontal} />}>…</Popover>`;

const POPOVER_PROPS = [
  { name: 'trigger', type: 'ReactNode', default: '—', desc: '클릭 시 패널을 토글하는 트리거(예: Button)' },
  { name: 'children', type: 'ReactNode | (close) => ReactNode', default: '—', desc: '패널 내용(보통 PopoverMenu). 함수면 close를 받아 항목 클릭 시 닫음' },
  { name: 'placement', type: "'auto' | '{top|bottom|auto}-{left|right|auto}'", default: "'auto'", desc: "펼침 방향. 축별 auto 지원 — 'auto-right'=상하 자동·우측 고정, 'bottom-auto'=하단 고정·좌우 자동" },
  { name: 'menuWidth', type: 'number | string', default: '트리거 너비', desc: '패널 너비. 미지정 시 트리거와 동일' },
  { name: 'open / onOpenChange', type: 'boolean / (open) => void', default: '—', desc: '열림 상태를 외부에서 제어할 때' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '트리거 비활성 — 열기 차단' },
];

const USAGE = `import { Button } from '../components/Button';
import { Users } from 'lucide-react';

// 기본
<Button>다음 단계</Button>

// variant(fill·line·ghost·underline) × size(32·24)
<Button variant="line" size="24">취소</Button>
<Button variant="ghost">더보기</Button>
<Button variant="underline">다음 단계</Button>   // 밑줄 텍스트 버튼(hover 시 밑줄)

// 아이콘 — 컴포넌트 자체를 prop으로 전달(<Users /> 아님)
<Button leftIcon={Users}>멤버</Button>
<Button icon={Users} aria-label="멤버" />   // 아이콘 전용

// 상태
<Button disabled>비활성</Button>
<Button loading onClick={save}>저장</Button>`;

const USAGE_PROPS = [
  { name: 'children', type: 'ReactNode', default: '—', desc: '버튼 라벨/내용 (icon 전용일 땐 생략)' },
  { name: 'variant', type: "'fill' | 'line' | 'ghost' | 'underline'", default: "'fill'", desc: '주요(fill)·보조(line)·서브(ghost)·밑줄 텍스트(underline) 종류' },
  { name: 'size', type: "'32' | '24'", default: "'32'", desc: '버튼 높이(px)' },
  { name: 'leftIcon', type: 'lucide 컴포넌트', default: 'null', desc: '텍스트 왼쪽 아이콘 (컴포넌트 자체를 전달)' },
  { name: 'rightIcon', type: 'lucide 컴포넌트', default: 'null', desc: '텍스트 오른쪽 아이콘' },
  { name: 'icon', type: 'lucide 컴포넌트', default: 'null', desc: '아이콘 전용 버튼(텍스트 없음)' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '비활성 — 흐림 처리 + 클릭 차단' },
  { name: 'loading', type: 'boolean', default: 'false', desc: '로딩 상태 — 클릭 차단' },
  { name: 'truncate', type: 'boolean', default: 'false', desc: '라벨이 부모 폭을 넘으면 말줄임 + hover 시 전체 텍스트 툴팁(좁은 셀용)' },
  { name: 'onClick', type: '(e) => void', default: '—', desc: '클릭 핸들러 (비활성/로딩 시 차단)' },
  { name: 'className', type: 'string', default: "''", desc: '추가 클래스 (나머지 속성은 ...props로 전달)' },
];

const BUTTON_ROWS = [
  { rowLabel: 'Text only',  btnProps: {},                   text: '다음 단계' },
  { rowLabel: 'Left icon',  btnProps: { leftIcon: Users },  text: '다음 단계' },
  { rowLabel: 'Right icon', btnProps: { rightIcon: Users }, text: '다음 단계' },
  { rowLabel: 'Icon only',  btnProps: { icon: Users } },
];

const BUTTON_STATES = [
  { label: 'Default',  extra: {} },
  { label: 'Disabled', extra: { disabled: true } },
  { label: 'Loading',  extra: { loading: true } },
];

function VariantBlock({ variant, label, tinted = false, rows = BUTTON_ROWS }) {
  return (
    <div className="mb-spacing-7 overflow-hidden rounded-round-4 border border-base-gray-100">
      <div className="border-b border-base-gray-100 bg-white px-spacing-7 py-spacing-5">
        <p className="text-16 font-semibold text-base-gray-900">{label}</p>
      </div>

      <div className={`px-spacing-7 py-spacing-7 ${tinted ? 'bg-base-gray-50' : 'bg-white'}`}>
        {['32', '24'].map((size, idx) => (
          <div
            key={size}
            className={idx > 0 ? 'mt-spacing-8 border-t border-base-gray-100 pt-spacing-8' : ''}
          >
            <p className="mb-spacing-5 text-14 font-semibold uppercase tracking-wide text-font-icon-3">
              Size {size}
            </p>

            <div className="mb-spacing-3 grid grid-cols-[80px_1fr_1fr_1fr] items-center gap-x-spacing-5">
              <div />
              {BUTTON_STATES.map(({ label: s }) => (
                <p key={s} className="text-center text-xs text-font-icon-3">{s}</p>
              ))}
            </div>

            <div className="space-y-spacing-4">
              {rows.map(({ rowLabel, btnProps, text }) => (
                <div
                  key={rowLabel}
                  className="grid grid-cols-[80px_1fr_1fr_1fr] items-center gap-x-spacing-5"
                >
                  <p className="text-xs text-font-icon-3">{rowLabel}</p>
                  {BUTTON_STATES.map(({ label: s, extra }) => (
                    <div key={s} className="flex justify-center">
                      <Button variant={variant} size={size} {...btnProps} {...extra}>
                        {text}
                      </Button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ButtonPage() {
  return (
    <section className="mx-auto max-w-5xl px-spacing-7 py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-20 font-semibold">Button</h2>
      <p className="mb-spacing-8 text-14 text-font-icon-4">
        Fill · Ghost · Line · Underline — 4가지 variant × 2가지 사이즈 × 레이아웃 × 3가지 상태
      </p>

      <UsageExample code={USAGE} props={USAGE_PROPS} note="아이콘은 lucide-react 컴포넌트를 그대로 prop으로 넘깁니다." />

      <VariantBlock variant="fill" label="Fill (Primary Button)" />
      <VariantBlock variant="line" label="Line (Secondary Button)" />
      <VariantBlock variant="ghost" label="Ghost (Third Button)" tinted />
      {/* Underline — 배경 없이 밑줄(hover) 텍스트 버튼. 아이콘 전용은 의미가 없어 제외 */}
      <VariantBlock variant="underline" label="Underline (Text Button)" rows={BUTTON_ROWS.slice(0, 3)} />

      {/* Button Group — 버튼들을 8px 간격으로 묶음 */}
      <div className="mt-spacing-9 border-t border-base-gray-100 pt-spacing-8">
        <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">Button Group</h3>
        <p className="mb-spacing-7 text-14 text-font-icon-4">
          버튼과 버튼들을 모아 일정한 간격으로 배치합니다. 기본 간격은{' '}
          <code className="text-font-icon-3">8px</code>(<code className="text-font-icon-3">gap='5'</code>)이며,
          <code className="text-font-icon-3"> direction</code>으로 가로/세로,{' '}
          <code className="text-font-icon-3">gap</code> 토큰으로 간격을 바꿀 수 있습니다.
        </p>

        <UsageExample code={GROUP_USAGE} props={GROUP_PROPS} title="Button Group 사용 예시" />

        <div className="space-y-spacing-8">
          <div>
            <p className="mb-spacing-4 text-12 text-font-icon-3">기본 (가로 · 8px)</p>
            <ButtonGroup>
              <Button variant="line">취소</Button>
              <Button>확인</Button>
            </ButtonGroup>
          </div>

          <div>
            <p className="mb-spacing-4 text-12 text-font-icon-3">3개 이상 · size 24</p>
            <ButtonGroup>
              <Button variant="ghost" size="24">이전</Button>
              <Button variant="line" size="24">임시저장</Button>
              <Button size="24">다음</Button>
            </ButtonGroup>
          </div>

          <div>
            <p className="mb-spacing-4 text-12 text-font-icon-3">세로 (direction="vertical" · 8px)</p>
            <ButtonGroup direction="vertical">
              <Button leftIcon={Users}>멤버 추가</Button>
              <Button variant="line">초대 링크 복사</Button>
            </ButtonGroup>
          </div>
        </div>
      </div>

      {/* Popover — 버튼을 트리거로 PopoverMenu 띄우기 */}
      <div className="mt-spacing-9 border-t border-base-gray-100 pt-spacing-8">
        <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">버튼 + 팝오버 메뉴 (Popover)</h3>
        <p className="mb-spacing-7 text-14 text-font-icon-4">
          <code className="text-font-icon-3">Popover</code>의 <code className="text-font-icon-3">trigger</code>에
          Button을 넣어 클릭 시 <code className="text-font-icon-3">PopoverMenu</code>를 띄웁니다. 항목 클릭·외부
          클릭·<span className="text-font-icon-5">Esc</span>로 닫히고, 뷰포트 공간에 맞춰 위/아래·좌/우로 자동
          정렬됩니다. 패널 내용은 <code className="text-font-icon-3">children(close =&gt; …)</code>로 자유롭게 구성합니다.
        </p>

        <UsageExample
          code={POPOVER_USAGE}
          props={POPOVER_PROPS}
          title="Popover 사용 예시"
          note="trigger는 Button뿐 아니라 임의의 요소를 쓸 수 있습니다. menuWidth로 패널 너비를 지정하고 PopoverMenu는 width=100%로 채웁니다."
        />

        <div className="flex flex-wrap items-start gap-spacing-9">
          <div>
            <p className="mb-spacing-4 text-12 text-font-icon-3">Line 버튼 + 화살표</p>
            <Popover
              menuWidth={180}
              trigger={<Button variant="line" rightIcon={ChevronDown}>메뉴</Button>}
            >
              {(close) => (
                <PopoverMenu width="100%">
                  <ListGroup>
                    <List title="이름 변경" onClick={close} />
                    <List title="복제" onClick={close} />
                    <List title="삭제" onClick={close} />
                  </ListGroup>
                </PopoverMenu>
              )}
            </Popover>
          </div>

          <div>
            <p className="mb-spacing-4 text-12 text-font-icon-3">아이콘 버튼 · 우측 정렬 + 상하 자동</p>
            <Popover
              menuWidth={80}
              placement="auto-right"
              trigger={<Button variant="ghost" icon={MoreHorizontal} aria-label="더보기" />}
            >
              {(close) => (
                <PopoverMenu width="100%">
                  <ListGroup>
                    <List title="공유" onClick={close} />
                    <List title="내보내기" onClick={close} />
                    <List title="신고" onClick={close} />
                  </ListGroup>
                </PopoverMenu>
              )}
            </Popover>
          </div>

          <div>
            <p className="mb-spacing-4 text-12 text-font-icon-3">아이콘 버튼 · 좌측 정렬 + 상하 자동</p>
            <Popover
              menuWidth={160}
              placement="auto-left"
              trigger={<Button variant="ghost" icon={MoreHorizontal} aria-label="옵션" />}
            >
              {(close) => (
                <PopoverMenu width="100%">
                  <ListGroup>
                    <List title="공유" onClick={close} />
                    <List title="내보내기" onClick={close} />
                    <List title="신고" onClick={close} />
                  </ListGroup>
                </PopoverMenu>
              )}
            </Popover>
          </div>
        </div>
      </div>
    </section>
  );
}
