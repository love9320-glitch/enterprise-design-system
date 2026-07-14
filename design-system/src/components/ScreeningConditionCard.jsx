// ScreeningConditionCard — 스크리닝 조건 카드 (Figma ConditionCard, node 8243:88380)
// ⚠️ 내부용(ScreeningBuilderTemplate 전용) 컴포넌트 — 지원자 정보를 조건화할 때 쓰는 카드.
//    독립 데모 페이지 없이 ScreeningBuilderTemplate 데모에서 함께 확인한다.
//
// 구조: [grip + 카드명] + 삭제 버튼 / [조건 셀렉트(fill) + 가/감점 셀렉트(100px)]
//  - 조건 셀렉트  → tab radio list 팝오버(SegmentedTabs + List radio + 취소/저장).
//                   탭 없이 쓰려면 conditionTabs를 생략하고 conditionOptions(평면 배열)를 준다.
//  - 가/감점 셀렉트 → radio list 팝오버(가점/감점=입력+점, 적합/부적합). 선택된 라디오의 입력만 활성.
//  - 두 팝오버 모두 저장 시에만 값이 반영된다(취소/외부 클릭은 폐기).
// 상태: default / hover(CSS) / dragging(drop — 파란 아웃라인·텍스트, DnD 중 유지)
// 색은 condition-card-* 시멘틱 토큰만 사용. 트리거 비주얼은 Select 박스형과 동일 토큰(text-field-*).
import { useState, useRef } from 'react';
import { GripVertical, Trash2, ChevronDown } from 'lucide-react';
import { Popover } from './Popover';
import { PopoverMenu } from './PopoverMenu';
import { SegmentedTabs } from './SegmentedTabs';
import { ListGroup } from './ListGroup';
import { List } from './List';
import { Input } from './Input';
import { Button } from './Button';
import { TruncatingText } from './TruncatingText';

// 가/감점 라디오 항목 — 고정 4종(Figma 플로우 컷 기준)
const SCORE_TYPES = [
  { value: 'plus', label: '가점', hasPoints: true },
  { value: 'minus', label: '감점', hasPoints: true },
  { value: 'fit', label: '적합', hasPoints: false },
  { value: 'unfit', label: '부적합', hasPoints: false },
];
const SCORE_LABEL = Object.fromEntries(SCORE_TYPES.map((t) => [t.value, t.label]));

// 셀렉트형 트리거 — Select 박스형과 같은 비주얼(text-field-* 토큰). 클릭 토글은 Popover가 담당.
function FieldTrigger({ children, placeholder, open }) {
  const filled = children != null && children !== '';
  return (
    <div
      className={`grid min-h-[32px] w-full cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-spacing-4 rounded-round-4 bg-text-field-default-bg py-spacing-3 pl-spacing-6 pr-spacing-6 ring-inset ring-text-field-hover-line transition-shadow hover:ring-2 ${
        open ? 'ring-2 ring-text-field-focused-line' : ''
      }`}
    >
      <TruncatingText
        className={`text-14 ${filled ? 'text-text-field-filled-text' : 'text-text-field-default-text'}`}
      >
        {filled ? children : placeholder}
      </TruncatingText>
      <ChevronDown
        size={16}
        strokeWidth={1.8}
        className={`pointer-events-none shrink-0 text-font-icon-5 transition-transform ${
          open ? 'rotate-180' : ''
        }`}
      />
    </div>
  );
}

