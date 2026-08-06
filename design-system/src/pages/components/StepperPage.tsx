import { useState } from 'react';
import { Stepper } from '@gusun/design-system';
import { Checkbox } from '@gusun/design-system';
import { Button } from '@gusun/design-system';
import { Divider } from '@gusun/design-system';
import { UsageExample } from '../../components/UsageExample';

const USAGE = `import { Stepper } from '@gusun/design-system';

// 상태 모델: value(현재 단계) 이전=complete / 현재=progress / 이후=default, disabled는 항목별.
// 숫자(01, 02…)는 순서대로 자동 부여, 설명은 item.description이 있을 때만 표시.
<Stepper
  value={step} // 현재 스텝 value(또는 인덱스)
  items={[
    { value: 'sender', title: 'Step 1. 고객사 발신정보', description: '발송 회사, 발송 방식을 선택하세요.' },
    { value: 'write', title: 'Step 2. 안내문 작성' },
    { value: 'target', title: 'Step 3. 발송 대상 선택', disabled: true },
    { value: 'send', title: 'Step 4. 발송' },
  ]}
  onStepClick={(value: any) => setStep(value)} // 지정 시 클릭 내비게이션(+default 스텝 hover)
/>`;

const USAGE_PROPS = [
  { name: 'items', type: '{ value?, title, description?, disabled? }[]', default: '—', desc: '스텝 목록 — 숫자는 순서 자동(01~), description 있으면 설명 행(12px) 표시, disabled는 진행·클릭 제외' },
  { name: 'value', type: 'string | number', default: '첫 스텝', desc: '현재(진행 중) 스텝 — item.value 또는 인덱스. 이전 스텝은 완료(체크), 이후는 대기' },
  { name: 'onStepClick', type: '(value, index) => void', default: '—', desc: '지정 시 스텝 클릭으로 이동(버튼 렌더 + default 스텝 hover 효과). 미지정 시 정적 표시' },
];

const DEMO_ITEMS = [
  { value: 'sender', title: 'Step 1. 고객사 발신정보', description: '발송 회사, 발송 방식을 선택하세요.' },
  { value: 'write', title: 'Step 2. 안내문 작성', description: '이메일·문자 안내문을 작성하세요.' },
  { value: 'target', title: 'Step 3. 발송 대상 선택', description: '발송할 지원자를 선택하세요.' },
  { value: 'send', title: 'Step 4. 발송', description: '내용 확인 후 발송하세요.' },
];

export function StepperPage() {
  const [step, setStep] = useState('write');
  const [showDesc, setShowDesc] = useState(true);
  const [clickable, setClickable] = useState(true);
  const stepIndex = DEMO_ITEMS.findIndex((it) => it.value === step);

  const items = DEMO_ITEMS.map((it: any) => (showDesc ? it : { ...it, description: undefined }));

  return (
    <section className="py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-20 font-semibold text-font-icon-5">Stepper</h2>
      <p className="mb-spacing-8 text-14 text-font-icon-4">
        여러 단계로 진행되는 플로우의 현재 위치를 보여주는 진행 표시기(line type)입니다. 현재
        스텝(<span className="text-font-icon-5">value</span>) 기준으로 이전 단계는 완료(체크), 현재는
        진행 중(파랑 링), 이후는 대기 상태로 자동 계산됩니다.
      </p>

      <UsageExample
        code={USAGE}
        props={USAGE_PROPS}
        note="Figma state 변형(Default/Hover/Progress/Complete/Disabled)은 코드에서 value·disabled로 자동 계산되고, hover는 onStepClick이 있을 때 CSS로 적용됩니다."
      />

      {/* 플레이그라운드 */}
      <div className="mb-spacing-6 flex flex-wrap items-center gap-spacing-6">
        <Checkbox label="설명 표시" checked={showDesc} onChange={() => setShowDesc((v) => !v)} />
        <Checkbox label="클릭 내비게이션" checked={clickable} onChange={() => setClickable((v) => !v)} />
        <div className="flex items-center gap-spacing-4">
          <Button
            variant="line"
            disabled={stepIndex <= 0}
            onClick={() => setStep(DEMO_ITEMS[stepIndex - 1].value)}
          >
            이전 단계
          </Button>
          <Button
            disabled={stepIndex >= DEMO_ITEMS.length - 1}
            onClick={() => setStep(DEMO_ITEMS[stepIndex + 1].value)}
          >
            다음 단계
          </Button>
        </div>
      </div>
      <div className="rounded-round-4 border border-base-gray-100 py-spacing-8">
        <Stepper
          items={items}
          value={step}
          onStepClick={clickable ? (v: any) => setStep(String(v)) : undefined}
        />
      </div>

      <Divider className="mt-spacing-9 mb-spacing-8" />

      {/* 상태 견본 — disabled 포함 고정 예시 */}
      <h3 className="mb-spacing-5 text-16 font-semibold text-font-icon-5">상태 견본 (disabled 포함)</h3>
      <div className="rounded-round-4 border border-base-gray-100 py-spacing-8">
        <Stepper
          items={[
            { value: 'a', title: 'Step 1. 완료 단계', description: '이전 단계는 완료(체크) 표시' },
            { value: 'b', title: 'Step 2. 진행 중', description: '현재 단계는 파랑 링+굵은 숫자' },
            { value: 'c', title: 'Step 3. 대기', description: '이후 단계는 회색 대기 상태' },
            { value: 'd', title: 'Step 4. 비활성', description: '진행에서 제외되는 단계', disabled: true },
          ]}
          value="b"
        />
      </div>
    </section>
  );
}
