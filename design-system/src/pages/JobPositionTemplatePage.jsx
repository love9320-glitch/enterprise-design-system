import { useRef, useState } from 'react';
import { JobPositionTemplate } from '../components/JobPositionTemplate';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { UsageExample } from '../components/UsageExample';
import { Divider } from '../components/Divider';
import { CodeCreateModal } from './CodeCreateModal';

const USAGE = `import { JobPositionTemplate } from '../components/JobPositionTemplate';

<JobPositionTemplate
  criteriaOptions={[{ value: 'region', label: '지역' }, …]}
  valueOptions={{ region: [{ value: 'seoul', label: '서울' }, …], … }}
  onChange={(rows) => save(rows)}   // 로우 추가/삭제/칩 변경 시 전체 스냅샷
/>`;

const USAGE_PROPS = [
  { name: 'criteriaOptions', type: '{ value, label }[]', default: '[]', desc: '조건 카드의 기준 목록(첫 Select)' },
  { name: 'valueOptions', type: '{ [criteria]: { value, label }[] }', default: '{}', desc: '기준별 값 목록 — 카드의 값 Select와 로우 SelectChip이 공용' },
  { name: 'conditionCount', type: 'number', default: '4', desc: '조건 카드 수' },
  { name: 'multiLastValue', type: 'boolean', default: 'false', desc: '마지막(맨 아래) 조건 값을 체크박스 다중 선택으로 — 체크 즉시 값마다 행 추가(각 행=단일 조합, 중복 건너뜀), 해제·행 삭제 시 양방향 동기화. false면 조합 완성 순간 자동 추가' },
  { name: 'defaultDisabledIds', type: 'string[]', default: '조건 1만 사용', desc: "초기 미사용(스위치 off) 조건 id (id=cond-1..cond-N) — 미지정 시 조건 1만 사용. 전부 켜려면 []. 테이블에 행이 있는 동안엔 사용/미사용 스위치가 현재 상태로 잠기고(뎁스 고정) 리셋해야 풀림" },
  { name: 'defaultRows / onChange', type: 'rows / (rows) => void', default: '[] / —', desc: '로우 스냅샷 반출 — [{ id, items: [{ criteria, value }] }] (추가/삭제/칩 변경 시)' },
  { name: 'tableHeight', type: "'fill' | number", default: "'fill'", desc: "테이블 세로 — 'fill'=내용만큼 확장하되 모달 안에선 ModalBody 가용 높이가 상한(닿으면 테이블 바디 내부 스크롤) / 숫자=고정 상한(px, 바디만 스크롤)" },
  { name: 'ref (validate / getRows)', type: '{ validate(): boolean, getRows(): rows }', default: '—', desc: '저장 API — validate()=미선택 칩 에러 표시+통과 여부, getRows()=저장 시점 최신 로우(변경 없이 저장해도 안전)' },
  { name: 'onRegisterCode', type: '() => void', default: '—', desc: "'채용 분야 코드 등록' 버튼 클릭 — 코드 등록 모달 열기 등은 소비자가 연결(registerCodeLabel로 문구 변경). 버튼 위치는 자동: 페이지에선 Step 01 하단, 모달 안에선 모달 푸터 왼쪽" },
  { name: 'showReset / resetLabel / onReset', type: 'boolean / string / () => void', default: "true / '리셋' / —", desc: 'Step 01 타이틀 우측 underline 리셋 버튼 — 조건(순서·사용·선택)과 테이블 행을 초기 상태로 함께 초기화(onReset은 초기화 후 알림)' },
  { name: 'jobdaGroupOptions / jobdaDutyOptions', type: '{ value, label }[] / { [group]: { value, label }[] }', default: '[] / {}', desc: "'Jobda 직군/직무 매칭' 컬럼 — 행마다 직군·직무 SelectChip 2개. 직무는 선택한 직군에 종속(직군 변경 시 직무 리셋). 라벨·플레이스홀더는 jobdaLabel/jobdaGroupPlaceholder/jobdaDutyPlaceholder" },
  { name: 'step1Title / step2Title / 라벨들', type: 'string', default: "'1. 조건 조합 설정' 등", desc: '카피 커스텀(orderLabel/jobLabel/manageLabel/emptyMessage/emptyValueMessage)' },
];

