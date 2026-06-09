// 아이콘 시스템 기본값 — Lucide 아이콘(lucide-react) 사용을 전제로 합니다.
// Lucide는 윤곽선(stroke) 기반 아이콘이므로 fill은 사용하지 않고
// stroke 색상·두께만 지정합니다.

import { fontIconColors } from './semanticColors';

export const iconTokens = {
  size: 16,
  strokeWidth: 1.8,
  // 아이콘 기본 색상 — 폰트 기본 색상과 동일한 시멘틱 토큰(font / icon color 5)을 그대로 참조
  color: fontIconColors[5],
};
