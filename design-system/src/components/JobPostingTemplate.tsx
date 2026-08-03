// JobPostingTemplate — 채용 공고 설정 템플릿 (Figma "job posting template" 8618:42724, state=empty/fill)
// 조립(규칙 4): FormTemplateB(공고 폼, mixed) + Modal(채용 분야 등록 = JobPositionTemplate) + Table.
// 다중 공고(2026-07-28 지시): 타이틀 우측 [공고 추가]를 누르면 회색 박스 안에 공고 입력 폼이
// 하나 더 생긴다(맨 위에 추가). 각 공고는 자기 폼 값·채용 분야 행을 독립으로 갖는다.
// 흐름: 폼의 [채용 분야 등록] 클릭 → 모달에서 기준·값 입력 후 저장 → 그 공고 폼 아래 테이블로
// 들어온다(fill state). 재오픈 시 등록된 행 유지(교체 저장, 사용 스위치 보존).
// 색은 job-posting-template/* 시멘틱 토큰만 사용(default-out-bg 등).
// 타이틀은 DS Label 컴포넌트(size 14) — Figma에서 외부 DS 요소를 로컬 label 인스턴스로
// 교체(2026-08-03)한 것과 1:1. title-text 토큰은 미사용(Figma 변수 미러로만 유지).
import { useRef, useState } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { DatabaseArrowDown, Plus, Trash2 } from 'lucide-react';
import { FormTemplateB } from './FormTemplateB';
import { Input } from './Input';
import { Select, SelectChip } from './Select';
import type { TableColumn } from './Table';
import { Table } from './Table';
import { DateField } from './DateField';
import { Checkbox } from './Checkbox';
import { Switch } from './Switch';
import { Button } from './Button';
import { Label } from './Label';
import { Modal } from './Modal';
import { JobPositionTemplate } from './JobPositionTemplate';
import type { JobPositionTemplateHandle } from './JobPositionTemplate';
import { iconCellWidth } from './tableView';
import { useHoverTooltip } from './useHoverTooltip';

// 잠긴 컨트롤 hover 사유 툴팁 — disabled 버튼은 이벤트가 안 나가므로 감싼 span에서 감지
// (JobPositionTemplate의 LockTooltipWrap과 동일 패턴). reason=null이면 비활성.
function LockTooltipWrap({ reason, children }: { reason: ReactNode; children: ReactNode }) {
  const tip = useHoverTooltip(reason);
  return (
    <span className="block h-full w-full" onMouseEnter={tip.onMouseEnter} onMouseLeave={tip.onMouseLeave}>
      {children}
      {tip.tooltip}
    </span>
  );
}

interface JobOption {
  value: string;
  label: string;
}

// 등록된 채용 분야 행 — JobPositionTemplate.getRows() 결과 + 사용 여부
export interface JobPostingRow {
  id: string;
  items: { criteria: string; value: string | string[] }[];
  jobdaGroup?: string;
  jobdaDuty?: string;
  enabled?: boolean; // 사용 스위치 — 기본 true
}

// 공고 폼 값
export interface JobPostingForm {
  name: string;
  jobType: string;
  period: { start: Date | null; end: Date | null };
  noDeadline: boolean;
}

// 공고 한 건 — 폼 값 + 등록된 채용 분야
export interface JobPosting {
  id: string;
  seq?: number; // 생성 순번 — '공고명 N.' 라벨(추가/삭제돼도 고정, 2026-07-28 지시)
  form: JobPostingForm;
  rows: JobPostingRow[];
}