const CRITERIA = [
  { value: 'region', label: '지역' },
  { value: 'employ', label: '고용형태' },
  { value: 'career', label: '경력' },
  { value: 'job', label: '직무' },
];
const VALUES = {
  region: [
    { value: 'seoul', label: '서울' },
    { value: 'busan', label: '부산' },
    { value: 'remote', label: '재택' },
  ],
  employ: [
    { value: 'regular', label: '정규직' },
    { value: 'contract', label: '계약직' },
  ],
  career: [
    { value: 'new', label: '신입' },
    { value: 'exp', label: '경력' },
  ],
  job: [
    { value: 'fe', label: '프론트엔드' },
    { value: 'be', label: '백엔드' },
    { value: 'design', label: '디자인' },
    { value: 'ios', label: 'iOS' },
    { value: 'android', label: '안드로이드' },
    { value: 'data', label: '데이터 엔지니어' },
    { value: 'ml', label: '머신러닝' },
    { value: 'devops', label: 'DevOps' },
    { value: 'sre', label: 'SRE' },
    { value: 'security', label: '보안' },
    { value: 'qa', label: 'QA' },
    { value: 'pm', label: '프로덕트 매니저' },
    { value: 'po', label: '프로덕트 오너' },
    { value: 'marketing', label: '마케팅' },
    { value: 'sales', label: '영업' },
    { value: 'cs', label: '고객 지원' },
    { value: 'hr', label: '인사' },
    { value: 'finance', label: '재무' },
    { value: 'legal', label: '법무' },
    { value: 'content', label: '콘텐츠 에디터' },
  ],
};

// Jobda 직군/직무 매칭 샘플 — 직군 선택 후 그 직군의 직무만 선택 가능(종속)
const JOBDA_GROUPS = [
  { value: 'dev', label: '개발' },
  { value: 'design', label: '디자인' },
  { value: 'biz', label: '경영/비즈니스' },
  { value: 'mkt', label: '마케팅' },
];
const JOBDA_DUTIES = {
  dev: [
    { value: 'fe', label: '프론트엔드 개발자' },
    { value: 'be', label: '서버 개발자' },
    { value: 'app', label: '앱 개발자' },
    { value: 'data', label: '데이터 엔지니어' },
  ],
  design: [
    { value: 'ux', label: 'UX 디자이너' },
    { value: 'ui', label: 'UI/GUI 디자이너' },
    { value: 'bx', label: 'BX 디자이너' },
  ],
  biz: [
    { value: 'hr', label: '인사 담당자' },
    { value: 'fin', label: '재무 담당자' },
    { value: 'pm', label: '프로덕트 매니저' },
  ],
  mkt: [
    { value: 'perf', label: '퍼포먼스 마케터' },
    { value: 'content', label: '콘텐츠 마케터' },
    { value: 'brand', label: '브랜드 마케터' },
  ],
};

