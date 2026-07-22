import { Fragment } from 'react';
import { Users, ChevronDown, MoreHorizontal, Copy, Trash2, Pencil, Download } from 'lucide-react';
import { Button } from '../components/Button';
import { ButtonGroup } from '../components/ButtonGroup';
import { Popover } from '../components/Popover';
import { PopoverMenu } from '../components/PopoverMenu';
import { ListGroup } from '../components/ListGroup';
import { List } from '../components/List';
import { UsageExample } from '../components/UsageExample';
import { Divider } from '../components/Divider';

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
</ButtonGroup>

// 부모 전체 폭 — 버튼들이 균등 분할 (width="fill")
<ButtonGroup width="fill">
  <Button variant="line">취소</Button>
  <Button>확인</Button>
</ButtonGroup>`;

const GROUP_PROPS = [
  { name: 'children', type: 'ReactNode', default: '—', desc: '묶을 Button들' },
  { name: 'direction', type: "'horizontal' | 'vertical'", default: "'horizontal'", desc: '버튼 배치 방향' },
  { name: 'gap', type: "'3' | '4' | '5' | '6' | '7'", default: "'5'", desc: "버튼 간격 토큰 — '5'=8px(기본), '7'=16px 등" },
  { name: 'width', type: "'hug' | 'fill'", default: "'hug'", desc: 'fill=부모 전체 폭, Button 자식들 균등 분할' },
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

const ASCHILD_USAGE = `import { Button } from '@gusun/design-system';

// 1) 외부 링크를 버튼처럼 — <a>가 루트로 렌더되고 버튼 스타일·동작을 입는다
<Button asChild variant="fill">
  <a href="/docs">문서 보기</a>
</Button>

// 2) 아이콘 + 라우터 Link (react-router 등)
<Button asChild variant="line" leftIcon={ChevronDown}>
  <Link to="/settings">설정으로</Link>
</Button>

// 3) 밑줄 링크
<Button asChild variant="underline" color="blue">
  <a href="/more">더 보기</a>
</Button>

