// 발송 이력 페이지 (Figma 목록 9244:57078 · 상세 9244:55921) — '페이지' 카테고리 실전 예제.
// 규칙 4 조립: Page(헤더+바디 슬롯) 셸 위에
//   목록 = TableTemplate(actions=SegmentControlGroup 상태 필터 + 검색 + Tag 상태 컬럼 + 페이지네이션)
//   상세 = FormTemplateB(title="발송 정보", 마지막 셀에 TableTemplate 삽입 — 셀별 패딩 20 오버라이드)
//        + FormTemplateB(title="발송 내용", 8:4 커스텀 텍스트 셀 — 라벨/값+Divider 구조 마크업)
// 행 클릭 → 상세, 상세 헤더 '발송 목록으로' → 목록 복귀(내부 view 상태).
// 날짜 표기는 utils/datetime(formatDateTime) 경유(규칙 10), 재발송 아이콘 셀 폭은 iconCellWidth(규칙 17).
import { useMemo, useState } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { ArrowLeft, Download, Mail, Send } from 'lucide-react';
import { Page } from '@gusun/design-system';
import { Button } from '@gusun/design-system';
import { TableTemplate } from '@gusun/design-system';
import { SegmentControlGroup } from '@gusun/design-system';
import { Tag } from '@gusun/design-system';
import { Divider } from '@gusun/design-system';
import { TruncatingText } from '@gusun/design-system';
import { Input } from '@gusun/design-system';
import { FormTemplateB } from '@gusun/design-system';
import type { FormTemplateBCell, TableTemplateColumn } from '@gusun/design-system';
import { iconCellWidth } from '@gusun/design-system';
import { formatDateTime } from '@gusun/design-system';
import { useNav } from '../../navContext';

// ── 목록 데모 데이터 — 상태 분포는 결정적으로 생성(순번 내림차순, 최신이 위) ──────────
type TagColor = ComponentProps<typeof Tag>['color'];

const STATUS_TAG: Record<string, TagColor> = {
  발송중: 'green',
  대기: 'gray',
  완료: 'blue',
  '일부 실패': 'orange',
  실패: 'red',
};
const STATUSES = Object.keys(STATUS_TAG);

const REASONS = [
  '2026 하계 인턴십 서류 합격 안내',
  '채용 일정 변경 안내',
  '최종 합격 및 입사 안내',
  '라이선스 갱신 기간 안내',
  '점검에 따른 서비스 일시 중단 안내',
];
const CLIENTS = ['마이다스아이티', '자인원', '마이다스인'];

const LIST_ROWS = Array.from({ length: 100 }, (_, i) => {
  // 분포(2026-08-05 지시): 발송중 2% · 대기 5% · 실패 2% · 일부 실패 8% · 완료 83%
  const status = i < 2 ? '발송중' : i < 7 ? '대기' : i < 9 ? '실패' : i < 17 ? '일부 실패' : '완료';
  const no = 100 - i;
  const sentAt = new Date(2026, 7, 10 - Math.floor(i / 10), 9, 0); // 8월 10일부터 하루씩 과거로
  const reservedAt = new Date(2026, 7, 12, 0, i + 1); // 대기 행의 발송 예약 시간
  // 안내방법 혼합(개발 정책 2026-08-06) — 이메일+문자 / 이메일만 / 문자만 케이스가 모두 존재
  const method = i % 7 === 3 ? '이메일' : i % 7 === 5 ? '문자' : '이메일, 문자';
  return {
    id: no,
    no,
    status,
    client: CLIENTS[i % CLIENTS.length],
    reason: REASONS[i % REASONS.length],
    method,
    total: '999,999건',
    success: status === '대기' ? '-' : '444,444건',
    fail: status === '완료' ? '0건' : status === '대기' ? '-' : '444,444건',
    resend: `${i % 3}회`,
    // 대기=예약 시간, 발송중=진행률, 그 외=실제 발송 일시 — 표기는 규칙 10 표준 포맷(datetime 유틸)
    sentAtLabel:
      status === '발송중'
        ? '발송 중 (62%)'
        : status === '대기'
          ? formatDateTime(reservedAt, reservedAt)
          : formatDateTime(sentAt, sentAt),
  };
});

