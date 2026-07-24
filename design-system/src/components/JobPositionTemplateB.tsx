// JobPositionTemplateB — 채용 분야 설정 템플릿 B타입(2026-07-24 — A타입 복제에서 시작, 다른 UX로 디벨롭 예정)
// A타입: JobPositionTemplate.tsx (Figma "JobPositionTemplate" 8220:82935)
// Step 01(좌): ConditionOrderSlot — 조건 카드(기준 Select + 값 Select)들을 드래그 정렬·사용/미사용.
// Step 02(우): 조건 선택이 곧 테이블 반영(2026-07-23 — 미리보기 인풋·추가 버튼 제거).
//   다중(체크박스) 조건: 체크=조합 행 즉시 추가, 해제=그 조합 행 제거(다른 활성 조건이 완성일 때).
//   다중 카드 없음(multiLastValue=false): 조합이 완성되는 순간 자동 추가. 중복 조합은 조용히 건너뜀.
//   외곽선(bordered) 무한 스크롤 테이블(규칙 18), 최신이 위. 로우의 SelectChip으로 그 자리 값 변경.
// 조립(규칙 4): ConditionOrderSlot + Select + Button + Table + SelectChip — 손 구현 0.
// 작성 데이터는 onChange(rows)로 반출한다(템플릿 값 반출 계약 — 2026-07-07 감사 교훈).
import { useCallback, useContext, useEffect, useImperativeHandle, useState } from 'react';
import type { ComponentPropsWithoutRef, ReactNode, Ref } from 'react';
import { ModalBodyMaxContext, ModalFooterStartContext } from './modalContext';
import { ChevronRight, Copy, Download, Layers2, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { ConditionOrderSlot } from './ConditionOrderSlot';
import { Select, SelectChip } from './Select';
import { Button } from './Button';
import { Table } from './Table';
import type { TableColumn } from './Table';
import { iconCellWidth } from './tableView';
import { ScrollArea } from './ScrollArea';
import { FileUploadButton } from './FileUploadButton';
import type { UploadFileItem } from './FileUploadMenu';
import { useHoverTooltip } from './useHoverTooltip';

// 잠긴 컨트롤 hover 사유 툴팁 — disabled 컨트롤은 이벤트가 안 나가므로 감싼 span에서 감지.
// reason이 null이면 툴팁 비활성(감싸기만 하고 아무 동작 없음).
function LockTooltipWrap({ reason, children }: { reason: ReactNode; children: ReactNode }) {
  const tip = useHoverTooltip(reason);
  return (
    <span className="block w-full" onMouseEnter={tip.onMouseEnter} onMouseLeave={tip.onMouseLeave}>
      {children}
      {tip.tooltip}
    </span>
  );
}

// 로우 id 생성 — 모듈 카운터(let seq)는 HMR로 모듈이 재평가되면 0으로 리셋돼 기존 로우 id와
// 충돌하고, React 중복 key로 새 로우가 화면에 안 나타난다(2026-07-07 복사 미동작 원인).
// 시간+랜덤 조합으로 defaultRows·리마운트·HMR 어떤 경우에도 충돌하지 않게 한다.
const newRowId = () =>
  `row-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

// 기준 팝오버 최상단 '미사용' 옵션(2026-07-24 지시) — 선택 시 이 카드는 조합(스켈레톤)에서 제외
const UNUSED_CRITERIA = '__unused__';

// 옵션 항목 — [{ value, label }] (로우 칩에서 disabled 파생 부여)
interface JobOption {
  value: string;
  label: string;
  disabled?: boolean;
}
// 로우의 조건 항목 — { criteria, value }. 마지막 조건 칩은 체크박스 다중 선택이라
// 값이 배열일 수 있다(B타입, 2026-07-24 지시) — 표시는 라벨을 ', '로 이어 붙임.
interface JobRowItem {
  criteria: string;
  value: string | string[];
}
// 테이블 로우 — { id, items: [{ criteria, value }], jobdaGroup?, jobdaDuty? }
interface JobRow {
  id: string;
  items: JobRowItem[];
  jobdaGroup?: string; // Jobda 직군 매칭(2026-07-23) — 미선택이면 ''/undefined
  jobdaDuty?: string; // Jobda 직무 매칭 — 직군 선택 후 활성(직군 바꾸면 리셋)
}
// 카드별 (기준, 값) 선택 — 다중 카드는 값이 배열
interface JobSelection {
  criteria: string;
  value: string | string[];
}

// (선택) 저장 API(React 19 ref-as-prop) —
//   validate(): 미선택 칩에 에러 표시 + 통과 여부(false면 저장 중단)
//   getRows(): 저장 시점 최신 로우 조회('변경 없이 저장'도 안전)
export interface JobPositionTemplateBHandle {
  validate: () => boolean;
  getRows: () => JobRow[];
}

interface JobPositionTemplateBProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange'> {
  criteriaOptions?: JobOption[]; // 기준 목록 [{ value, label }] — 카드의 첫 Select(예: 지역/고용형태/경력/직무)
  valueOptions?: Record<string, JobOption[]>; // 기준별 값 목록 { [criteriaValue]: [{ value, label }] } — 카드의 둘째 Select·로우 칩 공용
  conditionCount?: number; // 조건 카드 수
  defaultRows?: JobRow[]; // 초기 로우 [{ id, items: [{ criteria, value }] }]
  onChange?: (rows: JobRow[]) => void; // 로우 추가/삭제/칩 변경 시 전체 스냅샷 반출
  pageTitle?: string; // 페이지 사용 시 액션 버튼 행 왼쪽 타이틀(모달에선 모달 타이틀 사용)
  orderLabel?: string;
  jobLabel?: string;
  manageLabel?: string;
  // Jobda 직군/직무 매칭 컬럼(2026-07-23) — 채용 분야 오른쪽. 행마다 직군·직무 SelectChip 2개.
  jobdaLabel?: string;
  jobdaGroupOptions?: JobOption[]; // 직군 목록
  jobdaDutyOptions?: Record<string, JobOption[]>; // 직군별 직무 목록 { [groupValue]: [{ value, label }] }
  jobdaGroupPlaceholder?: string;
  jobdaDutyPlaceholder?: string;
  jobdaSameLabel?: string; // Jobda 셀 우측 '상동' 버튼 문구 — 바로 위 행의 직군/직무 매칭 값 복사
  tableHeight?: number | 'fill'; // 테이블 세로 — 'fill'(내용만큼 확장, 모달 안에선 ModalBody 가용 높이 상한 → 테이블 바디 내부 스크롤) | 숫자(px 고정 상한+바디 스크롤)
  emptyMessage?: ReactNode; // 빈 상태 카피 — 기본 2줄(안내+행동 유도)
  emptyValueMessage?: string; // 저장 검증 — 미선택 칩 에러 툴팁 문구
  registerCodeLabel?: string; // Step 02 타이틀 우측 버튼 문구(엑셀 다운로드 앞)
  onRegisterCode?: () => void; // '채용 분야 코드 등록' 클릭(모달 열기 등은 소비자 몫)
  showReset?: boolean; // 타이틀 우측 line 리셋 버튼(조건·행 전체 초기화)
  resetLabel?: string;
  // Step 02 타이틀 우측 엑셀 버튼(line 32, 2026-07-23 지시) — 다운로드 동작은 소비자 연결.
  // 업로드는 FileUploadMenu 팝오버(1개 파일·엑셀만) — 파일 선택 시 onExcelUpload(file) 호출
  excelUploadLabel?: string;
  excelDownloadLabel?: string;
  excelUploadGuide?: string; // 업로드 팝오버 안내 문구(\n 줄바꿈)
  onExcelUpload?: (file: File) => void;
  onExcelDownload?: () => void;
  onReset?: () => void; // 리셋 후 알림(내부 초기화는 템플릿이 수행)
  ref?: Ref<JobPositionTemplateBHandle>; // (선택) 저장 API(React 19 ref-as-prop)
}

export function JobPositionTemplateB({
  criteriaOptions = [],
  valueOptions = {},
  conditionCount = 4,
  defaultRows = [],
  onChange,
  pageTitle = '채용 분야 설정',
  orderLabel = '순서',
  jobLabel = '채용 분야',
  manageLabel = '관리',
  jobdaLabel = 'Jobda 직군/직무 매칭',
  jobdaGroupOptions = [],
  jobdaDutyOptions = {},
  jobdaGroupPlaceholder = '직군 선택',
  jobdaDutyPlaceholder = '직무 선택',
  jobdaSameLabel = '상동',
  tableHeight = 'fill',
  emptyMessage = (
    <>
      추가된 채용 분야가 없습니다
      <br />
      조건 조합 설정에서 조건을 선택해주세요.
    </>
  ),
  emptyValueMessage = '값을 선택하세요.',
  registerCodeLabel = '채용 분야 코드 등록',
  onRegisterCode,
  showReset = true,
  resetLabel = '리셋',
  onReset,
  excelUploadLabel = '엑셀 업로드',
  excelDownloadLabel = '엑셀 다운로드',
  excelUploadGuide = '엑셀 파일 1개만 업로드할 수 있습니다.\n지원 형식: .xlsx, .xls',
  onExcelUpload,
  onExcelDownload,
  ref,
  className = '',
  ...props
}: JobPositionTemplateBProps) {
  // 모달 안이면 ModalBody 가용 높이(px) — tableHeight='fill'의 상한으로 사용
  const modalBodyMax = useContext(ModalBodyMaxContext);
  // 엑셀 업로드 파일(1개) — 팝오버 표시용. 실제 처리(파싱/전송)는 onExcelUpload(file)로 소비자 몫
  const [excelFiles, setExcelFiles] = useState<UploadFileItem[]>([]);
  // Step 01 상태 — 카드 순서/사용 여부는 ConditionOrderSlot controlled로 추적하고,
  // 카드별 (기준, 값) 선택은 템플릿이 소유한다(미리보기·추가 스냅샷 계산용).
  // B타입(2026-07-24): 드래그·사용 스위치·타이틀 없는 단순 카드 — 순서는 고정, 카드 전부 활성.
  const cardIds = Array.from({ length: conditionCount }, (_, i) => `cond-${i + 1}`);
  const [selections, setSelections] = useState<Record<string, JobSelection>>({}); // { [cardId]: { criteria } }
  const activeOrder = cardIds;

  // 다른 카드가 선택한 기준은 이 카드에서 비활성(중복 조건 방지, 2026-07-07 지시).
  const usedByOthers = (id: string) => {
    const used = new Set<string>();
    for (const pid of cardIds) {
      if (pid === id) continue;
      const c = selections[pid]?.criteria;
      if (c && c !== UNUSED_CRITERIA) used.add(c);
    }
    return used;
  };

  // Step 02 로우 — 최신이 위. onChange로 전체 스냅샷 반출.
  const [rows, setRows] = useState<JobRow[]>(defaultRows);
  const applyRows = (next: JobRow[]) => {
    setRows(next);
    onChange?.(next);
  };

  // 조합 키(순서 무관) — 로우 칩 편집 시 중복 조합 방지(wouldDuplicate)용
  const comboKey = (items: JobRowItem[]) =>
    items
      .map((it) => `${it.criteria}:${Array.isArray(it.value) ? [...it.value].sort().join(',') : it.value}`)
      .sort()
      .join('|');

  // ── B타입(2026-07-24 지시): 카드에서는 '기준'만 고르고 값은 테이블에서 고른다 ──
  // 기준을 고르는 순간 그 기준의 셀렉트 칩이 들어간 행이 테이블에 나타난다.
  //  - 스켈레톤 = 활성 카드들의 기준 목록(표시 순서). 모든 행의 items를 스켈레톤에 동기화:
  //    새 기준은 빈 칩으로 추가, 빠진 기준은 칩 제거, 재정렬은 칩 순서 반영(선택해 둔 값은 보존).
  //  - 행이 없으면 첫 행을 자동 생성, 스켈레톤이 비면 행도 비운다. 조합 추가는 행 복사로.
  const skeletonFor = (sel: Record<string, JobSelection>, ids: string[]) =>
    ids.map((cid) => sel[cid]?.criteria).filter((c): c is string => !!c && c !== UNUSED_CRITERIA);
  // 카드에서 고른 값 — 그 기준의 새/빈 칩 초기값으로 쓴다(2026-07-24 값 셀렉트 재추가)
  const cardValueOf = (sel: Record<string, JobSelection>, c: string) => {
    const entry = Object.values(sel).find((s) => s.criteria === c);
    return entry && typeof entry.value === 'string' ? entry.value : '';
  };
  const syncRowsToSkeleton = (skeleton: string[], sel: Record<string, JobSelection> = selections) => {
    if (skeleton.length === 0) {
      if (rows.length > 0) applyRows([]);
      return;
    }
    const base = rows.length > 0 ? rows : [{ id: newRowId(), items: [] as JobRowItem[] }];
    applyRows(
      base.map((r) => ({
        ...r,
        items: skeleton.map(
          (c) => r.items.find((it) => it.criteria === c) ?? { criteria: c, value: cardValueOf(sel, c) },
        ),
      })),
    );
  };

  // 순차 입력(2026-07-24 지시) — 앞 카드의 기준이 선택되기 전까지 다음 카드의 기준 셀렉트 비활성.
  // 반환: 미선택인 첫 앞 카드의 순번(1부터) / 없으면 null. 툴팁 문구의 을/를은 숫자 발음 받침 기준.
  const firstUnselectedPrev = (id: string): number | null => {
    const idx = cardIds.indexOf(id);
    for (let i = 0; i < idx; i += 1) {
      if (!selections[cardIds[i]]?.criteria) return i + 1;
    }
    return null;
  };
  const numJosa = (n: number) => ('013678'.includes(String(n % 10)) ? '을' : '를'); // 받침 있는 숫자 발음
  const criteriaLockTooltip = (n: number) => `기준${n}${numJosa(n)} 먼저 선택해주세요.`;

  // 마지막 기준 카드 판별(2026-07-24) — 스켈레톤(선택된 기준 목록)의 마지막 기준을 가진 카드.
  // 이 카드의 값 셀렉트는 체크박스(테이블 마지막 칩과 동일한 그룹 동기화)로 동작한다.
  const isLastValueCard = (criteria: string) => {
    if (!criteria || criteria === UNUSED_CRITERIA) return false;
    const skeleton = skeletonFor(selections, activeOrder);
    return skeleton.length > 0 && skeleton[skeleton.length - 1] === criteria;
  };

  // 행 칩 플레이스홀더 — "지역을 선택하세요"처럼 조건명 포함(2026-07-24 지시).
  // 을/를은 조건명 마지막 글자의 받침 유무로 선택(한글이 아니면 '을(를)').
  const chipPlaceholder = (criteria: string) => {
    const label = criteriaOptions.find((o) => o.value === criteria)?.label ?? criteria;
    const last = label.charCodeAt(label.length - 1);
    const josa =
      last >= 0xac00 && last <= 0xd7a3 ? (((last - 0xac00) % 28 > 0) ? '을' : '를') : '을(를)';
    return `${label}${josa} 선택하세요`;
  };

  const setCardCriteria = (id: string, criteria: string) => {
    const next = { ...selections, [id]: { criteria, value: '' } };
    // 미사용(비우기) 선택 시 그 뒤 카드들도 전부 리셋(2026-07-24 지시) — 순차 입력 규칙과 정합
    if (!criteria) {
      const idx = cardIds.indexOf(id);
      for (const lid of cardIds.slice(idx + 1)) next[lid] = { criteria: '', value: '' };
    }
    setSelections(next);
    syncRowsToSkeleton(skeletonFor(next, activeOrder), next);
  };
  // 카드 값 셀렉트(2026-07-24 재추가) — 고르면 그 기준의 '빈' 칩들을 이 값으로 채운다
  // (이미 값을 고른 칩은 유지 — 행별 개별 값이 우선)
  const setCardValue = (id: string, value: string) => {
    const next = { ...selections, [id]: { ...(selections[id] ?? { criteria: '' }), value } };
    setSelections(next);
    const criteria = next[id]?.criteria;
    if (!criteria || criteria === UNUSED_CRITERIA || !value) return;
    applyRows(
      rows.map((r) => ({
        ...r,
        items: r.items.map((it) =>
          it.criteria === criteria &&
          (typeof it.value === 'string' ? !it.value : it.value.length === 0)
            ? { ...it, value }
            : it,
        ),
      })),
    );
  };

  // 행 삭제 — 체크 상태는 rows에서 파생되므로, 현재 조합의 행을 지우면 왼쪽 체크도 자동 해제된다.
  const removeRow = (id: string) => applyRows(rows.filter((r) => r.id !== id));
  // 로우 복사(2026-07-07 지시) — 값을 그대로 복제하되 완전 중복을 피하도록 마지막 칩만 미선택으로.
  // 새 로우는 '추가'와 동일하게 맨 위(최대 순번)로 들어간다. 복사는 항상 새 로우를 만든다 —
  // 미완성 중복은 저장 검증(빈 칩)과 칩 편집 잠금(같은 조합 완성 불가)이 걸러준다.
  const copyRow = (row: JobRow) =>
    applyRows([
      {
        id: newRowId(),
        items: row.items.map((it, i) =>
          i === row.items.length - 1 ? { ...it, value: '' } : { ...it },
        ),
        jobdaGroup: row.jobdaGroup, // Jobda 매칭 값은 그대로 복제
        jobdaDuty: row.jobdaDuty,
      },
      ...rows,
    ]);
  // Jobda 직군/직무 매칭 값 변경(2026-07-23)
  const setRowJobda = (rowId: string, patch: Partial<Pick<JobRow, 'jobdaGroup' | 'jobdaDuty'>>) =>
    applyRows(rows.map((r) => (r.id === rowId ? { ...r, ...patch } : r)));
  // '상동' — 화면상 바로 위 행의 직군/직무 매칭 값을 그대로 복사(맨 위 행은 위가 없어 비활성)
  const copyJobdaFromAbove = (rowId: string) => {
    const idx = rows.findIndex((r) => r.id === rowId);
    if (idx <= 0) return;
    const above = rows[idx - 1];
    setRowJobda(rowId, { jobdaGroup: above.jobdaGroup, jobdaDuty: above.jobdaDuty });
  };

  // 마지막 기준 카드 체크박스(2026-07-24) — 그룹 기준은 '카드에서 선택한 앞 조건 값'이다.
  // (첫 행 앵커였을 때 버그: 서울>직무 20개 추가 후 카드에서 부산으로 바꾸면 서울 그룹이
  //  체크된 채로 보였음 — 부산 조합은 아직 없으므로 아무것도 체크되지 않아야 한다.)
  //  - 컨텍스트 = 스켈레톤의 마지막 앞 기준들 × 카드 선택 값. 앞 값이 하나라도 미선택이면 미완성(체크 없음).
  //  - 체크 = 컨텍스트와 앞 칩 값들이 일치하는 행들의 마지막 기준 값.
  //  - 확인 시: 새 체크 값 → 컨텍스트 값으로 행 추가(맨 위) / 해제 값 → 그 조합 행 제거.
  const cardLastContext = () => {
    const skeleton = skeletonFor(selections, activeOrder);
    if (skeleton.length === 0) return null;
    const last = skeleton[skeleton.length - 1];
    const prefix: JobRowItem[] = [];
    for (const c of skeleton.slice(0, -1)) {
      const v = cardValueOf(selections, c);
      if (!v) return null; // 앞 기준 값 미선택 — 컨텍스트 미완성
      prefix.push({ criteria: c, value: v });
    }
    return { last, prefix };
  };
  const matchesCardPrefix = (r: JobRow, prefix: JobRowItem[]) =>
    prefix.every((p) => {
      const it = r.items.find((x) => x.criteria === p.criteria);
      return !!it && it.value === p.value;
    });
  const cardCheckedValues = () => {
    const ctx = cardLastContext();
    if (!ctx) return [];
    return rows
      .filter((r) => matchesCardPrefix(r, ctx.prefix))
      .map((r) => {
        const it = r.items.find((x) => x.criteria === ctx.last);
        const v = it?.value;
        return typeof v === 'string' ? v : '';
      })
      .filter(Boolean);
  };
  const setCardLastMulti = (next: string[]) => {
    const ctx = cardLastContext();
    if (!ctx) return;
    const nextSet = new Set(next);
    const checked = new Set(cardCheckedValues());
    const toAdd = next.filter((v) => !checked.has(v));
    const willHaveValues = next.length > 0;
    // 해제된 값의 행 제거. 값 없는(빈 칩) 행은 — 체크 값이 하나라도 생기면 함께 정리한다
    // (기준 선택 때 만들어진 스켈레톤 잔행이 남던 문제 수정, 2026-07-24 사용자 지적)
    const kept = rows.filter((r) => {
      if (!matchesCardPrefix(r, ctx.prefix)) return true;
      const it = r.items.find((x) => x.criteria === ctx.last);
      const v = typeof it?.value === 'string' ? it.value : '';
      if (!v) return !willHaveValues; // 빈 행: 값 행이 생기면 제거, 전부 해제면 유지
      return nextSet.has(v);
    });
    const skeleton = skeletonFor(selections, activeOrder);
    const added = toAdd.map((v) => ({
      id: newRowId(),
      items: skeleton.map((c) =>
        c === ctx.last
          ? { criteria: c, value: v }
          : { criteria: c, value: cardValueOf(selections, c) },
      ),
    }));
    // 전부 해제했는데 컨텍스트에 남는 행이 없으면 빈 행 하나를 복구(테이블이 비지 않게)
    if (!willHaveValues && !kept.some((r) => matchesCardPrefix(r, ctx.prefix))) {
      added.push({
        id: newRowId(),
        items: skeleton.map((c) =>
          c === ctx.last ? { criteria: c, value: '' } : { criteria: c, value: cardValueOf(selections, c) },
        ),
      });
    }
    if (added.length === 0 && kept.length === rows.length) return;
    applyRows([...added, ...kept]); // 새 조합이 맨 위(최신이 위 규칙)
  };

  const setRowValue = (rowId: string, itemIndex: number, value: string | string[]) => {
    applyRows(
      rows.map((r) =>
        r.id === rowId
          ? { ...r, items: r.items.map((it, i) => (i === itemIndex ? { ...it, value } : it)) }
          : r,
      ),
    );
    // 값이 채워지면 해당 칩의 저장 검증 에러 해제
    setInvalidKeys((p) => {
      const key = `${rowId}:${itemIndex}`;
      if (!p.has(key)) return p;
      const next = new Set(p);
      next.delete(key);
      return next;
    });
  };

  // 저장 검증(2026-07-07 지시) — 미선택 칩(복사 직후 등)에 에러 툴팁을 걸고 저장을 막는다.
  // 소비자가 저장 버튼에서 ref.current.validate()를 호출: 통과 시 true.
  const [invalidKeys, setInvalidKeys] = useState<Set<string>>(() => new Set());

  // 전체 리셋(2026-07-23) — Step 01(순서·사용·선택)과 테이블 행을 초기 상태로 되돌린다.
  // 즉시 반영 모델에선 조건과 행이 동기이므로 한쪽만 리셋하면 어긋난다 → 함께 초기화.
  const resetAll = useCallback(() => {
    setSelections({});
    setInvalidKeys(new Set());
    setRows(defaultRows);
    onChange?.(defaultRows);
    onReset?.();
  }, [defaultRows, onChange, onReset]);
  // 모달 안에서는 액션 버튼 4종(리셋·코드 등록·다운로드·업로드)을 푸터 왼쪽으로(2026-07-24 지시).
  // 페이지에선 타이틀 우측 유지. setter 존재 = 모달 안.
  const setModalFooterStart = useContext(ModalFooterStartContext);
  const inModal = setModalFooterStart != null;
  useEffect(() => {
    if (!setModalFooterStart) return;
    setModalFooterStart(
      <div className="flex items-center gap-spacing-5">
        {showReset && (
          <Button variant="line" size="32" leftIcon={RotateCcw} onClick={resetAll}>
            {resetLabel}
          </Button>
        )}
        <Button variant="line" size="32" leftIcon={Plus} onClick={onRegisterCode}>
          {registerCodeLabel}
        </Button>
        <Button variant="line" size="32" leftIcon={Download} onClick={onExcelDownload}>
          {excelDownloadLabel}
        </Button>
        <FileUploadButton
          triggerText={excelUploadLabel}
          files={excelFiles}
          maxCount={1}
          accept=".xlsx,.xls"
          guide={excelUploadGuide}
          placement="auto-right"
          menuWidth={320}
          buttonProps={{ variant: 'line', size: '32' }}
          onAdd={(list: FileList) => {
            const f = list[0];
            if (!f) return;
            setExcelFiles([{ name: f.name, size: Math.round(f.size / 1e6) }]);
            onExcelUpload?.(f);
          }}
          onDelete={() => setExcelFiles([])}
        />
      </div>,
    );
    return () => setModalFooterStart(null);
  }, [
    setModalFooterStart,
    showReset,
    resetLabel,
    resetAll,
    registerCodeLabel,
    onRegisterCode,
    excelDownloadLabel,
    onExcelDownload,
    excelUploadLabel,
    excelUploadGuide,
    excelFiles,
    onExcelUpload,
  ]);

  useImperativeHandle(ref, () => ({
    validate: () => {
      const invalid = new Set<string>();
      rows.forEach((r) =>
        r.items.forEach((it, i) => {
          if (Array.isArray(it.value) ? it.value.length === 0 : !it.value) invalid.add(`${r.id}:${i}`);
        }),
      );
      setInvalidKeys(invalid);
      return invalid.size === 0;
    },
    // 저장 시점 최신 로우 조회 — onChange 스냅샷을 따로 보관하지 않아도 되고,
    // '변경 없이 바로 저장'(onChange 미발화) 케이스에서도 defaultRows 포함 최신 상태를 준다.
    getRows: () => rows,
  }));

  // 순서 번호 = 내림차순(맨 위가 가장 큼) — 렌더 파생
  const displayRows = rows.map((r, i) => ({ ...r, orderNo: rows.length - i }));

  // 로우 칩 편집 검증(2026-07-07 지시) — 이 값으로 바꾸면 다른 로우와 같은 조합이 되는 옵션은
  // 드롭다운에서 비활성(사전 차단, 추가 시 인풋 검증과 일관된 옵션 disabled 패턴)
  const wouldDuplicate = (row: JobRow, itemIndex: number, value: string) => {
    const key = comboKey(
      row.items.map((it, i) => (i === itemIndex ? { ...it, value } : it)),
    );
    return rows.some((r) => r.id !== row.id && comboKey(r.items) === key);
  };

  const columns = [
    // width 계산(규칙 17 정신) — 셀 좌우 패딩 10×2(spacing-5-5) + 텍스트 폭 21(2026-07-23 지정) = 41
    { key: 'orderNo', label: orderLabel, width: 41 },
    {
      key: 'items',
      // 헤더에 현재 조건 구성 표시(2026-07-24 지시) — "채용 분야 (지역 > 직무)" 식으로
      // 선택된 기준 라벨을 순서대로 병기. 기준이 없으면 기본 라벨만.
      label: (() => {
        const labels = skeletonFor(selections, activeOrder).map(
          (c) => criteriaOptions.find((o) => o.value === c)?.label ?? c,
        );
        return labels.length > 0 ? `${jobLabel} (${labels.join(' > ')})` : jobLabel;
      })(),
      render: (row: JobRow) => (
        <div className="flex min-w-0 flex-wrap items-center gap-spacing-3">
          {row.items.map((it: JobRowItem, i: number) => (
            <span key={`${it.criteria}-${i}`} className="flex items-center gap-spacing-3">
              {i > 0 && (
                <ChevronRight size={12} strokeWidth={1.8} className="shrink-0 text-font-icon-3" />
              )}
              <SelectChip
                options={(valueOptions[it.criteria] ?? []).map((o) =>
                  o.value !== it.value && wouldDuplicate(row, i, o.value)
                    ? { ...o, disabled: true }
                    : o,
                )}
                value={typeof it.value === 'string' && it.value ? it.value : null}
                placeholder={chipPlaceholder(it.criteria)}
                searchable // 값 목록이 길어질 수 있어 팝오버 상단 검색 제공(2026-07-07 지시)
                searchPlaceholder="검색어 입력" // 좁은 칩 드롭다운(160)에 맞춘 짧은 문구
                menuWidth={160} // 검색바가 들어가므로 칩 기본(120)보다 넓게
                error={invalidKeys.has(`${row.id}:${i}`)}
                errorMessage={emptyValueMessage}
                onChange={(e) => setRowValue(row.id, i, e.target.value)}
              />
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'jobda',
      label: jobdaLabel,
      width: 320, // 고정(2026-07-23 지시) — 칩 2개+상동 버튼 기준

      // 직군 → 직무 종속 선택 — 직군 미선택이면 직무 비활성, 직군 변경 시 직무 리셋.
      // 우측 '상동'(underline 24) — 바로 위 행의 매칭 값 복사(맨 위 행은 비활성)
      render: (row: JobRow) => (
        // w-full — 셀 래퍼(flex)의 자식이라 명시해야 셀 전체 폭을 차지 → '상동'만 오른쪽 끝 정렬
        <div className="flex w-full min-w-0 items-center justify-between gap-spacing-3">
          <div className="flex min-w-0 items-center gap-spacing-3">
            <SelectChip
              options={jobdaGroupOptions}
              value={row.jobdaGroup || null}
              placeholder={jobdaGroupPlaceholder}
              onChange={(e) =>
                setRowJobda(row.id, { jobdaGroup: e.target.value as string, jobdaDuty: '' })
              }
            />
            <SelectChip
              options={jobdaDutyOptions[row.jobdaGroup ?? ''] ?? []}
              value={row.jobdaDuty || null}
              placeholder={jobdaDutyPlaceholder}
              disabled={!row.jobdaGroup}
              onChange={(e) => setRowJobda(row.id, { jobdaDuty: e.target.value as string })}
            />
          </div>
          <Button
            variant="underline"
            size="32"
            leftIcon={Layers2}
            disabled={rows.findIndex((r) => r.id === row.id) <= 0}
            onClick={() => copyJobdaFromAbove(row.id)}
          >
            {jobdaSameLabel}
          </Button>
        </div>
      ),
    },
    {
      key: 'manage',
      label: manageLabel,
      // 고스트 아이콘 버튼 2개(복사·삭제) — width는 임의값 대신 계산(규칙 17): 셀 패딩 + 버튼×2 + 간격
      width: iconCellWidth(2, { buttonSize: 32 }),
      render: (row: JobRow) => (
        <div className="flex items-center gap-spacing-5">
          <Button variant="ghost" size="32" icon={Copy} aria-label="복사" onClick={() => copyRow(row)} />
          <Button variant="ghost" size="32" icon={Trash2} aria-label="삭제" onClick={() => removeRow(row.id)} />
        </div>
      ),
    },
  ];

  return (
    // tableHeight='fill' + 모달 안이면 ModalBody 가용 높이를 최대치로(SideNavigationTemplate과 동일 패턴) —
    // 내용이 적으면 자연 높이, 상한에 닿으면 모달이 더 안 커지고 테이블 바디가 내부 스크롤된다(2026-07-23 지시).
    // B타입(2026-07-24): 좌우 2단 → 상하 스택. Step 01이 위(가로 카드), Step 02가 아래.
    <div
      style={tableHeight === 'fill' && modalBodyMax != null ? { maxHeight: `${modalBodyMax}px` } : undefined}
      className={`flex min-h-0 w-full flex-col gap-spacing-7 ${className}`}
      {...props}
    >
      {/* Step 02 — 채용 분야 추가 */}
      <div className="flex min-h-0 w-full flex-1 flex-col gap-spacing-5">
        {/* 액션 버튼 행 — 왼쪽 타이틀 '채용 분야 설정'(2026-07-24 지시, 페이지 전용).
            페이지 사용 시에만 표시 — 모달에선 위 effect가 버튼을 푸터 왼쪽으로 보낸다 */}
        {!inModal && (
        <div className="flex min-h-[32px] items-center justify-between">
          <p className="text-15 font-semibold text-font-icon-5">{pageTitle}</p>
          <div className="flex items-center gap-spacing-5">
            {/* 리셋 — 조건·행 전체 초기화, 코드 등록 버튼 앞(B타입, 2026-07-24 지시) */}
            {showReset && (
              <Button variant="line" size="32" leftIcon={RotateCcw} onClick={resetAll}>
                {resetLabel}
              </Button>
            )}
            {/* 채용 분야 코드 등록 — 엑셀 다운로드 앞(B타입, 2026-07-24 지시) */}
            <Button variant="line" size="32" leftIcon={Plus} onClick={onRegisterCode}>
              {registerCodeLabel}
            </Button>
            <Button variant="line" size="32" leftIcon={Download} onClick={onExcelDownload}>
              {excelDownloadLabel}
            </Button>
            {/* 업로드 — FileUploadMenu 팝오버(1개·엑셀만, 우측 정렬·상하 auto). guide와 accept 일치 유지 주의 */}
            <FileUploadButton
              triggerText={excelUploadLabel}
              files={excelFiles}
              maxCount={1}
              accept=".xlsx,.xls"
              guide={excelUploadGuide}
              placement="auto-right"
              menuWidth={320} // 기본 420 − 100(2026-07-23 지시)
              buttonProps={{ variant: 'line', size: '32' }}
              onAdd={(list: FileList) => {
                const f = list[0];
                if (!f) return;
                setExcelFiles([{ name: f.name, size: Math.round(f.size / 1e6) }]);
                onExcelUpload?.(f);
              }}
              onDelete={() => setExcelFiles([])}
            />
          </div>
        </div>
        )}
        {/* 조건 카드 그룹 — 타이틀과 테이블 사이(B타입, 2026-07-24 지시) */}
        {/* 카드 목록 가로 스크롤(규칙 9) — 카드가 컨테이너 폭을 넘으면 가로 스크롤.
            뷰포트 rounded-round-4 + 외곽 1px(scroll-line 토큰) — A타입과 동일한 경계 처리 */}
        <ScrollArea
          horizontal
          className="min-w-0 after:pointer-events-none after:absolute after:inset-0 after:rounded-round-4 after:border after:border-condition-slot-scroll-line after:content-['']"
          contentClassName="rounded-round-4"
        >
        <ConditionOrderSlot
          direction="horizontal"
          className="w-full" // 슬롯(회색 배경)이 컨테이너 폭 100%를 채우게(B타입, 2026-07-24 지시)
          cardWidth="fill" // 카드가 슬롯 폭을 균등 분할(2026-07-24 지시)
          items={cardIds.map((id) => {
            const sel = selections[id] ?? { criteria: '', value: '' };
            const used = usedByOthers(id);
            return {
              id,
              body: (
                <>
                  {/* 앞 카드 기준 미선택 시 잠금 + hover 사유 툴팁(순차 입력, 2026-07-24 지시) */}
                  <LockTooltipWrap
                    reason={(() => {
                      const n = firstUnselectedPrev(id);
                      return n != null ? criteriaLockTooltip(n) : null;
                    })()}
                  >
                    <Select
                      width="100%"
                      options={[
                        { value: UNUSED_CRITERIA, label: '미사용' }, // 최상단 — 카드 비우기
                        ...criteriaOptions.map((o) =>
                          used.has(o.value) ? { ...o, disabled: true } : o,
                        ),
                      ]}
                      value={sel.criteria}
                      label={`기준${cardIds.indexOf(id) + 1}`} // 카드 순번 병기 — "기준1 ⋮ 지역"(2026-07-24 지시)
                      placeholder={`기준${cardIds.indexOf(id) + 1} 선택`} // 순번 병기(2026-07-24 지시)
                      disabled={firstUnselectedPrev(id) != null}
                      // '미사용' 선택 → 기준을 비워 플레이스홀더("기준N 선택") 상태로(2026-07-24 지시)
                      onChange={(e) =>
                        setCardCriteria(id, e.target.value === UNUSED_CRITERIA ? '' : e.target.value)
                      }
                    />
                  </LockTooltipWrap>
                  {/* 값 셀렉트(2026-07-24 재추가) — 고르면 그 기준의 빈 칩들을 채우는 기본값.
                      마지막 기준 카드는 체크박스(confirm) — 테이블 마지막 칩과 같은 그룹 동기화 */}
                  {isLastValueCard(sel.criteria) ? (
                    <Select
                      width="100%"
                      label="값"
                      placeholder="값 선택"
                      searchable
                      searchPlaceholder="검색어 입력"
                      options={valueOptions[sel.criteria] ?? []}
                      {...({
                        multiple: true,
                        confirm: true,
                        selectAllLabel: '전체',
                        menuWidth: 228,
                        // 체크 상태 = 카드에서 고른 앞 조건 값 조합으로 존재하는 행들의 값
                        // (앞 값 미선택·해당 조합 행 없음 → 체크 없음)
                        value: cardCheckedValues(),
                        onChange: (e: { target: { value: string[] } }) =>
                          setCardLastMulti(e.target.value),
                      } as unknown as Parameters<typeof Select>[0])}
                    />
                  ) : (
                    <Select
                      width="100%"
                      options={valueOptions[sel.criteria] ?? []}
                      label="값" // 내부 라벨 — 선택 시 "값 ⋮ 서울"으로 표시
                      placeholder="값 선택"
                      searchable
                      searchPlaceholder="검색어 입력"
                      disabled={!sel.criteria}
                      value={typeof sel.value === 'string' ? sel.value : ''}
                      onChange={(e) => setCardValue(id, e.target.value)}
                    />
                  )}
                </>
              ),
            };
          })}
          showCardHeaders={false}
        />
        </ScrollArea>
        {/* 규칙 18 — 모달 안 무한 스크롤 테이블: bordered + maxHeight='fill' + min-h-0(shrink 상한) */}
        <Table
          /* render 파라미터를 구체 행 타입(JobRow)으로 쓰므로 Table 계약(TableRowData)으로 한 번 캐스팅 —
             rows에 JobRow[]만 넘겨 런타임 안전 */
          columns={columns as unknown as TableColumn[]}
          rows={displayRows}
          rowKey="id"
          bordered
          maxHeight={tableHeight}
          // 빈 상태: flex-1로 조건 조합 설정 하단까지 늘려 엠티 텍스트 중앙 정렬 /
          // 데이터 있음: hug(자연 높이, 2026-07-23 지시) — 상한(fill)만 유지
          className={tableHeight === 'fill' ? (rows.length === 0 ? 'min-h-0 flex-1' : 'min-h-0') : ''}
          emptyMessage={emptyMessage}
        />
      </div>
    </div>
  );
}
