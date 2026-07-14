// 수식 함수 레지스트리 — ScreeningFormula(컴포넌트)와 ScreeningBuilderTemplate(함수 셀렉트)이 공유.
// 컴포넌트 파일에 상수 export를 두면 react-refresh 에러가 나서 분리(chipStyles.js 관례).
// 함수 → 계열 (Figma 함수 조건 색상표 8384:114813 — 계열별 고유 텍스트 컬러는 formula-* 토큰)

export const FORMULA_FN_FAMILY = {
  AND: 'logical',
  OR: 'logical',
  IF: 'conditional',
  SUM: 'aggregate',
  MAX: 'aggregate',
  MIN: 'aggregate',
  COUNTIF: 'aggregate',
  CAPMAX: 'score-limit',
  CAPMIN: 'score-limit',
  FITBYSCORE: 'evaluation',
  UNFITBYSCORE: 'evaluation',
};

// 그룹핑에 쓰는 함수 목록(IF는 leaf 전용) — 템플릿 함수 셀렉트가 사용
export const FORMULA_GROUP_FUNCTIONS = Object.keys(FORMULA_FN_FAMILY).filter((f) => f !== 'IF');