// 컬럼 정의는 상수 배열로 — 발송 사유만 가변(fill), 나머지는 Figma 폭
const LIST_COLUMNS: TableTemplateColumn[] = [
  { key: 'no', label: '순번', width: 66 },
  { key: 'status', label: '상태', width: 77, render: (row: any) => <Tag color={STATUS_TAG[String(row.status)]}>{String(row.status)}</Tag> },
  { key: 'client', label: '고객사', width: 160 },
  { key: 'reason', label: '발송 사유' },
  { key: 'method', label: '안내방법', width: 90 },
  { key: 'total', label: '대상', width: 90 },
  { key: 'success', label: '성공', width: 90 },
  { key: 'fail', label: '실패', width: 90 },
  { key: 'resend', label: '재발송', width: 60 },
  { key: 'sentAtLabel', label: '발송 일시', width: 140 }, // 160→140(2026-08-05 지시)
];

// ── 상세 데모 데이터 — 이메일/문자 발송 결과(실패는 사유 동반), 실패 행만 재발송 활성 ──
const EMAIL_FAIL_REASON = '수신 서버에서 발송 요청을 거절했습니다.';
const SMS_FAIL_REASON = '발신번호 일일 한도 초과';

const DETAIL_ROWS = Array.from({ length: 100 }, (_, i) => {
  const emailFail = i % 7 === 1; // 결정적 분포 — 일부 행만 실패
  const smsFail = i % 5 === 4;
  return {
    id: i + 1,
    no: i + 1,
    name: '권구선',
    emailFail,
    smsFail,
    sentAt: formatDateTime(new Date(2026, 4, 15, 0, 0), new Date(2026, 4, 15, 0, 0)),
  };
});

// 발송 결과 셀 — 성공/실패 Tag + (실패 시) 사유 텍스트
function ResultCell({ fail, reason }: { fail: boolean; reason: string }) {
  return (
    <div className="flex min-w-0 items-center gap-spacing-5">
      <Tag color={fail ? 'red' : 'blue'}>{fail ? '실패' : '성공'}</Tag>
      {fail && <span className="truncate">{reason}</span>}
    </div>
  );
}

// 대상자 테이블 컬럼 — 채널 조건부(개발 정책 2026-08-06): 발송하지 않은 채널의 결과 컬럼은 제외,
// 재발송 활성도 발송한 채널의 실패만 본다. 이메일/문자 결과·발송시각은 width 미지정 = 가변(fill)
const buildDetailColumns = (hasEmail: boolean, hasSms: boolean): TableTemplateColumn[] => [
  { key: 'no', label: '순번', width: 66 },
  { key: 'name', label: '이름', width: 80 },
  ...(hasEmail
    ? ([{ key: 'emailResult', label: '이메일 발송 결과', render: (row: any) => <ResultCell fail={!!row.emailFail} reason={EMAIL_FAIL_REASON} /> }] satisfies TableTemplateColumn[])
    : []),
  ...(hasSms
    ? ([{ key: 'smsResult', label: '문자 발송 결과', render: (row: any) => <ResultCell fail={!!row.smsFail} reason={SMS_FAIL_REASON} /> }] satisfies TableTemplateColumn[])
    : []),
  { key: 'sentAt', label: '발송시각' },
  {
    key: 'resend',
    label: '재발송',
    width: iconCellWidth(1, { buttonSize: 32 }), // 규칙 17 — ghost 32 버튼 단독 셀
    render: (row: any) => (
      <Button
        variant="ghost"
        size="32"
        icon={Send}
        disabled={!((hasEmail && !!row.emailFail) || (hasSms && !!row.smsFail))}
        tooltip="재발송"
      />
    ),
  },
];

