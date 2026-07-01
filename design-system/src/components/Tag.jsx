// Tag — 작은 칩 라벨 (Figma option list / tag)
// color 속성으로 색을 바꾼다: 'blue' | 'red' | 'gray' | 'black'. lookup 객체로 분기. (Figma Tag의 color variant와 동일)
//   black = gray500 솔리드 배경 + 흰 텍스트(Figma 변형명 'color4', Chip black과 동일 값)
// width 속성으로 너비를 바꾼다: 'hug'(콘텐츠 맞춤, 기본) | 'fill'(부모 폭 채움).
// 색은 tag-* 시멘틱 토큰(base 경유)만 사용.

const COLOR_STYLE = {
  blue: 'bg-tag-blue-bg text-tag-blue-text',
  red: 'bg-tag-red-bg text-tag-red-text',
  gray: 'bg-tag-gray-bg text-tag-gray-text',
  black: 'bg-tag-black-bg text-tag-black-text',
};

export function Tag({
  children = '태그',
  color = 'blue',
  width = 'hug', // 'hug' | 'fill'
  className = '',
  ...props
}) {
  const colorStyle = COLOR_STYLE[color] ?? COLOR_STYLE.blue;
  const sizing = width === 'fill' ? 'flex w-full' : 'inline-flex shrink-0';

  return (
    <span
      className={`${sizing} items-center justify-center rounded-round-4 px-spacing-4 py-spacing-1 text-12 ${colorStyle} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