export function ScreeningConditionCard({
  cardName = '조건',
  // ── 조건 셀렉트(tab radio list) ─────────────────────────
  conditionTabs = [],          // [{ value, label, disableOptions? }] — 비우면 탭 없는 radio list.
                               // disableOptions 탭(미보유/비대상 등)은 하단 옵션을 disabled로 두고
                               // 옵션 선택 없이 저장 가능(값 = { tab, option: null })
  conditionOptionsByTab = {},  // { [tabValue]: [{ value, label }] }
  conditionOptions = [],       // 탭 없이 쓸 때의 평면 옵션 [{ value, label }]
  conditionValue = null,       // { tab?, option } | null
  onConditionChange,           // (value) => void — 저장 시에만
  conditionPlaceholder = '조건을 선택하세요',
  // ── 가/감점 셀렉트(radio list) ──────────────────────────
  scoreValue = null,           // { type: 'plus'|'minus'|'fit'|'unfit', points?: string } | null
  onScoreChange,               // (value) => void — 저장 시에만
  scorePlaceholder = '가/감점',
  // ── 카드 ────────────────────────────────────────────────
  onDelete,                    // 삭제 버튼 클릭
  dragging = false,            // 드래그 중 — drop 상태(파란 아웃라인·텍스트)
  dragHandleProps = {},        // grip에 전달(onMouseDown 등 — 핸들 시작 제한)
  width = 375,                 // 카드 너비: 숫자(px) | CSS 길이 | 'fill'(부모 전체 폭)
  className = '',
  ...props                     // draggable · onDragStart · onDragOver 등 DnD 이벤트
}) {
  const hasTabs = conditionTabs.length > 0;

  // 팝오버 열림 — controlled로 들고 트리거 chevron 회전·draft 초기화에 사용
  const [condOpen, setCondOpen] = useState(false);
  const [scoreOpen, setScoreOpen] = useState(false);
  // 조건 팝오버 폭 — 기본은 셀렉트(트리거) 폭, 옵션이 길면 내용만큼만 넓어진다(열 때 트리거 폭 측정)
  const condWrapRef = useRef(null);
  const [condMinW, setCondMinW] = useState(0);

  const openCondition = (open) => {
    if (open) setCondMinW(condWrapRef.current?.offsetWidth ?? 0);
    setCondOpen(open);
  };

  // 트리거 표시 텍스트
  const tabLabel = (tab) => conditionTabs.find((t) => t.value === tab)?.label;
  const optLabel = (tab, opt) =>
    (hasTabs ? (conditionOptionsByTab[tab] ?? []) : conditionOptions).find((o) => o.value === opt)
      ?.label;
  const conditionDisplay = conditionValue
    ? hasTabs
      ? conditionValue.option == null
        ? tabLabel(conditionValue.tab) // disableOptions 탭 — 탭 라벨만 표시(예: "미보유")
        : `${tabLabel(conditionValue.tab)}, ${optLabel(conditionValue.tab, conditionValue.option)}`
      : optLabel(undefined, conditionValue.option)
    : null;
  const scoreDisplay = scoreValue
    ? scoreValue.type === 'plus' || scoreValue.type === 'minus'
      ? `${SCORE_LABEL[scoreValue.type]}, ${scoreValue.points}점`
      : SCORE_LABEL[scoreValue.type]
    : null;

  // 카드 상태 — default(+CSS hover) / dragging=drop 변형(Figma state3)
  // 라인은 border(안쪽) 대신 outline(바깥 얹기) — default는 gray-900 알파(배경 투영, 2026-07-16 지시)
  const cardState =
    'outline-condition-card-default-card-line bg-condition-card-default-card-bg text-condition-card-default-card-text hover:outline-condition-card-hover-card-line hover:bg-condition-card-hover-card-bg';

  const widthStyle =
    width === 'fill' ? '100%' : typeof width === 'number' ? `${width}px` : width;

  // 드래그 고스트(마우스 추적 이미지) = drop 변형(Figma state3) — 헤더(grip+카드명)만 남긴 축약형,
  // 파란 아웃라인·텍스트·hug 폭. 목록에 남은 카드는 원래 모습을 유지하고(2026-07-16 지시),
  // dragstart에서 setDragImage로 이 오프스크린 요소를 고스트로 지정한다.
  const ghostRef = useRef(null);
  const handleDragStart = (e) => {
    if (ghostRef.current && e.dataTransfer) {
      try {
        e.dataTransfer.setDragImage(ghostRef.current, 16, 20);
      } catch {
        /* setDragImage 미지원 브라우저 무시 — 기본 고스트 사용 */
      }
    }
    props.onDragStart?.(e);
  };

  return (
    <div
      style={{ width: widthStyle }}
      className={`group/card flex flex-col gap-spacing-5-5 rounded-round-4 outline outline-1 p-spacing-6 shadow-[0_2px_2px_0_rgba(0,0,0,0.12)] transition-colors ${cardState} ${className}`}
      {...props}
      onDragStart={handleDragStart}
      aria-grabbed={dragging || undefined}
    >
      {/* 드래그 고스트 원본 — 화면 밖 고정 배치(display:none이면 setDragImage가 안 먹음) */}
      <div
        ref={ghostRef}
        style={{ position: 'fixed', top: -9999, left: -9999 }}
        className="inline-flex w-fit items-center gap-spacing-4 rounded-round-4 border border-condition-card-drop-outline bg-condition-card-hover-card-bg px-spacing-6 py-spacing-4 text-condition-card-drop-text shadow-[0_2px_2px_0_rgba(0,0,0,0.12)]"
      >
        <GripVertical size={16} strokeWidth={1.8} className="shrink-0" />
        <span className="whitespace-nowrap text-14">{cardName}</span>
      </div>
      {/* 헤더: grip + 카드명 / 삭제 버튼 */}
      <div className="flex w-full items-center justify-between">
        <div className="flex min-w-0 items-center gap-spacing-4">
          {/* 카드 hover 시 grip·카드명은 blue.400(hover-card-text) — group/card로 카드 전체 hover에 연동 */}
          <span
            {...dragHandleProps}
            className="shrink-0 cursor-grab text-condition-card-default-card-text transition-colors group-hover/card:text-condition-card-hover-card-text"
          >
            <GripVertical size={16} strokeWidth={1.8} />
          </span>
          <TruncatingText className="min-w-0 text-14 text-condition-card-default-card-text transition-colors group-hover/card:text-condition-card-hover-card-text">
            {cardName}
          </TruncatingText>
        </div>
        <Button variant="ghost" icon={Trash2} aria-label="카드 삭제" onClick={onDelete} />
      </div>

      {/* 셀렉트 행: 조건(fill) + 가/감점(100px) */}
      <div className="flex w-full items-center gap-spacing-3">
        {/* 조건 셀렉트 → tab radio list 팝오버 — 기본 폭=트리거, 옵션이 길면 팝오버만 확장 */}
        <div ref={condWrapRef} className="min-w-0 flex-1">
        <Popover
          className="w-full"
          menuWidth="max-content"
          open={condOpen}
          onOpenChange={openCondition}
          trigger={<FieldTrigger open={condOpen} placeholder={conditionPlaceholder}>{conditionDisplay}</FieldTrigger>}
        >
          {(close) => (
            <ConditionSettingMenu
              tabs={conditionTabs}
              optionsByTab={conditionOptionsByTab}
              options={conditionOptions}
              initialTab={conditionValue?.tab}
              initialOption={conditionValue?.option}
              style={{ minWidth: condMinW }}
              onCancel={close}
              onSave={(v) => {
                onConditionChange?.(v);
                close();
                setScoreOpen(true); // 저장(클릭·Enter·Tab 모두) → 바로 가/감점 셀렉트 열림(2026-07-14 지시)
              }}
            />
          )}
        </Popover>
        </div>

        {/* 가/감점 셀렉트 → radio list 팝오버 (가점/감점=입력+점, 적합/부적합) */}
        <Popover
          className="w-[100px] shrink-0"
          menuWidth={200}
          placement="auto-right"
          open={scoreOpen}
          onOpenChange={setScoreOpen}
          trigger={<FieldTrigger open={scoreOpen} placeholder={scorePlaceholder}>{scoreDisplay}</FieldTrigger>}
        >
          {(close) => (
            <ScoreSettingMenu
              initialType={scoreValue?.type ?? null}
              initialPoints={scoreValue?.points ?? ''}
              onCancel={close}
              onSave={(v) => {
                onScoreChange?.(v);
                close();
              }}
            />
          )}
        </Popover>
      </div>
    </div>
  );
}

