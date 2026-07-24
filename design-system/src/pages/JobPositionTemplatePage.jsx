import { useRef, useState } from 'react';
import { JobPositionTemplate } from '../components/JobPositionTemplate';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { UsageExample } from '../components/UsageExample';
import { Divider } from '../components/Divider';
import { CodeCreateModal } from './CodeCreateModal';
import { CRITERIA, VALUES, JOBDA_GROUPS, JOBDA_DUTIES } from './jobPositionSampleData';

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
  { name: 'tableHeight', type: "'fill' | number", default: "'fill'", desc: "테이블 세로 — 'fill'=내용만큼 확장하되 모달 안에선 ModalBody 가용 높이가 상한(닿으면 테이블 바디 내부 스크롤) / 숫자=고정 상한(px, 바디만 스크롤)" },
  { name: 'ref (validate / getRows)', type: '{ validate(): boolean, getRows(): rows }', default: '—', desc: '저장 API — validate()=미선택 칩 에러 표시+통과 여부, getRows()=저장 시점 최신 로우(변경 없이 저장해도 안전)' },
  { name: 'onRegisterCode', type: '() => void', default: '—', desc: "'채용 분야 코드 등록' 버튼 클릭 — 코드 등록 모달 열기 등은 소비자가 연결(registerCodeLabel로 문구 변경). 버튼 위치는 자동: 페이지에선 Step 01 하단, 모달 안에선 모달 푸터 왼쪽" },
  { name: 'showReset / resetLabel / onReset', type: 'boolean / string / () => void', default: "true / '리셋' / —", desc: 'Step 01 타이틀 우측 underline 리셋 버튼 — 조건(순서·사용·선택)과 테이블 행을 초기 상태로 함께 초기화(onReset은 초기화 후 알림)' },
  { name: 'onExcelUpload / onExcelDownload', type: '(file) => void / () => void', default: '— / —', desc: 'Step 02 타이틀 우측 엑셀 버튼(사이 8px) — 업로드는 클릭 시 FileUploadMenu 팝오버(1개 파일·.xlsx/.xls만, excelUploadGuide로 안내 문구 변경)가 열리고 파일 선택 시 onExcelUpload(file) 호출. 다운로드 동작은 소비자 연결' },
  { name: 'jobdaGroupOptions / jobdaDutyOptions', type: '{ value, label }[] / { [group]: { value, label }[] }', default: '[] / {}', desc: "'Jobda 직군/직무 매칭' 컬럼 — 행마다 직군·직무 SelectChip 2개. 직무는 선택한 직군에 종속(직군 변경 시 직무 리셋). 라벨·플레이스홀더는 jobdaLabel/jobdaGroupPlaceholder/jobdaDutyPlaceholder" },
  { name: '라벨들', type: 'string', default: "'채용 분야' 등", desc: '카피 커스텀(orderLabel/jobLabel/manageLabel/emptyMessage/emptyValueMessage) — 섹션 타이틀 없음(테이블 헤더가 조건 구성 표시)' },
];


export function JobPositionTemplatePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [saved, setSaved] = useState(null);
  // '채용 분야 코드 등록' 클릭 → 채용 코드 생성 모달(테스트 페이지에서 추출한 조립) 열기
  const [codeOpen, setCodeOpen] = useState(false);
  // 저장 검증 — 미선택 칩이 있으면 템플릿이 에러 툴팁을 걸고 false 반환(모달 유지)
  const templateRef = useRef(null);

  return (
    <section className="mx-auto max-w-5xl px-spacing-7 py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-20 font-semibold text-font-icon-5">Job Position Template</h2>
      <p className="mb-spacing-9 text-14 text-font-icon-4">
        채용 분야 설정 템플릿. 상하 레이아웃(조건 카드 가로 배치)이고, 카드에는 드래그·사용 스위치·타이틀 없이 기준 셀렉트만 있으며,
        <span className="text-font-icon-5"> 조건 카드에서는 기준만 선택</span>합니다. 기준을 고르는 순간
        <span className="text-font-icon-5"> 채용 분야</span> 테이블에 그 기준의 셀렉트 칩이 들어간 행이
        나타나고, <span className="text-font-icon-5">값은 테이블의 칩에서 선택</span>합니다. 기준 추가/제거·재정렬은
        행 칩에 실시간 반영되고(선택한 값 보존), 조합을 늘릴 땐 행 복사를 사용합니다.
        ConditionOrderSlot·Select·SelectChip·Button·Table 조립(규칙 4)입니다.
      </p>

      <UsageExample code={USAGE} props={USAGE_PROPS} note="tableHeight 기본('fill')은 로우가 늘수록 테이블이 확장되다가, 모달 안에선 가용 높이에 닿으면 테이블 바디만 내부 스크롤됩니다. 고정 상한이 필요하면 숫자(px)를 주세요." />

      <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">단독 배치 (기준만 선택 → 값은 테이블에서)</h3>
      <p className="mb-spacing-6 text-12 text-font-icon-4">
        카드에서 기준을 고르면 즉시 테이블에 행(빈 셀렉트 칩)이 나타나고, 값은 그 칩에서
        고릅니다 — 칩 플레이스홀더에 조건명이 들어갑니다("지역 선택"). 기준을 더 고르면
        행에 칩이 추가되고(이미 고른 값은 보존), 조합을 더 만들려면 행 복사를 쓰세요.
      </p>
      <JobPositionTemplate
        criteriaOptions={CRITERIA}
        valueOptions={VALUES}
        jobdaGroupOptions={JOBDA_GROUPS}
        jobdaDutyOptions={JOBDA_DUTIES}
        tableHeight={370} // 단독 배치 — 테이블 바디 고정 상한(넘치면 내부 스크롤, 2026-07-24 지시)
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
          Modal(3xl) 본문에 템플릿을 넣으면 로우가 늘수록 모달이 늘어나다가, 가용 높이에 닿으면 테이블 바디만 내부 스크롤됩니다(채용 코드 생성 모달과 동일).
          리셋은 템플릿 내장(Step 01 타이틀 우측 underline 버튼)을 사용합니다.
        </p>
        <Button variant="line" onClick={() => setModalOpen(true)}>채용 분야 설정 열기</Button>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="채용 분야 설정"
          size="3xl"
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
            tableHeight={370} // 모달에서도 테이블 바디 고정 상한 — 모달이 계속 커지지 않게(2026-07-24 지시)
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
