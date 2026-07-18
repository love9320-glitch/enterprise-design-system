// ScreeningConditionCard — 스크리닝 조건 카드 (Figma ConditionCard, node 8243:88380)
// ⚠️ 내부용(ScreeningBuilderTemplate 전용) 컴포넌트 — 지원자 정보를 조건화할 때 쓰는 카드.
//    독립 데모 페이지 없이 ScreeningBuilderTemplate 데모에서 함께 확인한다.
//
// 구조: [grip + 카드명] + 삭제 버튼 / [조건 셀렉트(fill) + 가/감점 셀렉트(100px)]
//  - 조건 셀렉트  → tab radio list 팝오버(SegmentedTabs + List radio + 취소/저장).
//                   탭 없이 쓰려면 conditionTabs를 생략하고 conditionOptions(평면 배열)를 준다.
//                   탭에 multiSelect(지정 탭)가 있으면 라디오 대신 다중 선택 Select(검색+확인 푸터)가
//                   나오고, 저장 시 { tab, items:[…] } — 가/감점 셀렉트 자리가 '개별설정' 버튼으로
//                   바뀌어 항목별 가/감점(또는 적합/부적합)+적용 함수를 모달로 설정한다(Figma 8532:4188~).
//  - 가/감점 셀렉트 → radio list 팝오버(가점/감점=입력+점, 적합/부적합). 선택된 라디오의 입력만 활성.
//  - 두 팝오버 모두 저장 시에만 값이 반영된다(취소/외부 클릭은 폐기).
// 상태: default / hover(CSS) / dragging(drop — 파란 아웃라인·텍스트, DnD 중 유지)
// 색은 condition-card-* 시멘틱 토큰만 사용. 트리거 비주얼은 Select 박스형과 동일 토큰(text-field-*).
import { useState, useRef } from 'react';
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  DragEvent as ReactDragEvent,
  HTMLAttributes,
  ReactNode,
} from 'react';
import { GripVertical, Trash2, ChevronDown, Settings } from 'lucide-react';
import { Popover } from './Popover';
import { PopoverMenu } from './PopoverMenu';
import { SegmentedTabs } from './SegmentedTabs';
import { ListGroup } from './ListGroup';
import { List } from './List';
import { Input } from './Input';
import { Button } from './Button';
import { TruncatingText } from './TruncatingText';
import { Select } from './Select';
import { ScreeningIndividualSettingModal } from './ScreeningIndividualSettingModal';
import { focusNextChainStop, chainTriggerKey } from './formulaFunctions';
import type { ConditionTab, IndividualSetting, OptionItem } from './formulaFunctions';
import { usePanelKeyboard } from './usePanelKeyboard';

// 조건 값/저장 페이로드 — 탭 있으면 { tab, option|null }, 지정(복수)이면 { tab, option:null, items }, 탭 없으면 { option }
export interface ScreeningConditionValue {
  tab?: string | null;
  option?: string | null;
  items?: string[];
}
// 가/감점 값 — 단일(가점/감점/적합/부적합) 또는 복수 조건의 개별설정(IndividualSetting)
export type ScreeningScoreValue = { type: string; points?: string } | IndividualSetting;

// 가/감점 라디오 항목 — 고정 4종(Figma 플로우 컷 기준)
const SCORE_TYPES: { value: 'plus' | 'minus' | 'fit' | 'unfit'; label: string; hasPoints: boolean }[] = [
  { value: 'plus', label: '가점', hasPoints: true },
  { value: 'minus', label: '감점', hasPoints: true },
  { value: 'fit', label: '적합', hasPoints: false },
  { value: 'unfit', label: '부적합', hasPoints: false },
];
const SCORE_LABEL = Object.fromEntries(SCORE_TYPES.map((t) => [t.value, t.label]));

