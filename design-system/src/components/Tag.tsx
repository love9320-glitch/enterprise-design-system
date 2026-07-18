// Tag — 작은 칩 라벨 (Figma option list / tag)
// color 속성으로 색을 바꾼다: 'blue' | 'red' | 'gray' | 'black'. lookup 객체로 분기. (Figma Tag의 color variant와 동일)
//   black = gray500 솔리드 배경 + 흰 텍스트(Figma 변형명 'color4', Chip black과 동일 값)
// width 속성으로 너비를 바꾼다: 'hug'(콘텐츠 맞춤, 기본) | 'fill'(부모 폭 채움).
// 색은 tag-* 시멘틱 토큰(base 경유)만 사용.

import type { ComponentPropsWithoutRef } from 'react';

const COLOR_STYLE = {
  blue: 'bg-tag-blue-bg text-tag-blue-text',
  red: 'bg-tag-red-bg text-tag-red-text',
  gray: 'bg-tag-gray-bg text-tag-gray-text',
  black: 'bg-tag-black-bg text-tag-black-text',
};

interface TagProps extends ComponentPropsWithoutRef<'span'> {
  color?: keyof typeof COLOR_STYLE;
  width?: 'hug' | 'fill';
}

export function Tag({
  children = '태그',
  color = 'blue',
  width = 'hug', // 'hug' | 'fill'
  className = '',
  ...props
}: TagProps) {
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

// NewTag — 원형 'N' 뱃지 (Figma new tag, node 8187:40848). 신규 항목 표시용.
// 18×18 고정 원형(rounded-round-00) + semibold 12 텍스트. 색은 new-tag-* 시멘틱 토큰만 사용. (22→20→18)
const NEW_TAG_BG = {
  blue: 'bg-new-tag-blue-bg',
  red: 'bg-new-tag-red-bg',
  black: 'bg-new-tag-black-bg',
};

interface NewTagProps extends ComponentPropsWithoutRef<'span'> {
  color?: keyof typeof NEW_TAG_BG; // 'blue' | 'red' | 'black'
}

export function NewTag({
  color = 'blue',   // 'blue' | 'red' | 'black'
  children = 'N',   // 뱃지 글자(기본 'N')
  className = '',
  ...props
}: NewTagProps) {
  return (
    <span
      className={`inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-round-00 text-12 font-semibold text-new-tag-title ${
        NEW_TAG_BG[color] ?? NEW_TAG_BG.blue
      } ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
