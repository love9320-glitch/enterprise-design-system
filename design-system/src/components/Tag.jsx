// Tag — 작은 칩 라벨 (Figma option list / tag)
// 현재 blue 타입만 정의됨. 추후 색상 타입이 추가될 수 있어 lookup 객체로 분기한다.
// 색은 tag-* 시멘틱 토큰(=base blue 경유)만 사용.

const TYPE_STYLE = {
  blue: 'bg-tag-blue-bg text-tag-blue-text',
};

export function Tag({ children = '태그', type = 'blue', className = '', ...props }) {
  const color = TYPE_STYLE[type] ?? TYPE_STYLE.blue;

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-round-4 px-spacing-4 py-spacing-1 text-12 ${color} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
