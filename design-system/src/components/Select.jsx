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
import { CHIP_COLOR_CLASS } from './chipStyles';
import { InlineFieldTrigger } from './InlineFieldTrigger';
import { PopoverMenu } from './PopoverMenu';
import { ListGroup } from './ListGroup';
import { List } from './List';
import { ListEmpty } from './ListEmpty';
import { usePopoverPosition } from './usePopoverPosition';
import { useOutsideDismiss } from './useOutsideDismiss';
import { pushPopoverLayer, removePopoverLayer, isTopPopoverLayer } from './popoverLayers';

// 편집 가능 상태의 테두리(ring) — hover/focus 모두 2px(border-2 토큰), 색은 hover-line(gray-900 알파) 공통.
// 포커스 링은 focus-visible(키보드 포커스)에만 — 마우스 클릭/프레스 후 링이 남지 않게(2026-07-16 지시)
const RING = 'ring-inset ring-text-field-hover-line hover:ring-2 focus-visible:ring-2';

// 내부 라벨(label) 구분자 아이콘 — 세로 점 2개(2×7). lucide에 없는 커스텀 셰이프라
// Figma 원본(Ellipse, 8219:76216) path를 인라인 SVG로 가져왔다(2026-07-07 개정 — 콜론 텍스트 대체).
// 색은 currentColor — 사용처에서 시멘틱 토큰 클래스(text-font-icon-3 = #878787, Figma 값)로 지정.
function LabelSeparatorIcon({ className = '' }) {
  return (
    <svg
      viewBox="0 0 2 7"
      width={2}
      height={7}
      fill="currentColor"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <path d="M2 1C2 1.55228 1.55228 2 1 2C0.447715 2 0 1.55228 0 1C0 0.447715 0.447715 0 1 0C1.55228 0 2 0.447715 2 1Z" />
      <path d="M2 6C2 6.55228 1.55228 7 1 7C0.447715 7 0 6.55228 0 6C0 5.44772 0.447715 5 1 5C1.55228 5 2 5.44772 2 6Z" />
    </svg>
  );
}

