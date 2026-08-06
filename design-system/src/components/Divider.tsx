// Divider — 구분선 (Figma Divider: Direction Horizontal/Vertical × color Subtle/Default/Strong)
// 1px 선을 채운 div로 그린다. 색은 divider 시멘틱 토큰 경유(subtle/default/strong).
//  - horizontal: 가로선(높이 1px, 부모 전체 폭)
//  - vertical: 세로선(너비 1px) — self-stretch로 flex 행 높이만큼 늘어난다.
//    (h-full 방식은 부모 높이가 auto면 0으로 계산돼 안 보였음 — 2026-07-07 개선.
//     flex/grid 밖에서 쓰면 className으로 높이를 직접 지정할 것)

import type { ComponentPropsWithoutRef } from 'react';

const COLOR = {
  subtle: 'bg-divider-subtle',
  default: 'bg-divider-default',
  strong: 'bg-divider-strong',
};

// 위/아래 여백 옵션(2026-08-06 지시) — 부모 gap이 균등이라 양옆 콘텐츠 밀도 차(박스 vs 텍스트)로
// 생기는 시각 불균형을 구분선 단위로 보정한다. 값은 spacing 토큰 키만(px 표기, 규칙 2).
// flex gap 안에서는 기존 gap에 '더해진다'. 가로선용 — 세로선은 self-stretch 높이라 적용 대상 아님.
const MARGIN_TOP = {
  '4': 'mt-spacing-3',
  '6': 'mt-spacing-4',
  '8': 'mt-spacing-5',
  '12': 'mt-spacing-6',
  '16': 'mt-spacing-7',
  '20': 'mt-spacing-8',
  '24': 'mt-spacing-9',
  '28': 'mt-spacing-10',
  '32': 'mt-spacing-11',
};
const MARGIN_BOTTOM = {
  '4': 'mb-spacing-3',
  '6': 'mb-spacing-4',
  '8': 'mb-spacing-5',
  '12': 'mb-spacing-6',
  '16': 'mb-spacing-7',
  '20': 'mb-spacing-8',
  '24': 'mb-spacing-9',
  '28': 'mb-spacing-10',
  '32': 'mb-spacing-11',
};

interface DividerProps extends ComponentPropsWithoutRef<'div'> {
  direction?: 'horizontal' | 'vertical';
  color?: keyof typeof COLOR;
  marginTop?: keyof typeof MARGIN_TOP; // 위 여백(px 키 — spacing 토큰 경유) — 미지정 시 없음
  marginBottom?: keyof typeof MARGIN_BOTTOM; // 아래 여백(px 키 — spacing 토큰 경유) — 미지정 시 없음
}

export function Divider({
  direction = 'horizontal',
  color = 'default',
  marginTop,
  marginBottom,
  className = '',
  ...props
}: DividerProps) {
  const isVertical = direction === 'vertical';
  const shape = isVertical ? 'w-px self-stretch' : 'h-px w-full';
  const marginStyle = `${marginTop ? MARGIN_TOP[marginTop] : ''} ${marginBottom ? MARGIN_BOTTOM[marginBottom] : ''}`;
  return (
    <div
      role="separator"
      aria-orientation={isVertical ? 'vertical' : 'horizontal'}
      className={`shrink-0 ${shape} ${marginStyle} ${COLOR[color] ?? COLOR.default} ${className}`}
      {...props}
    />
  );
}
