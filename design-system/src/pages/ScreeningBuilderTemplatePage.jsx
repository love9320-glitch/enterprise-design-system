import { useRef, useState } from 'react';
import { ScreeningBuilderTemplate } from '../components/ScreeningBuilderTemplate';
import { Button } from '../components/Button';
import { UsageExample } from '../components/UsageExample';
import { Divider } from '../components/Divider';

const USAGE = `import { ScreeningBuilderTemplate } from '../components/ScreeningBuilderTemplate';

<ScreeningBuilderTemplate
  ref={builderRef}
  defaultCards={[
    {
      id: 'disability', name: '장애 여부',
      conditionTabs: [{ value: 'target', label: '대상' }, { value: 'exclude', label: '비대상' }],
      conditionOptionsByTab: { target: [{ value: 'severe', label: '심한 장애인' }, …], … },
    },
    { id: 'lang', name: '외국어', conditionOptions: [{ value: 'en', label: '영어' }, …] }, // 탭 없이
  ]}
  onChange={(cards) => save(cards)} // [{ id, name, condition, score }]
/>
// builderRef.current.getCards() — 저장 시점 스냅샷 / addCard(card) — 카드 추가(맨 위)`;

const USAGE_PROPS = [
  { name: 'defaultCards', type: 'card[]', default: '[]', desc: 'mount 1회 주입(리셋=key 리마운트) — { id, name, conditionTabs?, conditionOptionsByTab?, conditionOptions?, condition?, score? }' },
  { name: 'onChange', type: '(cards) => void', default: '—', desc: '순서/값/삭제 변경 시 스냅샷 — [{ id, name, condition, score }]' },
  { name: 'cardWidth', type: "number | string | 'fill'", default: '375', desc: '카드 너비' },
  { name: 'onAddCard', type: '() => void', default: '—', desc: "카드 영역 상단 '추가' 버튼 클릭 핸들러 — 미지정 시 빈 카드('새 조건')를 맨 위에 추가" },
  { name: 'cardMenu', type: 'column[][]', default: '[]', desc: "'추가' 버튼의 rich menu — 컬럼>섹션{title, items}>항목{name, 조건 구성}. 항목 클릭=카드 등록(팝오버 유지, 배경 클릭으로만 닫힘)" },
  { name: 'ref (getCards / addCard / getFormulas)', type: '{ getCards(), addCard(card), getFormulas() }', default: '—', desc: '저장 시점 스냅샷 / 카드 추가(맨 위) / 수식 존 배열 조회 — [{ id, formulas }]' },
  { name: 'formulaArea / onFormulaChange', type: 'boolean / (zones) => void', default: 'true / —', desc: '수식 영역 표시 · 존 배열 스냅샷 [{id, formulas}] — leaf={kind, criteria, value, points} / group={kind, fn, children}. 수식 영역 추가 버튼으로 존 확장' },
  { name: '(카드) conditionTabs', type: '{ value, label, disableOptions?, multiSelect?, placeholder?, searchPlaceholder? }[]', default: '[]', desc: '조건 팝오버 상단 탭 — 비우면 탭 없는 radio list. disableOptions 탭(미보유/비대상)은 옵션 disabled + 옵션 없이 저장(값 {tab, option:null}, 표시=탭 라벨). multiSelect 탭(지정)은 라디오 대신 다중 선택 Select(검색+전체 선택/확인) — 저장 값 {tab, items:[…]}, 카드의 가/감점 자리가 개별설정 버튼으로 바뀌고 드롭 시 함수 그룹으로 등록' },
  { name: '(카드) conditionOptionsByTab', type: '{ [tab]: { value, label }[] }', default: '{}', desc: '탭별 조건 옵션(라디오)' },
  { name: '(카드) conditionOptions', type: '{ value, label }[]', default: '[]', desc: '탭 없이 쓸 때의 평면 조건 옵션' },
  { name: '(카드) condition / score', type: 'object', default: 'null', desc: "설정값 — condition={tab?, option}(복수 조건은 {tab, items:[…]}) / score={type: 'plus'|'minus'|'fit'|'unfit', points?} 또는 개별설정 {type:'individual', mode:'points'|'fitness', items:{[항목]:{type, points?}}}" },
];