export function JobPositionTemplatePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [saved, setSaved] = useState(null);
  // '채용 분야 코드 등록' 클릭 → 채용 코드 생성 모달(테스트 페이지에서 추출한 조립) 열기
  const [codeOpen, setCodeOpen] = useState(false);
  // 저장 검증 — 미선택 칩이 있으면 템플릿이 에러 툴팁을 걸고 false 반환(모달 유지)
  const templateRef = useRef(null);

  return (
    <section className="mx-auto max-w-6xl px-spacing-7 py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-20 font-semibold text-font-icon-5">Job Position Template</h2>
      <p className="mb-spacing-9 text-14 text-font-icon-4">
        채용 분야 설정 템플릿. <span className="text-font-icon-5">1. 조건 조합 설정</span>에서 조건 카드(기준·값)를
        정렬·사용 설정하면 <span className="text-font-icon-5">선택이 곧 테이블 반영</span>입니다 — 다중(체크박스)
        조건은 체크하는 즉시 <span className="text-font-icon-5">2. 채용 분야 추가</span> 테이블에 조합 행이
        추가되고, 해제하거나 행을 삭제하면 양쪽이 함께 정리됩니다(중복 조합은 건너뜀, 최신이 위).
        로우의 SelectChip을 클릭해 그 자리에서 값을 바꿀 수 있습니다.
        ConditionOrderSlot·Select·SelectChip·Button·Table 조립(규칙 4)입니다.
      </p>

      <UsageExample code={USAGE} props={USAGE_PROPS} note="tableHeight 기본('fill')은 로우가 늘수록 테이블이 확장되다가, 모달 안에선 가용 높이에 닿으면 테이블 바디만 내부 스크롤됩니다. 고정 상한이 필요하면 숫자(px)를 주세요." />

      <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">단독 배치 (multiLastValue — 마지막 조건 다중 선택)</h3>
      <p className="mb-spacing-6 text-12 text-font-icon-4">
        <code className="text-font-icon-5">multiLastValue</code>를 켜면 마지막 활성 조건의 값이 체크박스
        다중 선택이 됩니다. 처음엔 조건 1만 사용 상태 — 스위치로 조건을 더 켠 뒤, 앞 조건들을 채우고 값을
        체크하는 즉시 행이 생깁니다(값마다 하나씩, 중복은 건너뜀). 행이 생기면 사용/미사용 스위치가 잠겨
        조건 구성(뎁스)을 바꿀 수 없고, 체크 해제·행 삭제·리셋으로 되돌립니다.
      </p>
      <JobPositionTemplate
        criteriaOptions={CRITERIA}
        valueOptions={VALUES}
        multiLastValue
        jobdaGroupOptions={JOBDA_GROUPS}
        jobdaDutyOptions={JOBDA_DUTIES}
        onChange={setSaved}
        onRegisterCode={() => setCodeOpen(true)}
      />
      {saved && (
        <p className="mt-spacing-5 text-12 text-font-icon-4">
          onChange 스냅샷: 로우 {saved.length}건
        </p>
      )}

      {/* 모달 조립 예시 */}
      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div>
        <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">모달 조립 — 채용 분야 설정</h3>
        <p className="mb-spacing-6 text-12 text-font-icon-4">
          Modal(4xl) 본문에 템플릿을 넣으면 로우가 늘수록 모달이 늘어나다가, 가용 높이에 닿으면 테이블 바디만 내부 스크롤됩니다(채용 코드 생성 모달과 동일).
          리셋은 템플릿 내장(Step 01 타이틀 우측 underline 버튼)을 사용합니다.
        </p>
        <Button variant="line" onClick={() => setModalOpen(true)}>채용 분야 설정 열기</Button>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="채용 분야 설정"
          size="4xl"
          confirmText="저장"
          cancelText="취소"
          onConfirm={() => {
            if (!templateRef.current?.validate()) return; // 빈 칩 있으면 저장 중단(에러 툴팁)
            setSaved(templateRef.current.getRows()); // 저장 시점 최신 로우 — 실무에선 여기서 API 호출
            setModalOpen(false);
          }}
        >
          <JobPositionTemplate
            ref={templateRef}
            criteriaOptions={CRITERIA}
            valueOptions={VALUES}
            multiLastValue
                jobdaGroupOptions={JOBDA_GROUPS}
            jobdaDutyOptions={JOBDA_DUTIES}
            onRegisterCode={() => setCodeOpen(true)}
          />
        </Modal>
      </div>

      {/* 채용 코드 생성 모달 — 단독/모달 조립 양쪽의 '채용 분야 코드 등록' 버튼이 연다(모달 위 모달 스택 지원) */}
      <CodeCreateModal open={codeOpen} onClose={() => setCodeOpen(false)} />
    </section>
  );
}
