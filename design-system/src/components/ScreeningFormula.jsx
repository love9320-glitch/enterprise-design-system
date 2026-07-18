// ScreeningFormula — 스크리닝 수식 (Figma Formula 8383:112161 · 그룹 8384:114161/114251 · 함수 색상표 8384:114813)
// ⚠️ 내부용(ScreeningBuilderTemplate 전용) 컴포넌트 — 조건 카드를 수식 영역에 드롭하면 이 수식으로 치환된다.
//    독립 데모 페이지 없이 ScreeningBuilderTemplate 데모에서 함께 확인한다.
//
// 노드 모델(재귀 트리):
//  - leaf : { id, kind:'leaf', criteria, criteriaOptions, value, valueOptions, points, display?('full'|'compact') }
//           → [조건칩] = [값칩] → +N점  /  compact = "기준, 값, 점수" 요약칩 — 클릭 시 펼침(2026-07-15 표기 개정)
//  - 묶음 leaf(복수 조건, Figma 8535:11956): { …leaf, items:[항목…], individual:{mode,fn,items}|null }
//           → [조건칩] = [지정보유, N개 조건 묶음] → [개별설정] — 항목이 100개여도 한 줄 유지.
//             묶음 칩 클릭=지정 항목 편집(다중 선택), 개별설정 클릭=항목별 점수 모달.
//             단수 수식과 같은 골격으로 단독 등록된다(함수 그룹 자동 감싸기 없음 — 2026-07-16 개정,
//             그룹핑은 일반 수식과 동일하게 체크+툴바로).
//  - group: { id, kind:'group', fn:'SUM'…, children:[node…], trueScore?, falseScore? }
//           → FN( 자식수식 , 자식수식 [, 조건 추가 존] + )  — + 클릭 시에만 '조건 추가' 드롭 존이 나타나고
//             카드를 드롭하면 그 그룹에 수식이 추가된다. 그룹은 다른 수식·그룹과 다시 그룹핑될 수 있다
//  - IF 그룹(Figma 8537:2175): IF( 자식수식 , [참점수] , [거짓점수] ) — 조건이 참이면 참점수(기본 1),
//    아니면 거짓점수(기본 0). 조건을 더 못 받으므로 +(조건 추가)·드롭 존이 없다
//  - CAPMAX/CAPMIN 그룹(Figma 8544:36274): FN( 자식수식 , [capScore] ) — 합산 점수의 최대/최소를
//    제한. 가/감점(점수) 있는 수식에만 적용(적합/부적합·미설정 불가), + 버튼 없음
//  - FITBYSCORE/UNFITBYSCORE 그룹(Figma 8544:36274): FN( 자식수식 , [compareOp] , [compareScore] ) —
//    점수가 계산식(비교 연산자)·비교값을 만족하면 적합/부적합 처리. 점수 있는 수식 전용, + 버튼 없음
// 함수 계열별 고유 텍스트 컬러(formula-* 토큰): AND·OR=green / IF=blue / SUM·MAX·MIN·COUNTIF=violet /
// CAPMAX·CAPMIN=pink / FITBYSCORE·UNFITBYSCORE=orange. hover 아웃라인도 계열 색을 따른다.
// 체크박스는 최상위(root)에서만 노출 — 그룹핑 대상 선택용(ScreeningBuilderTemplate이 관리).
import { useState, useRef, useEffect } from 'react';
import { X, Plus, ChevronDown } from 'lucide-react';
import { Checkbox } from './Checkbox';
import { SelectChip } from './Select';
import { Input } from './Input';
import { Button } from './Button';
import { Popover } from './Popover';
import { PopoverMenu } from './PopoverMenu';
import { ListGroup } from './ListGroup';
import { List } from './List';
import { Tag } from './Tag';
import { Divider } from './Divider';
import { useHoverTooltip } from './useHoverTooltip';
import { ScoreSettingMenu, ConditionSettingMenu } from './ScreeningConditionCard';
import { ScreeningIndividualSettingModal } from './ScreeningIndividualSettingModal';
import { CHIP_COLOR_CLASS } from './chipStyles';
import { FORMULA_FN_FAMILY, FORMULA_GROUP_FUNCTIONS, focusNextChainStop, chainTriggerKey, hasPointsScore } from './formulaFunctions';

// 계열별 정적 클래스 매핑 (Tailwind purge 안전)
// 함수 계열 → 칩 color(2026-07-15 — 자연어 그룹 함수 셀렉트 칩 채색)
const FAMILY_CHIP_COLOR = {
  logical: 'green',
  conditional: 'blue',
  aggregate: 'violet',
  'score-limit': 'pink',
  evaluation: 'orange',
};
const FAMILY_HOVER_BORDER = {
  logical: 'border-formula-hover-logical-outline',
  conditional: 'border-formula-hover-conditional-outline',
  aggregate: 'border-formula-hover-aggregate-outline',
  'score-limit': 'border-formula-hover-score-limit-outline',
  evaluation: 'border-formula-hover-evaluation-outline',
};

