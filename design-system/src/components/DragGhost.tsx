// DragGhost — 드래그 고스트 원본 공용 컴포넌트(setDragImage 대상).
// 수식 조건 카드에서 시작된 축약형 필 디자인(grip + 라벨, condition-card drop 토큰)을
// ScreeningConditionCard·ConditionOrderSlot·Table(행 드래그)이 공유한다(3곳 중복 → 추출).
// display:none이면 setDragImage가 안 먹으므로 화면 밖 fixed 배치로 숨긴다.
// setDragImage 오프셋은 각 사용처에서 (16, 20) — 고스트의 grip 부근을 커서에 붙이는 공용 관례.
// (상수 export는 react-refresh 제약으로 두지 않는다)
import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import { GripVertical } from 'lucide-react';

export const DragGhost = forwardRef<HTMLDivElement, { label: ReactNode }>(function DragGhost(
  { label },
  ref,
) {
  return (
    <div
      ref={ref}
      style={{ position: 'fixed', top: -9999, left: -9999 }}
      className="inline-flex w-fit items-center gap-spacing-4 rounded-round-4 border border-condition-card-drop-outline bg-condition-card-hover-card-bg px-spacing-6 py-spacing-4 text-condition-card-drop-text shadow-[0_2px_2px_0_rgba(0,0,0,0.12)]"
    >
      <GripVertical size={16} strokeWidth={1.8} className="shrink-0" />
      <span className="whitespace-nowrap text-14">{label}</span>
    </div>
  );
});
