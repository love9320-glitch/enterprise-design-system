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

  // 외부 클릭 닫기 (트리거·패널 둘 다 바깥일 때 — 패널은 portal)
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      const inAnchor = anchorRef.current?.contains(e.target);
      const inMenu = menuRef.current?.contains(e.target);
      if (!inAnchor && !inMenu) close();
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open, close]);

  // Esc 닫기
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
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