// 조건 설정 메뉴 — tab radio list 팝오버 내용(SegmentedTabs? + 라디오 옵션 + 취소/저장).
// ScreeningConditionCard(조건 셀렉트)와 ScreeningFormula(수식 조건 칩)가 공유한다.
// disableOptions 탭(미보유/비대상)은 옵션 disabled + 옵션 없이 저장 가능.
// Popover children으로 열릴 때마다 마운트되므로 draft는 mount 시 initial*로 시드된다.
// onSave 페이로드: 탭 있으면 { tab, option|null } / 없으면 { option }
export function ConditionSettingMenu({
  tabs = [],
  optionsByTab = {},
  options = [],
  initialTab = null,
  initialOption = null,
  onSave,
  onCancel,
  onTabNext,   // Tab 키 — 저장 후 다음 편집기(값/가감점 팝오버)로 이어가기(2026-07-14 지시)
  style,
}) {
  const hasTabs = tabs.length > 0;
  const [tab, setTab] = useState(initialTab ?? tabs[0]?.value ?? null);
  const [opt, setOpt] = useState(initialOption);
  const rows = hasTabs ? (optionsByTab[tab] ?? []) : options;
  const tabDisables = hasTabs && !!tabs.find((t) => t.value === tab)?.disableOptions;
  const payload = () => (hasTabs ? { tab, option: tabDisables ? null : opt } : { option: opt });
  const complete = tabDisables ? true : !!opt;

  // Tab = 저장하고 바로 다음(값) 등록으로 — 미완성이면 포커스 이탈만 막는다
  const handleTabKey = (e) => {
    if (e.key !== 'Tab' || e.shiftKey || e.defaultPrevented) return;
    e.preventDefault();
    if (!complete) return;
    onSave?.(payload());
    onTabNext?.();
  };

  return (
    <div onKeyDown={handleTabKey}>
    <PopoverMenu
      width="auto"
      style={style}
      footer
      footerButtonsFill
      confirmText="저장"
      confirmDisabled={!complete}
      onCancel={onCancel}
      onConfirm={() => onSave?.(payload())}
    >
      {hasTabs && (
        <div className="w-full bg-list-group-bg p-spacing-5">
          <SegmentedTabs
            items={tabs}
            value={tab}
            onChange={(t) => {
              setTab(t);
              setOpt(null); // 탭이 바뀌면 이전 탭의 선택은 무효
            }}
          />
        </div>
      )}
      <ListGroup gap="3">
        {rows.map((o) => (
          <List
            key={o.value}
            radio
            title={o.label}
            checked={opt === o.value}
            disabled={tabDisables}
            onCheckChange={() => setOpt(o.value)}
          />
        ))}
      </ListGroup>
    </PopoverMenu>
    </div>
  );
}

