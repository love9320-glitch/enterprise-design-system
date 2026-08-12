// DatePicker 경계 조건 테스트 (2026-08-12 API 안정화 감사) — min/max 당일 포함 여부·range 역순·disabledDate
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DatePicker } from './DatePicker';

const AUG = new Date(2026, 7, 1); // 2026-08

describe('DatePicker min/max 경계(당일 포함)', () => {
  it('minDate 당일은 선택 가능, 하루 전은 차단', async () => {
    const onChange = vi.fn();
    render(
      <DatePicker scrollNavigate={false} defaultMonth={AUG} minDate={new Date(2026, 7, 10)} onChange={onChange} />,
    );
    await userEvent.click(screen.getByRole('button', { name: '9' }));
    expect(onChange).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: '10' }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].getDate()).toBe(10);
  });

  it('maxDate 당일은 선택 가능, 다음날은 차단', async () => {
    const onChange = vi.fn();
    render(
      <DatePicker scrollNavigate={false} defaultMonth={AUG} maxDate={new Date(2026, 7, 20)} onChange={onChange} />,
    );
    await userEvent.click(screen.getByRole('button', { name: '21' }));
    expect(onChange).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: '20' }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].getDate()).toBe(20);
  });

  it('disabledDate 콜백으로 특정 날짜(주말 등)를 차단한다', async () => {
    const onChange = vi.fn();
    render(
      <DatePicker
        scrollNavigate={false}
        defaultMonth={AUG}
        disabledDate={(d) => d.getDate() === 15}
        onChange={onChange}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: '15' }));
    expect(onChange).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: '16' }));
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});

describe('DatePicker range 역순 클릭', () => {
  it('시작일보다 앞 날짜를 찍으면 마감이 아니라 시작이 재지정된다', async () => {
    const onChange = vi.fn();
    render(<DatePicker mode="range" scrollNavigate={false} defaultMonth={AUG} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: '20' })); // 시작 20
    await userEvent.click(screen.getByRole('button', { name: '10' })); // 앞 날짜 → 시작 재지정
    const last = onChange.mock.calls.at(-1)![0];
    expect(last.start.getDate()).toBe(10);
    expect(last.end).toBeNull();
  });

  it('완성된 범위에서 다시 클릭하면 새 범위 시작', async () => {
    const onChange = vi.fn();
    render(<DatePicker mode="range" scrollNavigate={false} defaultMonth={AUG} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: '10' }));
    await userEvent.click(screen.getByRole('button', { name: '20' })); // 완성
    await userEvent.click(screen.getByRole('button', { name: '25' })); // 새 시작
    const last = onChange.mock.calls.at(-1)![0];
    expect(last.start.getDate()).toBe(25);
    expect(last.end).toBeNull();
  });
});
