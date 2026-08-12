// MultiStepFormTemplate 흐름 테스트 (2026-08-13 운영안 ⓑ) — 단계 이동/보존/차단.
// 참고: "필수값 없이 다음 단계 차단"은 소비자(페이지) 로직 소유(BulkSendPage 패턴) —
// 템플릿 테스트는 템플릿 계약(단계 전환·clickableSteps·keepMounted·disabled)까지만 검사한다.
import { describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MultiStepFormTemplate } from './MultiStepFormTemplate';

const STEPS = [
  { value: 's1', title: '작성', content: <input aria-label="이름 입력" /> },
  { value: 's2', title: '검토', content: <p>검토 내용</p> },
  { value: 's3', title: '발송', content: <p>발송 내용</p>, disabled: true },
];

describe('MultiStepFormTemplate', () => {
  it('현재 단계 콘텐츠만 표시된다(기본 첫 단계)', () => {
    render(<MultiStepFormTemplate steps={STEPS} />);
    expect(screen.getByLabelText('이름 입력')).toBeInTheDocument();
    expect(screen.queryByText('검토 내용')).not.toBeInTheDocument();
  });

  it('clickableSteps — 스텝 클릭으로 이동하고 onChange가 호출된다', async () => {
    const onChange = vi.fn();
    render(<MultiStepFormTemplate steps={STEPS} onChange={onChange} />);
    await userEvent.click(screen.getByText('검토'));
    expect(screen.getByText('검토 내용')).toBeInTheDocument();
    expect(onChange).toHaveBeenCalledWith('s2', 1);
  });

  it('clickableSteps=false — 클릭 이동이 차단된다(순차 강제 플로우)', async () => {
    render(<MultiStepFormTemplate steps={STEPS} clickableSteps={false} />);
    await userEvent.click(screen.getByText('검토'));
    expect(screen.queryByText('검토 내용')).not.toBeInTheDocument();
  });

  it('disabled 단계는 클릭해도 이동하지 않는다', async () => {
    render(<MultiStepFormTemplate steps={STEPS} />);
    await userEvent.click(screen.getByText('발송'));
    expect(screen.queryByText('발송 내용')).not.toBeInTheDocument();
  });

  it('keepMounted — 단계를 오가도 입력값이 보존된다', async () => {
    render(<MultiStepFormTemplate steps={STEPS} keepMounted />);
    await userEvent.type(screen.getByLabelText('이름 입력'), '김서연');
    await userEvent.click(screen.getByText('검토'));
    await userEvent.click(screen.getByText('작성'));
    expect(screen.getByLabelText('이름 입력')).toHaveValue('김서연');
  });

  it('controlled — 외부 value로 단계가 제어된다(이전/다음 버튼 패턴)', async () => {
    function Wrap() {
      const [step, setStep] = useState<string | number>('s1');
      return (
        <>
          <button onClick={() => setStep('s2')}>다음</button>
          <button onClick={() => setStep('s1')}>이전</button>
          <MultiStepFormTemplate steps={STEPS} value={step} clickableSteps={false} />
        </>
      );
    }
    render(<Wrap />);
    await userEvent.click(screen.getByRole('button', { name: '다음' }));
    expect(screen.getByText('검토 내용')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: '이전' }));
    expect(screen.getByLabelText('이름 입력')).toBeInTheDocument();
  });
});
