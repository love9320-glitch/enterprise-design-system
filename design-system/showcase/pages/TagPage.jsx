import { Tag, NewTag } from '../../src/components/Tag';
import { Divider } from '../../src/components/Divider';
import { UsageExample } from '../components/UsageExample';

const TAG_USAGE = `import { Tag } from '../../src/components/Tag';

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

const NEW_TAG_USAGE = `import { NewTag } from '../../src/components/Tag';

// color: blue(기본) · red · black — 18×18 원형 'N' 뱃지
<NewTag />
<NewTag color="red" />
<NewTag color="black" />

// 목록 항목 옆에 신규 표시로 사용
<span className="flex items-center gap-spacing-4">공고명 <NewTag /></span>`;

const NEW_TAG_PROPS = [
  { name: 'color', type: "'blue' | 'red' | 'black'", default: "'blue'", desc: '배경색 (new-tag-* 토큰: blue.400/red.400/gray.500)' },
  { name: 'children', type: 'ReactNode', default: "'N'", desc: '뱃지 글자' },
  { name: 'className', type: 'string', default: "''", desc: '추가 클래스' },
];

export function TagPage() {
  return (
    <section className="mx-auto max-w-5xl px-spacing-7 py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-20 font-semibold text-font-icon-5">Tag</h2>
      <p className="mb-spacing-9 text-14 text-font-icon-4">
        상태·분류를 표시하는 작은 라벨. <code className="text-font-icon-5">color</code>(blue·red·gray·black)로
        색을, <code className="text-font-icon-5">width</code>(hug·fill)로 너비를 바꿉니다. 색상은 모두
        시멘틱 토큰(base 경유)을 사용합니다.
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

      {/* NewTag — 원형 'N' 뱃지 */}
      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div>
        <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">New Tag</h3>
        <p className="mb-spacing-6 text-12 text-font-icon-4">
          신규 항목 표시용 18×18 <span className="text-font-icon-5">원형 'N' 뱃지</span>.{' '}
          <code className="text-font-icon-5">color</code>(blue·red·black)로 배경을 바꾸며,
          색은 new-tag-* 시멘틱 토큰(base 경유)을 사용합니다.
        </p>
        <UsageExample code={NEW_TAG_USAGE} props={NEW_TAG_PROPS} />
        <p className="mb-spacing-5 text-12 text-font-icon-3">color</p>
        <div className="mb-spacing-7 flex items-center gap-spacing-5">
          <NewTag />
          <NewTag color="red" />
          <NewTag color="black" />
        </div>
        <p className="mb-spacing-5 text-12 text-font-icon-3">사용 예 — 목록 항목 옆 신규 표시</p>
        <span className="flex items-center gap-spacing-4 text-14 text-font-icon-5">
          2026 하반기 신입 공채 <NewTag />
        </span>
      </div>
    </section>
  );
}
