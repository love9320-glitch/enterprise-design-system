// DateField — DatePicker를 여는 트리거 + 직접 입력 필드 (Figma date picker / Input, node 7593:4139)
// 캘린더 아이콘 + 날짜(범위)·시간 값. 아이콘/필드를 누르면 DatePicker 팝오버가 열리고,
// 입력칸에 직접 타이핑한 뒤 Enter 또는 포커스 아웃하면 파싱해 반영한다.
//   - 표기/입력 형식은 utils/datetime 규칙: "YY.MM.DD (HH:MM)", 범위 "A~B" / 시작만 "A ~ 마감일 없음".
//   - 범위에서 마감일을 안 적고 확정하면(시작만 입력) end=null → "마감일 없음"으로 표시된다.
//   - 필드 외형/상태(default·hover·focused·filled·disabled·readOnly·error 툴팁)는 tf-* 토큰.
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Popover } from './Popover';
import { DatePicker } from './DatePicker';
import { Tooltip } from './Tooltip';
import { formatDateTime, formatDateTimeRange } from '../utils/datetime';

// 편집 가능 상태의 테두리(ring) — SearchBar/Input과 동일(hover/focus-within 2px, tf-* 토큰)
const RING = 'ring-inset ring-text-field-hover-line hover:ring-2 focus-within:ring-2 focus-within:ring-text-field-focused-line';
const pad2 = (n) => String(n).padStart(2, '0');
// 입력 허용 문자 — 숫자·구분자(. - / : ~ 공백)·괄호만.
const ALLOWED_CHARS = /[\d.\-/:~() ]/;

// 날짜 파트 → Date | null. 구분자 형식과 무구분자(YYYYMMDD/YYMMDD/MMDD) 모두 허용.
//   "25.05.20"·"2025.05.20" / "20250520"(→2025) / "250520"(→2025) / "0520"(→올해)
function parseDatePart(s) {
  const str = s.trim();
  const sep = str.match(/^(\d{2}|\d{4})\D+(\d{1,2})\D+(\d{1,2})$/); // 구분자 있음
  const d8 = str.match(/^(\d{4})(\d{2})(\d{2})$/); // YYYYMMDD
  const d6 = str.match(/^(\d{2})(\d{2})(\d{2})$/); // YYMMDD
  const d4 = str.match(/^(\d{2})(\d{2})$/); // MMDD(올해)
  let year;
  let mo;
  let day;
  if (sep) {
    year = sep[1].length === 2 ? 2000 + Number(sep[1]) : Number(sep[1]);
    mo = Number(sep[2]);
    day = Number(sep[3]);
  } else if (d8) {
    year = Number(d8[1]);
    mo = Number(d8[2]);
    day = Number(d8[3]);
  } else if (d6) {
    year = 2000 + Number(d6[1]);
    mo = Number(d6[2]);
    day = Number(d6[3]);
  } else if (d4) {
    year = new Date().getFullYear();
    mo = Number(d4[1]);
    day = Number(d4[2]);
  } else {
    return null;
  }
  if (mo < 1 || mo > 12 || day < 1 || day > 31) return null;
  const date = new Date(year, mo - 1, day);
  if (date.getMonth() !== mo - 1 || date.getDate() !== day) return null; // 실재 날짜 검증
  return date;
}

// 시간 파트 → 'HH:MM' | null. 콜론("0:10"·"00:10") / 무구분(시 2자리 + 분 1~2자리: "0010"→00:10, "011"→01:01).
function parseTimePart(t) {
  const str = t.trim();
  const colon = str.match(/^(\d{1,2}):(\d{1,2})$/);
  const compact = str.match(/^(\d{2})(\d{1,2})$/);
  const m = colon || compact;
  if (!m) return null;
  const h = Number(m[1]);
  const mn = Number(m[2]);
  if (h > 23 || mn > 59) return null;
  return `${pad2(h)}:${pad2(mn)}`;
}

