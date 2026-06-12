// SearchBar — 검색 입력 (Figma 02_textfield / search bar, solid 타입)
// 상태(default/hover/focused/filled)는 CSS와 실제 입력값으로 자동 처리한다.
//  - hover/focus 테두리는 ring으로 구현해 두께 변화에 따른 레이아웃 시프트를 막는다.
//  - filled(값 입력)/placeholder 텍스트 색은 native input과 placeholder 의사클래스로 자동.
import { Search } from 'lucide-react';

// 편집 가능 상태의 테두리(ring) — hover/focus 모두 2px(border-2 토큰). 색은 시멘틱 토큰.
const RING = 'ring-inset ring-tf-hover-line hover:ring-2 focus-within:ring-2 focus-within:ring-tf-focused-line';

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
}) {
  const widthStyle = typeof width === 'number' ? `${width}px` : width;
  return (
    <div
      style={{ width: widthStyle }}
      className={`group relative flex min-h-[32px] items-center gap-spacing-3 rounded-round-4 bg-tf-default-bg px-spacing-6 py-spacing-3 transition-shadow ${
        disabled ? 'cursor-not-allowed' : RING
      } ${className}`}
      {...props}
    >
      <Search
        size={16}
        strokeWidth={1.8}
        className={`shrink-0 ${
          disabled
            ? 'text-tf-disabled-icon'
            : 'text-tf-default-text group-focus-within:text-tf-filled-text'
        }`}
      />
      <input
        type="search"
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && onSubmit) onSubmit(e.currentTarget.value);
        }}
        className="min-w-0 flex-1 bg-transparent text-14 text-tf-filled-text outline-none placeholder:text-tf-default-text disabled:cursor-not-allowed disabled:text-tf-disabled-text [&::-webkit-search-cancel-button]:appearance-none"
        {...inputProps}
      />
    </div>
  );
}
