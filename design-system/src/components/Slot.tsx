// Slot — asChild 합성 유틸(2026-07-20, Radix Slot 패턴 참고).
// 단일 자식 엘리먼트에 props를 '머지'해 래퍼 없이 그 엘리먼트 자체로 렌더한다.
//   - className : 이어붙이기(자식 것 + 우리 것)
//   - style     : 병합(우리 것이 우선)
//   - on* 핸들러: 합성(자식 핸들러 먼저, 우리 것 나중 — 둘 다 실행)
//   - ref       : 병합(자식 ref + 우리 ref 둘 다 채움)
//   - content   : 지정 시 자식의 내부 내용을 대체(미지정이면 자식 원래 내용 유지)
// 용도: Button asChild 등 — "버튼처럼 보이는 <a>"를 유효하지 않은 중첩 없이 렌더.
import { cloneElement, isValidElement } from 'react';
import type { ReactElement, ReactNode, Ref } from 'react';

type AnyProps = Record<string, unknown>;

function composeHandlers(childHandler: unknown, slotHandler: unknown) {
  return (event: unknown) => {
    (childHandler as ((e: unknown) => void) | undefined)?.(event);
    (slotHandler as ((e: unknown) => void) | undefined)?.(event);
  };
}

function mergeRefs(...refs: (Ref<unknown> | undefined)[]) {
  return (node: unknown) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === 'function') ref(node);
      else (ref as { current: unknown }).current = node;
    }
  };
}

function mergeProps(slotProps: AnyProps, childProps: AnyProps): AnyProps {
  const merged: AnyProps = { ...childProps };
  for (const key in slotProps) {
    const slotValue = slotProps[key];
    const childValue = childProps[key];
    if (/^on[A-Z]/.test(key)) {
      // 이벤트 핸들러 — 양쪽 다 있으면 합성, 아니면 있는 쪽
      merged[key] = childValue ? composeHandlers(childValue, slotValue) : slotValue;
    } else if (key === 'className') {
      merged[key] = [childValue, slotValue].filter(Boolean).join(' ');
    } else if (key === 'style') {
      merged[key] = { ...(childValue as object), ...(slotValue as object) };
    } else {
      // 그 외는 우리 값 우선(undefined면 자식 값 유지)
      merged[key] = slotValue !== undefined ? slotValue : childValue;
    }
  }
  return merged;
}

export interface SlotProps {
  /** 합성 대상 — 반드시 유효한 단일 엘리먼트 하나 */
  children: ReactNode;
  /** 자식의 내부 내용을 대체할 새 콘텐츠(미지정 시 자식 원래 내용 유지) */
  content?: ReactNode;
  /** 병합할 ref(우리 쪽) */
  ref?: Ref<unknown>;
  /** 그 외 머지할 props(className·style·on*·기타 속성) */
  [prop: string]: unknown;
}

export function Slot({ children, content, ref, ...slotProps }: SlotProps) {
  if (!isValidElement(children)) {
    // 오용(자식이 엘리먼트가 아니거나 여러 개) — 조용히 무시하지 않고 개발 중 알림
    console.warn('Slot(asChild): 유효한 단일 엘리먼트 자식 하나가 필요합니다.');
    return null;
  }
  const child = children as ReactElement<AnyProps & { children?: ReactNode }>;
  const childRef = (child as { ref?: Ref<unknown> }).ref;
  const merged = mergeProps(slotProps, child.props);
  if (content !== undefined) merged.children = content;
  if (ref || childRef) merged.ref = mergeRefs(ref, childRef);
  return cloneElement(child, merged);
}
