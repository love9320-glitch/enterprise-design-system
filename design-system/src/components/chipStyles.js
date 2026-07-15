// 칩 비주얼 공용 클래스 맵 — Chip(제거형 칩)과 SelectChip(칩형 Select 트리거)이 공유한다.
// 컴포넌트 파일에서 상수를 export하면 react-refresh 규칙에 걸려 별도 파일로 분리(modalContext와 동일 관례).
// color별 전체 클래스(Tailwind purge를 위해 동적 문자열이 아닌 완전한 클래스명으로 나열).
// text 색만 지정하면 내부 아이콘(lucide, stroke=currentColor)이 상속받는다. icon 토큰=text 토큰 값.
export const CHIP_COLOR_CLASS = {
  gray: 'text-chip-gray-default-text border-chip-gray-default-line bg-chip-gray-default-bg hover:text-chip-gray-hover-text hover:border-chip-gray-hover-line hover:bg-chip-gray-hover-bg',
  red: 'text-chip-red-default-text border-chip-red-default-line bg-chip-red-default-bg hover:text-chip-red-hover-text hover:border-chip-red-hover-line hover:bg-chip-red-hover-bg',
  blue: 'text-chip-blue-default-text border-chip-blue-default-line bg-chip-blue-default-bg hover:text-chip-blue-hover-text hover:border-chip-blue-hover-line hover:bg-chip-blue-hover-bg',
  black: 'text-chip-black-default-text border-chip-black-default-line bg-chip-black-default-bg hover:text-chip-black-hover-text hover:border-chip-black-hover-line hover:bg-chip-black-hover-bg',
  // 함수 계열 대응 색(2026-07-15) — green/violet/pink/orange
  green: 'text-chip-green-default-text border-chip-green-default-line bg-chip-green-default-bg hover:text-chip-green-hover-text hover:border-chip-green-hover-line hover:bg-chip-green-hover-bg',
  violet: 'text-chip-violet-default-text border-chip-violet-default-line bg-chip-violet-default-bg hover:text-chip-violet-hover-text hover:border-chip-violet-hover-line hover:bg-chip-violet-hover-bg',
  pink: 'text-chip-pink-default-text border-chip-pink-default-line bg-chip-pink-default-bg hover:text-chip-pink-hover-text hover:border-chip-pink-hover-line hover:bg-chip-pink-hover-bg',
  orange: 'text-chip-orange-default-text border-chip-orange-default-line bg-chip-orange-default-bg hover:text-chip-orange-hover-text hover:border-chip-orange-hover-line hover:bg-chip-orange-hover-bg',
};
