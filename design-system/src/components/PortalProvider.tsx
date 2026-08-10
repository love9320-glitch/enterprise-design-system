// PortalProvider — 포탈(모달·팝오버·드롭다운·툴팁)이 붙을 컨테이너를 지정하는 프로바이더.
// 기본은 document.body. shadow-root로 스타일을 격리해 쓰는 사용처에서는 디자인 시스템
// 스타일(index.css)이 shadow-root 안에만 주입되므로, body 포탈 요소는 스타일을 받지 못한다
// → 앱 루트를 <PortalProvider container={shadowRoot 안의 요소}>로 감싸면 모든 포탈이
// 그 컨테이너 안에 렌더돼 격리된 스타일을 그대로 받는다.
//
// 사용(shadow-root 임베드 예):
//   const host = document.getElementById('widget')!;
//   const shadow = host.attachShadow({ mode: 'open' });
//   ...shadow 안에 스타일 주입 + appRoot/portalRoot div 생성...
//   createRoot(appRoot).render(
//     <PortalProvider container={portalRoot}>
//       <App />
//     </PortalProvider>,
//   );
//
// 주의: 포탈 패널은 position:fixed(뷰포트 좌표)로 배치되므로, 컨테이너의 조상에
// transform/filter/contain 등 containing block을 만드는 스타일이 있으면 좌표가 어긋난다.
import type { ReactNode } from 'react';
import { PortalContainerContext } from './portalContext';

export interface PortalProviderProps {
  /** 포탈이 렌더될 컨테이너 요소(shadow-root 내부의 div 등). null이면 document.body */
  container: HTMLElement | null;
  children?: ReactNode;
}

export function PortalProvider({ container, children }: PortalProviderProps) {
  return (
    <PortalContainerContext.Provider value={container}>{children}</PortalContainerContext.Provider>
  );
}
