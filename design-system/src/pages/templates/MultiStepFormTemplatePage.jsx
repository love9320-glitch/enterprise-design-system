// Multi-step Form Template 데모 (Figma "multi-step form Template" 9249:4529, step=1/2/3)
// 템플릿은 Stepper + 현재 스텝 콘텐츠 슬롯만 소유하고, 스텝 단계·하단 폼은 전부 주입한다(커스텀 가능).
// 데모 3스텝은 Figma 변형 그대로: ①고객사 발신정보 폼 ②발송 대상자 업로드 테이블 ③내용 검토 및 발송.
import { useRef, useState } from 'react';
import { Download, Plus } from 'lucide-react';
import { MultiStepFormTemplate } from '../../templates/MultiStepFormTemplate';
import { FormTemplateB } from '../../templates/FormTemplateB';
import { TableTemplate } from '../../templates/TableTemplate';
import { Field } from '../../components/Field';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { DateField } from '../../components/DateField';
import { TextArea } from '../../components/TextArea';
import { Button } from '../../components/Button';
import { Tag } from '../../components/Tag';
import { Divider } from '../../components/Divider';
import { Checkbox } from '../../components/Checkbox';
import { Popover } from '../../components/Popover';
import { useHoverTooltip } from '../../components/useHoverTooltip';
import { FileUploadButton } from '../../components/FileUploadButton';
import { PopoverMenu } from '../../components/PopoverMenu';
import { List } from '../../components/List';
import { ListGroup } from '../../components/ListGroup';
import { UsageExample } from '../../components/UsageExample';

// 옵션 컨트롤 래퍼 — 다른 템플릿 데모(FormTemplatePage)와 동일 패턴
function OptionControl({ label, children }) {
  return (
    <div className="flex items-center gap-spacing-5">
      <span className="text-12 text-font-icon-3">{label}</span>
      {children}
    </div>
  );
}

const USAGE = `import { MultiStepFormTemplate } from '../../templates/MultiStepFormTemplate';

// 스텝 단계(개수·타이틀·설명)와 각 스텝의 하단 콘텐츠는 전부 주입한다 — 3단계는 예시일 뿐 제한 없음
<MultiStepFormTemplate
  defaultValue="sender"
  steps={[
    { value: 'sender', title: 'Step 1. 고객사 발신정보 입력', description: '발송 회사, 발송 방식을 선택하세요.',
      content: <FormTemplateB subtitle="Step 1. 고객사 발신정보 입력" cells={...} /> },
    { value: 'targets', title: 'Step 2. 발송 대상자 업로드', description: '발송 대상자 파일을 업로드하세요.',
      content: <FormTemplateB subtitle="Step 2. 발송 대상자 업로드" cells={...} /> },
    { value: 'review', title: 'Step 3. 내용 검토 및 발송', description: '내용 확인 후 발송하세요.',
      content: <FormTemplateB cells={...} /> },
  ]}
/>

// 순차 강제 플로우 — 스테퍼 클릭 이동을 끄고 외부 버튼으로 제어(controlled)
<MultiStepFormTemplate clickableSteps={false} value={step} onChange={setStep} steps={...} />

// 스텝을 오가도 입력 상태 보존 — 비활성 스텝을 hidden으로 유지
<MultiStepFormTemplate keepMounted steps={...} />`;

const USAGE_PROPS = [
  { name: 'steps', type: '{ value?, title, description?, disabled?, content }[]', default: '[]', desc: '스텝 정의 — Stepper 항목(타이틀·설명) + 그 스텝의 하단 콘텐츠(content). 개수 제한 없음' },
  { name: 'value / defaultValue', type: 'string | number', default: '첫 스텝', desc: '현재 스텝(item.value 또는 인덱스) — controlled / uncontrolled' },
  { name: 'onChange', type: '(value, index) => void', default: '—', desc: '스텝 변경 콜백(Stepper 클릭 시)' },
  { name: 'clickableSteps', type: 'boolean', default: 'true', desc: 'Stepper 클릭으로 스텝 이동 — 순차 강제 플로우면 false로 끄고 외부에서 value 제어' },
  { name: 'keepMounted', type: 'boolean', default: 'false', desc: '비활성 스텝 콘텐츠를 hidden으로 유지 — 스텝을 오가도 입력 상태 보존' },
  { name: 'className', type: 'string', default: "''", desc: '추가 클래스' },
];

