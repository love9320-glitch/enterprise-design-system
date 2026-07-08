// JobPositionTemplate — 채용 직무 설정 템플릿 (Figma "JobPositionTemplate" 8220:82935)
// Step 01(좌): ConditionOrderSlot — 조건 카드(기준 Select + 값 Select)들을 드래그 정렬·사용/미사용.
// Step 02(우): 활성 조건의 선택 값이 read-only Input에 "값1 / 값2 / …"로 실시간 표시되고,
//   [추가] 클릭 시 하단 외곽선(bordered) 무한 스크롤 테이블(규칙 18)에 로우가 추가된다(최신이 위).
//   로우의 SelectChip을 클릭하면 그 자리에서 값을 변경할 수 있다.
// 조립(규칙 4): ConditionOrderSlot + Select + Input + Button + Table + SelectChip — 손 구현 0.
// 작성 데이터는 onChange(rows)로 반출한다(템플릿 값 반출 계약 — 2026-07-07 감사 교훈).
import { useImperativeHandle, useState } from 'react';
import { ChevronRight, Copy, Plus, Trash2 } from 'lucide-react';
import { ConditionOrderSlot } from './ConditionOrderSlot';
import { Select, SelectChip } from './Select';
import { Input } from './Input';
import { Button } from './Button';
import { Table } from './Table';
import { iconCellWidth } from './tableView';
import { Divider } from './Divider';

