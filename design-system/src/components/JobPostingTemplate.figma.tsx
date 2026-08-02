// JobPostingTemplate Code Connect 매핑(2026-08-02) — job posting template SET(8618:42724).
//   - state: Empty state(빈 공고 폼)/Fill state(폼 값+등록 테이블) — defaultPostings로 표현.
//   상세 옵션(채용 분야 모달 왕복 등)은 데모 페이지가 진실.
// 발행: main 머지 시 자동(.github/workflows/figma-code-connect.yml)
// 파서 제약 — URL·props는 리터럴만(변수·스프레드·as const 금지).
import figma from '@figma/code-connect';
import { JobPostingTemplate } from './JobPostingTemplate';

// Empty state — 빈 공고 폼(채용 분야 미등록)
figma.connect(
  JobPostingTemplate,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=8618-42724',
  {
    variant: { state: 'Empty state' },
    example: () => (
      <JobPostingTemplate
        title="채용 공고 설정"
        jobTypeOptions={[
          { value: 'open', label: '공개채용' },
          { value: 'always', label: '상시채용' },
        ]}
        criteriaOptions={[{ value: 'region', label: '지역' }]}
        valueOptions={{ region: [{ value: 'seoul', label: '서울' }] }}
        onChange={() => {}}
      />
    ),
  },
);

// Fill state — 폼 값 + 등록된 채용 분야 테이블
figma.connect(
  JobPostingTemplate,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=8618-42724',
  {
    variant: { state: 'Fill state' },
    example: () => (
      <JobPostingTemplate
        title="채용 공고 설정"
        jobTypeOptions={[
          { value: 'open', label: '공개채용' },
          { value: 'always', label: '상시채용' },
        ]}
        criteriaOptions={[{ value: 'region', label: '지역' }]}
        valueOptions={{ region: [{ value: 'seoul', label: '서울' }] }}
        defaultPostings={[
          {
            id: 'p1',
            seq: 1,
            form: {
              name: '2026 상반기 공채',
              jobType: 'open',
              period: { start: new Date(2026, 6, 1), end: new Date(2026, 6, 31) },
              noDeadline: false,
            },
            rows: [
              { id: 'r1', items: [{ criteria: 'region', value: 'seoul' }], enabled: true },
            ],
          },
        ]}
        onChange={() => {}}
      />
    ),
  },
);
