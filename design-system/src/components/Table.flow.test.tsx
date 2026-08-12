// Table 흐름 테스트 (2026-08-13 운영안 ⓑ) — 선택/정렬(aria-sort)/행 이름/이벤트 충돌
import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Table } from './Table';

const COLUMNS = [
  { key: 'name', label: '이름' },
  { key: 'score', label: '점수', headerMenu: { sortable: true } },
];
const ROWS = [
  { id: 1, name: '김서연', score: 90 },
  { id: 2, name: '이준호', score: 70 },
  { id: 3, name: '박지민', score: 80 },
];

describe('Table 선택', () => {
  it('전체 선택 → 전 행 선택, 개별 해제 → 배열에서 제거', async () => {
    const onSelectChange = vi.fn();
    render(
      <Table columns={COLUMNS} rows={ROWS} rowKey="id" selectable onSelectChange={onSelectChange} />,
    );
    await userEvent.click(screen.getByRole('checkbox', { name: '전체 선택' }));
    expect(onSelectChange).toHaveBeenLastCalledWith([1, 2, 3]);
    // 개별 행 해제(내부 상태 기반이므로 다시 렌더된 체크박스 클릭)
    const rowChecks = screen.getAllByRole('checkbox', { name: '행 선택' });
    await userEvent.click(rowChecks[0]);
    expect(onSelectChange).toHaveBeenLastCalledWith([2, 3]);
  });

  it('getRowSelectionAriaLabel — 행 식별자가 포함된 접근 이름', () => {
    render(
      <Table
        columns={COLUMNS}
        rows={ROWS}
        rowKey="id"
        selectable
        getRowSelectionAriaLabel={(row) => `${row.name} 행 선택`}
      />,
    );
    expect(screen.getByRole('checkbox', { name: '김서연 행 선택' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: '이준호 행 선택' })).toBeInTheDocument();
  });

  it('행 클릭과 체크박스 클릭이 충돌하지 않는다(체크 클릭은 onRowClick 미발화)', async () => {
    const onRowClick = vi.fn();
    render(
      <Table columns={COLUMNS} rows={ROWS} rowKey="id" selectable onRowClick={onRowClick} />,
    );
    await userEvent.click(screen.getAllByRole('checkbox', { name: '행 선택' })[0]);
    expect(onRowClick).not.toHaveBeenCalled();
    await userEvent.click(screen.getByText('김서연'));
    expect(onRowClick).toHaveBeenCalledTimes(1);
  });
});

describe('Table 정렬', () => {
  it('헤더 메뉴 정렬 실행 → 행 순서 변경 + aria-sort 반영', async () => {
    render(<Table columns={COLUMNS} rows={ROWS} rowKey="id" />);
    // 점수 컬럼 헤더 메뉴 열기(ghost 아이콘 버튼) → 오름차순
    const scoreHeader = screen.getByRole('columnheader', { name: /점수/ });
    await userEvent.click(within(scoreHeader).getByRole('button'));
    await userEvent.click(screen.getByText('오름차순 정렬'));

    expect(scoreHeader).toHaveAttribute('aria-sort', 'ascending');
    const cells = screen.getAllByRole('cell');
    // 첫 데이터 행이 최저 점수(이준호 70)로 정렬됨
    expect(cells.map((c) => c.textContent)).toContain('이준호');
    const names = screen.getAllByRole('row').slice(1).map((r) => within(r).getAllByRole('cell')[0].textContent);
    expect(names).toEqual(['이준호', '박지민', '김서연']);

    // 내림차순 전환
    await userEvent.click(within(scoreHeader).getByRole('button'));
    await userEvent.click(screen.getByText('내림차순 정렬'));
    expect(scoreHeader).toHaveAttribute('aria-sort', 'descending');
  });

  it('정렬 없는 컬럼에는 aria-sort가 없다', () => {
    render(<Table columns={COLUMNS} rows={ROWS} rowKey="id" />);
    expect(screen.getByRole('columnheader', { name: '이름' })).not.toHaveAttribute('aria-sort');
  });

  it('빈 테이블 — emptyMessage 표시', () => {
    render(<Table columns={COLUMNS} rows={[]} rowKey="id" emptyMessage="데이터가 없습니다" />);
    expect(screen.getByText('데이터가 없습니다')).toBeInTheDocument();
  });
});
