// ScrollArea — 커스텀 오버레이 스크롤바를 가진 스크롤 영역 (공용)
// 스크롤이 생기는 모든 곳에서 사용한다. 네이티브 스크롤바를 숨기고(.hide-native-scroll),
// 콘텐츠 위에 absolute thumb를 직접 그려 오버레이(콘텐츠 폭/높이를 줄이지 않음)로 표시한다.
//  - thumb 색: 기본 scroll-bar(gray-900-50), hover·드래그 중 scroll-bar-hover(gray-900-75)
//  - thumb 양끝 여백 TRACK_PAD로 끝에 닿지 않게, 드래그/스크롤로 위치 동기화
//  - horizontal=true 이면 가로 스크롤도 동일한 오버레이 thumb로 처리(세로와 함께 가능)
//
// 사용: <ScrollArea maxHeight={240}> ... </ScrollArea>            (세로 오버레이)
//       <ScrollArea maxHeight={240} horizontal> ... </ScrollArea> (세로+가로 오버레이)
import { useRef, useState, useCallback, useEffect, useLayoutEffect } from 'react';
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
// 시각 두께 6px 유지 + 클릭(히트) 영역은 10px — 투명 ::before를 사방 2px 확장해 hover/드래그 시작이
// 쉬워진다(pseudo-element 영역도 원본 요소의 히트 대상, 2026-07-06 지시 · 8→10 확대).
const THUMB_HIT = "before:absolute before:-inset-spacing-2 before:content-['']";
function Thumb({ orientation, thumb, active, colors, onDown, onEnter, onLeave }) {
  const vertical = orientation === 'vertical';
  const placement = vertical ? 'right-spacing-3 w-spacing-4' : 'bottom-spacing-3 h-spacing-4'; // 두께 6px(2026-07-06 8→6)
  const extent = vertical
    ? { top: `${thumb.pos}px`, height: `${thumb.size}px` }
    : { left: `${thumb.pos}px`, width: `${thumb.size}px` };
  return (
    <div
      onMouseDown={onDown}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={`absolute cursor-pointer rounded-round-00 ${THUMB_HIT} ${placement}`}
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
  vScrollEl = null,    // (선택) 세로 thumb를 자신의 viewport 대신 이 요소의 세로 스크롤에 연동.
                       //   가로 스크롤 콘텐츠 '안'에 세로 스크롤 영역이 중첩될 때(표 바디 등) 세로 thumb를
                       //   가로 스크롤을 안 받는 이 컴포넌트(고정 폭)에서 그려 항상 보이게 한다(2026-07-06).
  className = '',
  contentClassName = '',
  ...props
}) {
  const thumbColors = THUMB_COLORS[variant] ?? THUMB_COLORS.default;
  const scrollRef = useRef(null);
  const rootRef = useRef(null); // vScrollEl 연동 시 thumb 세로 위치 기준(루트 상단 대비 오프셋 측정)
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

  // 세로 트랙 정보 — vScrollEl 연동 시: 대상 요소 기준 메트릭 + 루트 상단 대비 오프셋(헤더 높이 등).
  // sizeInset은 sticky-top(자기 viewport 내부 요소) 케이스에서만 스크롤 계산에 반영된다.
  const vTrack = useCallback(() => {
    const el = scrollRef.current;
    if (vScrollEl) {
      const rootTop = rootRef.current?.getBoundingClientRect().top ?? 0;
      const topInset = vScrollEl.getBoundingClientRect().top - rootTop;
      const bottomInset =
        horizontal && el && el.scrollWidth > el.clientWidth + 1 ? CROSS_INSET : 0;
      return {
        vEl: vScrollEl,
        topInset,
        sizeInset: 0,
        trackH: vScrollEl.clientHeight - bottomInset - TRACK_PAD * 2,
      };
    }
    const { topInset, trackH } = verticalTrack(el, horizontal);
    return { vEl: el, topInset, sizeInset: topInset, trackH };
  }, [vScrollEl, horizontal]);

  const measureThumbs = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollWidth, clientWidth, scrollLeft } = el;

    // 세로 — vScrollEl이 있으면 그 요소의 스크롤 메트릭 기준
    const { vEl, topInset, sizeInset, trackH } = vTrack();
    const { scrollHeight, clientHeight, scrollTop } = vEl;
    if (scrollHeight <= clientHeight + 1) {
      setVThumb((t) => (t.visible ? { ...t, visible: false } : t));
    } else {
      const size = Math.max(((clientHeight - sizeInset) / (scrollHeight - sizeInset)) * trackH, THUMB_MIN);
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
  }, [horizontal, vTrack]);

  // 측정 rAF 코얼레싱(2026-07-07 감사) — scroll·RO·vScrollEl 리스너가 같은 프레임에 겹쳐도
  // DOM 측정+setState는 프레임당 1회만 수행한다(스크롤 중 measure 반복으로 인한 jank 방지).
  const rafRef = useRef(0);
  const updateThumbs = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      measureThumbs();
    });
  }, [measureThumbs]);
  useEffect(
    () => () => {
      // 취소 후 반드시 0으로 리셋 — 안 하면 StrictMode 재마운트 후 rafRef가 죽은 id로 남아
      // updateThumbs의 '이미 예약됨' 가드에 걸려 측정이 영영 스킵된다(썸 안 보임).
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
    },
    [],
  );

  useLayoutEffect(() => {
    updateThumbs(); // rAF 예약이라 effect 내 동기 setState 아님
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(updateThumbs);
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateThumbs, children]);

  // vScrollEl 연동 — 외부 세로 스크롤 요소의 scroll/resize에 thumb를 동기화한다.
  // (초기 1회 동기화는 위 useLayoutEffect가 담당 — vScrollEl 변경 시 updateThumbs 정체성이
  //  바뀌어 위 effect가 재실행되므로 여기서 직접 호출하지 않는다)
  useLayoutEffect(() => {
    if (!vScrollEl) return;
    vScrollEl.addEventListener('scroll', updateThumbs);
    const ro = new ResizeObserver(updateThumbs);
    ro.observe(vScrollEl);
    return () => {
      vScrollEl.removeEventListener('scroll', updateThumbs);
      ro.disconnect();
    };
  }, [vScrollEl, updateThumbs]);

  // 드래그 도중 언마운트(ESC로 팝오버/모달 닫힘 등) 시 window 리스너·body userSelect가
  // 잔존하지 않게 진행 중인 드래그의 정리 함수를 보관했다가 unmount에서 실행한다(2026-07-07 감사).
  const dragCleanupRef = useRef(null);
  useEffect(() => () => dragCleanupRef.current?.(), []);

  // thumb 드래그 — 세로/가로 공용. 클릭 지점 대비 이동량을 스크롤 비율로 환산해 동기화한다.
  const startThumbDrag = (e, axis) => {
    e.preventDefault();
    e.stopPropagation();
    const vertical = axis === 'vertical';
    const dragRef = vertical ? vDragRef : hDragRef;
    const setActive = vertical ? setVActive : setHActive;
    // 세로 드래그는 vScrollEl 연동 대상이 있으면 그 요소를 스크롤한다
    const el = vertical ? vTrack().vEl : scrollRef.current;
    dragRef.current = true;
    setActive(true);

    const start = vertical ? e.clientY : e.clientX;
    const startScroll = vertical ? el.scrollTop : el.scrollLeft;
    const maxScroll = vertical ? el.scrollHeight - el.clientHeight : el.scrollWidth - el.clientWidth;
    const trackLen = vertical ? vTrack().trackH : el.clientWidth - TRACK_PAD * 2;
    const thumbSize = vertical ? vThumb.size : hThumb.size;
    // 트랙이 thumb 최소 길이(24px)보다 짧으면 분모가 0/음수 → NaN 스크롤 점프 방지(이동 무시)
    const denom = trackLen - thumbSize;
    const ratio = denom > 0 ? maxScroll / denom : 0;

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
      dragCleanupRef.current = null;
    };
    document.body.style.userSelect = 'none';
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    dragCleanupRef.current = onUp;
  };

  // 기본은 relative(thumb의 기준). 단 className에 position 유틸(absolute 등)을 주면 그걸 따른다
  // — 부모 박스를 explicit height로 채워(예: absolute inset-0) 내부 h-full 스크롤이 확실히 동작하게.
  const hasPosition = /(^|\s)(absolute|fixed|relative|sticky)(\s|$)/.test(className);
  return (
    <div ref={rootRef} className={`${hasPosition ? '' : 'relative'} ${className}`} {...props}>
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
