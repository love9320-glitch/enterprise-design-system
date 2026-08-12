// DatePicker 흐름 테스트 (2026-08-13 운영안 ⓑ) — 날짜 선택/월 이동/비활성 차단/범위
// 참고: 캘린더 그리드 방향키 내비게이션은 미구현(로드맵 backlog) — 현재 계약(클릭·버튼)을 검사한다.
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DatePicker } from './DatePicker';

describe('DatePicker 흐름', () => {
  it('날짜를 클릭하면 onChange에 Date가 전달된다', async () => {
    const onChange = vi.fn();
    render(
      <DatePicker
        scrollNavigate={false}
        defaultMonth={new Date(2026, 7, 1)} // 2026-08
        onChange={onChange}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: '15' }));
    expect(onChange).toHaveBeenCalledTimes(1);
    const picked: Date = onChange.mock.calls[0][0];
    expect([picked.getFullYear(), picked.getMonth(), picked.getDate()]).toEqual([2026, 7, 15]);
  });

  it('이전/다음 달 버튼으로 표시 월이 바뀐다', async () => {
    const onMonthChange = vi.fn();
    render(
      <DatePicker scrollNavigate={false} defaultMonth={new Date(2026, 7, 1)} onMonthChange={onMonthChange} />,
    );
    await userEvent.click(screen.getByRole('button', { name: '다음 달' }));
    expect(onMonthChange.mock.calls[0][0].getMonth()).toBe(8); // 9월
    await userEvent.click(screen.getByRole('button', { name: '이전 달' }));
  });

  it('disabledDate·minDate에 걸린 날짜는 선택되지 않는다', async () => {
    const onChange = vi.fn();
    render(
      <DatePicker
        scrollNavigate={false}
        defaultMonth={new Date(2026, 7, 1)}
        minDate={new Date(2026, 7, 10)}
        onChange={onChange}
      />,
    );
    // '5'는 8월 5일(비활성)과 9월 5일(다음 달 무티드 셀) 두 개 — 그리드 순서상 첫 번째가 8월
    await userEvent.click(screen.getAllByRole('button', { name: '5' })[0]); // min 이전
    expect(onChange).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: '20' }));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('range — 시작일·마감일이 순서대로 선택된다', async () => {
    const onChange = vi.fn();
    render(
      <DatePicker mode="range" scrollNavigate={false} defaultMonth={new Date(2026, 7, 1)} onChange={onChange} />,
    );
    await userEvent.click(screen.getByRole('button', { name: '10' }));
    await userEvent.click(screen.getByRole('button', { name: '20' }));
    const last = onChange.mock.calls.at(-1)![0];
    expect(last.start.getDate()).toBe(10);
    expect(last.end.getDate()).toBe(20);
  });
});
