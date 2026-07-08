import { useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { JobPositionTemplate } from '../components/JobPositionTemplate';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { UsageExample } from '../components/UsageExample';
import { Divider } from '../components/Divider';

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
  { name: 'defaultRows / onChange', type: 'rows / (rows) => void', default: '[] / —', desc: '로우 스냅샷 반출 — [{ id, items: [{ criteria, value }] }] (추가/삭제/칩 변경 시)' },
  { name: 'tableHeight', type: "'fill' | number", default: "'fill'", desc: "테이블 세로 — 'fill'=내용만큼 계속 확장(모달에선 바디 전체 스크롤) / 숫자=고정 상한(px, 바디만 스크롤)" },
  { name: 'ref (validate / getRows)', type: '{ validate(): boolean, getRows(): rows }', default: '—', desc: '저장 API — validate()=미선택 칩 에러 표시+통과 여부, getRows()=저장 시점 최신 로우(변경 없이 저장해도 안전)' },
  { name: 'step1Title / step2Title / addLabel / 라벨들', type: 'string', default: "'1. 조건 조합 설정' 등", desc: '카피 커스텀(orderLabel/jobLabel/manageLabel/inputPlaceholder/emptyMessage)' },
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

export function JobPositionTemplatePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [saved, setSaved] = useState(null);
  // 리셋 — key 리마운트로 템플릿 내부 상태(조건 선택·정렬·사용·로우)를 통째로 초기화(모달은 유지)
  const [resetKey, setResetKey] = useState(0);
  // 저장 검증 — 미선택 칩이 있으면 템플릿이 에러 툴팁을 걸고 false 반환(모달 유지)
  const templateRef = useRef(null);

  return (
    <section className="mx-auto max-w-6xl px-spacing-7 py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-20 font-semibold text-font-icon-5">Job Position Template</h2>
      <p className="mb-spacing-9 text-14 text-font-icon-4">
        채용 직무 설정 템플릿. <span className="text-font-icon-5">1. 조건 조합 설정</span>에서 조건 카드(기준·값)를
        정렬·사용 설정하면 활성 조건의 값이 <span className="text-font-icon-5">2. 채용 직무 추가</span>의 read-only
        인풋에 실시간 표시되고, 추가 버튼으로 외곽선 무한 스크롤 테이블에 로우가 쌓입니다(최신이 위).
        로우의 SelectChip을 클릭해 그 자리에서 값을 바꿀 수 있습니다.
        ConditionOrderSlot·Select·SelectChip·Input·Button·Table 조립(규칙 4)입니다.
      </p>

      <UsageExample code={USAGE} props={USAGE_PROPS} note="tableHeight 기본('fill')은 로우가 늘수록 테이블이 계속 확장됩니다(모달에선 모달 바디가 스크롤). 고정 상한이 필요하면 숫자(px)를 주세요." />

      <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">단독 배치</h3>
      <JobPositionTemplate criteriaOptions={CRITERIA} valueOptions={VALUES} onChange={setSaved} />
      {saved && (
        <p className="mt-spacing-5 text-12 text-font-icon-4">
          onChange 스냅샷: 로우 {saved.length}건
        </p>
      )}

      {/* 모달 조립 예시 */}
      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div>
        <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">모달 조립 — 채용 직무 설정</h3>
        <p className="mb-spacing-6 text-12 text-font-icon-4">
          Modal(3xl) 본문에 템플릿을 넣으면 로우가 늘수록 모달이 늘어나고, 가용 높이를 넘으면 모달 바디가 스크롤됩니다.
          푸터 좌측 리셋 버튼은 footerStart + footerStartType="button"(왼쪽 여백 12px)입니다.
        </p>
        <Button variant="line" onClick={() => setModalOpen(true)}>채용 직무 설정 열기</Button>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="채용 직무 설정"
          size="3xl"
          confirmText="저장"
          cancelText="취소"
          onConfirm={() => {
            if (!templateRef.current?.validate()) return; // 빈 칩 있으면 저장 중단(에러 툴팁)
            setSaved(templateRef.current.getRows()); // 저장 시점 최신 로우 — 실무에선 여기서 API 호출
            setModalOpen(false);
          }}
          footerStart={
            <Button variant="line" leftIcon={RotateCcw} onClick={() => setResetKey((k) => k + 1)}>
              리셋
            </Button>
          }
          footerStartType="button"
        >
          <JobPositionTemplate
            key={resetKey}
            ref={templateRef}
            criteriaOptions={CRITERIA}
            valueOptions={VALUES}
          />
        </Modal>
      </div>
    </section>
  );
}
