// Figma "폰트 아이콘 칼라" (node 7012:93)에서 추출한 시멘틱 컬러
// get_design_context의 fallback 값과 실제 바인딩된 Figma 변수 값이 달라서
// get_variable_defs로 재확인한 실제 값을 기준으로 등록했습니다.
// 5개 모두 baseColors의 그레이 스케일과 정확히 일치하여, 베이스 컬러를
// 그대로 참조하는 형태로 정의합니다.

import { baseColors } from './colors';

export const fontIconColors = {
  5: baseColors.base.gray[900], // #0d0d0d — 메인, 폰트/아이콘 디폴트 적용 컬러
  4: baseColors.base.gray[600], // #3f3f3f
  3: baseColors.base.gray[300], // #878787
  2: baseColors.base.gray[150], // #c9c9c9
  1: baseColors.base.white, // #ffffff
};
