// 모달 테스트 구현 (test 카테고리 — 확인 후 삭제할 임시 데모)
// Figma 모달들을 실제 컴포넌트(Modal + TableTemplate)로 구현한 데모.
import { useRef, useState } from 'react';
import { Plus, Trash2, Upload, Download, ChevronDown, ChevronRight, Pencil } from 'lucide-react';
import { Modal } from '../components/Modal';
import { JobPositionTemplate } from '../components/JobPositionTemplate';
import { Button } from '../components/Button';
import { Tag } from '../components/Tag';
import { TableTemplate } from '../components/TableTemplate';
import { NoticeWritingTemplate } from '../components/NoticeWritingTemplate';
import { FormTemplate } from '../components/FormTemplate';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { DateField } from '../components/DateField';
import { EmailField, PhoneField } from '../components/SelectOrInput';
import { iconCellWidth } from '../components/tableView';
import { NOTICE_SAMPLE_BODIES, NOTICE_TEMPLATE_BODIES } from './noticeSampleBodies';
import { CodeCreateModal } from './CodeCreateModal';

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
      title="지원자 배정"
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

// ───────── 모달 4: 안내 및 발표 작성 (FormTemplate + NoticeWritingTemplate 조립) ─────────
const COMPOSE_TEMPLATES = [
  { value: 'pass', label: '합격 안내' },
  { value: 'fail', label: '불합격 안내' },
  { value: 'doc', label: '서류 접수 안내' },
];
const COMPOSE_METHODS = [
  { value: 'site', label: '채용사이트' },
  { value: 'email', label: '이메일' },
  { value: 'sms', label: 'SMS' },
];
const COMPOSE_EMAILS = ['midasHR@midas.com', 'recruit@midas.com'];
const COMPOSE_PHONES = ['010-1234-1234', '02-555-0100'];

function ComposeModal({ open, onClose }) {
  // 전형안내 방법(다중 선택) — 체크된 채널에 따라 발신 이메일/SMS 필드가 각각 활성화된다
  const [methods, setMethods] = useState(['site']);
  // 발송 템플릿(합격/불합격/서류 접수) — 선택에 따라 에디터 본문 교체(key 재마운트로 defaultBodies 재시드).
  // 미선택(디폴트) 상태에선 에디터 비움.
  const [template, setTemplate] = useState('');
  const emailOn = methods.includes('email');
  const smsOn = methods.includes('sms');
  const close = () => {
    setMethods(['site']);
    setTemplate('');
    onClose();
  };

  // 상단 폼 — Figma form template 2column 구성(발신 이메일/SMS는 선택 채널에 연동)
  const fields = [
    {
      key: 'name',
      label: '안내 및 발표 명칭',
      required: true,
      control: <Input width="100%" placeholder="명칭을 입력하세요" />,
    },
    {
      key: 'time',
      label: '발송/게시 시간',
      required: true,
      control: <DateField width="fill" showTime disablePast placeholder="날짜와 시간을 선택하세요" />,
    },
    {
      key: 'template',
      label: '발송 템플릿',
      control: (
        <Select
          width="100%"
          options={COMPOSE_TEMPLATES}
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          placeholder="템플릿을 선택하세요"
        />
      ),
    },
    {
      key: 'method',
      label: '전형안내 방법',
      control: (
        <Select
          width="100%"
          multiple
          options={COMPOSE_METHODS}
          value={methods}
          onChange={(e) => setMethods(e.target.value)}
          placeholder="전형안내 방법을 선택하세요"
        />
      ),
    },
    {
      key: 'email',
      label: '이메일 안내문 발신주소',
      disabled: !emailOn,
      control: (
        <EmailField
          options={COMPOSE_EMAILS}
          defaultValue="midasHR@midas.com"
          disabled={!emailOn}
          width="100%"
          selectWidth="45%"
          inputPlaceholder="이메일을 직접 입력"
        />
      ),
    },
    {
      key: 'sms',
      label: 'SMS 안내문 발신번호',
      disabled: !smsOn,
      control: (
        <PhoneField
          options={COMPOSE_PHONES}
          defaultValue="010-1234-1234"
          disabled={!smsOn}
          width="100%"
          selectWidth="45%"
          inputPlaceholder="전화번호를 직접 입력"
        />
      ),
    },
  ];

  return (
    <Modal
      open={open}
      onClose={close}
      title="안내 및 발표 작성"
      size="2xl"
      placement="top"
      cancelText="취소"
      confirmText="저장"
      onConfirm={close}
    >
      <div className="flex flex-col gap-spacing-9">
        <FormTemplate columns={2} columnGap={16} rowGap={16} labelSize="14" fields={fields} />
        {/* key=template — 발송 템플릿 선택 시 재마운트해 defaultBodies를 새 본문으로 재시드(미선택=빈 에디터) */}
        <NoticeWritingTemplate
          key={template || 'empty'}
          mergeFields={NOTICE_MERGE_FIELDS}
          enabledChannels={methods}
          defaultBodies={template ? NOTICE_TEMPLATE_BODIES[template] : undefined}
          editorMinHeight={360}
        />
      </div>
    </Modal>
  );
}

