import { useState } from 'react';
import { Tag } from '../components/Tag';
import { Tooltip } from '../components/Tooltip';
import { ScrollArea } from '../components/ScrollArea';
import { Divider } from '../components/Divider';
import { Chip } from '../components/Chip';
import { UsageExample } from '../components/UsageExample';

// 제거형 칩 데모 — X로 삭제, 비면 복원 버튼
function ChipDemo() {
  const initial = ['{지원자명}', '{회사명}', '{면접장소}', '{면접시간}'];
  const [chips, setChips] = useState(initial);
  return (
    <div className="flex flex-wrap items-center gap-spacing-5">
      {chips.map((c) => (
        <Chip key={c} onRemove={() => setChips((prev) => prev.filter((x) => x !== c))}>
          {c}
        </Chip>
      ))}
      {chips.length === 0 && (
        <button
          type="button"
          onClick={() => setChips(initial)}
          className="text-12 text-font-icon-3 underline"
        >
          되돌리기
        </button>
      )}
    </div>
  );
}

// ── 컴포넌트별 사용 예시 코드 + 옵션 표 ──────────────────────────────
const TAG_USAGE = `import { Tag } from '../components/Tag';

// color: blue(기본) · red · gray · black(솔리드)
<Tag color="blue">신규</Tag>
<Tag color="red">마감</Tag>
<Tag color="black">Solid</Tag>

// width: hug(기본, 콘텐츠 맞춤) · fill(부모 폭 채움)
<Tag color="gray" width="fill">부모 폭을 채움</Tag>`;

const TAG_PROPS = [
  { name: 'children', type: 'ReactNode', default: "'태그'", desc: '태그 내용' },
  { name: 'color', type: "'blue' | 'red' | 'gray' | 'black'", default: "'blue'", desc: '색상 종류 (black=gray500 솔리드+흰 텍스트)' },
  { name: 'width', type: "'hug' | 'fill'", default: "'hug'", desc: 'hug=콘텐츠 맞춤, fill=부모 폭 채움' },
  { name: 'className', type: 'string', default: "''", desc: '추가 클래스' },
];

const TOOLTIP_USAGE = `import { Tooltip } from '../components/Tooltip';

// variant: error(빨강·꼬리) · normal(검정) / beak: top · bottom · none
<Tooltip variant="error" beak="top">필수 입력정보 입니다</Tooltip>
<Tooltip variant="normal" beak="none">전체 텍스트 툴팁</Tooltip>`;

const TOOLTIP_PROPS = [
  { name: 'children', type: 'ReactNode', default: '—', desc: '말풍선 내용' },
  { name: 'variant', type: "'error' | 'normal'", default: "'error'", desc: 'error=빨강(필수 등), normal=검정(전체 텍스트 등)' },
  { name: 'beak', type: "'top' | 'bottom' | 'none'", default: "'top'", desc: '꼬리 위치/유무 (대상 아래=top)' },
  { name: 'className', type: 'string', default: "''", desc: '추가 클래스 (위치는 호출부에서 지정)' },
];

const SCROLL_USAGE = `import { ScrollArea } from '../components/ScrollArea';

// maxHeight를 넘으면 오버레이 스크롤바로 표시
<ScrollArea maxHeight={200}>{/* 긴 콘텐츠 */}</ScrollArea>
<ScrollArea maxHeight={200} horizontal>{/* 세로+가로 */}</ScrollArea>
<ScrollArea maxHeight={200} variant="light">{/* 어두운 배경 위 흰색 thumb */}</ScrollArea>`;

const SCROLL_PROPS = [
  { name: 'children', type: 'ReactNode', default: '—', desc: '스크롤 대상 콘텐츠' },
  { name: 'maxHeight', type: 'number', default: '—', desc: '이 높이(px)를 넘으면 세로 스크롤' },
  { name: 'horizontal', type: 'boolean', default: 'false', desc: '가로 스크롤도 오버레이 스크롤바로 표시' },
  { name: 'variant', type: "'default' | 'light'", default: "'default'", desc: 'light=어두운 배경 위 흰색 thumb(scroll-bar-light* 토큰)' },
  { name: 'contentClassName', type: 'string', default: "''", desc: '내부 콘텐츠 래퍼 클래스(패딩 등)' },
  { name: 'className', type: 'string', default: "''", desc: '외부 컨테이너 클래스' },
];

const DIVIDER_USAGE = `import { Divider } from '../components/Divider';

// direction: horizontal(기본) · vertical / color: subtle · default · strong
<Divider color="default" />

// 세로선은 부모에 높이가 있어야 보인다(flex 행 등)
<div className="flex h-5 items-center">
  <span>A</span>
  <Divider direction="vertical" color="strong" className="mx-3" />
  <span>B</span>
</div>`;

