// JobPostingTemplatePage — 채용 공고 설정 템플릿 데모
// Figma "job posting template"(8618:42724, state=empty/fill) — 채용 분야 등록 모달과의 왕복 흐름 포함.
import { useState } from 'react';
import { JobPostingTemplate } from '../../templates/JobPostingTemplate';
import { CodeCreateModal } from '../CodeCreateModal';
import { UsageExample } from '../../components/UsageExample';
import { CRITERIA, VALUES, JOBDA_GROUPS, JOBDA_DUTIES } from './jobPositionSampleData';

const USAGE = `import { useState } from 'react';
import { JobPostingTemplate } from '../../templates/JobPostingTemplate';
import { CodeCreateModal } from '../CodeCreateModal';

// 채용 공고 설정 — FormTemplateB(공고 폼) + 채용 분야 등록 모달(JobPositionTemplate) + Table 조립.
// [채용 분야 등록] 클릭 → 모달에서 기준·값 선택 후 저장 → 저장된 행이 폼 아래 테이블로 들어온다(fill state).
<JobPostingTemplate
  jobTypeOptions={JOB_TYPES}          // 채용구분 옵션
  criteriaOptions={CRITERIA}          // 모달(채용 분야 등록) 기준 목록
  valueOptions={VALUES}               // 기준별 값 목록
  jobdaGroupOptions={JOBDA_GROUPS}    // 테이블·모달 jobda 직군
  jobdaDutyOptions={JOBDA_DUTIES}     // 직군별 직무
  onChange={(postings) => save(postings)} // 공고 전체 스냅샷 — [{ id, form, rows }]
  onAddPosting={(id) => log(id)}      // 공고 추가(맨 위에 폼 추가) 후 알림
  onDeletePosting={(id) => log(id)}   // 공고 삭제 후 알림(하나만 남으면 버튼 disabled)
/>`;

const USAGE_PROPS = [
  { name: 'title', type: 'ReactNode', default: "'채용 공고 설정'", desc: '상단 타이틀 — null이면 숨김' },
  { name: 'jobTypeOptions', type: '{ value, label }[]', default: '[]', desc: '채용구분 셀렉트 옵션' },
  { name: 'criteriaOptions / valueOptions', type: '옵션 / { [기준]: 옵션[] }', default: '[] / {}', desc: '채용 분야 등록 모달(JobPositionTemplate) 기준·값 목록 패스스루' },
  { name: 'jobdaGroupOptions / jobdaDutyOptions', type: '옵션 / { [직군]: 옵션[] }', default: '[] / {}', desc: 'jobda 직군/직무 매칭 — 테이블 칩과 모달 공용' },
  { name: 'postings / defaultPostings / onChange', type: 'JobPosting[]', default: '— / 빈 공고 1개 / —', desc: '공고 목록(controlled/uncontrolled). 공고: { id, form: { name, jobType, period, noDeadline }, rows: JobPostingRow[] } — 폼 값·채용 분야 전체 스냅샷 반출' },
  { name: 'addPostingLabel / onAddPosting', type: 'ReactNode / (id) => void', default: "'공고 추가' / —", desc: '타이틀 우측 공고 추가 버튼(ghost·아이콘 텍스트형) — 누르면 맨 위에 빈 폼 추가 후 알림. 공고명 라벨은 생성 순번 고정("공고명 N." — 먼저 만든 공고가 1., 새 공고가 위로 추가)' },
  { name: 'loadPostingLabel / onLoadPosting', type: 'ReactNode / () => void', default: "'생성된 공고 불러오기' / —", desc: '공고 추가 오른쪽 불러오기 버튼(ghost·database-arrow-down 아이콘) — 불러오기 UI는 소비자 연결' },
  { name: 'onDeletePosting', type: '(id) => void', default: '—', desc: "'공고 삭제' — 해당 공고 제거 후 알림(하나만 남으면 버튼 disabled)" },
  { name: 'onRegisterCode / onTemplateDownload', type: '() => void', default: '—', desc: '모달 안 채용 분야 코드 등록 / 엑셀 양식 다운로드 패스스루' },
  { name: 'modalTitle / modalSize', type: "ReactNode / '2xl'~'fill'", default: "'채용 분야 등록' / '3xl'", desc: '채용 분야 등록 모달 타이틀·크기' },
];

// 채용구분 — 채용 방식 구분(2026-07-28 지시)
const JOB_TYPES = [
  { value: 'open', label: '공개 채용' },
  { value: 'rolling', label: '수시 채용' },
  { value: 'always', label: '상시 채용' },
  { value: 'special', label: '특별 채용' },
];

export function JobPostingTemplatePage() {
  // 채용 분야 등록 모달 안 '채용 분야 코드 등록' 클릭 → 코드 등록 모달을 위에 띄운다(2026-07-28 지시)
  const [codeOpen, setCodeOpen] = useState(false);
  return (
    <section className="py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-20 font-semibold text-font-icon-5">Job Posting Template</h2>
      <p className="mb-spacing-9 text-14 text-font-icon-4">
        채용 공고 설정 템플릿 — 공고 폼(Form Template B)과 채용 분야 테이블을 회색 아우터 박스로 묶습니다.{' '}
        <span className="text-font-icon-5">채용 분야 등록</span> 버튼을 누르면 채용 분야 등록
        모달(Job Position Template)이 열리고, 저장한 조합이 그 폼 아래 테이블로 들어옵니다. 타이틀 우측 공고 추가로 폼을 여러 개 쌓을 수 있습니다(맨 위에 추가, 행 드래그
        순서 변경·jobda 매칭·사용 스위치·삭제 지원).
      </p>

      <UsageExample code={USAGE} props={USAGE_PROPS} note="테이블이 비어 있으면 empty state(폼만), 저장된 행이 생기면 fill state(폼+테이블)로 전환됩니다." />

      <JobPostingTemplate
        jobTypeOptions={JOB_TYPES}
        criteriaOptions={CRITERIA}
        valueOptions={VALUES}
        jobdaGroupOptions={JOBDA_GROUPS}
        jobdaDutyOptions={JOBDA_DUTIES}
        onRegisterCode={() => setCodeOpen(true)}
        onTemplateDownload={() => console.log('양식 다운로드')}
        onDeletePosting={(id) => console.log('공고 삭제', id)}
        onAddPosting={(id) => console.log('공고 추가', id)}
        onLoadPosting={() => console.log('생성된 공고 불러오기')}
      />
      <CodeCreateModal open={codeOpen} onClose={() => setCodeOpen(false)} />
    </section>
  );
}
