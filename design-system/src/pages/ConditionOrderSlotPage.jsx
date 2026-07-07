import { useState } from 'react';
import { ConditionOrderSlot, ConditionSlotCard } from '../components/ConditionOrderSlot';
import { Select } from '../components/Select';
import { Button } from '../components/Button';
import { SegmentControlGroup } from '../components/SegmentControl';
import { UsageExample } from '../components/UsageExample';
import { Divider } from '../components/Divider';
import { Plus } from 'lucide-react';

const USAGE = `import { ConditionOrderSlot } from '../components/ConditionOrderSlot';
import { Select } from '../components/Select';

<ConditionOrderSlot
  direction="vertical"          // 'vertical' | 'horizontal'
  items={[
    { id: 'region', body: (<><Select width="100%" options={기준옵션} /><Select width="100%" options={값옵션} /></>) },
    { id: 'career', body: (<><Select width="100%" options={기준옵션} /><Select width="100%" options={값옵션} /></>) },
  ]}
  onOrderChange={(ids) => console.log('배치 순서', ids)}
  onEnabledChange={(enabledIds) => console.log('사용 중(적용 순서)', enabledIds)}
/>`;

const USAGE_PROPS = [
  { name: 'items', type: '{ id, body }[]', default: '[]', desc: '조건 카드 목록 — body에 세부 Select들을 필요만큼 넣는다(2개 고정 아님). 배열에 추가하면 카드가 늘어남' },
  { name: 'direction', type: "'vertical' | 'horizontal'", default: "'vertical'", desc: '레이아웃 — 세로(↓ 커넥터) / 가로(› 커넥터)' },
  { name: 'order / defaultOrder / onOrderChange', type: 'id[] / id[] / (ids) => void', default: '— / items 순서 / —', desc: '카드 배치 순서(controlled·uncontrolled) — 드래그 앤 드롭으로 변경' },
  { name: 'enabledIds / onEnabledChange', type: 'id[] / (ids, {id,enabled}) => void', default: '전체 사용 / —', desc: '사용 중 조건 — 미사용 카드는 적용 순번에서 빠지고 다음 조건이 번호를 당겨받음(카드 위치는 유지)' },
  { name: 'titlePrefix', type: 'string', default: "'조건'", desc: "카드 제목 접두 — 사용 중 카드에 '조건 1.' 형식으로 자동 번호" },
  { name: 'cardWidth', type: 'number | string', default: '202', desc: '카드 너비(Figma 기본 202px)' },
  { name: 'ConditionSlotCard', type: '컴포넌트', default: '—', desc: '카드 단독 사용 — title · enabled/onEnabledChange(Switch) · dragging(pressed=드래그 중) · children(세부 Select 스택)' },
];

const CRITERIA = [
  { value: 'region', label: '지역' },
  { value: 'career', label: '경력' },
  { value: 'job', label: '직무' },
];
const VALUES = [
  { value: 'seoul', label: '서울' },
  { value: 'new', label: '신입' },
  { value: 'fe', label: '프론트엔드' },
];

const cardBody = (n = 2) => (
  <>
    {Array.from({ length: n }, (_, i) => (
      <Select key={i} width="100%" options={i === 0 ? CRITERIA : VALUES} placeholder={i === 0 ? '기준 선택' : '값 선택'} />
    ))}
  </>
);

function Playground() {
  const [direction, setDirection] = useState('vertical');
  const [items, setItems] = useState([
    { id: 'c1', body: cardBody() },
    { id: 'c2', body: cardBody() },
    { id: 'c3', body: cardBody(3) }, // 세부 select 3개 예시
  ]);
  const [applied, setApplied] = useState(null); // 최근 적용 순서(사용 중 id 순)

  return (
    <div className="space-y-spacing-7">
      <div className="flex items-center gap-spacing-6">
        <SegmentControlGroup
          size="24"
          value={direction}
          onChange={setDirection}
          items={[
            { value: 'vertical', label: '세로' },
            { value: 'horizontal', label: '가로' },
          ]}
        />
        <Button
          variant="line"
          size="24"
          leftIcon={Plus}
          onClick={() => setItems((prev) => [...prev, { id: `c${prev.length + 1}-${prev.length}`, body: cardBody() }])}
        >
          조건 카드 추가
        </Button>
      </div>
      <ConditionOrderSlot
        direction={direction}
        items={items}
        onEnabledChange={(ids) => setApplied(ids)}
        onOrderChange={() => setApplied(null)}
      />
      <p className="text-12 text-font-icon-4">
        grip(⠿)을 잡고 드래그하면 카드 순서가 바뀌고(드래그 중 파란 pressed 상태 유지), 스위치를 끄면
        해당 조건이 적용 순번에서 빠지며 다음 조건이 번호를 당겨받습니다(카드 위치는 유지).
        {applied && <> 최근 사용 중 조건: <span className="text-font-icon-5">{applied.join(' → ') || '없음'}</span></>}
      </p>
    </div>
  );
}

export function ConditionOrderSlotPage() {
  return (
    <section className="mx-auto max-w-5xl px-spacing-7 py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-20 font-semibold text-font-icon-5">Condition Order Slot</h2>
      <p className="mb-spacing-9 text-14 text-font-icon-4">
        조건 카드를 배치·정렬하는 입력 슬롯입니다. 카드는 [⠿ · 조건 N. · 스위치] 헤더와 세부
        Select 스택으로 구성되고, <span className="text-font-icon-5">드래그 앤 드롭</span>으로 순서를
        바꾸며(드래그 중 pressed 상태 유지), <span className="text-font-icon-5">스위치</span>로
        사용/미사용을 전환합니다. 색은 모두 condition-slot-* 시멘틱 토큰(base 경유)을 사용합니다.
      </p>

      <UsageExample code={USAGE} props={USAGE_PROPS} note="items의 body에 세부 Select를 필요만큼 넣습니다. 미사용 조건은 번호에서 빠지고 다음 조건이 당겨집니다(카드 위치 유지)." />

      <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">Playground — 레이아웃·추가·정렬·사용 전환</h3>
      <Playground />

      {/* 카드 단독 상태 */}
      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div>
        <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">카드 상태 (ConditionSlotCard)</h3>
        <p className="mb-spacing-6 text-12 text-font-icon-4">
          default(hover 시 배경·라인 변화) · pressed(드래그 중 유지 — 파란 라인·텍스트) · 미사용(번호 제외·dim)
        </p>
        <div className="flex flex-wrap items-start gap-spacing-7">
          <ConditionSlotCard title="조건 1.">{cardBody()}</ConditionSlotCard>
          <ConditionSlotCard title="조건 1." dragging>{cardBody()}</ConditionSlotCard>
          <ConditionSlotCard title="조건 -." enabled={false}>{cardBody()}</ConditionSlotCard>
        </div>
      </div>
    </section>
  );
}
