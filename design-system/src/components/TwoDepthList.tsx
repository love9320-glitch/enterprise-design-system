// TwoDepthList — 입력 영역 + 좌/우 2개 컬럼 목록 팝오버 (Figma 2depth list, node 7595:6736 / 7595:7798)
// 상단 input area는 좌/우 "분리 인풋 + 구분자(., :)" 구조 — [Input] . [Input] (2026-07-02 디자인 개정).
// 그 아래 두 개의 ListGroup을 1px 틈(gap-spacing-1)으로 나란히 둔다.
//   - year_month(폭 160): 좌=연도, 우=월, 구분자 '.' / time(폭 140): 좌=시, 우=분, 구분자 ':'
//   - 각 컬럼은 ListGroup(maxVisible 초과 시 내부 스크롤). 선택 행은 List selected(파란 텍스트).
// 외부 계약은 합성 문자열 그대로 유지: inputValue('2026.7'), onInputApply('2026.7')→정규화 문자열.
// 컨테이너 색은 list-popover-* / list-group-* 시멘틱 토큰(PopoverMenu와 동일 규칙).
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Input } from './Input';
import { ListGroup } from './ListGroup';
import { List } from './List';
import { Tooltip } from './Tooltip';

// 한 컬럼 — 옵션 목록 + 선택 행 자동 스크롤(열릴 때 선택값이 보이도록).
function Column({ options, value, onChange, maxVisible }: any) {
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

// 합성 문자열 ↔ 좌/우 파트 변환 — 첫 구분자 기준 2조각
const splitParts = (text, separator) => {
  const i = String(text).indexOf(separator);
  return i < 0 ? [String(text), ''] : [String(text).slice(0, i), String(text).slice(i + 1)];
};

export function TwoDepthList({
  // 상단 입력 영역 — 현재 선택을 좌/우 분리 인풋으로 보여주며, 기본적으로 직접 입력(타이핑)도 가능하다.
  inputValue = '',
  separator = ':',       // 좌/우 파트 구분자 표시·합성 기준 — year_month '.' / time ':'
  showInput = true,      // 상단 입력 영역 표시 여부(false면 좌/우 컬럼만 — 트리거가 따로 입력을 가질 때)
  editable = true,       // 상단 input 직접 입력 허용(false면 readOnly로 값만 표시)
  onInputChange,         // (e) => void — 입력 변경(raw 이벤트)
  // (text) => string | null — 합성 텍스트('2026.7')로 좌/우 값을 적용하고 "정규화된 표시 문자열"을 반환.
  // 형식이 틀리면 null/false. 파싱은 호출부가 담당(연.월/시:분 등 도메인별).
  // 타이핑 즉시(라이브) 적용되고, 입력 영역을 떠날 때 반환된 정규화 문자열로 표시값을 보정한다.
  // 실패 시 null(마지막 편집 인풋에 errorMessage 툴팁) 또는 { error:'left'|'right', message? }
  // (해당 파트 인풋 아래에 그 문구로 툴팁 — 파트별 문구는 호출부가 지정).
  onInputApply,
  errorMessage = '형식이 올바르지 않습니다.', // 파트 지정이 없을 때의 기본 툴팁 메시지
  // 파트 입력 허용 문자(문자 1개씩 test) — 기본은 숫자만(구분자는 UI가 표시하므로 입력 불필요).
  allowedChars = /\d/,
  inputPlaceholder = '', // 'YYYY.MM'·'HH:MM'처럼 구분자 포함 문자열 — 구분자로 쪼개 좌/우 placeholder로 사용
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
  width = 160,
  className = '',
  ...props
}: any) {
  const widthStyle = typeof width === 'number' ? `${width}px` : width;
  const [lPlaceholder, rPlaceholder] = splitParts(inputPlaceholder, separator);

  // 직접 입력용 좌/우 파트 텍스트.
  //  - 적용은 타이핑 즉시(라이브) — 값을 친 뒤 팝오버 바깥을 눌러 닫혀도 이미 반영돼 있다.
  //  - 포커스가 입력 영역 안에 있는 동안엔 정규화 값으로 덮어쓰지 않는다 → "2:2 → 2:20"처럼 마저 입력 가능.
  //    포커스가 영역을 떠나면(두 인풋 모두 blur) 정규화된 표시값으로 보정한다.
  //  - 외부에서 값(컬럼 선택 등)으로 inputValue가 바뀌면, 포커스가 없을 때만 텍스트를 동기화한다.
  const [focused, setFocused] = useState(false);
  const [parts, setParts] = useState(() => splitParts(inputValue, separator));
  const [error, setError] = useState(null); // { side:'left'|'right', message } | null
  // 에러 툴팁은 포털(fixed)로 띄운다(팝오버 overflow-hidden에 잘리지 않게). 위치 기준은 실패한 파트 인풋 rect.
  const inputAreaRef = useRef(null);
  const leftBoxRef = useRef(null);
  const rightBoxRef = useRef(null);
  const lastSideRef = useRef('left'); // 파트 미지정 실패(null) 시 툴팁을 붙일 마지막 편집 인풋
  const [errorRect, setErrorRect] = useState(null);
  const [prevInput, setPrevInput] = useState(inputValue);
  if (inputValue !== prevInput) {
    setPrevInput(inputValue);
    if (!focused) {
      setParts(splitParts(inputValue, separator));
      setError(null);
    }
  }

  const compose = (l, r) => `${l}${separator}${r}`;

  const handlePartChange = (side) => (e) => {
    // 허용 문자만 남긴다(기본 숫자만 — 구분자는 UI가 항상 표시).
    const v = allowedChars
      ? Array.from(e.target.value).filter((c) => allowedChars.test(c)).join('')
      : e.target.value;
    const next = side === 'left' ? [v, parts[1]] : [parts[0], v];
    lastSideRef.current = side;
    setParts(next);
    onInputChange?.(e);
    if (error) setError(null); // 타이핑하면 에러 해제(검증은 영역 이탈 시)
    if ((next[0] + next[1]).trim() !== '') onInputApply?.(compose(next[0], next[1])); // 유효하면 즉시 적용(무효면 호출부가 무시)
  };

  const handleFocus = (side) => (e) => {
    lastSideRef.current = side;
    setFocused(true);
    inputProps.onFocus?.(e);
    e.target.select(); // 포커스 시 전체 선택 — 기존 값을 바로 덮어쓰기 쉽게
  };

  // 입력 영역 이탈(두 인풋 모두 blur) — 형식 검증 + 정규화된 표시값으로 보정.
  // 좌↔우 인풋 사이 이동(relatedTarget이 영역 안)은 이탈로 보지 않는다.
  const handleBlur = (e) => {
    inputProps.onBlur?.(e);
    if (inputAreaRef.current?.contains(e.relatedTarget)) return;
    setFocused(false);
    const t = compose(parts[0].trim(), parts[1].trim());
    if (parts[0].trim() === '' && parts[1].trim() === '') {
      setParts(splitParts(inputValue, separator));
      setError(null);
      return;
    }
    const norm = onInputApply ? onInputApply(t) : t; // 유효=정규화 문자열/true, 무효=null 또는 {error, message?}
    if (norm && !(typeof norm === 'object' && norm.error)) {
      setParts(splitParts(typeof norm === 'string' ? norm : inputValue, separator));
      setError(null);
    } else {
      const side = (norm && norm.error) || lastSideRef.current;
      const box = side === 'right' ? rightBoxRef.current : leftBoxRef.current;
      setErrorRect(box?.getBoundingClientRect() ?? inputAreaRef.current?.getBoundingClientRect() ?? null);
      setError({ side, message: (norm && norm.message) || errorMessage });
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

  const partInput = (side, value, placeholder) => (
    <div ref={side === 'left' ? leftBoxRef : rightBoxRef} className="min-w-0 flex-1">
      <Input
        value={editable ? value : splitParts(inputValue, separator)[side === 'left' ? 0 : 1]}
        onChange={editable ? handlePartChange(side) : undefined}
        readOnly={!editable}
        placeholder={placeholder}
        width="100%"
        inputProps={
          editable
            ? { ...inputProps, onFocus: handleFocus(side), onBlur: handleBlur, onKeyDown: handleKeyDown }
            : inputProps
        }
      />
    </div>
  );

  return (
    <div
      style={{ width: widthStyle }}
      className={`flex flex-col gap-spacing-1 overflow-hidden rounded-round-4 outline outline-1 outline-list-popover-outline bg-list-popover-bg shadow-[0px_2px_4px_0px_rgba(13,13,13,0.12)] ${className}`}
      {...props}
    >
      {/* input area — 흰 배경, [좌 Input] 구분자 [우 Input] (gap 4px). popover(gray100)와 1px 틈이 구분선.
          에러 툴팁은 Input 내장(absolute)을 쓰면 팝오버 overflow-hidden에 잘리므로,
          여기선 끄고 아래에서 포털(fixed)로 직접 띄운다. showInput=false면 영역 자체를 숨긴다. */}
      {showInput && (
        <div ref={inputAreaRef} className="flex w-full items-center gap-spacing-3 bg-list-group-bg p-spacing-5">
          {partInput('left', parts[0], lPlaceholder)}
          {/* 구분자 — 아래 정렬(마침표가 인풋 텍스트 하단선에 붙도록 self-end + 인풋 py와 동일한 pb) */}
          <span className="shrink-0 self-end pb-spacing-3 text-14 text-text-field-filled-text">{separator}</span>
          {partInput('right', parts[1], rPlaceholder)}
        </div>
      )}
      {/* 2 컬럼 목록 — 1px 틈(gap-spacing-1)이 두 컬럼 사이 구분선이 된다. */}
      <div className="flex w-full gap-spacing-1">
        <Column options={leftOptions} value={leftValue} onChange={onLeftChange} maxVisible={maxVisible} />
        <Column options={rightOptions} value={rightValue} onChange={onRightChange} maxVisible={maxVisible} />
      </div>

      {/* 에러 툴팁 — 포털(fixed)로 입력 행 아래에 띄워 overflow-hidden에 잘리지 않게 한다. */}
      {showInput &&
        error &&
        errorRect &&
        createPortal(
          <div
            className="pointer-events-none z-[1000]"
            style={{ position: 'fixed', top: errorRect.bottom + 6, left: errorRect.left }}
          >
            <Tooltip variant="error" beak="top">
              {error.message}
            </Tooltip>
          </div>,
          document.body,
        )}
    </div>
  );
}
