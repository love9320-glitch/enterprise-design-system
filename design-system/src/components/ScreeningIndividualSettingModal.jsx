// ScreeningIndividualSettingModal — 복수 조건(지정) 개별 값 설정 모달 (Figma 8535:10535)
// ⚠️ 내부용(ScreeningConditionCard 전용) — 지정된 항목(자격증 등)마다 가점/감점(점수) 또는
//    적합/부적합을 설정하고, 하단에서 적용 함수(SUM 등)를 고른다. 확인 시에만 반영.
//
// 구조(모달 템플릿 규칙 — Modal 컴포넌트 조립, 셸 재구현 금지):
//   바디: [모드 세그먼트 탭(가점/감점|적합/부적합) ── 일괄 적용(셀렉트[+점수]+버튼)]
//         [항목 테이블 — 항목 / 가/감점(텍스트 셀렉트) / 점수(가점·감점 모드만)]
//   푸터: 취소·확인 (함수 셀렉트는 2026-07-16 제거 — 그룹핑·함수는 수식 영역 툴바가 담당)
// 저장 페이로드: { type:'individual', mode:'points'|'fitness',
//                items: { [항목값]: { type:'plus'|'minus', points } | { type:'fit'|'unfit' } } }
import { useState } from 'react';
import { Modal } from './Modal';
import { SegmentedTabs } from './SegmentedTabs';
import { Select } from './Select';
import { Input } from './Input';
import { Button } from './Button';
import { Table } from './Table';

// 점수 입력 필터 — 숫자만 허용(2026-07-16 지시)
const digitsOnly = (v) => v.replace(/[^0-9]/g, '');

const POINT_TYPES = [
  { value: 'plus', label: '가점' },
  { value: 'minus', label: '감점' },
];
const FIT_TYPES = [
  { value: 'fit', label: '적합' },
  { value: 'unfit', label: '부적합' },
];
const MODE_TABS = (fitnessOnly) => [
  { value: 'points', label: '가점/감점', disabled: fitnessOnly },
  { value: 'fitness', label: '적합/부적합' },
];

