// ScreeningBuilderTemplate — 스크리닝 조건 빌더
// (Figma ConditionCard 8243:88380 + 플로우 8389:117585 + Formula 8383:112161 · 그룹 8384:114161/114251)
// 지원자 정보를 조건화하는 카드(ScreeningConditionCard)와 수식(ScreeningFormula — 둘 다 내부용)을 관리한다:
//  좌측 카드 목록 —
//   - 카드마다 조건(tab radio list)·가/감점(radio list)을 세팅, grip 드래그 앤 드롭 순서 변경, 삭제
//  우측 수식 영역 —
//   - 카드를 수식 영역에 드롭하면 카드가 IF 수식으로 치환된다(카드 목록에서 제거)
//   - 수식 체크박스 선택 + 함수 선택 + '선택 그룹핑' 클릭 → FN( 수식, 수식, … ) 그룹으로 묶인다
//   - 그룹도 체크박스를 가지므로 다른 수식·그룹과 다시 그룹핑될 수 있다(중첩)
// 데이터 계약(JobPositionTemplate과 동일 철학):
//  - defaultCards: mount 1회 주입(리셋은 key 리마운트)
//  - onChange(cards) / onFormulaChange(formulas): 변경 시 스냅샷 반출
//  - ref: getCards() · addCard(card) · getFormulas()
import { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { Plus, FolderInput, FolderOutput, X } from 'lucide-react';
import { ScrollArea } from './ScrollArea';
import { ToolBar, ToolBarDivider } from './ToolBar';
import { Accordion, AccordionItem } from './Accordion';
import { Popover } from './Popover';
import {
  PopoverMenu,
  PopoverMenuColumns,
  PopoverMenuColumn,
  PopoverMenuSection,
} from './PopoverMenu';
import { List } from './List';
import { SegmentedTabs } from './SegmentedTabs';
import { ScreeningConditionCard } from './ScreeningConditionCard';
import { ScreeningFormula } from './ScreeningFormula';
import { FORMULA_GROUP_FUNCTIONS } from './formulaFunctions';
import { Select } from './Select';
import { Button } from './Button';

// HMR-safe id — 모듈 카운터는 HMR 리셋으로 중복되므로 시간+랜덤(JobPositionTemplate 판례)
const newId = (prefix) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

// 카드의 조건 옵션 평면화 — 탭이 있으면 탭별 옵션을 합친다(수식 값 칩 옵션용)
const flatOptions = (card) =>
  card.conditionTabs?.length
    ? Object.values(card.conditionOptionsByTab ?? {}).flat()
    : (card.conditionOptions ?? []);

export const ScreeningBuilderTemplate = forwardRef(function ScreeningBuilderTemplate(
  {
    defaultCards = [],   // 초기 카드 목록(mount 1회) — { id, name, conditionTabs?, conditionOptionsByTab?, conditionOptions?, condition?, score? }
    onChange,            // (cards) => void — 카드 순서/값/삭제 변경 시 스냅샷
    onFormulaChange,     // (formulas) => void — 수식 트리 변경 시 스냅샷
    cardWidth = 375,     // 카드 너비: 숫자(px) | CSS 길이 | 'fill'
    formulaArea = true,  // 수식 영역 표시 여부 — false면 카드 목록만
    onAddCard,           // 카드 영역 '추가' 버튼 클릭 — cardMenu 미지정 시에만 사용(없으면 빈 카드 추가)
    cardMenu = [],       // '추가' 버튼의 rich menu 데이터 — [ [ { title, items: [{ name, conditionTabs?, conditionOptionsByTab?, conditionOptions? }] } ] ]
                         //   (컬럼 배열 > 섹션 배열 > 항목). 항목 클릭 시 조건 카드가 맨 위에 등록되고,
                         //   팝오버는 계속 열려 있어 연속 추가 가능(배경 클릭으로만 닫힘)
    boxHeight = 800,     // 빌더 박스 고정 높이(px) — 내용이 넘치면 내부 스크롤(ScrollArea)
    className = '',
    ...props
  },
  ref,
) {
  // defaultCards는 mount 1회 시드(uncontrolled) — 외부에서 리셋하려면 key를 바꿔 리마운트한다.
  const [cards, setCards] = useState(() =>
    defaultCards.map((c) => ({ condition: null, score: null, ...c })),
  );

  const snapshot = (list) =>
    list.map(({ id, name, condition, score }) => ({ id, name, condition, score }));
  const emit = (next) => {
    setCards(next);
    onChange?.(snapshot(next));
  };

  // 빌더 모드 — '수식'(드래그·그룹핑 빌더) / '자연어'(추후 자연어 생성 방식 — 현재 빈 영역)
  const [builderMode, setBuilderMode] = useState('formula');
  // 수식 영역(존) 목록 — 존마다 아코디언 리스트 하나 + 독립된 수식 트리. '수식 영역 추가'로 늘린다.
  const [zones, setZones] = useState(() => [{ id: newId('zone'), name: '수식 영역 1', formulas: [] }]);
  const [checkedIds, setCheckedIds] = useState([]); // 그룹핑 대상 체크(모든 존 공통 — id는 유일)
  const [groupFn, setGroupFn] = useState(null);
  const emitZones = (next) => {
    setZones(next);
    onFormulaChange?.(next.map((z) => ({ id: z.id, name: z.name, formulas: z.formulas })));
  };
  const patchZone = (zoneId, fn) =>
    emitZones(zones.map((z) => (z.id === zoneId ? { ...z, formulas: fn(z.formulas) } : z)));
  const addZone = () =>
    emitZones([{ id: newId('zone'), name: `수식 영역 ${zones.length + 1}`, formulas: [] }, ...zones]); // 새 존은 맨 위에
  const renameZone = (zoneId, name) =>
    emitZones(zones.map((z) => (z.id === zoneId ? { ...z, name } : z)));
  const removeZone = (zoneId) => {
    const target = zones.find((z) => z.id === zoneId);
    const ids = target ? target.formulas.map((f) => f.id) : [];
    const rest = zones.filter((z) => z.id !== zoneId);
    // 마지막 존을 삭제하면(수식 세팅 상태에서만 가능) 빈 기본 존 하나로 대체 — 영역이 0개가 되지 않게
    emitZones(rest.length > 0 ? rest : [{ id: newId('zone'), name: '수식 영역 1', formulas: [] }]);
    setCheckedIds((prev) => prev.filter((x) => !ids.includes(x))); // 삭제된 존의 체크 정리
  };

  useImperativeHandle(ref, () => ({
    getCards: () => snapshot(cards),
    addCard: (card) => emit([{ condition: null, score: null, ...card }, ...cards]),
    getFormulas: () => zones.map((z) => ({ id: z.id, name: z.name, formulas: z.formulas })),
  }));

  const patchCard = (id, patch) =>
    emit(cards.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  const removeCard = (id) => emit(cards.filter((c) => c.id !== id));
  // 카드 영역 '추가' 버튼 — cardMenu가 있으면 rich menu 팝오버(아래), 없으면 onAddCard 위임/빈 카드 추가
  const handleAddCard = () => {
    if (onAddCard) return onAddCard();
    emit([{ id: newId('card'), name: '새 조건', condition: null, score: null }, ...cards]);
  };
  // rich menu 항목 → 조건 카드 등록(맨 위). 팝오버는 닫지 않아 연속 추가 가능.
  const addCardFromMenu = (item) =>
    emit([
      {
        id: newId('card'),
        name: item.name,
        conditionTabs: item.conditionTabs,
        conditionOptionsByTab: item.conditionOptionsByTab,
        conditionOptions: item.conditionOptions,
        condition: null,
        score: null,
      },
      ...cards,
    ]);
  // rich menu 팝오버 내용 — 헤더 '추가'와 빈 상태 '조건 추가하기' 버튼이 공유
  const richMenuContent = cardMenu.length > 0 && (
    <PopoverMenu width="100%">
      <PopoverMenuColumns>
        {cardMenu.map((column, ci) => (
          <PopoverMenuColumn key={ci}>
            {column.map((section, si) => (
              <PopoverMenuSection
                key={section.title}
                title={section.title}
                grow={si === column.length - 1}
              >
                {section.items.map((item) => (
                  <List
                    key={item.name}
                    title={item.name}
                    rightButton
                    rightButtonIcon={Plus}
                    rightButtonAriaLabel="추가"
                    onClick={() => addCardFromMenu(item)}
                    onButtonClick={() => addCardFromMenu(item)}
                  />
                ))}
              </PopoverMenuSection>
            ))}
          </PopoverMenuColumn>
        ))}
      </PopoverMenuColumns>
    </PopoverMenu>
  );

  // ── 카드 드래그 앤 드롭 — 수식 영역 드롭 전용. 카드끼리 순서 변경은 하지 않는다(2026-07-16 지시) ──
  const [dragId, setDragId] = useState(null);
  const [dropHoverId, setDropHoverId] = useState(null); // 드래그 중 하이라이트된 존 id
  const allowDragRef = useRef(false);

  // 카드 → IF leaf 수식 치환(드롭 시). 카드에 세팅된 조건/가점이 있으면 이어받는다.
  // 감점은 수식에서 음수로 표시(가점 10 → 10, 감점 10 → -10), 적합/부적합은 점수 란에 글자로 표시.
  // 조건 칩 옵션/구성은 드롭 시점의 왼쪽 카드 리스트 전체(추가된 카드 포함)를 싣는다.
  // 수식 카탈로그 — 조건 칩·값 칩이 참조하는 '현재 카드 영역' 라이브 목록(렌더마다 최신).
  // 카드가 추가/삭제되면 이미 만들어진 수식의 조건 칩 옵션에도 즉시 반영된다(2026-07-14 지시).
  const formulaCatalog = {
    criteriaOptions: cards.map((c) => ({ value: c.id, label: c.name })),
    valueOptionsByCriteria: Object.fromEntries(cards.map((c) => [c.id, flatOptions(c)])),
    conditionMetaByCriteria: Object.fromEntries(
      cards.map((c) => [
        c.id,
        {
          tabs: c.conditionTabs ?? [],
          optionsByTab: c.conditionOptionsByTab ?? {},
          options: c.conditionOptions ?? [],
        },
      ]),
    ),
  };

  const cardToLeaf = (card) => {
    const type = card.score?.type ?? null;
    const raw = (card.score?.points ?? '').replace(/^-/, '');
    const points = type === 'minus' && raw ? `-${raw}` : raw;
    return {
      id: newId('formula'),
      kind: 'leaf',
      criteria: card.id,
      // 스냅샷은 폴백용(카드가 나중에 삭제돼도 라벨·옵션 유지) — 표시는 catalog(라이브) 우선
      criteriaOptions: formulaCatalog.criteriaOptions,
      valueOptionsByCriteria: formulaCatalog.valueOptionsByCriteria,
      value: card.condition?.option ?? null,
      valueTab: card.condition?.tab ?? null,
      points,
      scoreType: type, // 'fit'|'unfit'이면 점수 란에 적합/부적합 텍스트 표시
      conditionMetaByCriteria: formulaCatalog.conditionMetaByCriteria,
    };
  };
  // 카드는 드롭해도 목록에 남는다 — 같은 조건을 여러 번 드롭해 수식을 계속 추가할 수 있다(2026-07-16 지시)
  const dropCardToZone = (zoneId) => {
    const card = cards.find((c) => c.id === dragId);
    if (!card) return;
    patchZone(zoneId, (fs) => [...fs, cardToLeaf(card)]);
  };
  // 그룹 '조건 추가' 드롭 존용 — 드래그 중인 카드의 leaf(없으면 null)
  const getDropLeaf = () => {
    const card = cards.find((c) => c.id === dragId);
    return card ? cardToLeaf(card) : null;
  };

  // ── 툴바 액션 — 전부 '그 존'의 체크만 보고 동작한다(다른 존 체크에 영향 주고받지 않음, 2026-07-14 지시) ──
  const zoneCheckedIds = (zone) =>
    zone.formulas.filter((f) => checkedIds.includes(f.id)).map((f) => f.id);

  // 선택 그룹핑 — 이 존에서 체크된 최상위 수식 2개 이상을 FN(…)으로 묶는다
  const groupCheckedInZone = (zoneId) => {
    const zone = zones.find((z) => z.id === zoneId);
    if (!zone || groupFn == null) return;
    const pickedIds = zoneCheckedIds(zone);
    if (pickedIds.length < 2) return;
    const picked = zone.formulas.filter((f) => pickedIds.includes(f.id));
    const rest = zone.formulas.filter((f) => !pickedIds.includes(f.id));
    const insertAt = zone.formulas.findIndex((f) => pickedIds.includes(f.id)); // 첫 체크 위치에 삽입
    const next = rest.slice();
    next.splice(Math.min(insertAt, next.length), 0, {
      id: newId('group'),
      kind: 'group',
      fn: groupFn,
      children: picked,
    });
    emitZones(zones.map((z) => (z.id === zoneId ? { ...z, formulas: next } : z)));
    setCheckedIds((prev) => prev.filter((x) => !pickedIds.includes(x))); // 이 존의 체크만 해제
  };

  // 그룹 해제 — 이 존에서 체크된 그룹을 풀어 자식을 그 자리에 펼친다(한 겹만, 중첩 자식 유지)
  const ungroupCheckedInZone = (zoneId) => {
    const zone = zones.find((z) => z.id === zoneId);
    if (!zone) return;
    const pickedIds = zoneCheckedIds(zone);
    emitZones(
      zones.map((z) =>
        z.id === zoneId
          ? {
              ...z,
              formulas: z.formulas.flatMap((f) =>
                pickedIds.includes(f.id) && f.kind === 'group' ? f.children : [f],
              ),
            }
          : z,
      ),
    );
    setCheckedIds((prev) => prev.filter((x) => !pickedIds.includes(x)));
  };

  return (
    // 빌더 전체(카드+수식 영역)를 감싸는 라인 박스 — 흰 bg·gray.100 라인, 고정 높이+내부 스크롤(규칙 9)
    <div
      style={{ height: boxHeight }}
      className={`relative overflow-hidden rounded-round-4 border border-builder-area-box-line bg-builder-area-box-bg ${className}`}
      {...props}
    >
      {/* 카드 영역(gray.25 bg) | 1px gray.100 구분선 | 빌더 영역 — 스크롤은 영역별 분리(각자 ScrollArea) */}
      <div className="flex h-full items-stretch">
      {/* ── 카드 목록 — 독립 스크롤 ── */}
      <div
        className="relative shrink-0 border-r border-builder-area-box-line bg-builder-area-card-area-bg"
        // 카드 사이 여백에서 놓아도 드롭 수락 — 스냅백 방지(카드 쪽 onDragOver와 동일)
        onDragOver={(e) => {
          if (dragId == null) return;
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
        }}
        onDrop={(e) => e.preventDefault()}
      >
        {/* 고정 헤더 배경 — 수식 영역 헤더와 동일 구조(60px: 위 42px 불투명 + 아래 18px 페이드).
            카드 영역 배경(gray.25)에 맞춰 card-area-bg → 투명으로 페이드 */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex h-[60px] flex-col">
          <div className="h-[42px] bg-builder-area-card-area-bg" />
          <div className="h-[18px] bg-gradient-to-b from-builder-area-card-area-bg to-builder-area-header-fade-bottom" />
        </div>
        {/* 카드 영역 고정 헤더 — 조건 리스트 타이틀 + 추가 라인 버튼(onAddCard 미지정 시 빈 카드 맨 위 추가) */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10">
          <div className="pointer-events-auto flex items-center justify-between px-spacing-7 pb-spacing-6 pt-spacing-7">
            <span className="text-15 font-semibold text-font-icon-5">조건 리스트</span>
            {cardMenu.length > 0 ? (
              /* rich menu — 항목/+ 클릭 시 카드 등록(팝오버 유지), 배경 클릭으로만 닫힘 */
              <Popover
                menuWidth={804}
                trigger={
                  <Button variant="line" size="32" leftIcon={Plus}>
                    추가
                  </Button>
                }
              >
                {richMenuContent}
              </Popover>
            ) : (
              <Button variant="line" size="32" leftIcon={Plus} onClick={handleAddCard}>
                추가
              </Button>
            )}
          </div>
        </div>
        <ScrollArea maxHeight={boxHeight - 2 /* 상하 보더 제외 */}>
        {/* 스페이서 — 콘텐츠가 헤더 아래로 지나가며 페이드, thumb 트랙도 헤더 아래에서 시작 */}
        <div data-scroll-sticky-top className="h-[60px]" />
        <div className="flex flex-col gap-spacing-6 px-spacing-7 pb-spacing-7">
        {/* 빈 상태 — 등록된 조건이 없을 때 카피+조건 추가하기 버튼을 영역 가운데 정렬(간격 8) */}
        {cards.length === 0 && (
          <div
            style={{
              width: typeof cardWidth === 'number' ? cardWidth : undefined,
              minHeight: boxHeight - 2 - 60 - 16 /* 보더·헤더·하단 패딩 제외한 가시 영역에 수직 중앙 */,
            }}
            className="flex flex-col items-center justify-center gap-spacing-5"
          >
            <p className="text-14 text-font-icon-3">등록된 조건이 없습니다</p>
            {cardMenu.length > 0 ? (
              <Popover
                menuWidth={804}
                trigger={
                  <Button variant="line" size="32" leftIcon={Plus}>
                    조건 추가하기
                  </Button>
                }
              >
                {richMenuContent}
              </Popover>
            ) : (
              <Button variant="line" size="32" leftIcon={Plus} onClick={handleAddCard}>
                조건 추가하기
              </Button>
            )}
          </div>
        )}
        {cards.map((card) => (
          <ScreeningConditionCard
            key={card.id}
            cardName={card.name}
            conditionTabs={card.conditionTabs ?? []}
            conditionOptionsByTab={card.conditionOptionsByTab ?? {}}
            conditionOptions={card.conditionOptions ?? []}
            conditionValue={card.condition}
            onConditionChange={(v) => patchCard(card.id, { condition: v })}
            scoreValue={card.score}
            onScoreChange={(v) => patchCard(card.id, { score: v })}
            onDelete={() => removeCard(card.id)}
            width={cardWidth}
            dragging={dragId === card.id}
            dragHandleProps={{
              onMouseDown: () => {
                allowDragRef.current = true;
              },
              onMouseUp: () => {
                allowDragRef.current = false;
              },
            }}
            draggable
            onDragStart={(e) => {
              // grip 밖에서 시작한 드래그(텍스트 등)는 차단 — 핸들에서만 이동
              if (!allowDragRef.current) {
                e.preventDefault();
                return;
              }
              setDragId(card.id);
              e.dataTransfer.effectAllowed = 'move';
              try {
                e.dataTransfer.setData('text/plain', String(card.id));
              } catch {
                /* 일부 브라우저 setData 미지원 무시 */
              }
            }}
            onDragEnd={() => {
              setDragId(null);
              setDropHoverId(null);
              allowDragRef.current = false;
            }}
            onDragOver={(e) => {
              // 드래그 중엔 자기 자신 위 포함 항상 드롭 허용 — 미허용 상태로 놓으면 크롬 스냅백 재생
              if (dragId == null) return;
              e.preventDefault();
              e.dataTransfer.dropEffect = 'move';
            }}
            onDrop={(e) => e.preventDefault()}
          />
        ))}
        </div>
        </ScrollArea>
      </div>

      {/* ── 수식 영역 — 독립 스크롤. 존마다 드롭 영역, '수식 영역 추가'로 존을 늘린다 ── */}
      {formulaArea && (
        <div className="relative min-w-0 flex-1">
        {/* 고정 헤더 — 세그먼트 탭·수식 영역 추가는 아래 스크롤과 무관하게 상단 고정.
            배경(높이 60px): 위 70%는 흰색 불투명, 아래 30%만 흰→투명 페이드(2026-07-14 비율 지정).
            스크롤 콘텐츠가 아래로 지나가며 사라진다. 오버레이는 클릭 통과(컨트롤만 수신).
            그룹핑 액션은 체크 시 뜨는 플로팅 ToolBar로 일원화(2026-07-14) */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex h-[60px] flex-col">
          <div className="h-[42px] bg-builder-area-header-fade-top" />
          <div className="h-[18px] bg-gradient-to-b from-builder-area-header-fade-top to-builder-area-header-fade-bottom" />
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10">
        {/* 컨트롤 행 높이 = 16 + 32 + 12 = 60px (배경·스크롤 스페이서와 동일) */}
        <div className="pointer-events-auto flex items-center px-spacing-7 pb-spacing-6 pt-spacing-7">
          <div className="w-[180px]">
            <SegmentedTabs
              items={[
                { value: 'formula', label: '수식 빌더' },
                { value: 'natural', label: '자연어 빌더' },
              ]}
              value={builderMode}
              onChange={setBuilderMode}
            />
          </div>
          <Button variant="line" size="32" leftIcon={Plus} onClick={addZone} className="ml-auto">
            수식 영역 추가
          </Button>
        </div>
        </div>
        {/* 스크롤 영역은 박스 전체 — 콘텐츠가 헤더(60px) 아래로 지나가며 그라디언트에 페이드.
            스페이서에 data-scroll-sticky-top — 세로 thumb 트랙이 헤더(페이드 영역) 아래에서 시작 */}
        <ScrollArea maxHeight={boxHeight - 2}>
        <div data-scroll-sticky-top className="h-[60px]" />
        <div className="flex flex-col gap-spacing-5 px-spacing-7 pb-spacing-7">
          {/* 존 = 아코디언 리스트(2026-07-14 전환) — 이름 편집·삭제는 AccordionItem 옵션,
              바디에 수식 UI + 드롭 스트립. 수식/자연어 빌더는 같은 존 데이터를 공유하고
              표기만 variant로 갈린다(2026-07-15) */}
          <Accordion>
          {zones.map((zone) => (
            <AccordionItem
              key={zone.id}
              title={zone.name}
              defaultOpen
              nameEditable
              onTitleChange={(t) => renameZone(zone.id, t)}
              deletable
              // 마지막 존은 비어 있을 때만 삭제 불가 — 수식이 세팅돼 있으면 삭제(=빈 기본 존으로 리셋) 가능
              deleteDisabled={zones.length <= 1 && zone.formulas.length === 0}
              onDelete={() => removeZone(zone.id)}
            >
            <div className="flex flex-col gap-spacing-5">
              {zone.formulas.map((f, i) => (
                <ScreeningFormula
                  key={f.id}
                  node={f}
                  root
                  checked={checkedIds.includes(f.id)}
                  onCheckChange={(on) =>
                    setCheckedIds((prev) => (on ? [...prev, f.id] : prev.filter((x) => x !== f.id)))
                  }
                  onChange={(next) =>
                    patchZone(zone.id, (fs) => fs.map((x, xi) => (xi === i ? next : x)))
                  }
                  onDelete={() => {
                    patchZone(zone.id, (fs) => fs.filter((_, xi) => xi !== i));
                    setCheckedIds((prev) => prev.filter((x) => x !== f.id));
                  }}
                  getDropLeaf={getDropLeaf}
                  catalog={formulaCatalog}
                  variant={builderMode === 'natural' ? 'natural' : 'formula'}
                />
              ))}
              {/* 드롭 스트립 — 카드를 끌어다 놓는 대상. 드래그 오버 시 hover 상태(bg·라인 진해짐).
                  이 존에 체크된 수식이 있으면 스트립 중앙에 플로팅 툴바(공통 ToolBar)가 뜬다. */}
              <div className="relative w-full">
                <div
                  onDragOver={(e) => {
                    if (dragId == null) return;
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                    setDropHoverId(zone.id);
                  }}
                  onDragLeave={(e) => {
                    if (e.currentTarget.contains(e.relatedTarget)) return;
                    setDropHoverId((prev) => (prev === zone.id ? null : prev));
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDropHoverId(null);
                    dropCardToZone(zone.id);
                  }}
                  className={`flex h-[78px] w-full items-center justify-center gap-spacing-3 rounded-round-4 border border-dashed p-spacing-6 text-14 text-builder-area-add-default-text transition-colors ${
                    dropHoverId === zone.id ||
                    zone.formulas.some((f) => checkedIds.includes(f.id)) // 툴바 표시 중에도 드롭(hover) 상태 디자인
                      ? 'border-builder-area-add-hover-outline bg-builder-area-add-hover-bg'
                      : 'border-builder-area-add-default-outline bg-builder-area-add-default-bg'
                  }`}
                >
                  <Plus size={16} strokeWidth={1.8} className="shrink-0" />
                  다른 조건을 여기에 끌어다 놓기
                </div>
                {/* 플로팅 툴바 — 이 존의 체크에만 반응(표시·활성·그룹핑·해제·선택 해제 전부 존 단위) */}
                {zoneCheckedIds(zone).length > 0 && (
                  <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                    <ToolBar className="pointer-events-auto">
                      <Select
                        width={200}
                        options={FORMULA_GROUP_FUNCTIONS.map((f) => ({ value: f, label: f }))}
                        value={groupFn ?? ''}
                        onChange={(e) => setGroupFn(e.target.value)}
                        placeholder="함수 선택"
                        disabled={zoneCheckedIds(zone).length < 2}
                      />
                      <Button
                        variant="ghost"
                        size="32"
                        leftIcon={FolderInput}
                        disabled={groupFn == null || zoneCheckedIds(zone).length < 2}
                        onClick={() => groupCheckedInZone(zone.id)}
                      >
                        선택 그룹핑
                      </Button>
                      <ToolBarDivider />
                      <Button
                        variant="ghost"
                        size="32"
                        leftIcon={FolderOutput}
                        disabled={
                          !zone.formulas.some((f) => checkedIds.includes(f.id) && f.kind === 'group')
                        }
                        onClick={() => ungroupCheckedInZone(zone.id)}
                      >
                        그룹 해제
                      </Button>
                      <ToolBarDivider />
                      <Button
                        variant="ghost"
                        icon={X}
                        aria-label="선택 해제"
                        showTooltip={false}
                        onClick={() => {
                          const ids = zoneCheckedIds(zone);
                          setCheckedIds((prev) => prev.filter((x) => !ids.includes(x))); // 이 존만 해제
                        }}
                      />
                    </ToolBar>
                  </div>
                )}
              </div>
            </div>
            </AccordionItem>
          ))}
          </Accordion>
        </div>
        </ScrollArea>
        </div>
      )}
      </div>
    </div>
  );
});
