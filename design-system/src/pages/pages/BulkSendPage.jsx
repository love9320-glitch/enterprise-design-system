// 대량 메일/문자 발송 페이지 (Figma page 9241:35403) — '페이지' 카테고리 실전 예제.
// 규칙 4 조립: Page(타이틀 + 이전/다음 단계 버튼) 셸 + MultiStepFormTemplate(3스텝).
// 도메인 세부 기능은 이 페이지가 소유한다(템플릿은 구조만 — 2026-08-06 합의):
//   - 헤더 이전/다음 단계 버튼으로 스텝 진행(마지막 스텝은 '발송'), 스테퍼 클릭 이동도 허용
//   - 발송 개발 정책(2026-08-06): ① 업로드 전 대상자 테이블은 빈 상태 = 엠티 가이드 노출
//     ② 채널(안내 방법) 조건부 — 이메일+문자=8:4, 단일 채널=전체 폭(작성·검토 모두)
//   - keepMounted로 스텝을 오가도 입력 상태 보존
import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Download, Plus } from 'lucide-react';
import { Page } from '../../layouts/Page';
import { ConfirmModal } from '../../components/Modal';
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
import { Popover } from '../../components/Popover';
import { useHoverTooltip } from '../../components/useHoverTooltip';
import { FileUploadButton } from '../../components/FileUploadButton';
import { PopoverMenu } from '../../components/PopoverMenu';
import { List } from '../../components/List';
import { ListGroup } from '../../components/ListGroup';

// ── 공통 옵션 ────────────────────────────────────────────────────────
const CLIENT_OPTIONS = [
  { value: 'midas', label: '마이다스아이티' },
  { value: 'jain', label: '자인원' },
];
const METHOD_OPTIONS = [
  { value: 'both', label: '이메일+문자 (SMS/LMS)' },
  { value: 'email', label: '이메일' },
  { value: 'sms', label: '문자' },
];
const METHOD_LABEL = { both: '이메일 + 문자', email: '이메일', sms: '문자' };
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

// 매핑 코드 목록 — 안내문에 삽입할 치환 필드(데모: 클릭 시 닫힘만, 실서비스에서 커서 삽입 연결)
const MAPPING_CODES = ['{이름}', '{이메일}', '{공고명}', '{분야명}'];

// 매핑 코드 추가 버튼 — 클릭 시 + 아이콘 목록 팝오버(Editor 머지필드 메뉴 패턴, 검색창 없음 — 2026-08-06 지시)
// onInsert(code): 항목 클릭 시 대상 입력란에 코드 삽입(머지 필드 텍스트 태그)
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

// 테스트 발송 버튼 — 이메일/휴대폰 입력 + [취소 | 테스트 발송] 반반 푸터 팝오버(2026-08-06 지시)
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

// ── Step 1 — 고객사 발신정보 입력 (채널 조건부: 단일 채널이면 그 작성 영역이 전체 폭) ──
function SenderStep({ method, onMethodChange }) {
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

  const emailWriteCell = { key: 'emailBody', span: hasSms ? 8 : 12, paddingTop: '12', paddingBottom: '20',
    control: (
      <Field direction="vertical" label="이메일 안내문 작성" labelColor="gray" className="w-full self-start">
        <div className="flex w-full flex-col gap-spacing-5">
          {/* 제목 행 — Input fill + 매핑 코드 추가 라인 버튼(2026-08-06 지시, 삽입은 내용 TextArea로) */}
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
    ) };
  const smsWriteCell = { key: 'smsBody', span: hasEmail ? 4 : 12, paddingTop: '12', paddingBottom: '20',
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
    ) };

  return (
    <FormTemplateB
      subtitle="Step 1. 고객사 발신정보 입력"
      labelWidth={70}
      cells={[
        { key: 'client', label: '고객사', span: 4,
          // menuWidth=trigger — 팝오버 메뉴 폭을 셀렉트(fill 트리거) 폭에 맞춤(2026-08-06 지시)
          control: <Select variant="text" width="fill" menuWidth="trigger" options={CLIENT_OPTIONS} placeholder="고객사를 선택하세요" /> },
        { key: 'reason', label: '발송 사유', span: 4,
          control: <Input variant="transparent" width="100%" placeholder="발송 사유를 입력하세요" /> },
        { key: 'method', label: '안내 방법', span: 4,
          control: <Select variant="text" width="fill" menuWidth="trigger" options={METHOD_OPTIONS} value={method} onChange={(e) => onMethodChange(e.target.value)} /> },
        { key: 'schedule', label: '예약 발송', span: 4,
          control: <DateField variant="text" width="fill" showIcon={false} showTime disablePast placeholder="발송 날짜와 시간을 선택하세요" /> },
        { key: 'senderEmail', label: '발신 이메일', span: 4, disabled: !hasEmail,
          control: <Select variant="text" width="fill" menuWidth="trigger" disabled={!hasEmail} options={SENDER_EMAIL_OPTIONS} value={hasEmail ? senderEmail : null} onChange={(e) => setSenderEmail(e.target.value)} placeholder="미사용" /> },
        { key: 'senderPhone', label: '발신 번호', span: 4, disabled: !hasSms,
          control: <Select variant="text" width="fill" menuWidth="trigger" disabled={!hasSms} options={SENDER_PHONE_OPTIONS} value={hasSms ? senderPhone : null} onChange={(e) => setSenderPhone(e.target.value)} placeholder="미사용" /> },
        ...(hasEmail ? [emailWriteCell] : []),
        ...(hasSms ? [smsWriteCell] : []),
      ]}
    />
  );
}

