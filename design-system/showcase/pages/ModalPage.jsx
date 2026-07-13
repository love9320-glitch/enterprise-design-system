import { useState } from 'react';
import { RotateCw, Upload, Download, Trash2 } from 'lucide-react';
import { Modal, AlertModal, ConfirmModal, FormModal } from '../../src/components/Modal';
import { Button } from '../../src/components/Button';
import { ButtonGroup } from '../../src/components/ButtonGroup';
import { Input } from '../../src/components/Input';
import { Tag } from '../../src/components/Tag';
import { TableTemplate } from '../../src/components/TableTemplate';
import { UsageExample } from '../components/UsageExample';
import { Divider } from '../../src/components/Divider';

// ───────────── 기본 Modal ─────────────
const MODAL_NOTE = '요소 구성 — Header[타이틀 · 닫기(X)] + Body[자유 주입 children] + Footer[footerStart(좌측 영역) · 취소/확인 버튼]';
const MODAL_USAGE = `import { Modal } from '../../src/components/Modal';

const [open, setOpen] = useState(false);
<Button onClick={() => setOpen(true)}>열기</Button>
<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="모달 타이틀"
  size="md"                    // sm~4xl · fill
  placement="top"              // top | center
  footerStart="좌측 영역"      // 선택(안내글·버튼·유효성 메시지)
  confirmText="확인"
  onConfirm={() => setOpen(false)}
>
  본문에 컴포넌트·텍스트를 자유롭게 주입합니다.
</Modal>`;
const MODAL_PROPS = [
  { name: 'open / onClose', type: 'boolean / () => void', default: '—', desc: '열림 상태와 닫기 핸들러(딤 클릭·ESC·X 버튼이 모두 호출)' },
  { name: 'title', type: 'ReactNode', default: '—', desc: '헤더 타이틀' },
  { name: 'children', type: 'ReactNode', default: '—', desc: 'ModalBody 내용(외부 주입). 길면 내부 스크롤' },
  { name: 'size', type: "'sm'|'md'|'lg'|'xl'|'2xl'|'3xl'|'4xl'|'fill'", default: "'md'", desc: 'ModalBox 너비 360/480/600/720/840/960/1260, fill=좌우 16씩 제외(최소 1260)' },
  { name: 'placement', type: "'center'|'top'", default: "'top'", desc: '상단 정렬(여백 16 ~ 화면½−150 가변) / 브라우저 중앙' },
  { name: 'confirmText / onConfirm', type: 'string / () => void', default: "'확인'", desc: '주동작 버튼 라벨·핸들러' },
  { name: 'cancelText / onCancel', type: 'string / () => void', default: "'취소'", desc: '보조 버튼 라벨·핸들러(미지정 시 onClose)' },
  { name: 'footer / footerStart', type: 'ReactNode', default: '—', desc: '푸터 우측 전체 커스텀 / 좌측 영역(버튼·안내글·유효성 메시지)' },
  { name: 'footerStartType', type: "'text' | 'button'", default: "'text'", desc: '푸터 좌측 내용 유형 — 왼쪽 여백 결정: text=16px / button=12px(버튼 자체 여백 감안)' },
  { name: 'showHeader / showClose / showFooter / showCancel', type: 'boolean', default: 'true', desc: '헤더 / X 버튼 / 푸터 / 취소 버튼 노출' },
  { name: 'closeOnOverlayClick / closeOnEsc', type: 'boolean', default: 'true', desc: '딤 클릭 / ESC로 닫기 허용' },
  { name: 'bodyMaxHeight', type: 'number | string', default: "'70vh'", desc: '본문 최대 높이(초과 시 ScrollArea 내부 스크롤)' },
];

// ───────────── FormModal ─────────────
const FORM_NOTE = '요소 구성 — 기본 Modal과 동일(Header + Body + Footer) + 본문 <form> 래핑 · Footer[취소 · 저장(submit)]';
const FORM_USAGE = `import { FormModal } from '../../src/components/Modal';

const [open, setOpen] = useState(false);
const [name, setName] = useState('');
<FormModal
  open={open}
  onClose={() => setOpen(false)}
  title="회원 등록"
  submitText="등록"
  submitDisabled={!name.trim()}   // 유효성: 비면 저장 비활성
  onSubmit={save}                 // form submit(엔터 제출)
>
  <label>이름</label>
  <Input value={name} onChange={(e) => setName(e.target.value)} />
</FormModal>`;
const FORM_PROPS = [
  { name: 'open / onClose', type: 'boolean / () => void', default: '—', desc: '열림 상태와 닫기 핸들러' },
  { name: 'title', type: 'ReactNode', default: '—', desc: '헤더 타이틀' },
  { name: 'children', type: 'ReactNode', default: '—', desc: '폼 본문(입력 필드 등)' },
  { name: 'onSubmit', type: '(e) => void', default: '—', desc: '본문+푸터를 <form>으로 감싸고 저장 버튼 type=submit' },
  { name: 'submitText', type: 'string', default: "'저장'", desc: '주동작 버튼 라벨(저장·등록 등)' },
  { name: 'submitDisabled / loading', type: 'boolean', default: 'false', desc: '저장 버튼 비활성(유효성) / 로딩' },
  { name: 'cancelText / onCancel', type: 'string / () => void', default: "'취소'", desc: '보조 버튼 라벨·핸들러(미지정 시 onClose)' },
  { name: 'size / placement', type: "size · 'center'|'top'", default: "'md' / 'top'", desc: '기본 Modal과 동일' },
];

