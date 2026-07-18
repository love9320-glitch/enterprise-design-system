// usePanelKeyboard — 설정 팝오버 패널의 키보드 규약(규칙 20 ⑶⑷) 공용 훅.
// ConditionSettingMenu·ScoreSettingMenu(ScreeningConditionCard)가 공유하던 복제 코드를 추출(2026-07-18).
//
// 담당:
//  · 마운트 시 패널 포커스 — 패널은 위치 계산 전 visibility:hidden이라 즉시 focus()가 실패한다 → 한 틱 지연.
//    (Tab/Enter 체인이 포커스 없이는 패널에 닿지 않는다)
//  · Tab = 패널 내부 DOM(버튼·인풋·tabindex 요소) 자연 이동. disabled 요소는 수집에서 제외 —
//    포함하면 실제 마지막 요소에서 경계 처리가 안 걸려 포커스가 패널 밖(GNB)으로 샌다.
//  · 경계 규칙: 마지막 요소에서 Tab → 완성(complete)이면 onCommit(저장+다음 진행) /
//    미완성이면 onSkip(저장 없이 닫고 다음 정거장) / onSkip 없으면 처음으로 순환.
//    처음 요소에서 Shift+Tab → 끝으로 순환(팝오버 밖 이탈 방지).
//
// 사용: const { menuRef, handleTabKey } = usePanelKeyboard({ complete, onCommit, onSkip });
//       <div ref={menuRef} tabIndex={-1} className="outline-none" onKeyDown={handleTabKey}>…</div>
import { useRef, useEffect } from 'react';

export function usePanelKeyboard({ complete, onCommit, onSkip }) {
  const menuRef = useRef(null);
  useEffect(() => {
    const t = setTimeout(() => menuRef.current?.focus(), 0);
    return () => clearTimeout(t);
  }, []);

  const focusablesIn = () =>
    Array.from(
      menuRef.current?.querySelectorAll(
        "button:not([disabled]), input:not([disabled]), [tabindex='0']",
      ) ?? [],
    ).filter((el) => el.offsetParent !== null);

  const handleTabKey = (e) => {
    if (e.key !== 'Tab' || e.defaultPrevented) return;
    const els = focusablesIn();
    if (!els.length) {
      e.preventDefault();
      if (complete) onCommit();
      else onSkip?.();
      return;
    }
    const i = els.indexOf(e.target);
    if (!e.shiftKey && i === els.length - 1) {
      e.preventDefault();
      if (complete) onCommit();
      else if (onSkip) onSkip();
      else els[0].focus();
    } else if (e.shiftKey && i <= 0) {
      e.preventDefault();
      els[els.length - 1].focus();
    }
    // 그 외는 브라우저 기본 이동(패널 내부 순서대로)
  };

  return { menuRef, handleTabKey };
}
