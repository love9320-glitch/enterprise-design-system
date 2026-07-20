// 스크리닝 렌더 스모크 테스트 — 조건 카드·수식(일반/묶음/그룹/컴팩트·수식/자연어)·빌더 템플릿을
// SSR(renderToString)로 실제 렌더해 런타임 에러(선언 순서·undefined 참조 등)를 잡는다.
// 빌드(vite)는 구문만 보고 lint는 no-undef를 못 잡는 케이스(TDZ 등)가 있어 별도 실행 검증(2026-07-16 신설).
// 실행: npm run check:render  (esbuild 번들 → node 실행)
// 한계: portal(모달·팝오버 패널)은 SSR 미지원 — 모달은 '컴포넌트 로직 실행'까지만 검증된다.
import { renderToString } from 'react-dom/server';
import { ScreeningFormula } from '../src/components/ScreeningFormula';
import { ScreeningConditionCard } from '../src/components/ScreeningConditionCard';
import { ScreeningIndividualSettingModal } from '../src/components/ScreeningIndividualSettingModal';
import { ScreeningBuilderTemplate } from '../src/components/ScreeningBuilderTemplate';
import { Button } from '../src/components/Button';
import { Slot } from '../src/components/Slot';

const CERT_TABS = [
  { value: 'have', label: '보유', disableOptions: true },
  { value: 'designate', label: '지정', multiSelect: true, bundleLabel: '지정보유' },
  { value: 'none', label: '미보유', disableOptions: true },
];
const CERT_OPTS = [ { value: 'cell', label: 'CELL' }, { value: 'cet4', label: 'CET 4' } ];
const DIS_TABS = [
  { value: 'target', label: '대상' },
  { value: 'exclude', label: '비대상', disableOptions: true },
];
const DIS_OPTS = [ { value: 'severe', label: '심한 장애인' }, { value: 'mild', label: '심하지 않은 장애인' } ];

const catalog = {
  criteriaOptions: [ { value: 'cert', label: '공인외국어 보유여부' }, { value: 'disability', label: '장애여부' } ],
  valueOptionsByCriteria: { cert: CERT_OPTS, disability: DIS_OPTS },
  conditionMetaByCriteria: {
    cert: { tabs: CERT_TABS, optionsByTab: { designate: CERT_OPTS }, options: [] },
    disability: { tabs: DIS_TABS, optionsByTab: { target: DIS_OPTS, exclude: DIS_OPTS }, options: [] },
  },
};

const formulaCases = {
  '일반 leaf(미설정)': { id: 'f1', kind: 'leaf', criteria: 'disability', value: null, valueTab: null, points: '' },
  '일반 leaf(가점)': { id: 'f2', kind: 'leaf', criteria: 'disability', value: 'severe', valueTab: 'target', points: '3', scoreType: 'plus' },
  '일반 leaf(적합)': { id: 'f2b', kind: 'leaf', criteria: 'disability', value: 'mild', valueTab: 'target', points: '', scoreType: 'fit' },
  'compact leaf': { id: 'f3', kind: 'leaf', criteria: 'disability', value: 'severe', valueTab: 'target', points: '3', display: 'compact' },
  '묶음 leaf(개별설정 전)': { id: 'f4', kind: 'leaf', criteria: 'cert', valueTab: 'designate', items: ['cell', 'cet4'], individual: null },
  '묶음 그룹(SUM)': { id: 'g1', kind: 'group', fn: 'SUM', children: [ { id: 'f5', kind: 'leaf', criteria: 'cert', valueTab: 'designate', items: ['cell', 'cet4'], individual: { type: 'individual', mode: 'points', fn: 'SUM', items: { cell: { type: 'plus', points: '2' }, cet4: { type: 'minus', points: '1' } } } } ] },
  'IF 그룹(참/거짓 점수)': { id: 'g-if', kind: 'group', fn: 'IF', children: [ { id: 'f-if', kind: 'leaf', criteria: 'disability', value: 'severe', valueTab: 'target', points: '', scoreType: 'fit' } ], trueScore: '1', falseScore: '0' },
  'IF 그룹(점수 미지정 기본값)': { id: 'g-if2', kind: 'group', fn: 'IF', children: [ { id: 'f-if2', kind: 'leaf', criteria: 'disability', value: 'severe', valueTab: 'target', points: '' } ] },
  'IF 그룹(조건 삭제됨 — 빈 상태)': { id: 'g-if3', kind: 'group', fn: 'IF', children: [] },
  'CAPMAX 그룹(묶음+제한값)': { id: 'g-cap', kind: 'group', fn: 'CAPMAX', capScore: '10', children: [ { id: 'f-cap', kind: 'leaf', criteria: 'cert', valueTab: 'designate', items: ['cell', 'cet4'], individual: { type: 'individual', mode: 'points', items: { cell: { type: 'plus', points: '2' } } } } ] },
  'CAPMIN 그룹(값 미입력·빈 상태)': { id: 'g-cap2', kind: 'group', fn: 'CAPMIN', children: [] },
  'UNFITBYSCORE 그룹(계산식+비교값)': { id: 'g-ubs', kind: 'group', fn: 'UNFITBYSCORE', compareOp: '>=', compareScore: '1', children: [ { id: 'f-ubs', kind: 'leaf', criteria: 'disability', value: 'severe', valueTab: 'target', points: '3', scoreType: 'plus' } ] },
  'FITBYSCORE 그룹(기본값·빈 상태)': { id: 'g-fbs', kind: 'group', fn: 'FITBYSCORE', children: [] },
  '중첩 그룹': { id: 'g2', kind: 'group', fn: 'AND', children: [ { id: 'f6', kind: 'leaf', criteria: 'disability', value: 'severe', valueTab: 'target', points: '3' }, { id: 'g3', kind: 'group', fn: 'SUM', children: [ { id: 'f7', kind: 'leaf', criteria: 'cert', valueTab: 'designate', items: ['cell'], individual: null } ] } ] },
};

