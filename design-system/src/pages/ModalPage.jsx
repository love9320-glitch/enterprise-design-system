import { useState } from 'react';
import { RotateCw, Upload, Download, Trash2 } from 'lucide-react';
import { Modal, AlertModal, ConfirmModal, FormModal } from '../components/Modal';
import { Button } from '../components/Button';
import { ButtonGroup } from '../components/ButtonGroup';
import { Input } from '../components/Input';
import { Tag } from '../components/Tag';
import { TableTemplate } from '../components/TableTemplate';
import { UsageExample } from '../components/UsageExample';

const USAGE = `import { Modal, AlertModal, ConfirmModal, FormModal } from '../components/Modal';

// 기본 Modal — 완전 제어(open/onClose)
const [open, setOpen] = useState(false);
<Button onClick={() => setOpen(true)}>열기</Button>
<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="모달 타이틀"
  size="md"
  onConfirm={() => setOpen(false)}
>
  컴포넌트 또는 텍스트 영역
</Modal>

// 변형 — AlertModal(확인 1개) · ConfirmModal(취소/확인) · FormModal(취소/저장 + form)
<AlertModal open={a} onClose={() => setA(false)} title="알림">저장되었습니다.</AlertModal>
<ConfirmModal open={c} onClose={() => setC(false)} title="삭제할까요?"
  confirmText="삭제" onConfirm={remove}>되돌릴 수 없습니다.</ConfirmModal>
<FormModal open={f} onClose={() => setF(false)} title="회원 등록"
  submitText="등록" onSubmit={save}>...form...</FormModal>`;

const USAGE_PROPS = [
  { name: 'open / onClose', type: 'boolean / () => void', default: '—', desc: '열림 상태와 닫기 핸들러(딤 클릭·ESC·X 버튼이 모두 호출)' },
  { name: 'title', type: 'ReactNode', default: '—', desc: '헤더 타이틀' },
  { name: 'size', type: "'sm'|'md'|'lg'|'xl'|'2xl'|'3xl'|'4xl'|'fill'", default: "'md'", desc: 'ModalBox 너비 360/480/600/720/840/960/1260, fill=좌우 16씩 제외(calc(100vw-32px), 최소 1260)' },
  { name: 'placement', type: "'center'|'top'", default: "'top' (Alert/Confirm은 'center')", desc: '상단 정렬(여백은 팝업 높이에 반비례해 16 ~ 화면높이/2−150 가변) / 브라우저 중앙 정렬. 일반 팝업·FormModal은 top 기본, Alert/Confirm은 center 기본. 언제든 override 가능' },
  { name: 'children', type: 'ReactNode', default: '—', desc: 'ModalBody 내용(외부 주입). 길면 내부 스크롤' },
  { name: 'confirmText / onConfirm', type: 'string / () => void', default: "'확인'", desc: '주동작 버튼 라벨·핸들러' },
  { name: 'cancelText / onCancel', type: 'string / () => void', default: "'취소'", desc: '보조 버튼 라벨·핸들러(미지정 시 onClose)' },
  { name: 'confirmVariant', type: "'fill'|'line'|'ghost'", default: "'fill'", desc: '주동작 버튼 variant' },
  { name: 'confirmDisabled / confirmLoading', type: 'boolean', default: 'false', desc: '주동작 버튼 비활성/로딩' },
  { name: 'showCancel / showClose', type: 'boolean', default: 'true', desc: '취소 버튼 / 헤더 X 버튼 노출' },
  { name: 'showHeader / showFooter', type: 'boolean', default: 'true', desc: '헤더 / 푸터 영역 노출' },
  { name: 'footer / footerStart', type: 'ReactNode', default: '—', desc: '푸터 우측 전체 커스텀 / 좌측 영역(새로고침·불러오기 버튼, 안내글, 유효성 메시지 등)' },
  { name: 'closeOnOverlayClick / closeOnEsc', type: 'boolean', default: 'true', desc: '딤 클릭 / ESC로 닫기 허용' },
  { name: 'bodyMaxHeight', type: 'number | string', default: "'70vh'", desc: '본문 최대 높이(초과 시 ScrollArea 내부 스크롤)' },
  { name: 'onSubmit', type: '(e) => void', default: '—', desc: '주면 본문+푸터를 <form>으로 감싸고 주동작 버튼 type=submit (FormModal)' },
];