// 복수 조건(지정) 카드 — 어학/자격/기타 보유여부(Figma 8532:4188~8535:11183).
// 보유/미보유 = 종류 상관없이 적용(기존 개별 조건과 동일), 지정 = 자격증 다중 선택 후 개별설정.
const CERT_OPTIONS = [
  { value: 'toeic-writing', label: '(구)Toeic Writing test' },
  { value: 'toeic-writing-ov', label: '(구)Toeic Writing test (해외)' },
  { value: 'cell', label: 'CELL' },
  { value: 'ceipe-bras', label: 'Ceipe-Bras' },
  { value: 'cet4', label: 'CET 4' },
  { value: 'cet6', label: 'CET 6' },
  { value: 'cpt', label: 'CPT' },
  { value: 'dalf', label: 'DALF' },
  { value: 'dele', label: 'DELE' },
  { value: 'hsk', label: 'HSK' },
  { value: 'jlpt', label: 'JLPT' },
  { value: 'opic', label: 'OPIc' },
];
const CERT_CARD = {
  name: '공인외국어 보유여부',
  conditionTabs: [
    { value: 'have', label: '보유', disableOptions: true },
    {
      value: 'designate',
      label: '지정보유',
      multiSelect: true,
      placeholder: '공인외국어 선택',
      searchPlaceholder: '공인외국어명 검색',
      bundleLabel: '지정보유', // 수식 묶음 칩 표기 — "지정보유, N개 조건 묶음"(Figma 8535:11956)
    },
    { value: 'none', label: '미보유', disableOptions: true },
  ],
  conditionOptionsByTab: { designate: CERT_OPTIONS },
  conditionPlaceholder: '공인외국어 보유여부',
};

// 데모 카드 — Figma 플로우 컷(장애 여부) + 인적사항/외국어 예시
const DEMO_CARDS = [
  { id: 'certificate', ...CERT_CARD },
  {
    id: 'disability',
    name: '장애 여부',
    conditionTabs: [
      { value: 'target', label: '대상' },
      { value: 'exclude', label: '비대상', disableOptions: true }, // 옵션 disabled + 바로 저장 가능
    ],
    conditionOptionsByTab: {
      target: [
        { value: 'severe', label: '심한 장애인' },
        { value: 'mild', label: '심하지 않은 장애인' },
      ],
      exclude: [
        { value: 'severe', label: '심한 장애인' },
        { value: 'mild', label: '심하지 않은 장애인' },
      ],
    },
  },
  {
    id: 'address',
    name: '인적사항 - 현주소',
    conditionOptions: [
      { value: 'seoul', label: '서울' },
      { value: 'gyeonggi', label: '경기' },
      { value: 'incheon', label: '인천' },
      { value: 'etc', label: '그 외 지역' },
    ],
  },
  {
    id: 'lang',
    name: '외국어',
    conditionTabs: [
      { value: 'have', label: '보유' },
      { value: 'none', label: '미보유', disableOptions: true }, // 옵션 disabled + 바로 저장 가능
    ],
    conditionOptionsByTab: {
      have: [
        { value: 'en', label: '영어' },
        { value: 'jp', label: '일본어' },
        { value: 'cn', label: '중국어' },
      ],
      none: [
        { value: 'en', label: '영어' },
        { value: 'jp', label: '일본어' },
        { value: 'cn', label: '중국어' },
      ],
    },
  },
];

