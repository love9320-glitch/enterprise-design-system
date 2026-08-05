// stepper(line type) 시멘틱 컬러 토큰
// Figma file: h9jZFkEHfcHUGok1TZjjlP — "stepper - line type" (node 9216:12963)
//   stepper line type/* 변수를 baseColors 경유로 정의한다(progress 계열 소문자 정리 2026-08-05).
import { baseColors } from '../colors';

const b = baseColors.base;

export const stepperLineTypeColors = {
  'default-item': b.gray[100], // #e3e3e3 — 미진행 원·연결선
  'default-title': b.gray[900], // #0d0d0d — 미진행 타이틀·숫자
  'default-description': b.gray[300], // #878787 — 미진행 설명
  'hover-item': b.gray[125], // #d6d6d6 — hover 원·연결선
  'hover-title': b.gray[900], // #0d0d0d — hover 타이틀·숫자
  'hover-description': b.gray[900], // #0d0d0d — hover 설명
  'progress-item': b.blue[200], // #9ecefa — 진행 중 바깥 링·연결선
  'progress-item-bg': b.white, // #ffffff — 진행 중 안쪽 원 배경
  'progress-icon': b.blue[400], // #0f85f2 — 진행 중 아이콘(Figma font_icon blue 알리아스)
  'progress-title': b.blue[400], // #0f85f2 — 진행 중 타이틀·숫자
  'progress-description': b.blue[400], // #0f85f2 — 진행 중 설명
  'complete-item-bg': b.blue[400], // #0f85f2 — 완료 원·연결선
  'complete-check-icon': b.white, // #ffffff — 완료 체크 아이콘
  'complete-title': b.blue[400], // #0f85f2 — 완료 타이틀
  'complete-description': b.blue[400], // #0f85f2 — 완료 설명
  'disabled-item': b.gray[100], // #e3e3e3 — 비활성 원·연결선
  'disabled-title': b.gray[150], // #c9c9c9 — 비활성 타이틀·숫자
  'disabled-description': b.gray[150], // #c9c9c9 — 비활성 설명
};
