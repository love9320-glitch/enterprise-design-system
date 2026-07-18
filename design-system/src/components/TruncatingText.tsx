// TruncatingText — 말줄임(truncate) 텍스트 + hover 툴팁
// 영역이 좁아 텍스트가 잘릴 수 있는 곳에 사용한다. 실제로 잘렸을 때만(scrollWidth>clientWidth)
// hover 시 normal Tooltip으로 전체 텍스트를 보여준다.
// 툴팁은 portal(document.body) + fixed로 overflow를 벗어나며, viewport 경계에서
// 위→아래·오른쪽→왼쪽으로 자동 반전한다.
import { useRef, useState, useLayoutEffect } from 'react';
import type { ComponentPropsWithoutRef, ElementType } from 'react';
import { createPortal } from 'react-dom';
import { Tooltip } from './Tooltip';

interface TruncatingTextProps extends ComponentPropsWithoutRef<'p'> {
  as?: ElementType; // 'p' | 'span' | 'div' 등
}

export function TruncatingText({
  children,
  as: Component = 'p', // 'p' | 'span' | 'div' 등
  className = '',
  ...props
}: TruncatingTextProps) {
  const ref = useRef<HTMLElement | null>(null);
  const tipRef = useRef<HTMLDivElement | null>(null);
  const [tipRect, setTipRect] = useState<DOMRect | null>(null);
  const [tipPos, setTipPos] = useState<{ top: number; left: number } | null>(null);

  const onEnter = () => {
    const el = ref.current;
    if (el && el.scrollWidth > el.clientWidth) setTipRect(el.getBoundingClientRect());
  };
  const onLeave = () => {
    setTipRect(null);
    setTipPos(null);
  };

  // 툴팁 크기를 재서 viewport를 벗어나면 위→아래, 오른쪽→왼쪽으로 반전
  useLayoutEffect(() => {
    if (!tipRect || !tipRef.current) return;
    const tw = tipRef.current.offsetWidth;
    const th = tipRef.current.offsetHeight;
    const gap = 6;
    const margin = 4;
    let top = tipRect.top - gap - th;
    if (top < margin) top = tipRect.bottom + gap;
    let left = tipRect.left;
    if (left + tw > window.innerWidth - margin) left = window.innerWidth - tw - margin;
    if (left < margin) left = margin;
    setTipPos({ top, left });
  }, [tipRect]);

  return (
    <>
      <Component
        ref={ref}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        className={`truncate ${className}`}
        {...props}
      >
        {children}
      </Component>
      {/* 툴팁은 형제 + portal로 분리해 텍스트 요소 truncate 레이아웃에 영향 주지 않음 */}
      {tipRect &&
        createPortal(
          <div
            ref={tipRef}
            className="pointer-events-none fixed z-[1000]"
            style={{
              left: tipPos ? tipPos.left : tipRect.left,
              top: tipPos ? tipPos.top : tipRect.top,
              visibility: tipPos ? 'visible' : 'hidden',
            }}
          >
            <Tooltip variant="normal" beak="none">
              {children}
            </Tooltip>
          </div>,
          document.body,
        )}
    </>
  );
}
