// ButtonGroup Code Connect 매핑(2026-07-28) — 01_buttons 페이지 "button group" SET(7626:2719).
// direction(horizontal/vertical) × gap(3~7 토큰 키) 변형을 prop으로 번역한다.
import figma from '@figma/code-connect';
import { Button } from './Button';
import { ButtonGroup } from './ButtonGroup';

figma.connect(
  ButtonGroup,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7626-2719',
  {
    props: {
      direction: figma.enum('direction', { Horizontal: 'horizontal', Vertical: 'vertical' }),
      gap: figma.enum('gap', { '3': '3', '4': '4', '5': '5', '6': '6', '7': '7' }),
    },
    example: ({ direction, gap }) => (
      <ButtonGroup direction={direction} gap={gap}>
        <Button variant="line">취소</Button>
        <Button variant="fill">저장</Button>
      </ButtonGroup>
    ),
  },
);
