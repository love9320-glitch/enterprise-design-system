// Figma "border 토큰" (node 7013:273)에서 추출한 테두리 두께 토큰
// 키를 숫자로 등록해 Tailwind가 border-1, border-2 ... 클래스를
// 그대로 생성하도록 합니다 (Figma 토큰명 "border N"과 1:1 대응).

export const borderWidth = {
  1: '1px',
  2: '2px',
  3: '3px',
  4: '4px',
};
