// Button 단위 테스트 — 클릭/차단/로딩/접근성/변형/속성 전달 (2026-08-12 테스트 기반 구축)
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Plus } from 'lucide-react';
import { Button } from './Button';

describe('Button', () => {
  it('클릭 시 onClick이 호출된다', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>저장</Button>);
    await userEvent.click(screen.getByRole('button', { name: '저장' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('disabled면 클릭되지 않고 네이티브 disabled가 걸린다', async () => {
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>저장</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    await userEvent.click(btn).catch(() => {});
    expect(onClick).not.toHaveBeenCalled();
  });

  it('loading이면 클릭되지 않고 aria-busy가 보조 기술에 전달된다', () => {
    const onClick = vi.fn();
    render(<Button loading onClick={onClick}>저장</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('aria-busy', 'true');
    expect(btn).toBeDisabled(); // 로딩 = 비활성(중복 제출 방지)
    expect(onClick).not.toHaveBeenCalled();
  });

  it('variant·size가 data 꼬리표(규칙 23)로 표기된다', () => {
    render(<Button variant="line" size="24">라인</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('data-variant', 'line');
    expect(btn).toHaveAttribute('data-size', '24');
  });

  it('아이콘 전용 버튼은 aria-label로 접근 가능한 이름을 가진다', () => {
    render(<Button icon={Plus} aria-label="추가" />);
    expect(screen.getByRole('button', { name: '추가' })).toBeInTheDocument();
  });

  it('추가 HTML 속성이 실제 button 요소로 전달된다', () => {
    render(<Button type="submit" name="save-btn">전송</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('type', 'submit');
    expect(btn).toHaveAttribute('name', 'save-btn');
  });
});