export function Select({
  value,
  defaultValue = '',
  onChange,
  options = [],            // [{ value, label, disabled? }] — disabled 옵션은 목록에 비활성 행으로 표시(선택 불가)
  multiple = false,        // 체크박스 다중 선택 — value/defaultValue/onChange 값은 배열([value])
  confirm = false,         // multiple 전용 — 선택을 draft로 들고 푸터(전체 선택+취소/확인)에서
                           //   확인을 눌러야 onChange 반영(취소·외부 클릭은 폐기). Figma 8535:9239
  variant = 'box',         // 'box'(필드형, 기본) | 'text'(인라인 텍스트형 — 필터·문단 사이용)
                           //   | 'chip'(칩형 트리거 — Figma select chip 8219:81717, SelectChip으로 export)
  size = '24',             // text variant 전용: '24'(14px) | '20'(12px) — box는 항상 14px
  weight = 'normal',       // chip variant 전용 텍스트 두께 — 'normal'(기본) | 'semibold'
  defaultOpen = false,     // 마운트 시 드롭다운을 연 상태로 시작(1회성 — 이후는 일반 동작)
  tabOpens = false,        // 트리거 포커스 상태에서 Tab=메뉴 열기(수식 키보드 체인용 — 일반 폼은 기본 꺼짐)
  color = 'gray',          // chip variant 전용: 'gray' | 'red' | 'blue' | 'black' — Chip과 동일한
                           //   chip-* 시멘틱 토큰(CHIP_COLOR_CLASS) 재사용. pressed=default(Figma 동일)
  label = null,            // 내부 라벨(box 전용, Figma type="solid label") — 값 선택 시 트리거에
                           //   "라벨 ⋮ 값"으로 표시(구분자=점 2개 아이콘, 라벨 고정·값만 말줄임).
                           //   placeholder 상태는 미표시. 외부 Label을 못 쓰는 좁은 배치의 대안(2026-07-07 Figma 개정).
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
  const [open, setOpen] = useState(defaultOpen); // defaultOpen: 마운트 시 메뉴 열림(키보드 체인 시작점 등)
  const isConfirm = multiple && confirm;
  const [draft, setDraft] = useState([]); // confirm 모드 — 열려 있는 동안의 임시 선택(확인 시에만 반영)
  const searchInputRef = useRef(null);
  const skipTabOpenRef = useRef(false); // 옵션 순회 종료 직후의 Tab은 다시 열지 않고 통과(체인 진행)
  useEffect(() => {
    if (!open || !searchable) return undefined;
    // 패널이 위치 계산 전 hidden이라 autoFocus가 실패한다 — 한 틱 뒤 검색 인풋 포커스
    const t = setTimeout(() => searchInputRef.current?.focus(), 0);
    return () => clearTimeout(t);
  }, [open, searchable]);
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
  // text variant fill — 부모 전체 폭(라벨 왼쪽·chevron 오른쪽 끝). width='fill'일 때만.
  const isTextFill = variant === 'text' && width === 'fill';
  // chip variant: 칩 비주얼 트리거(콘텐츠 hug) — 드롭다운·키보드·검색 동작은 box와 동일.
  const isChip = variant === 'chip';
  // text/chip variant는 트리거가 좁으므로(hug) 드롭다운 기본 너비를 120px로 둔다(menuWidth 미지정 시).
  const effectiveMenuWidth = menuWidth ?? (isText || isChip ? 120 : undefined);
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
  // confirm 모드는 draft만 토글하고, 확인 버튼에서 한 번에 반영한다.
  const toggleValue = useCallback(
    (val) => {
      if (isConfirm) {
        setDraft((d) => (d.includes(val) ? d.filter((v) => v !== val) : [...d, val]));
        return;
      }
      const next = selectedValues.includes(val)
        ? selectedValues.filter((v) => v !== val)
        : [...selectedValues, val];
      if (!isControlled) setInternal(next);
      onChange?.({ target: { value: next } });
    },
    [isConfirm, isControlled, onChange, selectedValues],
  );
  const commitDraft = useCallback(
    (next) => {
      if (!isControlled) setInternal(next);
      onChange?.({ target: { value: next } });
      setOpen(false);
      triggerRef.current?.focus();
    },
    [isControlled, onChange],
  );
  // 체크 표시 기준 — confirm 모드는 draft, 아니면 확정값
  const checkedValues = isConfirm ? draft : selectedValues;

  // 행 확정 동작 — 단일=선택 후 닫기 / multiple=토글 후 유지. disabled 옵션은 확정 불가(키보드 포함)
  const commitOption = (opt) => {
    if (opt?.disabled) return;
    return multiple ? toggleValue(opt.value) : selectValue(opt.value);
  };

  // 트리거 폭을 재서 텍스트 max-width를 계산(콘텐츠폭 − chevron − gap) — 크롬 truncate 보강.
  // hug(fit-content)는 트리거가 콘텐츠를 따라가므로 max-width를 주면 무한 축소 순환이 생긴다 → 제외.
  useLayoutEffect(() => {
    const trigger = triggerRef.current;
    if (!trigger || isText || isChip || width === 'hug') {
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
  }, [width, isText, isChip]);

  // 열린 동안 드롭다운을 팝오버 레이어 스택에 등록 — 팝오버 패널 안에서 열렸을 때
  // 바깥 팝오버가 이 메뉴 안 클릭을 '외부'로 오인해 닫히지 않게 한다(2026-07-16, 복수 조건 설정).
  useEffect(() => {
    if (!open) return undefined;
    pushPopoverLayer(menuRef);
    return () => removePopoverLayer(menuRef);
  }, [open]);

  // 외부 클릭 닫기 (트리거·드롭다운 둘 다 바깥일 때 — 드롭다운은 portal).
  // 공용 훅 useOutsideDismiss — 바깥 클릭은 "닫기 전용"으로 삼켜 아래 요소가 함께 클릭되지 않는다.
  // guard: 맨 위 레이어일 때만 닫는다(위에 다른 패널이 떠 있으면 그쪽 차례).
  useOutsideDismiss({
    open,
    refs: [rootRef, menuRef],
    guard: () => isTopPopoverLayer(menuRef),
    onDismiss: () => setOpen(false),
  });

  // Esc 닫기 — capture 단계에서 먼저 받아 전파를 끊는다(포커스가 목록에 있어도 동작,
  // 모달 안에선 드롭다운만 닫히고 모달은 유지되도록 Modal의 Esc 리스너보다 우선).
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (!isTopPopoverLayer(menuRef)) return; // 맨 위 레이어만 — 중첩 시 위 패널부터
      e.stopPropagation();
      setOpen(false);
      triggerRef.current?.focus();
    };
    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  }, [open]);

  // 열릴 때: 검색어 초기화 + 현재 선택 항목을 강조 시작점으로
  useEffect(() => {
    if (!open) return;
    // 열릴 때 1회 리셋 — 의도된 effect 내 setState
    setQuery(''); // eslint-disable-line react-hooks/set-state-in-effect
    if (isConfirm) setDraft(selectedValues); // confirm 모드 — 확정값으로 draft 시드
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
      case 'Tab': {
        // 열린 메뉴에서 Tab=옵션 순회(2026-07-15) — 하이라이트가 끝에 닿으면 닫고 다음 요소로 자연 이동
        if (!e.shiftKey && highlight < filtered.length - 1) {
          e.preventDefault();
          setHighlight((h) => Math.min(h + 1, filtered.length - 1));
        } else if (e.shiftKey && highlight > 0) {
          e.preventDefault();
          setHighlight((h) => Math.max(h - 1, 0));
        } else {
          setOpen(false);
          if (searchable) {
            // 검색 인풋이 포커스를 쥔 채 닫히면 포커스가 유실된다 — 트리거로 복귀,
            // 다음 Tab은 skip 플래그로 재오픈 없이 다음 요소로 진행
            e.preventDefault();
            skipTabOpenRef.current = true;
            triggerRef.current?.focus();
          }
        }
        break;
      }
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
      } else if (tabOpens && e.key === 'Tab' && !e.shiftKey) {
        if (skipTabOpenRef.current) {
          skipTabOpenRef.current = false; // 순회를 마친 직후 — 열지 않고 다음 요소로 자연 이동
          return;
        }
        // 키보드 체인(수식): 포커스된 트리거에서 Tab → 메뉴 열기(이후 Tab은 옵션 순회)
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
      className={`relative ${
        isTextFill ? 'flex w-full' : isText || isChip ? 'inline-flex max-w-full align-middle' : ''
      } ${className}`}
      style={isText || isChip ? undefined : { width: widthStyle, maxWidth: maxWidthStyle }}
      {...props}
    >
      {/* 트리거 — 상호작용(클릭·키보드·포커스·위치 anchor)은 box·text·chip 공통, 비주얼은 분기 */}
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
          fill={isTextFill}
        >
          {displayLabel}
        </InlineFieldTrigger>
      ) : isChip ? (
        // 칩형: Chip과 동일 박스 규격(pl-4/pr-3/py-1·gap-3·round-4·text-12)+chip-* 토큰, chevron 12.
        // 상태는 default/hover(CSS)만 — pressed는 Figma에서 default 재사용, disabled 변형은 미제공(동작만 차단).
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
          style={maxWidthStyle ? { maxWidth: maxWidthStyle } : undefined}
          className={`inline-flex min-w-0 items-center gap-spacing-3 rounded-round-4 border pl-spacing-4 pr-spacing-3 py-spacing-1 font-pretendard text-12 font-normal transition-colors focus:outline-none ${
            CHIP_COLOR_CLASS[color] ?? CHIP_COLOR_CLASS.gray /* 포커스 표시=hover 색 전환(맵에 포함) */
          } ${interactive ? 'cursor-pointer' : 'cursor-not-allowed'}`}
        >
          <TruncatingText
            className={`min-w-0 text-12 ${weight === 'semibold' ? 'font-semibold' : 'font-normal'}`}
          >
            {displayLabel}
          </TruncatingText>
          <ChevronDown
            size={12}
            strokeWidth={1.8}
            className={`pointer-events-none shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </div>
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
          {/* box: grid minmax(0,1fr) + JS max-width 보강.
              내부 라벨(label)은 값이 있을 때만 "라벨 ⋮ 값" — 라벨·점 구분자 고정(shrink-0), 값만 말줄임(Figma solid label). */}
          {label != null && !isPlaceholder ? (
            <div
              style={textMaxW != null ? { maxWidth: `${textMaxW}px` } : undefined}
              className="flex min-w-0 items-center gap-spacing-3"
            >
              <span className={`shrink-0 text-14 font-normal ${textColor}`}>{label}</span>
              <LabelSeparatorIcon className="text-font-icon-3" />
              <TruncatingText className={`min-w-0 flex-1 text-14 font-normal ${textColor}`}>
                {displayLabel}
              </TruncatingText>
            </div>
          ) : (
            <TruncatingText
              style={textMaxW != null ? { maxWidth: `${textMaxW}px` } : undefined}
              className={`text-14 font-normal ${textColor}`}
            >
              {displayLabel}
            </TruncatingText>
          )}
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
              searchInputProps={searchable ? { ref: searchInputRef, onKeyDown: handleListNav } : {}}
              {...(isConfirm
                ? {
                    // confirm 모드 푸터 — 전체 선택(비활성 옵션 제외) + 취소/확인(확인 시에만 반영)
                    footer: true,
                    footerCheckbox: true,
                    footerChecked:
                      options.filter((o) => !o.disabled).length > 0 &&
                      options.filter((o) => !o.disabled).every((o) => draft.includes(o.value)),
                    onFooterCheckChange: () =>
                      setDraft((d) => {
                        const all = options.filter((o) => !o.disabled).map((o) => o.value);
                        return all.every((v) => d.includes(v)) ? [] : all;
                      }),
                    onCancel: () => {
                      setOpen(false);
                      triggerRef.current?.focus();
                    },
                    onConfirm: () => commitDraft(draft),
                  }
                : {})}
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
                        disabled={opt.disabled}
                        checked={checkedValues.includes(opt.value)}
                        onCheckChange={opt.disabled ? undefined : () => toggleValue(opt.value)}
                        highlighted={!opt.disabled && i === highlight}
                        onMouseEnter={() => !opt.disabled && setHighlight(i)}
                        data-option-index={i}
                      />
                    ) : (
                      <List
                        key={opt.value}
                        title={opt.label}
                        disabled={opt.disabled}
                        selected={opt.value === current}
                        highlighted={!opt.disabled && i === highlight}
                        onClick={opt.disabled ? undefined : () => selectValue(opt.value)}
                        onMouseEnter={() => !opt.disabled && setHighlight(i)}
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

// SelectChip — 칩 비주얼 트리거의 Select (Figma `select chip` 8219:81717, color gray/red/blue/black ×
// state Default/hover/pressed=default). 클릭하면 팝오버 옵션 메뉴가 열리고, options·value/onChange·
// multiple·searchable·menuWidth 등 모든 옵션·동작은 Select와 완전히 동일하다(variant="chip" 별칭).
export function SelectChip(props) {
  return <Select variant="chip" {...props} />;
}