// ── Step 1 — 고객사 발신정보 폼 ──────────────────────────────────────
const CLIENT_OPTIONS = [
  { value: 'midas', label: '마이다스아이티' },
  { value: 'jain', label: '자인원' },
];
const METHOD_OPTIONS = [
  { value: 'both', label: '이메일+문자 (EMS/LMS)' },
  { value: 'email', label: '이메일' },
  { value: 'sms', label: '문자' },
];
// 발신 이메일 — 인증 여부를 메뉴 행 우측 태그로 표시(Select 옵션 rightSlot, 2026-08-06)
// 미인증 태그는 hover 시 경고 툴팁(포털·자동반전 — useHoverTooltip 공용 훅)
const EMAIL_AUTH_TOOLTIP =
  '메일 발신 도메인 인증이 완료되지 않으면 대형 포털·기업 메일함에서 스팸 처리될 수 있습니다.';

function EmailAuthTag({ approved }) {
  const t = useHoverTooltip(approved ? null : EMAIL_AUTH_TOOLTIP);
  return (
    <>
      <Tag color={approved ? 'blue' : 'gray'} onMouseEnter={t.onMouseEnter} onMouseLeave={t.onMouseLeave}>
        {approved ? '인증' : '미인증'}
      </Tag>
      {t.tooltip}
    </>
  );
}

const SENDER_EMAILS = [
  { value: 'hr', label: 'midasHR@midasit.com', approved: true },
  { value: 'recruit', label: 'recruit@midasit.com', approved: true },
  { value: 'notice', label: 'notice@midasit.com', approved: true },
  { value: 'support', label: 'support@midasit.com', approved: true },
  { value: 'career', label: 'career@midasit.com', approved: false },
  { value: 'contact', label: 'contact@midasit.com', approved: true },
  { value: 'admin', label: 'admin@midasit.com', approved: false },
  { value: 'info', label: 'info@midasit.com', approved: false },
];
const SENDER_EMAIL_OPTIONS = SENDER_EMAILS.map(({ value, label, approved }) => ({
  value,
  label,
  rightSlot: <EmailAuthTag approved={approved} />,
}));
// 발신 번호 — 인증 여부를 메뉴 행 우측 태그로 표시(rightSlot, 2026-08-06)
const SENDER_PHONES = [
  { value: 'p1', label: '010-1234-1234', verified: true },
  { value: 'p2', label: '010-2345-2345', verified: true },
  { value: 'p3', label: '010-3456-3456', verified: true },
  { value: 'p4', label: '010-4567-4567', verified: false },
  { value: 'p5', label: '010-5678-5678', verified: true },
  { value: 'p6', label: '010-6789-6789', verified: false },
  { value: 'p7', label: '02-1234-5678', verified: true },
  { value: 'p8', label: '031-123-4567', verified: false },
];
const SENDER_PHONE_OPTIONS = SENDER_PHONES.map(({ value, label, verified }) => ({
  value,
  label,
  rightSlot: <Tag color={verified ? 'blue' : 'gray'}>{verified ? '인증' : '미인증'}</Tag>,
}));
const SMS_TYPE_OPTIONS = [
  { value: 'auto', label: 'SMS / LMS 자동' },
  { value: 'sms', label: 'SMS' },
  { value: 'lms', label: 'LMS' },
];

// 매핑 코드 목록·버튼 — 대량 발송 페이지와 동일 패턴(+ 아이콘 목록 팝오버, 검색창 없음)
const MAPPING_CODES = ['{이름}', '{이메일}', '{공고명}', '{분야명}'];

function MappingCodeButton({ onInsert }) {
  return (
    <Popover
      placement="auto-right"
      trigger={
        <Button variant="line" leftIcon={Plus}>
          매핑 코드 추가
        </Button>
      }
    >
      {(close) => (
        <PopoverMenu width="100%">
          <ListGroup>
            {MAPPING_CODES.map((code) => (
              <List
                key={code}
                icon={Plus}
                title={code}
                onClick={() => {
                  onInsert?.(code);
                  close();
                }}
              />
            ))}
          </ListGroup>
        </PopoverMenu>
      )}
    </Popover>
  );
}