// 수식 컨테이너 공통 셸 — 흰 bg + 1px 아웃라인(default 공통, hover=함수 계열 색).
// hover는 CSS :hover 대신 마우스 이벤트로 추적한다 — :hover는 자식 수식 위에 있어도 부모에 걸려
// 중첩 그룹에서 아웃라인이 겹친다(2026-07-16 지시). mouseover/out은 버블되므로 안쪽 셸이
// stopPropagation으로 끊으면 가장 안쪽 수식 하나만 호버 상태를 가진다.
function FormulaShell({ family, dense = false, comment = null, className = '', children }) {
  const [hovered, setHovered] = useState(false);
  const shellRef = useRef(null);
  // 호버 추적은 네이티브 리스너로 — React 합성 이벤트는 portal(팝오버 패널)에서도 컴포넌트 트리로
  // 버블돼, 패널 위 이동이 셸 hover를 갱신하고 패널이 닫히면 mouseout이 없어 hover가 고착된다
  // (조건/값 저장 후 호버 잔류 버그, 2026-07-15). 네이티브는 DOM 트리 기준이라 패널 이벤트가 안 닿는다.
  useEffect(() => {
    const el = shellRef.current;
    if (!el) return;
    // stopPropagation 금지 — 네이티브에서 전파를 끊으면 React 루트 위임까지 막혀
    // 수식 내부 툴팁(useHoverTooltip 등) mouseenter가 전부 죽는다(2026-07-15 회귀).
    // 대신 '이벤트 지점의 가장 가까운 셸이 나인가'로 판정해 가장 안쪽 셸만 hover.
    const over = (e) => setHovered(e.target.closest('[data-formula-shell]') === el);
    const out = (e) => {
      if (!el.contains(e.relatedTarget)) setHovered(false);
    };
    el.addEventListener('mouseover', over);
    el.addEventListener('mouseout', out);
    return () => {
      el.removeEventListener('mouseover', over);
      el.removeEventListener('mouseout', out);
    };
  }, []);
  return (
    <div
      ref={shellRef}
      data-formula-shell
      className={`inline-flex max-w-full flex-col gap-spacing-4 rounded-round-4 border py-spacing-5 transition-colors ${
        dense ? 'px-spacing-5-5' : 'px-spacing-6' /* 그룹핑된 조건 수식은 좌우 10, 최상위는 12(2026-07-15) */
      } ${
        hovered
          ? `bg-formula-hover-bg ${FAMILY_HOVER_BORDER[family] ?? 'border-formula-default-outline'}`
          : 'border-formula-default-outline bg-formula-default-bg'
      } ${className}`}
    >
      <div className="flex max-w-full flex-wrap items-center gap-spacing-4">{children}</div>
      {/* 설명 코멘트(Figma commet 옵션, 2026-07-15) — Divider 아래 [설명] 태그 + 요약 텍스트 */}
      {comment && (
        <>
          <Divider />
          <div className="flex w-full flex-wrap items-start gap-x-spacing-4 gap-y-spacing-5">
            <Tag color="black">설명</Tag>
            <p className="min-w-0 flex-1 text-12 leading-22 text-formula-default-text">{comment}</p>
          </div>
        </>
      )}
    </div>
  );
}

const Paren = ({ children }) => (
  <span className="shrink-0 text-12 font-semibold text-formula-parentheses">{children}</span>
);
const Comparison = ({ children }) => (
  <span className="shrink-0 text-12 font-semibold text-formula-comparison">{children}</span>
);
// 자연어 빌더 연결어 — 레귤러 웨이트(Figma Language 8466:6316)
const NaturalText = ({ children }) => (
  <span className="shrink-0 text-12 text-formula-comparison">{children}</span>
);

const optLabel = (options, v) => options?.find((o) => o.value === v)?.label ?? '';

// IF 안으로 들어가는 노드에서 가점/감점 값을 제거(적합/부적합·미설정은 유지)
function stripPointsScore(node) {
  if (node.kind === 'group') return { ...node, children: node.children.map(stripPointsScore) };
  if (node.items?.length)
    return node.individual?.mode === 'points' ? { ...node, individual: null } : node;
  return node.scoreType === 'plus' || node.scoreType === 'minus' || node.points
    ? { ...node, points: '', scoreType: null }
    : node;
}


// 수식 필드 체인 규약 — 공용 유틸은 formulaFunctions.js(focusNextChainStop/CHAIN_STOP_FOCUS,
// 카드·수식·드롭 스트립이 공유). 여기서는 정거장 마커(data-formula-chain)만 단다.

// '조건 추가' dashed 드롭 존 (Figma FormulaAdd 8384:113414 — Default/drop 2상태, + 버튼과 별개 컴포넌트).
// 조건 카드를 이 위에 드롭하면 그 그룹 안에 수식이 추가된다. 내부 X 버튼 클릭 시 영역 삭제(onClose).
// hover 시 사용법 안내 툴팁("조건 카드를 드래그 앤 드롭하세요")을 띄운다.
function FormulaAddZone({ onDropLeaf, getDropLeaf, onClose, closable = true }) {
  const [over, setOver] = useState(false);
  const droppable = !!getDropLeaf;
  const zoneRef = useRef(null);
  const hoverTip = useHoverTooltip('조건 카드를 드래그 앤 드롭하세요');
  return (
    <div
      ref={zoneRef}
      onMouseEnter={hoverTip.onMouseEnter}
      onMouseLeave={hoverTip.onMouseLeave}
      onDragOver={(e) => {
        if (!droppable || !getDropLeaf()) return;
        e.preventDefault();
        e.stopPropagation(); // 바깥 수식 영역 드롭 존의 하이라이트/드롭과 분리
        e.dataTransfer.dropEffect = 'move';
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        if (!droppable) return;
        e.preventDefault();
        e.stopPropagation(); // 바깥 드롭 존이 최상위 수식으로 중복 추가하지 않게
        setOver(false);
        const leaf = getDropLeaf();
        if (leaf) onDropLeaf(leaf);
      }}
      className={`flex h-[38px] shrink-0 items-center gap-spacing-4 rounded-round-4 border border-dashed py-spacing-5 pl-spacing-7 ${
        closable ? 'pr-spacing-5-5' /* X 버튼 자체 여백 감안 */ : 'pr-spacing-7' /* X 없음 — 좌우 동일 */
      } text-12 font-semibold transition-colors ${
        over
          ? 'border-formula-add-drop-outline bg-formula-add-drop-bg text-formula-add-drop-text'
          : 'border-formula-add-outline bg-formula-add-bg text-formula-add-text'
      }`}
    >
      조건 추가
      {/* X 버튼 위에서는 영역 툴팁을 숨겨 버튼 툴팁과 겹치지 않게 — 벗어나면 다시 표시.
          closable=false(IF 빈 상태 등 조건이 필수인 자리)면 X 없이 상시 노출 */}
      {closable && (
        <span
          className="inline-flex shrink-0 items-center"
          onMouseEnter={hoverTip.onMouseLeave}
          onMouseLeave={() => {
            if (zoneRef.current) hoverTip.onMouseEnter({ currentTarget: zoneRef.current });
          }}
        >
          <Button variant="ghost" size="18" icon={X} aria-label="영역 삭제" onClick={onClose} />
        </span>
      )}
      {hoverTip.tooltip}
    </div>
  );
}

// FITBYSCORE/UNFITBYSCORE 비교 연산자(계산식) — Figma 8544:36274
const COMPARE_OPS = [
  { value: '>=', label: '>= (보다 크거나 같을 때)' },
  { value: '>', label: '> (보다 클 때)' },
  { value: '=', label: '= (같을 때)' },
  { value: '<=', label: '<= (보다 작거나 같을 때)' },
  { value: '<', label: '< (보다 작을 때)' },
];
// 설명 문장용 관계 표현 — "N점 이상이면" 식으로 잇는다('='는 "N점이면")
const COMPARE_OP_TEXT = { '>=': '이상', '>': '초과', '=': '', '<=': '이하', '<': '미만' };

