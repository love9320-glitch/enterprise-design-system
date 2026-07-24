// ConditionOrderSlot / ConditionSlotCard — 조건 정렬 슬롯
// (Figma ConditionSlotCard 8219:80364 / ConditionOrderSlot 8219:80583 — condition-slot-* 토큰)
//
// 카드(ConditionSlotCard): [⠿ grip + "조건 N."] … [Switch] 헤더 + 세부 Select 스택(children).
//   - 세부 select는 children으로 필요만큼 추가한다(2개 고정 아님).
//   - state: default / hover(CSS) / pressed — pressed는 드래그 앤 드롭 중 유지되는 상태
//     (blue.400 라인·텍스트·아이콘, 2026-07-07 지시).
// 컨테이너(ConditionOrderSlot): 회색 슬롯(bg gray.50, p 12) 안에 카드들을 배치하고 사이에 커넥터.
//   - direction: 'vertical'(↓ 커넥터) | 'horizontal'(› 커넥터) — 레이아웃 전환
//   - 드래그 앤 드롭(grip에서만 시작)으로 카드 순서 변경
//   - 카드별 Switch로 사용/미사용 — 미사용 카드는 적용 순번에서 빠지고 다음 조건이 번호를
//     당겨받는다(카드의 물리적 위치는 유지). 제목 번호는 표시 순서상 '사용 중' 카드 기준 1..k
//     자동 부여, 미사용 카드는 "조건 미사용"으로 표기(2026-07-23, 구 "조건 -.").
//   - items 배열로 조건 카드를 필요만큼 추가한다.
import { Children, Fragment, cloneElement, isValidElement, useRef, useState } from 'react';
import type {
  ComponentPropsWithoutRef,
  DragEvent as ReactDragEvent,
  HTMLAttributes,
  ReactElement,
  ReactNode,
} from 'react';
import { ChevronDown, ChevronRight, GripVertical } from 'lucide-react';
import { Switch } from './Switch';
import { useHoverTooltip } from './useHoverTooltip';

// 미사용(스위치 off) 카드의 세부 컨트롤에 disabled를 강제 주입한다(2026-07-07 지시).
// body를 <>…</>(fragment)로 감싸 넘기는 경우가 많아 fragment는 한 겹씩 펴서 내려간다.
function withDisabled(nodes: ReactNode): ReactNode {
  return Children.map(nodes, (c) => {
    if (!isValidElement(c)) return c;
    if (c.type === Fragment)
      return <Fragment>{withDisabled((c.props as { children?: ReactNode }).children)}</Fragment>;
    return cloneElement(c as ReactElement<{ disabled?: boolean }>, { disabled: true });
  });
}

// 카드 상태별 클래스 — hover는 CSS, pressed(드래그 중)는 상태로 적용. 아이콘·텍스트는 currentColor 상속.
const CARD_DEFAULT =
  'border-condition-slot-card-default-line bg-condition-slot-card-default-bg text-condition-slot-card-default-text ' +
  'hover:border-condition-slot-card-hover-line hover:bg-condition-slot-card-hover-bg hover:text-condition-slot-card-hover-text';
const CARD_PRESSED =
  'border-condition-slot-card-pressed-line bg-condition-slot-card-pressed-bg text-condition-slot-card-pressed-text';

interface ConditionSlotCardProps extends ComponentPropsWithoutRef<'div'> {
  title?: string; // 헤더 제목 — 컨테이너가 활성 순번으로 자동 부여
  enabled?: boolean; // 사용/미사용(Switch) — 미사용이면 제목 dim + 세부 영역 반투명
  onEnabledChange?: (checked: boolean) => void;
  switchDisabled?: boolean; // 사용/미사용 스위치 잠금 — 현재 상태 그대로 변경 불가(2026-07-23)
  switchDisabledTooltip?: ReactNode; // 잠금 사유 — 잠긴 스위치 hover 시 툴팁으로 표시
  dragDisabled?: boolean; // 드래그 잠금(2026-07-23) — grip 아이콘 disabled 색 + 드래그 시작 안 됨
  showHeader?: boolean; // false면 헤더 행(grip·제목·스위치) 전체 숨김 — 기준만 고르는 단순 카드(2026-07-24, B타입)
  dragging?: boolean; // pressed 상태(드래그 앤 드롭 중 유지)
  width?: number | string; // Figma 기본 202px — 숫자(px) | CSS 길이 | 'fill'(부모 flex에서 균등 분할, 2026-07-24)
  dragHandleProps?: HTMLAttributes<HTMLSpanElement> | null; // grip에 붙는 핸들러(컨테이너가 주입 — 드래그 시작 허용 판정)
  children?: ReactNode; // 세부 Select들(세로 스택 gap 4=spacing-3) — 필요만큼 추가
}