// 가/감점 설정 메뉴 — radio list 팝오버 내용(가점/감점=입력+점(선택된 라디오만 활성), 적합/부적합, 취소/저장).
// ScreeningConditionCard(가/감점 셀렉트)와 ScreeningFormula(수식 점수 인풋)가 공유한다.
// Popover children으로 열릴 때마다 마운트되므로 draft는 mount 시 initial*로 시드된다.
// onSave 페이로드: { type: 'plus'|'minus'|'fit'|'unfit', points?: string(양수) }
export function ScoreSettingMenu({ initialType = null, initialPoints = '', onSave, onCancel, onTabNext }) {
  const [type, setType] = useState(initialType);
  const [points, setPoints] = useState({
    plus: initialType === 'plus' ? initialPoints : '',
    minus: initialType === 'minus' ? initialPoints : '',
  });
  const needsPoints = type === 'plus' || type === 'minus';
  const pointsValue = needsPoints ? points[type] : '';
  const complete = !!type && (!needsPoints || !!pointsValue.trim());

  // Tab = 저장(+다음이 있으면 이어가기) — 미완성이면 포커스 이탈만 막는다
  const handleTabKey = (e) => {
    if (e.key !== 'Tab' || e.shiftKey || e.defaultPrevented) return;
    e.preventDefault();
    if (!complete) return;
    onSave?.(needsPoints ? { type, points: pointsValue.trim() } : { type });
    onTabNext?.();
  };

  // 가점 입력칸+단위 — 해당 라디오가 선택됐을 때만 활성(List rightSlot, 행 클릭과 분리)
  const pointsSlot = (key) => (
    <span className="flex shrink-0 items-center gap-spacing-5" onClick={(e) => e.stopPropagation()}>
      <Input
        width={56}
        value={points[key]}
        disabled={type !== key}
        onChange={(e) => setPoints((p) => ({ ...p, [key]: e.target.value }))}
        inputProps={{ inputMode: 'numeric' }}
        placeholder="0"
      />
      <span className={`text-14 ${type === key ? 'text-list-default-text' : 'text-list-disabled-text'}`}>
        점
      </span>
    </span>
  );

  return (
    <div onKeyDown={handleTabKey}>
    <PopoverMenu
      width="100%"
      footer
      footerButtonsFill
      confirmText="저장"
      confirmDisabled={!complete}
      onCancel={onCancel}
      onConfirm={() =>
        onSave?.(needsPoints ? { type, points: pointsValue.trim() } : { type })
      }
    >
      <ListGroup gap="3">
        {SCORE_TYPES.map((t) => (
          <List
            key={t.value}
            radio
            title={t.label}
            checked={type === t.value}
            onCheckChange={() => setType(t.value)}
            rightSlot={t.hasPoints ? pointsSlot(t.value) : undefined}
          />
        ))}
      </ListGroup>
    </PopoverMenu>
    </div>
  );
}
