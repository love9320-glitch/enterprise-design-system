// 레이아웃(AppLayout) 시멘틱 컬러 토큰
// Figma file: h9jZFkEHfcHUGok1TZjjlP — 101_layout (node 8941:17252)
//   GNB 바(gnb/bg)·메인 콘텐츠(bg)·우측 패널(bg) 배경 — 전부 base white 경유(Figma 변수 1:1).
// 영역 구분선은 Divider(divider-* 토큰)를 그대로 사용하므로 여기엔 배경만 둔다.

import { baseColors } from '../colors';

const b = baseColors.base;

export const layoutColors = {
  'gnb-bg': b.white, // #ffffff — GNB 그룹 배경 (Figma gnb/bg)
  'gnb-inline': b.gray[50], // #f2f2f2 — GNB 그룹 사이 1px 갭으로 비치는 배경 (Figma gnb/inline)
  'main-bg': b.white, // #ffffff — 메인 콘텐츠 영역 배경 (Figma bg)
  'panel-bg': b.white, // #ffffff — 우측 패널 배경 (Figma bg)
};
