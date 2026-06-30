// TextArea — 여러 줄 텍스트 입력 (Figma text area, solid 타입)
// Input의 멀티라인 버전 — 상태(default/hover/focused/filled)는 CSS·실제 입력값으로 자동,
// disabled/readOnly/error는 props. 하단에 글자수 카운터(Figma countTxt) 옵션.
// 색·간격·라운드는 Input과 동일한 text-field-* 시멘틱 토큰 사용(새 토큰 없음).
//
// 스크롤바(규칙 9): textarea는 ScrollArea(div용 JS 오버레이)로 감쌀 수 없고, 네이티브 스크롤바는
//   hover가 브라우저 한계로 동작 안 한다 → **네이티브 스크롤(커서 추적 유지)은 그대로 두고
//   `.hide-native-scroll`로 기본 바만 숨긴 뒤, ScrollArea와 같은 오버레이 thumb를 textarea 스크롤에
//   동기화해 얹는다**(scroll-bar 토큰, hover/드래그 동작). 커서 추적·hover 둘 다 만족.
//
// 에러 표현 규칙: Input과 동일 — 테두리 대신 박스 아래 absolute 툴팁 오버레이(레이아웃 영향 0).
import { useState, useRef, useCallback, useLayoutEffect } from 'react';
import { listColors } from '../tokens';
import { Tooltip } from './Tooltip';

// 편집 가능 상태의 테두리(ring) — hover/focus 2px(border-2 토큰), 색은 시멘틱 토큰.
const RING =
  'ring-inset ring-text-field-hover-line hover:ring-2 focus-within:ring-2 focus-within:ring-text-field-focused-line';

// 오버레이 thumb 메트릭 — ScrollArea와 동일 상수/색
const THUMB_MIN = 24; // thumb 최소 길이(px)
const TRACK_PAD = 6; // thumb 양끝 여백(px)
const THUMB = { base: listColors['scroll-bar'], active: listColors['scroll-bar-hover'] };