// 테스트 발송 버튼 — 이메일/휴대폰 입력 + [취소 | 테스트 발송] 반반 푸터 팝오버(대량 발송 페이지와 동일)
function TestSendButton() {
  return (
    <Popover placement="auto-right" menuWidth={280} trigger={<Button variant="line">테스트 발송</Button>}>
      {(close) => (
        <PopoverMenu
          width="100%"
          footer
          footerButtonsFill
          cancelText="취소"
          onCancel={close}
          confirmText="테스트 발송"
          onConfirm={close}
        >
          <div className="flex w-full flex-col gap-spacing-5 bg-list-group-bg p-spacing-5">
            <Input width="100%" placeholder="이메일 주소 입력" inputProps={{ inputMode: 'email' }} />
            <Input width="100%" placeholder="핸드폰 번호 입력" inputProps={{ inputMode: 'tel' }} />
          </div>
        </PopoverMenu>
      )}
    </Popover>
  );
}

// 커서 위치에 코드 삽입 — 선택 영역을 대체하고 커서를 삽입 코드 뒤로(포커스 복원).
// 이벤트 시점 호출 시그니처(렌더 중 팩토리 호출은 react-compiler ref 접근 판정 — 규칙 20 판례)
const insertAtCursor = (ref, setValue, code) => {
  const el = ref.current;
  setValue((prev) => {
    const start = el?.selectionStart ?? prev.length;
    const end = el?.selectionEnd ?? prev.length;
    const next = prev.slice(0, start) + code + prev.slice(end);
    if (el) {
      requestAnimationFrame(() => {
        el.focus();
        el.setSelectionRange(start + code.length, start + code.length);
      });
    }
    return next;
  });
};

// method(안내 방법)는 페이지가 소유 — Step 3 발송 내용 구성이 이 값을 따른다(개발 정책 2026-08-06)
function SenderStep({ method, onMethodChange }) {
  // 선택하지 않은 채널의 발신 수단은 비활성(2026-08-06 지시)
  const hasEmail = method !== 'sms';
  const hasSms = method !== 'email';
  // 발신 수단 선택값 — 비활성 시 값 대신 '미사용' 표시(placeholder), 재활성화하면 이전 선택 복원
  const [senderEmail, setSenderEmail] = useState('hr');
  const [senderPhone, setSenderPhone] = useState('p1');
  // 문자 타입별 글자수 한도(2026-08-06 지시): SMS=45 / LMS=1000 / 자동=1000(길면 LMS로 발송되는 전제)
  const [smsType, setSmsType] = useState('auto');
  const smsMaxLength = smsType === 'sms' ? 45 : 1000;
  // 매핑 코드 삽입 대상 — 이메일 버튼→내용 TextArea(2026-08-06 정정), 문자 버튼→문자 내용 TextArea
  const [emailBody, setEmailBody] = useState('');
  const [smsBody, setSmsBody] = useState('');
  const emailBodyRef = useRef(null);
  const smsBodyRef = useRef(null);
  return (
    <FormTemplateB
      subtitle="Step 1. 고객사 발신정보 입력"
      labelWidth={70}
      cells={[
        { key: 'client', label: '고객사', span: 4,
          // menuWidth=trigger — 팝오버 메뉴 폭을 셀렉트(fill 트리거) 폭에 맞춤(대량 발송 페이지와 동일)
          control: <Select variant="text" width="fill" menuWidth="trigger" options={CLIENT_OPTIONS} placeholder="고객사를 선택하세요" /> },
        { key: 'reason', label: '발송 사유', span: 4,
          control: <Input variant="transparent" width="100%" placeholder="발송 사유를 입력하세요" /> },
        { key: 'method', label: '안내 방법', span: 4,
          control: <Select variant="text" width="fill" menuWidth="trigger" options={METHOD_OPTIONS} value={method} onChange={(e) => onMethodChange(e.target.value)} /> },
        { key: 'schedule', label: '예약 발송', span: 4,
          // width=fill — 기본 폭(showTime 260)이 라벨 70을 뺀 셀 컨트롤 영역보다 넓어 셀을 넘침
          control: <DateField variant="text" width="fill" showIcon={false} showTime disablePast placeholder="발송 날짜와 시간을 선택하세요" /> },
        { key: 'senderEmail', label: '발신 이메일', span: 4, disabled: !hasEmail,
          control: <Select variant="text" width="fill" menuWidth="trigger" disabled={!hasEmail} options={SENDER_EMAIL_OPTIONS} value={hasEmail ? senderEmail : null} onChange={(e) => setSenderEmail(e.target.value)} placeholder="미사용" /> },
        { key: 'senderPhone', label: '발신 번호', span: 4, disabled: !hasSms,
          control: <Select variant="text" width="fill" menuWidth="trigger" disabled={!hasSms} options={SENDER_PHONE_OPTIONS} value={hasSms ? senderPhone : null} onChange={(e) => setSenderPhone(e.target.value)} placeholder="미사용" /> },
        // 작성 영역 — 좌(이메일) 8칸 : 우(문자) 4칸, 라벨 위 세로 Field(상단 정렬)
        { key: 'emailBody', span: 8, paddingTop: '12', paddingBottom: '20', // 상단 12(2026-08-05 지시)
          control: (
            // 라벨 색은 다른 셀 라벨과 동일한 회색(labelColor=gray, 2026-08-05 지시)
            <Field direction="vertical" label="이메일 안내문 내용" labelColor="gray" className="w-full self-start">
              <div className="flex w-full flex-col gap-spacing-5">
                {/* 제목 행 — Input fill + 매핑 코드 추가 라인 버튼(삽입은 내용 TextArea로, 대량 발송 페이지와 동일) */}
                <div className="flex w-full items-center gap-spacing-5">
                  <Input width="100%" placeholder="이메일 제목을 입력하세요" className="min-w-0 flex-1" />
                  <MappingCodeButton onInsert={(code) => insertAtCursor(emailBodyRef, setEmailBody, code)} />
                </div>
                <TextArea
                  width="100%"
                  rows={18}
                  showCount={false}
                  placeholder="이메일 내용을 입력하세요"
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  textareaProps={{ ref: emailBodyRef }}
                />
              </div>
            </Field>
          ) },
        { key: 'smsBody', span: 4, paddingTop: '12', paddingBottom: '20', // 이메일 셀과 같은 로우 — 라벨 상단 정렬 유지
          control: (
            <Field direction="vertical" label="문자 안내문 작성" labelColor="gray" className="w-full self-start">
              <div className="flex w-full flex-col gap-spacing-5">
                {/* 타입 행 — Select fill + 매핑 코드 추가 라인 버튼(제목 행과 동일 패턴) */}
                <div className="flex w-full items-center gap-spacing-5">
                  <Select width="fill" className="min-w-0 flex-1" options={SMS_TYPE_OPTIONS} value={smsType} onChange={(e) => setSmsType(e.target.value)} />
                  <MappingCodeButton onInsert={(code) => insertAtCursor(smsBodyRef, setSmsBody, code)} />
                </div>
                <TextArea
                  width="100%"
                  rows={18}
                  maxLength={smsMaxLength}
                  showCount
                  placeholder="문자 내용을 입력하세요"
                  value={smsBody}
                  onChange={(e) => setSmsBody(e.target.value)}
                  textareaProps={{ ref: smsBodyRef }}
                />
              </div>
            </Field>
          ) },
      ]}
    />
  );
}

