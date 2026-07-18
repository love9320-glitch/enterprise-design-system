// 한국 전화번호 하이픈 자동 삽입 — 숫자만 남기고 자릿수에 맞춰 구분자를 넣는다.
//   휴대폰/지역(3자리 국번): 3-3-4(10자리) / 3-4-4(11자리), 서울(02): 2-3-4(9자리) / 2-4-4(10자리)
//   입력 중(부분 자릿수)에도 점진적으로 포맷한다. 최대 11자리로 제한.
export function formatPhoneNumber(raw: string | number | null | undefined): string {
  const d = String(raw).replace(/\D/g, '').slice(0, 11);
  if (!d) return '';
  if (d.startsWith('02')) {
    if (d.length <= 2) return d;
    if (d.length <= 6) return `${d.slice(0, 2)}-${d.slice(2)}`;
    if (d.length <= 9) return `${d.slice(0, 2)}-${d.slice(2, 5)}-${d.slice(5)}`;
    return `${d.slice(0, 2)}-${d.slice(2, 6)}-${d.slice(6, 10)}`;
  }
  if (d.length <= 3) return d;
  if (d.length <= 7) return `${d.slice(0, 3)}-${d.slice(3)}`;
  if (d.length <= 10) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
}