export function TextArea({
  value,
  defaultValue,
  onChange,
  placeholder = '텍스트를 입력하세요',
  rows = 4,                 // 기본 높이(줄 수). autoGrow=false면 고정 높이(초과 시 스크롤), true면 최소 높이
  autoGrow = false,         // 입력량에 따라 높이 자동 증가
  maxRows,                  // autoGrow일 때 최대 행(초과 시 스크롤). 미지정 + autoGrow = 무한 증가
  maxLength,                // 최대 글자수(입력 제한 + 카운터 분모)
  showCount = true,         // 글자수 카운터 표시(Figma countTxt) — maxLength 있으면 'N/max', 없으면 'N'
  disabled = false,
  readOnly = false,
  error = false,
  errorMessage = '',
  width = 320,              // 너비: 숫자(px) 또는 CSS 길이 문자열. 미지정 시 320px
  className = '',
  textareaProps = {},
  ...props
}) {
  const interactive = !disabled && !readOnly;
  const widthStyle = typeof width === 'number' ? `${width}px` : width;
  const taRef = useRef(null);
  const dragRef = useRef(false);
  const [internalLen, setInternalLen] = useState((defaultValue ?? '').length);
  const len = value != null ? value.length : internalLen;
  const [thumb, setThumb] = useState({ pos: 0, size: 0, visible: false });
  const [active, setActive] = useState(false); // hover 또는 드래그 중

  const textColor = disabled
    ? 'text-text-field-disabled-text'
    : readOnly
      ? 'text-text-field-readonly-text'
      : 'text-text-field-filled-text';
  // disabled면 플레이스홀더도 더 연하게(Figma disabled = 연한 회색)
  const placeholderColor = disabled
    ? 'placeholder:text-text-field-disabled-text'
    : 'placeholder:text-text-field-default-text';

  // 네이티브 스크롤 메트릭 → 오버레이 thumb 위치/크기 (ScrollArea 세로 thumb와 동일 계산)
  const updateThumb = useCallback(() => {
    const el = taRef.current;
    if (!el) return;
    const { scrollHeight, clientHeight, scrollTop } = el;
    if (scrollHeight <= clientHeight + 1) {
      setThumb((t) => (t.visible ? { ...t, visible: false } : t));
      return;
    }
    const trackH = clientHeight - TRACK_PAD * 2;
    const size = Math.max((clientHeight / scrollHeight) * trackH, THUMB_MIN);
    const pos = TRACK_PAD + (scrollTop / (scrollHeight - clientHeight)) * (trackH - size);
    setThumb({ pos, size, visible: true });
  }, []);

  // autoGrow: 내용에 맞춰 height 조정(최소 rows, autoGrow=false면 rows 고정, maxRows 초과 시 그 높이로 캡→스크롤).
  const autoSize = useCallback(() => {
    const el = taRef.current;
    if (!el) return;
    if (!autoGrow) {
      el.style.height = ''; // rows 속성이 높이를 제어
      return;
    }
    el.style.height = 'auto';
    const cs = getComputedStyle(el);
    const lh = parseFloat(cs.lineHeight) || 24;
    const pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    let h = Math.max(el.scrollHeight, rows * lh + pad); // 최소 rows
    if (maxRows != null) h = Math.min(h, maxRows * lh + pad); // 최대 maxRows
    el.style.height = `${h}px`;
  }, [autoGrow, maxRows, rows]);

  useLayoutEffect(() => {
    autoSize();
    updateThumb();
    const el = taRef.current;
    if (!el) return undefined;
    // RO는 읽기 전용(updateThumb)만 — autoSize가 height를 바꾸므로 RO에서 호출하면 루프
    const ro = new ResizeObserver(updateThumb);
    ro.observe(el);
    const onResize = () => {
      autoSize();
      updateThumb();
    };
    window.addEventListener('resize', onResize);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, [autoSize, updateThumb, value, rows]);

  const handleChange = (e) => {
    if (value == null) setInternalLen(e.target.value.length);
    autoSize();
    updateThumb();
    onChange?.(e);
  };

  // thumb 드래그 → textarea.scrollTop 동기화 (ScrollArea와 동일 방식)
  const startDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const el = taRef.current;
    dragRef.current = true;
    setActive(true);
    const start = e.clientY;
    const startScroll = el.scrollTop;
    const maxScroll = el.scrollHeight - el.clientHeight;
    const trackH = el.clientHeight - TRACK_PAD * 2;
    const ratio = maxScroll / (trackH - thumb.size);
    const onMove = (ev) => {
      el.scrollTop = startScroll + (ev.clientY - start) * ratio;
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

  return (
    <div
      style={{ width: widthStyle }}
      className={`relative rounded-round-4 bg-text-field-default-bg pl-spacing-6 pr-spacing-4 transition-shadow ${
        interactive ? RING : 'cursor-not-allowed'
      } ${className}`}
      {...props}
    >
      {/* textarea가 박스 전체(상·하단 flush)를 채우는 스크롤 영역 — 위·아래 여백은 안쪽 패딩(py-spacing-4).
          카운터는 우하단 오버레이라 입력 텍스트와 겹칠 수 있다(의도). */}
      <textarea
          ref={taRef}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          onScroll={updateThumb}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          rows={rows}
          maxLength={maxLength}
          aria-invalid={error || undefined}
          className={`hide-native-scroll block w-full resize-none overflow-y-auto bg-transparent pt-spacing-4 pb-spacing-12 text-14 outline-none disabled:cursor-not-allowed read-only:cursor-default ${placeholderColor} ${textColor}`}
          {...textareaProps}
        />
        {/* 오버레이 thumb — 항상 렌더, opacity로 표시 제어(콘텐츠 폭을 줄이지 않음) */}
        <div
          onMouseDown={startDrag}
          onMouseEnter={() => setActive(true)}
          onMouseLeave={() => {
            if (!dragRef.current) setActive(false);
          }}
          className="absolute right-spacing-3 w-spacing-5 cursor-pointer rounded-round-00"
          style={{
            top: `${thumb.pos}px`,
            height: `${thumb.size}px`,
            opacity: thumb.visible ? 1 : 0,
            pointerEvents: thumb.visible ? 'auto' : 'none',
            backgroundColor: active ? THUMB.active : THUMB.base,
          }}
        />

      {/* 글자수 카운터 — 우하단 오버레이(입력 텍스트와 겹칠 수 있음). readOnly면 숨김(Figma read only 변형) */}
      {showCount && !readOnly && (
        <p className="pointer-events-none absolute bottom-spacing-4 right-spacing-6 text-12 text-font-icon-3">
          {len}
          {maxLength != null ? `/${maxLength}` : ''}
        </p>
      )}

      {/* 에러 툴팁 — absolute 오버레이라 박스 아래 공간을 차지하지 않는다 */}
      {error && errorMessage && (
        <div className="absolute left-0 top-full z-10 mt-spacing-2">
          <Tooltip variant="error" beak="top">
            {errorMessage}
          </Tooltip>
        </div>
      )}
    </div>
  );
}
