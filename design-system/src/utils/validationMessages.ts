// 벨리데이션 에러 카피 표준(2026-07-30 지시) — 규칙 15(카피)의 연장, 규칙 21로 등록.
// 에러 툴팁 문구는 아래 3종으로 통일한다. 컴포넌트 errorMessage/formatErrorMessage 기본값이
// 이 상수라서 별도 지정 없이 error=true만 켜면 표준 카피가 자동 적용된다.
// (특수한 안내가 꼭 필요한 화면만 props로 덮어쓴다)

// 필수 입력 — 텍스트 입력류(Input·TextArea 등)
export const REQUIRED_INPUT_MESSAGE = '필수 입력사항입니다.';
// 필수 선택 — 선택류(Select·DateField·TimeField 등)
export const REQUIRED_SELECT_MESSAGE = '필수 선택사항입니다.';
// 형식 오류 — 메일폼·전화번호·날짜/시간 직접 입력 등 양식 불일치
export const INVALID_FORMAT_MESSAGE = '잘못된 양식입니다.';
