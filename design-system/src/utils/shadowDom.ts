// shadowDom — shadow-root 격리 환경 보정 유틸.
// 컴포넌트가 shadow-root 안에서 렌더되면 document 레벨 API가 리타게팅된다:
//   - document 리스너의 event.target → shadow host로 뭉개짐(내부 클릭이 '바깥'으로 오판)
//   - document.activeElement → shadow host(실제 포커스 요소는 shadowRoot.activeElement)
// 일반 문서에서는 두 함수 모두 기존 값과 동일하게 동작한다(무해한 통과).

/** document 리스너에서 실제 이벤트 타깃 — composedPath로 shadow 경계 안 원본을 복원 */
export function eventTargetOf(e: Event): Node | null {
  const path = e.composedPath?.();
  return (path && (path[0] as Node)) ?? (e.target as Node | null);
}

/** shadow 경계를 뚫고 들어간 실제 포커스 요소 (중첩 shadow-root도 끝까지 추적) */
export function deepActiveElement(): Element | null {
  let active: Element | null = document.activeElement;
  while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
  return active;
}