export function ConditionSlotCard({
  title = '조건 1.',
  enabled = true,
  onEnabledChange,
  switchDisabled = false,
  switchDisabledTooltip,
  dragDisabled = false,
  showHeader = true,
  dragging = false,
  width = 202,
  dragHandleProps = null,
  children,
  className = '',
  ...props
}: ConditionSlotCardProps) {
  // 잠금 사유 툴팁 — 잠겨 있을 때만 활성(disabled input은 이벤트가 안 나가므로 감싼 span에서 감지)
  const lockTip = useHoverTooltip(switchDisabled ? switchDisabledTooltip : null);

  // 드래그 고스트(2026-07-23 지시 — 수식 조건 카드와 동일 스타일): 전체 카드 스냅샷 대신
  // 헤더(grip+제목)만 남긴 축약형·파란 아웃라인/텍스트(condition-card drop 토큰 공유).
  // dragstart에서 setDragImage로 오프스크린 원본을 고스트로 지정(ScreeningConditionCard와 같은 패턴).
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
      style={width === 'fill' ? undefined : { width: typeof width === 'number' ? `${width}px` : width }}
      // 헤더 있는 카드: 상단 패딩 8(pt-spacing-5, 나머지 12)·헤더↔셀렉트 gap 8 — 2026-07-23 지시(구 12/12).
      // 헤더 없는 카드(B타입): 4 균일(구 12→8→4)·그림자 없음 — 2026-07-24 지시. width='fill'이면 flex-1 균등 분할
      className={`flex ${width === 'fill' ? 'min-w-0 flex-1' : 'shrink-0'} flex-col gap-spacing-5 rounded-round-4 border ${showHeader ? 'p-spacing-6 pt-spacing-5 shadow-[0_2px_2px_0_rgba(0,0,0,0.12)]' : 'p-spacing-3'} transition-colors ${
        dragging ? CARD_PRESSED : CARD_DEFAULT
      } ${className}`}
      {...props}
      onDragStart={handleDragStart}
    >
      {/* 드래그 고스트 원본 — 화면 밖 고정 배치(display:none이면 setDragImage가 안 먹음) */}
      <div
        ref={ghostRef}
        style={{ position: 'fixed', top: -9999, left: -9999 }}
        className="inline-flex w-fit items-center gap-spacing-4 rounded-round-4 border border-condition-card-drop-outline bg-condition-card-hover-card-bg px-spacing-6 py-spacing-4 text-condition-card-drop-text shadow-[0_2px_2px_0_rgba(0,0,0,0.12)]"
      >
        <GripVertical size={16} strokeWidth={1.8} className="shrink-0" />
        <span className="whitespace-nowrap text-14">{title}</span>
      </div>
      {showHeader && (
      <div className="flex w-full items-center justify-between gap-spacing-4">
        <div className="flex min-w-0 items-center gap-spacing-4">
          <span
            aria-label="순서 변경"
            aria-disabled={dragDisabled || undefined}
            className={`flex shrink-0 items-center ${
              dragDisabled
                ? 'cursor-not-allowed text-condition-slot-card-disabled-icon'
                : 'cursor-grab active:cursor-grabbing'
            }`}
            {...(dragDisabled ? {} : dragHandleProps || {})}
          >
            <GripVertical size={16} strokeWidth={1.8} />
          </span>
          <span className={`truncate text-14 ${enabled ? '' : 'text-font-icon-3'}`}>{title}</span>
        </div>
        <span className="flex shrink-0" onMouseEnter={lockTip.onMouseEnter} onMouseLeave={lockTip.onMouseLeave}>
          <Switch checked={enabled} disabled={switchDisabled} onChange={(e) => onEnabledChange?.(e.target.checked)} />
        </span>
        {lockTip.tooltip}
      </div>
      )}
      {/* 세부 select 스택(gap 4px=spacing-3, Figma Slot) —
          미사용(스위치 off)이면 자식 컨트롤에 disabled를 주입해 Select 자체 disabled 상태로 표시(값은 보존) */}
      <div className="flex w-full flex-col gap-spacing-3">
        {enabled ? children : withDisabled(children)}
      </div>
    </div>
  );
}

