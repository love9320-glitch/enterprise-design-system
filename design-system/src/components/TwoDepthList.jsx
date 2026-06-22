// TwoDepthList — 입력 영역 + 좌/우 2개 컬럼 목록 팝오버 (Figma 2depth list, node 7595:6736 / 7595:7798)
// 상단 input area(현재 값 표시) + 그 아래 두 개의 ListGroup을 1px 틈(gap-spacing-1)으로 나란히 둔다.
//   - year_month: 좌=연도, 우=월 / time: 좌=시, 우=분 등 "두 단계로 좁혀 고르는" 값에 공용으로 쓴다.
//   - 각 컬럼은 ListGroup(maxVisible 초과 시 내부 스크롤). 선택 행은 List selected(파란 텍스트).
// 컨테이너 색은 list-popover-* / list-group-* 시멘틱 토큰(PopoverMenu와 동일 규칙).
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Input } from './Input';
import { ListGroup } from './ListGroup';
import { List } from './List';
import { Tooltip } from './Tooltip';

// 한 컬럼 — 옵션 목록 + 선택 행 자동 스크롤(열릴 때 선택값이 보이도록).
function Column({ options, value, onChange, maxVisible }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current?.querySelector('[aria-selected="true"]');
    el?.scrollIntoView({ block: 'nearest' });
  }, [value]);

  return (
    <div ref={ref} className="min-w-0 flex-1">
      <ListGroup maxVisible={maxVisible}>
        {options.map((opt) => (
          <List
            key={opt.value}
            title={opt.label}
            selected={opt.value === value}
            disabled={opt.disabled}
            onClick={() => onChange?.(opt.value)}
            data-value={opt.value}
          />
        ))}
      </ListGroup>
    </div>
  );
}