// 그룹 함수 점수 인풋(IF 참/거짓·CAPMAX/CAPMIN 제한값 공용) — 숫자만 입력,
// 라벨 없는 소형 인풋이라 hover 시 용도 툴팁을 띄운다(2026-07-16 지시)
function GroupScoreInput({ tooltip, value, placeholder, onChange }) {
  const tip = useHoverTooltip(tooltip);
  return (
    <span
      className="inline-flex shrink-0 items-center"
      onMouseEnter={tip.onMouseEnter}
      onMouseLeave={tip.onMouseLeave}
    >
      <Input
        size="22"
        width={40}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        inputProps={{ inputMode: 'numeric', 'aria-label': tooltip }}
      />
      {tip.tooltip}
    </span>
  );
}

// 자연어 그룹의 상시 드롭 스트립(컴팩트 h38, builder-area 토큰 — Figma 8466:6494 하단)
function NaturalGroupDropStrip({ getDropLeaf, onDropLeaf }) {
  const [over, setOver] = useState(false);
  return (
    <div
      onDragOver={(e) => {
        if (!getDropLeaf || !getDropLeaf()) return;
        e.preventDefault();
        e.stopPropagation(); // 바깥 존 드롭과 분리
        e.dataTransfer.dropEffect = 'move';
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        if (!getDropLeaf) return;
        e.preventDefault();
        e.stopPropagation();
        setOver(false);
        const leaf = getDropLeaf();
        if (leaf) onDropLeaf(leaf);
      }}
      className={`flex h-[38px] w-full items-center justify-center gap-spacing-3 rounded-round-4 border border-dashed text-14 text-builder-area-add-default-text transition-colors ${
        over
          ? 'border-builder-area-add-hover-outline bg-builder-area-add-hover-bg'
          : 'border-builder-area-add-default-outline bg-builder-area-add-default-bg'
      }`}
    >
      <Plus size={16} strokeWidth={1.8} className="shrink-0" />
      다른 조건을 여기에 끌어다 놓기
    </div>
  );
}

// 재귀 수식 렌더러 — root에서만 체크박스, onChange(nextNode)로 불변 갱신을 위로 올린다.
export function ScreeningFormula({
  node,               // leaf | group 노드(위 모델)
  root = false,       // 최상위 여부 — 체크박스 노출(그룹핑 대상 선택)
  checked = false,
  onCheckChange,      // (bool) => void — root 전용
  onChange,           // (nextNode) => void
  onDelete,           // () => void — X 버튼
  getDropLeaf,        // () => leafNode | null — 드래그 중인 카드의 leaf(없으면 null). '조건 추가' 드롭 존이 사용
  catalog,            // { criteriaOptions, valueOptionsByCriteria, conditionMetaByCriteria } — 현재 카드 영역
                      //   라이브 목록(템플릿이 렌더마다 계산). 지정 시 leaf의 스냅샷보다 우선한다.
  variant = 'formula', // 'formula'(수식 표기) | 'natural'(자연어 문장 표기 — 같은 노드 모델·기능, 8466:6316)
  inIf = false,        // IF 함수 서브트리 안 여부 — 조건 값은 적합/부적합만 허용(2026-07-16)
  className = '',
}) {
  if (node.kind === 'group') {
    return (
      <FormulaGroup
        node={node}
        root={root}
        checked={checked}
        onCheckChange={onCheckChange}
        onChange={onChange}
        onDelete={onDelete}
        getDropLeaf={getDropLeaf}
        catalog={catalog}
        variant={variant}
        inIf={inIf}
        className={className}
      />
    );
  }

  return (
    <FormulaLeaf
      node={node}
      root={root}
      checked={checked}
      onCheckChange={onCheckChange}
      onChange={onChange}
      onDelete={onDelete}
      getDropLeaf={getDropLeaf}
      catalog={catalog}
      variant={variant}
      inIf={inIf}
      className={className}
    />
  );
}

