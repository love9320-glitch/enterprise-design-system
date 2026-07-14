// ScreeningFormula — 스크리닝 수식 (Figma Formula 8383:112161 · 그룹 8384:114161/114251 · 함수 색상표 8384:114813)
// ⚠️ 내부용(ScreeningBuilderTemplate 전용) 컴포넌트 — 조건 카드를 수식 영역에 드롭하면 이 수식으로 치환된다.
//    독립 데모 페이지 없이 ScreeningBuilderTemplate 데모에서 함께 확인한다.
//
// 노드 모델(재귀 트리):
//  - leaf : { id, kind:'leaf', criteria, criteriaOptions, value, valueOptions, points, display?('full'|'compact') }
//           → IF( 기준칩 == 값칩 , 점수입력 )  /  compact = IF( "기준, 값, 점수" 요약칩 ) — 클릭 시 펼침
//  - group: { id, kind:'group', fn:'SUM'…, children:[node…] }
//           → FN( 자식수식 , 자식수식 [, 조건 추가 존] + )  — + 클릭 시에만 '조건 추가' 드롭 존이 나타나고
//             카드를 드롭하면 그 그룹에 수식이 추가된다. 그룹은 다른 수식·그룹과 다시 그룹핑될 수 있다
// 함수 계열별 고유 텍스트 컬러(formula-* 토큰): AND·OR=green / IF=blue / SUM·MAX·MIN·COUNTIF=violet /
// CAPMAX·CAPMIN=pink / FITBYSCORE·UNFITBYSCORE=orange. hover 아웃라인도 계열 색을 따른다.
// 체크박스는 최상위(root)에서만 노출 — 그룹핑 대상 선택용(ScreeningBuilderTemplate이 관리).
import { useState, useRef } from 'react';
import { X, Plus, ChevronDown } from 'lucide-react';
import { Checkbox } from './Checkbox';
import { SelectChip } from './Select';
import { Input } from './Input';
import { Button } from './Button';
import { Popover } from './Popover';
import { useHoverTooltip } from './useHoverTooltip';
import { ScoreSettingMenu, ConditionSettingMenu } from './ScreeningConditionCard';
import { CHIP_COLOR_CLASS } from './chipStyles';
import { FORMULA_FN_FAMILY } from './formulaFunctions';

// 계열별 정적 클래스 매핑 (Tailwind purge 안전)
const FAMILY_TEXT = {
  logical: 'text-formula-logical',
  conditional: 'text-formula-conditional',
  aggregate: 'text-formula-aggregate',
  'score-limit': 'text-formula-score-limit',
  evaluation: 'text-formula-evaluation',
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
function FormulaShell({ family, className = '', children }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onMouseOut={(e) => {
        e.stopPropagation();
        setHovered(false);
      }}
      className={`inline-flex max-w-full flex-wrap items-center gap-spacing-4 rounded-round-4 border px-spacing-6 py-spacing-5 transition-colors ${
        hovered
          ? `bg-formula-hover-bg ${FAMILY_HOVER_BORDER[family] ?? 'border-formula-default-outline'}`
          : 'border-formula-default-outline bg-formula-default-bg'
      } ${className}`}
    >
      {children}
    </div>
  );
}

const Paren = ({ children }) => (
  <span className="shrink-0 text-12 font-semibold text-formula-parentheses">{children}</span>
);
const Comparison = ({ children }) => (
  <span className="shrink-0 text-12 font-semibold text-formula-comparison">{children}</span>
);
const FnName = ({ fn }) => (
  <span className={`shrink-0 text-12 font-semibold ${FAMILY_TEXT[FORMULA_FN_FAMILY[fn]] ?? 'text-formula-comparison'}`}>
    {fn}
  </span>
);

const optLabel = (options, v) => options?.find((o) => o.value === v)?.label ?? '';