const DIVIDER_PROPS = [
  { name: 'direction', type: "'horizontal' | 'vertical'", default: "'horizontal'", desc: '가로선/세로선 (세로는 부모 높이를 따름)' },
  { name: 'color', type: "'subtle' | 'default' | 'strong'", default: "'default'", desc: '선 색 (divider-* 토큰: subtle=gray.50/default=gray.100/strong=gray.150)' },
  { name: 'className', type: 'string', default: "''", desc: '추가 클래스 (간격 등)' },
];

const CHIP_USAGE = `import { Chip } from '../components/Chip';

// color: gray(기본) · red · blue · black
<Chip color="blue">라벨</Chip>

// onRemove → X(삭제) 노출 · onClick → 칩 전체 선택
<Chip onRemove={() => remove(id)}>지원자명</Chip>`;

const CHIP_PROPS = [
  { name: 'children', type: 'ReactNode', default: '—', desc: '칩 내용' },
  { name: 'color', type: "'gray' | 'red' | 'blue' | 'black'", default: "'gray'", desc: '색상 종류 (hover/pressed는 chip-* 토큰 경유)' },
  { name: 'onRemove', type: '(e) => void', default: '—', desc: '있으면 X(삭제) 버튼 노출, 클릭 시 호출(칩 onClick과 분리)' },
  { name: 'onClick', type: '(e) => void', default: '—', desc: '칩 전체 클릭(선택 등)' },
  { name: 'removeAriaLabel', type: 'string', default: "'삭제'", desc: 'X 버튼 aria-label' },
  { name: 'className', type: 'string', default: "''", desc: '추가 클래스' },
];