// 그룹 수식 — FN( 자식 , … [, 조건 추가 존] + ) X
// '조건 추가' 드롭 존은 평소엔 없고 + 버튼을 클릭했을 때만 나타난다(2026-07-16 지시).
// 카드를 드롭하면 그 그룹에 수식이 추가되고 존은 다시 사라진다(+ 재클릭으로 닫기도 가능).
function FormulaGroup({ node, root, checked, onCheckChange, onChange, onDelete, getDropLeaf, catalog, variant = 'formula', inIf = false, className }) {
  // 조건 추가 존 목록 — +는 누를 때마다 존을 하나씩 추가(토글 아님, 2026-07-14 지시), 닫기는 각 존의 X
  const [addZoneIds, setAddZoneIds] = useState([]);
  const addSeqRef = useRef(0);
  const appendAddZone = () => setAddZoneIds((prev) => [...prev, `add-${++addSeqRef.current}`]);
  const removeAddZone = (id) => setAddZoneIds((prev) => prev.filter((x) => x !== id));
  const patch = (p) => onChange?.({ ...node, ...p });
  const family = FORMULA_FN_FAMILY[node.fn];
  // IF 그룹 — 참/거짓 점수 인풋(기본 1/0), 조건 추가 불가(Figma 8537:2175, 2026-07-16)
  const isIf = node.fn === 'IF';
  // CAPMAX/CAPMIN 그룹 — 제한 점수 인풋 하나, 조건 추가 불가(Figma 8544:36274, 2026-07-16)
  const isCap = node.fn === 'CAPMAX' || node.fn === 'CAPMIN';
  const capInput = (
    <GroupScoreInput
      tooltip={node.fn === 'CAPMAX' ? '최대 제한 점수' : '최소 제한 점수'}
      value={node.capScore ?? ''}
      placeholder="값"
      onChange={(e) => patch({ capScore: e.target.value.replace(/[^0-9]/g, '') })}
    />
  );
  // FITBYSCORE/UNFITBYSCORE 그룹 — 계산식(비교 연산자)+비교값, 조건 추가 불가(Figma 8544:36274)
  const isByScore = node.fn === 'FITBYSCORE' || node.fn === 'UNFITBYSCORE';
  const compareOpSelect = (
    <SelectChip
      options={COMPARE_OPS}
      value={node.compareOp ?? '>='}
      onChange={(e) => patch({ compareOp: e.target.value })}
      menuWidth={210}
    />
  );
  const compareScoreInput = (
    <GroupScoreInput
      tooltip="비교 기준 점수"
      value={node.compareScore ?? ''}
      placeholder="값"
      onChange={(e) => patch({ compareScore: e.target.value.replace(/[^0-9]/g, '') })}
    />
  );
  // 함수 변경 가능 판정 — 툴바와 같은 규칙(IF=단일·비점수 조건 / CAP·BYSCORE=점수 있는 조건)을
  // 그룹 함수명 팝오버·자연어 함수 칩에도 적용해 우회 전환을 막는다
  const fnDisabled = (fn) => {
    if (fn === 'IF') return node.children.length !== 1 || node.children.some(hasPointsScore);
    if (fn === 'CAPMAX' || fn === 'CAPMIN' || fn === 'FITBYSCORE' || fn === 'UNFITBYSCORE')
      return !node.children.some(hasPointsScore);
    return false;
  };
  const ifScoreInput = (key, fallback) => (
    <GroupScoreInput
      tooltip={key === 'trueScore' ? '참일 때 부여 점수' : '거짓일 때 부여 점수'}
      value={node[key] ?? fallback}
      onChange={(e) => patch({ [key]: e.target.value.replace(/[^0-9]/g, '') })}
    />
  );
  const replaceChild = (idx, next) => {
    const children = node.children.slice();
    children[idx] = next;
    patch({ children });
  };

  const removeChild = (idx) => patch({ children: node.children.filter((_, i) => i !== idx) });
  // 설명 코멘트 — 최상위에서만, 자식(중첩 포함) 요약을 하나로 합쳐 표시
  const groupComment = root ? nodeSummary(node, catalog) : null;

  // ── 자연어 표기(8466:6494/6621) — "다음 조건들 중 [FN ▾] 반영" + 자식 문장 스택 + 상시 드롭 스트립.
  //    함수도 셀렉트 칩으로 변경 가능(수식 빌더와 기능 동일, 표기만 다름)
  if (variant === 'natural') {
    return (
      <FormulaShell family={family} className={`w-full ${className}`}>
        <div className="flex w-full items-center gap-spacing-4">
          {root && onCheckChange && (
            <Checkbox checked={checked} onChange={(e) => onCheckChange(e.target.checked)} />
          )}
          <NaturalText>다음 조건들 중</NaturalText>
          <SelectChip
            options={FORMULA_GROUP_FUNCTIONS.map((f) => ({ value: f, label: f, disabled: fnDisabled(f) }))}
            value={node.fn}
            onChange={(e) => patch({ fn: e.target.value })}
            menuWidth={140}
            color={FAMILY_CHIP_COLOR[family] ?? 'gray'}
            weight="semibold"
          />
          <NaturalText>반영</NaturalText>
          <Button variant="ghost" size="18" icon={X} aria-label="수식 삭제" onClick={onDelete} />
        </div>
        {node.children.map((child, i) => (
          <ScreeningFormula
            key={child.id}
            node={child}
            onChange={(next) => replaceChild(i, next)}
            onDelete={() => removeChild(i)}
            getDropLeaf={getDropLeaf}
            catalog={catalog}
            variant={variant}
            inIf={isIf || inIf}
            className="w-full"
          />
        ))}
        {isIf ? (
          /* IF — 조건 추가 불가(비었을 때만 드롭 스트립 노출). 참/거짓 점수는 문장으로 편집 */
          <>
          {node.children.length === 0 && (
            <NaturalGroupDropStrip
              getDropLeaf={getDropLeaf}
              onDropLeaf={(leaf) => patch({ children: [stripPointsScore(leaf)] })}
            />
          )}
          <div className="flex w-full items-center gap-spacing-4">
            <NaturalText>참이면</NaturalText>
            {ifScoreInput('trueScore', '1')}
            <NaturalText>점, 아니면</NaturalText>
            {ifScoreInput('falseScore', '0')}
            <NaturalText>점 부여</NaturalText>
          </div>
          </>
        ) : isCap ? (
          /* CAPMAX/CAPMIN — 조건 추가 불가(비었을 때만 드롭 스트립). 제한 점수를 문장으로 편집 */
          <>
          {node.children.length === 0 && (
            <NaturalGroupDropStrip
              getDropLeaf={getDropLeaf}
              onDropLeaf={(leaf) => patch({ children: [leaf] })}
            />
          )}
          <div className="flex w-full items-center gap-spacing-4">
            <NaturalText>{node.fn === 'CAPMAX' ? '최대' : '최소'}</NaturalText>
            {capInput}
            <NaturalText>점으로 제한</NaturalText>
          </div>
          </>
        ) : isByScore ? (
          /* FITBYSCORE/UNFITBYSCORE — 조건 추가 불가. 계산식·비교값을 문장으로 편집 */
          <>
          {node.children.length === 0 && (
            <NaturalGroupDropStrip
              getDropLeaf={getDropLeaf}
              onDropLeaf={(leaf) => patch({ children: [leaf] })}
            />
          )}
          <div className="flex w-full flex-wrap items-center gap-spacing-4">
            <NaturalText>점수가</NaturalText>
            {compareOpSelect}
            {compareScoreInput}
            <NaturalText>{`점이면 ${node.fn === 'FITBYSCORE' ? '적합' : '부적합'} 처리`}</NaturalText>
          </div>
          </>
        ) : (
          /* 상시 드롭 스트립(컴팩트 h38) — 카드를 끌어다 놓으면 이 그룹에 조건 추가 */
          <NaturalGroupDropStrip
            getDropLeaf={getDropLeaf}
            onDropLeaf={(leaf) => patch({ children: [...node.children, leaf] })}
          />
        )}
      </FormulaShell>
    );
  }

  return (
    <FormulaShell family={family} comment={groupComment} className={className}>
      {root && onCheckChange && (
        <Checkbox checked={checked} onChange={(e) => onCheckChange(e.target.checked)} />
      )}
      {/* 함수명 — underline 텍스트 버튼(계열 색·semibold), 클릭하면 함수 변경 팝오버(2026-07-15) */}
      <Popover
        menuWidth={140}
        trigger={
          <Button variant="underline" size="24" weight="semibold" color={FAMILY_CHIP_COLOR[family] ?? 'black'}>
            {node.fn}
          </Button>
        }
      >
        {(close) => (
          <PopoverMenu width="100%">
            <ListGroup>
              {FORMULA_GROUP_FUNCTIONS.map((fn) => (
                <List
                  key={fn}
                  title={fn}
                  selected={fn === node.fn}
                  disabled={fnDisabled(fn)}
                  onClick={
                    fnDisabled(fn)
                      ? undefined
                      : () => {
                          patch({ fn });
                          close();
                        }
                  }
                />
              ))}
            </ListGroup>
          </PopoverMenu>
        )}
      </Popover>
      <Paren>(</Paren>
      {node.children.map((child, i) => (
        <span key={child.id} className="inline-flex max-w-full flex-wrap items-center gap-spacing-4">
          {i > 0 && <Comparison>,</Comparison>}
          <ScreeningFormula
            node={child}
            onChange={(next) => replaceChild(i, next)}
            onDelete={() => removeChild(i)}
            getDropLeaf={getDropLeaf}
            catalog={catalog}
            variant={variant}
            inIf={isIf || inIf}
          />
        </span>
      ))}
      {isIf ? (
        /* IF( 조건 , 참점수 , 거짓점수 ) — 조건 추가(+) 불가(Figma 8537:2175).
           단 조건이 삭제돼 비면 '조건 추가' 존을 상시 노출(X 없음) — IF는 조건이 필수(2026-07-16 지시) */
        <>
          {node.children.length === 0 && (
            <FormulaAddZone
              getDropLeaf={getDropLeaf}
              onDropLeaf={(leaf) => patch({ children: [stripPointsScore(leaf)] })}
              closable={false}
            />
          )}
          <Comparison>,</Comparison>
          {ifScoreInput('trueScore', '1')}
          <Comparison>,</Comparison>
          {ifScoreInput('falseScore', '0')}
        </>
      ) : isCap ? (
        /* CAPMAX/CAPMIN( 조건 , 제한점수 ) — 조건 추가(+) 불가(Figma 8544:36274), 비면 존 상시 노출 */
        <>
          {node.children.length === 0 && (
            <FormulaAddZone
              getDropLeaf={getDropLeaf}
              onDropLeaf={(leaf) => patch({ children: [leaf] })}
              closable={false}
            />
          )}
          <Comparison>,</Comparison>
          {capInput}
        </>
      ) : isByScore ? (
        /* FN( 조건 , 계산식 , 비교값 ) — 조건 추가(+) 불가(Figma 8544:36274), 비면 존 상시 노출 */
        <>
          {node.children.length === 0 && (
            <FormulaAddZone
              getDropLeaf={getDropLeaf}
              onDropLeaf={(leaf) => patch({ children: [leaf] })}
              closable={false}
            />
          )}
          <Comparison>,</Comparison>
          {compareOpSelect}
          <Comparison>,</Comparison>
          {compareScoreInput}
        </>
      ) : (
        <>
          {/* 조건 추가 존 — + 클릭마다 하나씩 추가되고, 드롭되거나 X를 누르면 그 존만 사라진다 */}
          {addZoneIds.map((zoneId, zi) => (
            <span key={zoneId} className="inline-flex items-center gap-spacing-4">
              {(node.children.length > 0 || zi > 0) && <Comparison>,</Comparison>}
              <FormulaAddZone
                getDropLeaf={getDropLeaf}
                onDropLeaf={(leaf) => {
                  patch({ children: [...node.children, leaf] });
                  removeAddZone(zoneId);
                }}
                onClose={() => removeAddZone(zoneId)}
              />
            </span>
          ))}
          <Button variant="ghost" size="18" icon={Plus} aria-label="조건 추가" onClick={appendAddZone} />
        </>
      )}
      <Paren>)</Paren>
      <Button variant="ghost" size="18" icon={X} aria-label="수식 삭제" onClick={onDelete} />
    </FormulaShell>
  );
}