// 날짜 토큰 파싱 — "<날짜>[ <시간>]" 또는 "<날짜> (시간)".
//   → { date, time } / 'empty'(빈 문자열·"마감일 없음"·"시작일 없음") / null(형식 오류)
function parseDateToken(raw) {
  let s = (raw ?? '').trim();
  if (s === '' || s === '마감일 없음' || s === '시작일 없음') return 'empty';
  let timeRaw = null;
  const paren = s.match(/\(([^)]*)\)\s*$/); // 끝의 (시간)
  if (paren) {
    timeRaw = paren[1].trim();
    s = s.slice(0, paren.index).trim();
  } else {
    const sp = s.match(/^(.*\S)\s+([\d:]+)$/); // 공백 뒤 시간(숫자·콜론)
    if (sp) {
      s = sp[1].trim();
      timeRaw = sp[2];
    }
  }
  const date = parseDatePart(s);
  if (!date) return null;
  let time = null;
  if (timeRaw) {
    time = parseTimePart(timeRaw);
    if (!time) return null;
  }
  return { date, time };
}

// 입력 전체 파싱 → { value, startTime?, endTime? } | null(형식 오류)
function parseDateFieldInput(text, isRange) {
  const t = text.trim();
  if (!isRange) {
    if (t === '') return { value: null };
    const tok = parseDateToken(t);
    if (tok === null) return null;
    if (tok === 'empty') return { value: null };
    return { value: tok.date, startTime: tok.time };
  }
  // 범위 — '~'로 시작/마감 분리. '~'가 없으면 시작만 입력한 것으로 본다(마감 없음).
  if (t === '') return { value: { start: null, end: null } };
  const idx = t.indexOf('~');
  const startPart = idx >= 0 ? t.slice(0, idx) : t;
  const endPart = idx >= 0 ? t.slice(idx + 1) : '';
  const s = parseDateToken(startPart);
  const e = parseDateToken(endPart);
  if (s === null || e === null) return null;
  return {
    value: { start: s === 'empty' ? null : s.date, end: e === 'empty' ? null : e.date },
    startTime: s === 'empty' ? null : s.time,
    endTime: e === 'empty' ? null : e.time,
  };
}

