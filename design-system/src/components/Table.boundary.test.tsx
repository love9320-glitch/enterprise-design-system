// Table 경계 조건 테스트 (2026-08-12 API 안정화 감사) — controlled 정렬/선택·대량·결측 셀
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
];

describe('Table controlled 정렬', () => {
  it('sort prop이 aria-sort에 반영되고, 실행 시 onSortChange만 호출된다(자체 상태 불변)', async () => {
    const onSortChange = vi.fn();
    render(
      <Table
        columns={COLUMNS}
        rows={ROWS}
        rowKey="id"
        sort={{ key: 'score', dir: 'desc' }}
        onSortChange={onSortChange}
      />,
    );
    const scoreHeader = screen.getByRole('columnheader', { name: /점수/ });
    expect(scoreHeader).toHaveAttribute('aria-sort', 'descending');

    await userEvent.click(within(scoreHeader).getByRole('button'));
    await userEvent.click(screen.getByText('오름차순 정렬'));
    expect(onSortChange).toHaveBeenCalledWith({ key: 'score', dir: 'asc' });
    // controlled — 부모가 sort를 안 바꿨으니 표시 상태는 그대로
    expect(scoreHeader).toHaveAttribute('aria-sort', 'descending');
  });
});

describe('Table controlled 선택', () => {
  it('selectedIds가 체크 상태에 반영되고, 클릭 시 onSelectChange만 호출된다', async () => {
    const onSelectChange = vi.fn();
    render(
      <Table
        columns={COLUMNS}
        rows={ROWS}
        rowKey="id"
        selectable
        selectedIds={[1]}
        onSelectChange={onSelectChange}
      />,
    );
    const checks = screen.getAllByRole('checkbox', { name: '행 선택' });
    expect(checks[0]).toBeChecked();
    expect(checks[1]).not.toBeChecked();

    await userEvent.click(checks[1]);
    expect(onSelectChange).toHaveBeenCalledWith([1, 2]);
    // controlled — 부모가 selectedIds를 안 바꿨으니 체크 상태는 그대로
    expect(checks[1]).not.toBeChecked();
  });
});

describe('Table 데이터 경계', () => {
  it('대량(200행)도 전 행 렌더된다', () => {
    const rows = Array.from({ length: 200 }, (_, i) => ({ id: i, name: `이름${i}`, score: i }));
    render(<Table columns={COLUMNS} rows={rows} rowKey="id" />);
    expect(screen.getAllByRole('row')).toHaveLength(201); // 헤더 1 + 데이터 200
    expect(screen.getByText('이름199')).toBeInTheDocument();
  });

  it('셀 값이 null/undefined여도 렌더가 깨지지 않는다', () => {
    const rows = [
      { id: 1, name: null, score: undefined },
      { id: 2, name: '이준호', score: 70 },
    ] as unknown as Record<string, unknown>[];
    render(<Table columns={COLUMNS} rows={rows} rowKey="id" />);
    expect(screen.getAllByRole('row')).toHaveLength(3);
    expect(screen.getByText('이준호')).toBeInTheDocument();
  });
});