// 적합/부적합 라벨 — scoreType이 fit/unfit인 leaf는 점수 입력 대신 글자 표시
const SCORE_TEXT = { fit: '적합', unfit: '부적합' };

// ── 설명 코멘트 요약(2026-07-15) — 표시는 최상위 수식에서만 하나. 그룹은 자식 요약을 합쳐 한 문장으로. ──
// 형식: "{조건명}가 {값}일 경우 가점 N점 부여" (2026-07-15 문구 지정 — 조사 이/가는 받침 자동 판별)
const subjectParticle = (word) => {
  const ch = word?.charCodeAt(word.length - 1) ?? 0;
  if (ch < 0xac00 || ch > 0xd7a3) return '가'; // 한글 음절이 아니면 기본 '가'
  return (ch - 0xac00) % 28 > 0 ? '이' : '가';
};
function leafSummary(node, catalog) {
  const condMeta =
    catalog?.conditionMetaByCriteria?.[node.criteria] ??
    node.conditionMetaByCriteria?.[node.criteria] ?? { tabs: [] };
  // 묶음 leaf(복수 조건) — "{조건명} {묶음라벨} N개 조건의 점수가 합산되어 계산됨"(Figma 8535:11956)
  if (node.items?.length) {
    const criteriaLabel = optLabel(catalog?.criteriaOptions ?? node.criteriaOptions ?? [], node.criteria);
    if (!criteriaLabel) return null;
    const tabMeta = condMeta.tabs?.find((t) => t.value === node.valueTab);
    const bundleLabel = tabMeta?.bundleLabel ?? tabMeta?.label ?? '';
    return `${criteriaLabel} ${bundleLabel} ${node.items.length}개 조건의 점수가 합산되어 계산됨`;
  }
  const valueOpts =
    catalog?.valueOptionsByCriteria?.[node.criteria] ??
    node.valueOptionsByCriteria?.[node.criteria] ??
    node.valueOptions ??
    [];
  const criteriaOpts = catalog?.criteriaOptions ?? node.criteriaOptions ?? [];
  const criteriaLabel = optLabel(criteriaOpts, node.criteria);
  const tabLabel = condMeta.tabs?.find((t) => t.value === node.valueTab)?.label;
  const valueLabel = node.value != null ? optLabel(valueOpts, node.value) : tabLabel;
  const scoreText = SCORE_TEXT[node.scoreType];
  const scoreDesc = scoreText
    ? `${scoreText} 처리`
    : node.points
      ? String(node.points).startsWith('-')
        ? `감점 ${String(node.points).slice(1)}점 부여`
        : `가점 ${node.points}점 부여`
      : null;
  // 값이 정해지면 설명 표시(점수는 정해진 경우에만 문장에 이어 붙음).
  // 탭 라벨(대상 등)은 생략해도 이해에 문제없어 값만 쓴다 — 옵션 없는 탭(미보유 등)은 탭 라벨이 곧 값.
  if (!criteriaLabel || !valueLabel) return null;
  return `${criteriaLabel}${subjectParticle(criteriaLabel)} ${valueLabel}일 경우${scoreDesc ? ` ${scoreDesc}` : ''}`;
}
function nodeSummary(node, catalog) {
  if (node.kind === 'group') {
    const parts = node.children.map((c) => nodeSummary(c, catalog)).filter(Boolean);
    const joined = parts.length ? parts.join(', ') : null;
    if (node.fn === 'IF') {
      // IF( 조건, 참, 거짓 ) — 조건이 참이면 참점수, 아니면 거짓점수(Figma 8537:2175)
      const ifPart = `조건이 참이면 ${node.trueScore ?? '1'}점, 아니면 ${node.falseScore ?? '0'}점 부여`;
      return joined ? `${joined} — ${ifPart}` : ifPart;
    }
    if ((node.fn === 'CAPMAX' || node.fn === 'CAPMIN') && node.capScore) {
      // CAPMAX/CAPMIN( 조건, 제한 ) — 합산 점수의 상한/하한 제한(Figma 8544:36274)
      const capPart = `점수를 ${node.fn === 'CAPMAX' ? '최대' : '최소'} ${node.capScore}점으로 제한`;
      return joined ? `${joined} — ${capPart}` : capPart;
    }
    if ((node.fn === 'FITBYSCORE' || node.fn === 'UNFITBYSCORE') && node.compareScore) {
      // FN( 조건, 계산식, 비교값 ) — 점수가 비교식을 만족하면 적합/부적합 처리(Figma 8544:36274)
      const rel = COMPARE_OP_TEXT[node.compareOp ?? '>='];
      const byPart = `점수가 ${node.compareScore}점${rel ? ` ${rel}` : ''}이면 ${
        node.fn === 'FITBYSCORE' ? '적합' : '부적합'
      } 처리`;
      return joined ? `${joined} — ${byPart}` : byPart;
    }
    return joined;
  }
  return leafSummary(node, catalog);
}