// 셀렉트형 트리거 — Select 박스형과 같은 비주얼(text-field-* 토큰). 클릭 토글은 Popover가 담당.
function FieldTrigger({
  children,
  placeholder,
  open,
}: {
  children?: ReactNode;
  placeholder?: ReactNode;
  open?: boolean;
}) {
  const filled = children != null && children !== '';
  return (
    <div
      // 포커스=호버(2026-07-16): 포커스는 래퍼(Popover, group/fieldstop)가 받으므로 group 변형으로
      // hover와 같은 인셋 2px 링을 켠다(키보드 focus-visible + 체인 data-chain-focus, 클릭은 표시 없음)
      className={`grid min-h-[32px] w-full cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-spacing-4 rounded-round-4 bg-text-field-default-bg py-spacing-3 pl-spacing-6 pr-spacing-6 ring-inset ring-text-field-hover-line transition-shadow hover:ring-2 group-focus-visible/fieldstop:ring-2 group-data-[chain-focus]/fieldstop:ring-2 ${
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

interface ScreeningConditionCardProps extends ComponentPropsWithoutRef<'div'> {
  cardName?: string;
  // ── 조건 셀렉트(tab radio list) ─────────────────────────
  // conditionTabs — 비우면 탭 없는 radio list.
  // disableOptions 탭(미보유/비대상 등)은 하단 옵션을 disabled로 두고
  // 옵션 선택 없이 저장 가능(값 = { tab, option: null })
  conditionTabs?: ConditionTab[];
  conditionOptionsByTab?: Record<string, OptionItem[]>; // { [tabValue]: [{ value, label }] }
  conditionOptions?: OptionItem[]; // 탭 없이 쓸 때의 평면 옵션 [{ value, label }]
  conditionValue?: ScreeningConditionValue | null; // { tab?, option } | null
  onConditionChange?: (value: ScreeningConditionValue) => void; // 저장 시에만
  conditionPlaceholder?: string;
  // ── 가/감점 셀렉트(radio list) ──────────────────────────
  scoreValue?: ScreeningScoreValue | null; // { type: 'plus'|'minus'|'fit'|'unfit', points?: string } | null
  onScoreChange?: (value: ScreeningScoreValue) => void; // 저장 시에만
  scorePlaceholder?: string;
  // ── 카드 ────────────────────────────────────────────────
  onDelete?: () => void; // 삭제 버튼 클릭
  dragging?: boolean; // 드래그 중 — drop 상태(파란 아웃라인·텍스트)
  dragHandleProps?: HTMLAttributes<HTMLSpanElement>; // grip에 전달(onMouseDown 등 — 핸들 시작 제한)
  width?: number | string; // 카드 너비: 숫자(px) | CSS 길이 | 'fill'(부모 전체 폭)
  // ...props — draggable · onDragStart · onDragOver 등 DnD 이벤트
}

export function ScreeningConditionCard({
  cardName = '조건',
  conditionTabs = [],
  conditionOptionsByTab = {},
  conditionOptions = [],
  conditionValue = null,
  onConditionChange,
  conditionPlaceholder = '조건을 선택하세요',
  scoreValue = null,
  onScoreChange,
  scorePlaceholder = '가/감점',
  onDelete,
  dragging = false,
  dragHandleProps = {},
  width = 375,
  className = '',
  ...props
}: ScreeningConditionCardProps) {
  const hasTabs = conditionTabs.length > 0;
  // 복수 조건(지정) — multiSelect 탭이 있는 카드. 지정 값이 저장되면 가/감점 자리가 '개별설정' 버튼이 된다.
  const multiTab = conditionTabs.find((t) => t.multiSelect);
  const multiOptions = multiTab ? (conditionOptionsByTab[multiTab.value] ?? []) : [];
  const isMultiValue = !!conditionValue?.items?.length;

  // 팝오버 열림 — controlled로 들고 트리거 chevron 회전·draft 초기화에 사용
  const [condOpen, setCondOpen] = useState(false);
  const [scoreOpen, setScoreOpen] = useState(false);
  // 개별설정 모달(복수 조건 전용) — 열 때마다 마운트해 draft를 카드 값으로 시드
  const [indivOpen, setIndivOpen] = useState(false);
  const indivBtnRef = useRef<HTMLSpanElement | null>(null);
  // 조건 팝오버 폭 — 기본은 셀렉트(트리거) 폭, 옵션이 길면 내용만큼만 넓어진다(열 때 트리거 폭 측정)
  const condWrapRef = useRef<HTMLDivElement | null>(null);
  const [condMinW, setCondMinW] = useState(0);

  const openCondition = (open: boolean) => {
    if (open) setCondMinW(condWrapRef.current?.offsetWidth ?? 0);
    setCondOpen(open);
  };

  // 트리거 표시 텍스트
  const tabLabel = (tab?: string | null) => conditionTabs.find((t) => t.value === tab)?.label;
  const optLabel = (tab?: string | null, opt?: string | null) =>
    (hasTabs ? (conditionOptionsByTab[tab as string] ?? []) : conditionOptions).find(
      (o) => o.value === opt,
    )?.label;
  const conditionDisplay = conditionValue
    ? isMultiValue
      ? multiOptions // 지정 — 선택 항목 라벨을 옵션 순서로 나열(Figma 8535:9887)
          .filter((o) => conditionValue.items?.includes(o.value))
          .map((o) => o.label)
          .join(', ')
      : hasTabs
        ? conditionValue.option == null
          ? tabLabel(conditionValue.tab) // disableOptions 탭 — 탭 라벨만 표시(예: "미보유")
          : `${tabLabel(conditionValue.tab)}, ${optLabel(conditionValue.tab, conditionValue.option)}`
        : optLabel(undefined, conditionValue.option)
    : null;
  const scoreDisplay = scoreValue
    ? scoreValue.type === 'plus' || scoreValue.type === 'minus'
      ? `${SCORE_LABEL[scoreValue.type]}, ${(scoreValue as { points?: string }).points}점`
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
  const ghostRef = useRef<HTMLDivElement | null>(null);
  const handleDragStart = (e: ReactDragEvent<HTMLDivElement>) => {
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
        {/* 조건 셀렉트 → tab radio list 팝오버 — 기본 폭=트리거, 옵션이 길면 팝오버만 확장.
            체인 정거장(data-formula-chain): Tab/Enter로 열고, 가/감점 저장 시 다음 카드로 이동 */}
        <div ref={condWrapRef} data-formula-chain className="min-w-0 flex-1">
        <Popover
          className="group/fieldstop w-full rounded-round-4 focus:outline-none"
          tabIndex={0}
          onKeyDown={(e) => chainTriggerKey(e, condOpen, () => openCondition(true))}
          menuWidth={multiTab ? 351 : 'max-content'} /* 복수 조건 카드는 고정 폭(2026-07-16 지시) */
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
              initialItems={conditionValue?.items}
              style={{ minWidth: condMinW }}
              onCancel={close}
              onSave={(v) => {
                onConditionChange?.(v);
                close();
                if (v.items) {
                  // 지정 저장 — 가/감점 자리가 '개별설정' 버튼으로 바뀌므로 그 버튼에 포커스(체인 유지)
                  setTimeout(() => indivBtnRef.current?.querySelector('button')?.focus(), 0);
                } else {
                  setScoreOpen(true); // 저장(클릭·Enter·Tab 모두) → 바로 가/감점 셀렉트 열림(2026-07-14 지시)
                }
              }}
              onSkip={() => {
                close();
                focusNextChainStop(condWrapRef.current); // 값 미선택 이탈 — 다음 카드로
              }}
            />
          )}
        </Popover>
        </div>

        {/* 가/감점 자리 — 복수 조건(지정)이 저장되면 '개별설정' 아이콘 텍스트 버튼으로 바뀐다(Figma 8535:9887) */}
        {isMultiValue ? (
          <span ref={indivBtnRef} className="shrink-0">
            <Button variant="line" size="32" leftIcon={Settings} onClick={() => setIndivOpen(true)}>
              개별설정
            </Button>
            {indivOpen && (
              <ScreeningIndividualSettingModal
                items={multiOptions.filter((o) => conditionValue?.items?.includes(o.value))}
                value={scoreValue?.type === 'individual' ? (scoreValue as IndividualSetting) : null}
                onClose={() => setIndivOpen(false)}
                onConfirm={(v) => {
                  onScoreChange?.(v);
                  setIndivOpen(false);
                  // 카드 세팅 완료 — 체인 규약대로 다음 정거장(다음 카드)으로
                  focusNextChainStop(condWrapRef.current);
                }}
              />
            )}
          </span>
        ) : (
        <Popover
          className="group/fieldstop w-[100px] shrink-0 rounded-round-4 focus:outline-none"
          tabIndex={0}
          onKeyDown={(e) => chainTriggerKey(e, scoreOpen, () => setScoreOpen(true))}
          menuWidth={200}
          placement="auto-right"
          open={scoreOpen}
          onOpenChange={setScoreOpen}
          trigger={<FieldTrigger open={scoreOpen} placeholder={scorePlaceholder}>{scoreDisplay}</FieldTrigger>}
        >
          {(close) => (
            <ScoreSettingMenu
              initialType={scoreValue?.type ?? null}
              initialPoints={(scoreValue as { points?: string } | null)?.points ?? ''}
              onCancel={close}
              onSave={(v) => {
                onScoreChange?.(v);
                close();
                // 카드 세팅 완료 — 체인 규약대로 다음 정거장(다음 카드 조건 셀렉트)으로
                focusNextChainStop(condWrapRef.current);
              }}
              onSkip={() => {
                close();
                focusNextChainStop(condWrapRef.current); // 미선택 이탈 — 다음 카드로
              }}
            />
          )}
        </Popover>
        )}
      </div>
    </div>
  );
}

// 조건 설정 메뉴 — tab radio list 팝오버 내용(SegmentedTabs? + 라디오 옵션 + 취소/저장).
// ScreeningConditionCard(조건 셀렉트)와 ScreeningFormula(수식 조건 칩)가 공유한다.
// disableOptions 탭(미보유/비대상)은 옵션 disabled + 옵션 없이 저장 가능.
// Popover children으로 열릴 때마다 마운트되므로 draft는 mount 시 initial*로 시드된다.
// onSave 페이로드: 탭 있으면 { tab, option|null } / 없으면 { option }
interface ConditionSettingMenuProps {
  tabs?: ConditionTab[];
  optionsByTab?: Record<string, OptionItem[]>;
  options?: OptionItem[];
  initialTab?: string | null;
  initialOption?: string | null;
  initialItems?: string[] | null; // multiSelect 탭의 저장된 항목 배열(지정된 자격증 등)
  onSave?: (v: ScreeningConditionValue) => void;
  onCancel?: () => void;
  onTabNext?: () => void; // Tab 키 — 저장 후 다음 편집기(값/가감점 팝오버)로 이어가기(2026-07-14 지시)
  onSkip?: () => void; // 값 미선택 상태로 Tab 이탈 — 저장 없이 닫고 다음 정거장으로(2026-07-15)
  style?: CSSProperties;
}

export function ConditionSettingMenu({
  tabs = [],
  optionsByTab = {},
  options = [],
  initialTab = null,
  initialOption = null,
  initialItems = null,
  onSave,
  onCancel,
  onTabNext,
  onSkip,
  style,
}: ConditionSettingMenuProps) {
  const hasTabs = tabs.length > 0;
  const [tab, setTab] = useState<string | null>(initialTab ?? tabs[0]?.value ?? null);
  const [opt, setOpt] = useState<string | null>(initialOption);
  // multiSelect 탭(지정) — 라디오 대신 다중 선택 Select. 다른 탭에서는 같은 Select를 disabled로 보여준다.
  const multiTab = tabs.find((t) => t.multiSelect);
  const onMultiTab = multiTab && tab === multiTab.value;
  const [items, setItems] = useState<string[]>(() =>
    initialTab === multiTab?.value ? (initialItems ?? []) : [],
  );
  const rows = hasTabs ? (optionsByTab[tab as string] ?? []) : options;
  const tabDisables = hasTabs && !!tabs.find((t) => t.value === tab)?.disableOptions;
  const payload = (): ScreeningConditionValue =>
    multiTab
      ? onMultiTab
        ? { tab, option: null, items }
        : { tab, option: null } // 보유/미보유 — 종류 상관없이 적용(옵션 없이 저장)
      : hasTabs
        ? { tab, option: tabDisables ? null : opt }
        : { option: opt };
  const complete = multiTab ? (onMultiTab ? items.length > 0 : true) : tabDisables ? true : !!opt;
  // 패널 포커스 + 경계 Tab 처리(규칙 20 ⑶⑷) — 공용 훅. 라디오 선택은 Space(네이티브), 확인은 Enter.
  const { menuRef, handleTabKey } = usePanelKeyboard({
    complete,
    onCommit: () => {
      onSave?.(payload());
      onTabNext?.();
    },
    onSkip, // 값 미선택 이탈 — 저장 없이 닫고 다음 정거장(다음 카드/수식)으로
  });

  return (
    <div ref={menuRef} tabIndex={-1} className="outline-none" onKeyDown={handleTabKey}>
    <PopoverMenu
      width={multiTab ? 351 : 'auto'} /* 복수 조건 메뉴는 고정 폭 — 항목 라벨 길이에 따라 출렁이지 않게 */
      style={multiTab ? undefined : style}
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
            onChange={(t: string) => {
              setTab(t);
              setOpt(null); // 탭이 바뀌면 이전 탭의 선택은 무효
            }}
          />
        </div>
      )}
      {multiTab ? (
        /* 복수 조건 — 항목 다중 선택 Select(검색+전체 선택/취소/확인 푸터). 지정 탭에서만 활성(Figma 8535:8591).
           PopoverMenu 루트 배경은 gray.100(블록 구분선용)이라 블록마다 흰 배경(list-group-bg)을 직접 깐다 */
        <div className="w-full bg-list-group-bg p-spacing-5">
          <Select
            width="100%"
            multiple
            confirm
            searchable
            options={optionsByTab[multiTab.value] ?? []}
            value={items}
            onChange={(e) => setItems(e.target.value)}
            disabled={!onMultiTab}
            placeholder={multiTab.placeholder ?? '선택하세요'}
            searchPlaceholder={multiTab.searchPlaceholder ?? '검색어를 입력하세요'}
          />
        </div>
      ) : (
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
      )}
    </PopoverMenu>
    </div>
  );
}

// 가/감점 설정 메뉴 — radio list 팝오버 내용(가점/감점=입력+점(선택된 라디오만 활성), 적합/부적합, 취소/저장).
// ScreeningConditionCard(가/감점 셀렉트)와 ScreeningFormula(수식 점수 인풋)가 공유한다.
// Popover children으로 열릴 때마다 마운트되므로 draft는 mount 시 initial*로 시드된다.
// onSave 페이로드: { type: 'plus'|'minus'|'fit'|'unfit', points?: string(양수) }
interface ScoreSettingMenuProps {
  initialType?: string | null;
  initialPoints?: string;
  disablePoints?: boolean; // 가점/감점 라디오 비활성 — IF 함수 안 조건은 적합/부적합만(2026-07-16)
  onSave?: (v: { type: string; points?: string }) => void;
  onCancel?: () => void;
  onTabNext?: () => void;
  onSkip?: () => void;
}

export function ScoreSettingMenu({
  initialType = null,
  initialPoints = '',
  disablePoints = false,
  onSave,
  onCancel,
  onTabNext,
  onSkip,
}: ScoreSettingMenuProps) {
  const [type, setType] = useState<string | null>(initialType);
  const [points, setPoints] = useState<Record<'plus' | 'minus', string>>({
    plus: initialType === 'plus' ? initialPoints : '',
    minus: initialType === 'minus' ? initialPoints : '',
  });
  const needsPoints = type === 'plus' || type === 'minus';
  const pointsValue = needsPoints ? points[type as 'plus' | 'minus'] : '';
  const complete = !!type && (!needsPoints || !!pointsValue.trim());
  // 패널 포커스 + 경계 Tab 처리(규칙 20 ⑶⑷) — 공용 훅
  const { menuRef, handleTabKey } = usePanelKeyboard({
    complete,
    onCommit: () => {
      onSave?.(needsPoints ? { type, points: pointsValue.trim() } : { type: type as string });
      onTabNext?.();
    },
    onSkip, // 미선택 이탈 — 닫고 다음 정거장으로
  });

  // 가점/감점 라디오 선택 시 점수 입력 자동 포커스(선택 직후 바로 타이핑)
  const onTypeSelect = (value: string, hasPoints: boolean) => {
    setType(value);
    if (hasPoints) {
      setTimeout(() => menuRef.current?.querySelector<HTMLInputElement>('input[inputmode]:not([disabled])')?.focus(), 0);
    }
  };

  // 가점 입력칸+단위 — 해당 라디오가 선택됐을 때만 활성(List rightSlot, 행 클릭과 분리)
  const pointsSlot = (key: 'plus' | 'minus') => (
    <span className="flex shrink-0 items-center gap-spacing-5" onClick={(e) => e.stopPropagation()}>
      <Input
        width={56}
        value={points[key]}
        disabled={type !== key}
        // 점수는 숫자만 입력 허용(2026-07-16 지시)
        onChange={(e) => setPoints((p) => ({ ...p, [key]: e.target.value.replace(/[^0-9]/g, '') }))}
        inputProps={{ inputMode: 'numeric' }}
        placeholder="0"
      />
      <span className={`text-14 ${type === key ? 'text-list-default-text' : 'text-list-disabled-text'}`}>
        점
      </span>
    </span>
  );

  return (
    <div ref={menuRef} tabIndex={-1} className="outline-none" onKeyDown={handleTabKey}>
    <PopoverMenu
      width="100%"
      footer
      footerButtonsFill
      confirmText="저장"
      confirmDisabled={!complete}
      onCancel={onCancel}
      onConfirm={() =>
        onSave?.(needsPoints ? { type, points: pointsValue.trim() } : { type: type as string })
      }
    >
      <ListGroup gap="3">
        {SCORE_TYPES.map((t) => {
          const rowDisabled = disablePoints && t.hasPoints; // IF 안 조건 — 가점/감점 선택 불가
          return (
            <List
              key={t.value}
              radio
              title={t.label}
              checked={type === t.value}
              disabled={rowDisabled}
              onCheckChange={rowDisabled ? undefined : () => onTypeSelect(t.value, t.hasPoints)}
              rightSlot={t.hasPoints ? pointsSlot(t.value as 'plus' | 'minus') : undefined}
            />
          );
        })}
      </ListGroup>
    </PopoverMenu>
    </div>
  );
}
