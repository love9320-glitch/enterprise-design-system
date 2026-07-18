// SearchBar — 검색 입력 (Figma 02_textfield / search bar, solid 타입)
// 상태(default/hover/focused/filled)는 CSS와 실제 입력값으로 자동 처리한다.
//  - hover/focus 테두리는 ring으로 구현해 두께 변화에 따른 레이아웃 시프트를 막는다.
//  - filled(값 입력)/placeholder 텍스트 색은 native input과 placeholder 의사클래스로 자동.
import type { ChangeEvent, ComponentPropsWithoutRef, KeyboardEvent } from 'react';
import { Search } from 'lucide-react';

// 편집 가능 상태의 테두리(ring) — hover/focus 모두 2px(border-2 토큰). 색은 시멘틱 토큰.
const RING = 'ring-inset ring-text-field-hover-line hover:ring-2 focus-within:ring-2 focus-within:ring-text-field-focused-line';

// ...props는 바깥 필드 컨테이너(div)로, 실제 <input> 속성은 inputProps로 전달한다.
interface SearchBarProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange' | 'onSubmit'> {
  value?: string;
  defaultValue?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: (value: string) => void; // Enter 제출 — 현재 입력값 전달
  placeholder?: string;
  disabled?: boolean;
  width?: number | string; // 너비: 숫자(px) 또는 CSS 길이 문자열('100%' 등). 미지정 시 200px
  inputProps?: ComponentPropsWithoutRef<'input'>;
}

export function SearchBar({
  value,
  defaultValue,
  onChange,
  onSubmit,
  placeholder = '검색어를 입력하세요',
  disabled = false,
  width = 200, // 너비: 숫자(px) 또는 CSS 길이 문자열('100%' 등). 미지정 시 200px
  className = '',
  inputProps = {},
  ...props
}: SearchBarProps) {
  const widthStyle = typeof width === 'number' ? `${width}px` : width;
  return (
    <div
      style={{ width: widthStyle }}
      className={`group relative flex min-h-[32px] items-center gap-spacing-3 rounded-round-4 bg-text-field-default-bg px-spacing-6 py-spacing-3 transition-shadow ${
        disabled ? 'cursor-not-allowed' : RING
      } ${className}`}
      {...props}
    >
      <Search
        size={16}
        strokeWidth={1.8}
        className={`shrink-0 ${
          disabled
            ? 'text-text-field-disabled-icon'
            : 'text-text-field-default-text group-focus-within:text-text-field-filled-text'
        }`}
      />
      <input
        type="search"
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="min-w-0 flex-1 bg-transparent text-14 text-text-field-filled-text outline-none placeholder:text-text-field-default-text disabled:cursor-not-allowed disabled:text-text-field-disabled-text disabled:placeholder:text-text-field-disabled-text [&::-webkit-search-cancel-button]:appearance-none"
        {...inputProps}
        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
          // Enter 제출 + 소비자 onKeyDown 합성 — 스프레드가 덮어써 onSubmit이 무력화되지 않게
          if (e.key === 'Enter' && onSubmit) onSubmit(e.currentTarget.value);
          inputProps?.onKeyDown?.(e);
        }}
      />
    </div>
  );
}
