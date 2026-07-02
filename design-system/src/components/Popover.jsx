// Popover — 임의의 트리거(버튼 등)에 떠 있는 패널(PopoverMenu 등)을 붙이는 범용 컨테이너.
// Select에 들어 있던 드롭다운 로직(위치 자동계산·외부클릭/Esc 닫기·portal+자동반전)을
// 트리거에 비종속적으로 추출한 것. 패널 내용은 children으로 자유롭게 구성한다(보통 PopoverMenu).
//
// 사용:
//   <Popover menuWidth={200} trigger={<Button rightIcon={ChevronDown}>메뉴</Button>}>
//     {(close) => (
//       <PopoverMenu width="100%">
//         <ListGroup>
//           <List title="이름 변경" onClick={close} />
//         </ListGroup>
//       </PopoverMenu>
//     )}
//   </Popover>
import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { usePopoverPosition } from './usePopoverPosition';

// 열려 있는 popover 패널들(menuRef)을 연 순서대로 보관 — 중첩 popover 외부클릭 판정에 사용.
// 패널은 각자 portal이라 DOM이 분리되므로, "나보다 나중에 열린(위) 패널 안 클릭"은 바깥으로 보지 않는다
// (예: DatePicker 팝오버 안에서 연/월·시간 선택 팝오버를 열어 클릭해도 바깥 팝오버가 닫히지 않게).
const openPopoverPanels = [];

export function Popover({
  trigger,                 // 트리거 ReactNode (예: <Button>) — 클릭 시 패널 토글
  children,                // 패널 내용: ReactNode 또는 (close) => ReactNode
  placement = 'auto',      // 'auto' | '{top|bottom|auto}-{left|right|auto}' (예: 'bottom-right', 'auto-right'=상하 자동·우측 고정)
  menuWidth,               // 패널 너비: 숫자(px)/CSS 길이. 미지정 시 트리거 너비
  open: openProp,          // controlled (선택)
  onOpenChange,
  disabled = false,
  className = '',
  ...props
}) {
  const isControlled = openProp !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isControlled ? openProp : internalOpen;

  const anchorRef = useRef(null);
  const menuRef = useRef(null);

  const setOpen = useCallback(
    (v) => {
      if (!isControlled) setInternalOpen(v);
      onOpenChange?.(v);
    },
    [isControlled, onOpenChange],
  );
  const close = useCallback(() => setOpen(false), [setOpen]);

  // 열린 동안 패널을 스택에 등록(연 순서 유지) — open 전환에만 의존해 재정렬 방지.
  useEffect(() => {
    if (!open) return undefined;
    openPopoverPanels.push(menuRef);
    return () => {
      const i = openPopoverPanels.indexOf(menuRef);
      if (i >= 0) openPopoverPanels.splice(i, 1);
    };
  }, [open]);

  // 외부 클릭 닫기 (트리거·패널 둘 다 바깥일 때 — 패널은 portal).
  // 중첩 대응: 외부 클릭은 "맨 위(가장 나중에 열린) 팝오버" 하나만 닫는다.
  //   → 시간/연월 선택 팝오버가 위에 있으면 그것부터 닫히고, 다음 외부 클릭에 DatePicker가 닫힌다.
  //   (이 패널/트리거 안 클릭은 당연히 안 닫음.)
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (anchorRef.current?.contains(e.target) || menuRef.current?.contains(e.target)) return;
      if (openPopoverPanels[openPopoverPanels.length - 1] !== menuRef) return; // 맨 위가 아니면 닫지 않음
      close();
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open, close]);

  // Esc 닫기 — capture 단계에서 먼저 받아 전파를 끊는다
  // (모달 안에서 팝오버만 닫히고 모달은 유지되도록 — Modal의 document Esc 리스너보다 우선)
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        close();
      }
    };
    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  }, [open, close]);

  // 패널 fixed 위치 계산 — Select와 공유하는 공용 훅
  const menuStyle = usePopoverPosition({ open, anchorRef, menuRef, placement, menuWidth });

  return (
    <>
      <span
        ref={anchorRef}
        {...props}
        className={`inline-flex ${className}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => !disabled && setOpen(!open)}
      >
        {trigger}
      </span>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            className="z-[1000]"
            style={menuStyle ?? { position: 'fixed', top: 0, left: 0, visibility: 'hidden' }}
          >
            {typeof children === 'function' ? children(close) : children}
          </div>,
          document.body,
        )}
    </>
  );
}