// 모달 등 portal 컴포넌트가 render 시점에 document.body를 참조한다 — SSR용 최소 스텁
// (React 서버 렌더러가 portal 지점에서 알려진 예외를 던지면 run()이 통과로 처리)
globalThis.document ??= {
  body: { nodeType: 1, style: {}, appendChild() {}, removeChild() {} },
  createElement: () => ({ style: {}, setAttribute() {} }),
  addEventListener() {},
  removeEventListener() {},
};
globalThis.window ??= { addEventListener() {}, removeEventListener() {}, getComputedStyle: () => ({}) };

let fail = 0;
const run = (name, fn) => {
  try {
    fn();
    console.log(`OK   ${name}`);
  } catch (e) {
    // portal은 SSR 미지원 — 컴포넌트 로직이 portal 지점까지 도달했다면 통과로 간주
    if (String(e.message).includes('Portals are not currently supported')) {
      console.log(`OK*  ${name} (portal 지점 도달 — SSR 한계로 내부 미검증)`);
      return;
    }
    fail += 1;
    console.log(`FAIL ${name}: ${e.message}`);
  }
};

for (const [name, node] of Object.entries(formulaCases)) {
  for (const variant of ['formula', 'natural']) {
    run(`수식 ${name} [${variant}]`, () =>
      renderToString(<ScreeningFormula node={node} root checked={false} onCheckChange={() => {}} onChange={() => {}} onDelete={() => {}} catalog={catalog} variant={variant} />));
  }
}

const cardCases = {
  '카드(일반)': { cardName: '장애여부', conditionTabs: DIS_TABS, conditionOptionsByTab: { target: DIS_OPTS, exclude: DIS_OPTS } },
  '카드(복수, 미설정)': { cardName: '공인외국어 보유여부', conditionTabs: CERT_TABS, conditionOptionsByTab: { designate: CERT_OPTS } },
  '카드(복수, 지정+개별설정)': { cardName: '공인외국어 보유여부', conditionTabs: CERT_TABS, conditionOptionsByTab: { designate: CERT_OPTS }, conditionValue: { tab: 'designate', option: null, items: ['cell', 'cet4'] }, scoreValue: { type: 'individual', mode: 'points', fn: 'SUM', items: { cell: { type: 'plus', points: '2' }, cet4: { type: 'plus', points: '1' } } } },
};
for (const [name, props] of Object.entries(cardCases)) {
  run(name, () => renderToString(<ScreeningConditionCard {...props} />));
}

run('개별설정 모달(가점/감점)', () =>
  renderToString(<ScreeningIndividualSettingModal items={CERT_OPTS} value={{ type: 'individual', mode: 'points', fn: 'SUM', items: { cell: { type: 'plus', points: '2' } } }} onClose={() => {}} onConfirm={() => {}} />));
run('개별설정 모달(적합/부적합)', () =>
  renderToString(<ScreeningIndividualSettingModal items={CERT_OPTS} value={{ type: 'individual', mode: 'fitness', fn: 'SUM', items: { cell: { type: 'fit' } } }} onClose={() => {}} onConfirm={() => {}} />));
run('빌더 템플릿', () =>
  renderToString(<ScreeningBuilderTemplate defaultCards={[{ id: 'cert', name: '공인외국어 보유여부', conditionTabs: CERT_TABS, conditionOptionsByTab: { designate: CERT_OPTS } }]} />));

// Button asChild — <a>로 렌더되고 버튼 클래스가 <a>에 머지되는지(래퍼 <button> 없음)
run('Button asChild → <a>', () => {
  const html = renderToString(<Button asChild variant="fill"><a href="/docs">문서</a></Button>);
  if (!/^<a /.test(html)) throw new Error('루트가 <a>가 아님: ' + html.slice(0, 40));
  if (!/href="\/docs"/.test(html)) throw new Error('href 유실');
  if (!/문서/.test(html)) throw new Error('라벨 유실');
});
run('Button 일반 → <button>', () => {
  const html = renderToString(<Button variant="fill">저장</Button>);
  if (!/^<button /.test(html)) throw new Error('루트가 <button>이 아님');
});
run('Slot 단독 — className 이어붙이기', () => {
  const html = renderToString(<Slot className="ours"><a className="theirs" href="/x">L</a></Slot>);
  if (!/class="theirs ours"/.test(html)) throw new Error('className 병합 실패: ' + html);
});

if (fail === 0) {
  console.log('✅ 렌더 스모크 통과');
} else {
  console.log(`❌ ${fail}건 실패`);
  globalThis.process.exit(1);
}
