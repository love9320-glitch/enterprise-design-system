// Vitest 공통 셋업 — jest-dom·axe 매처 등록 + RTL 정리 + jsdom 미구현 API 스텁
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// RTL 자동 정리 — globals:false에서는 auto-cleanup이 안 걸리므로 직접 등록
// (없으면 테스트 간 DOM이 누적돼 getByRole이 중복 매칭으로 실패한다)
afterEach(() => {
  cleanup();
  // 모달 등 portal 잔여물 정리(cleanup은 RTL 컨테이너만 언마운트)
  document.body.style.overflow = '';
});

// jsdom 미구현 — 컴포넌트가 사용하는 브라우저 API 스텁
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = globalThis.ResizeObserver ?? (ResizeObserverStub as never);

// Select 강조 스크롤 등에서 사용 — jsdom엔 없음
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}

// jsdom은 offsetParent를 항상 null로 준다 → useFocusTrap의 보임 판정(offsetParent !== null)이
// 전부 탈락해 focusables가 비게 됨. check:focus 스크립트와 동일한 스텁: 연결돼 있으면 보이는 것으로.
Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
  get(this: HTMLElement) {
    return this.isConnected ? this.parentNode : null;
  },
  configurable: true,
});