// 조건 카드 항목 — [{ id, body }] — body=카드 안 세부 Select들(ReactNode)
interface ConditionOrderItem {
  id: string;
  body?: ReactNode;
}

interface ConditionOrderSlotProps extends ComponentPropsWithoutRef<'div'> {
  items?: ConditionOrderItem[];
  direction?: 'vertical' | 'horizontal'; // 'vertical'(↓) | 'horizontal'(›)
  order?: string[]; // id[] — 카드 배치 순서(controlled). DnD로 변경
  defaultOrder?: string[]; // 초기 순서(uncontrolled) — 미지정 시 items 순서
  onOrderChange?: (ids: string[]) => void;
  enabledIds?: string[]; // id[] — 사용 중 조건(controlled)
  onEnabledChange?: (nextEnabledIds: string[], info: { id: string; enabled: boolean }) => void;
  switchesDisabled?: boolean; // 모든 카드의 사용/미사용 스위치 잠금(현재 상태 유지 — 2026-07-23)
  switchesDisabledTooltip?: ReactNode; // 잠금 사유 — 잠긴 스위치 hover 시 툴팁
  dragDisabled?: boolean; // 카드 드래그 정렬 잠금(2026-07-23) — grip disabled 색·드래그 시작 안 됨
  showCardHeaders?: boolean; // false면 모든 카드의 헤더(grip·제목·스위치) 숨김 — 드래그·사용 전환 비활성(2026-07-24, B타입)
  titlePrefix?: string; // 카드 제목 접두("조건 N.")
  cardWidth?: number | string;
}

