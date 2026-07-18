// popoverLayers — 열려 있는 팝오버/드롭다운 패널(portal) 레이어 스택 (Popover·Select 공유)
// 패널은 각자 portal이라 DOM 포함 관계로는 중첩을 알 수 없다 → 연 순서 스택으로 "맨 위" 판정.
//  - 외부 클릭: 맨 위 레이어 하나만 닫는다(아래 레이어는 자기 차례가 올 때까지 유지)
//  - Esc: 맨 위 레이어만 닫는다(중첩 팝오버·팝오버 안 셀렉트가 한 번에 다 닫히지 않게)
// 원래 Popover.jsx 내부 배열이었으나, 팝오버 패널 안에 Select(드롭다운도 portal)를 넣는
// 복수 조건 설정(2026-07-16)에서 Select도 같은 스택에 서야 해 공용 모듈로 추출했다.
// 레이어 식별자 — 각 패널의 menuRef 객체(동일성 비교만 하므로 내용 타입은 무관)
type LayerRef = object;

const layers: LayerRef[] = [];

export function pushPopoverLayer(ref: LayerRef) {
  layers.push(ref);
}

export function removePopoverLayer(ref: LayerRef) {
  const i = layers.indexOf(ref);
  if (i >= 0) layers.splice(i, 1);
}

export function isTopPopoverLayer(ref: LayerRef) {
  return layers[layers.length - 1] === ref;
}

// 열린 레이어가 하나라도 있는지 — 필요 시 전역 판단용
export function hasPopoverLayers() {
  return layers.length > 0;
}
