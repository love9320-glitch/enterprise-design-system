// Select — 드롭다운 선택 (Figma 02_textfield / select)
// 트리거는 Input과 동일한 필드 컨테이너 + chevron, 펼친 목록은 커스텀 PopoverMenu(옵션 목록).
// native <select> 대신 직접 구현해 디자인 시스템 목록(List/ListGroup)을 그대로 사용한다.
//
// 기능:
//  - 키보드: ↑/↓ 이동, Enter/Space 열기·선택, Esc 닫기, Tab 닫기
//  - 외부 클릭 시 닫힘
//  - 선택 항목은 List selected(파란색), 키보드 강조는 List highlighted(hover 색)
// 색은 tf-* 시멘틱 토큰(트리거)과 list-* 토큰(목록)을 사용.
import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';
import { Tooltip } from './Tooltip';
import { TruncatingText } from './TruncatingText';
import { PopoverMenu } from './PopoverMenu';
import { ListGroup } from './ListGroup';
import { List } from './List';
import { ListEmpty } from './ListEmpty';
import { spacing } from '../tokens';

// 편집 가능 상태의 테두리(ring) — hover/focus 모두 2px(border-2 토큰).
const RING = 'ring-inset ring-tf-hover-line hover:ring-2 focus:ring-2 focus:ring-tf-focused-line';
// 트리거 ↔ 드롭다운 간격 — spacing-3(4px) 토큰
const MENU_GAP = parseInt(spacing['spacing-3'], 10);

