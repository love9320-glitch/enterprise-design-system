// PortalProvider shadow-root 테스트 — jsdom에서 shadow-root 안에 앱을 마운트하고:
//   ① PortalProvider 지정 시 포탈(Popover 패널·Modal)이 shadow-root 안 컨테이너에 렌더되는지
//   ② 미지정 시 기존처럼 document.body에 렌더되는지(기본 동작 회귀 없음)
//   ③ 외부클릭 닫기: shadow 안 패널 내부 클릭(리타게팅됨)은 닫지 않고, 진짜 바깥 클릭만 닫는지
// 실행: npm run check:shadow  (esbuild 번들 → node + jsdom)
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body></body></html>', { pretendToBeVisual: true });
globalThis.window = dom.window;
globalThis.document = dom.window.document;
if (typeof globalThis.navigator === 'undefined') globalThis.navigator = dom.window.navigator;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.Node = dom.window.Node;
globalThis.ShadowRoot = dom.window.ShadowRoot; // getRootNode() instanceof ShadowRoot 판정용
globalThis.MouseEvent = dom.window.MouseEvent;
globalThis.getComputedStyle = dom.window.getComputedStyle;
globalThis.MutationObserver = dom.window.MutationObserver;

const React = (await import('react')).default;
const { createRoot } = await import('react-dom/client');
const { act } = await import('react');
const { PortalProvider } = await import('../src/components/PortalProvider.tsx');
const { Popover } = await import('../src/components/Popover.tsx');

const h = React.createElement;
let fail = 0;
const ok = (cond, name) => {
  console.log(`${cond ? 'OK  ' : 'FAIL'} ${name}`);
  if (!cond) fail += 1;
};

// shadow-root 환경 구성 — host > shadowRoot > (appRoot, portalRoot)
const host = document.createElement('div');
document.body.appendChild(host);
const shadow = host.attachShadow({ mode: 'open' });
const appRoot = document.createElement('div');
const portalRoot = document.createElement('div');
shadow.appendChild(appRoot);
shadow.appendChild(portalRoot);

// ① PortalProvider 지정 → 패널이 shadow 안 portalRoot에 렌더
{
  let openState = true;
  const onOpenChange = (v) => {
    openState = v;
  };
  const root = createRoot(appRoot);
  const render = () =>
    act(() =>
      root.render(
        h(
          PortalProvider,
          { container: portalRoot },
          h(
            Popover,
            { open: openState, onOpenChange, trigger: h('button', null, '열기'), menuWidth: 100 },
            h('div', { id: 'panel-content' }, '패널'),
          ),
        ),
      ),
    );
  await render();
  const panel = portalRoot.querySelector('#panel-content');
  ok(!!panel, '① 패널이 shadow-root 안 portalRoot에 렌더');
  ok(!document.body.querySelector('#panel-content'), '① document.body에는 렌더되지 않음');

  // ③-1 패널 내부 mousedown(문서에는 host로 리타게팅) → 닫히지 않아야 한다
  await act(async () => {
    panel.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, composed: true }));
  });
  ok(openState === true, '③ 패널 내부 클릭(shadow 리타게팅)에도 닫히지 않음');

  // ③-2 진짜 바깥(body) mousedown → 닫힌다
  await act(async () => {
    document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
  });
  ok(openState === false, '③ 진짜 바깥 클릭에는 닫힘');
  await act(() => root.unmount());
}

// ② PortalProvider 미지정 → 기존처럼 document.body에 렌더(기본 동작 유지)
{
  const plainRoot = document.createElement('div');
  document.body.appendChild(plainRoot);
  const root = createRoot(plainRoot);
  await act(() =>
    root.render(
      h(
        Popover,
        { open: true, trigger: h('button', null, '열기'), menuWidth: 100 },
        h('div', { id: 'plain-panel' }, '패널'),
      ),
    ),
  );
  const inBody = Array.from(document.body.children).some((el) => el.querySelector?.('#plain-panel'));
  ok(inBody, '② 프로바이더 미지정 시 document.body 포탈 유지');
  await act(() => root.unmount());
}

console.log(fail === 0 ? '✅ shadow-root 포탈 테스트 통과' : `❌ 실패 ${fail}건`);
process.exit(fail === 0 ? 0 : 1);