// ── Step 2 — 발송 대상자 업로드 테이블 ───────────────────────────────
const TARGET_STATUS_TAG = { '발송 가능': 'blue', '정보 누락': 'red' };
const TARGET_ROWS = Array.from({ length: 100 }, (_, i) => {
  const missing = i % 17 === 2; // 일부 행만 정보 누락
  return {
    id: i + 1,
    no: i + 1,
    posting: '2019 하반기 신입 공채(2019 하반기 신입 공채)',
    job: '경기도 · 판매 · 데이터 분석',
    manager: '권구선',
    email: missing ? '-' : 'midasin@midasin.com',
    phone: missing ? '-' : '010-1234-1234',
    status: missing ? '정보 누락' : '발송 가능',
  };
});
const TARGET_COLUMNS = [
  { key: 'no', label: '순번', width: 66 },
  { key: 'posting', label: '공고명' },
  { key: 'job', label: '직무 분야', width: 200 },
  { key: 'manager', label: '담당자', width: 90 },
  { key: 'email', label: '이메일 주소', width: 180 },
  { key: 'phone', label: '휴대폰 번호', width: 130 },
  { key: 'status', label: '상태', width: 90,
    render: (row) => <Tag color={TARGET_STATUS_TAG[row.status]}>{row.status}</Tag> },
];

