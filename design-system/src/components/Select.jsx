// Select — 드롭다운 선택 (Figma 02_textfield / select)
// 트리거는 Input과 동일한 필드 컨테이너 + chevron, 펼친 목록은 커스텀 PopoverMenu(옵션 목록).
// native <select> 대신 직접 구현해 디자인 시스템 목록(List/ListGroup)을 그대로 사용한다.
//
// 기능:
//  - 키보드: ↑/↓ 이동, Enter/Space 열기·선택, Esc 닫기, Tab 닫기
//  - 외부 클릭 시 닫힘
//  - 선택 항목은 List selected(파란색), 키보드 강조는 List highlighted(hover 색)
//  - multiple: 체크박스 다중 선택 — value는 배열, 행 클릭=토글(메뉴 유지),
//    트리거에는 선택 라벨을 ', '로 이어 표시하고 넘치면 말줄임(기존 TruncatingText 재사용)
// 색은 tf-* 시멘틱 토큰(트리거)과 list-* 토큰(목록)을 사용.
import { useState, useRef, useEffect, useLayoutEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';
import { Tooltip } from './Tooltip';
import { TruncatingText } from './TruncatingText';
import { InlineFieldTrigger } from './InlineFieldTrigger';
import { PopoverMenu } from './PopoverMenu';
import { ListGroup } from './ListGroup';
import { List } from './List';
import { ListEmpty } from './ListEmpty';
import { usePopoverPosition } from './usePopoverPosition';

// 편집 가능 상태의 테두리(ring) — hover/focus 모두 2px(border-2 토큰).
const RING = 'ring-inset ring-text-field-hover-line hover:ring-2 focus:ring-2 focus:ring-text-field-focused-line';

export function Select({
  value,
  defaultValue = '',
  onChange,
  options = [],            // [{ value, label }]
  multiple = false,        // 체크박스 다중 선택 — value/defaultValue/onChange 값은 배열([value])
  variant = 'box',         // 'box'(필드형, 기본) | 'text'(인라인 텍스트형 — 필터·문단 사이용)
  size = '24',             // text variant 전용: '24'(14px) | '20'(12px) — box는 항상 14px
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
  // multiple인데 defaultValue가 배열이 아니면(기본 '') 빈 배열로 시작
  const [internal, setInternal] = useState(() =>
    multiple && !Array.isArray(defaultValue) ? [] : defaultValue,
  );
  const current = isControlled ? value : internal;
  // multiple 전용 — 현재 선택 배열(비배열 방어)
  const selectedValues = useMemo(
    () => (multiple && Array.isArray(current) ? current : []),
    [multiple, current],
  );
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const [query, setQuery] = useState('');
  // 트리거 텍스트 최대 너비(px) — 크롬 flex/grid truncate 보강용으로 명시 지정
  const [textMaxW, setTextMaxW] = useState(undefined);

  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  // text variant: 박스/보더 없는 인라인 텍스트형. 항상 hug(콘텐츠 맞춤) + maxWidth만 받는다.
  // disabled/readOnly/error는 box와 동일하게 지원(테이블 바디·폼용). 드롭다운·키보드·검색 동작도 동일.
  const isText = variant === 'text';
  // text variant는 트리거가 좁으므로(hug) 드롭다운 기본 너비를 120px로 둔다(menuWidth 미지정 시).
  const effectiveMenuWidth = menuWidth ?? (isText ? 120 : undefined);
  const selectedOption = multiple ? undefined : options.find((o) => o.value === current);
  // 트리거 표시 텍스트 — multiple은 선택 라벨을 ', '로 연결(옵션 순서 기준), 넘치면 TruncatingText가 말줄임
  const selectedLabels = multiple
    ? options.filter((o) => selectedValues.includes(o.value)).map((o) => o.label)
    : [];
  const isPlaceholder = multiple ? selectedLabels.length === 0 : !selectedOption;
  const displayLabel = multiple
    ? (isPlaceholder ? placeholder : selectedLabels.join(', '))
    : (selectedOption ? selectedOption.label : placeholder);
  const interactive = !disabled && !readOnly;
  // box variant 트리거 너비(text variant는 콘텐츠 hug라 style을 주지 않는다)
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

  // multiple: 값 토글 — 메뉴는 닫지 않는다(연속 체크). 배열 순서는 옵션 순서를 따르지 않고 토글 순서.
  const toggleValue = useCallback(
    (val) => {
      const next = selectedValues.includes(val)
        ? selectedValues.filter((v) => v !== val)
        : [...selectedValues, val];
      if (!isControlled) setInternal(next);
      onChange?.({ target: { value: next } });
    },
    [isControlled, onChange, selectedValues],
  );

  // 행 확정 동작 — 단일=선택 후 닫기 / multiple=토글 후 유지
  const commitOption = (opt) => (multiple ? toggleValue(opt.value) : selectValue(opt.value));

  // 트리거 폭을 재서 텍스트 max-width를 계산(콘텐츠폭 − chevron − gap) — 크롬 truncate 보강.
  // hug(fit-content)는 트리거가 콘텐츠를 따라가므로 max-width를 주면 무한 축소 순환이 생긴다 → 제외.
  useLayoutEffect(() => {
    const trigger = triggerRef.current;
    if (!trigger || isText || width === 'hug') {
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
  }, [width, isText]);

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
    // 열릴 때 1회 리셋 — 의도된 effect 내 setState
    setQuery(''); // eslint-disable-line react-hooks/set-state-in-effect
    const idx = options.findIndex((o) =>
      multiple ? selectedValues.includes(o.value) : o.value === current,
    );
    setHighlight(idx >= 0 ? idx : 0);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // 강조 항목이 스크롤 영역 밖이면 보이도록 스크롤 (드롭다운은 portal이라 menuRef 기준)
  useEffect(() => {
    if (!open || highlight < 0) return;
    const el = menuRef.current?.querySelector(`[data-option-index="${highlight}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [highlight, open]);

  // 드롭다운 fixed 위치 계산 — Popover와 공유하는 공용 훅 (검색으로 목록 높이가 바뀌면 재계산)
  const menuStyle = usePopoverPosition({
    open,
    anchorRef: triggerRef,
    menuRef,
    placement,
    menuWidth: effectiveMenuWidth,
    deps: [filtered.length, query],
  });

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
        if (opt) commitOption(opt);
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
      if (opt) commitOption(opt);
    } else {
      handleListNav(e);
    }
  };

  // box variant 색 — tf-* 시멘틱 토큰. (text variant의 색·크기는 InlineFieldTrigger가 담당)
  const textColor = disabled
    ? 'text-text-field-disabled-text'
    : readOnly
      ? 'text-text-field-readonly-text'
      : isPlaceholder
        ? 'text-text-field-default-text'
        : 'text-text-field-filled-text';

  const iconColor = disabled
    ? 'text-text-field-disabled-icon'
    : 'text-text-field-default-text group-focus-within:text-text-field-filled-text';

  // box variant 화살표 크기는 항상 16
  const chevronSize = 16;

  return (
    <div
      ref={rootRef}
      className={`relative ${isText ? 'inline-flex max-w-full align-middle' : ''} ${className}`}
      style={isText ? undefined : { width: widthStyle, maxWidth: maxWidthStyle }}
      {...props}
    >
      {/* 트리거 — 상호작용(클릭·키보드·포커스·위치 anchor)은 box·text 공통, 비주얼은 분기 */}
      {isText ? (
        // 인라인 텍스트형: 비주얼은 공유 프리미티브 InlineFieldTrigger에 위임(Select·DatePicker 공용)
        <InlineFieldTrigger
          ref={triggerRef}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-disabled={disabled || undefined}
          aria-invalid={error || undefined}
          tabIndex={interactive ? 0 : -1}
          onClick={() => interactive && setOpen((o) => !o)}
          onKeyDown={onTriggerKeyDown}
          size={size}
          open={open}
          disabled={disabled}
          readOnly={readOnly}
          interactive={interactive}
          maxWidth={maxWidthStyle}
        >
          {displayLabel}
        </InlineFieldTrigger>
      ) : (
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
          className={`group relative grid min-h-[32px] grid-cols-[minmax(0,1fr)_auto] items-center gap-spacing-4 rounded-round-4 bg-text-field-default-bg py-spacing-3 pl-spacing-6 pr-spacing-6 transition-shadow focus:outline-none ${
            interactive ? `cursor-pointer ${RING}` : 'cursor-not-allowed'
          }`}
        >
          {/* box: grid minmax(0,1fr) + JS max-width 보강 */}
          <TruncatingText
            style={textMaxW != null ? { maxWidth: `${textMaxW}px` } : undefined}
            className={`text-14 font-normal ${textColor}`}
          >
            {displayLabel}
          </TruncatingText>
          <ChevronDown
            size={chevronSize}
            strokeWidth={1.8}
            className={`pointer-events-none shrink-0 transition-transform ${iconColor} ${
              open ? 'rotate-180' : ''
            }`}
          />
        </div>
      )}

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
              topArea={searchable ? 'search' : 'none'}
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
                  {filtered.map((opt, i) =>
                    multiple ? (
                      // 체크박스 행 — List가 행 전체를 체크 토글 영역으로 처리(메뉴 유지)
                      <List
                        key={opt.value}
                        title={opt.label}
                        checkbox
                        checked={selectedValues.includes(opt.value)}
                        onCheckChange={() => toggleValue(opt.value)}
                        highlighted={i === highlight}
                        onMouseEnter={() => setHighlight(i)}
                        data-option-index={i}
                      />
                    ) : (
                      <List
                        key={opt.value}
                        title={opt.label}
                        selected={opt.value === current}
                        highlighted={i === highlight}
                        onClick={() => selectValue(opt.value)}
                        onMouseEnter={() => setHighlight(i)}
                        data-option-index={i}
                      />
                    ),
                  )}
                </ListGroup>
              ) : (
                <ListEmpty message={searchable && query.trim() ? noResultMessage : emptyMessage} />
              )}
            </PopoverMenu>
          </div>,
          document.body,
        )}

      {/* 에러 툴팁 — 닫혔을 때 필드 아래 오버레이 (box·text 공통) */}
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
