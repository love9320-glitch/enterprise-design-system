// JobPositionTemplate — 채용 분야 설정 템플릿 (Figma "JobPositionTemplate" 8220:82935)
// Step 01(좌): ConditionOrderSlot — 조건 카드(기준 Select + 값 Select)들을 드래그 정렬·사용/미사용.
// Step 02(우): 조건 선택이 곧 테이블 반영(2026-07-23 — 미리보기 인풋·추가 버튼 제거).
//   다중(체크박스) 조건: 체크=조합 행 즉시 추가, 해제=그 조합 행 제거(다른 활성 조건이 완성일 때).
//   다중 카드 없음(multiLastValue=false): 조합이 완성되는 순간 자동 추가. 중복 조합은 조용히 건너뜀.
//   외곽선(bordered) 무한 스크롤 테이블(규칙 18), 최신이 위. 로우의 SelectChip으로 그 자리 값 변경.
// 조립(규칙 4): ConditionOrderSlot + Select + Button + Table + SelectChip — 손 구현 0.
// 작성 데이터는 onChange(rows)로 반출한다(템플릿 값 반출 계약 — 2026-07-07 감사 교훈).
import { useContext, useEffect, useImperativeHandle, useState } from 'react';
import type { ComponentPropsWithoutRef, ReactNode, Ref } from 'react';
import { ModalBodyMaxContext, ModalFooterStartContext } from './modalContext';
import { ChevronRight, Copy, Layers2, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { ConditionOrderSlot } from './ConditionOrderSlot';
import { Select, SelectChip } from './Select';
import { Button } from './Button';
import { Table } from './Table';
import type { TableColumn } from './Table';
import { iconCellWidth } from './tableView';
import { Divider } from './Divider';
import { ScrollArea } from './ScrollArea';
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

// 옵션 항목 — [{ value, label }] (로우 칩에서 disabled 파생 부여)
interface JobOption {
  value: string;
  label: string;
  disabled?: boolean;
}
// 로우의 조건 항목 — { criteria, value }
interface JobRowItem {
  criteria: string;
  value: string;
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
export interface JobPositionTemplateHandle {
  validate: () => boolean;
  getRows: () => JobRow[];
}

interface JobPositionTemplateProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange'> {
  criteriaOptions?: JobOption[]; // 기준 목록 [{ value, label }] — 카드의 첫 Select(예: 지역/고용형태/경력/직무)
  valueOptions?: Record<string, JobOption[]>; // 기준별 값 목록 { [criteriaValue]: [{ value, label }] } — 카드의 둘째 Select·로우 칩 공용
  conditionCount?: number; // 조건 카드 수
  defaultDisabledIds?: string[]; // 초기 미사용(스위치 off) 조건 id 목록 (id=`cond-1`..`cond-N`)
  //   미지정 시 기본: 조건 1만 사용(나머지 전부 off — 2026-07-23 지시). 전부 켜려면 [] 전달.
  // multiLastValue — 마지막 조건(표시 순서상 맨 아래 카드)의 값을 체크박스 다중 선택으로.
  //   추가 시 선택한 값마다 행을 하나씩 생성(각 행=단일 조합, 중복은 건너뜀).
  multiLastValue?: boolean;
  defaultRows?: JobRow[]; // 초기 로우 [{ id, items: [{ criteria, value }] }]
  onChange?: (rows: JobRow[]) => void; // 로우 추가/삭제/칩 변경 시 전체 스냅샷 반출
  step1Title?: string;
  step2Title?: string;
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
  registerCodeLabel?: string; // Step 01 하단 버튼 문구
  onRegisterCode?: () => void; // Step 01 하단 '채용 분야 코드 등록' 클릭(모달 열기 등은 소비자 몫)
  showReset?: boolean; // Step 01 타이틀 우측 underline 리셋 버튼(조건·행 전체 초기화)
  resetLabel?: string;
  switchLockTooltip?: ReactNode; // 뎁스 잠금 사유 — 잠긴 사용/미사용 스위치 hover 시 툴팁
  // 순차 입력 잠금 사유 — 앞 조건 미완성으로 잠긴 값 셀렉트 hover 시 툴팁.
  // 미완성인 첫 앞 조건의 순번(카드 제목 "조건 N."의 N)을 받아 문구 생성.
  valueLockTooltip?: (order: number) => ReactNode;
  onReset?: () => void; // 리셋 후 알림(내부 초기화는 템플릿이 수행)
  ref?: Ref<JobPositionTemplateHandle>; // (선택) 저장 API(React 19 ref-as-prop)
}

export function JobPositionTemplate({
  criteriaOptions = [],
  valueOptions = {},
  conditionCount = 4,
  defaultDisabledIds,
  multiLastValue = false,
  defaultRows = [],
  onChange,
  step1Title = '1. 조건 조합 설정',
  step2Title = '2. 채용 분야 추가',
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
  switchLockTooltip = '추가된 채용 분야가 있어 잠겨 있습니다. 리셋 후 변경할 수 있습니다.',
  valueLockTooltip = (order) => `조건 ${order} 값을 먼저 선택해주세요.`,
  ref,
  className = '',
  ...props
}: JobPositionTemplateProps) {
  // 모달 안이면 ModalBody 가용 높이(px) — tableHeight='fill'의 상한으로 사용
  const modalBodyMax = useContext(ModalBodyMaxContext);
  // '채용 분야 코드 등록' 버튼 위치(2026-07-23 지시) — 페이지 사용: Step 01 하단 유지 /
  // 모달 사용: 모달 푸터 왼쪽으로 이동(ModalFooterStartContext 주입, setter 존재 = 모달 안).
  const setModalFooterStart = useContext(ModalFooterStartContext);
  const inModal = setModalFooterStart != null;
  useEffect(() => {
    if (!setModalFooterStart) return;
    setModalFooterStart(
      <Button variant="line" leftIcon={Plus} onClick={onRegisterCode}>
        {registerCodeLabel}
      </Button>,
    );
    return () => setModalFooterStart(null);
  }, [setModalFooterStart, onRegisterCode, registerCodeLabel]);
  // Step 01 상태 — 카드 순서/사용 여부는 ConditionOrderSlot controlled로 추적하고,
  // 카드별 (기준, 값) 선택은 템플릿이 소유한다(미리보기·추가 스냅샷 계산용).
  const cardIds = Array.from({ length: conditionCount }, (_, i) => `cond-${i + 1}`);
  // 초기 미사용 — 미지정이면 조건 1만 사용(나머지 off, 2026-07-23 지시)
  const initialDisabled = defaultDisabledIds ?? cardIds.slice(1);
  const [order, setOrder] = useState(cardIds);
  const [enabledIds, setEnabledIds] = useState(() =>
    cardIds.filter((id) => !initialDisabled.includes(id)),
  );
  const [selections, setSelections] = useState<Record<string, JobSelection>>({}); // { [cardId]: { criteria, value } }
  const effOrder = [
    ...order.filter((id) => cardIds.includes(id)),
    ...cardIds.filter((id) => !order.includes(id)),
  ];

  // 마지막 '사용 중' 조건 — multiLastValue면 이 카드의 값 셀렉트가 다중 선택(배열 값)이 된다.
  // 물리적 맨 아래가 아니라 활성 순번상 마지막(제목 "조건 N."의 최대 N)이어야 한다
  // (조건 3·4를 끄면 조건 2가 마지막 → 조건 2가 체크박스, 2026-07-08 지적).
  const activeOrder = effOrder.filter((id) => enabledIds.includes(id));

  // 순차 입력(2026-07-23 지시) — 활성 순서상 앞 조건의 (기준+값)이 완성되기 전까지
  // 다음 조건의 값 셀렉트는 비활성. 첫 조건은 항상 자유.
  // 반환: 미완성인 첫 번째 앞 조건의 활성 순번(1부터 — 카드 제목 "조건 N."의 N) / 없으면 null.
  const firstIncompletePrev = (id: string): number | null => {
    const idx = activeOrder.indexOf(id);
    if (idx <= 0) return null;
    for (let i = 0; i < idx; i += 1) {
      const sel = selections[activeOrder[i]];
      const v = sel?.value;
      if (!sel?.criteria || (Array.isArray(v) ? v.length === 0 : !v)) return i + 1;
    }
    return null;
  };
  const prevIncomplete = (id: string) => firstIncompletePrev(id) !== null;
  const lastCardId = activeOrder[activeOrder.length - 1];

  // 앞 조건이 바뀌면 뒤 조건의 선택 값은 다른 조합이 되므로 무효(2026-07-23 사용자 확인:
  // "서울>경력>[디자인,개발]"과 "서울>신입>[디자인,개발]"은 서로 다름) — 뒤 카드 값을 전부 리셋.
  // 체크박스(다중) 카드도 미선택으로 돌아간다. 테이블에 이미 추가된 행은 스냅샷이라 유지.
  const resetLaterValues = (p: Record<string, JobSelection>, id: string) => {
    const idx = activeOrder.indexOf(id);
    if (idx === -1) return p;
    const next = { ...p };
    for (const lid of activeOrder.slice(idx + 1)) {
      if (next[lid]) next[lid] = { ...next[lid], value: isMultiCard(lid) ? [] : '' };
    }
    return next;
  };

  const setCardCriteria = (id: string, criteria: string) =>
    setSelections((p) => resetLaterValues({ ...p, [id]: { criteria, value: '' } }, id)); // 기준 변경 시 값+뒤 조건 값 리셋

  // 값 정규화 — 다중 카드는 배열, 그 외는 문자열로 강제한다. 재정렬로 마지막 카드가 바뀌면
  // 이전 카드에 남은 배열 값은 여기서 ''로 취급돼(단일화) 조합·미리보기가 꼬이지 않는다.
  const isMultiCard = (id: string) => multiLastValue && id === lastCardId;
  const valueOf = (id: string): string | string[] => {
    const raw = selections[id]?.value;
    if (isMultiCard(id)) return Array.isArray(raw) ? raw : raw ? [raw] : [];
    return Array.isArray(raw) ? '' : (raw ?? '');
  };

  // 다른 '사용 중' 카드가 선택한 기준은 이 카드에서 비활성(중복 조건 방지, 2026-07-07 지시).
  // 앞 카드만 잠그면 뒤 카드가 먼저 고른 기준을 앞 카드가 다시 고를 수 있어(사용자 재현) 양방향 잠금.
  const usedByOthers = (id: string) => {
    const used = new Set<string>();
    for (const pid of effOrder) {
      if (pid === id || !enabledIds.includes(pid)) continue;
      const c = selections[pid]?.criteria;
      if (c) used.add(c);
    }
    return used;
  };

  // Step 02 로우 — 최신이 위(순서 내림차순). onChange로 전체 스냅샷 반출.
  const [rows, setRows] = useState<JobRow[]>(defaultRows);
  const applyRows = (next: JobRow[]) => {
    setRows(next);
    onChange?.(next);
  };

  // 중복 검증(2026-07-07 지시) — 같은 조건 조합(기준+값)은 테이블에 한 번만.
  // 순서는 무관하다(2026-07-08 지시): "정규직>신입…"과 "신입>정규직…"은 값 집합이 같으므로 같은 조합.
  //   → 각 (기준:값) 쌍을 정렬한 뒤 join해 순서 독립 키를 만든다. 중복은 조용히 건너뛴다.
  const comboKey = (items: JobRowItem[]) =>
    items
      .map((it) => `${it.criteria}:${it.value}`)
      .sort()
      .join('|');

  // 즉시 반영(2026-07-23 지시) — 미리보기 인풋·추가 버튼 없이, 조건 선택이 곧 테이블 반영.
  //   다중(체크박스) 카드: 체크=해당 조합 행 추가, 해제=그 조합 행 제거.
  //   다중 카드가 없으면(multiLastValue=false): 조합이 완성되는 순간 자동 추가.
  // add/remove를 한 번에 계산해 applyRows 1회 호출(연속 호출 시 stale rows 방지).
  const syncCombos = (add: JobRowItem[][], remove: JobRowItem[][]) => {
    const removeKeys = new Set(remove.map(comboKey));
    const kept = rows.filter((r) => !removeKeys.has(comboKey(r.items)));
    const fresh = add.filter((items) => !kept.some((r) => comboKey(r.items) === comboKey(items)));
    if (fresh.length === 0 && kept.length === rows.length) return;
    applyRows([...fresh.map((items) => ({ id: newRowId(), items })), ...kept]);
  };

  // 다중(체크박스) 체크 상태는 별도 저장하지 않고 '현재 조합으로 테이블에 있는 행'에서 파생한다
  // (2026-07-23 사용자 확인) — 앞 조건을 바꿨다 되돌리면, 그 조합으로 추가해 둔 행들의 체크가
  // 그대로 복원돼 보인다. 행 삭제·리셋도 자동으로 체크에 반영된다(단일 진실 = rows).
  // 앞 조건이 미완성이면 null(파생 불가) — 순차 입력 규칙상 이때 값 셀렉트는 잠겨 있다.
  const multiContext = (id: string): JobRowItem[] | null => {
    const myCriteria = selections[id]?.criteria;
    if (!myCriteria) return null;
    const ctx: JobRowItem[] = [];
    for (const cid of activeOrder) {
      if (cid === id) continue;
      const c = selections[cid]?.criteria;
      const v = valueOf(cid);
      if (!c || typeof v !== 'string' || !v) return null;
      ctx.push({ criteria: c, value: v });
    }
    return ctx;
  };
  const derivedMultiValues = (id: string): string[] => {
    const myCriteria = selections[id]?.criteria;
    const ctx = multiContext(id);
    if (!myCriteria || !ctx) return [];
    return (valueOptions[myCriteria] ?? [])
      .map((o) => o.value)
      .filter((v) =>
        rows.some((r) => comboKey(r.items) === comboKey([...ctx, { criteria: myCriteria, value: v }])),
      );
  };

  // 다중(체크박스) 카드 값 변경 — 체크된 값은 즉시 행 추가, 해제된 값은 그 조합 행 제거.
  const handleMultiChange = (id: string, next: string[]) => {
    const myCriteria = selections[id]?.criteria;
    const ctx = multiContext(id);
    if (!myCriteria || !ctx) return; // 앞 조건 미완성 — 순차 규칙상 도달하지 않음
    const prevVals = derivedMultiValues(id);
    const comboFor = (v: string): JobRowItem[] =>
      activeOrder.map((cid) =>
        cid === id
          ? { criteria: myCriteria, value: v }
          : { criteria: selections[cid].criteria, value: valueOf(cid) as string },
      );
    const added = next.filter((v) => !prevVals.includes(v));
    const removed = prevVals.filter((v) => !next.includes(v));
    syncCombos(added.map(comboFor), removed.map(comboFor));
  };

  // 단일 값 변경 — 뒤 조건의 선택 값은 리셋(다른 조합이 되므로 무효).
  // 다중 카드가 없을 때(multiLastValue=false)는 마지막 조건까지 완성되는 순간 자동 추가.
  const handleSingleChange = (id: string, value: string) => {
    setSelections((p) =>
      resetLaterValues({ ...p, [id]: { ...(p[id] ?? { criteria: '' }), value } }, id),
    );
    if (multiLastValue) return; // 다중 카드가 있으면 체크박스가 반영 트리거
    if (activeOrder.indexOf(id) !== activeOrder.length - 1) return; // 뒤 조건이 리셋됨 — 미완성
    const items: JobRowItem[] = [];
    for (const cid of activeOrder) {
      const c = selections[cid]?.criteria;
      const v = cid === id ? value : (valueOf(cid) as string);
      if (!c || typeof v !== 'string' || !v) return; // 미완성 — 선택만 반영
      items.push({ criteria: c, value: v });
    }
    syncCombos([items], []);
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

  const setRowValue = (rowId: string, itemIndex: number, value: string) => {
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
  const resetAll = () => {
    setOrder(cardIds);
    setEnabledIds(cardIds.filter((id) => !initialDisabled.includes(id)));
    setSelections({});
    setInvalidKeys(new Set());
    applyRows(defaultRows);
    onReset?.();
  };
  useImperativeHandle(ref, () => ({
    validate: () => {
      const invalid = new Set<string>();
      rows.forEach((r) =>
        r.items.forEach((it, i) => {
          if (!it.value) invalid.add(`${r.id}:${i}`);
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
      label: jobLabel,
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
                value={it.value}
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
    <div
      style={tableHeight === 'fill' && modalBodyMax != null ? { maxHeight: `${modalBodyMax}px` } : undefined}
      className={`flex min-h-0 w-full items-stretch gap-spacing-7 ${className}`}
      {...props}
    >
      {/* Step 01 — 조건 조합 설정 (타이틀 우측 underline 리셋 — 조건·행 전체 초기화, 2026-07-23)
          min-h-0 — 높이 상한이 전파되면 카드 목록(ScrollArea)만 줄어들며 스크롤(타이틀·하단 버튼 고정) */}
      <div className="flex min-h-0 shrink-0 flex-col gap-spacing-5">
        {/* 타이틀·리셋 상하 중앙 정렬 — underline 버튼(min-h 32)이 행 높이를 잡고 items-center로 맞춘다 */}
        <div className="flex min-h-[32px] items-center justify-between">
          <p className="text-14 text-font-icon-5">{step1Title}</p>
          {showReset && (
            <Button variant="underline" leftIcon={RotateCcw} onClick={resetAll}>
              {resetLabel}
            </Button>
          )}
        </div>
        {/* 카드 목록 스크롤(규칙 9) — 높이가 부족하면 이 영역만 내부 스크롤(내용이 적으면 자연 높이).
            뷰포트에 rounded-round-4 — 카드가 스크롤로 상하 경계에 잘릴 때도 모서리 라운드 유지(카드와 동일 값).
            외곽 1px(scroll-line 토큰 = 바깥 배경색) — 스크롤과 무관하게 고정 오버레이로 남아,
            카드가 경계에 잘릴 때 그 단면 위에 1px 라인이 보인다(2026-07-23 지시) */}
        <ScrollArea
          className="min-h-0 after:pointer-events-none after:absolute after:inset-0 after:rounded-round-4 after:border after:border-condition-slot-scroll-line after:content-['']"
          contentClassName="max-h-full rounded-round-4"
        >
        <ConditionOrderSlot
          items={cardIds.map((id) => {
            const sel = selections[id] ?? { criteria: '', value: '' };
            const used = usedByOthers(id);
            return {
              id,
              body: (
                <>
                  <Select
                    width="100%"
                    options={criteriaOptions.map((o) =>
                      used.has(o.value) ? { ...o, disabled: true } : o,
                    )}
                    value={sel.criteria}
                    label="기준" // 내부 라벨 — 선택 시 "기준 ⋮ 지역"으로 표시(2026-07-07 지시)
                    placeholder="기준 선택"
                    onChange={(e) => setCardCriteria(id, e.target.value)}
                  />
                  {/* 앞 조건 미완성으로 잠겼을 때만 hover 사유 툴팁(순차 입력) — 미완성인 첫 조건 번호로 안내 */}
                  <LockTooltipWrap
                    reason={(() => {
                      const n = firstIncompletePrev(id);
                      return n != null ? valueLockTooltip(n) : null;
                    })()}
                  >
                    <Select
                      width="100%"
                      options={valueOptions[sel.criteria] ?? []}
                      label="값" // 내부 라벨 — 선택 시 "값 ⋮ 서울"으로 표시(2026-07-07 지시)
                      placeholder="값 선택"
                      searchable // 값 목록이 길 수 있어 팝오버 상단 검색 제공(2026-07-23 지시 — 로우 칩과 동일)
                      searchPlaceholder="검색어 입력"
                      // 기준 미선택 또는 앞 조건 미완성이면 비활성(순차 입력)
                      disabled={!sel.criteria || prevIncomplete(id)}
                      // 마지막 조건은 체크박스 다중 선택(값 여러 개) — multiple이 동적 boolean이라
                      // 판별 유니언(SelectProps)에 스프레드로 한 번 좁혀 전달(런타임 동일)
                      {...({
                        multiple: isMultiCard(id),
                        // 체크박스 팝오버는 confirm 모드(2026-07-23 지시) — PopoverMenu 푸터 영역
                        // (전체 선택 footerCheckbox + 취소/확인). 확인 시에만 행 반영.
                        confirm: isMultiCard(id),
                        // 다중 카드 체크 상태는 rows 파생(현재 조합의 행 존재 여부) — 조합 복귀 시 체크 복원
                        value: isMultiCard(id) ? derivedMultiValues(id) : valueOf(id),
                        // 다중=체크 즉시 행 추가/제거, 단일=조합 완성 시 자동 추가(2026-07-23)
                        onChange: (e: { target: { value: string | string[] } }) =>
                          isMultiCard(id)
                            ? handleMultiChange(id, e.target.value as string[])
                            : handleSingleChange(id, e.target.value as string),
                      } as unknown as Parameters<typeof Select>[0])}
                    />
                  </LockTooltipWrap>
                </>
              ),
            };
          })}
          order={order}
          onOrderChange={setOrder}
          enabledIds={enabledIds}
          // 뎁스 잠금(2026-07-23 지시) — 테이블에 행이 생기는 순간 사용/미사용 스위치와
          // 드래그 정렬을 현재 상태로 잠근다(행들과 조건 구성·순서가 어긋나지 않게). 리셋 전까지 변경 불가.
          switchesDisabled={rows.length > 0}
          switchesDisabledTooltip={switchLockTooltip}
          dragDisabled={rows.length > 0}
          onEnabledChange={(nextEnabled, { id: toggledId, enabled }) => {
            setEnabledIds(nextEnabled);
            // 다시 켠 카드가 양보(2026-07-07 지적) — 미사용 동안 다른 활성 카드가 같은 기준을
            // 선택했을 수 있으므로, 켜는 순간 기준이 이미 사용 중이면 이 카드의 선택을 리셋한다.
            // (이미 활성인 카드는 건드리지 않아 동작이 예측 가능)
            if (enabled) {
              const c = selections[toggledId]?.criteria;
              const taken =
                c &&
                nextEnabled.some(
                  (oid) => oid !== toggledId && selections[oid]?.criteria === c,
                );
              if (taken) setSelections((p) => ({ ...p, [toggledId]: { criteria: '', value: '' } }));
            }
          }}
        />
        </ScrollArea>
        {/* 페이지 사용 시에만 Step 01 하단에 — 모달에선 위 effect가 푸터 왼쪽으로 보낸다 */}
        {!inModal && (
          <Button variant="line" width="fill" leftIcon={Plus} onClick={onRegisterCode}>
            {registerCodeLabel}
          </Button>
        )}
      </div>

      <Divider direction="vertical" />

      {/* Step 02 — 채용 분야 추가 */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-spacing-5">
        {/* Step 01 타이틀 행(min-h 32 — 리셋 버튼)과 시작 높이를 맞춘다 */}
        <div className="flex min-h-[32px] items-center">
          <p className="text-14 text-font-icon-5">{step2Title}</p>
        </div>
        {/* 규칙 18 — 모달 안 무한 스크롤 테이블: bordered + maxHeight='fill' + min-h-0(shrink 상한) */}
        <Table
          /* render 파라미터를 구체 행 타입(JobRow)으로 쓰므로 Table 계약(TableRowData)으로 한 번 캐스팅 —
             rows에 JobRow[]만 넘겨 런타임 안전 */
          columns={columns as unknown as TableColumn[]}
          rows={displayRows}
          rowKey="id"
          bordered
          maxHeight={tableHeight}
          className={tableHeight === 'fill' ? 'min-h-0' : ''}
          emptyMessage={emptyMessage}
        />
      </div>
    </div>
  );
}
