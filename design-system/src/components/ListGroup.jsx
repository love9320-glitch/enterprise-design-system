// ListGroup — List 묶음 (Figma option list / list group)
// 상하 패딩(py-spacing-4) 안에서 List들을 세로로 쌓고, 개수가 maxVisible(기본 6)을
// 넘으면 내부 스크롤한다.
//
// 스크롤바는 "오버레이" 방식 — 네이티브 스크롤바를 숨기고(.hide-native-scroll),
// 콘텐츠 위에 absolute thumb를 직접 그린다(콘텐츠 폭을 줄이지 않음).
// thumb 색: 기본 scroll-bar(gray-900-50), hover·드래그 중 scroll-bar-hover(gray-900-75).
import { useRef, useState, useCallback, useLayoutEffect } from 'react';
import { listColors } from '../tokens';

const ITEM_HEIGHT = 32;  // List 한 행의 표시 높이(px) — min-h-32
const PADDING_Y = 6;     // 상하 패딩(px) — spacing-4
const THUMB_MIN = 24;    // thumb 최소 높이(px)
const TRACK_PAD = 6;     // 스크롤바 thumb 상하 여백(px) — 끝에 닿지 않도록

export function ListGroup({ children, maxVisible = 6, className = '', ...props }) {
  const scrollRef = useRef(null);
  const draggingRef = useRef(false);
  const [thumb, setThumb] = useState({ top: 0, height: 0, visible: false });
  const [active, setActive] = useState(false); // hover 또는 드래그 중

  const maxHeight = maxVisible * ITEM_HEIGHT + PADDING_Y * 2;

  const updateThumb = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollHeight, clientHeight, scrollTop } = el;
    if (scrollHeight <= clientHeight + 1) {
      setThumb((t) => (t.visible ? { ...t, visible: false } : t));
      return;
    }
    const trackH = clientHeight - TRACK_PAD * 2; // 상하 여백을 뺀 트랙 길이
    const height = Math.max((clientHeight / scrollHeight) * trackH, THUMB_MIN);
    const top = TRACK_PAD + (scrollTop / (scrollHeight - clientHeight)) * (trackH - height);
    setThumb({ top, height, visible: true });
  }, []);

  useLayoutEffect(() => {
    updateThumb();
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(updateThumb);
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateThumb, children]);

  // thumb 드래그로 스크롤
  const onThumbDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    draggingRef.current = true;
    setActive(true);
    const el = scrollRef.current;
    const startY = e.clientY;
    const startScroll = el.scrollTop;
    const { scrollHeight, clientHeight } = el;
    const trackH = clientHeight - TRACK_PAD * 2;
    const ratio = (scrollHeight - clientHeight) / (trackH - thumb.height);

    const onMove = (ev) => {
      el.scrollTop = startScroll + (ev.clientY - startY) * ratio;
    };
    const onUp = () => {
      draggingRef.current = false;
      setActive(false);
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    document.body.style.userSelect = 'none';
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  return (
    <div className={`relative w-full bg-list-group-bg ${className}`} {...props}>
      {/* 상하 패딩을 스크롤 영역 안에 두어, 스크롤 시 패딩까지 함께 움직인다 */}
      <div
        ref={scrollRef}
        role="listbox"
        onScroll={updateThumb}
        className="hide-native-scroll overflow-y-auto py-spacing-4"
        style={{ maxHeight: `${maxHeight}px` }}
      >
        {children}
      </div>

      {/* 오버레이 thumb — 항상 렌더하고 opacity로 숨겨, 클릭/리렌더로 사라지지 않게 한다.
          hover·드래그 중에는 scroll-bar-hover 토큰 색을 사용한다. */}
      <div
        onMouseDown={onThumbDown}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => {
          if (!draggingRef.current) setActive(false);
        }}
        className="absolute right-spacing-3 w-spacing-5 cursor-pointer rounded-round-00"
        style={{
          top: `${thumb.top}px`,
          height: `${thumb.height}px`,
          opacity: thumb.visible ? 1 : 0,
          pointerEvents: thumb.visible ? 'auto' : 'none',
          // 색은 시멘틱 토큰값을 직접 적용 (Tailwind 클래스명 -hover 모호성 회피)
          backgroundColor: active ? listColors['scroll-bar-hover'] : listColors['scroll-bar'],
        }}
      />
    </div>
  );
}
