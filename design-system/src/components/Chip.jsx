// Chip — 제거형 칩 (Figma chip: state Default/hover/pressed × size 22 × color gray/red/blue/black
//        + 함수 계열 대응 green/violet/pink/orange — 2026-07-15 추가)
// 텍스트 + X(삭제) 버튼. 색은 chip 시멘틱 토큰 경유(default/hover, pressed=default 재사용).
//  - color: gray(기본) · red · blue · black — 분류/의미 색(variant). recolor 금지, prop으로 표현(규칙 5)
//  - onRemove가 있으면 X 노출(클릭 시 삭제, 칩 onClick과 분리)
//  - onClick 주면 칩 전체가 클릭 가능(선택 등)
// (disabled 변형은 Figma에 없어 미제공 — 필요 시 추후 추가)
import { X } from 'lucide-react';
// 칩 색 클래스 맵 — SelectChip(Select variant="chip")과 공유(별도 파일, react-refresh 규칙 회피)
import { CHIP_COLOR_CLASS } from './chipStyles';

export function Chip({
  children,
  onRemove,                 // X 클릭 콜백 — 있으면 X 노출
  onClick,                  // 칩 전체 클릭(선택 등)
  color = 'gray',           // gray | red | blue | black
  removeAriaLabel = '삭제',
  className = '',
  ...props
}) {
  const clickable = !!onClick;
  const base =
    'inline-flex items-center gap-spacing-3 rounded-round-4 border pl-spacing-4 pr-spacing-3 py-spacing-1 ' +
    'font-pretendard font-normal text-12 transition-colors';

  return (
    <span
      onClick={clickable ? onClick : undefined}
      className={`${base} ${CHIP_COLOR_CLASS[color] ?? CHIP_COLOR_CLASS.gray} ${clickable ? 'cursor-pointer' : ''} ${className}`}
      {...props}
    >
      <span className="whitespace-nowrap">{children}</span>
      {onRemove && (
        <button
          type="button"
          aria-label={removeAriaLabel}
          onClick={(e) => {
            e.stopPropagation();
            onRemove(e);
          }}
          className="flex shrink-0 items-center justify-center"
        >
          <X size={12} strokeWidth={1.8} />
        </button>
      )}
    </span>
  );
}