// 로우 id 생성 — 모듈 카운터(let seq)는 HMR로 모듈이 재평가되면 0으로 리셋돼 기존 로우 id와
// 충돌하고, React 중복 key로 새 로우가 화면에 안 나타난다(2026-07-07 복사 미동작 원인).
// 시간+랜덤 조합으로 defaultRows·리마운트·HMR 어떤 경우에도 충돌하지 않게 한다.
const newRowId = () =>
  `row-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

export function JobPositionTemplate({
  criteriaOptions = [],       // 기준 목록 [{ value, label }] — 카드의 첫 Select(예: 지역/고용형태/경력/직무)
  valueOptions = {},          // 기준별 값 목록 { [criteriaValue]: [{ value, label }] } — 카드의 둘째 Select·로우 칩 공용
  conditionCount = 4,         // 조건 카드 수
  defaultRows = [],           // 초기 로우 [{ id, items: [{ criteria, value }] }]
  onChange,                   // (rows) => void — 로우 추가/삭제/칩 변경 시 전체 스냅샷 반출
  step1Title = '1. 조건 조합 설정',
  step2Title = '2. 채용 직무 추가',
  addLabel = '추가',
  inputPlaceholder = '조건을 선택하세요',
  orderLabel = '순서',
  jobLabel = '채용 직무',
  manageLabel = '관리',
  tableHeight = 'fill',       // 테이블 세로 — 'fill'(내용만큼 계속 확장, 넘치면 모달 바디 스크롤) | 숫자(px 고정 상한+바디 스크롤)
  emptyMessage = '추가된 채용 직무가 없습니다.',
  duplicateMessage = '이미 추가된 조건 조합입니다.', // 중복 추가 시도 시 인풋 에러 툴팁 문구
  emptyValueMessage = '값을 선택하세요.', // 저장 검증 — 미선택 칩 에러 툴팁 문구
  ref,                        // (선택) 저장 API(React 19 ref-as-prop) —
                              //   validate(): 미선택 칩에 에러 표시 + 통과 여부(false면 저장 중단)
                              //   getRows(): 저장 시점 최신 로우 조회('변경 없이 저장'도 안전)
  className = '',
  ...props
}) {
  // Step 01 상태 — 카드 순서/사용 여부는 ConditionOrderSlot controlled로 추적하고,
  // 카드별 (기준, 값) 선택은 템플릿이 소유한다(미리보기·추가 스냅샷 계산용).
  const cardIds = Array.from({ length: conditionCount }, (_, i) => `cond-${i + 1}`);
  const [order, setOrder] = useState(cardIds);
  const [enabledIds, setEnabledIds] = useState(cardIds);
  const [selections, setSelections] = useState({}); // { [cardId]: { criteria, value } }
  const effOrder = [
    ...order.filter((id) => cardIds.includes(id)),
    ...cardIds.filter((id) => !order.includes(id)),
  ];

  const setCardCriteria = (id, criteria) =>
    setSelections((p) => ({ ...p, [id]: { criteria, value: '' } })); // 기준 변경 시 값 리셋
  const setCardValue = (id, value) =>
    setSelections((p) => ({ ...p, [id]: { ...(p[id] ?? { criteria: '' }), value } }));

  const labelOf = (criteria, value) =>
    (valueOptions[criteria] ?? []).find((o) => o.value === value)?.label ?? '';

  // 다른 '사용 중' 카드가 선택한 기준은 이 카드에서 비활성(중복 조건 방지, 2026-07-07 지시).
  // 앞 카드만 잠그면 뒤 카드가 먼저 고른 기준을 앞 카드가 다시 고를 수 있어(사용자 재현) 양방향 잠금.
  const usedByOthers = (id) => {
    const used = new Set();
    for (const pid of effOrder) {
      if (pid === id || !enabledIds.includes(pid)) continue;
      const c = selections[pid]?.criteria;
      if (c) used.add(c);
    }
    return used;
  };

  // 활성 조건 중 (기준+값) 모두 선택된 것 — 표시 순서(effOrder) 기준
  const activeComplete = effOrder
    .filter((id) => enabledIds.includes(id))
    .map((id) => selections[id])
    .filter((s) => s?.criteria && s?.value);
  const preview = activeComplete.map((s) => labelOf(s.criteria, s.value)).join(' / ');

  // Step 02 로우 — 최신이 위(순서 내림차순). onChange로 전체 스냅샷 반출.
  const [rows, setRows] = useState(defaultRows);
  const applyRows = (next) => {
    setRows(next);
    onChange?.(next);
  };

  // 중복 검증(2026-07-07 지시) — 조건 조합(기준+값)이 이미 테이블에 있으면 추가 불가.
  // 순서는 무관하다(2026-07-08 지시): "정규직>신입…"과 "신입>정규직…"은 값 집합이 같으므로 같은 조합.
  //   → 각 (기준:값) 쌍을 정렬한 뒤 join해 순서 독립 키를 만든다.
  // 에러는 추가 시도 시 표시하고, 조합·로우가 바뀌어 중복이 해소되면 자동으로 사라진다(렌더 파생).
  const comboKey = (items) =>
    items
      .map((it) => `${it.criteria}:${it.value}`)
      .sort()
      .join('|');
  const isDuplicate =
    activeComplete.length > 0 && rows.some((r) => comboKey(r.items) === comboKey(activeComplete));
  const [dupAttempted, setDupAttempted] = useState(false);
  const showDupError = dupAttempted && isDuplicate;

  const addRow = () => {
    if (activeComplete.length === 0) return;
    if (isDuplicate) {
      setDupAttempted(true); // 추가하지 않고 인풋에 에러 툴팁 표시
      return;
    }
    setDupAttempted(false);
    applyRows([{ id: newRowId(), items: activeComplete.map((s) => ({ ...s })) }, ...rows]);
  };
  const removeRow = (id) => applyRows(rows.filter((r) => r.id !== id));
  // 로우 복사(2026-07-07 지시) — 값을 그대로 복제하되 완전 중복을 피하도록 마지막 칩만 미선택으로.
  // 새 로우는 '추가'와 동일하게 맨 위(최대 순번)로 들어간다. 복사는 항상 새 로우를 만든다 —
  // 미완성 중복은 저장 검증(빈 칩)과 칩 편집 잠금(같은 조합 완성 불가)이 걸러준다.
  const copyRow = (row) =>
    applyRows([
      {
        id: newRowId(),
        items: row.items.map((it, i) =>
          i === row.items.length - 1 ? { ...it, value: '' } : { ...it },
        ),
      },
      ...rows,
    ]);
  const setRowValue = (rowId, itemIndex, value) => {
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
  const [invalidKeys, setInvalidKeys] = useState(() => new Set());
  useImperativeHandle(ref, () => ({
    validate: () => {
      const invalid = new Set();
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
  const wouldDuplicate = (row, itemIndex, value) => {
    const key = comboKey(
      row.items.map((it, i) => (i === itemIndex ? { ...it, value } : it)),
    );
    return rows.some((r) => r.id !== row.id && comboKey(r.items) === key);
  };

  const columns = [
    { key: 'orderNo', label: orderLabel, width: 60 },
    {
      key: 'items',
      label: jobLabel,
      render: (row) => (
        <div className="flex min-w-0 flex-wrap items-center gap-spacing-3">
          {row.items.map((it, i) => (
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
      key: 'manage',
      label: manageLabel,
      // 고스트 아이콘 버튼 2개(복사·삭제) — width는 임의값 대신 계산(규칙 17): 셀 패딩 + 버튼×2 + 간격
      width: iconCellWidth(2, { buttonSize: 32 }),
      render: (row) => (
        <div className="flex items-center gap-spacing-5">
          <Button variant="ghost" size="32" icon={Copy} aria-label="복사" onClick={() => copyRow(row)} />
          <Button variant="ghost" size="32" icon={Trash2} aria-label="삭제" onClick={() => removeRow(row.id)} />
        </div>
      ),
    },
  ];

  return (
    <div className={`flex w-full items-stretch gap-spacing-7 ${className}`} {...props}>
      {/* Step 01 — 조건 조합 설정 */}
      <div className="flex shrink-0 flex-col gap-spacing-6">
        <p className="text-14 text-font-icon-5">{step1Title}</p>
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
                  <Select
                    width="100%"
                    options={valueOptions[sel.criteria] ?? []}
                    value={sel.value}
                    label="값" // 내부 라벨 — 선택 시 "값 ⋮ 서울"으로 표시(2026-07-07 지시)
                    placeholder="값 선택"
                    disabled={!sel.criteria}
                    onChange={(e) => setCardValue(id, e.target.value)}
                  />
                </>
              ),
            };
          })}
          order={order}
          onOrderChange={setOrder}
          enabledIds={enabledIds}
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
      </div>

      <Divider direction="vertical" />

      {/* Step 02 — 채용 직무 추가 */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-spacing-6">
        <p className="text-14 text-font-icon-5">{step2Title}</p>
        <div className="flex items-center gap-spacing-5">
          <div className="min-w-0 flex-1">
            <Input
              width="100%"
              readOnly
              value={preview}
              placeholder={inputPlaceholder}
              error={showDupError}
              errorMessage={duplicateMessage}
            />
          </div>
          <Button variant="line" leftIcon={Plus} disabled={activeComplete.length === 0} onClick={addRow}>
            {addLabel}
          </Button>
        </div>
        {/* 규칙 18 — 모달 안 무한 스크롤 테이블: bordered + maxHeight='fill' + min-h-0(shrink 상한) */}
        <Table
          columns={columns}
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
