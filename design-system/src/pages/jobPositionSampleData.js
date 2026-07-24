// Job Position Template A/B 데모 공용 샘플 데이터(2026-07-24 추출 — 페이지·모달 데모가 공유)
export const CRITERIA = [
  { value: 'region', label: '지역' },
  { value: 'employ', label: '고용형태' },
  { value: 'career', label: '경력' },
  { value: 'job', label: '직무' },
];
export const VALUES = {
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
export const JOBDA_GROUPS = [
  { value: 'dev', label: '개발' },
  { value: 'design', label: '디자인' },
  { value: 'biz', label: '경영/비즈니스' },
  { value: 'mkt', label: '마케팅' },
];
export const JOBDA_DUTIES = {
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
