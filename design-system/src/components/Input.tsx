// Input — 텍스트 입력 필드 (Figma 02_textfield / input, solid 타입 + input transparent 8616:41229)
// 상태(default/hover/focused/filled)는 CSS와 실제 입력값으로 자동 처리.
// disabled / readOnly / error 는 props로 노출(완전 옵션화).
// variant='transparent': 박스·배경·링 없이 텍스트만(가로 패딩 0) — default(플레이스홀더)도
// filled와 같은 진한색(2026-07-27 지시), hover 시 텍스트 gray 300(2026-07-28 지시),
// 포커스에도 링 없음. 색은 solid와 같은 tf-* 토큰.
//
// 에러 표현 규칙: 에러는 인풋 테두리를 바꾸지 않고 "툴팁"으로만 표시한다.
//  - 툴팁은 인풋 박스 아래에 absolute 오버레이로 띄워, 레이아웃 흐름과
//    형제 컴포넌트 영역에 전혀 영향을 주지 않는다(공간을 차지하지 않음).
import type { ChangeEvent, ComponentPropsWithoutRef } from 'react';
import { Tooltip } from './Tooltip';

// 편집 가능 상태의 테두리(ring) — hover/focus 모두 2px(border-2 토큰). 색은 시멘틱 토큰.
const RING = 'ring-inset ring-text-field-hover-line hover:ring-2 focus-within:ring-2 focus-within:ring-text-field-focused-line';

// 사이즈 — '32'(기본, 32px·text-14) | '22'(작게, 22px·text-12·leading-18로 핏하게, 좁은 셀/인라인용).
// bare = transparent 변형용(가로 패딩 없이 세로만 — 텍스트가 영역에 플러시하게 붙음).
const SIZE_STYLE = {
  '32': { box: 'min-h-[32px] px-spacing-6 py-spacing-3', bare: 'min-h-[32px] py-spacing-3', text: 'text-14' },
  '22': { box: 'min-h-[22px] px-spacing-5 py-spacing-2', bare: 'min-h-[22px] py-spacing-2', text: 'text-12 leading-18' },
};

// ...props는 바깥 필드 컨테이너(div)로, 실제 <input> 속성은 inputProps로 전달한다.
interface InputProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange'> {
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  size?: keyof typeof SIZE_STYLE; // '32'(32px·14px) | '22'(22px·12px, 라인하이트 핏)
  variant?: 'solid' | 'transparent'; // 'transparent'=박스·링 없이 텍스트만(플레이스홀더도 진한색)
  disabled?: boolean;
  readOnly?: boolean;
  error?: boolean;
  errorMessage?: string;
  width?: number | string; // 너비: 숫자(px) 또는 CSS 길이 문자열('100%' 등). 미지정 시 200px
  inputProps?: ComponentPropsWithoutRef<'input'>;
}

export function Input({
  value,
  defaultValue,
  onChange,
  placeholder = '텍스트를 입력하세요',
  size = '32', // '32'(32px·14px) | '22'(22px·12px, 라인하이트 핏)
  variant = 'solid', // 'solid'(필드형, 기본) | 'transparent'(박스·링 없이 텍스트만)
  disabled = false,
  readOnly = false,
  error = false,
  errorMessage = '',
  width = 200, // 너비: 숫자(px) 또는 CSS 길이 문자열('100%' 등). 미지정 시 200px
  className = '',
  inputProps = {},
  ...props
}: InputProps) {
  const interactive = !disabled && !readOnly;
  const widthStyle = typeof width === 'number' ? `${width}px` : width;
  const sizeStyle = SIZE_STYLE[size] ?? SIZE_STYLE['32'];
  const isTransparent = variant === 'transparent';

  const textColor = disabled
    ? 'text-text-field-disabled-text'
    : readOnly
      ? 'text-text-field-readonly-text'
      : 'text-text-field-filled-text';
  // disabled면 플레이스홀더도 비활성 색(#c9c9c9) — TextArea와 동일 패턴(Figma disabled 스펙)
  // transparent는 default(플레이스홀더)도 filled와 같은 진한색(2026-07-27 지시)
  const placeholderColor = disabled
    ? 'placeholder:text-text-field-disabled-text'
    : isTransparent
      ? 'placeholder:text-text-field-filled-text'
      : 'placeholder:text-text-field-default-text';

  return (
    <div
      style={{ width: widthStyle }}
      className={
        isTransparent
          ? // transparent: 배경·링 없음(포커스에도), 가로 패딩 0 — hover 텍스트 회색은 group으로 전달
            `group relative flex items-center gap-spacing-3 rounded-round-4 ${sizeStyle.bare} ${
              interactive ? '' : 'cursor-not-allowed'
            } ${className}`
          : `relative flex items-center gap-spacing-3 rounded-round-4 bg-text-field-default-bg transition-shadow ${sizeStyle.box} ${
              interactive ? RING : 'cursor-not-allowed'
            } ${className}`
      }
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
        className={`min-w-0 flex-1 bg-transparent outline-none ${sizeStyle.text} ${placeholderColor} ${
          isTransparent && interactive
            ? // hover·입력 중(포커스) 시 '플레이스홀더만' gray 300 — 입력된 값 텍스트는
              // 어떤 상태에도 디폴트 진한색 유지(2026-07-28 지시)
              'transition-colors group-hover:placeholder:text-text-field-default-text focus:placeholder:text-text-field-default-text'
            : ''
        } disabled:cursor-not-allowed read-only:cursor-default ${textColor}`}
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
