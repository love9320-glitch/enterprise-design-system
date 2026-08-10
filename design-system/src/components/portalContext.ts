// portalContext — 포탈 컨테이너 컨텍스트 + 조회 훅 (컴포넌트는 PortalProvider.tsx).
// 파일 분리 이유: 컴포넌트 파일이 훅/상수를 함께 export하면 fast refresh가 깨진다(린트 규칙).
import { createContext, useContext } from 'react';

export const PortalContainerContext = createContext<HTMLElement | null>(null);

/** 포탈 대상 컨테이너 — PortalProvider 미지정 시 document.body */
export function usePortalContainer(): HTMLElement {
  return useContext(PortalContainerContext) ?? document.body;
}