// ───────── 모달 6: 메세지 템플릿 생성 (FormTemplate 2단 + NoticeWritingTemplate) ─────────
const MSG_TYPES = [
  { value: 'common', label: '공통' },
  { value: 'individual', label: '개별' },
];
const MSG_TARGETS = [
  { value: 'applicant', label: '지원자' },
  { value: 'evaluator', label: '평가자' },
];

function MessageTemplateModal({ open, onClose }) {
  // 전형 안내 방법(다중 선택) — 기본 3개 모두 선택, 체크된 채널만 안내문 탭 활성
  const [methods, setMethods] = useState(['site', 'email', 'sms']);
  const close = () => {
    setMethods(['site', 'email', 'sms']);
    onClose();
  };

  const fields = [
    // 필수 입력(템플릿 명)은 그리드 첫 칸(왼쪽 위)에 배치
    {
      key: 'name',
      label: '템플릿 명',
      required: true,
      control: <Input width="100%" placeholder="템플릿 명을 입력해주세요." />,
    },
    {
      key: 'type',
      label: '템플릿 유형',
      control: <Select width="100%" options={MSG_TYPES} defaultValue="common" />,
    },
    {
      key: 'target',
      label: '안내 대상',
      control: <Select width="100%" options={MSG_TARGETS} defaultValue="applicant" />,
    },
    {
      key: 'method',
      label: '전형 안내 방법',
      control: (
        <Select
          width="100%"
          multiple
          options={COMPOSE_METHODS}
          value={methods}
          onChange={(e) => setMethods(e.target.value)}
          placeholder="전형 안내 방법을 선택하세요"
        />
      ),
    },
  ];

  return (
    <Modal
      open={open}
      onClose={close}
      title="메세지 템플릿 생성"
      size="2xl"
      placement="top"
      cancelText="취소"
      confirmText="저장"
      onConfirm={close}
    >
      <div className="flex flex-col gap-spacing-9">
        <FormTemplate columns={2} columnGap={16} rowGap={16} labelSize="14" fields={fields} />
        <NoticeWritingTemplate
          mergeFields={NOTICE_MERGE_FIELDS}
          enabledChannels={methods}
          showAttach={false}
          editorPlaceholder="메시지 내용을 입력하세요."
          editorMinHeight={360}
        />
      </div>
    </Modal>
  );
}

// ───────── 모달 5: 평가항목 및 항목별 척도 설정 (툴바 + 선택 테이블) ─────────
// titleSpan: 공고명 셀 세로 병합 — 그룹 첫 행에 행 수, 나머지 행은 0(위 셀에 병합)
const EVAL_ROWS = [
  { id: 1, title: '정승욱의 키워드블라인드 전용 채용 절대아무도건들지마라 - 공고', titleSpan: 3, field: '식품', status: 'done' },
  { id: 2, titleSpan: 0, field: '신입', status: 'done' },
  { id: 3, titleSpan: 0, field: '자판기관리', status: 'none' },
  { id: 4, title: '2026 상반기 신입·경력 공개채용 - 공고', titleSpan: 2, field: '마케팅', status: 'done' },
  { id: 5, titleSpan: 0, field: '영업관리', status: 'none' },
];

