import { Users } from 'lucide-react';
import { Button } from '../components/Button';
import { ButtonGroup } from '../components/ButtonGroup';
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

const USAGE = `import { Button } from '../components/Button';
import { Users } from 'lucide-react';

// 기본
<Button>다음 단계</Button>

// variant(fill·line·ghost) × size(32·24)
<Button variant="line" size="24">취소</Button>
<Button variant="ghost">더보기</Button>

// 아이콘 — 컴포넌트 자체를 prop으로 전달(<Users /> 아님)
<Button leftIcon={Users}>멤버</Button>
<Button icon={Users} aria-label="멤버" />   // 아이콘 전용

// 상태
<Button disabled>비활성</Button>
<Button loading onClick={save}>저장</Button>`;

const USAGE_PROPS = [
  { name: 'children', type: 'ReactNode', default: '—', desc: '버튼 라벨/내용 (icon 전용일 땐 생략)' },
  { name: 'variant', type: "'fill' | 'line' | 'ghost'", default: "'fill'", desc: '주요(fill)·보조(line)·서브(ghost) 색상 종류' },
  { name: 'size', type: "'32' | '24'", default: "'32'", desc: '버튼 높이(px)' },
  { name: 'leftIcon', type: 'lucide 컴포넌트', default: 'null', desc: '텍스트 왼쪽 아이콘 (컴포넌트 자체를 전달)' },
  { name: 'rightIcon', type: 'lucide 컴포넌트', default: 'null', desc: '텍스트 오른쪽 아이콘' },
  { name: 'icon', type: 'lucide 컴포넌트', default: 'null', desc: '아이콘 전용 버튼(텍스트 없음)' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '비활성 — 흐림 처리 + 클릭 차단' },
  { name: 'loading', type: 'boolean', default: 'false', desc: '로딩 상태 — 클릭 차단' },
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

function VariantBlock({ variant, label, tinted = false }) {
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
              {BUTTON_ROWS.map(({ rowLabel, btnProps, text }) => (
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
        Fill · Ghost · Line — 3가지 variant × 2가지 사이즈 × 4가지 레이아웃 × 3가지 상태
      </p>

      <UsageExample code={USAGE} props={USAGE_PROPS} note="아이콘은 lucide-react 컴포넌트를 그대로 prop으로 넘깁니다." />

      <VariantBlock variant="fill" label="Fill (Primary Button)" />
      <VariantBlock variant="line" label="Line (Secondary Button)" />
      <VariantBlock variant="ghost" label="Ghost (Third Button)" tinted />

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
    </section>
  );
}