// '조건 추가' dashed 드롭 존 (Figma FormulaAdd 8384:113414 — Default/drop 2상태, + 버튼과 별개 컴포넌트).
// 조건 카드를 이 위에 드롭하면 그 그룹 안에 수식이 추가된다. 내부 X 버튼 클릭 시 영역 삭제(onClose).
// hover 시 사용법 안내 툴팁("조건 카드를 드래그 앤 드롭하세요")을 띄운다.
function FormulaAddZone({ onDropLeaf, getDropLeaf, onClose }) {
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
      className={`flex h-[38px] shrink-0 items-center gap-spacing-4 rounded-round-4 border border-dashed py-spacing-5 pl-spacing-7 pr-spacing-5-5 text-12 font-semibold transition-colors ${
        over
          ? 'border-formula-add-drop-outline bg-formula-add-drop-bg text-formula-add-drop-text'
          : 'border-formula-add-outline bg-formula-add-bg text-formula-add-text'
      }`}
    >
      조건 추가
      {/* X 버튼 위에서는 영역 툴팁을 숨겨 버튼 툴팁과 겹치지 않게 — 벗어나면 다시 표시 */}
      <span
        className="inline-flex shrink-0 items-center"
        onMouseEnter={hoverTip.onMouseLeave}
        onMouseLeave={() => {
          if (zoneRef.current) hoverTip.onMouseEnter({ currentTarget: zoneRef.current });
        }}
      >
        <Button variant="ghost" size="18" icon={X} aria-label="영역 삭제" onClick={onClose} />
      </span>
      {hoverTip.tooltip}
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
      className={className}
    />
  );
}

// 그룹 수식 — FN( 자식 , … [, 조건 추가 존] + ) X
// '조건 추가' 드롭 존은 평소엔 없고 + 버튼을 클릭했을 때만 나타난다(2026-07-16 지시).
// 카드를 드롭하면 그 그룹에 수식이 추가되고 존은 다시 사라진다(+ 재클릭으로 닫기도 가능).
function FormulaGroup({ node, root, checked, onCheckChange, onChange, onDelete, getDropLeaf, catalog, className }) {
  // 조건 추가 존 목록 — +는 누를 때마다 존을 하나씩 추가(토글 아님, 2026-07-14 지시), 닫기는 각 존의 X
  const [addZoneIds, setAddZoneIds] = useState([]);
  const addSeqRef = useRef(0);
  const appendAddZone = () => setAddZoneIds((prev) => [...prev, `add-${++addSeqRef.current}`]);
  const removeAddZone = (id) => setAddZoneIds((prev) => prev.filter((x) => x !== id));
  const patch = (p) => onChange?.({ ...node, ...p });
  const family = FORMULA_FN_FAMILY[node.fn];
  const replaceChild = (idx, next) => {
    const children = node.children.slice();
    children[idx] = next;
    patch({ children });
  };
  const removeChild = (idx) => patch({ children: node.children.filter((_, i) => i !== idx) });
  return (
    <FormulaShell family={family} className={className}>
      {root && onCheckChange && (
        <Checkbox checked={checked} onChange={(e) => onCheckChange(e.target.checked)} />
      )}
      <FnName fn={node.fn} />
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
          />
        </span>
      ))}
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
      <Paren>)</Paren>
      <Button variant="ghost" size="18" icon={X} aria-label="수식 삭제" onClick={onDelete} />
    </FormulaShell>
  );
}

// 적합/부적합 라벨 — scoreType이 fit/unfit인 leaf는 점수 입력 대신 글자 표시
const SCORE_TEXT = { fit: '적합', unfit: '부적합' };

