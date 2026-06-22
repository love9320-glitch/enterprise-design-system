// ScrollArea — 커스텀 오버레이 스크롤바를 가진 스크롤 영역 (공용)
// 스크롤이 생기는 모든 곳에서 사용한다. 네이티브 스크롤바를 숨기고(.hide-native-scroll),
// 콘텐츠 위에 absolute thumb를 직접 그려 오버레이(콘텐츠 폭/높이를 줄이지 않음)로 표시한다.
//  - thumb 색: 기본 scroll-bar(gray-900-50), hover·드래그 중 scroll-bar-hover(gray-900-75)
//  - thumb 양끝 여백 TRACK_PAD로 끝에 닿지 않게, 드래그/스크롤로 위치 동기화
//  - horizontal=true 이면 가로 스크롤도 동일한 오버레이 thumb로 처리(세로와 함께 가능)
//
// 사용: <ScrollArea maxHeight={240}> ... </ScrollArea>            (세로 오버레이)
//       <ScrollArea maxHeight={240} horizontal> ... </ScrollArea> (세로+가로 오버레이)
import { useRef, useState, useCallback, useLayoutEffect } from 'react';
import { listColors } from '../tokens';

const THUMB_MIN = 24;   // thumb 최소 길이(px)
const TRACK_PAD = 6;    // thumb 양끝 여백(px)
const CROSS_INSET = 16; // 가로·세로 스크롤이 동시에 있을 때 교차 영역만큼 트랙을 줄이는 여백(px)

// 세로 트랙 메트릭 — sticky 헤더(topInset)와 가로 스크롤바 자리(bottomInset)를 제외한 트랙 높이.
function verticalTrack(el, horizontal) {
  const stickyTop = el.querySelector('[data-scroll-sticky-top]');
  const topInset = stickyTop ? stickyTop.offsetHeight : 0;
  const bottomInset = horizontal && el.scrollWidth > el.clientWidth + 1 ? CROSS_INSET : 0;
  return { topInset, trackH: el.clientHeight - topInset - bottomInset - TRACK_PAD * 2 };
}

// thumb 색 변형 — default(밝은 배경)·light(어두운 배경 위 흰색)
const THUMB_COLORS = {
  default: { base: listColors['scroll-bar'], active: listColors['scroll-bar-hover'] },
  light:   { base: listColors['scroll-bar-light'], active: listColors['scroll-bar-light-hover'] },
};

// 오버레이 thumb — 세로/가로 공용(축만 다름).
function Thumb({ orientation, thumb, active, colors, onDown, onEnter, onLeave }) {
  const vertical = orientation === 'vertical';
  const placement = vertical ? 'right-spacing-3 w-spacing-5' : 'bottom-spacing-3 h-spacing-5';
  const extent = vertical
    ? { top: `${thumb.pos}px`, height: `${thumb.size}px` }
    : { left: `${thumb.pos}px`, width: `${thumb.size}px` };
  return (
    <div
      onMouseDown={onDown}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={`absolute cursor-pointer rounded-round-00 ${placement}`}
      style={{
        ...extent,
        opacity: thumb.visible ? 1 : 0,
        pointerEvents: thumb.visible ? 'auto' : 'none',
        backgroundColor: active ? colors.active : colors.base,
      }}
    />
  );
}