// 상세 '발송 정보' 필드 — 상수 배열 정의 후 셀로 매핑
// 발송사유는 페이지 헤더 타이틀로 노출(셀 제거, 2026-08-06 지시) · 고객사는 클릭한 행 값 우선
const DEFAULT_REASON = '채용 일정 변경 안내';
const INFO_FIELDS = [
  { key: 'client', label: '고객사', span: 4, value: '마이다스아이티' },
  { key: 'sentAt', label: '발송 시점', span: 4, value: formatDateTime(new Date(2026, 4, 15, 0, 1), new Date(2026, 4, 15, 0, 1)) },
  { key: 'method', label: '안내 방법', span: 4, value: '이메일 + 문자' },
  { key: 'total', label: '전체 발송', span: 4, value: '999,999건' },
  { key: 'success', label: '발송 성공', span: 4, value: '999,999건' },
  { key: 'fail', label: '발송 실패', span: 4, value: '2,614건' },
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

// 발송 내용 라벨/값 블록 — 상세 페이지 구조 마크업(전용 DS 컴포넌트 없음, detail-page 규칙 허용 범위)
function ContentBlock({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-spacing-3">
      <div className="text-14 text-font-icon-3">{label}</div>
      <div className="whitespace-pre-line text-14 text-font-icon-5">{children}</div>
    </div>
  );
}

// ── 목록 뷰 ──────────────────────────────────────────────────────────
type ListRow = (typeof LIST_ROWS)[number];

function SendHistoryList({ onOpenDetail }: { onOpenDetail: (row: ListRow) => void }) {
  const [status, setStatus] = useState('all');
  const { navigate } = useNav(); // 헤더 버튼 → 대량 메일/문자 발송 페이지 이동(실제 플로우 연결)

  // 상태 필터 항목 — 건수는 데이터에서 파생
  const statusItems = useMemo(() => {
    const countOf = (s: string) => LIST_ROWS.filter((r) => r.status === s).length;
    return [
      { value: 'all', label: `전체 ${LIST_ROWS.length}` },
      ...STATUSES.map((s) => ({ value: s, label: `${s} ${countOf(s)}` })),
    ];
  }, []);

  const rows = useMemo(() => (status === 'all' ? LIST_ROWS : LIST_ROWS.filter((r) => r.status === status)), [status]);

  return (
    <Page
      title="발송 이력"
      stickyHeader // 스크롤 시 페이지 헤더 상단 고정(2026-08-05 지시)
      actions={
        <Button variant="fill" leftIcon={Mail} onClick={() => navigate('bulk-send')}>
          대량 메일/문자 발송
        </Button>
      }
    >
      <TableTemplate
        columns={LIST_COLUMNS}
        rows={rows}
        rowKey="id"
        searchWidth={280}
        searchPlaceholder="고객사, 발송사유로 검색"
        searchKeys={['client', 'reason']} // 검색 대상을 플레이스홀더 안내와 일치시킴
        actions={<SegmentControlGroup items={statusItems} value={status} onChange={(v) => setStatus(String(v))} />}
        searchable
        pagination
        defaultPageSize={20} // 발송 이력 목록은 페이지 행 20개 기본(2026-08-05 지시)
        onRowClick={(row) => onOpenDetail(row as ListRow)}
        emptyMessage="발송 이력이 없습니다."
      />
    </Page>
  );
}

// ── 상세 뷰 — row: 목록에서 클릭한 행(발송 사유·고객사·안내방법을 헤더/정보/내용에 반영) ──
function SendHistoryDetail({ row, onBack }: { row: ListRow | null; onBack: () => void }) {
  const reason = row?.reason ?? DEFAULT_REASON;
  // 채널(개발 정책 2026-08-06): 이메일+문자 / 이메일만 / 문자만 — 발송 내용 구성이 달라진다
  const method = row?.method ?? '이메일, 문자';
  const hasEmail = method.includes('이메일');
  const hasSms = method.includes('문자');
  // 행 값으로 고객사·안내 방법 덮어쓰기 — 나머지 정보는 대표 데모 값 유지
  const infoFields = INFO_FIELDS.map((f) =>
    f.key === 'client' && row?.client
      ? { ...f, value: row.client }
      : f.key === 'method'
        ? { ...f, value: method.replace(', ', ' + ') }
        : f,
  );

  // 발송 내용 셀(개발 정책): 둘 다=이메일 8칸+문자 4칸 / 단일 채널=그 채널이 전체 폭(span 12)
  const emailContentCell: FormTemplateBCell = {
    key: 'email',
    span: hasSms ? 8 : 12,
    paddingTop: '20',
    paddingBottom: '20',
    control: (
      <div className="flex w-full flex-col gap-spacing-7 self-start">
        <ContentBlock label="이메일 주소">MidasHR@midasin.com</ContentBlock>
        <Divider />
        <ContentBlock label="이메일 제목">
          현재 이용 중인 서비스의 원활한 사용을 위해, 아래 내용을 확인해 주시기 바랍니다.
        </ContentBlock>
        <Divider />
        <ContentBlock label="이메일 내용">{EMAIL_BODY}</ContentBlock>
      </div>
    ),
  };
  const smsContentCell: FormTemplateBCell = {
    key: 'sms',
    span: hasEmail ? 4 : 12,
    paddingTop: '20',
    paddingBottom: '20',
    control: (
      <div className="flex w-full flex-col gap-spacing-7 self-start">
        <ContentBlock label="발신 번호">010-1234-1234</ContentBlock>
        <Divider />
        <ContentBlock label="문자 내용">{SMS_BODY}</ContentBlock>
      </div>
    ),
  };
  const contentCells = [...(hasEmail ? [emailContentCell] : []), ...(hasSms ? [smsContentCell] : [])];
  return (
    <Page
      // 헤더에 발송 사유 표시 — 사유가 길면 말줄임+hover 툴팁(규칙 8 TruncatingText, 2026-08-06)
      title={<TruncatingText as="span" className="block">{`발송 이력 - ${reason}`}</TruncatingText>}
      stickyHeader // 스크롤 시 페이지 헤더 상단 고정(2026-08-05 지시)
      actions={
        <Button variant="line" leftIcon={ArrowLeft} onClick={onBack}>
          발송 목록으로
        </Button>
      }
    >
      {/* 발송 정보 — 폼 밖 타이틀 + 값 셀(읽기 전용 투명 Input) + 대상자 테이블 셀(패딩 20 오버라이드) */}
      <FormTemplateB
        title="발송 정보"
        labelWidth={70} // 라벨 영역 통일 — 컨트롤 시작점 정렬(2026-08-05 지시, 100→70 정정)
        cells={[
          ...infoFields.map((f) => ({
            key: f.key,
            label: f.label,
            span: f.span,
            control: <Input variant="transparent" width="100%" readOnly value={f.value} />,
          })),
          {
            key: 'targets',
            span: 12,
            paddingTop: '20',
            paddingBottom: '20',
            control: (
              <TableTemplate
                className="w-full min-w-0"
                columns={buildDetailColumns(hasEmail, hasSms)}
                rows={DETAIL_ROWS}
                rowKey="id"
                actions={
                  <>
                    <Button variant="line" leftIcon={Download}>
                      전체 대상자 다운로드
                    </Button>
                    <Button variant="line" leftIcon={Download}>
                      발송 실패 대상자 다운로드
                    </Button>
                  </>
                }
                searchable
                pagination
                emptyMessage="발송 대상자가 없습니다."
              />
            ),
          },
        ]}
      />

      {/* 섹션 구분선 — 발송 정보 ↔ 발송 내용. 위쪽이 박스 외곽선이라 좁아 보여 marginTop으로 보정(2026-08-06) */}
      <Divider marginTop="12" />

      {/* 발송 내용(개발 정책 2026-08-06) — 채널 조건부: 둘 다=이메일 8칸+문자 4칸 / 단일=전체 폭 */}
      <FormTemplateB title="발송 내용" cells={contentCells} />
    </Page>
  );
}

// ── 페이지 루트 — 목록 ↔ 상세 내부 전환 (defaultView: 초기 뷰 지정 옵션) ──────────
export function SendHistoryPage({ defaultView = 'list' }) {
  const [view, setView] = useState(defaultView); // 'list' | 'detail'

  const [detailRow, setDetailRow] = useState<ListRow | null>(null); // 목록에서 클릭한 행 — 상세 헤더·발송 정보에 반영

  return view === 'list' ? (
    <SendHistoryList
      onOpenDetail={(row) => {
        setDetailRow(row);
        setView('detail');
      }}
    />
  ) : (
    <SendHistoryDetail row={detailRow} onBack={() => setView('list')} />
  );
}