// 칩 모양 팝오버 트리거 — SelectChip 트리거와 동일한 비주얼(chip-* 토큰), 클릭 토글은 Popover가 담당
function ChipTrigger({ children, open }) {
  return (
    <span
      className={`inline-flex min-w-0 cursor-pointer items-center gap-spacing-3 rounded-round-4 border pl-spacing-4 pr-spacing-3 py-spacing-1 text-12 font-normal transition-colors ${CHIP_COLOR_CLASS.gray}`}
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
function FormulaLeaf({ node, root, checked, onCheckChange, onChange, onDelete, catalog, className }) {
  const patch = (p) => onChange?.({ ...node, ...p });
  const isCompact = node.display === 'compact';
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
  return (
    <FormulaShell family="conditional" className={className}>
      {root && onCheckChange && (
        <Checkbox checked={checked} onChange={(e) => onCheckChange(e.target.checked)} />
      )}
      <FnName fn="IF" />
      <Paren>(</Paren>
      {isCompact ? (
        // compact 요약칩 — 파란 텍스트·연파랑 라인. 클릭하면 full로 펼침
        <button
          type="button"
          onClick={() => patch({ display: 'full' })}
          className="inline-flex min-w-0 items-center gap-spacing-3 rounded-round-4 border border-formula-compact-chip-line bg-formula-default-bg py-spacing-1 pl-spacing-4 pr-spacing-3 text-12 text-formula-compact-chip-text"
        >
          <span className="truncate">
            {[optLabel(criteriaOpts, node.criteria) || optLabel(node.criteriaOptions, node.criteria), optLabel(valueOpts, node.value), scoreText ?? node.points]
              .filter(Boolean)
              .join(', ')}
          </span>
          <ChevronDown size={12} strokeWidth={1.8} className="shrink-0" />
        </button>
      ) : (
        <>
          {/* 조건(기준) 칩 — 조건 종류(왼쪽 카드 리스트) 선택 + 검색창. 기준이 바뀌면 값·탭 리셋.
              Tab: 기준이 선택돼 있으면 바로 값 칩 팝오버로 이어간다(2026-07-14 지시) */}
          <span
            onKeyDown={(e) => {
              if (e.key !== 'Tab' || e.shiftKey || e.defaultPrevented) return;
              if (node.criteria == null) return;
              e.preventDefault();
              setCondOpen(true);
            }}
          >
            <SelectChip
              options={criteriaOpts}
              value={node.criteria}
              onChange={(e) => patch({ criteria: e.target.value, value: null, valueTab: null })}
              placeholder="조건"
              searchable
              searchPlaceholder="조건 카드 검색"
              menuWidth={160}
            />
          </span>
          <Comparison>==</Comparison>
          {/* 값 칩 — 클릭하면 카드의 조건 셀렉트와 동일한 설정 팝오버(탭+라디오), 저장 시 반영 */}
          <Popover
            className="min-w-0"
            menuWidth="max-content"
            open={condOpen}
            onOpenChange={setCondOpen}
            trigger={
              <ChipTrigger open={condOpen}>
                {(node.value != null
                  ? optLabel(valueOpts, node.value)
                  : condMeta.tabs.find((t) => t.value === node.valueTab)?.label) || '조건'}
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
                onCancel={close}
                onSave={(v) => {
                  patch({ value: v.option ?? null, valueTab: v.tab ?? null });
                  close();
                }}
                onTabNext={() => setScoreOpen(true)} // Tab: 값 저장 → 바로 점수 등록
              />
            )}
          </Popover>
          <Comparison>,</Comparison>
          {/* 점수 란 — Input 형태 유지(적합/부적합은 글자 표시). 클릭하면 카드와 동일한
              가/감점 설정 팝오버(ScoreSettingMenu)가 열리고 저장 시에만 반영된다 */}
          <Popover
            className="shrink-0"
            menuWidth={200}
            open={scoreOpen}
            onOpenChange={setScoreOpen}
            trigger={
              <Input
                size="22"
                width={scoreText ? 56 : 48}
                value={scoreText ?? (node.points ? `${node.points}점` : '')}
                readOnly
                placeholder="값"
                // 팝오버 트리거 — 포인터 커서 + hover 링(readOnly라 Input 기본 hover가 꺼져 있어 직접 부여)
                className="cursor-pointer ring-inset ring-text-field-hover-line transition-shadow hover:ring-2"
                inputProps={{ style: { cursor: 'pointer' } }}
              />
            }
          >
            {(close) => (
              <ScoreSettingMenu
                initialType={scoreType}
                initialPoints={String(node.points ?? '').replace(/^-/, '')}
                onCancel={close}
                onSave={({ type, points }) => {
                  const raw = (points ?? '').replace(/^-/, '');
                  patch({
                    scoreType: type,
                    points: type === 'minus' && raw ? `-${raw}` : type === 'plus' ? raw : '',
                  });
                  close();
                }}
              />
            )}
          </Popover>
          {/* 거짓(불일치) 값 — 항상 0점 고정 텍스트: IF( 조건 == 값 , 점수 , 0점 ) */}
          <Comparison>,</Comparison>
          <span className="shrink-0 text-12 text-formula-comparison">0점</span>
        </>
      )}
      <Paren>)</Paren>
      <Button variant="ghost" size="18" icon={X} aria-label="수식 삭제" onClick={onDelete} />
    </FormulaShell>
  );
}
