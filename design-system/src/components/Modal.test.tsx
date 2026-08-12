// Modal 단위 테스트 — 접근성 연결·포커스·닫기 규칙·중첩·스크롤 잠금·이중 API·변형 (2026-08-12)
// 스크래치 jsdom 스모크(modal-composition-test)를 정식 테스트로 이관.
import { describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfirmModal, FormModal, Modal } from './Modal';

function openModal(props: Record<string, unknown> = {}, children = '본문') {
  const onClose = vi.fn();
  render(
    <Modal open onClose={onClose} title="테스트 모달" {...props}>
      {children}
    </Modal>,
  );
  return onClose;
}

describe('Modal 접근성', () => {
  it('role=dialog + aria-modal=true가 적용된다', () => {
    openModal();
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('타이틀이 aria-labelledby로 연결된다', () => {
    openModal();
    const dialog = screen.getByRole('dialog');
    const labelledBy = dialog.getAttribute('aria-labelledby');
    expect(labelledBy).toBeTruthy();
    expect(document.getElementById(labelledBy!)).toHaveTextContent('테스트 모달');
  });

  it('열리면 포커스가 모달로 진입한다(기본: 컨테이너)', () => {
    openModal();
    expect(screen.getByRole('dialog')).toHaveFocus();
  });

  it("initialFocus='first'면 첫 포커스 가능 요소로 진입한다", () => {
    openModal({ initialFocus: 'first' });
    // 헤더 닫기(X) 버튼이 첫 포커스 가능 요소
    expect(screen.getByRole('button', { name: '닫기' })).toHaveFocus();
  });

  it('닫히면 열기 직전 트리거로 포커스가 복귀한다', async () => {
    function Wrap() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>열기</button>
          <Modal open={open} onClose={() => setOpen(false)} title="m">본문</Modal>
        </>
      );
    }
    render(<Wrap />);
    const trigger = screen.getByRole('button', { name: '열기' });
    await userEvent.click(trigger);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});

describe('Modal 닫기 규칙', () => {
  it('ESC로 닫히고, closeOnEsc=false면 닫히지 않는다', async () => {
    const onClose = openModal();
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closeOnEsc=false면 ESC가 무시된다', async () => {
    const onClose = openModal({ closeOnEsc: false });
    await userEvent.keyboard('{Escape}');
    expect(onClose).not.toHaveBeenCalled();
  });

  it('딤 직접 클릭으로 닫힌다(박스 클릭은 무시)', async () => {
    const onClose = openModal();
    await userEvent.click(screen.getByRole('dialog')); // 박스 클릭 — 안 닫힘
    expect(onClose).not.toHaveBeenCalled();
    const overlay = screen.getByRole('dialog').parentElement!;
    await userEvent.click(overlay);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closeOnOverlayClick=false면 딤 클릭이 무시된다', async () => {
    const onClose = openModal({ closeOnOverlayClick: false });
    await userEvent.click(screen.getByRole('dialog').parentElement!);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('중첩 모달 — ESC는 맨 위 모달만 닫는다', async () => {
    const closeOuter = vi.fn();
    const closeInner = vi.fn();
    render(
      <>
        <Modal open onClose={closeOuter} title="바깥">바깥 본문</Modal>
        <Modal open onClose={closeInner} title="안쪽">안쪽 본문</Modal>
      </>,
    );
    await userEvent.keyboard('{Escape}');
    expect(closeInner).toHaveBeenCalledTimes(1);
    expect(closeOuter).not.toHaveBeenCalled();
  });

  it('열리면 body 스크롤이 잠기고, 닫히면 풀린다', () => {
    function Wrap({ open }: { open: boolean }) {
      return <Modal open={open} onClose={() => {}} title="m">본문</Modal>;
    }
    const { rerender } = render(<Wrap open />);
    expect(document.body.style.overflow).toBe('hidden');
    rerender(<Wrap open={false} />);
    expect(document.body.style.overflow).not.toBe('hidden');
  });
});

describe('Modal 이중 API(조립형)', () => {
  it('Modal.Root/Header/Body/Footer 조립이 렌더되고 X가 onClose와 연결된다', async () => {
    const onClose = vi.fn();
    render(
      <Modal.Root open onClose={onClose}>
        <Modal.Header title="조립형">
          <span>뱃지</span>
        </Modal.Header>
        <Modal.Body>조립 본문</Modal.Body>
        <Modal.Footer>
          <span>좌측</span>
        </Modal.Footer>
      </Modal.Root>,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('뱃지')).toBeInTheDocument();
    expect(screen.getByText('좌측')).toBeInTheDocument();
    // 조립형에서도 타이틀 labelledby 연결
    const labelledBy = screen.getByRole('dialog').getAttribute('aria-labelledby');
    expect(document.getElementById(labelledBy!)).toHaveTextContent('조립형');
    await userEvent.click(screen.getByRole('button', { name: '닫기' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('슬롯을 Root 밖에서 쓰면 명확한 에러를 던진다', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Modal.Body>x</Modal.Body>)).toThrow(/Modal\.Root/);
    spy.mockRestore();
  });
});

describe('Modal 변형', () => {
  it('ConfirmModal — 재확인 체크 전에는 확인이 비활성, 체크하면 활성', async () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmModal
        open
        onClose={() => {}}
        title="삭제"
        description="되돌릴 수 없습니다."
        checkboxLabel="확인했습니다."
        confirmText="삭제"
        onConfirm={onConfirm}
      />,
    );
    const confirmBtn = screen.getByRole('button', { name: '삭제' });
    expect(confirmBtn).toBeDisabled();
    await userEvent.click(screen.getByRole('checkbox'));
    expect(confirmBtn).toBeEnabled();
    await userEvent.click(confirmBtn);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('FormModal — 저장 버튼이 form을 submit하고 loading 시 비활성', async () => {
    const onSubmit = vi.fn((e) => e);
    const { rerender } = render(
      <FormModal open onClose={() => {}} title="등록" onSubmit={onSubmit}>
        <input aria-label="이름" />
      </FormModal>,
    );
    await userEvent.click(screen.getByRole('button', { name: '저장' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    rerender(
      <FormModal open onClose={() => {}} title="등록" onSubmit={onSubmit} loading>
        <input aria-label="이름" />
      </FormModal>,
    );
    expect(screen.getByRole('button', { name: '저장' })).toBeDisabled();
  });
});
