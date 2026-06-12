// Tooltip — 오버레이 말풍선
// Figma 02_textfield의 에러 툴팁(node 7202:8647)을 컴포넌트화.
// 레이아웃 흐름에 영향을 주지 않도록, 띄울 위치 지정은 호출부에서 absolute 래퍼로 처리하고
// 이 컴포넌트는 "말풍선 박스 + 꼬리(beak)"만 그린다.

// variant별 색상 — 시멘틱 토큰 클래스만 사용 (규칙 1)
const VARIANT_STYLE = {
  error: 'bg-tf-error-tooltip-bg text-tf-error-tooltip-text',
};

// 꼬리(beak) 위치 — 말풍선이 대상의 어느 쪽에 붙는지
// 'top' = 말풍선이 대상 아래에 있고 꼬리가 위를 가리킴
const BEAK_STYLE = {
  top: '-top-spacing-2 left-spacing-5',     // 위쪽 가장자리, 좌측
  bottom: '-bottom-spacing-2 left-spacing-5',
};

export function Tooltip({
  children,
  variant = 'error',     // 'error'
  beak = 'top',          // 'top' | 'bottom' | 'none'
  className = '',
}) {
  const color = VARIANT_STYLE[variant] ?? VARIANT_STYLE.error;

  return (
    <div
      role="tooltip"
      className={`relative inline-flex items-center rounded-round-4 px-spacing-5 py-spacing-2 drop-shadow-[0px_2px_2px_rgba(0,0,0,0.12)] ${color} ${className}`}
    >
      {beak !== 'none' && (
        <span
          aria-hidden="true"
          className={`absolute h-spacing-5 w-spacing-5 rotate-45 rounded-[1px] ${color} ${BEAK_STYLE[beak] ?? BEAK_STYLE.top}`}
        />
      )}
      <p className="relative whitespace-nowrap text-12">{children}</p>
    </div>
  );
}
