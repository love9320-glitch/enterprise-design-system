// ModalBodyMaxContext — Modal이 계산한 본문 '내용' 가용 높이(px, 본문 패딩 제외).
// 모달 본문을 꽉 채우려는 자식(예: SideNavigationTemplate height='fill')이 소비한다.
// 모달 밖에서는 null — 소비자는 부모 100% 등으로 폴백한다.
// (컴포넌트 파일과 분리 — react-refresh only-export-components 회피, tableView/utils 전례)
import { createContext } from 'react';

export const ModalBodyMaxContext = createContext(null);
