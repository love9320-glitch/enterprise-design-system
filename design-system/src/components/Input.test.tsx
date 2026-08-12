// Input 단위 테스트 — controlled/uncontrolled·에러 접근성·입력 타입 동작 (2026-08-12)
// 스크래치 jsdom 스모크(input-type-test)를 정식 테스트로 이관.
import { describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

function Controlled(props: Record<string, unknown>) {
  const [v, setV] = useState('');
  return <Input value={v} onChange={(e) => setV(e.target.value)} {...props} />;
}

describe('Input 기본', () => {
  it('controlled — 타이핑한 값이 반영된다', async () => {
    render(<Controlled placeholder="이름" />);
    const input = screen.getByPlaceholderText('이름');
    await userEvent.type(input, '김서연');
    expect(input).toHaveValue('김서연');
  });

  it('uncontrolled — defaultValue로 시작해 자유 입력된다', async () => {
    render(<Input defaultValue="초기값" placeholder="p" />);
    const input = screen.getByPlaceholderText('p');
    expect(input).toHaveValue('초기값');
    await userEvent.type(input, '!');
    expect(input).toHaveValue('초기값!');
  });

  it('error면 툴팁이 role=alert + aria-describedby로 연결된다', () => {
    render(<Input error errorMessage="필수 입력사항입니다." placeholder="p" />);
    const input = screen.getByPlaceholderText('p');
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('필수 입력사항입니다.');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input.getAttribute('aria-describedby')).toBe(alert.id);
  });

  it('disabled와 readOnly 상태가 구분된다(data-state)', () => {
    const { rerender } = render(<Input disabled placeholder="p" />);
    expect(screen.getByPlaceholderText('p')).toBeDisabled();
    expect(screen.getByPlaceholderText('p').closest('[data-state]')).toHaveAttribute('data-state', 'disabled');
    rerender(<Input readOnly placeholder="p" />);
    expect(screen.getByPlaceholderText('p')).toHaveAttribute('readonly');
    expect(screen.getByPlaceholderText('p').closest('[data-state]')).toHaveAttribute('data-state', 'readonly');
  });
});

describe('Input 타입', () => {
  it('number — 숫자 외 제거·소수점 1개·천단위 콤마', async () => {
    render(<Controlled type="number" comma placeholder="n" />);
    const input = screen.getByPlaceholderText('n');
    await userEvent.type(input, '12a34567.8.9');
    expect(input).toHaveValue('1,234,567.89');
  });

  it('tel — 하이픈 자동 삽입', async () => {
    render(<Controlled type="tel" placeholder="t" />);
    const input = screen.getByPlaceholderText('t');
    await userEvent.type(input, '01093589320');
    expect(input).toHaveValue('010-9358-9320');
  });

  it('email — blur 시 형식 오류 툴팁(표준 카피), 올바르면 해제', async () => {
    render(<Input type="email" placeholder="e" />);
    const input = screen.getByPlaceholderText('e');
    await userEvent.type(input, 'abc');
    await userEvent.tab(); // blur
    expect(screen.getByRole('alert')).toHaveTextContent('잘못된 양식입니다.');
    await userEvent.clear(input);
    await userEvent.type(input, 'abc@test.com');
    await userEvent.tab();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('password — 기본 마스킹, 눈 토글로 표시/숨김 전환', async () => {
    render(<Input type="password" placeholder="pw" defaultValue="secret" />);
    const input = screen.getByPlaceholderText('pw');
    expect(input).toHaveAttribute('type', 'password');
    const toggle = screen.getByRole('button', { name: '비밀번호 표시' });
    await userEvent.click(toggle);
    expect(input).toHaveAttribute('type', 'text');
    await userEvent.click(screen.getByRole('button', { name: '비밀번호 숨기기' }));
    expect(input).toHaveAttribute('type', 'password');
  });

  it('korean — 한글 외 문자를 즉시 필터링', async () => {
    render(<Controlled type="korean" placeholder="k" />);
    const input = screen.getByPlaceholderText('k');
    await userEvent.type(input, '김abc서연1');
    expect(input).toHaveValue('김서연');
  });

  it('unit — 단위 suffix가 렌더된다', () => {
    render(<Input type="number" unit="원" placeholder="n" />);
    expect(screen.getByText('원')).toBeInTheDocument();
  });

  it('inputProps.onChange도 함께 호출된다(핸들러 합성)', async () => {
    const inner = vi.fn();
    render(<Input placeholder="p" inputProps={{ onChange: inner }} />);
    await userEvent.type(screen.getByPlaceholderText('p'), 'a');
    expect(inner).toHaveBeenCalled();
  });
});