// 칩 모양 팝오버 트리거 — SelectChip 트리거와 동일한 비주얼(chip-* 토큰), 클릭 토글은 Popover가 담당
function ChipTrigger({ children, open }) {
  return (
    <span
      // 포커스 표시=hover 디자인(2026-07-16) — 포커스는 래퍼(Popover, group/chipstop)가 받으므로
      // 키보드(focus-visible)·체인(data-chain-focus) 상태를 group 변형으로 받아 hover 색을 켠다
      className={`inline-flex min-w-0 cursor-pointer items-center gap-spacing-3 rounded-round-4 border pl-spacing-4 pr-spacing-3 py-spacing-1 text-12 font-normal transition-colors ${CHIP_COLOR_CLASS.gray} group-focus-visible/chipstop:text-chip-gray-hover-text group-focus-visible/chipstop:border-chip-gray-hover-line group-focus-visible/chipstop:bg-chip-gray-hover-bg group-data-[chain-focus]/chipstop:text-chip-gray-hover-text group-data-[chain-focus]/chipstop:border-chip-gray-hover-line group-data-[chain-focus]/chipstop:bg-chip-gray-hover-bg`}
    >
      <span className="truncate">{children}</span>
      <ChevronDown
        size={12}
        strokeWidth={1.8}
        className={`pointer-events-none shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
      />
    </span>
  );
}

// leaf 수식 — IF( 기준 == 값 , 점수 ) / compact = IF( 요약칩 )
function FormulaLeaf({ node, root, checked, onCheckChange, onChange, onDelete, catalog, variant = 'formula', inIf = false, className }) {
  const patch = (p) => onChange?.({ ...node, ...p });
  const startRef = useRef(null); // 이 수식의 체인 시작점(조건 종류 칩)
  const isCompact = node.display === 'compact';
  // 묶음 leaf(복수 조건) — 항목 배열이 있으면 값·점수 대신 [묶음 칩]과 [개별설정]으로 표기
  const isBundle = !!node.items?.length;
  const [indivOpen, setIndivOpen] = useState(false);
  const [critOpen, setCritOpen] = useState(false); // 묶음 leaf 조건명 칩 팝오버(카드 조건 셀렉트와 동일 메뉴)
  // 묶음 조건 저장(조건명 칩·묶음 칩 공용) — 카드의 조건 셀렉트와 동일한 의미:
  // 지정(items)=항목 갱신 후 개별설정으로, 보유/미보유=묶음 해제(일반 leaf) 후 점수 팝오버로
  // 값 칩(일반 leaf)에서도 같은 메뉴를 쓰므로, 지정(items) 저장 시 일반 leaf가 묶음 수식으로 전환된다
  // 지정(items) 저장=묶음 leaf로, 보유/미보유 저장=일반 leaf로 — 같은 leaf 안에서만 전환된다
  // (2026-07-16 개정: 함수 그룹 자동 감싸기 취소 — 드롭 전/후 설정 모두 묶음 leaf 한 줄로 동일)
  const saveBundleCondition = (v, close) => {
    if (v.items) {
      onChange?.({ ...node, valueTab: v.tab ?? null, value: null, items: v.items });
      close();
      setTimeout(() => document.querySelector(`[data-indiv-for="${node.id}"] input`)?.focus(), 0);
    } else {
      onChange?.({
        ...node,
        valueTab: v.tab ?? null,
        value: v.option ?? null,
        items: undefined,
        individual: undefined,
      });
      close();
      setScoreOpen(true);
    }
  };
  const scoreText = SCORE_TEXT[node.scoreType]; // '적합'|'부적합'|undefined
  // 점수 인풋 클릭 → 카드의 가/감점 셀렉트와 동일한 설정 팝오버(ScoreSettingMenu)
  const [scoreOpen, setScoreOpen] = useState(false);
  const scoreType =
    node.scoreType ?? (node.points ? (String(node.points).startsWith('-') ? 'minus' : 'plus') : null);
  // 값 칩 클릭 → 카드의 조건 셀렉트와 동일한 설정 팝오버(ConditionSettingMenu — 탭+라디오).
  // 조건(기준) 칩은 조건 종류 선택(SelectChip). 기준이 바뀌면 그 카드의 구성을 따라간다.
  const [condOpen, setCondOpen] = useState(false);
  const condMeta = catalog?.conditionMetaByCriteria?.[node.criteria] ??
    node.conditionMetaByCriteria?.[node.criteria] ?? {
      tabs: [],
      optionsByTab: {},
      options: node.valueOptions ?? [],
    };
  // 카탈로그(현재 카드 영역 라이브 목록) 우선, 없으면 leaf 스냅샷 폴백 — 카드 추가/삭제가 즉시 반영
  const criteriaOpts = catalog?.criteriaOptions ?? node.criteriaOptions ?? [];
  // 값 옵션 — 기준별 맵에서 선택된 기준을 따라간다(카탈로그 → 스냅샷 → 고정 valueOptions 순)
  const valueOpts =
    catalog?.valueOptionsByCriteria?.[node.criteria] ??
    node.valueOptionsByCriteria?.[node.criteria] ??
    node.valueOptions ??
    [];
  // 복수 조건 카드면 조건 팝오버 폭도 카드와 동일하게 고정(351 — 2026-07-16 지시)
  // ⚠️ condMeta 선언 뒤에 있어야 한다 — 앞에서 참조하면 TDZ ReferenceError(드롭 에러 원인이었음)
  const hasMultiTab = !!condMeta.tabs?.some((t) => t.multiSelect);
  const condMenuWidth = hasMultiTab ? 351 : 'max-content';
  // 설명 코멘트 — 단독(최상위) 조건일 때만 자기 요약 표시. 그룹핑되면 그룹이 합쳐진 설명 하나를 담당.
  // 자연어 표기는 문장 자체가 설명이라 코멘트 생략.
  const leafComment = variant === 'natural' ? null : root ? leafSummary(node, catalog) : null;
  return (
    <FormulaShell family="conditional" dense={!root} comment={leafComment} className={className}>
      {root && onCheckChange && (
        <Checkbox checked={checked} onChange={(e) => onCheckChange(e.target.checked)} />
      )}
      {isCompact ? (
        // compact 요약칩 — 파란 텍스트·연파랑 라인. 클릭하면 full로 펼침
        <button
          type="button"
          onClick={() => patch({ display: 'full' })}
          className="inline-flex min-w-0 items-center gap-spacing-3 rounded-round-4 border border-formula-compact-chip-line bg-formula-default-bg py-spacing-1 pl-spacing-4 pr-spacing-3 text-12 text-formula-compact-chip-text"
        >
          <span className="truncate">
            {[
              optLabel(criteriaOpts, node.criteria) || optLabel(node.criteriaOptions, node.criteria),
              isBundle ? `${node.items.length}개 조건 묶음` : optLabel(valueOpts, node.value),
              isBundle ? null : (scoreText ?? node.points),
            ]
              .filter(Boolean)
              .join(', ')}
          </span>
          <ChevronDown size={12} strokeWidth={1.8} className="shrink-0" />
        </button>
      ) : (
        <>
          {/* 조건(기준) 칩 — 조건 종류(왼쪽 카드 리스트) 선택 + 검색창. 기준이 바뀌면 값·탭 리셋.
              Tab은 하이잭하지 않는다 — 브라우저 기본 순서로 값 칩·점수 인풋에 포커스가 이동(2026-07-15) */}
          <span
            ref={startRef}
            data-formula-chain
            className="inline-flex min-w-0 items-center" /* 인라인 baseline 정렬로 칩이 내려앉는 것 방지 */
          >
            {isBundle ? (
              /* 묶음 leaf의 조건명 칩 — 복수 조건 카드의 조건 셀렉트와 동일한 팝오버(2026-07-16 지시) */
              <Popover
                className="group/chipstop min-w-0 rounded-round-4 focus:outline-none"
                tabIndex={0}
                onKeyDown={(e) => chainTriggerKey(e, critOpen, () => setCritOpen(true))}
                menuWidth={condMenuWidth}
                open={critOpen}
                onOpenChange={setCritOpen}
                trigger={
                  <ChipTrigger open={critOpen}>
                    {optLabel(criteriaOpts, node.criteria) ||
                      optLabel(node.criteriaOptions, node.criteria) ||
                      '조건'}
                  </ChipTrigger>
                }
              >
                {(close) => (
                  <ConditionSettingMenu
                    tabs={condMeta.tabs}
                    optionsByTab={condMeta.optionsByTab}
                    options={condMeta.options}
                    initialTab={node.valueTab}
                    initialItems={node.items}
                    onCancel={close}
                    onSave={(v) => saveBundleCondition(v, close)}
                    onSkip={() => {
                      close();
                      focusNextChainStop(startRef.current);
                    }}
                  />
                )}
              </Popover>
            ) : (
              <SelectChip
                options={criteriaOpts}
                value={node.criteria}
                onChange={(e) =>
                  patch({
                    criteria: e.target.value,
                    value: null,
                    valueTab: null,
                    items: undefined, // 조건 종류가 바뀌면 묶음(복수 조건) 정보도 리셋
                    individual: undefined,
                  })
                }
                placeholder="조건"
                searchable
                searchPlaceholder="조건 카드 검색"
                menuWidth={160}
                tabOpens
              />
            )}
          </span>
          {variant === 'natural' ? <NaturalText>이(가)</NaturalText> : <Comparison>=</Comparison>}
          {isBundle ? (
            (() => {
              const tabMeta = condMeta.tabs?.find((t) => t.value === node.valueTab);
              const bundleText = `${tabMeta?.bundleLabel ?? tabMeta?.label ?? ''}, ${node.items.length}개 조건 묶음`;
              const modalItems = node.items.map((v) => ({
                value: v,
                label: optLabel(valueOpts, v) || String(v),
              }));
              return (
                <>
                  {/* 묶음 칩 — 클릭하면 카드와 동일한 복수 조건 메뉴(탭+다중 선택)로 지정 항목 편집 */}
                  <Popover
                    className="group/chipstop min-w-0 rounded-round-4 focus:outline-none"
                    tabIndex={0}
                    onKeyDown={(e) => chainTriggerKey(e, condOpen, () => setCondOpen(true))}
                    menuWidth={condMenuWidth}
                    open={condOpen}
                    onOpenChange={setCondOpen}
                    trigger={<ChipTrigger open={condOpen}>{bundleText}</ChipTrigger>}
                  >
                    {(close) => (
                      <ConditionSettingMenu
                        tabs={condMeta.tabs}
                        optionsByTab={condMeta.optionsByTab}
                        options={condMeta.options}
                        initialTab={node.valueTab}
                        initialItems={node.items}
                        onCancel={close}
                        onSave={(v) => saveBundleCondition(v, close)}
                        onSkip={() => {
                          close();
                          focusNextChainStop(startRef.current);
                        }}
                      />
                    )}
                  </Popover>
                  {variant === 'natural' ? <NaturalText>이면,</NaturalText> : <Comparison>→</Comparison>}
                  {/* 개별설정 — 점수 인풋 자리의 solid 인풋형 트리거(Figma 8535:11956), 클릭=항목별 점수 모달 */}
                  {/* 개별설정 트리거 — data-indiv-for: 묶음 전환(리마운트) 후 포커스 이동용 앵커 */}
                  <span data-indiv-for={node.id} className="inline-flex shrink-0 items-center">
                    <Input
                      size="22"
                      width={68}
                      value="개별설정"
                      readOnly
                      className="cursor-pointer ring-inset ring-text-field-hover-line transition-shadow hover:ring-2 has-[:focus-visible]:ring-2"
                      inputProps={{
                        style: { cursor: 'pointer' },
                        onClick: () => setIndivOpen(true),
                        onKeyDown: (e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setIndivOpen(true);
                          }
                        },
                      }}
                    />
                  </span>
                  {indivOpen && (
                    <ScreeningIndividualSettingModal
                      items={modalItems}
                      value={node.individual ?? null}
                      fitnessOnly={inIf} /* IF 안 조건 — 적합/부적합만 */
                      onClose={() => setIndivOpen(false)}
                      onConfirm={(v) => {
                        patch({ individual: v });
                        setIndivOpen(false);
                        focusNextChainStop(startRef.current); // 묶음 설정 완료 — 다음 수식으로
                      }}
                    />
                  )}
                </>
              );
            })()
          ) : (
            <>
          {/* 값 칩 — 클릭하면 카드의 조건 셀렉트와 동일한 설정 팝오버(탭+라디오), 저장 시 반영 */}
          <Popover
            className="group/chipstop min-w-0 rounded-round-4 focus:outline-none"
            tabIndex={0}
            onKeyDown={(e) => chainTriggerKey(e, condOpen, () => setCondOpen(true))}
            menuWidth={condMenuWidth}
            open={condOpen}
            onOpenChange={setCondOpen}
            trigger={
              <ChipTrigger open={condOpen}>
                {(() => {
                  // 표시 형식은 카드의 조건 셀렉트와 동일 — 탭이 있으면 "대상, 심한 장애인"처럼 탭+옵션
                  const tabLabel = condMeta.tabs.find((t) => t.value === node.valueTab)?.label;
                  if (node.value != null) {
                    const opt = optLabel(valueOpts, node.value);
                    return (tabLabel ? `${tabLabel}, ${opt}` : opt) || '조건';
                  }
                  return tabLabel || '조건'; // disableOptions 탭(미보유 등)은 탭 라벨만
                })()}
              </ChipTrigger>
            }
          >
            {(close) => (
              <ConditionSettingMenu
                tabs={condMeta.tabs}
                optionsByTab={condMeta.optionsByTab}
                options={condMeta.options}
                initialTab={node.valueTab}
                initialOption={node.value}
                initialItems={node.items}
                onCancel={close}
                onSave={(v) => saveBundleCondition(v, close)} /* 카드와 동일 메뉴 — 지정 저장=묶음 전환(2026-07-16) */
                onSkip={() => {
                  close();
                  focusNextChainStop(startRef.current); // 값 미선택 이탈 — 다음 수식으로
                }}
              />
            )}
          </Popover>
          {variant === 'natural' ? <NaturalText>이면,</NaturalText> : <Comparison>→</Comparison>}
          {/* 점수 란 — Input 형태 유지(적합/부적합은 글자 표시). 클릭하면 카드와 동일한
              가/감점 설정 팝오버(ScoreSettingMenu)가 열리고 저장 시에만 반영된다 */}
          <Popover
            className="shrink-0"
            data-score-for={node.id}
            /* tabIndex 없음 — 포커스는 안의 readOnly 인풋이 받는다(체인 keydown만 공유) */
            onKeyDown={(e) => chainTriggerKey(e, scoreOpen, () => setScoreOpen(true))}
            menuWidth={200}
            open={scoreOpen}
            onOpenChange={setScoreOpen}
            trigger={
              <Input
                size="22"
                width={scoreText ? 56 : 48}
                value={
                  scoreText ??
                  (node.points
                    ? `${String(node.points).startsWith('-') ? '' : '+'}${node.points}점`
                    : '')
                }
                readOnly
                placeholder="값"
                // 팝오버 트리거 — 포인터 커서 + hover 링(readOnly라 Input 기본 hover가 꺼져 있어 직접 부여)
                className="cursor-pointer ring-inset ring-text-field-hover-line transition-shadow hover:ring-2 has-[:focus-visible]:ring-2"
                inputProps={{ style: { cursor: 'pointer' } }}
              />
            }
          >
            {(close) => (
              <ScoreSettingMenu
                initialType={scoreType}
                initialPoints={String(node.points ?? '').replace(/^-/, '')}
                disablePoints={inIf} /* IF 안 조건 — 적합/부적합만 */
                onCancel={close}
                onSave={({ type, points }) => {
                  const raw = (points ?? '').replace(/^-/, '');
                  patch({
                    scoreType: type,
                    points: type === 'minus' && raw ? `-${raw}` : type === 'plus' ? raw : '',
                  });
                  close();
                  // 수식 완료 — 체인 규약대로 다음 수식의 시작 필드로 포커스 이동
                  focusNextChainStop(startRef.current);
                }}
                onSkip={() => {
                  close();
                  focusNextChainStop(startRef.current); // 미선택 이탈 — 다음 수식으로
                }}
              />
            )}
          </Popover>
          {variant === 'natural' && <NaturalText>{scoreText ? '처리' : '부여'}</NaturalText>}
            </>
          )}
        </>
      )}
      <Button variant="ghost" size="18" icon={X} aria-label="수식 삭제" onClick={onDelete} />
    </FormulaShell>
  );
}
