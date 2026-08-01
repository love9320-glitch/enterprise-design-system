// Modal 계열 Code Connect 매핑(2026-08-01) — Modal SET(8187:47759, width size 7단) +
// Confirm/AlertModal SET(7681:19791, type=Confirm/Alert — 'Aler' 오타는 Figma에서 수정) +
// Modal Overlay Bg(7348:1758424 — 오버레이는 Modal 내장이라 Modal 사용 예시로 매핑).
//   - width size 360~1260 → size sm~4xl(코드 SIZE_WIDTH와 1:1). fill은 코드 전용.
// 발행: main 머지 시 자동(.github/workflows/figma-code-connect.yml)
// 파서 제약 — URL·props는 리터럴만(변수·스프레드·as const 금지).
import figma from '@figma/code-connect';
import { AlertModal, ConfirmModal, Modal } from './Modal';

// Modal — 범용 모달(폭 7단)
figma.connect(
  Modal,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=8187-47759',
  {
    props: {
      size: figma.enum('width size', {
        '360': 'sm',
        '480': 'md',
        '600': 'lg',
        '720': 'xl',
        '840': '2xl',
        '960': '3xl',
        '1260': '4xl',
      }),
    },
    example: ({ size }) => (
      <Modal open size={size} title="모달 타이틀" onClose={() => {}} confirmText="저장" onConfirm={() => {}}>
        모달 콘텐츠
      </Modal>
    ),
  },
);

// ConfirmModal — 재확인 체크형
figma.connect(
  ConfirmModal,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7681-19791',
  {
    variant: { type: 'Confirm' },
    example: () => (
      <ConfirmModal
        open
        title="삭제할까요?"
        description="삭제하면 되돌릴 수 없습니다."
        checkboxLabel="위 내용을 확인했습니다."
        confirmText="삭제"
        onConfirm={() => {}}
        onClose={() => {}}
      />
    ),
  },
);

// AlertModal — 단순 안내형
figma.connect(
  AlertModal,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7681-19791',
  {
    variant: { type: 'Alert' },
    example: () => (
      <AlertModal
        open
        title="안내"
        description="저장이 완료되었습니다."
        onConfirm={() => {}}
        onClose={() => {}}
      />
    ),
  },
);

// Modal Overlay Bg — 오버레이(dim)는 Modal에 내장 — Modal 사용 예시
figma.connect(
  Modal,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7348-1758424',
  {
    example: () => (
      <Modal open title="모달 타이틀" onClose={() => {}}>
        모달 콘텐츠
      </Modal>
    ),
  },
);
