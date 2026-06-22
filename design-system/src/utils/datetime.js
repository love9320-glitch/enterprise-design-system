// 날짜·시간 표기 유틸 (디자인 시스템 공통 포맷)
// 규칙: 날짜·시간 표기는 항상 아래 형식으로 통일한다. 연·월·일·시·분 모두 2자리 0 패딩(연도는 뒤 2자리).
//   - 날짜+시간 1건 : "YY.MM.DD (HH:MM)"           예) 25.05.20 (12:00)
//   - 날짜만        : "YY.MM.DD"                   예) 25.05.20
//   - 범위(둘 다)   : "YY.MM.DD (HH:MM)~YY.MM.DD (HH:MM)"  (틸드 양옆 공백 없음)
//   - 범위(시작만)  : "YY.MM.DD (HH:MM) ~ 마감일 없음"
//   - 범위(마감만)  : "시작일 없음 ~ YY.MM.DD (HH:MM)"
const pad2 = (n) => String(n).padStart(2, '0');

// 'HH:MM' 문자열 또는 Date에서 시:분 문자열 추출
const toTimeStr = (time) => {
  if (!time) return '';
  if (typeof time === 'string') return time; // 이미 'HH:MM'
  return `${pad2(time.getHours())}:${pad2(time.getMinutes())}`;
};

// 날짜 → "YY.MM.DD" (2자리 연·월·일)
export function formatDate(date) {
  if (!date) return '';
  return `${pad2(date.getFullYear() % 100)}.${pad2(date.getMonth() + 1)}.${pad2(date.getDate())}`;
}

// 날짜+시간 → "YY.MM.DD (HH:MM)". time은 'HH:MM' 문자열 또는 Date. 시간이 없으면 날짜만.
export function formatDateTime(date, time) {
  if (!date) return '';
  const t = toTimeStr(time);
  return t ? `${formatDate(date)} (${t})` : formatDate(date);
}

// 날짜+시간 범위
//   - 둘 다 : "A~B" (공백 없는 틸드)
//   - 시작만: "A ~ 마감일 없음" / 마감만: "시작일 없음 ~ B"
//   - 라벨은 emptyStartLabel/emptyEndLabel로 변경 가능. 둘 다 없으면 ''.
export function formatDateTimeRange(
  start,
  startTime,
  end,
  endTime,
  { emptyStartLabel = '시작일 없음', emptyEndLabel = '마감일 없음' } = {},
) {
  const s = formatDateTime(start, startTime);
  const e = formatDateTime(end, endTime);
  if (start && end) return `${s}~${e}`;
  if (start) return `${s} ~ ${emptyEndLabel}`;
  if (end) return `${emptyStartLabel} ~ ${e}`;
  return '';
}