export function ScreeningIndividualSettingModal({
  items = [],   // [{ value, label }] — 지정된 항목(카드의 선택 항목, 옵션 순서)
  value = null, // 저장된 값(위 페이로드) | null — 열 때 draft 시드
  fitnessOnly = false, // 적합/부적합 전용 — IF 함수 안 조건은 가점/감점 불가(2026-07-16)
  onClose,      // 닫기(취소·X·딤·Esc)
  onConfirm,    // (payload) => void — 확인 시에만
}) {
  const [mode, setMode] = useState(fitnessOnly ? 'fitness' : (value?.mode ?? 'points'));
  // 모드별 draft를 분리 보관 — 탭을 오가도 입력이 유지되고, 확인 시 활성 모드만 저장된다
  const seed = (m, defaults) => {
    const out = {};
    items.forEach((it) => {
      const saved = value?.mode === m ? value?.items?.[it.value] : null;
      out[it.value] = saved ?? defaults;
    });
    return out;
  };
  const [pointsDraft, setPointsDraft] = useState(() => seed('points', { type: 'plus', points: '' }));
  const [fitDraft, setFitDraft] = useState(() => seed('fitness', { type: 'fit' }));
  // 일괄 적용 — 체크한 행에만 적용(2026-07-16 지시). 모드가 바뀌면 셀렉트 옵션이 달라지므로 초기화
  const [bulkType, setBulkType] = useState('');
  const [bulkPoints, setBulkPoints] = useState('');
  const [checkedIds, setCheckedIds] = useState([]); // 테이블 체크박스 — 일괄 적용 대상
  const changeMode = (m) => {
    setMode(m);
    setBulkType('');
    setBulkPoints('');
  };

  const isPoints = mode === 'points';
  // 일괄 적용 그룹은 행을 체크해야 활성화되고(2026-07-16 지시), 값까지 채워져야 적용 가능
  const hasChecked = checkedIds.length > 0;
  const bulkReady = (isPoints ? !!bulkType && !!bulkPoints.trim() : !!bulkType) && hasChecked;
  const applyBulk = () => {
    if (!bulkReady) return;
    const set = isPoints ? { type: bulkType, points: bulkPoints.trim() } : { type: bulkType };
    const patchChecked = (d) => ({
      ...d,
      ...Object.fromEntries(checkedIds.map((id) => [id, { ...set }])),
    });
    if (isPoints) setPointsDraft(patchChecked);
    else setFitDraft(patchChecked);
  };

  const patchRow = (val, patch) =>
    isPoints
      ? setPointsDraft((d) => ({ ...d, [val]: { ...d[val], ...patch } }))
      : setFitDraft((d) => ({ ...d, [val]: { ...d[val], ...patch } }));

  // 가점/감점 모드는 모든 항목의 점수가 채워져야 확인 가능(적합/부적합은 기본값으로 항상 완성)
  const complete = isPoints
    ? items.every((it) => !!pointsDraft[it.value]?.points?.trim())
    : true;
  const payload = () => ({
    type: 'individual',
    mode,
    items: Object.fromEntries(
      items.map((it) =>
        isPoints
          ? [it.value, { type: pointsDraft[it.value].type, points: pointsDraft[it.value].points.trim() }]
          : [it.value, { type: fitDraft[it.value].type }],
      ),
    ),
  });

  const columns = [
    { key: 'label', label: '항목' },
    {
      key: 'type',
      label: '가/감점',
      width: 120,
      render: (row) => (
        <Select
          variant="text"
          width="fill" /* 셀 전체 폭 — 텍스트 왼쪽·chevron 오른쪽 끝 정렬 */
          options={isPoints ? POINT_TYPES : FIT_TYPES}
          value={(isPoints ? pointsDraft : fitDraft)[row.id]?.type ?? ''}
          onChange={(e) => patchRow(row.id, { type: e.target.value })}
          menuWidth={100}
        />
      ),
    },
    ...(isPoints
      ? [
          {
            key: 'points',
            label: '점수',
            width: 120,
            render: (row) => (
              <span className="flex items-center gap-spacing-4">
                <Input
                  size="32"
                  width={70}
                  value={pointsDraft[row.id]?.points ?? ''}
                  onChange={(e) => patchRow(row.id, { points: digitsOnly(e.target.value) })}
                  inputProps={{ inputMode: 'numeric' }}
                  placeholder="입력"
                />
                <span className="text-14 text-font-icon-5">점</span>
              </span>
            ),
          },
        ]
      : []),
  ];

  return (
    <Modal
      open
      onClose={onClose}
      title="개별설정"
      size="lg"
      confirmText="확인"
      cancelText="취소"
      confirmDisabled={!complete}
      onConfirm={() => onConfirm?.(payload())}
    >
      <div className="flex flex-col gap-spacing-6">
        {/* 일괄 적용(좌) + 모드 탭(우) — 일괄은 표에서 체크한 행에만 같은 값을 채운다(2026-07-16 위치 교체) */}
        <div className="flex items-center justify-between gap-spacing-5">
          <div className="flex items-center gap-spacing-4">
            {isPoints ? (
              <>
                <Select
                  width={90}
                  options={POINT_TYPES}
                  value={bulkType}
                  onChange={(e) => setBulkType(e.target.value)}
                  placeholder="가/감점"
                  disabled={!hasChecked}
                />
                <Input
                  width={70}
                  value={bulkPoints}
                  onChange={(e) => setBulkPoints(digitsOnly(e.target.value))}
                  inputProps={{ inputMode: 'numeric' }}
                  placeholder="입력"
                  disabled={!hasChecked}
                />
                <span className={`text-14 ${hasChecked ? 'text-font-icon-5' : 'text-font-icon-2'}`}>
                  점
                </span>
              </>
            ) : (
              <Select
                width={110}
                options={FIT_TYPES}
                value={bulkType}
                onChange={(e) => setBulkType(e.target.value)}
                placeholder="적합/부적합"
                disabled={!hasChecked}
              />
            )}
            <Button variant="line" size="32" disabled={!bulkReady} onClick={applyBulk}>
              일괄적용
            </Button>
          </div>
          <SegmentedTabs width={200} items={MODE_TABS(fitnessOnly)} value={mode} onChange={changeMode} />
        </div>
        {/* 항목 목록 — 페이지네이션 없이 늘어나는 표(규칙 18: bordered + fill + min-h-0) */}
        <Table
          bordered
          maxHeight="fill"
          className="min-h-0"
          columns={columns}
          rows={items.map((it) => ({ id: it.value, label: it.label }))}
          rowKey="id"
          selectable
          selectedIds={checkedIds}
          onSelectChange={setCheckedIds}
        />
      </div>
    </Modal>
  );
}
