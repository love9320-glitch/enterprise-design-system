import { useState } from 'react';
import { SegmentedTabs } from '../../src/components/SegmentedTabs';
import { UsageExample } from '../components/UsageExample';
import { Divider } from '../../src/components/Divider';

const USAGE = `import { SegmentedTabs } from '../../src/components/SegmentedTabs';

<SegmentedTabs
  items={[
    { value: 'all', label: '전체' },
    { value: 'active', label: '진행중' },
    { value: 'done', label: '완료' },
  ]}
  defaultValue="all"
  onChange={(v) => setTab(v)}
/>`;

const USAGE_PROPS = [
  { name: 'items', type: '{ value, label, disabled? }[]', default: '[]', desc: '탭 목록 — 2개 이상, 개수 가변(2·3·4·5…). 모든 탭 균등 폭' },
  { name: 'value', type: 'string', default: '—', desc: '선택값 (controlled)' },
  { name: 'defaultValue', type: 'string', default: '—', desc: '초기 선택값 (uncontrolled) — 미지정 시 첫 탭' },
  { name: 'onChange', type: '(value) => void', default: '—', desc: '선택 변경 콜백' },
  { name: 'width', type: 'number | string', default: '—', desc: '컨테이너 너비(px/CSS) — 미지정 시 부모 전체 폭' },
  { name: 'className', type: 'string', default: "''", desc: '컨테이너 추가 클래스' },
];

function Demo({ items, ...rest }) {
  const [v, setV] = useState(items[0].value);
  return (
    <div className="space-y-spacing-5">
      <SegmentedTabs items={items} value={v} onChange={setV} {...rest} />
      <p className="text-12 text-font-icon-4">
        선택: <span className="text-font-icon-5">{items.find((it) => it.value === v)?.label}</span>
      </p>
    </div>
  );
}

const TWO = [
  { value: 'target', label: '대상' },
  { value: 'exclude', label: '제외' },
];
const THREE = [
  { value: 'all', label: '전체' },
  { value: 'active', label: '진행중' },
  { value: 'done', label: '완료' },
];
const FIVE = [
  { value: 'mon', label: '월' },
  { value: 'tue', label: '화' },
  { value: 'wed', label: '수' },
  { value: 'thu', label: '목' },
  { value: 'fri', label: '금' },
];

export function SegmentedTabsPage() {
  return (
    <section className="mx-auto max-w-5xl px-spacing-7 py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-20 font-semibold text-font-icon-5">Segmented Tabs</h2>
      <p className="mb-spacing-9 text-14 text-font-icon-4">
        회색 트랙 안에서 흰색 배경이 선택한 탭으로 <span className="text-font-icon-5">슬라이드</span>하며
        이동하는 세그먼트 탭입니다. 탭은 <code className="text-font-icon-5">items</code>로 필요한 만큼
        추가하며(2·3·4·5…) 모두 균등 폭입니다. 색은 segmented-* 시멘틱 토큰을 사용합니다.
      </p>

      <UsageExample code={USAGE} props={USAGE_PROPS} note="탭 배경은 선택 index에 따라 translateX로 이동합니다(transition-transform). 방향키(←/→)로도 이동합니다." />

      <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">탭 개수 (가변)</h3>
      <div className="max-w-[360px] space-y-spacing-8">
        <div>
          <p className="mb-spacing-4 text-12 text-font-icon-3">2개</p>
          <Demo items={TWO} />
        </div>
        <div>
          <p className="mb-spacing-4 text-12 text-font-icon-3">3개</p>
          <Demo items={THREE} />
        </div>
        <div>
          <p className="mb-spacing-4 text-12 text-font-icon-3">5개</p>
          <Demo items={FIVE} />
        </div>
      </div>

      {/* 너비 고정 */}
      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div>
        <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">너비 (width)</h3>
        <p className="mb-spacing-7 text-12 text-font-icon-4">
          <code className="text-font-icon-5">width</code> 미지정 시 부모 전체 폭. 숫자(px)/CSS로 고정할 수 있습니다.
        </p>
        <div className="space-y-spacing-6">
          <SegmentedTabs items={THREE} defaultValue="all" width={344} />
          <SegmentedTabs items={TWO} defaultValue="target" width={232} />
        </div>
      </div>

      {/* 비활성 탭 */}
      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div>
        <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">비활성 탭 (disabled)</h3>
        <div className="max-w-[360px]">
          <SegmentedTabs
            items={[
              { value: 'a', label: '사용' },
              { value: 'b', label: '대기' },
              { value: 'c', label: '종료', disabled: true },
            ]}
            defaultValue="a"
          />
        </div>
      </div>
    </section>
  );
}
