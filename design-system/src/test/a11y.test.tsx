// 접근성 자동 검사(axe) — 핵심 컴포넌트가 자동 검출 가능한 접근성 오류 0인지 (2026-08-12)
import { describe, it } from 'vitest';
import { render } from '@testing-library/react';
import { expectNoA11yViolations } from './axe';
import { Plus } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { Checkbox } from '../components/Checkbox';
import { Tabs } from '../components/Tabs';

describe('접근성 자동 검사(axe)', () => {
  it('Button — 변형·로딩·아이콘 전용', async () => {
    const { container } = render(
      <div>
        <Button>기본</Button>
        <Button variant="line" size="24">라인</Button>
        <Button loading>로딩</Button>
        <Button disabled>비활성</Button>
        <Button icon={Plus} aria-label="추가" />
      </div>,
    );
    await expectNoA11yViolations(container);
  });

  it('Input — 기본·에러·타입', async () => {
    const { container } = render(
      <div>
        {/* 라벨은 실제 <input>에 닿아야 한다 — ...props는 래퍼 div로 가므로 inputProps 경유
            (실서비스에서는 Label/Field 컴포넌트로 연결하는 것이 표준) */}
        <Input placeholder="기본" inputProps={{ 'aria-label': '기본 입력' }} />
        <Input error errorMessage="필수 입력사항입니다." inputProps={{ 'aria-label': '에러 입력' }} />
        <Input type="password" defaultValue="pw" inputProps={{ 'aria-label': '비밀번호' }} />
        <Input type="number" unit="원" inputProps={{ 'aria-label': '금액' }} />
      </div>,
    );
    await expectNoA11yViolations(container);
  });

  it('Modal — 열린 상태', async () => {
    render(
      <Modal open onClose={() => {}} title="접근성 검사" confirmText="확인">
        본문 내용
      </Modal>,
    );
    // 모달은 portal(body)로 렌더 — body 전체를 검사
    await expectNoA11yViolations(document.body);
  });

  it('Checkbox·Tabs — 폼 컨트롤·탭 위젯', async () => {
    const { container } = render(
      <div>
        <Checkbox label="동의" onChange={() => {}} />
        <Tabs
          items={[
            { value: 'a', label: '첫 탭' },
            { value: 'b', label: '둘째 탭' },
          ]}
          defaultValue="a"
        />
      </div>,
    );
    await expectNoA11yViolations(container);
  });
});
