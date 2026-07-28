// job posting template(폼 템플릿 B — 테이블형 폼 박스) 시멘틱 컬러 토큰
// Figma file: h9jZFkEHfcHUGok1TZjjlP — "form template type b" (node 8620:13367)
//   job posting template/* 변수(default bg / inline / outline)를 baseColors 경유로 정의한다.
import { baseColors } from '../colors';

const b = baseColors.base;

export const jobPostingTemplateColors = {
  'title-text': b.gray[900], // #0d0d0d — 템플릿 타이틀(채용 공고 설정)
  'default-out-bg': b.gray[50], // #f2f2f2 — 폼·테이블을 감싸는 회색 아우터 박스
  'default-bg': b.white, // #ffffff — 셀 배경
  'default-inline': b.gray[100], // #e3e3e3 — 셀 사이 1px 헤어라인(그리드 배경)
  'default-outline': b['gray-900-50'], // #0d0d0d29 — 박스 외곽선(한 단계 연하게, 2026-07-28 지시 — 구 900-75)
};
