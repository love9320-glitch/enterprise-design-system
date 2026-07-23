// ModalBodyMaxContext — Modal이 계산한 본문 '내용' 가용 높이(px, 본문 패딩 제외).
// 모달 본문을 꽉 채우려는 자식(예: SideNavigationTemplate height='fill')이 소비한다.
// 모달 밖에서는 null — 소비자는 부모 100% 등으로 폴백한다.
// (컴포넌트 파일과 분리 — react-refresh only-export-components 회피, tableView/utils 전례)
import { createContext } from 'react';
import type { ReactNode } from 'react';

export const ModalBodyMaxContext = createContext<number | null>(null);

// ModalFooterStartContext — 모달 본문 자식이 푸터 좌측 슬롯(footerStart)에 내용을 주입하는 setter.
// 예: JobPositionTemplate '채용 분야 코드 등록' 버튼 — 페이지에선 Step 01 하단, 모달에선 푸터 왼쪽(2026-07-23 지시).
// 모달 밖에서는 null(= 모달 여부 판별로도 사용). 소비자가 footerStart prop을 직접 주면 그것이 우선.
export const ModalFooterStartContext = createContext<((node: ReactNode) => void) | null>(null);
