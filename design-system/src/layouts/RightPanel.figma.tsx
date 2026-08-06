// RightPanel Code Connect 매핑(2026-07-31) — Right Panel SET(8985:21064).
//   - width size 변형: 360/480/Fullscreen→width('360'/'480'/'fill').
//   - top/bottom/close button 불리언·ModalBody 슬롯은 코드의 title/footer/onClose/children 슬롯이 대응
//     (규칙 11 — 코드 축소 없음). 예시는 Figma 기본 구성(타이틀+닫기+푸터 취소/저장)으로 표현.
// 발행: main 머지 시 자동(.github/workflows/figma-code-connect.yml)
// 파서 제약 — URL·props는 리터럴만(변수·스프레드·as const 금지).
import figma from '@figma/code-connect';
import { Button } from '../components/Button';
import { ButtonGroup } from '../components/ButtonGroup';
import { RightPanel } from './RightPanel';

figma.connect(
  RightPanel,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=8985-21064',
  {
    props: {
      width: figma.enum('width size', {
        '360': '360',
        '480': '480',
        Fullscreen: 'fill',
      }),
    },
    example: ({ width }) => (
      <RightPanel
        width={width}
        title="라이트 패널 타이틀"
        onClose={() => {}}
        footer={
          <div className="flex w-full items-center justify-between">
            <p className="text-14 text-font-icon-5">컴포넌트 영역</p>
            <ButtonGroup gap="5">
              <Button variant="line">취소</Button>
              <Button variant="fill">저장</Button>
            </ButtonGroup>
          </div>
        }
      >
        바디 콘텐츠
      </RightPanel>
    ),
  },
);