// 공고 id — JobPositionTemplate 행 id와 같은 이유(HMR·리마운트 충돌 방지)로 시간+랜덤 조합
const newPostingId = () =>
  `posting-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
const emptyPosting = (seq: number): JobPosting => ({
  id: newPostingId(),
  seq,
  form: { name: '', jobType: '', period: { start: null, end: null }, noDeadline: false },
  rows: [],
});

interface JobPostingTemplateProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title' | 'onChange'> {
  title?: ReactNode; // 상단 타이틀 — null이면 숨김(공고 추가 버튼 포함)
  jobTypeOptions?: JobOption[]; // 채용구분 옵션
  // 채용 분야 등록 모달(JobPositionTemplate) 패스스루
  criteriaOptions?: JobOption[];
  valueOptions?: Record<string, JobOption[]>;
  jobdaGroupOptions?: JobOption[];
  jobdaDutyOptions?: Record<string, JobOption[]>;
  onRegisterCode?: () => void; // 모달 안 '채용 분야 코드 등록' 버튼
  onTemplateDownload?: () => void; // 모달 안 엑셀 양식 다운로드
  modalTitle?: ReactNode; // 채용 분야 등록 모달 타이틀
  modalSize?: '2xl' | '3xl' | '4xl' | 'fill';
  // 공고 목록(controlled/uncontrolled) — 폼 값·채용 분야 행 포함 전체 스냅샷 반출
  postings?: JobPosting[];
  defaultPostings?: JobPosting[];
  onChange?: (postings: JobPosting[]) => void;
  addPostingLabel?: ReactNode; // 타이틀 우측 '공고 추가' 버튼 문구(ghost·아이콘 텍스트형)
  loadPostingLabel?: ReactNode; // 공고 추가 오른쪽 '생성된 공고 불러오기' 버튼 문구(같은 스타일)
  onLoadPosting?: () => void; // '생성된 공고 불러오기' 클릭(불러오기 UI는 소비자 몫)
  onAddPosting?: (id: string) => void; // 공고 추가 후 알림(추가는 템플릿이 수행)
  onDeletePosting?: (id: string) => void; // 공고 삭제 후 알림(삭제는 템플릿이 수행)
}

export function JobPostingTemplate({
  title = '채용 공고 설정',
  jobTypeOptions = [],
  criteriaOptions = [],
  valueOptions = {},
  jobdaGroupOptions = [],
  jobdaDutyOptions = {},
  onRegisterCode,
  onTemplateDownload,
  modalTitle = '채용 분야 등록',
  modalSize = '3xl', // 4xl → 한 단계 축소(2026-07-28 지시)
  postings: postingsProp,
  defaultPostings,
  onChange,
  addPostingLabel = '공고 추가',
  loadPostingLabel = '생성된 공고 불러오기',
  onLoadPosting,
  onAddPosting,
  onDeletePosting,
  className = '',
  ...props
}: JobPostingTemplateProps) {
  // 공고 목록 — controlled/uncontrolled. 기본 빈 공고 1개로 시작.
  const controlled = postingsProp !== undefined;
  const [internalPostings, setInternalPostings] = useState<JobPosting[]>(
    () => defaultPostings ?? [emptyPosting(1)],
  );
  const postings = controlled ? (postingsProp as JobPosting[]) : internalPostings;
  const applyPostings = (next: JobPosting[]) => {
    if (!controlled) setInternalPostings(next);
    onChange?.(next);
  };
  const patchPosting = (id: string, patch: Partial<JobPosting>) =>
    applyPostings(postings.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  // 공고 추가 — 맨 위에 빈 폼 추가(2026-07-28 지시). 순번은 생성 순 고정(기존 최대 +1)
  const addPosting = () => {
    const fresh = emptyPosting(Math.max(0, ...postings.map((p) => p.seq ?? 0)) + 1);
    applyPostings([fresh, ...postings]);
    onAddPosting?.(fresh.id);
  };
  // 공고 삭제 — 마지막 하나는 버튼 disabled로 차단(최소 1개 유지, 2026-07-28 지시)
  const deletePosting = (id: string) => {
    if (postings.length === 1) return; // 안전 가드(버튼 disabled와 이중)
    applyPostings(postings.filter((p) => p.id !== id));
    onDeletePosting?.(id);
  };

  // 채용 분야 등록 모달 — 어느 공고의 모달인지 id로 추적
  const [modalPostingId, setModalPostingId] = useState<string | null>(null);
  const modalPosting = postings.find((p) => p.id === modalPostingId) ?? null;
  const templateRef = useRef<JobPositionTemplateHandle | null>(null);

  const criteriaLabel = (v: string) => criteriaOptions.find((o) => o.value === v)?.label ?? v;
  const valueLabel = (criteria: string, v: string) =>
    (valueOptions[criteria] ?? []).find((o) => o.value === v)?.label ?? v;
  // 행의 조합 라벨 — "서울 - 정규직 - 신입 - 프론트엔드" (다중 값은 ,로 병기)
  const comboLabel = (row: JobPostingRow) =>
    row.items
      .map((it) =>
        Array.isArray(it.value)
          ? it.value.map((v) => valueLabel(it.criteria, v)).join(', ')
          : valueLabel(it.criteria, it.value),
      )
      .filter(Boolean)
      .join(' - ');

  // 공고별 채용 분야 테이블 컬럼 — 행 편집(jobda·사용·삭제)은 그 공고의 rows에만 반영
  const buildColumns = (posting: JobPosting): TableColumn[] => {
    const patchRow = (rowId: string, patch: Partial<JobPostingRow>) =>
      patchPosting(posting.id, {
        rows: posting.rows.map((r) => (r.id === rowId ? { ...r, ...patch } : r)),
      });
    const headerCriteria = posting.rows[0]?.items.map((it) => criteriaLabel(it.criteria)).join(' - ');
    return [
      // width 계산(규칙 17 정신) — 패딩 20 + grip 16 + gap 6 + 텍스트 21 = 63(JobPositionTemplate 순서 셀과 동일)
      { key: 'orderNo', label: '순서', width: 63 },
      { key: 'combo', label: headerCriteria ? `채용 직무 (${headerCriteria})` : '채용 직무' },
      {
        key: 'jobda',
        label: 'jobda 직군/직무 매칭',
        width: 320,
        // 직군 → 직무 종속 선택(JobPositionTemplate과 동일 패턴) — 직군 변경 시 직무 리셋
        render: (r) => {
          const row = r as unknown as JobPostingRow;
          return (
            <div className="flex min-w-0 items-center gap-spacing-3">
              <SelectChip
                options={jobdaGroupOptions}
                value={row.jobdaGroup || null}
                placeholder="직군 선택"
                onChange={(e) => patchRow(row.id, { jobdaGroup: e.target.value as string, jobdaDuty: '' })}
              />
              <SelectChip
                options={jobdaDutyOptions[row.jobdaGroup ?? ''] ?? []}
                value={row.jobdaDuty || null}
                placeholder="직무 선택"
                disabled={!row.jobdaGroup}
                onChange={(e) => patchRow(row.id, { jobdaDuty: e.target.value as string })}
              />
            </div>
          );
        },
      },
      {
        key: 'enabled',
        label: '사용', // 헤더는 다른 컬럼과 같이 좌측 정렬 — 본문(스위치)만 중앙(2026-07-28 지적)
        width: 64,
        render: (r) => {
          const row = r as unknown as JobPostingRow;
          return (
            <div className="flex w-full justify-center">
              <Switch
                checked={row.enabled !== false}
                onChange={(e) => patchRow(row.id, { enabled: e.target.checked })}
              />
            </div>
          );
        },
      },
      {
        key: 'delete',
        label: '삭제',
        width: iconCellWidth(1, { buttonSize: 32 }),
        render: (r) => {
          const row = r as unknown as JobPostingRow;
          return (
            <div className="flex w-full justify-center">
              <Button
                variant="ghost"
                size="32"
                icon={Trash2}
                aria-label="삭제"
                onClick={() =>
                  patchPosting(posting.id, { rows: posting.rows.filter((x) => x.id !== row.id) })
                }
              />
            </div>
          );
        },
      },
    ];
  };

  // 공고 한 건의 폼(+fill state 테이블) 셀 구성 — index는 seq 없는 데이터의 폴백 순번용
  const postingCells = (posting: JobPosting, index: number) => {
    const { form, rows } = posting;
    const patchForm = (patch: Partial<JobPostingForm>) =>
      patchPosting(posting.id, { form: { ...form, ...patch } });
    const displayRows = rows.map((r, i) => ({ ...r, orderNo: i + 1, combo: comboLabel(r) }));
    return [
      {
        key: 'name',
        // 생성 순번 고정(2026-07-28 지시) — 새 공고가 위에 추가돼도 아래(먼저 만든) 공고가 "공고명 1."
        // seq 없는 외부 데이터는 아래에서부터 1..n 폴백
        label: `공고명 ${posting.seq ?? postings.length - index}.`,
        span: 8,
        control: (
          <Input
            variant="transparent"
            width="100%"
            value={form.name}
            onChange={(e) => patchForm({ name: e.target.value })}
            placeholder="공고명을 입력하세요"
          />
        ),
      },
      {
        key: 'jobType',
        label: '채용구분',
        span: 4,
        control: (
          <Select
            variant="text"
            width="fill" // 셀 전체 폭(2026-07-28 재지시 — hug에서 원복)
            options={jobTypeOptions}
            value={form.jobType}
            onChange={(e) => patchForm({ jobType: e.target.value as string })}
            placeholder="채용 구분을 선택하세요"
          />
        ),
      },
      {
        key: 'period',
        label: '채용기간',
        span: 8,
        control: (
          <DateField
            variant="text"
            mode="range"
            showTime
            disablePast // 지난 날짜 선택 불가(2026-07-28 지시)
            value={form.period}
            onChange={(v) => patchForm({ period: v as JobPostingForm['period'] })}
          />
        ),
        trailing: (
          <Checkbox
            label="마감일 없음"
            checked={form.noDeadline}
            onChange={(e) => patchForm({ noDeadline: e.target.checked })}
          />
        ),
      },
      {
        key: 'register',
        span: 2,
        flush: true,
        control: (
          <Button variant="ghost" area leftIcon={Plus} onClick={() => setModalPostingId(posting.id)}>
            채용 분야 등록
          </Button>
        ),
      },
      {
        key: 'delete',
        span: 2,
        flush: true,
        control: (
          // 공고가 하나만 남으면 삭제 비활성(2026-07-28 지시) — 최소 1개 폼 유지, hover 시 사유 툴팁
          <LockTooltipWrap
            reason={postings.length === 1 ? '공고가 하나 남았을 때는 삭제할 수 없습니다.' : null}
          >
            <Button
              variant="ghost"
              area
              leftIcon={Trash2}
              disabled={postings.length === 1}
              onClick={() => deletePosting(posting.id)}
            >
              공고 삭제
            </Button>
          </LockTooltipWrap>
        ),
      },
      // fill state — 등록된 채용 분야 테이블은 폼 박스 '안'의 전체 폭 셀로 들어간다
      // (Figma 8704:18557 구조 — 별도 형제 배치 아님, 2026-07-28 지적 반영)
      ...(rows.length > 0
        ? [
            {
              key: 'positions',
              span: 12,
              control: (
                <div className="w-full min-w-0">
                  <Table
                    columns={buildColumns(posting)}
                    rows={displayRows}
                    rowKey="id"
                    bordered
                    draggableRows
                    dragHandleColKey="orderNo" // grip을 순서 셀 안에(Figma fill state 그대로)
                    rowDragLabel={(r) => (r as { combo?: string }).combo || '채용 직무'}
                    // 재정렬된 표시 행을 id로 원본에 되매핑 — 순서 번호는 렌더 파생이라 자동 재계산
                    onRowsReorder={(next) =>
                      patchPosting(posting.id, {
                        rows: next
                          .map((d) => rows.find((r) => r.id === (d as { id: string }).id))
                          .filter((r): r is JobPostingRow => !!r),
                      })
                    }
                  />
                </div>
              ),
            },
          ]
        : []),
    ];
  };

  return (
    <div className={`flex flex-col gap-spacing-4 ${className}`} {...props}>
      {title != null && (
        <div className="flex min-h-[24px] items-center justify-between gap-spacing-5">
          <Label size="14">{title}</Label>
          {/* 타이틀 우측 — [공고 추가 | 생성된 공고 불러오기] ghost 아이콘 텍스트형(2026-07-28 지시) */}
          <div className="flex items-center gap-spacing-5">
            <Button variant="ghost" leftIcon={Plus} onClick={addPosting}>
              {addPostingLabel}
            </Button>
            <Button variant="ghost" leftIcon={DatabaseArrowDown} onClick={onLoadPosting}>
              {loadPostingLabel}
            </Button>
          </div>
        </div>
      )}

      {/* 회색 아우터 박스 — 공고 폼 목록(mixed, 최신이 위) + 각 폼의 채용 분야 테이블(fill state) */}
      <div className="flex flex-col gap-spacing-6 rounded-round-4 bg-job-posting-template-default-out-bg p-spacing-6">
        {postings.map((p, i) => (
          <FormTemplateB
            key={p.id}
            labelWidth={60} // 폼 라벨 영역 폭 통일(2026-07-28 지시) — 컨트롤 시작점 정렬
            cells={postingCells(p, i)}
          />
        ))}
      </div>

      {/* 채용 분야 등록 모달 — 열린 공고의 행으로 시딩, 저장은 그 공고에 '교체' 반영 */}
      <Modal
        open={modalPosting != null}
        onClose={() => setModalPostingId(null)}
        title={modalTitle}
        size={modalSize}
        cancelText="취소"
        confirmText="저장"
        onConfirm={() => {
          if (!modalPosting || !templateRef.current?.validate()) return; // 미입력 안내(에러 툴팁)
          // 모달을 현재 행으로 시딩했으므로 저장은 '교체' — 기존 행은 id로 사용 스위치 상태를 보존
          const saved = templateRef.current.getRows().map((r) => ({
            ...r,
            enabled: modalPosting.rows.find((x) => x.id === r.id)?.enabled ?? true,
          }));
          patchPosting(modalPosting.id, { rows: saved });
          setModalPostingId(null);
        }}
      >
        {modalPosting != null && (
          <JobPositionTemplate
            ref={templateRef}
            // 재오픈 시 등록된 채용 분야 유지(2026-07-28 지시) — 열 때마다 리마운트되며 그 공고 행으로 시작
            defaultRows={modalPosting.rows}
            criteriaOptions={criteriaOptions}
            valueOptions={valueOptions}
            jobdaGroupOptions={jobdaGroupOptions}
            jobdaDutyOptions={jobdaDutyOptions}
            tableHeight={370}
            onRegisterCode={onRegisterCode}
            onTemplateDownload={onTemplateDownload}
          />
        )}
      </Modal>
    </div>
  );
}
