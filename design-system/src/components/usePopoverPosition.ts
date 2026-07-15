// usePopoverPosition — 트리거(anchorRef) 기준으로 떠 있는 패널(menuRef)의 fixed 위치를 계산.
// Select·Popover가 공유하는 드롭다운 위치 로직(공간에 따른 위/아래·좌/우 자동 반전, portal 전제).
//   - placement: 'auto' | '{top|bottom|auto}-{left|right|auto}' (축별 auto 지원)
//   - menuWidth: 숫자(px)/CSS 길이. 미지정 시 트리거 너비
//   - deps: 패널 높이/너비를 바꾸는 값(검색 결과 개수 등)을 넘기면 재계산
// open=false면 null을 반환한다(패널 미표시).
import { useState, useLayoutEffect } from 'react';
import { spacing } from '../tokens';

// 트리거 ↔ 패널 간격 — spacing-3(4px) 토큰
const MENU_GAP = parseInt(spacing['spacing-3'], 10);

export function usePopoverPosition({ open, anchorRef, menuRef, placement = 'auto', menuWidth, deps = [] }: any) {
  const [menuStyle, setMenuStyle] = useState(null);

  useLayoutEffect(() => {
    if (!open) {
      // 닫힐 때 위치 스타일 리셋 — 의도된 effect 내 setState
      setMenuStyle(null); // eslint-disable-line react-hooks/set-state-in-effect
      return;
    }
    const measure = () => {
      const anchor = anchorRef.current;
      if (!anchor) return;
      const tr = anchor.getBoundingClientRect();
      const menu = menuRef.current;
      const menuH = menu?.offsetHeight ?? 0;
      const gap = MENU_GAP;
      // 패널 너비(숫자) — 위치 계산용. 숫자/미지정은 즉시 알 수 있고, 문자열만 측정 fallback.
      const w =
        menuWidth == null
          ? tr.width
          : typeof menuWidth === 'number'
            ? menuWidth
            : (menu?.offsetWidth ?? tr.width);
      const widthCss = menuWidth != null && typeof menuWidth !== 'number' ? menuWidth : `${w}px`;

      let vertical;
      let horizontal;
      if (placement === 'auto') {
        vertical = 'auto';
        horizontal = 'auto';
      } else {
        [vertical, horizontal] = placement.split('-');
      }
      // 축별 auto — 'auto-right'(상하 자동·우측 고정), 'bottom-auto'(하단 고정·좌우 자동) 등 부분 자동 지원
      if (vertical === 'auto') {
        const spaceBelow = window.innerHeight - tr.bottom;
        const spaceAbove = tr.top;
        vertical = spaceBelow < menuH + gap && spaceAbove > spaceBelow ? 'top' : 'bottom';
      }
      if (horizontal === 'auto') {
        horizontal = tr.left + w > window.innerWidth ? 'right' : 'left';
      }

      const top = vertical === 'top' ? tr.top - gap - menuH : tr.bottom + gap;
      const left = horizontal === 'right' ? tr.right - w : tr.left;
      // 값이 같으면 이전 객체를 유지 — 참조 변경으로 인한 팝오버 서브트리 불필요 리렌더 방지
      setMenuStyle((prev) =>
        prev && prev.top === top && prev.left === left && prev.width === widthCss
          ? prev
          : { position: 'fixed', top, left, width: widthCss },
      );
    };
    measure(); // 열림 직후 1회는 동기 측정 — 첫 프레임에 올바른 위치로 표시
    // scroll(capture, 문서 내 모든 스크롤에 발화)·resize는 rAF로 코얼레싱 —
    // 프레임당 1회만 측정/재계산해 스크롤 중 측정+리렌더 반복을 줄인다(2026-07-07 감사)
    let raf = 0;
    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        measure();
      });
    };
    window.addEventListener('resize', schedule);
    window.addEventListener('scroll', schedule, true);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('scroll', schedule, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, placement, menuWidth, ...deps]);

  return menuStyle;
}
