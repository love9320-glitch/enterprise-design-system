// 채용 분야 설정 모달 A — test 하위 메뉴(2026-07-24 지시).
// URL(#job-position-modal-a)로 직접 진입하면 모달이 바로 열린 상태로 시작한다.
import { useRef, useState } from 'react';
import { JobPositionTemplate } from '../components/JobPositionTemplate';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { CodeCreateModal } from './CodeCreateModal';
import { CRITERIA, VALUES, JOBDA_GROUPS, JOBDA_DUTIES } from './jobPositionSampleData';

export function JobPositionModalAPage() {
  const [open, setOpen] = useState(true); // URL 진입 즉시 모달 열림
  const [codeOpen, setCodeOpen] = useState(false);
  const templateRef = useRef(null);

  return (
    <section className="mx-auto max-w-5xl px-spacing-7 py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-20 font-semibold text-font-icon-5">채용 분야 설정 모달 A</h2>
      <p className="mb-spacing-8 text-14 text-font-icon-4">
        Job Position Template A타입 모달 단독 테스트 페이지 — URL로 직접 진입하면 모달이 바로 열립니다.
      </p>
      <Button variant="fill" onClick={() => setOpen(true)}>
        채용 분야 설정 모달 A 열기
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="채용 분야 설정"
        size="4xl"
        confirmText="저장"
        cancelText="취소"
        onConfirm={() => {
          if (!templateRef.current?.validate()) return; // 빈 칩 있으면 저장 중단(에러 툴팁)
          setOpen(false);
        }}
      >
        <JobPositionTemplate
          ref={templateRef}
          criteriaOptions={CRITERIA}
          valueOptions={VALUES}
          multiLastValue
          jobdaGroupOptions={JOBDA_GROUPS}
          jobdaDutyOptions={JOBDA_DUTIES}
          onRegisterCode={() => setCodeOpen(true)}
        />
      </Modal>

      <CodeCreateModal open={codeOpen} onClose={() => setCodeOpen(false)} />
    </section>
  );
}