function TargetsStep() {
  // 개발 정책(2026-08-06): 업로드 전에는 데이터가 없으므로 테이블 엠티 가이드가 노출돼야 한다
  // — 빈 상태로 시작, 양식 다운로드 타입 팝오버에서 파일 선택 시 채워지는 흐름 재현(keepMounted로 유지)
  const [rows, setRows] = useState([]);
  const [files, setFiles] = useState([]);
  return (
    <FormTemplateB
      subtitle="Step 2. 발송 대상자 업로드"
      cells={[
        { key: 'targets', span: 12, paddingTop: '20', paddingBottom: '20',
          control: (
            <TableTemplate
              className="w-full min-w-0"
              columns={TARGET_COLUMNS}
              searchWidth={280}
              searchPlaceholder="이름, 이메일, 전화번호로 검색"
              rows={rows}
              rowKey="id"
              actions={
                <>
                  <FileUploadButton
                  triggerText="발송 대상자 업로드"
                  files={files}
                  maxCount={1}
                  accept=".xlsx,.xls"
                  guide="양식을 내려받아 대상자 정보를 작성한 뒤 업로드하세요. (.xlsx, 1개)"
                  onTemplateDownload={() => {}}
                  menuWidth={320}
                  buttonProps={{ variant: 'fill' }}
                  onAdd={(list) => {
                    const f = list[0];
                    if (!f) return;
                    setFiles([{ name: f.name, size: Math.round(f.size / 1e6) }]);
                    setRows(TARGET_ROWS); // 데모 — 파일 선택 시 대상자 목록 채움
                  }}
                  onDelete={() => setFiles([])}
                />
                  <Button variant="line" leftIcon={Download}>
                    확인필요 대상 다운로드
                  </Button>
                </>
              }
              searchable
              pagination
              emptyMessage="발송 대상자를 업로드하면 목록이 표시됩니다."
            />
          ) },
      ]}
    />
  );
}

// ── Step 3 — 내용 검토 및 발송 ───────────────────────────────────────
const REVIEW_FIELDS = [
  { key: 'client', label: '고객사', value: '마이다스아이티' },
  { key: 'sentAt', label: '발송 시점', value: '26.05.15 (00:01)' },
  { key: 'method', label: '안내 방법', value: '이메일 + 문자' },
  { key: 'targets', label: '발송 대상', value: '999,999명' },
  { key: 'count', label: '예상 발송 건수', value: '999,999건' },
  { key: 'cost', label: '예상 발송 비용', value: '약 1,500,000원' },
];

const EMAIL_BODY = `안녕하세요, {고객명}님.
마이다스아이티에서 안내드립니다.
귀하의 라이선스 갱신 기간이 다가오고 있습니다.
현재 이용 중인 서비스의 원활한 사용을 위해, 아래 내용을 확인해 주시기 바랍니다.

갱신 대상: {제품명}
갱신 만료일: 2026.01.31
갱신 비용: {금액}원 (VAT 별도)

갱신을 원하시는 경우, 아래 버튼을 클릭하여 절차를 진행해 주세요.
문의사항이 있으시면 담당자({담당자명}, {연락처})에게 연락 부탁드립니다.

감사합니다.
마이다스아이티 드림`;

const SMS_BODY = `안녕하세요, {고객명}님.
마이다스아이티에서 안내드립니다.
귀하의 라이선스 갱신 기간이 다가오고 있습니다.
현재 이용 중인 서비스의 원활한 사용을 위해, 아래 내용을 확인해 주시기 바랍니다.`;

// 검토 라벨/값 블록 — 상세 페이지 구조 마크업 관례(발송 이력 상세와 동일 패턴)
function ContentBlock({ label, children }) {
  return (
    <div className="flex flex-col gap-spacing-3">
      <div className="text-14 text-font-icon-3">{label}</div>
      <div className="whitespace-pre-line text-14 text-font-icon-5">{children}</div>
    </div>
  );
}

// 안내 방법 → 검토 화면 표기
const METHOD_LABEL = { both: '이메일 + 문자', email: '이메일', sms: '문자' };