export function TagPage() {
  return (
    <section className="mx-auto max-w-5xl px-spacing-7 py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-20 font-semibold text-font-icon-5">Tag / Tooltip / Scrollbar</h2>
      <p className="mb-spacing-9 text-14 text-font-icon-4">
        작은 칩 라벨(Tag), 말풍선(Tooltip), 오버레이 커스텀 스크롤바(Scrollbar), 구분선(Divider),
        제거형 칩(Chip). 색상은 모두 시멘틱 토큰(base 경유)을 사용하며, 각 섹션에 사용 예시 코드와 옵션 표를 함께 둡니다.
      </p>

      {/* Tag */}
      <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">Tag</h3>
      <p className="mb-spacing-6 text-12 text-font-icon-4">
        <code className="text-font-icon-5">color</code>(blue·red·gray·black)로 색을,{' '}
        <code className="text-font-icon-5">width</code>(hug·fill)로 너비를 바꿉니다.
      </p>
      <UsageExample code={TAG_USAGE} props={TAG_PROPS} />
      <p className="mb-spacing-5 text-12 text-font-icon-3">color</p>
      <div className="mb-spacing-7 flex items-center gap-spacing-5">
        <Tag color="blue">blue</Tag>
        <Tag color="red">red</Tag>
        <Tag color="gray">gray</Tag>
        <Tag color="black">black</Tag>
      </div>
      <p className="mb-spacing-5 text-12 text-font-icon-3">width — hug / fill</p>
      <div className="w-[240px] space-y-spacing-4">
        <Tag color="blue" width="hug">hug</Tag>
        <Tag color="blue" width="fill">fill (부모 폭을 채움)</Tag>
      </div>

      {/* Tooltip */}
      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div>
        <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">Tooltip</h3>
        <p className="mb-spacing-6 text-12 text-font-icon-4">
          <code className="text-font-icon-5">error</code>(빨강·화살표)와{' '}
          <code className="text-font-icon-5">normal</code>(검정·화살표 없음) 타입. 보통 오버레이로
          띄우며, 인풋 에러 표시나 말줄임 전체 텍스트(TruncatingText) 등에 사용됩니다.
          위치는 호출부에서 지정하고, beak(꼬리)은 top/bottom/none으로 켜고 끕니다.
        </p>
        <UsageExample code={TOOLTIP_USAGE} props={TOOLTIP_PROPS} />
        <div className="flex flex-wrap items-start gap-spacing-9 pt-spacing-2">
          <div>
            <p className="mb-spacing-5 text-12 text-font-icon-3">error · beak top</p>
            <Tooltip variant="error" beak="top">
              필수 입력정보 입니다
            </Tooltip>
          </div>
          <div>
            <p className="mb-spacing-5 text-12 text-font-icon-3">normal · beak none</p>
            <Tooltip variant="normal" beak="none">
              전체 텍스트 툴팁
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Scrollbar */}
      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div>
        <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">Scrollbar (ScrollArea)</h3>
        <p className="mb-spacing-6 text-12 text-font-icon-4">
          스크롤이 생기는 모든 곳에 쓰는 공용 <code className="text-font-icon-5">ScrollArea</code> —
          네이티브 스크롤바를 숨기고 콘텐츠 위에 오버레이로 그립니다(폭을 차지하지 않음).
          <code className="text-font-icon-5"> maxHeight</code>를 넘으면 표시되고,
          <span className="text-font-icon-5"> hover·드래그</span> 시 색이 진해집니다(gray-900-50 → 75).
          ListGroup·Select 드롭다운 등도 내부적으로 이 컴포넌트를 사용합니다.
        </p>
        <UsageExample code={SCROLL_USAGE} props={SCROLL_PROPS} />
        <p className="mb-spacing-4 text-12 text-font-icon-3">세로 (maxHeight)</p>
        <div className="mb-spacing-8 w-full overflow-hidden rounded-round-4 border border-list-popover-outline bg-list-group-bg">
          <ScrollArea maxHeight={200} contentClassName="space-y-spacing-3 p-spacing-5">
            {Array.from({ length: 14 }, (_, i) => (
              <p key={i} className="text-14 text-font-icon-5">
                스크롤 콘텐츠 줄 {i + 1}
              </p>
            ))}
          </ScrollArea>
        </div>

        {/* 가로 + 세로 */}
        <p className="mb-spacing-4 text-12 text-font-icon-3">
          세로 + 가로 (<code className="text-font-icon-5">horizontal</code>)
        </p>
        <div className="mb-spacing-8 w-full overflow-hidden rounded-round-4 border border-list-popover-outline bg-list-group-bg">
          <ScrollArea maxHeight={200} horizontal contentClassName="p-spacing-5">
            <div className="w-[1200px] space-y-spacing-3">
              {Array.from({ length: 14 }, (_, i) => (
                <p key={i} className="whitespace-nowrap text-14 text-font-icon-5">
                  가로로도 넘치는 긴 콘텐츠 줄 {i + 1} — 좌우로 스크롤하면 하단 오버레이 스크롤바가 함께 표시됩니다.
                </p>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* light 변형 — 어두운 배경 */}
        <p className="mb-spacing-4 text-12 text-font-icon-3">
          어두운 배경 위 흰색 thumb (<code className="text-font-icon-5">variant="light"</code>)
        </p>
        <div className="w-full overflow-hidden rounded-round-4 bg-editor-source-bg">
          <ScrollArea maxHeight={200} variant="light" contentClassName="space-y-spacing-3 p-spacing-5">
            {Array.from({ length: 14 }, (_, i) => (
              <p key={i} className="font-mono text-13 text-editor-source-text">
                어두운 배경 스크롤 콘텐츠 줄 {i + 1}
              </p>
            ))}
          </ScrollArea>
        </div>
      </div>

      {/* Divider — 구분선 (Horizontal/Vertical × subtle/default/strong) */}
      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div>
        <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">Divider</h3>
        <p className="mb-spacing-6 text-12 text-font-icon-4">
          구분선. <code className="text-font-icon-5">direction</code>(horizontal/vertical) ·{' '}
          <code className="text-font-icon-5">color</code>(subtle/default/strong) — 색은 divider 토큰 경유.
          세로선은 부모 높이를 따른다.
        </p>
        <UsageExample code={DIVIDER_USAGE} props={DIVIDER_PROPS} />
        <div className="space-y-spacing-7">
          {['subtle', 'default', 'strong'].map((c) => (
            <div key={c} className="grid grid-cols-[80px_1fr] items-center gap-x-spacing-6">
              <span className="font-mono text-12 text-font-icon-3">{c}</span>
              <Divider color={c} />
            </div>
          ))}
        </div>
      </div>

      {/* Chip — 제거형 칩 */}
      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div>
        <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">Chip</h3>
        <p className="mb-spacing-6 text-12 text-font-icon-4">
          제거형 칩. 텍스트 + <code className="text-font-icon-5">X</code>(삭제=<code className="text-font-icon-5">onRemove</code>) ·{' '}
          <code className="text-font-icon-5">onClick</code>(선택) ·{' '}
          <code className="text-font-icon-5">color</code>(gray/red/blue/black). hover/pressed 상태는 chip 토큰 경유.
        </p>
        <UsageExample code={CHIP_USAGE} props={CHIP_PROPS} />
        <p className="mb-spacing-5 text-12 text-font-icon-3">
          color — <code className="text-font-icon-5">gray</code>(기본) · <code className="text-font-icon-5">red</code> ·{' '}
          <code className="text-font-icon-5">blue</code> · <code className="text-font-icon-5">black</code>
        </p>
        <div className="mb-spacing-7 flex flex-wrap items-center gap-spacing-5">
          {['gray', 'red', 'blue', 'black'].map((c) => (
            <Chip key={c} color={c} onRemove={() => {}}>
              {c}
            </Chip>
          ))}
        </div>

        <p className="mb-spacing-5 text-12 text-font-icon-3">삭제 동작 (X로 제거)</p>
        <ChipDemo />
      </div>
    </section>
  );
}