export function ScrollArea({
  children,
  maxHeight,
  horizontal = false,
  variant = 'default', // 'default'(밝은 배경) | 'light'(어두운 배경 위 흰색 thumb)
  onViewport,          // (선택) 내부 스크롤 요소를 넘겨받는 콜백 — 부모가 scrollTop 등을 직접 제어할 때
  onScroll,            // (선택) 스크롤 이벤트 패스스루(내부 thumb 갱신과 함께 호출)
  className = '',
  contentClassName = '',
  ...props
}) {
  const thumbColors = THUMB_COLORS[variant] ?? THUMB_COLORS.default;
  const scrollRef = useRef(null);
  // 내부 scrollRef를 채우면서 외부로 스크롤 요소를 전달하는 콜백 ref
  const setViewport = useCallback(
    (el) => {
      scrollRef.current = el;
      onViewport?.(el);
    },
    [onViewport],
  );
  const vDragRef = useRef(false);
  const hDragRef = useRef(false);
  const [vThumb, setVThumb] = useState({ pos: 0, size: 0, visible: false });
  const [hThumb, setHThumb] = useState({ pos: 0, size: 0, visible: false });
  const [vActive, setVActive] = useState(false); // hover 또는 드래그 중
  const [hActive, setHActive] = useState(false);

  const maxHeightStyle = typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight;

  const updateThumbs = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollHeight, clientHeight, scrollTop, scrollWidth, clientWidth, scrollLeft } = el;

    // 세로
    if (scrollHeight <= clientHeight + 1) {
      setVThumb((t) => (t.visible ? { ...t, visible: false } : t));
    } else {
      const { topInset, trackH } = verticalTrack(el, horizontal);
      const size = Math.max(((clientHeight - topInset) / (scrollHeight - topInset)) * trackH, THUMB_MIN);
      const pos = TRACK_PAD + topInset + (scrollTop / (scrollHeight - clientHeight)) * (trackH - size);
      setVThumb({ pos, size, visible: true });
    }

    // 가로
    if (!horizontal || scrollWidth <= clientWidth + 1) {
      setHThumb((t) => (t.visible ? { ...t, visible: false } : t));
    } else {
      const trackW = clientWidth - TRACK_PAD * 2;
      const size = Math.max((clientWidth / scrollWidth) * trackW, THUMB_MIN);
      const pos = TRACK_PAD + (scrollLeft / (scrollWidth - clientWidth)) * (trackW - size);
      setHThumb({ pos, size, visible: true });
    }
  }, [horizontal]);

  useLayoutEffect(() => {
    updateThumbs();
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(updateThumbs);
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateThumbs, children]);

  // thumb 드래그 — 세로/가로 공용. 클릭 지점 대비 이동량을 스크롤 비율로 환산해 동기화한다.
  const startThumbDrag = (e, axis) => {
    e.preventDefault();
    e.stopPropagation();
    const vertical = axis === 'vertical';
    const dragRef = vertical ? vDragRef : hDragRef;
    const setActive = vertical ? setVActive : setHActive;
    const el = scrollRef.current;
    dragRef.current = true;
    setActive(true);

    const start = vertical ? e.clientY : e.clientX;
    const startScroll = vertical ? el.scrollTop : el.scrollLeft;
    const maxScroll = vertical ? el.scrollHeight - el.clientHeight : el.scrollWidth - el.clientWidth;
    const trackLen = vertical ? verticalTrack(el, horizontal).trackH : el.clientWidth - TRACK_PAD * 2;
    const thumbSize = vertical ? vThumb.size : hThumb.size;
    const ratio = maxScroll / (trackLen - thumbSize);

    const onMove = (ev) => {
      const delta = (vertical ? ev.clientY : ev.clientX) - start;
      if (vertical) el.scrollTop = startScroll + delta * ratio;
      else el.scrollLeft = startScroll + delta * ratio;
    };
    const onUp = () => {
      dragRef.current = false;
      setActive(false);
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    document.body.style.userSelect = 'none';
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  // 기본은 relative(thumb의 기준). 단 className에 position 유틸(absolute 등)을 주면 그걸 따른다
  // — 부모 박스를 explicit height로 채워(예: absolute inset-0) 내부 h-full 스크롤이 확실히 동작하게.
  const hasPosition = /(^|\s)(absolute|fixed|relative|sticky)(\s|$)/.test(className);
  return (
    <div className={`${hasPosition ? '' : 'relative'} ${className}`} {...props}>
      <div
        ref={setViewport}
        onScroll={(e) => {
          updateThumbs();
          onScroll?.(e);
        }}
        className={`hide-native-scroll ${horizontal ? 'overflow-auto' : 'overflow-y-auto'} ${contentClassName}`}
        style={{ maxHeight: maxHeightStyle }}
      >
        {children}
      </div>

      {/* 세로 오버레이 thumb — 항상 렌더, opacity로 표시 제어 */}
      <Thumb
        orientation="vertical"
        thumb={vThumb}
        active={vActive}
        colors={thumbColors}
        onDown={(e) => startThumbDrag(e, 'vertical')}
        onEnter={() => setVActive(true)}
        onLeave={() => {
          if (!vDragRef.current) setVActive(false);
        }}
      />

      {/* 가로 오버레이 thumb */}
      {horizontal && (
        <Thumb
          orientation="horizontal"
          thumb={hThumb}
          active={hActive}
          colors={thumbColors}
          onDown={(e) => startThumbDrag(e, 'horizontal')}
          onEnter={() => setHActive(true)}
          onLeave={() => {
            if (!hDragRef.current) setHActive(false);
          }}
        />
      )}
    </div>
  );
}
