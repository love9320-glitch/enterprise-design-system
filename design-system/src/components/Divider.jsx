// Divider — 구분선 (Figma Divider: Direction Horizontal/Vertical × color Subtle/Default/Strong)
// 1px 선을 채운 div로 그린다. 색은 divider 시멘틱 토큰 경유(subtle/default/strong).
//  - horizontal: 가로선(높이 1px, 부모 전체 폭)
//  - vertical: 세로선(너비 1px, 부모 전체 높이) — 부모에 높이가 있어야 보인다(flex 행 등)

const COLOR = {
  subtle: 'bg-divider-subtle',
  default: 'bg-divider-default',
  strong: 'bg-divider-strong',
};

export function Divider({
  direction = 'horizontal', // 'horizontal' | 'vertical'
  color = 'default',        // 'subtle' | 'default' | 'strong'
  className = '',
  ...props
}) {
  const isVertical = direction === 'vertical';
  const shape = isVertical ? 'h-full w-px' : 'h-px w-full';
  return (
    <div
      role="separator"
      aria-orientation={isVertical ? 'vertical' : 'horizontal'}
      className={`shrink-0 ${shape} ${COLOR[color] ?? COLOR.default} ${className}`}
      {...props}
    />
  );
}
