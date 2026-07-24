// JobPositionTemplate(구 B타입) 플로우 재현 테스트(일회성 디버그) — jsdom에서 실제 클릭 시뮬레이션.
// 시나리오: 기준1=지역 → 값1(체크박스) 서울 → 기준2=고용형태 → 값 전부 리셋(카드·칩) 확인
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body></body></html>', { pretendToBeVisual: true });
globalThis.window = dom.window;
globalThis.document = dom.window.document;
if (typeof globalThis.navigator === 'undefined') globalThis.navigator = dom.window.navigator;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.Node = dom.window.Node;
globalThis.MouseEvent = dom.window.MouseEvent;
globalThis.KeyboardEvent = dom.window.KeyboardEvent;
globalThis.requestAnimationFrame = (cb) => setTimeout(cb, 0);
globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
globalThis.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);
globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
dom.window.HTMLElement.prototype.scrollIntoView = function () {}; // jsdom 미구현 스텁
Object.defineProperty(dom.window.HTMLElement.prototype, 'offsetParent', {
  get() { return this.isConnected ? this.parentNode : null; },
  configurable: true,
});

const React = (await import('react')).default;
const { createRoot } = await import('react-dom/client');
const { act } = await import('react');
const { JobPositionTemplate } = await import('../src/components/JobPositionTemplate.tsx');

const h = React.createElement;
const CRITERIA = [
  { value: 'region', label: '지역' },
  { value: 'employ', label: '고용형태' },
];
const VALUES = {
  region: [{ value: 'seoul', label: '서울' }],
  employ: [{ value: 'regular', label: '정규직' }],
};

const mount = document.createElement('div');
document.body.appendChild(mount);
const root = createRoot(mount);
await act(async () => root.render(h(JobPositionTemplate, { criteriaOptions: CRITERIA, valueOptions: VALUES })));

const click = async (el) => {
  await act(async () => {
    el.dispatchEvent(new dom.window.MouseEvent('mousedown', { bubbles: true }));
    el.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
  });
};
const findByText = (text, selector = '*') =>
  [...document.querySelectorAll(selector)].filter((el) => el.textContent?.trim() === text || el.textContent?.includes(text));
const combos = () => [...document.querySelectorAll('[role="combobox"]')];
const trigger = (labelText) => {
  const cs = combos().filter((b) => b.textContent?.includes(labelText));
  if (!cs[0]) {
    console.log('콤보 목록:', combos().map((b) => JSON.stringify(b.textContent?.trim().slice(0, 30))).join(' | '));
  }
  return cs[0];
};
const option = (label) => {
  const opts = [...document.querySelectorAll('[role="option"]')].filter((o) => o.textContent?.trim().includes(label));
  return opts[opts.length - 1];
};

let fail = 0;
const ok = (cond, name) => { console.log((cond ? 'OK   ' : 'FAIL ') + name); if (!cond) fail += 1; };

// 1) 기준1 = 지역 → 행 생성
await click(trigger('기준1 선택'));
ok(!!option('지역'), '기준1 팝오버에 지역 옵션');
await click(option('지역'));
ok(combos().filter((c) => c.textContent?.includes('지역 선택')).length > 0, '테이블에 지역 칩(빈) 생성');

// 2) 값1 = 서울 (기준1이 마지막 카드 → 체크박스 confirm)
await click(trigger('값 선택'));
await click(option('서울'));
const confirmBtn = [...document.querySelectorAll('button')].filter((b) => b.textContent?.trim() === '확인')[0];
ok(!!confirmBtn, '체크박스 confirm 푸터 확인 버튼');
await click(confirmBtn);
ok(combos().filter((c) => c.textContent?.includes('서울')).length > 0, '칩에 서울 반영');

// 3) 기준2 = 고용형태 → 값 전부 리셋(카드·칩) 기대
await click(trigger('기준2 선택'));
await click(option('고용형태'));
const seoulLeft = combos().filter((c) => c.textContent?.includes('서울')).length;
ok(seoulLeft === 0, `기준2 선택 후 서울 칩 리셋(잔존 ${seoulLeft})`);
ok(combos().filter((c) => c.textContent?.includes('지역 선택')).length > 0, '지역 칩 플레이스홀더 복귀');
ok(combos().filter((c) => c.textContent?.includes('고용형태 선택')).length > 0, '고용형태 칩(빈) 추가');

console.log(fail === 0 ? '✅ B 플로우 테스트 통과' : `❌ ${fail}건 실패`);
process.exit(fail ? 1 : 0);
