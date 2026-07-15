// TimeField — 시간 입력 트리거 + 직접 입력 필드 (DateField의 시간 버전)
// 시계 아이콘 + 'HH:MM' 값. 누르면 인풋 영역 없는 시/분 2depth 목록(TwoDepthList showInput=false)이 뜬다.
//   - 직접 타이핑: "12:34"·"1:1"·"1230"·"011"(→01:01) → Enter/포커스 아웃 시 'HH:MM'로 정규화.
//   - 숫자·콜론만 입력 가능. 필드 상태(default·hover·focused·filled·disabled·readOnly·error)는 tf-* 토큰.
import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Clock as ClockIcon } from 'lucide-react';
import { Popover } from './Popover';
import { TwoDepthList } from './TwoDepthList';
import { Tooltip } from './Tooltip';

const RING = 'ring-inset ring-text-field-hover-line hover:ring-2 focus-within:ring-2 focus-within:ring-text-field-focused-line';
const pad2 = (n) => String(n).padStart(2, '0');
const ALLOWED_CHARS = /[\d:]/;
const HOURS = Array.from({ length: 24 }, (_, i) => ({ value: pad2(i), label: `${pad2(i)}시` }));
const MINUTES = Array.from({ length: 60 }, (_, i) => ({ value: pad2(i), label: `${pad2(i)}분` }));

// "12:34"·"1:1"(콜론) / "1230"·"011"(무구분, 시 2자리 + 분 1~2자리) → 'HH:MM' | null
function parseTime(t) {
  const s = (t ?? '').trim();
  const m = s.match(/^(\d{1,2}):(\d{1,2})$/) || s.match(/^(\d{2})(\d{1,2})$/);
  if (!m) return null;
  const h = Number(m[1]);
  const mn = Number(m[2]);
  if (h > 23 || mn > 59) return null;
  return `${pad2(h)}:${pad2(mn)}`;
}

export function TimeField({
  value,
  defaultValue = null,
  onChange,
  placeholder = '시간을 선택하세요',
  disabled = false,
  readOnly = false,
  error = false,
  errorMessage = '',
  formatErrorMessage = 'HH:MM 형식으로 입력하세요',
  // 너비: 'hug' | 'fill' | 숫자(px) | CSS 길이. 미지정 시 120. 좁으면 말줄임(…).
  width,
  className = '',
  ...props
}: any) {
  const interactive = !disabled && !readOnly;
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [text, setText] = useState('');
  const [parseError, setParseError] = useState(false);
  // Enter/ESC의 동기 blur가 onBlur commit을 중복/오발화시키지 않게 1회 건너뛰는 플래그(DateField와 동일)
  const skipBlurCommitRef = useRef(false);
  const inputRef = useRef(null);
  const [truncRect, setTruncRect] = useState(null);

  // 값 (controlled/uncontrolled)
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const current = isControlled ? value : internalValue;
  const applyValue = (v) => {
    if (!isControlled) setInternalValue(v);
    onChange?.(v);
    setParseError(false);
  };

  const display = current || '';
  const isEmpty = !display;
  const [hh, mm] = (current || '').split(':');

  // 직접 입력 확정(Enter/blur)
  const commit = (raw) => {
    const t = raw.trim();
    if (t === '') {
      applyValue(null);
      return;
    }
    const v = parseTime(t);
    if (!v) {
      setParseError(true);
      return;
    }
    applyValue(v);
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
        ? 'text-text-field-default-text'
        : 'text-font-icon-5';

  const showErr = error || parseError;
  const errMsg = parseError ? formatErrorMessage : errorMessage;

  // 너비 — 미지정 시 120. hug/fill 지원.
  const effWidth = width ?? 120;
  const isHug = effWidth === 'hug';
  const isFill = effWidth === 'fill';
  const fixedWidth = isHug || isFill ? undefined : typeof effWidth === 'number' ? `${effWidth}px` : effWidth;
  const shown = focused ? text : display;
  const hugSize = Math.max((shown || placeholder).length + 1, 1);

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
        <ClockIcon size={16} strokeWidth={1.8} className={`shrink-0 ${iconColor}`} />
        <input
          ref={inputRef}
          type="text"
          value={focused ? text : display}
          placeholder={placeholder}
          readOnly={!interactive}
          disabled={disabled}
          size={isHug ? hugSize : undefined}
          aria-invalid={showErr || undefined}
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={(e) => {
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
            const v = Array.from(e.target.value).filter((c) => ALLOWED_CHARS.test(c)).join('');
            setText(v);
            if (parseError) setParseError(false);
          }}
          onBlur={() => {
            if (!interactive) return;
            setFocused(false);
            // Enter(이미 커밋)/ESC(취소) 직후의 blur는 커밋을 건너뛴다
            if (skipBlurCommitRef.current) {
              skipBlurCommitRef.current = false;
              return;
            }
            commit(text);
          }}
          onKeyDown={(e) => {
            if (!interactive) return;
            if (e.key === 'Enter') {
              e.preventDefault();
              commit(text);
              setOpen(false);
              skipBlurCommitRef.current = true;
              e.currentTarget.blur();
            } else if (e.key === 'Escape') {
              // 취소: 초안을 버리고 기존 표시값으로 복원(커밋 금지)
              setText(display);
              setParseError(false);
              setOpen(false);
              skipBlurCommitRef.current = true;
              e.currentTarget.blur();
            }
          }}
          className={`bg-transparent text-14 outline-none placeholder:text-text-field-default-text disabled:cursor-not-allowed read-only:cursor-pointer ${textColor} ${
            isHug ? 'w-auto' : 'min-w-0 flex-1 text-ellipsis'
          }`}
        />
      </div>
      {showErr && errMsg && !open && (
        <div className="absolute left-0 top-full z-10 mt-spacing-2">
          <Tooltip variant="error" beak="top">
            {errMsg}
          </Tooltip>
        </div>
      )}
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
      onOpenChange={(o) => {
        setOpen(o);
        // ESC 닫힘 시 입력 편집도 해제(취소+blur) — 바로 재클릭하면 focus로 즉시 재활성(DateField와 동일)
        if (!o && inputRef.current && document.activeElement === inputRef.current) {
          setText(display);
          setParseError(false);
          skipBlurCommitRef.current = true;
          inputRef.current.blur();
        }
      }}
      disabled={!interactive}
      placement="auto"
      menuWidth={140}
      trigger={trigger}
      className={`${isFill ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {() => (
        // 인풋 영역 없는 시/분 2depth 목록(트리거가 입력을 가지므로 showInput=false)
        <TwoDepthList
          showInput={false}
          width={140}
          leftOptions={HOURS}
          leftValue={hh}
          onLeftChange={(h) => applyValue(`${h}:${mm || '00'}`)}
          rightOptions={MINUTES}
          rightValue={mm}
          onRightChange={(m) => applyValue(`${hh || '00'}:${m}`)}
          maxVisible={5}
        />
      )}
    </Popover>
  );
}
