// PopoverMenu — 옵션 목록을 감싸는 팝오버 (Figma option list / popover menu)
// 내부에 ListGroup을 담는다(빈 상태는 ListGroup이 내부에서 ListEmpty로 처리). searchable 옵션을 켜면 상단에
// 검색바(기존 SearchBar 재사용)가 추가되어 목록을 검색할 수 있다.
// 추후 다양한 옵션이 추가될 예정이라 확장 가능한 구조로 둔다.
// 컨테이너 색은 list-popover-* 시멘틱 토큰(bg gray100 / outline gray200).
import { SearchBar } from './SearchBar';

export function PopoverMenu({
  children,
  searchable = false,
  searchValue,
  onSearchChange,
  searchPlaceholder = '검색어를 입력하세요',
  searchInputProps = {}, // 검색 input에 전달(autoFocus·onKeyDown 등)
  width = 304,
  className = '',
  ...props
}) {
  const widthStyle = typeof width === 'number' ? `${width}px` : width;

  return (
    <div
      style={{ width: widthStyle }}
      className={`flex flex-col gap-spacing-1 overflow-hidden rounded-round-4 border border-list-popover-outline bg-list-popover-bg shadow-[0px_2px_4px_0px_rgba(13,13,13,0.12)] ${className}`}
      {...props}
    >
      {/* search area — 흰 배경. popover(gray100)와 gap-spacing-1(1px) 틈이 구분선이 된다. */}
      {searchable && (
        <div className="w-full bg-list-group-bg p-spacing-5">
          <SearchBar
            value={searchValue}
            onChange={onSearchChange}
            placeholder={searchPlaceholder}
            width="100%"
            inputProps={searchInputProps}
          />
        </div>
      )}
      {children}
    </div>
  );
}