export function TwoDepthList({
  // 상단 입력 영역 — 현재 선택을 보여주며, 기본적으로 직접 입력(타이핑)도 가능하다.
  inputValue = '',
  showInput = true,      // 상단 입력 영역 표시 여부(false면 좌/우 컬럼만 — 트리거가 따로 입력을 가질 때)
  editable = true,       // 상단 input 직접 입력 허용(false면 readOnly로 값만 표시)
  onInputChange,         // (e) => void — 입력 변경(raw 이벤트)
  // (text) => string | null — 입력 텍스트로 좌/우 값을 적용하고 "정규화된 표시 문자열"을 반환.
  // 형식이 틀리면 null/false. 파싱은 호출부가 담당(연.월/시:분 등 도메인별).
  // 타이핑 즉시(라이브) 적용되고, blur 시 반환된 정규화 문자열로 표시값을 보정한다. null이면 에러 표시.
  onInputApply,
  errorMessage = '형식이 올바르지 않습니다.', // 직접 입력 형식 오류 시 툴팁 메시지
  // 입력 허용 문자(문자 1개씩 test) — 기본은 숫자와 구분자(.: / - 공백)만. null이면 제한 없음.
  allowedChars = /[\d.:/\- ]/,
  inputPlaceholder = '',
  inputProps = {},
  // 좌측 컬럼
  leftOptions = [],      // [{ value, label, disabled? }]
  leftValue,
  onLeftChange,
  // 우측 컬럼
  rightOptions = [],     // [{ value, label, disabled? }]
  rightValue,
  onRightChange,
  maxVisible = 5,        // 각 컬럼 표시 행 수(초과 시 내부 스크롤)
  width = 201,
  className = '',
  ...props
}) {
  const widthStyle = typeof width === 'number' ? `${width}px` : width;

  // 직접 입력용 내부 텍스트.
  //  - 적용은 타이핑 즉시(라이브) — 그래서 값을 친 뒤 팝오버 바깥을 눌러 닫혀도 이미 반영돼 있다.
  //  - 단, 포커스 중에는 입력 텍스트를 정규화 값으로 덮어쓰지 않는다(focusedRef) → "2:2 → 2:20"처럼
  //    마저 입력할 수 있다. 포커스가 떠나면(blur) 정규화된 표시값으로 보정한다.
  //  - 외부에서 값(컬럼 선택 등)으로 inputValue가 바뀌면, 포커스가 없을 때만 텍스트를 동기화한다.
  const [focused, setFocused] = useState(false);
  const [text, setText] = useState(inputValue);
  const [error, setError] = useState(false);
  // 에러 툴팁은 포털(fixed)로 띄운다(팝오버 overflow-hidden에 잘리지 않게). 위치 기준은 input 박스 rect.
  const inputBoxRef = useRef(null);
  const [errorRect, setErrorRect] = useState(null);
  const [prevInput, setPrevInput] = useState(inputValue);
  if (inputValue !== prevInput) {
    setPrevInput(inputValue);
    if (!focused) {
      setText(inputValue);
      setError(false);
    }
  }

  const handleChange = (e) => {
    // 숫자·구분자 외 문자는 입력 단계에서 걸러낸다(허용 문자만 남김).
    const v = allowedChars
      ? Array.from(e.target.value).filter((c) => allowedChars.test(c)).join('')
      : e.target.value;
    setText(v);
    onInputChange?.(e);
    if (error) setError(false); // 타이핑하면 에러 해제(검증은 blur에서)
    if (v.trim() !== '') onInputApply?.(v); // 유효하면 즉시 적용(무효면 호출부가 무시)
  };

  const handleFocus = (e) => {
    setFocused(true);
    inputProps.onFocus?.(e);
    e.target.select(); // 포커스 시 전체 선택 — 기존 값을 바로 덮어쓰기 쉽게
  };

  // 포커스 아웃 — 형식 검증 + 정규화된 표시값으로 보정.
  const handleBlur = (e) => {
    setFocused(false);
    inputProps.onBlur?.(e);
    const t = text.trim();
    if (t === '') {
      setText(inputValue);
      setError(false);
      return;
    }
    const norm = onInputApply ? onInputApply(t) : t; // 유효=정규화 문자열/true, 무효=null/false
    if (norm) {
      setText(typeof norm === 'string' ? norm : inputValue);
      setError(false);
    } else {
      setErrorRect(inputBoxRef.current?.getBoundingClientRect() ?? null);
      setError(true);
    }
  };

  // Enter = 확정(blur 처리로 정규화)
  const handleKeyDown = (e) => {
    inputProps.onKeyDown?.(e);
    if (e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  return (
    <div
      style={{ width: widthStyle }}
      className={`flex flex-col gap-spacing-1 overflow-hidden rounded-round-4 outline outline-1 outline-list-popover-outline bg-list-popover-bg shadow-[0px_2px_4px_0px_rgba(13,13,13,0.12)] ${className}`}
      {...props}
    >
      {/* input area — 흰 배경. popover(gray100)와 gap-spacing-1(1px) 틈이 구분선이 된다.
          에러 툴팁은 Input 내장(absolute)을 쓰면 팝오버 overflow-hidden에 잘리므로,
          여기선 끄고 아래에서 포털(fixed)로 직접 띄운다. showInput=false면 영역 자체를 숨긴다. */}
      {showInput && (
        <div className="w-full bg-list-group-bg p-spacing-5">
          <div ref={inputBoxRef}>
            <Input
              value={editable ? text : inputValue}
              onChange={editable ? handleChange : undefined}
              readOnly={!editable}
              placeholder={inputPlaceholder}
              width="100%"
              inputProps={
                editable
                  ? { ...inputProps, onFocus: handleFocus, onBlur: handleBlur, onKeyDown: handleKeyDown }
                  : inputProps
              }
            />
          </div>
        </div>
      )}
      {/* 2 컬럼 목록 — 1px 틈(gap-spacing-1)이 두 컬럼 사이 구분선이 된다. */}
      <div className="flex w-full gap-spacing-1">
        <Column options={leftOptions} value={leftValue} onChange={onLeftChange} maxVisible={maxVisible} />
        <Column options={rightOptions} value={rightValue} onChange={onRightChange} maxVisible={maxVisible} />
      </div>

      {/* 에러 툴팁 — 포털(fixed)로 input 박스 아래에 띄워 overflow-hidden에 잘리지 않게 한다. */}
      {showInput &&
        error &&
        errorMessage &&
        errorRect &&
        createPortal(
          <div
            className="pointer-events-none z-[1000]"
            style={{ position: 'fixed', top: errorRect.bottom + 6, left: errorRect.left }}
          >
            <Tooltip variant="error" beak="top">
              {errorMessage}
            </Tooltip>
          </div>,
          document.body,
        )}
    </div>
  );
}
