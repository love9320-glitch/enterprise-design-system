// Table Code Connect 매핑(2026-08-01) — table SET(7681:4849).
//   - state 변형 4종: Table(기본)/Table outline(bordered)/각 empty(빈 상태 — rows 없음, emptyMessage).
//     variant 스코프로 구성별 예시를 분리(체크박스·태그 등 셀 구성은 데모 페이지가 진실).
// 발행: main 머지 시 자동(.github/workflows/figma-code-connect.yml)
// 파서 제약 — URL·props는 리터럴만(변수·스프레드·as const 금지).
import figma from '@figma/code-connect';
import { Table } from './Table';

// Table — 기본(라운드 헤더, 외곽선 없음)
figma.connect(
  Table,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7681-4849',
  {
    variant: { state: 'Table' },
    example: () => (
      <Table
        columns={[
          { key: 'name', label: '이름' },
          { key: 'dept', label: '부서' },
          { key: 'status', label: '상태' },
        ]}
        rows={[
          { id: 1, name: '홍길동', dept: '인사팀', status: '검토중' },
          { id: 2, name: '김철수', dept: '개발팀', status: '합격' },
        ]}
      />
    ),
  },
);

// Table outline — 외곽선 + 라운드(bordered)
figma.connect(
  Table,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7681-4849',
  {
    variant: { state: 'Table outline' },
    example: () => (
      <Table
        bordered
        columns={[
          { key: 'name', label: '이름' },
          { key: 'dept', label: '부서' },
          { key: 'status', label: '상태' },
        ]}
        rows={[
          { id: 1, name: '홍길동', dept: '인사팀', status: '검토중' },
          { id: 2, name: '김철수', dept: '개발팀', status: '합격' },
        ]}
      />
    ),
  },
);

// Table empty — 빈 상태(기본형)
figma.connect(
  Table,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7681-4849',
  {
    variant: { state: 'Table empty' },
    example: () => (
      <Table
        columns={[
          { key: 'name', label: '이름' },
          { key: 'dept', label: '부서' },
        ]}
        rows={[]}
        emptyMessage="데이터가 없습니다."
      />
    ),
  },
);

// Table outline empty — 빈 상태(외곽선형)
figma.connect(
  Table,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7681-4849',
  {
    variant: { state: 'Table outline empty' },
    example: () => (
      <Table
        bordered
        columns={[
          { key: 'name', label: '이름' },
          { key: 'dept', label: '부서' },
        ]}
        rows={[]}
        emptyMessage="데이터가 없습니다."
      />
    ),
  },
);
