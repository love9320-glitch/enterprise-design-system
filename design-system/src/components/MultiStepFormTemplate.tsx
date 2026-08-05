// MultiStepFormTemplate — 멀티 스텝 폼 템플릿 (Figma "multi-step form Template" 9249:4529, step=1/2/3)
// 조립(규칙 4): Stepper(line type) + 20px(spacing-8) 간격 + 현재 스텝 콘텐츠.
// 스텝 단계(steps: 개수·타이틀·설명)와 하단 콘텐츠(step.content)는 전부 소비자가 주입한다 —
// Figma 변형(step=1/2/3)은 3단계 예시일 뿐, 템플릿은 스텝 수·내용에 제한이 없다(2026-08-05 지시: 커스텀 가능).
//   - steps: [{ value?, title, description?, disabled?, content }] — Stepper 항목 + 그 스텝의 하단 영역
//   - value/defaultValue/onChange: 현재 스텝(item.value 또는 인덱스) — controlled/uncontrolled
//   - clickableSteps: Stepper 클릭으로 스텝 이동(기본 true) — 순차 강제 플로우면 false로 끄고 외부에서 value 제어
//   - keepMounted: 비활성 스텝 콘텐츠를 hidden으로 유지 — 스텝을 오가도 입력 상태 보존(Accordion 관례)
import { useState } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Stepper } from './Stepper';
import type { StepperItem } from './Stepper';

export interface MultiStepFormStep extends StepperItem {
  content?: ReactNode; // 이 스텝의 하단 영역(폼/테이블 등) — 소비자가 조립해 주입
}

interface MultiStepFormTemplateProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange'> {
  steps?: MultiStepFormStep[];
  value?: string | number; // 현재 스텝(item.value 또는 인덱스) — controlled
  defaultValue?: string | number; // uncontrolled 초기 스텝(미지정 시 첫 스텝)
  onChange?: (value: string | number, index: number) => void;
  clickableSteps?: boolean; // Stepper 클릭 내비게이션 on/off
  keepMounted?: boolean; // 비활성 스텝 콘텐츠 유지(hidden) — 입력 상태 보존
}

export function MultiStepFormTemplate({
  steps = [],
  value,
  defaultValue,
  onChange,
  clickableSteps = true,
  keepMounted = false,
  className = '',
  ...props
}: MultiStepFormTemplateProps) {
  const keyOf = (step: MultiStepFormStep, index: number) => step.value ?? index;
  const controlled = value !== undefined;
  const [internal, setInternal] = useState<string | number>(
    defaultValue ?? (steps.length ? keyOf(steps[0], 0) : 0),
  );
  const current = controlled ? value : internal;
  const currentIndex = Math.max(
    0,
    steps.findIndex((step, i) => keyOf(step, i) === current),
  );

  const handleStepClick = (next: string | number, index: number) => {
    if (!controlled) setInternal(next);
    onChange?.(next, index);
  };

  return (
    <div className={`flex w-full flex-col gap-spacing-8 ${className}`} {...props}>
      {/* content는 Stepper 항목이 아니므로 분리해 전달 */}
      <Stepper
        items={steps.map(({ content: _content, ...item }) => item)}
        value={current}
        onStepClick={clickableSteps ? handleStepClick : undefined}
      />
      {keepMounted
        ? steps.map((step, i) => (
            <div key={keyOf(step, i)} className={i === currentIndex ? 'w-full' : 'hidden'}>
              {step.content}
            </div>
          ))
        : steps[currentIndex]?.content}
    </div>
  );
}
