// useOutsideDismiss — 열린 팝오버/드롭다운의 "바깥 클릭 닫기" 공용 훅 (Popover·Select 공유)
// capture 단계 mousedown에서 바깥 클릭을 선점해:
//   ① 메뉴만 닫고(onDismiss)
//   ② 그 mousedown과 이어지는 click을 삼켜 아래 요소(버튼 등)가 함께 클릭되지 않게 한다(click-through 방지).
// 첫 클릭 = 닫기 전용, 두 번째 클릭부터 평소처럼 동작한다. (Esc capture 처리와 동일한 우선순위 원칙)
import { useEffect } from 'react';

export function useOutsideDismiss({ open, refs, onDismiss, guard }) {
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      const inside = refs.some((r) => r.current && r.current.contains(e.target));
      if (inside) return;
      if (guard && !guard(e)) return; // 예: 중첩 팝오버 — 맨 위가 아니면 닫지 않음(삼키지도 않음)
      // 바깥 클릭 — 닫기만 하고 클릭은 삼킨다.
      // stopImmediatePropagation: 한 mousedown에 dismiss는 '하나만' — 닫힘이 동기 flush되면
      // 스택이 줄어 다음 리스너(부모 팝오버)가 자기를 맨 위로 오인해 연쇄로 닫히는 것을 차단.
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      const swallow = (ce) => {
        ce.stopPropagation();
        ce.preventDefault();
      };
      document.addEventListener('click', swallow, { capture: true, once: true });
      // 드래그아웃 등으로 click이 발생하지 않는 경우 잔여 리스너 정리
      setTimeout(() => document.removeEventListener('click', swallow, true), 300);
      // preventDefault로 포커스 이동까지 막히므로, 트리거/패널 안에 남은 포커스는 직접 blur해
      // 원래 일어났을 blur(입력 확정·focused 해제)를 복원한다 — 안 하면 인풋이 활성 상태로 남아
      // 재클릭 시 focus 이벤트가 없어 팝오버가 다시 열리지 않는다(DateField 등 onFocus 오픈형).
      const active = document.activeElement;
      if (active && refs.some((r) => r.current && r.current.contains(active))) active.blur();
      onDismiss(e);
    };
    document.addEventListener('mousedown', onDown, true);
    return () => document.removeEventListener('mousedown', onDown, true);
  });
}