export function DateField({
  mode = 'single', // 'single' | 'range'
  value,
  defaultValue,
  onChange,
  showTime = false,
  startTime,
  defaultStartTime = '00:00',
  onStartTimeChange,
  endTime,
  defaultEndTime = '23:59',
  onEndTimeChange,
  placeholder = '날짜를 선택하세요',
  disabled = false,
  readOnly = false,
  error = false,
  errorMessage = '',
  formatErrorMessage = '날짜 형식이 올바르지 않습니다.', // 직접 입력 형식 오류 메시지
  closeOnSelect = true, // 캘린더 선택 완료 시 자동 닫기(showTime이면 시간도 골라야 하므로 닫지 않음)
  // 너비: 'hug'(콘텐츠 폭) | 'fill'(부모 100%) | 숫자(px) | CSS 길이.
  // 미지정 시 기본 = showTime이면 260, 아니면 180. 폭이 좁으면 텍스트는 말줄임(…).
  width,
  className = '',
  // DatePicker 패스스루
  disablePast,
  disableFuture,
  minDate,
  maxDate,
  disabledDate,
  weekStartsOn,
  minYear,
  maxYear,
  ...props
}) {
  const isRange = mode === 'range';
  const interactive = !disabled && !readOnly;
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [text, setText] = useState(''); // 포커스 중 직접 입력 텍스트
  const [parseError, setParseError] = useState(false);
  // 말줄임 hover 툴팁(규칙 5) — 값이 폭을 넘쳐 잘릴 때 전체 값을 보여준다(TruncatingText와 동일 방식).
  const [truncRect, setTruncRect] = useState(null);

  // 값 (controlled/uncontrolled)
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(
    defaultValue ?? (isRange ? { start: null, end: null } : null),
  );
  const current = isControlled ? value : internalValue;
  const applyValue = (v) => {
    if (!isControlled) setInternalValue(v);
    onChange?.(v);
    setParseError(false); // 값이 정해지면(캘린더 선택·직접 입력 성공) 형식 에러 해제
  };

  // 시간 (controlled/uncontrolled)
  const stControlled = startTime !== undefined;
  const [intSt, setIntSt] = useState(defaultStartTime);
  const curSt = stControlled ? startTime : intSt;
  const setSt = (v) => {
    if (!stControlled) setIntSt(v);
    onStartTimeChange?.(v);
  };
  const etControlled = endTime !== undefined;
  const [intEt, setIntEt] = useState(defaultEndTime);
  const curEt = etControlled ? endTime : intEt;
  const setEt = (v) => {
    if (!etControlled) setIntEt(v);
    onEndTimeChange?.(v);
  };

  // 표시 문자열 — 규칙 통일(utils/datetime). 비어 있으면 placeholder.
  const display = isRange
    ? formatDateTimeRange(
        current?.start,
        showTime ? curSt : undefined,
        current?.end,
        showTime ? curEt : undefined,
      )
    : formatDateTime(current, showTime ? curSt : undefined);
  const isEmpty = !display;

  // 캘린더에서 선택 — 완료 시 자동 닫기(closeOnSelect)
  const handlePickerChange = (v) => {
    applyValue(v);
    if (closeOnSelect && !showTime) {
      if (!isRange) setOpen(false);
      else if (v?.start && v?.end) setOpen(false);
    }
  };

  // 직접 입력 확정(Enter/blur) — 파싱해 값·시간 반영. 형식 틀리면 에러.
  const commit = (raw) => {
    const parsed = parseDateFieldInput(raw, isRange);
    if (!parsed) {
      setParseError(true);
      return;
    }
    setParseError(false);
    applyValue(parsed.value);
    if (showTime) {
      if (parsed.startTime != null) setSt(parsed.startTime);
      if (parsed.endTime != null) setEt(parsed.endTime);
    }
  };

  const textColor = disabled
    ? 'text-text-field-disabled-text'
    : readOnly
      ? 'text-text-field-readonly-text'
      : 'text-text-field-filled-text';
  const iconColor = disabled
    ? 'text-text-field-disabled-icon'
    : readOnly
      ? 'text-text-field-readonly-icon'
      : isEmpty
        ? 'text-text-field-default-text' // 값 없음 → 회색 #878787 (Figma)
        : 'text-font-icon-5'; // 값 있음 → 진한색

  const showErr = error || parseError;
  const errMsg = parseError ? formatErrorMessage : errorMessage;

  // 너비 — 미지정 시 showTime이면 260, 아니면 180. 'hug'=콘텐츠 폭, 'fill'=부모 100%.
  const effWidth = width ?? (showTime ? 260 : 180);
  const isHug = effWidth === 'hug';
  const isFill = effWidth === 'fill';
  const fixedWidth = isHug || isFill ? undefined : typeof effWidth === 'number' ? `${effWidth}px` : effWidth;
  // hug: input을 콘텐츠 폭만큼. size는 라틴 평균 글자폭 기준이라 한글(전각)은 2배로 세고 +1 여유.
  const shown = focused ? text : display;
  const hugSize = Math.max(
    Array.from(shown || placeholder).reduce((n, c) => {
      // 한글·CJK·전각 글자는 전각폭이라 2칸, 그 외 1칸. 끝 글자 잘림 방지로 초기값 +1.
      const code = c.charCodeAt(0);
      const wide =
        (code >= 0x1100 && code <= 0x11ff) ||
        (code >= 0x3000 && code <= 0x9fff) ||
        (code >= 0xac00 && code <= 0xd7ff) ||
        (code >= 0xff00 && code <= 0xffef);
      return n + (wide ? 2 : 1);
    }, 1),
    1,
  );

  const trigger = (
    <div
      className={`relative ${isFill ? 'w-full' : isHug ? 'w-fit' : ''}`}
      style={fixedWidth ? { width: fixedWidth } : undefined}
    >
      <div
        className={`group flex min-h-[32px] ${isHug ? 'w-fit' : 'w-full'} items-center gap-spacing-3 rounded-round-4 bg-text-field-default-bg px-spacing-6 py-spacing-3 transition-shadow ${
          interactive ? `cursor-text ${RING}` : disabled ? 'cursor-not-allowed' : 'cursor-default'
        }`}
      >
        <CalendarIcon size={16} strokeWidth={1.8} className={`shrink-0 ${iconColor}`} />
        <input
          type="text"
          value={focused ? text : display}
          placeholder={placeholder}
          readOnly={!interactive}
          disabled={disabled}
          size={isHug ? hugSize : undefined}
          aria-invalid={showErr || undefined}
          onClick={(e) => e.stopPropagation()} // 입력칸 클릭은 팝오버 토글하지 않음
          onMouseEnter={(e) => {
            // 잘렸을 때만(scrollWidth>clientWidth) 전체 값 툴팁. 편집 중(focused)엔 표시 안 함.
            const el = e.currentTarget;
            if (!focused && display && el.scrollWidth > el.clientWidth + 1) {
              setTruncRect(el.getBoundingClientRect());
            }
          }}
          onMouseLeave={() => setTruncRect(null)}
          onFocus={(e) => {
            if (!interactive) return;
            setFocused(true);
            setParseError(false);
            setTruncRect(null);
            setText(display);
            setOpen(true);
            e.target.select();
          }}
          onChange={(e) => {
            // 숫자·구분자·괄호 외 문자는 입력 단계에서 걸러낸다.
            const v = Array.from(e.target.value).filter((c) => ALLOWED_CHARS.test(c)).join('');
            setText(v);
            if (parseError) setParseError(false);
          }}
          onBlur={() => {
            if (!interactive) return; // readOnly/disabled은 commit 안 함(값 보존)
            setFocused(false);
            commit(text);
          }}
          onKeyDown={(e) => {
            if (!interactive) return;
            if (e.key === 'Enter') {
              e.preventDefault();
              commit(text);
              setOpen(false);
              e.currentTarget.blur();
            } else if (e.key === 'Escape') {
              setText(display);
              setOpen(false);
              e.currentTarget.blur();
            }
          }}
          className={`bg-transparent text-14 outline-none placeholder:text-text-field-default-text disabled:cursor-not-allowed read-only:cursor-pointer ${textColor} ${
            isHug ? 'w-auto' : 'min-w-0 flex-1 text-ellipsis'
          }`}
        />
      </div>
      {/* 에러 툴팁 — 닫혔을 때만(열리면 picker와 겹침). 필드 아래 오버레이. */}
      {showErr && errMsg && !open && (
        <div className="absolute left-0 top-full z-10 mt-spacing-2">
          <Tooltip variant="error" beak="top">
            {errMsg}
          </Tooltip>
        </div>
      )}
      {/* 말줄임 hover 툴팁 — 잘린 전체 값(규칙 5). 포털(fixed)로 필드 위에 띄운다(위 공간 없으면 아래로). */}
      {truncRect &&
        !focused &&
        createPortal(
          <div
            className="pointer-events-none z-[1000]"
            style={{
              position: 'fixed',
              left: truncRect.left,
              top: truncRect.top > 40 ? truncRect.top - 6 : truncRect.bottom + 6,
              transform: truncRect.top > 40 ? 'translateY(-100%)' : undefined,
            }}
          >
            <Tooltip variant="normal" beak="none">
              {display}
            </Tooltip>
          </div>,
          document.body,
        )}
    </div>
  );

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      disabled={!interactive}
      placement="bottom-left"
      menuWidth={276}
      trigger={trigger}
      className={`${isFill ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {() => (
        <DatePicker
          mode={mode}
          value={current}
          onChange={handlePickerChange}
          showTime={showTime}
          startTime={curSt}
          onStartTimeChange={setSt}
          endTime={curEt}
          onEndTimeChange={setEt}
          disablePast={disablePast}
          disableFuture={disableFuture}
          minDate={minDate}
          maxDate={maxDate}
          disabledDate={disabledDate}
          weekStartsOn={weekStartsOn}
          minYear={minYear}
          maxYear={maxYear}
        />
      )}
    </Popover>
  );
}