function EvalSettingsModal({ open, onClose }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const close = () => {
    setSelectedIds([]);
    onClose();
  };
  const columns = [
    {
      key: 'title',
      label: '공고명(2개)',
      // 공고 그룹별 세로 병합 — 데이터의 titleSpan(첫 행=행 수, 나머지=0) 그대로 사용. width 미지정=fill
      cellSpan: (row) => row.titleSpan,
      render: (row) => <span className="whitespace-normal break-words text-14">{row.title}</span>,
    },
    {
      key: 'field',
      label: '채용 분야',
      render: (row) => (
        <div className="flex items-center gap-spacing-5">
          <span>{row.field}</span>
          {row.status === 'done' ? <Tag color="blue">설정 완료</Tag> : <Tag color="red">미설정</Tag>}
        </div>
      ),
    },
    {
      key: 'evalItems',
      label: '평가 항목',
      width: 90,
      render: () => (
        <Button variant="underline" size="32" rightIcon={ChevronRight}>
          설정
        </Button>
      ),
    },
    {
      key: 'questions',
      label: '구조화 질문',
      width: 90,
      render: () => (
        <Button variant="underline" size="32" rightIcon={ChevronRight}>
          설정
        </Button>
      ),
    },
  ];
  return (
    <Modal
      open={open}
      onClose={close}
      title="평가항목 및 항목별 척도 설정"
      size="2xl"
      placement="top"
      showCancel={false}
      confirmText="닫기"
      onConfirm={close}
    >
      {/* TableTemplate 한 방 조립 — 좌 actions(복사/붙여넣기/삭제) + 우 rightActions(지난 설정 불러오기) */}
      <TableTemplate
        columns={columns}
        rows={EVAL_ROWS}
        bordered={false}
        selectable
        selectedIds={selectedIds}
        onSelectChange={setSelectedIds}
        searchable={false}
        pagination={false}
        actions={({ selectedIds: ids }) => (
          <>
            {/* 순서 규칙(list-page.md): 삭제 → 추가 → 복사 → 붙여넣기 */}
            <Button variant="line" rightIcon={ChevronDown} disabled={ids.length === 0}>
              삭제
            </Button>
            <Button variant="line" rightIcon={ChevronDown} disabled={ids.length === 0}>
              복사
            </Button>
            <Button variant="line" disabled>
              붙여넣기
            </Button>
          </>
        )}
        rightActions={<Button variant="line">지난 설정 불러오기</Button>}
      />
    </Modal>
  );
}

// ── 항목 추가 모달 — 코드 입력(Input+추가) + 순서/명칭 테이블(TableTemplate, 페이지네이션) ──
// 기본 제공 항목(base)은 회색 표기 + 수정/삭제 비활성, 사용자가 추가한 항목만 연필(인라인 수정)·휴지통(삭제) 활성.
const ITEM_BASE_NAMES = ['수시', '공채', '상시', '특별채용', '추천채용', '마이다스인', '마이다스아이티'];

