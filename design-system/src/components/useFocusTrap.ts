// useFocusTrap — 열린 오버레이(Dialog/Modal 등)의 접근성 포커스 관리(2026-07-20, Radix FocusScope 참고·자체 구현).
//   ① 진입: 열릴 때 컨테이너(또는 첫 포커스 요소)로 포커스를 옮기고, 열기 직전 포커스 위치를 기억한다.
//   ② 트랩: Tab/Shift+Tab이 컨테이너 밖으로 나가지 않게 처음↔끝을 순환시킨다.
//   ③ 복원: 닫힐 때(언마운트·active=false) 열기 직전 포커스로 되돌린다.
// 중첩 모달은 각자 자기 컨테이너에 트랩을 걸므로 별도 스택 조율이 필요 없다(inner 이벤트는 outer로 안 샌다).
// 컨테이너 안 위젯(Select 옵션 순회·설정 패널 키보드 등)이 Tab을 이미 처리(preventDefault)하면 존중해 건너뛴다.
import { useEffect } from 'react';
import type { RefObject } from 'react';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export interface UseFocusTrapOptions {
  /** 진입 포커스 대상 — 'container'(기본, 컨테이너 자체) | 'first'(첫 포커스 가능 요소) */
  initialFocus?: 'container' | 'first';
}

export function useFocusTrap(
  active: boolean,
  containerRef: RefObject<HTMLElement | null>,
  { initialFocus = 'container' }: UseFocusTrapOptions = {},
) {
  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const focusables = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null, // 화면에 보이는 것만
      );

    // ① 진입 포커스
    if (initialFocus === 'first') {
      (focusables()[0] ?? container).focus();
    } else {
      container.focus();
    }

    // ② Tab 트랩 — 컨테이너 안 위젯이 이미 처리한 Tab(defaultPrevented)은 존중해 건너뛴다
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || e.defaultPrevented) return;
      const els = focusables();
      if (els.length === 0) {
        e.preventDefault();
        container.focus();
        return;
      }
      const first = els[0];
      const last = els[els.length - 1];
      const activeEl = document.activeElement;
      if (activeEl && !container.contains(activeEl)) {
        // 어쩌다 포커스가 밖에 있으면 안으로 회수
        e.preventDefault();
        first.focus();
      } else if (!e.shiftKey && activeEl === last) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && (activeEl === first || activeEl === container)) {
        e.preventDefault();
        last.focus();
      }
      // 그 외(내부 순방향/역방향 이동)는 브라우저 기본 동작에 맡긴다
    };
    container.addEventListener('keydown', onKeyDown);

    return () => {
      container.removeEventListener('keydown', onKeyDown);
      // ③ 포커스 복원 — 열기 직전 요소가 아직 문서에 살아 있을 때만
      if (previouslyFocused && document.contains(previouslyFocused)) {
        previouslyFocused.focus();
      }
    };
  }, [active, containerRef, initialFocus]);
}
