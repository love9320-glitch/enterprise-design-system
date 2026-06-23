// Input — 텍스트 입력 필드 (Figma 02_textfield / input, solid 타입)
// 상태(default/hover/focused/filled)는 CSS와 실제 입력값으로 자동 처리.
// disabled / readOnly / error 는 props로 노출(완전 옵션화).
//
// 에러 표현 규칙: 에러는 인풋 테두리를 바꾸지 않고 "툴팁"으로만 표시한다.
//  - 툴팁은 인풋 박스 아래에 absolute 오버레이로 띄워, 레이아웃 흐름과
//    형제 컴포넌트 영역에 전혀 영향을 주지 않는다(공간을 차지하지 않음).
import { Tooltip } from './Tooltip';

// 편집 가능 상태의 테두리(ring) — hover/focus 모두 2px(border-2 토큰). 색은 시멘틱 토큰.
const RING = 'ring-inset ring-text-field-hover-line hover:ring-2 focus-within:ring-2 focus-within:ring-text-field-focused-line';

export function Input({
  value,
  defaultValue,
  onChange,
  placeholder = '텍스트를 입력하세요',
  disabled = false,
  readOnly = false,
  error = false,
  errorMessage = '',
  width = 200, // 너비: 숫자(px) 또는 CSS 길이 문자열('100%' 등). 미지정 시 200px
  className = '',
  inputProps = {},
  ...props
}) {
  const interactive = !disabled && !readOnly;
  const widthStyle = typeof width === 'number' ? `${width}px` : width;

  const textColor = disabled
    ? 'text-text-field-disabled-text'
    : readOnly
      ? 'text-text-field-readonly-text'
      : 'text-text-field-filled-text';

  return (
    <div
      style={{ width: widthStyle }}
      className={`relative flex min-h-[32px] items-center gap-spacing-3 rounded-round-4 bg-text-field-default-bg px-spacing-6 py-spacing-3 transition-shadow ${
        interactive ? RING : 'cursor-not-allowed'
      } ${className}`}
      {...props}
    >
      <input
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={error || undefined}
        className={`min-w-0 flex-1 bg-transparent text-14 outline-none placeholder:text-text-field-default-text disabled:cursor-not-allowed read-only:cursor-default ${textColor}`}
        {...inputProps}
      />

      {/* 에러 툴팁 — absolute 오버레이라 인풋 아래 공간을 차지하지 않는다 */}
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