export function ConditionOrderSlot({
  items = [],
  direction = 'vertical',
  order,
  defaultOrder,
  onOrderChange,
  enabledIds,
  onEnabledChange,
  switchesDisabled = false,
  switchesDisabledTooltip,
  dragDisabled = false,
  showCardHeaders = true,
  titlePrefix = '조건',
  cardWidth = 202,
  className = '',
  ...props
}: ConditionOrderSlotProps) {
  const vertical = direction === 'vertical';
  const ids = items.map((it) => it.id);

  // 순서 — controlled/uncontrolled. 렌더 파생으로 items 변동(카드 추가/삭제)을 보정:
  // 사라진 id는 제거, 새 id는 뒤에 붙는다(비동기/동적 추가 대응).
  const orderControlled = order !== undefined;
  const [internalOrder, setInternalOrder] = useState<string[] | null>(defaultOrder ?? null);
  const rawOrder = orderControlled ? order : (internalOrder ?? ids);
  const effOrder = [
    ...rawOrder.filter((id) => ids.includes(id)),
    ...ids.filter((id) => !rawOrder.includes(id)),
  ];

  // 사용/미사용 — 내부적으로는 '미사용 목록'으로 추적해 새로 추가된 카드가 기본 사용 상태가 되게 한다.
  const enControlled = enabledIds !== undefined;
  const [internalDisabled, setInternalDisabled] = useState<string[]>([]);
  const isEnabled = (id: string) =>
    enControlled ? enabledIds.includes(id) : !internalDisabled.includes(id);
  const toggleEnabled = (id: string, next: boolean) => {
    if (!enControlled) {
      setInternalDisabled((prev) => (next ? prev.filter((d) => d !== id) : [...prev, id]));
    }
    const nextEnabled = effOrder.filter((oid) => (oid === id ? next : isEnabled(oid)));
    onEnabledChange?.(nextEnabled, { id, enabled: next });
  };

  // 드래그 앤 드롭 — grip에서만 시작(allowDragRef), 드래그 중 카드가 pressed 상태를 유지하고
  // 다른 카드 위로 들어가면 그 자리로 라이브 재배치된다.
  const [dragId, setDragId] = useState<string | null>(null);
  const allowDragRef = useRef(false);
  const moveTo = (srcId: string, dstId: string) => {
    if (srcId === dstId) return;
    const si = effOrder.indexOf(srcId);
    const di = effOrder.indexOf(dstId);
    if (si < 0 || di < 0) return;
    // 이동 방향에 따라 hover 카드의 앞/뒤에 삽입한다. 항상 '앞'에 꽂으면 앞→뒤 이동 시
    // src 제거로 dst가 한 칸 당겨져 제자리에 되꽂혀 순서가 안 바뀐다(2026-07-07 사용자 지적).
    const next = effOrder.filter((x) => x !== srcId);
    const base = next.indexOf(dstId);
    next.splice(si < di ? base + 1 : base, 0, srcId);
    if (!orderControlled) setInternalOrder(next);
    onOrderChange?.(next);
  };

  const Connector = vertical ? ChevronDown : ChevronRight;

  // 제목 번호 — 표시 순서상 '사용 중' 카드에만 1..k 부여(미사용은 번호에서 빠지고 다음이 당겨받음)
  let seq = 0;

  return (
    <div
      className={`inline-flex ${vertical ? 'flex-col' : 'flex-row'} items-center gap-spacing-2 rounded-round-4 bg-condition-slot-slot-bg p-spacing-6 ${className}`}
      {...props}
      // 커넥터·여백 위에서 놓아도 드롭 수락 — 카드 밖 드롭의 스냅백 방지(카드 쪽 onDragOver와 동일)
      onDragOver={(e) => {
        if (dragId == null) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
      }}
      onDrop={(e) => e.preventDefault()}
    >
      {effOrder.map((id, i) => {
        const item = items.find((it) => it.id === id);
        if (!item) return null;
        const enabled = isEnabled(id);
        const title = enabled ? `${titlePrefix} ${++seq}.` : `${titlePrefix} 미사용`; // 2026-07-23 지시(구 "조건 -.")
        // 미사용 카드는 드래그도 비활성(grip disabled 색·드래그 시작 안 됨, 2026-07-23 지시).
        // 헤더 숨김 모드는 grip이 없어 드래그 자체가 불가.
        const cardDragDisabled = dragDisabled || !enabled || !showCardHeaders;
        return (
          <div
            key={id}
            className={`flex ${vertical ? 'flex-col' : 'flex-row'} items-center gap-spacing-2 ${
              cardWidth === 'fill' ? 'min-w-0 flex-1' : ''
            }`}
          >
            {i > 0 && (
              <Connector
                size={16}
                strokeWidth={1.8}
                className="shrink-0 text-condition-slot-card-default-icon"
              />
            )}
            <ConditionSlotCard
              title={title}
              enabled={enabled}
              switchDisabled={switchesDisabled}
              switchDisabledTooltip={switchesDisabledTooltip}
              dragDisabled={cardDragDisabled}
              showHeader={showCardHeaders}
              onEnabledChange={(next) => toggleEnabled(id, next)}
              dragging={dragId === id}
              width={cardWidth}
              dragHandleProps={{
                onMouseDown: () => {
                  allowDragRef.current = true;
                },
                onMouseUp: () => {
                  allowDragRef.current = false;
                },
              }}
              draggable={!cardDragDisabled}
              onDragStart={(e) => {
                // grip 밖에서 시작한 드래그(텍스트 등)는 차단 — 핸들에서만 이동
                if (!allowDragRef.current) {
                  e.preventDefault();
                  return;
                }
                setDragId(id);
                e.dataTransfer.effectAllowed = 'move';
                try {
                  e.dataTransfer.setData('text/plain', String(id));
                } catch {
                  /* 일부 브라우저(구IE 계열) setData 미지원 무시 */
                }
              }}
              onDragEnd={() => {
                setDragId(null);
                allowDragRef.current = false;
              }}
              onDragOver={(e) => {
                // 드래그 중엔 자기 자신 위 포함 항상 드롭 허용 — 미허용 상태로 놓으면
                // 크롬이 고스트를 원위치로 되돌리는 스냅백 애니메이션을 재생한다(2026-07-08 지적)
                if (dragId == null) return;
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
              }}
              onDrop={(e) => e.preventDefault()}
              onDragEnter={() => {
                if (dragId != null && dragId !== id) moveTo(dragId, id);
              }}
            >
              {item.body}
            </ConditionSlotCard>
          </div>
        );
      })}
    </div>
  );
}
