// navContext — 데모 셸(App)의 페이지 이동을 하위 페이지에 여는 컨텍스트(2026-07-19 데모 리디자인).
// HomePage의 컴포넌트 갤러리 카드가 클릭 시 해당 데모 페이지로 이동할 때 사용한다.
// (App.jsx에서 직접 export하면 react-refresh only-export-components에 걸려 분리 — modalContext 관례)
import { createContext, useContext } from 'react';

export const NavContext = createContext({ navigate: () => {}, groups: [] });
export const useNav = () => useContext(NavContext);
