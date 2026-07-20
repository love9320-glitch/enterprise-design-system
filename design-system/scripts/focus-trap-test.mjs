// useFocusTrap DOM 테스트 — jsdom에서 실제 렌더 + Tab keydown 시뮬레이션으로
// 진입 포커스·트랩(경계 순환)·복원을 검증한다. (renderToString은 effect 미실행이라 별도)
// 실행: npm run check:focus  (esbuild 번들 → node + jsdom)
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body></body></html>', { pretendToBeVisual: true });
globalThis.window = dom.window;
globalThis.document = dom.window.document;
// navigator — Node 21+는 전역으로 이미 존재(재할당 불가), Node 20 이하는 없으므로 jsdom 것으로 채운다.
// (react-dom이 navigator.userAgent를 참조 — 없으면 ReferenceError)
if (typeof globalThis.navigator === 'undefined') globalThis.navigator = dom.window.navigator;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.Node = dom.window.Node;
// jsdom은 offsetParent를 항상 null로 준다 → 보임 판정(el.offsetParent !== null)이 실패하므로
// 테스트용으로 '연결돼 있으면 보이는 것'으로 스텁(포커스 트랩 로직 검증 목적)
Object.defineProperty(dom.window.HTMLElement.prototype, 'offsetParent', {
  get() {
    return this.isConnected ? this.parentNode : null;
  },
  configurable: true,
});

const React = (await import('react')).default;
const { createRoot } = await import('react-dom/client');
const { act } = await import('react');
const { useFocusTrap } = await import('../src/components/useFocusTrap.ts');

const h = React.createElement;
let fail = 0;
const ok = (cond, name) => {
  if (cond) console.log('OK   ' + name);
  else {
    fail += 1;
    console.log('FAIL ' + name);
  }
};

// 테스트 컴포넌트 — active면 useFocusTrap이 걸리는 컨테이너 + 버튼 3개
function Trapped({ active }) {
  const ref = React.useRef(null);
  useFocusTrap(active, ref);
  return h(
    'div',
    { ref, tabIndex: -1, 'data-box': true },
    h('button', { id: 'b1' }, 'one'),
    h('button', { id: 'b2' }, 'two'),
    h('button', { id: 'b3' }, 'three'),
  );
}

const pressTab = (shift = false) => {
  const e = new dom.window.KeyboardEvent('keydown', { key: 'Tab', shiftKey: shift, bubbles: true, cancelable: true });
  (document.activeElement ?? document.body).dispatchEvent(e);
};

// 열기 전 포커스할 외부 트리거
const trigger = document.createElement('button');
trigger.id = 'trigger';
document.body.appendChild(trigger);
trigger.focus();
ok(document.activeElement === trigger, '사전: 트리거에 포커스');

const mount = document.createElement('div');
document.body.appendChild(mount);
const root = createRoot(mount);

// ① 열기 — 진입 포커스가 컨테이너(box)로
await act(async () => root.render(h(Trapped, { active: true })));
const box = mount.querySelector('[data-box]');
ok(document.activeElement === box, '① 진입: 컨테이너로 포커스 이동');

// ② 트랩 — 마지막에서 Tab → 처음으로 순환
document.getElementById('b3').focus();
pressTab(false);
ok(document.activeElement === document.getElementById('b1'), '② 트랩: 마지막→처음(Tab)');

// ② 트랩 — 처음에서 Shift+Tab → 마지막으로 순환
document.getElementById('b1').focus();
pressTab(true);
ok(document.activeElement === document.getElementById('b3'), '② 트랩: 처음→마지막(Shift+Tab)');

// ③ 복원 — 닫으면(언마운트) 열기 직전 포커스(트리거)로
await act(async () => root.render(h(Trapped, { active: false })));
ok(document.activeElement === trigger, '③ 복원: 닫을 때 트리거로 포커스 복원');

console.log(fail === 0 ? '✅ 포커스 트랩 테스트 통과' : `❌ ${fail}건 실패`);
if (fail) process.exit(1);
