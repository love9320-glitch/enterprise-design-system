// Select 키보드 흐름 테스트 (2026-08-13 운영안 ⓑ) — 열기/이동/선택/닫기 + ARIA 연결
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from './Select';

const OPTIONS = [
  { value: 'a', label: '첫 옵션' },
  { value: 'b', label: '둘째 옵션(비활성)', disabled: true },
  { value: 'c', label: '셋째 옵션' },
];

function setup(props: Record<string, unknown> = {}) {
  const onChange = vi.fn();
  render(<Select options={OPTIONS} placeholder="선택하세요" onChange={onChange} {...props} />);
  return { trigger: screen.getByRole('combobox'), onChange };
}

describe('Select 키보드 흐름', () => {
  it('Enter로 열리고 aria-expanded·aria-controls가 연결된다', async () => {
    const { trigger } = setup();
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const listbox = screen.getByRole('listbox');
    expect(trigger.getAttribute('aria-controls')).toBe(listbox.id);
  });

  it('방향키로 이동하면 aria-activedescendant가 현재 옵션을 가리킨다', async () => {
    const { trigger } = setup();
    trigger.focus();
    await userEvent.keyboard('{Enter}{ArrowDown}');
    const activeId = trigger.getAttribute('aria-activedescendant');
    expect(activeId).toBeTruthy();
    expect(document.getElementById(activeId!)).toHaveTextContent(/옵션/);
  });

  it('방향키 이동은 disabled 옵션을 건너뛴다', async () => {
    const { trigger, onChange } = setup();
    trigger.focus();
    // 열면 첫 옵션(a) 강조 → ↓ 한 번이면 b(비활성)를 건너뛰고 c
    await userEvent.keyboard('{Enter}{ArrowDown}{Enter}');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].target.value).toBe('c');
  });

  it('Enter로 선택하면 값이 반영되고 목록이 닫힌다', async () => {
    const { trigger, onChange } = setup();
    trigger.focus();
    await userEvent.keyboard('{Enter}{Enter}'); // 열기 → 첫 옵션 선택
    expect(onChange.mock.calls[0][0].target.value).toBe('a');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(trigger).toHaveTextContent('첫 옵션');
  });

  it('ESC로 닫히고 포커스가 트리거에 남는다', async () => {
    const { trigger, onChange } = setup();
    trigger.focus();
    await userEvent.keyboard('{Enter}{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('controlled — value가 표시되고 선택 시 onChange만 호출된다', async () => {
    const onChange = vi.fn();
    render(<Select options={OPTIONS} value="c" onChange={onChange} placeholder="p" />);
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveTextContent('셋째 옵션');
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.click(screen.getByText('첫 옵션'));
    expect(onChange.mock.calls[0][0].target.value).toBe('a');
    // controlled라 값은 부모가 바꾸기 전까지 유지
    expect(trigger).toHaveTextContent('셋째 옵션');
  });

  it('multiple — 선택해도 목록이 유지되고 배열 값이 토글된다', async () => {
    const onChange = vi.fn();
    render(<Select multiple options={OPTIONS} defaultValue={[]} onChange={onChange} placeholder="p" />);
    const trigger = screen.getByRole('combobox');
    trigger.focus();
    await userEvent.keyboard('{Enter}{Enter}'); // 열기 → 첫 옵션 토글
    expect(onChange.mock.calls[0][0].target.value).toEqual(['a']);
    expect(screen.getByRole('listbox')).toBeInTheDocument(); // 다중 선택은 유지
  });
});