// '추가' rich menu — 지원자 정보 카테고리(항목 클릭 시 조건 카드 등록, 배경 클릭으로만 닫힘)
const OPT = (...labels) => labels.map((l, i) => ({ value: `v${i}`, label: l }));
const YN_TABS = [
  { value: 'target', label: '대상' },
  { value: 'exclude', label: '비대상', disableOptions: true },
];
const CARD_MENU = [
  [
    {
      title: '인적사항',
      items: [
        { name: '현주소', conditionOptions: OPT('서울', '경기', '인천', '그 외 지역') },
        { name: '병역구분', conditionOptions: OPT('군필', '미필', '면제') },
        { name: '희망연봉', conditionOptions: OPT('3,000 미만', '3,000~5,000', '5,000 이상') },
        { name: '직전연봉', conditionOptions: OPT('3,000 미만', '3,000~5,000', '5,000 이상') },
        { name: '지방근무가능여부', conditionOptions: OPT('가능', '불가') },
        {
          name: '장애여부',
          conditionTabs: YN_TABS,
          conditionOptionsByTab: {
            target: OPT('심한 장애인', '심하지 않은 장애인'),
            exclude: OPT('심한 장애인', '심하지 않은 장애인'),
          },
        },
        { name: '보훈여부', conditionOptions: OPT('대상', '비대상') },
        { name: '저소득층여부', conditionOptions: OPT('해당', '미해당') },
        { name: '흡연여부', conditionOptions: OPT('흡연', '비흡연') },
        { name: '색약여부', conditionOptions: OPT('해당', '미해당') },
      ],
    },
  ],
  [
    { title: '경력사항', items: [
      { name: '프로젝트', conditionOptions: OPT('보유', '미보유') },
      { name: '총경력', conditionOptions: OPT('3년 미만', '3~7년', '7년 이상') },
    ] },
    { title: '학력사항', items: [{ name: '최종학력', conditionOptions: OPT('고졸', '학사', '석사', '박사') }] },
    { title: '고등학교', items: [
      { name: '학교명', conditionOptions: OPT('서울 소재', '수도권 소재', '그 외') },
      { name: '졸업구분', conditionOptions: OPT('졸업', '중퇴', '검정고시') },
      { name: '소재지', conditionOptions: OPT('서울', '수도권', '그 외') },
    ] },
  ],
  [
    { title: '대학교', items: [
      { name: '학위구분', conditionOptions: OPT('학사', '전문학사') },
      { name: '입학구분', conditionOptions: OPT('신입학', '편입학') },
      { name: '졸업구분', conditionOptions: OPT('졸업', '졸업예정', '중퇴') },
      { name: '학교명', conditionOptions: OPT('서울 소재', '수도권 소재', '그 외') },
      { name: '소재지', conditionOptions: OPT('서울', '수도권', '그 외') },
      { name: '성적', conditionOptions: OPT('상위 10%', '상위 30%', '그 외') },
      { name: '전공명', conditionOptions: OPT('컴퓨터공학', '경영학', '그 외') },
    ] },
  ],
  [
    { title: '대학원', items: [
      { name: '학위구분', conditionOptions: OPT('석사', '박사') },
      { name: '졸업구분', conditionOptions: OPT('졸업', '수료', '재학') },
      { name: '학교명', conditionOptions: OPT('서울 소재', '수도권 소재', '그 외') },
      { name: '소재지', conditionOptions: OPT('서울', '수도권', '그 외') },
      { name: '성적', conditionOptions: OPT('상위 10%', '상위 30%', '그 외') },
      { name: '전공명', conditionOptions: OPT('컴퓨터공학', '경영학', '그 외') },
    ] },
  ],
  [
    { title: '어학/자격/기타', items: [
      CERT_CARD, // 복수 조건(보유/지정/미보유) — 지정=공인외국어 다중 선택 + 개별설정
      { name: '공인외국어 취득점수', conditionOptions: OPT('900 이상', '800~899', '800 미만') },
      { name: '자격증', conditionOptions: OPT('보유', '미보유') },
    ] },
    { title: '지원이력', items: [
      { name: '과거지원이력', conditionOptions: OPT('있음', '없음') },
      { name: '불참이력', conditionOptions: OPT('있음', '없음') },
      { name: '블랙지원자', conditionOptions: OPT('해당', '미해당') },
      { name: '관심지원자', conditionOptions: OPT('해당', '미해당') },
    ] },
  ],
];

let addSeq = 0;

