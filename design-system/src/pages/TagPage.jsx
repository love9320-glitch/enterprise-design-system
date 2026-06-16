import { Tag } from '../components/Tag';
import { Tooltip } from '../components/Tooltip';
import { ScrollArea } from '../components/ScrollArea';
import { UsageExample } from '../components/UsageExample';

const USAGE = `import { Tag } from '../components/Tag';
import { Tooltip } from '../components/Tooltip';
import { ScrollArea } from '../components/ScrollArea';

// Tag — type(blue·red·gray) · width(hug 기본 · fill)
<Tag type="blue">신규</Tag>
<Tag type="red" width="fill">마감</Tag>

// Tooltip — variant(error·normal) · beak(top·bottom·none). 위치는 호출부에서 지정
<Tooltip variant="error" beak="top">필수 입력정보 입니다</Tooltip>
<Tooltip variant="normal" beak="none">전체 텍스트</Tooltip>

// ScrollArea — 스크롤이 생기는 곳을 감싸 오버레이 스크롤바로 표시
<ScrollArea maxHeight={200}>{/* 긴 콘텐츠 */}</ScrollArea>
<ScrollArea maxHeight={200} horizontal>{/* 세로+가로 */}</ScrollArea>`;

const USAGE_PROPS = [
  // Tag
  { name: 'Tag · children', type: 'ReactNode', default: "'태그'", desc: '태그 내용' },
  { name: 'Tag · type', type: "'blue' | 'red' | 'gray'", default: "'blue'", desc: '색상 종류' },
  { name: 'Tag · width', type: "'hug' | 'fill'", default: "'hug'", desc: 'hug=콘텐츠 맞춤, fill=부모 폭 채움' },
  { name: 'Tag · className', type: 'string', default: "''", desc: '추가 클래스' },
  // Tooltip
  { name: 'Tooltip · children', type: 'ReactNode', default: '—', desc: '말풍선 내용' },
  { name: 'Tooltip · variant', type: "'error' | 'normal'", default: "'error'", desc: 'error=빨강(필수 등), normal=검정(전체 텍스트 등)' },
  { name: 'Tooltip · beak', type: "'top' | 'bottom' | 'none'", default: "'top'", desc: '꼬리 위치/유무 (대상 아래=top)' },
  { name: 'Tooltip · className', type: 'string', default: "''", desc: '추가 클래스 (위치는 호출부에서 지정)' },
  // ScrollArea
  { name: 'ScrollArea · children', type: 'ReactNode', default: '—', desc: '스크롤 대상 콘텐츠' },
  { name: 'ScrollArea · maxHeight', type: 'number', default: '—', desc: '이 높이(px)를 넘으면 세로 스크롤' },
  { name: 'ScrollArea · horizontal', type: 'boolean', default: 'false', desc: '가로 스크롤도 오버레이 스크롤바로 표시' },
  { name: 'ScrollArea · contentClassName', type: 'string', default: "''", desc: '내부 콘텐츠 래퍼 클래스(패딩 등)' },
  { name: 'ScrollArea · className', type: 'string', default: "''", desc: '외부 컨테이너 클래스' },
];

export function TagPage() {
  return (
    <section className="mx-auto max-w-5xl px-spacing-7 py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-20 font-semibold text-font-icon-5">Tag / Tooltip / Scrollbar</h2>
      <p className="mb-spacing-8 text-14 text-font-icon-4">
        작은 칩 라벨(Tag), 말풍선(Tooltip), 오버레이 커스텀 스크롤바(Scrollbar).<br />색상은 모두
        시멘틱 토큰(base 경유)을 사용합니다.
      </p>

      <UsageExample code={USAGE} props={USAGE_PROPS} note="이 페이지의 세 컴포넌트(Tag · Tooltip · ScrollArea) 옵션을 한 표에 모았습니다." />

      {/* Tag */}
      <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">
        Tag — Type
      </h3>
      <p className="mb-spacing-5 text-12 text-font-icon-4">
        <code className="text-font-icon-5">type</code> 속성으로 색을 바꿉니다 — blue · red · gray.
      </p>
      <div className="mb-spacing-7 flex items-center gap-spacing-5">
        <Tag type="blue">blue</Tag>
        <Tag type="red">red</Tag>
        <Tag type="gray">gray</Tag>
      </div>

      <p className="mb-spacing-5 text-12 text-font-icon-4">
        <code className="text-font-icon-5">width</code> 속성 — hug(콘텐츠 맞춤, 기본) / fill(부모 폭 채움).
      </p>
      <div className="w-[240px] space-y-spacing-4">
        <Tag type="blue" width="hug">hug</Tag>
        <Tag type="blue" width="fill">fill (부모 폭을 채움)</Tag>
      </div>

      {/* Tooltip */}
      <div className="mt-spacing-9 border-t border-base-gray-100 pt-spacing-8">
        <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">
          Tooltip — Variant
        </h3>
        <p className="mb-spacing-7 text-12 text-font-icon-4">
          <code className="text-font-icon-5">error</code>(빨강·화살표)와{' '}
          <code className="text-font-icon-5">normal</code>(검정·화살표 없음) 타입. 보통 오버레이로
          띄우며, 인풋 에러 표시나 말줄임 전체 텍스트(TruncatingText) 등에 사용됩니다.
          위치는 호출부에서 지정하고, beak(꼬리)은 top/bottom/none으로 켜고 끕니다.
        </p>
        <div className="flex flex-wrap items-start gap-spacing-9 pt-spacing-6">
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
      <div className="mt-spacing-9 border-t border-base-gray-100 pt-spacing-8">
        <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">
          Scrollbar (ScrollArea)
        </h3>
        <p className="mb-spacing-7 text-12 text-font-icon-4">
          스크롤이 생기는 모든 곳에 쓰는 공용 <code className="text-font-icon-5">ScrollArea</code> —
          네이티브 스크롤바를 숨기고 콘텐츠 위에 오버레이로 그립니다(폭을 차지하지 않음).
          <code className="text-font-icon-5"> maxHeight</code>를 넘으면 표시되고,
          <span className="text-font-icon-5"> hover·드래그</span> 시 색이 진해집니다(gray-900-50 → 75).
          ListGroup·Select 드롭다운 등도 내부적으로 이 컴포넌트를 사용합니다.
        </p>
        <div className="w-full overflow-hidden rounded-round-4 border border-list-popover-outline bg-list-group-bg">
          <ScrollArea maxHeight={200} contentClassName="space-y-spacing-3 p-spacing-5">
            {Array.from({ length: 14 }, (_, i) => (
              <p key={i} className="text-14 text-font-icon-5">
                스크롤 콘텐츠 줄 {i + 1}
              </p>
            ))}
          </ScrollArea>
        </div>
      </div>
    </section>
  );
}
