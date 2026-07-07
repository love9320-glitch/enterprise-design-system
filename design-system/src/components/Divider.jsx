// Divider — 구분선 (Figma Divider: Direction Horizontal/Vertical × color Subtle/Default/Strong)
// 1px 선을 채운 div로 그린다. 색은 divider 시멘틱 토큰 경유(subtle/default/strong).
//  - horizontal: 가로선(높이 1px, 부모 전체 폭)
//  - vertical: 세로선(너비 1px) — self-stretch로 flex 행 높이만큼 늘어난다.
//    (h-full 방식은 부모 높이가 auto면 0으로 계산돼 안 보였음 — 2026-07-07 개선.
//     flex/grid 밖에서 쓰면 className으로 높이를 직접 지정할 것)

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
  const shape = isVertical ? 'w-px self-stretch' : 'h-px w-full';
  return (
    <div
      role="separator"
      aria-orientation={isVertical ? 'vertical' : 'horizontal'}
      className={`shrink-0 ${shape} ${COLOR[color] ?? COLOR.default} ${className}`}
      {...props}
    />
  );
}
