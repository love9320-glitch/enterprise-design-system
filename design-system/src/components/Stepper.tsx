// Stepper — 진행 단계 표시, line type (Figma "stepper - line type" 9216:12963,
// step 9131:24616 · step number 9129:24254 조립 — 셋 다 이 컴포넌트로 Code Connect).
// 상태 모델: value(현재 단계) 이전 = complete / 현재 = progress / 이후 = default,
// item.disabled = disabled(우선). hover는 CSS 상태 — onStepClick이 있는 인터랙티브 모드에서
// default 스텝에만 적용(Figma hover 변형은 default의 hover만 정의).
// 각 스텝은 [좌 연결선 · 숫자 원(36, 안쪽 28) · 우 연결선] + 타이틀(14) + 설명(12, 옵션) 구조로,
// 스텝끼리 나란히 두면 연결선이 이어져 보인다(Figma와 동일 — 양끝 선 포함).
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Check } from 'lucide-react';

export interface StepperItem {
  value?: string; // 미지정 시 인덱스 기반
  title: ReactNode; // 예: 'Step 1. 고객사 발신정보'
  description?: ReactNode; // 설명 행(12px) — 없으면 미표시(Figma description boolean)
  disabled?: boolean; // 비활성 스텝 — 진행 계산·클릭 제외
}

type StepState = 'default' | 'progress' | 'complete' | 'disabled';

// 상태별 색 — stepper-line-type 시멘틱 토큰(1:1). hover는 인터랙티브 default에만 CSS로.
const ITEM_BG: Record<StepState, string> = {
  default: 'bg-stepper-line-type-default-item',
  progress: 'bg-stepper-line-type-progress-item',
  complete: 'bg-stepper-line-type-complete-item-bg',
  disabled: 'bg-stepper-line-type-disabled-item',
};
const TITLE_COLOR: Record<StepState, string> = {
  default: 'text-stepper-line-type-default-title',
  progress: 'text-stepper-line-type-progress-title',
  complete: 'text-stepper-line-type-complete-title',
  disabled: 'text-stepper-line-type-disabled-title',
};
const DESC_COLOR: Record<StepState, string> = {
  default: 'text-stepper-line-type-default-description',
  progress: 'text-stepper-line-type-progress-description',
  complete: 'text-stepper-line-type-complete-description',
  disabled: 'text-stepper-line-type-disabled-description',
};

interface StepperProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onClick'> {
  items: StepperItem[];
  value?: string | number; // 현재(진행 중) 스텝 — item.value 또는 인덱스. 미지정 시 첫 스텝
  onStepClick?: (value: string | number, index: number) => void; // 지정 시 스텝 클릭 내비게이션(+hover)
}

export function Stepper({ items, value, onStepClick, className = '', ...props }: StepperProps) {
  const keyOf = (item: StepperItem, index: number) => item.value ?? index;
  const currentIndex = Math.max(
    0,
    items.findIndex((item, i) => keyOf(item, i) === (value ?? 0)),
  );
  const interactive = onStepClick != null;

  return (
    <div className={`flex w-full gap-spacing-3 px-spacing-6 pt-spacing-3 ${className}`} {...props}>
      {items.map((item, i) => {
        const state: StepState =
          item.disabled ? 'disabled' : i < currentIndex ? 'complete' : i === currentIndex ? 'progress' : 'default';
        // hover 스타일은 인터랙티브 + default 스텝에만(Figma hover 변형 범위)
        const hoverable = interactive && state === 'default';
        const lineClass = `h-[2px] min-w-0 flex-1 rounded-round-00 ${ITEM_BG[state]} ${
          hoverable ? 'group-hover:bg-stepper-line-type-hover-item' : ''
        }`;
        const number = String(i + 1).padStart(2, '0');
        const stepClass = `group flex min-w-0 flex-1 flex-col items-center gap-spacing-4 ${
          interactive && !item.disabled ? 'cursor-pointer' : ''
        }`;
        const content = (
          <>
            {/* 연결선 + 숫자 원 — 스텝마다 좌·우 선을 가져 나란히 두면 이어진다 */}
            <div className="flex w-full items-center gap-spacing-2">
              <div className={lineClass} />
              <div
                className={`flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-round-00 ${ITEM_BG[state]} ${
                  hoverable ? 'group-hover:bg-stepper-line-type-hover-item' : ''
                }`}
              >
                <div
                  className={`flex h-[28px] w-[28px] items-center justify-center rounded-round-00 ${
                    state === 'progress'
                      ? 'bg-stepper-line-type-progress-item-bg'
                      : state === 'complete'
                        ? ''
                        : `${ITEM_BG[state]} ${hoverable ? 'group-hover:bg-stepper-line-type-hover-item' : ''}`
                  }`}
                >
                  {state === 'complete' ? (
                    <Check size={16} strokeWidth={3} className="text-stepper-line-type-complete-check-icon" />
                  ) : (
                    <span
                      className={`text-12 leading-20 ${state === 'progress' ? 'font-semibold' : 'font-normal'} ${TITLE_COLOR[state]}`}
                    >
                      {number}
                    </span>
                  )}
                </div>
              </div>
              <div className={lineClass} />
            </div>
            {/* 타이틀(14) + 설명(12, 옵션) — 가운데 정렬 */}
            <div className="flex w-full min-w-0 flex-col text-center">
              <div className={`text-14 leading-24 ${TITLE_COLOR[state]}`}>{item.title}</div>
              {item.description != null && (
                <div
                  className={`text-12 leading-20 ${DESC_COLOR[state]} ${
                    hoverable ? 'group-hover:text-stepper-line-type-hover-description' : ''
                  }`}
                >
                  {item.description}
                </div>
              )}
            </div>
          </>
        );
        return interactive ? (
          <button
            key={keyOf(item, i)}
            type="button"
            disabled={item.disabled}
            aria-current={i === currentIndex ? 'step' : undefined}
            onClick={() => onStepClick?.(keyOf(item, i), i)}
            className={stepClass}
          >
            {content}
          </button>
        ) : (
          <div key={keyOf(item, i)} className={stepClass}>
            {content}
          </div>
        );
      })}
    </div>
  );
}