function ReviewStep({ method }) {
  // 개발 정책(2026-08-06): 채널 조건부 — 둘 다=이메일 8칸+문자 4칸 / 단일 채널=전체 폭(span 12)
  const hasEmail = method !== 'sms';
  const hasSms = method !== 'email';
  const reviewFields = REVIEW_FIELDS.map((f) => (f.key === 'method' ? { ...f, value: METHOD_LABEL[method] } : f));

  const emailCell = { key: 'email', span: hasSms ? 8 : 12, paddingTop: '20', paddingBottom: '20',
    control: (
      <div className="flex w-full flex-col gap-spacing-7 self-start">
        <ContentBlock label="이메일 주소">MidasHR@midasit.com</ContentBlock>
        <Divider />
        <ContentBlock label="이메일 내용">{EMAIL_BODY}</ContentBlock>
      </div>
    ) };
  const smsCell = { key: 'sms', span: hasEmail ? 4 : 12, paddingTop: '20', paddingBottom: '20',
    control: (
      <div className="flex w-full flex-col gap-spacing-7 self-start">
        <ContentBlock label="발신 번호">010-1234-1234</ContentBlock>
        <Divider />
        <ContentBlock label="문자 내용">{SMS_BODY}</ContentBlock>
      </div>
    ) };

  return (
    <FormTemplateB
      labelWidth={100}
      cells={[
        // 타이틀 로우 — 우측 '테스트 발송' 버튼이 있어 subtitle 대신 trailing 셀로 구성
        { key: 'title', span: 12,
          control: <span className="text-14 font-semibold text-font-icon-5">Step 3. 내용 검토 및 발송</span>,
          trailing: <TestSendButton /> },
        ...reviewFields.map((f) => ({
          key: f.key,
          label: f.label,
          span: 4,
          control: <Input variant="transparent" width="100%" readOnly value={f.value} />,
        })),
        ...(hasEmail ? [emailCell] : []),
        ...(hasSms ? [smsCell] : []),
      ]}
    />
  );
}

export function MultiStepFormTemplatePage() {
  const [clickableSteps, setClickableSteps] = useState(true);
  const [keepMounted, setKeepMounted] = useState(true);
  // 안내 방법(Step 1에서 선택) — Step 3 발송 내용 구성이 실시간으로 따라간다(개발 정책 데모)
  const [method, setMethod] = useState('both');

  const steps = [
    { value: 'sender', title: 'Step 1. 고객사 발신정보 입력', description: '발송 회사, 발송 방식을 선택하세요.',
      content: <SenderStep method={method} onMethodChange={setMethod} /> },
    { value: 'targets', title: 'Step 2. 발송 대상자 업로드', description: '발송 대상자 파일을 업로드하세요.',
      content: <TargetsStep /> },
    { value: 'review', title: 'Step 3. 내용 검토 및 발송', description: '내용 확인 후 발송하세요.',
      content: <ReviewStep method={method} /> },
  ];

  return (
    <section className="py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-20 font-semibold text-font-icon-5">Multi-step Form Template</h2>
      <p className="mb-spacing-9 text-14 text-font-icon-4">
        상단 <span className="text-font-icon-5">Stepper(line type)</span>와 스텝별 하단 콘텐츠를 묶은 멀티 스텝 폼
        템플릿입니다. 스텝 단계(개수·타이틀·설명)와 하단 폼은 <span className="text-font-icon-5">전부 주입</span>하는
        슬롯 구조라 자유롭게 커스텀할 수 있습니다. 데모는 Figma 변형 그대로 발신정보 폼 → 대상자 업로드 →
        검토·발송 3단계이며, 스테퍼의 스텝을 눌러 이동해 볼 수 있습니다.
      </p>

      <UsageExample code={USAGE} props={USAGE_PROPS} />

      <h4 className="mb-spacing-5 text-14 font-semibold text-font-icon-5">Playground — 스텝 이동 · 상태 보존</h4>
      <div className="flex flex-col gap-spacing-7">
        <div className="flex flex-wrap items-center gap-x-spacing-9 gap-y-spacing-5 rounded-round-4 border border-base-gray-100 p-spacing-7">
          <OptionControl label="옵션">
            <div className="flex items-center gap-spacing-7">
              <Checkbox checked={clickableSteps} onChange={() => setClickableSteps((s) => !s)} label="스텝 클릭 이동(clickableSteps)" />
              <Checkbox checked={keepMounted} onChange={() => setKeepMounted((s) => !s)} label="입력 상태 보존(keepMounted)" />
            </div>
          </OptionControl>
        </div>

        <div className="rounded-round-5 border border-base-gray-100 bg-white p-spacing-8">
          <MultiStepFormTemplate
            key={String(keepMounted)} // keepMounted 전환 시 리마운트(마운트 전략 변경)
            steps={steps}
            clickableSteps={clickableSteps}
            keepMounted={keepMounted}
          />
        </div>
      </div>
    </section>
  );
}
