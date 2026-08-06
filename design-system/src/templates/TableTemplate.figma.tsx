// TableTemplate Code Connect 매핑(2026-08-02) — table template 심볼(7725:54157).
//   툴바(타이틀+버튼 그룹+검색바) + 테이블(체크박스·태그·아이콘 헤더) + 페이지네이션 일체형.
//   구 MCP 매핑을 CLI로 전환 — 셀 구성 상세는 데모 페이지가 진실.
// 발행: main 머지 시 자동(.github/workflows/figma-code-connect.yml)
// 파서 제약 — URL·props는 리터럴만(변수·스프레드·as const 금지).
import figma from '@figma/code-connect';
import { Download, Plus } from 'lucide-react';
import { Button } from '../components/Button';
import { TableTemplate } from './TableTemplate';
import { Tag } from '../components/Tag';

figma.connect(
  TableTemplate,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7725-54157',
  {
    example: () => (
      <TableTemplate
        title="Table Title"
        searchable
        pagination
        selectable
        columns={[
          { key: 'status', label: '상태', width: 85, render: (row) => <Tag color="blue">{String(row.status)}</Tag> },
          { key: 'name', label: '공고명' },
          { key: 'period', label: '접수 기간' },
          { key: 'apply', label: '지원서', width: 100 },
          { key: 'grade', label: '평가', width: 100 },
        ]}
        rows={[
          { id: 1, status: '접수중', name: '2026 상반기 공채', period: '26.07.01~26.07.31', apply: '128', grade: '-' },
          { id: 2, status: '마감', name: '경력 수시 채용', period: '26.06.01~26.06.30', apply: '64', grade: '진행중' },
        ]}
        actions={
          <>
            <Button variant="line" leftIcon={Plus}>추가</Button>
            <Button variant="line" leftIcon={Download}>내보내기</Button>
          </>
        }
      />
    ),
  },
);
