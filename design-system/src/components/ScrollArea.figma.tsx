// ScrollArea Code Connect 매핑(2026-08-01) — scroll SET(7206:10245, Property 1=Default/Hover).
//   - Hover는 thumb의 CSS 상태라 prop 매핑 없음 — 두 변형 모두 기본 사용 예시.
//   - 스크롤 규칙(규칙 9): 세로 스크롤 영역은 ScrollArea로 감싼다. % 상한은 루트에 height 필요.
// 발행: main 머지 시 자동(.github/workflows/figma-code-connect.yml)
// 파서 제약 — URL·props는 리터럴만(변수·스프레드·as const 금지).
import figma from '@figma/code-connect';
import { ScrollArea } from './ScrollArea';

figma.connect(
  ScrollArea,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7206-10245',
  {
    example: () => (
      <ScrollArea maxHeight={240}>
        <div>스크롤되는 콘텐츠</div>
      </ScrollArea>
    ),
  },
);