export function ScreeningBuilderTemplatePage() {
  const builderRef = useRef(null);
  const [resetKey, setResetKey] = useState(0);
  const [saved, setSaved] = useState(null);

  return (
    <section className="mx-auto max-w-[1452px] px-spacing-7 py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-20 font-semibold text-font-icon-5">
        Screening Builder Template
      </h2>
      <p className="mb-spacing-8 text-13 text-font-icon-4">
        지원자 정보를 조건화하는 스크리닝 조건 빌더 — 카드마다 조건(탭+라디오 팝오버)과
        가·감점/적합·부적합(라디오 팝오버)을 세팅합니다.
        카드를 우측 수식 영역에 드롭하면 <span className="font-semibold">IF 수식이 추가</span>되고(카드는
        남아 있어 같은 조건을 반복 드롭 가능),
        수식 체크박스(1개 이상) + 함수 선택 + 함수 적용으로 <span className="font-semibold">FN( 수식, 수식 )</span> 그룹을
        만들 수 있습니다(그룹끼리 다시 그룹핑 가능 — 중첩). 함수 계열별 고유 색:{' '}
        <span className="font-semibold text-formula-logical">AND·OR</span> ·{' '}
        <span className="font-semibold text-formula-conditional">IF</span> ·{' '}
        <span className="font-semibold text-formula-aggregate">SUM·MAX·MIN·COUNTIF</span> ·{' '}
        <span className="font-semibold text-formula-score-limit">CAPMAX·CAPMIN</span> ·{' '}
        <span className="font-semibold text-formula-evaluation">FITBYSCORE·UNFITBYSCORE</span>
        <br />
        카드(ScreeningConditionCard)와 수식(ScreeningFormula)은 이 템플릿 전용 내부 컴포넌트입니다 — 독립
        사용 없이 여기서만 조립.
      </p>

      <UsageExample
        code={USAGE}
        props={USAGE_PROPS}
        note="조건·가/감점 팝오버는 저장을 눌러야 값이 반영됩니다(취소·외부 클릭은 폐기). 가점/감점 선택 시에만 점수 입력이 활성화됩니다."
      />

      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div>
        <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">데모</h3>
        <p className="mb-spacing-7 text-12 text-font-icon-4">
          조건 셀렉트를 눌러 탭+라디오로 조건을 고르고 저장 → 가/감점 셀렉트에서 가점(점수 입력)·감점·적합·부적합을
          설정합니다. <span className="font-semibold">공인외국어 보유여부</span> 카드는 복수 조건 카드입니다 —
          지정 탭에서 공인외국어를 다중 선택(검색+전체 선택)하고 저장하면 가/감점 자리가{' '}
          <span className="font-semibold">개별설정</span> 버튼으로 바뀌어, 모달에서 항목별
          가점/감점(또는 적합/부적합)과 적용 함수를 설정합니다. 드롭하면 단수 수식과 같은 골격의 묶음
          수식([조건] = [지정보유, N개 조건 묶음] → [개별설정]) 한 줄로 등록됩니다. 카드는 grip(⠿)을 잡고 수식 영역으로만 드래그합니다(카드끼리 순서 변경 없음), 휴지통으로 삭제합니다.
          <br />
          카드를 <span className="font-semibold">우측 수식 영역에 드롭</span>하면 IF 수식이 추가됩니다(카드는
          남아 있어 같은 조건을 계속 추가 가능) — 수식 체크(1개 이상) + 함수 선택 + 함수 적용으로 그룹을
          만들어 보세요(그룹도 체크해 다시 그룹핑 가능). 그룹을 체크하고 함수 해제를 누르면 그룹이 풀려
          자식 수식들이 그 자리에 펼쳐집니다.
        </p>
        <div className="mb-spacing-7 flex items-center gap-spacing-5">
          <Button
            variant="line"
            size="32"
            onClick={() =>
              builderRef.current?.addCard({
                id: `card-${Date.now().toString(36)}-${++addSeq}`,
                name: '새 조건',
                conditionOptions: [
                  { value: 'a', label: '옵션 A' },
                  { value: 'b', label: '옵션 B' },
                ],
              })
            }
          >
            카드 추가
          </Button>
          <Button variant="line" size="32" onClick={() => setResetKey((k) => k + 1)}>
            리셋
          </Button>
          <Button
            variant="fill"
            size="32"
            onClick={() =>
              setSaved({
                cards: builderRef.current?.getCards() ?? [],
                formulas: builderRef.current?.getFormulas() ?? [],
              })
            }
          >
            저장 (getCards + getFormulas)
          </Button>
        </div>
        <ScreeningBuilderTemplate key={resetKey} ref={builderRef} defaultCards={DEMO_CARDS} cardMenu={CARD_MENU} />
        {saved && (
          <pre className="mt-spacing-7 overflow-x-auto rounded-round-4 bg-base-gray-50 p-spacing-6 text-12 text-font-icon-4">
            {JSON.stringify(saved, null, 2)}
          </pre>
        )}
      </div>
    </section>
  );
}