function ItemAddModal({ open, onClose }) {
  const [items, setItems] = useState(() => [
    ...ITEM_BASE_NAMES.map((name, i) => ({ id: `base-${i}`, name, base: true })),
    // 페이지네이션 데모용 사용자 항목(총 25개)
    ...Array.from({ length: 18 }, (_, i) => ({ id: `seed-${i}`, name: `사용자 추가 항목 ${i + 8}`, base: false })),
  ]);
  const [draft, setDraft] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const addItem = () => {
    const name = draft.trim();
    if (!name) return;
    setItems((prev) => [...prev, { id: `item-${Date.now()}`, name, base: false }]);
    setDraft('');
  };
  const removeItem = (id) => setItems((prev) => prev.filter((it) => it.id !== id));
  const startEdit = (row) => {
    setEditingId(row.id);
    setEditText(row.name);
  };
  const commitEdit = () => {
    setItems((prev) => prev.map((it) => (it.id === editingId ? { ...it, name: editText.trim() || it.name } : it)));
    setEditingId(null);
  };

  const rows = items.map((it, i) => ({ ...it, order: i + 1 }));
  const columns = [
    {
      key: 'order',
      label: '순서',
      width: 60,
      render: (row) => <span className="text-font-icon-3">{row.order}</span>,
    },
    {
      key: 'name',
      label: '명칭',
      render: (row) =>
        editingId === row.id ? (
          <Input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            width="100%"
            inputProps={{
              autoFocus: true,
              onBlur: commitEdit,
              onKeyDown: (e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  commitEdit();
                }
              },
            }}
          />
        ) : (
          <span className={row.base ? 'text-font-icon-3' : ''}>{row.name}</span>
        ),
    },
    {
      key: 'actions',
      label: '',
      // 아이콘 전용 셀 — 임의 폭 대신 "좌우 패딩 + 버튼 2개 + 간격" 합산(size 32 → 92px)
      width: iconCellWidth(2, { buttonSize: 32 }),
      render: (row) => (
        <div className="flex items-center justify-end gap-spacing-5">
          <Button variant="ghost" size="32" icon={Pencil} aria-label="수정" disabled={row.base} onClick={() => startEdit(row)} />
          <Button variant="ghost" size="32" icon={Trash2} aria-label="삭제" disabled={row.base} onClick={() => removeItem(row.id)} />
        </div>
      ),
    },
  ];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="항목 추가"
      size="lg"
      placement="top"
      cancelText="취소"
      confirmText="확인"
      onConfirm={onClose}
    >
      <div className="flex flex-col gap-spacing-6">
        {/* 코드 입력 + 추가 — Input(fill) 오른쪽에 line 버튼 */}
        <div className="flex items-center gap-spacing-5">
          <div className="min-w-0 flex-1">
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="채용 분야 코드를 입력하세요"
              width="100%"
              inputProps={{
                onKeyDown: (e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addItem();
                  }
                },
              }}
            />
          </div>
          <Button variant="line" leftIcon={Plus} onClick={addItem}>
            추가
          </Button>
        </div>
        {/* 순서/명칭 목록 — 외곽선 없는 테이블 + 페이지네이션(10행, 행 수 셀렉트 없음) */}
        <TableTemplate
          columns={columns}
          rows={rows}
          bordered={false}
          searchable={false}
          pagination
          defaultPageSize={10}
          showPageSize={false}
          showTotal
          minWidth={0}
        />
      </div>
    </Modal>
  );
}

// ───────── 모달: 채용 분야 설정 (JobPositionTemplate 조립) ─────────
const POS_CRITERIA = [
  { value: 'region', label: '지역' },
  { value: 'employ', label: '고용형태' },
  { value: 'career', label: '경력' },
  { value: 'job', label: '직무' },
];
const POS_VALUES = {
  region: [
    { value: 'seoul', label: '서울' },
    { value: 'busan', label: '부산' },
    { value: 'remote', label: '재택' },
  ],
  employ: [
    { value: 'regular', label: '정규직' },
    { value: 'contract', label: '계약직' },
  ],
  career: [
    { value: 'new', label: '신입' },
    { value: 'exp', label: '경력' },
  ],
  job: [
    { value: 'fe', label: '프론트엔드' },
    { value: 'be', label: '백엔드' },
    { value: 'design', label: '디자인' },
    { value: 'ios', label: 'iOS' },
    { value: 'android', label: '안드로이드' },
    { value: 'data', label: '데이터 엔지니어' },
    { value: 'ml', label: '머신러닝' },
    { value: 'pm', label: '프로덕트 매니저' },
    { value: 'marketing', label: '마케팅' },
    { value: 'sales', label: '영업' },
  ],
};