const SIZES = ['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', 'fill'];
const SIZE_LABEL = {
  sm: '360px', md: '480px', lg: '600px', xl: '720px',
  '2xl': '840px', '3xl': '960px', '4xl': '1260px', fill: '브라우저 −32px(좌우 16씩, 최소 1260)',
};

// ── 모달 본문에 TableTemplate을 넣는 데모용 데이터 ──
const STATUS_TAG = { 검토중: 'gray', 합격: 'blue', 보류: 'red' };
const APPLICANT_COLUMNS = [
  { key: 'name', label: '이름', width: 120 },
  { key: 'dept', label: '지원 부서' },
  { key: 'status', label: '상태', width: 100, render: (row) => <Tag type={STATUS_TAG[row.status]}>{row.status}</Tag> },
  { key: 'date', label: '지원일', width: 160 },
];
const DEPTS = ['프론트엔드', '백엔드', '디자인', '마케팅', '기획'];
const APPLICANT_STATUSES = ['검토중', '합격', '보류'];
const APPLICANTS = Array.from({ length: 23 }, (_, i) => ({
  id: i + 1,
  name: `지원자 ${i + 1}`,
  dept: DEPTS[i % DEPTS.length],
  status: APPLICANT_STATUSES[i % APPLICANT_STATUSES.length],
  date: `2026.06.${String((i % 28) + 1).padStart(2, '0')}`,
}));

// 모달 본문에 TableTemplate을 넣은 데모 — 선택 개수를 푸터 좌측에 표시, 0개면 완료 비활성.
function TableInModalDemo({ open, onClose }) {
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
        columns={APPLICANT_COLUMNS}
        rows={APPLICANTS}
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
            <Button
              variant="line"
              leftIcon={Trash2}
              disabled={ids.length === 0}
              onClick={clearSelection}
            >
              선택 해제{ids.length > 0 ? ` (${ids.length})` : ''}
            </Button>
          </>
        )}
      />
    </Modal>
  );
}

