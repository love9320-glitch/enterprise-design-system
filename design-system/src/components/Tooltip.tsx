// Tooltip — 오버레이 말풍선
// Figma 02_textfield의 툴팁(error / normal 타입)을 컴포넌트화.
// 위치 지정은 호출부에서 처리하고, 이 컴포넌트는 "말풍선 박스 + 꼬리(beak)"만 그린다.
//   - error: 빨강 배경 + beak (필수 입력 등)
//   - normal: 검정 배경, beak 없이 사용 (말줄임 전체 텍스트 등)
import { textFieldColors } from '../tokens';

// variant별 색상 — 시멘틱 토큰값을 인라인으로 적용
// (Tailwind 클래스 'tf-normal-tooltip-*'의 -bg/-text 모호성 회피)
const VARIANT_COLOR = {
  error: { bg: textFieldColors['error-tooltip-bg'], fg: textFieldColors['error-tooltip-text'] },
  normal: { bg: textFieldColors['normal-tooltip-bg'], fg: textFieldColors['normal-tooltip-text'] },
};

// 꼬리(beak) 위치 — 'top' = 말풍선이 대상 아래, 꼬리가 위를 가리킴
const BEAK_STYLE = {
  top: '-top-spacing-2 left-spacing-5',
  bottom: '-bottom-spacing-2 left-spacing-5',
};

export function Tooltip({
  children,
  variant = 'error', // 'error' | 'normal'
  beak = 'top',      // 'top' | 'bottom' | 'none'
  className = '',
}: any) {
  const c = VARIANT_COLOR[variant] ?? VARIANT_COLOR.error;

  return (
    <div
      role="tooltip"
      style={{ backgroundColor: c.bg, color: c.fg }}
      className={`relative inline-flex items-center rounded-round-4 px-spacing-5 py-spacing-2 drop-shadow-[0px_2px_2px_rgba(13,13,13,0.12)] ${className}`}
    >
      {beak !== 'none' && (
        <span
          aria-hidden="true"
          style={{ backgroundColor: c.bg }}
          className={`absolute h-spacing-5 w-spacing-5 rotate-45 rounded-[1px] ${BEAK_STYLE[beak] ?? BEAK_STYLE.top}`}
        />
      )}
      <p className="relative whitespace-nowrap text-12">{children}</p>
    </div>
  );
}
