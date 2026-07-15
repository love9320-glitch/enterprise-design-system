// useHoverTooltip — 라벨이 안 보이는 컨트롤(아이콘 전용 버튼 등)에 hover 시 명칭을 알려주는 툴팁.
// TruncatingText와 같은 패턴: normal Tooltip을 portal(document.body) + fixed로 띄워 부모 overflow를
// 벗어나고, viewport 경계에서 아래→위·좌우로 자동 반전한다. 대상 요소는 반환한 onMouseEnter/Leave로 감지.
//   - label: 표시할 문구(없으면 비활성 — 툴팁 안 뜸)
//   - delay: 아이콘이 늘어선 툴바에서 커서 이동 시 번쩍임 방지용 표시 지연(ms, 기본 300)
// 사용: const t = useHoverTooltip(label); <button onMouseEnter={t.onMouseEnter} .../>{t.tooltip}
import { useRef, useState, useLayoutEffect, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Tooltip } from './Tooltip';

export function useHoverTooltip(label, { delay = 300 } = {}) {
  const [rect, setRect] = useState(null);
  const [pos, setPos] = useState(null);
  const tipRef = useRef(null);
  const timerRef = useRef(null);
  const enabled = !!label;

  // 표시 지연 타이머 — 언마운트/leave 시 정리(잔여 setState 방지)
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const onMouseEnter = useCallback(
    (e) => {
      if (!enabled) return;
      const el = e.currentTarget;
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setRect(el.getBoundingClientRect()), delay);
    },
    [enabled, delay],
  );

  const onMouseLeave = useCallback(() => {
    clearTimeout(timerRef.current);
    setRect(null);
    setPos(null);
  }, []);

  // 툴팁 크기를 재서 아래 공간이 없으면 위로, 좌우 경계는 안으로 밀어 넣는다.
  useLayoutEffect(() => {
    if (!rect || !tipRef.current) return;
    const tw = tipRef.current.offsetWidth;
    const th = tipRef.current.offsetHeight;
    const gap = 6;
    const margin = 4;
    let top = rect.bottom + gap;
    if (top + th > window.innerHeight - margin) top = rect.top - gap - th;
    let left = rect.left + rect.width / 2 - tw / 2; // 대상 중앙 정렬
    if (left + tw > window.innerWidth - margin) left = window.innerWidth - tw - margin;
    if (left < margin) left = margin;
    setPos({ top, left });
  }, [rect]);

  const tooltip = rect
    ? createPortal(
        <div
          ref={tipRef}
          className="pointer-events-none fixed z-[1000]"
          style={{
            left: pos ? pos.left : rect.left,
            top: pos ? pos.top : rect.bottom,
            visibility: pos ? 'visible' : 'hidden', // 위치 계산 전 첫 프레임 숨김(점프 방지)
          }}
        >
          <Tooltip variant="normal" beak="none">
            {label}
          </Tooltip>
        </div>,
        document.body,
      )
    : null;

  return { onMouseEnter, onMouseLeave, tooltip };
}