// ── Step 2 — 발송 대상자 업로드 (정책 ①: 업로드 전 빈 상태 = 엠티 가이드) ────────────
const TARGET_STATUS_TAG = { '발송 가능': 'blue', '정보 누락': 'red' };
const TARGET_ROWS = Array.from({ length: 100 }, (_, i) => {
  const missing = i % 17 === 2;
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

function TargetsStep({ rows, onUpload }) {
  // 업로드된 엑셀 파일(1개) — 양식 다운로드 타입 팝오버(2026-08-06 지시, JobPositionTemplate 판례)
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
                    onUpload(); // 데모 — 파일 선택 시 대상자 목록 채움
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

// ── Step 3 — 내용 검토 및 발송 (정책 ②: 채널 조건부 레이아웃) ─────────────────────
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

function ContentBlock({ label, children }) {
  return (
    <div className="flex flex-col gap-spacing-3">
      <div className="text-14 text-font-icon-3">{label}</div>
      <div className="whitespace-pre-line text-14 text-font-icon-5">{children}</div>
    </div>
  );
}

function ReviewStep({ method, targetCount }) {
  const hasEmail = method !== 'sms';
  const hasSms = method !== 'email';

  const reviewFields = [
    { key: 'client', label: '고객사', value: '마이다스아이티' },
    { key: 'sentAt', label: '발송 시점', value: '26.05.15 (00:01)' },
    { key: 'method', label: '안내 방법', value: METHOD_LABEL[method] },
    { key: 'targets', label: '발송 대상', value: `${targetCount.toLocaleString()}명` },
    { key: 'count', label: '예상 발송 건수', value: `${(targetCount * ((hasEmail ? 1 : 0) + (hasSms ? 1 : 0))).toLocaleString()}건` },
    { key: 'cost', label: '예상 발송 비용', value: hasSms ? `약 ${(targetCount * 15).toLocaleString()}원` : '무료' },
  ];

  const emailCell = { key: 'email', span: hasSms ? 8 : 12, paddingTop: '20', paddingBottom: '20',
    control: (
      <div className="flex w-full flex-col gap-spacing-7 self-start">
        <ContentBlock label="이메일 주소">midasHR@midasit.com</ContentBlock>
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

// ── 페이지 루트 — 헤더 이전/다음 버튼 + 스테퍼로 스텝 진행 ─────────────────────────
const STEP_META = [
  { value: 'sender', title: 'Step 1. 고객사 발신정보 입력', description: '발송 회사, 발송 방식을 선택하세요.' },
  { value: 'targets', title: 'Step 2. 발송 대상자 업로드', description: '발송 대상자 정보를 업로드하세요.' },
  { value: 'review', title: 'Step 3. 내용 검토 및 발송', description: '발송 내용을 확인 후 발송하세요.' },
];

export function BulkSendPage() {
  const [stepIndex, setStepIndex] = useState(0);
  const [method, setMethod] = useState('both'); // 안내 방법 — 작성·검토 채널 구성이 따라감(정책 ②)
  const [targetRows, setTargetRows] = useState([]); // 업로드 전 빈 상태(정책 ①) — 페이지가 소유해 스텝 무관 유지
  const [confirmOpen, setConfirmOpen] = useState(false); // 예약 발송 확인 모달(2026-08-06 지시)
  const isLast = stepIndex === STEP_META.length - 1;

  const steps = STEP_META.map((meta, i) => ({
    ...meta,
    content:
      i === 0 ? (
        <SenderStep method={method} onMethodChange={setMethod} />
      ) : i === 1 ? (
        <TargetsStep rows={targetRows} onUpload={() => setTargetRows(TARGET_ROWS)} />
      ) : (
        <ReviewStep method={method} targetCount={targetRows.length} />
      ),
  }));

  return (
    <Page
      title="대량 메일/문자 발송"
      stickyHeader
      actions={
        <>
          {stepIndex > 0 && (
            <Button variant="line" leftIcon={ChevronLeft} onClick={() => setStepIndex((i) => i - 1)}>
              이전 단계
            </Button>
          )}
          {/* 마지막 스텝 '예약 발송' — 재확인 체크 컨펌 모달을 거친다(실서비스에서 발송 처리 연결) */}
          <Button
            variant="fill"
            rightIcon={isLast ? undefined : ChevronRight}
            onClick={isLast ? () => setConfirmOpen(true) : () => setStepIndex((i) => i + 1)}
          >
            {isLast ? '예약 발송' : '다음 단계'}
          </Button>
        </>
      }
    >
      <MultiStepFormTemplate
        steps={steps}
        value={STEP_META[stepIndex].value}
        onChange={(_, index) => setStepIndex(index)}
        keepMounted
      />

      {/* 예약 발송 컨펌 — 체크해야 발송 활성(ConfirmModal requireCheck 기본) */}
      <ConfirmModal
        open={confirmOpen}
        title="예약 발송"
        description={
          <>
            이 발송의 책임자로서 발송을 승인합니다.
            <br />
            발송 결과는 감사 증빙을 위해 3년간 보관됩니다.
          </>
        }
        checkboxLabel="내용을 최종 확인했습니다."
        confirmText="발송"
        onConfirm={() => setConfirmOpen(false)}
        onClose={() => setConfirmOpen(false)}
      />
    </Page>
  );
}
