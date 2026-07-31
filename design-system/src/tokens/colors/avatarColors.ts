// 아바타 시멘틱 컬러 토큰
// Figma file: h9jZFkEHfcHUGok1TZjjlP — avater SET(8942:19658)의 avatar/* 변수 1:1 매핑.
//   text 타입: 이니셜 텍스트/배경(default·hover — pressed는 default 재사용, Figma 동일)
//   image 타입: 사진 안쪽 링(photo-inline) + hover 오버레이(photo-overlay)

import { baseColors } from '../colors';

const b = baseColors.base;

export const avatarColors = {
  text: b.white, // #ffffff — 이니셜 텍스트 (Figma avatar/text)
  'text-default-bg': b.blue[400], // #0f85f2 (Figma avatar/text default bg)
  'text-hover-bg': b.blue[500], // #0b69c2 (Figma avatar/text hover bg)
  'photo-inline': b['gray-900-25'], // #0d0d0d12 — 사진 경계 안쪽 링 (2026-07-31 900-25로 상향, Figma avatar/photo inline)
  'photo-overlay': b['gray-900-25'], // #0d0d0d12 — 사진 hover 오버레이 (Figma avatar/photo overly)
};