export function ModalPage() {
  const [base, setBase] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [scrollOpen, setScrollOpen] = useState(false);
  const [footerStartOpen, setFooterStartOpen] = useState(false);
  const [tableOpen, setTableOpen] = useState(false);
  const [placeOpen, setPlaceOpen] = useState(null); // 'center' | 'top'
  const [sizeOpen, setSizeOpen] = useState(null); // 현재 열린 사이즈 키
  const [name, setName] = useState('');

  return (
    <section className="mx-auto max-w-5xl px-spacing-7 py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-20 font-semibold text-font-icon-5">Modal</h2>
      <p className="mb-spacing-8 text-14 text-font-icon-4">
        오버레이 다이얼로그 — ModalBox(size 너비) 안에 Header/Body/Footer 3영역. 1px gap이
        구분선으로 비치고, 본문이 길면 <span className="text-font-icon-5">70vh</span>를 넘는 만큼
        내부 스크롤됩니다.<br />
        딤 클릭·ESC·X 버튼으로 닫힙니다. 색은 modal 시멘틱 토큰(base 경유), 버튼은 공통 Button을 사용합니다.
      </p>

      <UsageExample code={USAGE} props={USAGE_PROPS} />

      {/* 변형 */}
      <h3 className="mb-spacing-5 text-15 font-semibold text-font-icon-5">변형 (Variants)</h3>
      <div className="mb-spacing-9 flex flex-wrap gap-spacing-5">
        <Button variant="line" onClick={() => setBase(true)}>기본 Modal</Button>
        <Button variant="line" onClick={() => setAlertOpen(true)}>AlertModal</Button>
        <Button variant="line" onClick={() => setConfirmOpen(true)}>ConfirmModal</Button>
        <Button variant="line" onClick={() => setFormOpen(true)}>FormModal</Button>
        <Button variant="line" onClick={() => setScrollOpen(true)}>긴 본문(스크롤)</Button>
        <Button variant="line" onClick={() => setFooterStartOpen(true)}>푸터 좌측 영역</Button>
        <Button variant="line" onClick={() => setTableOpen(true)}>테이블 템플릿 (상단 정렬)</Button>
      </div>

      {/* 정렬 */}
      <h3 className="mb-spacing-5 border-t border-base-gray-100 pt-spacing-8 text-15 font-semibold text-font-icon-5">Placement</h3>
      <div className="mb-spacing-9 flex flex-wrap gap-spacing-5">
        <Button variant="line" onClick={() => setPlaceOpen('center')}>center (중앙)</Button>
        <Button variant="line" onClick={() => setPlaceOpen('top')}>top (상단 16 ~ 화면½−150 가변)</Button>
      </div>

      {/* 사이즈 */}
      <h3 className="mb-spacing-5 border-t border-base-gray-100 pt-spacing-8 text-15 font-semibold text-font-icon-5">Sizes</h3>
      <div className="mb-spacing-9 flex flex-wrap gap-spacing-5">
        {SIZES.map((s) => (
          <Button key={s} variant="line" onClick={() => setSizeOpen(s)}>
            {s} · {SIZE_LABEL[s]}
          </Button>
        ))}
      </div>

      {/* ── 모달 인스턴스들 ── */}
      <Modal
        open={base}
        onClose={() => setBase(false)}
        title="모달 타이틀"
        size="md"
        footerStart="컴포넌트 또는 텍스트 영역"
        onConfirm={() => setBase(false)}
      >
        ModalBody 영역입니다. 외부에서 주입한 컴포넌트나 텍스트가 이 자리에 들어갑니다.
      </Modal>

      <AlertModal
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        title="알림"
      >
        변경 사항이 저장되었습니다.
      </AlertModal>

      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="정말 삭제할까요?"
        confirmText="삭제"
        confirmVariant="fill"
        onConfirm={() => setConfirmOpen(false)}
      >
        삭제한 항목은 되돌릴 수 없습니다. 계속하시겠습니까?
      </ConfirmModal>

      <FormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setName('');
        }}
        title="회원 등록"
        submitText="등록"
        submitDisabled={!name.trim()}
        onSubmit={() => {
          setFormOpen(false);
          setName('');
        }}
      >
        <label className="mb-spacing-4 block text-13 font-semibold text-font-icon-5">이름</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="이름을 입력하세요" />
      </FormModal>

      <Modal
        open={scrollOpen}
        onClose={() => setScrollOpen(false)}
        title="이용약관"
        size="md"
        confirmText="동의"
        onConfirm={() => setScrollOpen(false)}
      >
        <div className="space-y-spacing-6">
          {Array.from({ length: 20 }).map((_, i) => (
            <p key={i}>
              {i + 1}. 본문이 70vh를 넘으면 ModalBody 안에서만 스크롤되고 헤더·푸터는 고정됩니다.
              ScrollArea의 오버레이 스크롤바로 표시됩니다.
            </p>
          ))}
        </div>
      </Modal>

      {/* footerStart — 푸터 좌측에 새로고침/불러오기 버튼 + 안내글 */}
      <Modal
        open={footerStartOpen}
        onClose={() => setFooterStartOpen(false)}
        title="데이터 동기화"
        size="lg"
        footerStart={
          <div className="flex items-center gap-spacing-6">
            <ButtonGroup>
              <Button variant="line" size="32" leftIcon={RotateCw}>새로고침</Button>
              <Button variant="line" size="32" leftIcon={Upload}>불러오기</Button>
            </ButtonGroup>
            <span>마지막 동기화 · 방금 전</span>
          </div>
        }
        confirmText="저장"
        onConfirm={() => setFooterStartOpen(false)}
      >
        푸터 좌측(footerStart)에는 새로고침·불러오기 버튼, 안내글, 유효성 메시지 등이 들어갈 수
        있습니다. 우측 버튼 그룹과 한 줄에 배치됩니다.
      </Modal>

      <TableInModalDemo open={tableOpen} onClose={() => setTableOpen(false)} />

      <Modal
        open={placeOpen != null}
        onClose={() => setPlaceOpen(null)}
        title={placeOpen === 'top' ? '상단 정렬 (top)' : '중앙 정렬 (center)'}
        size="md"
        placement={placeOpen ?? 'center'}
        onConfirm={() => setPlaceOpen(null)}
      >
        {placeOpen === 'top'
          ? '상단 정렬 — 상단 여백은 팝업 높이에 반비례해 16 ~ (화면높이/2−150)px로 가변(내용 많으면 줄고 적으면 늘어남).'
          : '브라우저 정중앙에 정렬됩니다.'}
      </Modal>

      {SIZES.map((s) => (
        <Modal
          key={s}
          open={sizeOpen === s}
          onClose={() => setSizeOpen(null)}
          title={`size = ${s} (${SIZE_LABEL[s]})`}
          size={s}
          onConfirm={() => setSizeOpen(null)}
        >
          ModalBox 너비는 {SIZE_LABEL[s]}이고, 내부 요소는 width 100%로 채웁니다.
        </Modal>
      ))}
    </section>
  );
}