// ───────────── AlertModal ─────────────
const ALERT_NOTE = '요소 구성 — Header 없음 · Body[타이틀 → 설명(description) → 2뎁스 상세(descriptionDetail, 회색 박스·선택)] · Footer[확인 1개·전체 폭]';
const ALERT_USAGE = `import { AlertModal } from '../../src/components/Modal';

const [open, setOpen] = useState(false);
<AlertModal
  open={open}
  onClose={() => setOpen(false)}
  title="알럿 확인"
  description={'설명글입니다.\\n여러 줄은 \\\\n으로 구분합니다.'}
  descriptionDetail="2뎁스 상세 설명(회색 박스, 선택)"
  confirmText="확인"
  onConfirm={() => setOpen(false)}
/>`;
const ALERT_PROPS = [
  { name: 'open / onClose', type: 'boolean / () => void', default: '—', desc: '열림 상태와 닫기 핸들러(딤 클릭·ESC도 호출)' },
  { name: 'title', type: 'ReactNode', default: '—', desc: '본문 첫 줄 타이틀(헤더 없음)' },
  { name: 'description', type: 'ReactNode', default: '—', desc: '설명글(여러 줄은 \\n). 고정 슬롯' },
  { name: 'descriptionDetail', type: 'ReactNode', default: '—', desc: '2뎁스 상세 설명(회색 박스). 고정 슬롯·선택' },
  { name: 'confirmText / onConfirm', type: 'string / () => void', default: "'확인'", desc: '확인 버튼 라벨·핸들러(미지정 시 onClose)' },
  { name: 'size', type: "'sm'~'fill'", default: "'sm'", desc: '기본 360px' },
  { name: 'placement', type: "'center'|'top'", default: "'center'", desc: '기본 중앙 정렬' },
];