// Jobda 직군/직무 매칭 샘플 — 직군 선택 후 그 직군의 직무만 선택 가능(종속)
const POS_JOBDA_GROUPS = [
  { value: 'dev', label: '개발' },
  { value: 'design', label: '디자인' },
  { value: 'mkt', label: '마케팅' },
];
const POS_JOBDA_DUTIES = {
  dev: [
    { value: 'fe', label: '프론트엔드 개발자' },
    { value: 'be', label: '서버 개발자' },
  ],
  design: [
    { value: 'ux', label: 'UX 디자이너' },
    { value: 'ui', label: 'UI/GUI 디자이너' },
  ],
  mkt: [
    { value: 'perf', label: '퍼포먼스 마케터' },
    { value: 'content', label: '콘텐츠 마케터' },
  ],
};

function JobPositionModal({ open, onClose, onRegisterCode }) {
  const templateRef = useRef(null);
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="채용 분야 설정"
      size="4xl"
      cancelText="취소"
      confirmText="저장"
      onConfirm={() => {
        if (!templateRef.current?.validate()) return; // 빈 칩 있으면 저장 중단(에러 툴팁)
        onClose(); // 실무에선 templateRef.current.getRows()로 저장 API 호출
      }}
    >
      <JobPositionTemplate
        ref={templateRef}
        criteriaOptions={POS_CRITERIA}
        valueOptions={POS_VALUES}
        jobdaGroupOptions={POS_JOBDA_GROUPS}
        jobdaDutyOptions={POS_JOBDA_DUTIES}
        tableHeight={370}
        onRegisterCode={onRegisterCode}
      />
    </Modal>
  );
}

export function ModalTestPage() {
  const [bgOpen, setBgOpen] = useState(false);
  const [posOpen, setPosOpen] = useState(false);
  const [selOpen, setSelOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [composeOpen, setComposeOpen] = useState(false);
  const [evalOpen, setEvalOpen] = useState(false);
  const [msgOpen, setMsgOpen] = useState(false);
  const [itemOpen, setItemOpen] = useState(false);
  const [codeOpen, setCodeOpen] = useState(false);
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
        <Button variant="fill" onClick={() => setComposeOpen(true)}>
          안내 및 발표 작성 모달 열기
        </Button>
        <Button variant="fill" onClick={() => setItemOpen(true)}>
          항목 추가 모달 열기
        </Button>
        <Button variant="fill" onClick={() => setCodeOpen(true)}>
          채용 코드 생성 모달 열기
        </Button>
        <Button variant="fill" onClick={() => setEvalOpen(true)}>
          평가항목 설정 모달 열기
        </Button>
        <Button variant="fill" onClick={() => setMsgOpen(true)}>
          메세지 템플릿 생성 모달 열기
        </Button>
        <Button variant="fill" onClick={() => setPosOpen(true)}>
          채용 분야 설정 모달 열기
        </Button>
      </div>
      <BackgroundModal open={bgOpen} onClose={() => setBgOpen(false)} />
      <SelectionModal open={selOpen} onClose={() => setSelOpen(false)} />
      <NoticeModal open={noticeOpen} onClose={() => setNoticeOpen(false)} />
      <ComposeModal open={composeOpen} onClose={() => setComposeOpen(false)} />
      <ItemAddModal open={itemOpen} onClose={() => setItemOpen(false)} />
      <CodeCreateModal open={codeOpen} onClose={() => setCodeOpen(false)} />
      <EvalSettingsModal open={evalOpen} onClose={() => setEvalOpen(false)} />
      <MessageTemplateModal open={msgOpen} onClose={() => setMsgOpen(false)} />
      <JobPositionModal open={posOpen} onClose={() => setPosOpen(false)} onRegisterCode={() => setCodeOpen(true)} />
    </section>
  );
}
