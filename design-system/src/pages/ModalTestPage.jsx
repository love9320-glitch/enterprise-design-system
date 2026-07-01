// 모달 테스트 구현 (test 카테고리 — 확인 후 삭제할 임시 데모)
// Figma 모달들을 실제 컴포넌트(Modal + TableTemplate)로 구현한 데모.
import { useState } from 'react';
import { Plus, Trash2, Upload, Download } from 'lucide-react';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { Tag } from '../components/Tag';
import { TableTemplate } from '../components/TableTemplate';
import { NoticeWritingTemplate } from '../components/NoticeWritingTemplate';
import { NOTICE_SAMPLE_BODIES } from './noticeSampleBodies';

const FIELDS = ['프론트엔드', '백엔드', '디자인', '마케팅', '기획'];

// ───────── 모달 1: 지원자 배경 (이름 / 지원 분야 / 평가자) ─────────
const BG_COLUMNS = [
  { key: 'name', label: '이름', width: 200 },
  { key: 'field', label: '지원 분야' },
  { key: 'evaluator', label: '평가자', width: 160, headerMenu: { sortable: true } },
];
const BG_APPLICANTS = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `지원자 ${i + 1}`,
  field: `1지망 : ${FIELDS[i % FIELDS.length]}`,
  evaluator: `평가자${i + 1}`,
}));

function BackgroundModal({ open, onClose }) {
  const [selectedIds, setSelectedIds] = useState([1, 2]); // 데모: 기본 2명 선택
  const close = () => {
    setSelectedIds([1, 2]);
    onClose();
  };
  return (
    <Modal
      open={open}
      onClose={close}
      title="지원자 배경"
      size="3xl"
      placement="top"
      footerStart={<span>{selectedIds.length}명 선택됨</span>}
      confirmText="확인"
      confirmDisabled={selectedIds.length === 0}
      onConfirm={close}
    >
      <TableTemplate
        columns={BG_COLUMNS}
        rows={BG_APPLICANTS}
        bordered={false}
        selectable
        selectedIds={selectedIds}
        onSelectChange={setSelectedIds}
        defaultPageSize={5}
        pageSizeOptions={[5, 10, 20]}
        searchPlaceholder="검색어를 입력하세요"
        actions={({ selectedIds: ids, clearSelection }) => (
          <>
            <Button variant="line" leftIcon={Trash2} disabled={ids.length === 0} onClick={clearSelection}>
              삭제
            </Button>
            <Button variant="line" leftIcon={Plus}>
              추가
            </Button>
          </>
        )}
      />
    </Modal>
  );
}

// ───────── 모달 2: 지원자 선택 (이름 / 지원 부서 / 상태 / 지원일) ─────────
const STATUS_TAG = { 검토중: 'gray', 합격: 'blue', 보류: 'red' };
const STATUSES = ['검토중', '합격', '보류'];
const SELECT_COLUMNS = [
  { key: 'name', label: '이름', width: 120 },
  { key: 'dept', label: '지원 부서' },
  { key: 'status', label: '상태', width: 100, render: (row) => <Tag color={STATUS_TAG[row.status]}>{row.status}</Tag> },
  { key: 'date', label: '지원일', width: 160 },
];
const SELECT_APPLICANTS = Array.from({ length: 23 }, (_, i) => ({
  id: i + 1,
  name: `지원자 ${i + 1}`,
  dept: FIELDS[i % FIELDS.length],
  status: STATUSES[i % STATUSES.length],
  date: `2026.06.${String((i % 28) + 1).padStart(2, '0')}`,
}));

function SelectionModal({ open, onClose }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const close = () => {
    setSelectedIds([]);
    onClose();
  };
  return (
    <Modal
      open={open}
      onClose={close}
      title="지원자 선택"
      size="3xl"
      placement="top"
      footerStart={<span>{selectedIds.length}명 선택됨</span>}
      confirmText="선택 완료"
      confirmDisabled={selectedIds.length === 0}
      onConfirm={close}
    >
      <TableTemplate
        columns={SELECT_COLUMNS}
        rows={SELECT_APPLICANTS}
        bordered={false}
        selectable
        selectedIds={selectedIds}
        onSelectChange={setSelectedIds}
        defaultPageSize={5}
        pageSizeOptions={[5, 10, 20]}
        searchPlaceholder="이름·부서 검색"
        actions={({ selectedIds: ids, clearSelection }) => (
          <>
            <Button variant="line" leftIcon={Upload}>가져오기</Button>
            <Button variant="line" leftIcon={Download}>내보내기</Button>
            <Button variant="line" leftIcon={Trash2} disabled={ids.length === 0} onClick={clearSelection}>
              선택 해제
            </Button>
          </>
        )}
      />
    </Modal>
  );
}

// ───────── 모달 3: 안내 작성 (모달 바디에 NoticeWritingTemplate) ─────────
const NOTICE_MERGE_FIELDS = ['{지원자명}', '{회사명}', '{지원직무}', '{면접일시}', '{면접장소}', '{담당자명}'];

function NoticeModal({ open, onClose }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="안내 작성"
      size="2xl"
      placement="top"
      cancelText="취소"
      confirmText="저장"
      onConfirm={onClose}
    >
      <NoticeWritingTemplate
        mergeFields={NOTICE_MERGE_FIELDS}
        defaultBodies={NOTICE_SAMPLE_BODIES}
        editorMinHeight={320}
        editorMaxHeight={440}
      />
    </Modal>
  );
}

export function ModalTestPage() {
  const [bgOpen, setBgOpen] = useState(false);
  const [selOpen, setSelOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  return (
    <section className="mx-auto max-w-5xl px-spacing-7 py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-20 font-semibold text-font-icon-5">모달 테스트 구현</h2>
      <p className="mb-spacing-8 text-14 text-font-icon-4">
        Figma 모달을 실제 컴포넌트(<span className="text-font-icon-5">Modal</span> +{' '}
        <span className="text-font-icon-5">TableTemplate</span>)로 구현한 테스트 데모입니다. 확인 후 삭제 예정.
      </p>
      <div className="flex flex-wrap gap-spacing-5">
        <Button variant="fill" onClick={() => setBgOpen(true)}>
          지원자 배경 모달 열기
        </Button>
        <Button variant="fill" onClick={() => setSelOpen(true)}>
          지원자 선택 모달 열기
        </Button>
        <Button variant="fill" onClick={() => setNoticeOpen(true)}>
          안내 작성 모달 열기
        </Button>
      </div>
      <BackgroundModal open={bgOpen} onClose={() => setBgOpen(false)} />
      <SelectionModal open={selOpen} onClose={() => setSelOpen(false)} />
      <NoticeModal open={noticeOpen} onClose={() => setNoticeOpen(false)} />
    </section>
  );
}