// ───────────── ConfirmModal ─────────────
const CONFIRM_NOTE = '요소 구성 — Header 없음 · Body[타이틀 → 설명 → 2뎁스 상세 → 체크박스(checkboxLabel·선택)] · Footer[취소 · 확인·전체 폭]';
const CONFIRM_USAGE = `import { ConfirmModal } from '../../src/components/Modal';

const [open, setOpen] = useState(false);
<ConfirmModal
  open={open}
  onClose={() => setOpen(false)}
  title="삭제 확인"
  description="삭제한 항목은 되돌릴 수 없습니다."
  descriptionDetail="영향 범위 등 상세(회색 박스, 선택)"
  checkboxLabel="경고! 복구할 수 없음을 확인했습니다."  // 재확인(선택)
  requireCheck                  // 체크해야 확인 활성화(기본 true)
  confirmText="삭제"
  confirmVariant="fill"
  onConfirm={remove}
/>`;
const CONFIRM_PROPS = [
  { name: 'open / onClose', type: 'boolean / () => void', default: '—', desc: '열림 상태와 닫기 핸들러(딤 클릭·ESC도 호출)' },
  { name: 'title', type: 'ReactNode', default: '—', desc: '본문 첫 줄 타이틀(헤더 없음)' },
  { name: 'description', type: 'ReactNode', default: '—', desc: '설명글(여러 줄은 \\n). 고정 슬롯' },
  { name: 'descriptionDetail', type: 'ReactNode', default: '—', desc: '2뎁스 상세 설명(회색 박스). 고정 슬롯·선택' },
  { name: 'checkboxLabel', type: 'ReactNode', default: '—', desc: '주면 본문에 재확인 체크박스 노출(삭제 등 위험 액션용)' },
  { name: 'requireCheck', type: 'boolean', default: 'true', desc: 'checkboxLabel 있을 때 체크해야 확인 버튼 활성화' },
  { name: 'checked / onCheckChange', type: 'boolean / (checked, e) => void', default: '—', desc: '체크 상태 controlled 제어(미지정 시 내부 상태)' },
  { name: 'confirmText / onConfirm', type: 'string / () => void', default: "'확인'", desc: '확인 버튼 라벨·핸들러' },
  { name: 'cancelText / onCancel', type: 'string / () => void', default: "'취소'", desc: '취소 버튼 라벨·핸들러(미지정 시 onClose)' },
  { name: 'confirmVariant', type: "'fill'|'line'|'ghost'", default: "'fill'", desc: '확인 버튼 variant' },
  { name: 'size / placement', type: "size · 'center'|'top'", default: "'sm' / 'center'", desc: '기본 360px·중앙 정렬' },
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
  { key: 'status', label: '상태', width: 100, render: (row) => <Tag color={STATUS_TAG[row.status]}>{row.status}</Tag> },
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

// 섹션 헤더 — 변형별 제목 + 설명
function SectionHeader({ title, children, first = false }) {
  return (
    <>
      {!first && <Divider className="mt-spacing-9 mb-spacing-9" />}
      <div className="mb-spacing-6">
        <h3 className="mb-spacing-3 text-18 font-semibold text-font-icon-5">{title}</h3>
        <p className="text-14 text-font-icon-4">{children}</p>
      </div>
    </>
  );
}

export function ModalPage() {
  // 기본 Modal
  const [base, setBase] = useState(false);
  const [scrollOpen, setScrollOpen] = useState(false);
  const [footerStartOpen, setFooterStartOpen] = useState(false);
  const [tableOpen, setTableOpen] = useState(false);
  const [placeOpen, setPlaceOpen] = useState(null); // 'center' | 'top'
  const [sizeOpen, setSizeOpen] = useState(null); // 현재 열린 사이즈 키
  // FormModal
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState('');
  // AlertModal
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertDetailOpen, setAlertDetailOpen] = useState(false);
  // ConfirmModal
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmCheckOpen, setConfirmCheckOpen] = useState(false);

  return (
    <section className="mx-auto max-w-5xl px-spacing-7 py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-20 font-semibold text-font-icon-5">Modal</h2>
      <p className="mb-spacing-8 text-14 text-font-icon-4">
        오버레이 다이얼로그. 기본 <span className="text-font-icon-5">Modal</span>·
        <span className="text-font-icon-5">FormModal</span>은 Header/Body/Footer 3영역 구조이고,<br />
        <span className="text-font-icon-5">AlertModal</span>·
        <span className="text-font-icon-5">ConfirmModal</span>은 헤더 없이 본문 고정 슬롯
        (타이틀·설명·2뎁스 상세·체크박스)만 둡니다.<br />
        딤 클릭·ESC로 닫히고, 색은 modal 시멘틱 토큰(base 경유), 버튼은 공통 Button을 사용합니다.
      </p>

      {/* ───────────── 기본 Modal ───────────── */}
      <SectionHeader title="기본 Modal" first>
        Header(타이틀·X) + Body(자유 주입) + Footer(좌측 영역 + 버튼) 3영역. 본문이 70vh를 넘으면
        내부 스크롤됩니다. 사이즈·정렬·긴 본문·푸터 좌측·테이블 인 모달을 지원합니다.
      </SectionHeader>
      <UsageExample title="기본 Modal 사용 예시" note={MODAL_NOTE} code={MODAL_USAGE} props={MODAL_PROPS} />
      <div className="mb-spacing-7 flex flex-wrap gap-spacing-5">
        <Button variant="line" onClick={() => setBase(true)}>기본 Modal</Button>
        <Button variant="line" onClick={() => setScrollOpen(true)}>긴 본문(스크롤)</Button>
        <Button variant="line" onClick={() => setFooterStartOpen(true)}>푸터 좌측 영역</Button>
        <Button variant="line" onClick={() => setTableOpen(true)}>테이블 템플릿 (상단 정렬)</Button>
      </div>
      <h4 className="mb-spacing-4 text-14 font-semibold text-font-icon-5">Placement</h4>
      <div className="mb-spacing-7 flex flex-wrap gap-spacing-5">
        <Button variant="line" onClick={() => setPlaceOpen('center')}>center (중앙)</Button>
        <Button variant="line" onClick={() => setPlaceOpen('top')}>top (상단 16 ~ 화면½−150 가변)</Button>
      </div>
      <h4 className="mb-spacing-4 text-14 font-semibold text-font-icon-5">Sizes</h4>
      <div className="mb-spacing-9 flex flex-wrap gap-spacing-5">
        {SIZES.map((s) => (
          <Button key={s} variant="line" onClick={() => setSizeOpen(s)}>
            {s} · {SIZE_LABEL[s]}
          </Button>
        ))}
      </div>

      {/* ───────────── FormModal ───────────── */}
      <SectionHeader title="FormModal">
        기본 Modal 구조에 <span className="text-font-icon-5">form</span> 래핑 + 유효성 검사를 더한
        변형. 취소/저장(또는 등록) 버튼이며, 입력이 비면 저장이 비활성화됩니다.
      </SectionHeader>
      <UsageExample title="FormModal 사용 예시" note={FORM_NOTE} code={FORM_USAGE} props={FORM_PROPS} />
      <div className="mb-spacing-9 flex flex-wrap gap-spacing-5">
        <Button variant="line" onClick={() => setFormOpen(true)}>회원 등록 (FormModal)</Button>
      </div>

      {/* ───────────── AlertModal ───────────── */}
      <SectionHeader title="AlertModal">
        헤더 없이 본문 고정 슬롯(타이틀 → 설명 → 2뎁스 상세 박스)만 두는 단순 알림. 확인 버튼
        1개(전체 폭), 기본 너비 360px.
      </SectionHeader>
      <UsageExample title="AlertModal 사용 예시" note={ALERT_NOTE} code={ALERT_USAGE} props={ALERT_PROPS} />
      <div className="mb-spacing-9 flex flex-wrap gap-spacing-5">
        <Button variant="line" onClick={() => setAlertOpen(true)}>기본 (설명만)</Button>
        <Button variant="line" onClick={() => setAlertDetailOpen(true)}>2뎁스 상세 포함</Button>
      </div>

      {/* ───────────── ConfirmModal ───────────── */}
      <SectionHeader title="ConfirmModal">
        헤더 없이 본문 고정 슬롯(타이틀 → 설명 → 2뎁스 상세 → 체크박스)만 두는 의사결정 모달.<br />
        취소/확인 버튼(전체 폭). 체크박스는 삭제 등 위험 액션의 재확인 요소로,
        <span className="text-font-icon-5"> requireCheck</span>(기본 true)면 체크해야 확인이 활성화됩니다.
      </SectionHeader>
      <UsageExample title="ConfirmModal 사용 예시" note={CONFIRM_NOTE} code={CONFIRM_USAGE} props={CONFIRM_PROPS} />
      <div className="mb-spacing-9 flex flex-wrap gap-spacing-5">
        <Button variant="line" onClick={() => setConfirmOpen(true)}>기본 (취소/확인)</Button>
        <Button variant="line" onClick={() => setConfirmCheckOpen(true)}>체크박스 재확인 (삭제)</Button>
      </div>

      {/* ── 기본 Modal 인스턴스 ── */}
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
        footerStartType="button"
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

      {/* ── FormModal 인스턴스 ── */}
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

      {/* ── AlertModal 인스턴스 ── */}
      <AlertModal
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        title="알럿 확인"
        description={'설정된 리마인드 메시지를 발송합니다.\n발송에 사용되는 이메일, SMS 포인트가 차감됩니다.'}
      />

      <AlertModal
        open={alertDetailOpen}
        onClose={() => setAlertDetailOpen(false)}
        title="알럿 확인"
        description={'설정된 리마인드 메시지를 발송합니다.\n발송에 사용되는 이메일, SMS 포인트가 차감됩니다.'}
        descriptionDetail={'정보제공 동의를 다시 받는 방법은 아래와 같습니다.\n- 지원서 작성 마지막 단계에서 최종제출 버튼 클릭\n- 채용사이트 마이페이지 접속 시도'}
      />

      {/* ── ConfirmModal 인스턴스 ── */}
      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="발송 확인"
        description={'설정된 리마인드 메시지를 발송합니다.\n발송에 사용되는 이메일, SMS 포인트가 차감됩니다.'}
        confirmText="발송"
        onConfirm={() => setConfirmOpen(false)}
      />

      <ConfirmModal
        open={confirmCheckOpen}
        onClose={() => setConfirmCheckOpen(false)}
        title="삭제 확인"
        description={'설정된 리마인드 메시지를 발송합니다.\n발송에 사용되는 이메일, SMS 포인트가 차감됩니다.'}
        descriptionDetail={'정보제공 동의를 다시 받는 방법은 아래와 같습니다.\n- 지원서 작성 마지막 단계에서 최종제출 버튼 클릭\n- 채용사이트 마이페이지 접속 시도\n- 채용사이트 지원서 수정 접속 시도'}
        checkboxLabel="경고! 삭제 시 복구할 수 없음을 확인했습니다."
        confirmText="삭제"
        confirmVariant="fill"
        onConfirm={() => setConfirmCheckOpen(false)}
      />
    </section>
  );
}
