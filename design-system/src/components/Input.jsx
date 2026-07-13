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

// 사이즈 — '32'(기본, 32px·text-14) | '22'(작게, 22px·text-12·leading-18로 핏하게, 좁은 셀/인라인용).
const SIZE_STYLE = {
  '32': { box: 'min-h-[32px] px-spacing-6 py-spacing-3', text: 'text-14' },
  '22': { box: 'min-h-[22px] px-spacing-5 py-spacing-2', text: 'text-12 leading-18' },
};

export function Input({
  value,
  defaultValue,
  onChange,
  placeholder = '텍스트를 입력하세요',
  size = '32', // '32'(32px·14px) | '22'(22px·12px, 라인하이트 핏)
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
  const sizeStyle = SIZE_STYLE[size] ?? SIZE_STYLE['32'];

  const textColor = disabled
    ? 'text-text-field-disabled-text'
    : readOnly
      ? 'text-text-field-readonly-text'
      : 'text-text-field-filled-text';
  // disabled면 플레이스홀더도 비활성 색(#c9c9c9) — TextArea와 동일 패턴(Figma disabled 스펙)
  const placeholderColor = disabled
    ? 'placeholder:text-text-field-disabled-text'
    : 'placeholder:text-text-field-default-text';

  return (
    <div
      style={{ width: widthStyle }}
      className={`relative flex items-center gap-spacing-3 rounded-round-4 bg-text-field-default-bg transition-shadow ${sizeStyle.box} ${
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
        className={`min-w-0 flex-1 bg-transparent outline-none ${sizeStyle.text} ${placeholderColor} disabled:cursor-not-allowed read-only:cursor-default ${textColor}`}
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