// asChild 없이 쓰면 기존과 동일하게 <button>으로 렌더된다(기본값 false)
<Button variant="fill" onClick={save}>저장</Button>`;

const USAGE_PROPS = [
  { name: 'children', type: 'ReactNode', default: '—', desc: '버튼 라벨/내용 (icon 전용일 땐 생략)' },
  { name: 'variant', type: "'fill' | 'line' | 'ghost' | 'underline'", default: "'fill'", desc: '주요(fill)·보조(line)·서브(ghost)·밑줄 텍스트(underline) 종류' },
  { name: 'color', type: "'black' | 'red' | 'blue' | 'green' | 'violet' | 'pink' | 'orange'", default: "'black'", desc: 'underline 전용 색 — 칩 컬러 대응(gray 제외), black=기존 색' },
  { name: 'weight', type: "'normal' | 'semibold'", default: "'normal'", desc: 'underline 전용 텍스트 두께' },
  { name: 'asChild', type: 'boolean', default: 'false', desc: 'true면 <button> 대신 자식 엘리먼트(단일)를 루트로 렌더하고 스타일·동작을 머지 — 링크를 버튼처럼(Slot 합성). children이 유효한 단일 엘리먼트여야 하고 그 내용이 라벨이 됨' },
  { name: 'size', type: "'32' | '24' | '18'", default: "'32'", desc: "버튼 높이(px). 18은 아이콘 전용 소형(버튼 18×18·아이콘 14×14)" },
  { name: 'leftIcon', type: 'lucide 컴포넌트', default: 'null', desc: '텍스트 왼쪽 아이콘 (컴포넌트 자체를 전달)' },
  { name: 'rightIcon', type: 'lucide 컴포넌트', default: 'null', desc: '텍스트 오른쪽 아이콘' },
  { name: 'icon', type: 'lucide 컴포넌트', default: 'null', desc: '아이콘 전용 버튼(텍스트 없음) — hover 시 명칭 툴팁 자동 표시(문구=tooltip ?? aria-label)' },
  { name: 'showTooltip', type: 'boolean', default: 'true', desc: '아이콘 전용 버튼 hover 명칭 툴팁 on/off' },
  { name: 'tooltip', type: 'string', default: '—', desc: '툴팁 문구 커스텀. 미지정 시 aria-label 사용' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '비활성 — 흐림 처리 + 클릭 차단' },
  { name: 'loading', type: 'boolean', default: 'false', desc: '로딩 상태 — 클릭 차단' },
  { name: 'truncate', type: 'boolean', default: 'false', desc: '라벨이 부모 폭을 넘으면 말줄임 + hover 시 전체 텍스트 툴팁(좁은 셀용)' },
  { name: 'width', type: "'hug' | 'fill'", default: "'hug'", desc: "fill=부모 전체 폭(width:100%). underline 변형엔 미적용" },
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
          <Fragment key={size}>
            {idx > 0 && <Divider className="mt-spacing-8 mb-spacing-8" />}
            <div>
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
          </Fragment>
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

      {/* Underline 컬러 — black(기본)+칩 컬러 대응 6색(2026-07-15, gray 제외) */}
      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div>
        <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">Underline — 컬러</h3>
        <p className="mb-spacing-7 text-12 text-font-icon-4">
          <code className="text-font-icon-5">color</code>로 밑줄 텍스트 버튼 색을 지정합니다 —
          black(기본) + 칩 컬러 대응 6색(red/blue/green/violet/pink/orange).
        </p>
        <div className="flex flex-wrap items-center gap-spacing-7">
          {['black', 'red', 'blue', 'green', 'violet', 'pink', 'orange'].map((c) => (
            <Button key={c} variant="underline" color={c}>
              {c}
            </Button>
          ))}
        </div>
        <p className="mb-spacing-4 mt-spacing-7 text-12 text-font-icon-3">weight="semibold"</p>
        <div className="flex flex-wrap items-center gap-spacing-7">
          {['black', 'blue', 'violet'].map((c) => (
            <Button key={c} variant="underline" color={c} weight="semibold">
              {c} semibold
            </Button>
          ))}
        </div>
      </div>

      {/* 아이콘 전용 버튼 — hover 툴팁 */}
      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div>
        <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">아이콘 전용 버튼 — hover 툴팁</h3>
        <p className="mb-spacing-7 text-14 text-font-icon-4">
          <code className="text-font-icon-3">icon</code>만 있는 버튼은 명칭이 안 보이므로 hover 시
          툴팁으로 알려줍니다. 문구는 <code className="text-font-icon-3">tooltip</code> prop, 없으면{' '}
          <code className="text-font-icon-3">aria-label</code>을 씁니다(마우스를 올려보세요).{' '}
          <code className="text-font-icon-3">showTooltip=&#123;false&#125;</code>로 끌 수 있습니다.
        </p>
        <div className="flex items-center gap-spacing-5">
          <Button variant="ghost" icon={Copy} aria-label="복사" />
          <Button variant="ghost" icon={Pencil} aria-label="수정" />
          <Button variant="ghost" icon={Trash2} aria-label="삭제" />
          <Button variant="line" icon={Download} tooltip="내보내기" />
          <Button variant="ghost" size="24" icon={MoreHorizontal} aria-label="더보기" />
        </div>
        <p className="mb-spacing-4 mt-spacing-7 text-12 text-font-icon-3">showTooltip=&#123;false&#125; — 툴팁 없음</p>
        <div className="flex items-center gap-spacing-5">
          <Button variant="ghost" icon={Copy} aria-label="복사" showTooltip={false} />
          <Button variant="ghost" icon={Trash2} aria-label="삭제" showTooltip={false} />
        </div>
        <p className="mb-spacing-4 mt-spacing-7 text-12 text-font-icon-3">size — 32 / 24 / 18(소형, 버튼 18·아이콘 14)</p>
        <div className="flex items-center gap-spacing-5">
          <Button variant="ghost" size="32" icon={Trash2} aria-label="삭제 32" />
          <Button variant="ghost" size="24" icon={Trash2} aria-label="삭제 24" />
          <Button variant="ghost" size="18" icon={Trash2} aria-label="삭제 18" />
        </div>
      </div>

      {/* Width fill — 부모 전체 폭 (underline 제외) */}
      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div>
        <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">Width: fill</h3>
        <p className="mb-spacing-7 text-14 text-font-icon-4">
          <code className="text-font-icon-3">width="fill"</code>이면 버튼이 부모 너비를 100% 채웁니다(밑줄 텍스트 버튼은 제외).
        </p>
        <div className="max-w-[360px] space-y-spacing-5">
          <Button variant="fill" width="fill">저장</Button>
          <Button variant="line" width="fill">취소</Button>
          <Button variant="ghost" width="fill">더 보기</Button>
        </div>

        <p className="mb-spacing-5 mt-spacing-8 text-14 text-font-icon-4">
          <code className="text-font-icon-3">ButtonGroup width="fill"</code>이면 버튼들이 부모 폭을 균등 분할합니다.
        </p>
        <div className="max-w-[360px]">
          <ButtonGroup width="fill">
            <Button variant="line">취소</Button>
            <Button variant="fill">확인</Button>
          </ButtonGroup>
        </div>
      </div>

      {/* Button Group — 버튼들을 8px 간격으로 묶음 */}
      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div>
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
      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div>
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

      {/* asChild — 링크를 버튼처럼(Slot 합성) */}
      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div>
        <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">asChild — 링크를 버튼처럼</h3>
        <p className="mb-spacing-6 text-13 text-font-icon-4">
          <code className="rounded-round-3 bg-base-gray-50 px-spacing-3 py-spacing-1 text-12">asChild</code>를 주면
          <code className="mx-spacing-2 rounded-round-3 bg-base-gray-50 px-spacing-3 py-spacing-1 text-12">&lt;button&gt;</code> 대신
          자식 엘리먼트(예: <code className="rounded-round-3 bg-base-gray-50 px-spacing-3 py-spacing-1 text-12">&lt;a&gt;</code>)를 루트로
          렌더하고 버튼 스타일·동작을 그 엘리먼트에 머지합니다. 유효하지 않은 중첩(<code className="rounded-round-3 bg-base-gray-50 px-spacing-3 py-spacing-1 text-12">&lt;a&gt;&lt;button&gt;</code>) 없이
          &ldquo;버튼처럼 보이는 링크&rdquo;를 만들 수 있습니다.
        </p>
        <div className="flex flex-wrap items-center gap-spacing-5">
          <Button asChild variant="fill">
            <a href="#button" onClick={(e) => e.preventDefault()}>fill 링크</a>
          </Button>
          <Button asChild variant="line" leftIcon={ChevronDown}>
            <a href="#button" onClick={(e) => e.preventDefault()}>line 링크(아이콘)</a>
          </Button>
          <Button asChild variant="underline" color="blue">
            <a href="#button" onClick={(e) => e.preventDefault()}>underline 링크</a>
          </Button>
        </div>
        <div className="mt-spacing-7">
          <UsageExample
            code={ASCHILD_USAGE}
            note="asChild를 주면 children(단일 엘리먼트)이 루트가 되고, 그 내용이 라벨이 됩니다. 라우터 Link·외부 링크에 그대로 적용됩니다."
          />
        </div>
      </div>
    </section>
  );
}
