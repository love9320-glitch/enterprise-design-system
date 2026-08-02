// Accordion Code Connect 매핑(2026-08-02) — accordion(8416:35290, 조립 단일) +
// accordion list SET(8416:35043, state=Close/Open×name edit).
//   - Open→defaultOpen, name edit→nameEditable(헤더가 Input+취소/저장 전환), 삭제 버튼=deletable.
// 발행: main 머지 시 자동(.github/workflows/figma-code-connect.yml)
// 파서 제약 — URL·props는 리터럴만(변수·스프레드·as const 금지).
import figma from '@figma/code-connect';
import { Accordion, AccordionItem } from './Accordion';

// accordion — 아이템 묶음(사이 구분선 내장)
figma.connect(
  Accordion,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=8416-35290',
  {
    example: () => (
      <Accordion>
        <AccordionItem title="아코디언 리스트 네임" defaultOpen nameEditable deletable>
          내용이 들어갑니다.
        </AccordionItem>
        <AccordionItem title="아코디언 리스트 네임" nameEditable deletable>
          내용이 들어갑니다.
        </AccordionItem>
        <AccordionItem title="아코디언 리스트 네임" nameEditable deletable>
          내용이 들어갑니다.
        </AccordionItem>
      </Accordion>
    ),
  },
);

// accordion list — 아이템 한 개(state Close/Open × name edit)
figma.connect(
  AccordionItem,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=8416-35043',
  {
    props: {
      defaultOpen: figma.enum('state', { Open: true, 'Open name edit': true }),
      nameEditable: figma.enum('state', {
        'Close name edit': true,
        'Open name edit': true,
      }),
    },
    example: ({ defaultOpen, nameEditable }) => (
      <AccordionItem
        title="아코디언 리스트 네임"
        defaultOpen={defaultOpen}
        nameEditable={nameEditable}
        deletable
        onDelete={() => {}}
      >
        내용이 들어갑니다.
      </AccordionItem>
    ),
  },
);