export function Select({
  value,
  defaultValue = '',
  onChange,
  options = [],            // [{ value, label }]
  placeholder = '선택하세요',
  disabled = false,
  readOnly = false,
  error = false,
  errorMessage = '',
  width = 200,             // 트리거 너비: 숫자(px) | CSS 길이 | 'hug'(콘텐츠 맞춤). 미지정 시 200px
  maxWidth,                // 트리거 최대 너비(숫자 px/CSS 길이). hug일 때 제한용 — 넘으면 말줄임
  menuWidth,               // 드롭다운 너비: 숫자(px)/CSS 길이. 미지정 시 트리거와 동일
  placement = 'auto',      // 'auto' | 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
  searchable = false,      // 드롭다운 상단 검색바로 옵션 필터
  searchPlaceholder = '검색어를 입력하세요',
  emptyMessage = '옵션이 없습니다.',
  noResultMessage = '검색 결과가 없습니다.',
  className = '',
  ...props
}) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue);
  const current = isControlled ? value : internal;
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const [query, setQuery] = useState('');
  // 드롭다운 fixed 위치/너비 — 트리거 rect와 placement로 계산 (portal로 띄움)
  const [menuStyle, setMenuStyle] = useState(null);
  // 트리거 텍스트 최대 너비(px) — 크롬 flex/grid truncate 보강용으로 명시 지정
  const [textMaxW, setTextMaxW] = useState(undefined);

  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  const selectedOption = options.find((o) => o.value === current);
  const isPlaceholder = !selectedOption;
  const interactive = !disabled && !readOnly;
  const widthStyle =
    width === 'hug' ? 'fit-content' : typeof width === 'number' ? `${width}px` : width;
  const maxWidthStyle =
    maxWidth != null ? (typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth) : undefined;

  // 검색 필터링된 옵션 (searchable + 검색어 있을 때만)
  const filtered =
    searchable && query.trim()
      ? options.filter((o) =>
          String(o.label).toLowerCase().includes(query.trim().toLowerCase()),
        )
      : options;

  const selectValue = useCallback(
    (val) => {
      if (!isControlled) setInternal(val);
      onChange?.({ target: { value: val } });
      setOpen(false);
      triggerRef.current?.focus();
    },
    [isControlled, onChange],
  );

  // 트리거 폭을 재서 텍스트 max-width를 계산(콘텐츠폭 − chevron − gap) — 크롬 truncate 보강.
  // hug(fit-content)는 트리거가 콘텐츠를 따라가므로 max-width를 주면 무한 축소 순환이 생긴다 → 제외.
  useLayoutEffect(() => {
    const trigger = triggerRef.current;
    if (!trigger || width === 'hug') {
      setTextMaxW(undefined);
      return;
    }
    const update = () => {
      const cs = getComputedStyle(trigger);
      const pl = parseFloat(cs.paddingLeft) || 0;
      const pr = parseFloat(cs.paddingRight) || 0;
      const gapPx = parseFloat(cs.columnGap) || 0;
      const chevronW = 16;
      const contentW = trigger.clientWidth - pl - pr;
      setTextMaxW(Math.max(0, contentW - chevronW - gapPx));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(trigger);
    return () => ro.disconnect();
  }, [width]);

  // 외부 클릭 닫기 (트리거·드롭다운 둘 다 바깥일 때 — 드롭다운은 portal)
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      const inRoot = rootRef.current?.contains(e.target);
      const inMenu = menuRef.current?.contains(e.target);
      if (!inRoot && !inMenu) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  // 열릴 때: 검색어 초기화 + 현재 선택 항목을 강조 시작점으로
  useEffect(() => {
    if (!open) return;
    setQuery('');
    const idx = options.findIndex((o) => o.value === current);
    setHighlight(idx >= 0 ? idx : 0);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // 강조 항목이 스크롤 영역 밖이면 보이도록 스크롤 (드롭다운은 portal이라 menuRef 기준)
  useEffect(() => {
    if (!open || highlight < 0) return;
    const el = menuRef.current?.querySelector(`[data-option-index="${highlight}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [highlight, open]);

  // 드롭다운 fixed 위치 계산 — 트리거 rect 기준, placement(auto/수동) 반영
  useLayoutEffect(() => {
    if (!open) {
      setMenuStyle(null);
      return;
    }
    const measure = () => {
      const trigger = triggerRef.current;
      if (!trigger) return;
      const tr = trigger.getBoundingClientRect();
      const menu = menuRef.current;
      const menuH = menu?.offsetHeight ?? 0; // 높이는 세로 스택이라 측정 OK
      const gap = MENU_GAP;
      // 드롭다운 너비(숫자) — 위치 계산용. 숫자/미지정은 즉시 알 수 있고, 문자열만 측정 fallback.
      const w =
        menuWidth == null
          ? tr.width
          : typeof menuWidth === 'number'
            ? menuWidth
            : (menu?.offsetWidth ?? tr.width);
      const widthCss =
        menuWidth != null && typeof menuWidth !== 'number' ? menuWidth : `${w}px`;

      let vertical;
      let horizontal;
      if (placement === 'auto') {
        const spaceBelow = window.innerHeight - tr.bottom;
        const spaceAbove = tr.top;
        vertical = spaceBelow < menuH + gap && spaceAbove > spaceBelow ? 'top' : 'bottom';
        horizontal = tr.left + w > window.innerWidth ? 'right' : 'left';
      } else {
        [vertical, horizontal] = placement.split('-');
      }

      const top = vertical === 'top' ? tr.top - gap - menuH : tr.bottom + gap;
      const left = horizontal === 'right' ? tr.right - w : tr.left;
      setMenuStyle({ position: 'fixed', top, left, width: widthCss });
    };
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
    };
  }, [open, filtered.length, query, placement, menuWidth]);

  // 목록 키보드 네비게이션 — 트리거/검색바 공용, filtered 기준
  const handleListNav = (e) => {
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        break;
      case 'ArrowDown':
        e.preventDefault();
        setHighlight((h) => Math.min(h + 1, filtered.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlight((h) => Math.max(h - 1, 0));
        break;
      case 'Enter': {
        e.preventDefault();
        const opt = filtered[highlight];
        if (opt) selectValue(opt.value);
        break;
      }
      case 'Tab':
        setOpen(false);
        break;
      default:
        break;
    }
  };

  const onTriggerKeyDown = (e) => {
    if (!interactive) return;
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    // 열린 상태: 검색 모드면 검색바가 키를 처리, 아니면 트리거에서 네비게이션
    if (searchable) return;
    if (e.key === ' ') {
      e.preventDefault();
      const opt = filtered[highlight];
      if (opt) selectValue(opt.value);
    } else {
      handleListNav(e);
    }
  };

  const textColor = disabled
    ? 'text-tf-disabled-text'
    : readOnly
      ? 'text-tf-readonly-text'
      : isPlaceholder
        ? 'text-tf-default-text'
        : 'text-tf-filled-text';

  const iconColor = disabled
    ? 'text-tf-disabled-icon'
    : 'text-tf-default-text group-focus-within:text-tf-filled-text';

  return (
    <div ref={rootRef} className={`relative ${className}`} style={{ width: widthStyle, maxWidth: maxWidthStyle }} {...props}>
      {/* 트리거 */}
      <div
        ref={triggerRef}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-disabled={disabled || undefined}
        aria-invalid={error || undefined}
        tabIndex={interactive ? 0 : -1}
        onClick={() => interactive && setOpen((o) => !o)}
        onKeyDown={onTriggerKeyDown}
        className={`group relative grid min-h-[32px] grid-cols-[minmax(0,1fr)_auto] items-center gap-spacing-4 rounded-round-4 bg-tf-default-bg py-spacing-3 pl-spacing-6 pr-spacing-6 transition-shadow focus:outline-none ${
          interactive ? `cursor-pointer ${RING}` : 'cursor-not-allowed'
        }`}
      >
        {/* grid 컬럼 minmax(0,1fr) + JS max-width(트리거폭−chevron−gap) — 크롬 truncate 보강 */}
        <TruncatingText
          style={textMaxW != null ? { maxWidth: `${textMaxW}px` } : undefined}
          className={`text-14 ${textColor}`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </TruncatingText>
        <ChevronDown
          size={16}
          strokeWidth={1.8}
          className={`pointer-events-none transition-transform ${iconColor} ${
            open ? 'rotate-180' : ''
          }`}
        />
      </div>

      {/* 드롭다운 — portal + fixed (트리거 컨테이너와 분리해 트리거 레이아웃에 영향 없음) */}
      {open &&
        createPortal(
          <div
            ref={menuRef}
            className="z-[1000]"
            style={menuStyle ?? { position: 'fixed', top: 0, left: 0, visibility: 'hidden' }}
          >
            <PopoverMenu
              width="100%"
              searchable={searchable}
              searchValue={query}
              onSearchChange={(e) => {
                setQuery(e.target.value);
                setHighlight(0);
              }}
              searchPlaceholder={searchPlaceholder}
              searchInputProps={searchable ? { autoFocus: true, onKeyDown: handleListNav } : {}}
            >
              {filtered.length > 0 ? (
                <ListGroup>
                  {filtered.map((opt, i) => (
                    <List
                      key={opt.value}
                      title={opt.label}
                      selected={opt.value === current}
                      highlighted={i === highlight}
                      onClick={() => selectValue(opt.value)}
                      onMouseEnter={() => setHighlight(i)}
                      data-option-index={i}
                    />
                  ))}
                </ListGroup>
              ) : (
                <ListEmpty message={searchable && query.trim() ? noResultMessage : emptyMessage} />
              )}
            </PopoverMenu>
          </div>,
          document.body,
        )}

      {/* 에러 툴팁 — 닫혔을 때 인풋 아래 오버레이 */}
      {error && errorMessage && !open && (
        <div className="absolute left-0 top-full z-10 mt-spacing-2">
          <Tooltip variant="error" beak="top">
            {errorMessage}
          </Tooltip>
        </div>
      )}
    </div>
  );
}
