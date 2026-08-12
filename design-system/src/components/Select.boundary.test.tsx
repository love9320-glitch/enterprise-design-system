// Select 경계 조건 테스트 (2026-08-12 API 안정화 감사) — 검색·다중·빈 목록 조합
import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from './Select';

const OPTIONS = [
  { value: 'apple', label: '사과' },
  { value: 'banana', label: '바나나' },
  { value: 'grape', label: '포도(비활성)', disabled: true },
];

describe('Select 검색(searchable)', () => {
  it('검색어 입력 시 라벨 부분 일치만 남는다', async () => {
    render(<Select searchable options={OPTIONS} placeholder="p" onChange={() => {}} />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.type(screen.getByPlaceholderText('검색어를 입력하세요'), '바나');
    expect(screen.getByText('바나나')).toBeInTheDocument();
    expect(screen.queryByText('사과')).not.toBeInTheDocument();
  });

  it('공백만 입력하면 필터하지 않는다(전체 유지)', async () => {
    render(<Select searchable options={OPTIONS} placeholder="p" onChange={() => {}} />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.type(screen.getByPlaceholderText('검색어를 입력하세요'), '   ');
    expect(screen.getByText('사과')).toBeInTheDocument();
    expect(screen.getByText('바나나')).toBeInTheDocument();
  });

  it('결과 없음 → noResultMessage 표시, 선택 불가', async () => {
    render(<Select searchable options={OPTIONS} placeholder="p" onChange={() => {}} />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.type(screen.getByPlaceholderText('검색어를 입력하세요'), '없는값');
    expect(screen.getByText('검색 결과가 없습니다.')).toBeInTheDocument();
  });
});

describe('Select 빈 목록·다중 선택 경계', () => {
  it('options가 빈 배열이면 emptyMessage 표시', async () => {
    render(<Select options={[]} placeholder="p" onChange={() => {}} />);
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.getByText('옵션이 없습니다.')).toBeInTheDocument();
  });

  it('multiple — disabled 옵션은 클릭해도 토글되지 않는다', async () => {
    const onChange = vi.fn();
    render(<Select multiple options={OPTIONS} defaultValue={[]} placeholder="p" onChange={onChange} />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByText('포도(비활성)'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('multiple — 재클릭으로 선택이 해제된다(토글 off)', async () => {
    const onChange = vi.fn();
    render(<Select multiple options={OPTIONS} defaultValue={['apple']} placeholder="p" onChange={onChange} />);
    await userEvent.click(screen.getByRole('combobox'));
    // 트리거에도 선택값 "사과"가 표시되므로 목록(listbox) 안의 옵션만 클릭
    await userEvent.click(within(screen.getByRole('listbox')).getByText('사과'));
    expect(onChange.mock.calls[0][0].target.value).toEqual([]);
  });
});
