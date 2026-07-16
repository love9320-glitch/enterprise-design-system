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

// 그룹핑에 쓰는 함수 목록 — 템플릿 함수 셀렉트·함수 변경 팝오버·자연어 함수 칩이 공용.
// IF 포함(2026-07-15 지시 — 기존엔 leaf 전용으로 제외했었음)
export const FORMULA_GROUP_FUNCTIONS = Object.keys(FORMULA_FN_FAMILY);

// ── 스크리닝 키보드 체인 규약(2026-07-15) — 카드·수식·드롭 스트립 공용 ──
// 정거장(data-formula-chain)을 문서 순서로 잇는다: 조건 카드들 → 수식들 → 드롭 스트립.
// 한 단계가 완료되면 다음 정거장으로 포커스를 넘긴다(DOM 순서 = 체인 순서).
export function focusNextChainStop(currentEl) {
  if (!currentEl) return;
  // 패널 언마운트가 끝난 다음 틱에 이동(포커스 경합 방지)
  setTimeout(() => {
    const all = Array.from(document.querySelectorAll('[data-formula-chain]'));
    const next = all[all.indexOf(currentEl) + 1];
    if (!next) return;
    const target = next.matches('[tabindex]') ? next : next.querySelector('[tabindex]');
    if (!target) return;
    target.focus();
    // programmatic focus는 :focus-visible에 안 잡힐 수 있어 데이터 속성으로 링을 강제 표시,
    // 포커스가 떠나면 해제(체인 이동 가시성 유지 — 2026-07-16 개정과 세트)
    target.setAttribute('data-chain-focus', '');
    target.addEventListener('blur', () => target.removeAttribute('data-chain-focus'), { once: true });
  }, 0);
}
// 정거장 공용 링(2026-07-16 개정) — 마우스 클릭/프레스에는 링을 내지 않는다:
//  · focus-visible = 키보드 Tab 포커스(클릭의 :focus에는 미매칭 → 트리거 hover 링과 겹쳐
//    4px처럼 보이던 프레스 현상 제거)
//  · data-[chain-focus] = 체인의 programmatic focus(위 함수가 부여 — :focus-visible 미매칭 보완)
export const CHAIN_STOP_FOCUS =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-text-field-focused-line data-[chain-focus]:ring-2 data-[chain-focus]:ring-text-field-focused-line';
