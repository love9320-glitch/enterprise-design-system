// 접근성 자동 검사(axe) — 핵심 컴포넌트가 자동 검출 가능한 접근성 오류 0인지 (2026-08-12)
import { describe, it } from 'vitest';
import { render } from '@testing-library/react';
import { expectNoA11yViolations } from './axe';
import { Plus } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { AlertModal, ConfirmModal, Modal } from '../components/Modal';
import { Checkbox } from '../components/Checkbox';
import { Tabs } from '../components/Tabs';
import { Select } from '../components/Select';
import { PopoverMenu } from '../components/PopoverMenu';
import { ListGroup } from '../components/ListGroup';
import { List } from '../components/List';
import { RadioGroup } from '../components/Radio';
import { Switch } from '../components/Switch';
import { DatePicker } from '../components/DatePicker';
import { Table } from '../components/Table';
import { Pagination } from '../components/Pagination';
import { AccordionItem } from '../components/Accordion';
import { Stepper } from '../components/Stepper';
import { SideNavigation, SideNavigationButton } from '../components/SideNavigation';
import { Lnb } from '../layouts/Lnb';
import { FileUploadMenu } from '../components/FileUploadMenu';
import { FormTemplateA } from '../templates/FormTemplateA';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';

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

  it('Select — 닫힘·열림(드롭다운 목록)', async () => {
    const { container } = render(
      <Select
        options={[
          { value: 'a', label: '첫 옵션' },
          { value: 'b', label: '둘째 옵션' },
        ]}
        placeholder="선택하세요"
      />,
    );
    await expectNoA11yViolations(container);
    await userEvent.click(screen.getByRole('combobox'));
    await expectNoA11yViolations(document.body); // 드롭다운은 portal(body)
  });

  it('PopoverMenu + ListGroup/List — 옵션 목록 단독', async () => {
    const { container } = render(
      <PopoverMenu width={200}>
        <ListGroup>
          <List title="이름 변경" />
          <List title="삭제" />
        </ListGroup>
      </PopoverMenu>,
    );
    await expectNoA11yViolations(container);
  });

  it('Radio·Switch — 선택 컨트롤', async () => {
    const { container } = render(
      <div>
        <RadioGroup
          items={[
            { value: 'a', label: '옵션 A' },
            { value: 'b', label: '옵션 B' },
          ]}
          defaultValue="a"
        />
        <Switch label="알림 받기" onChange={() => {}} />
      </div>,
    );
    await expectNoA11yViolations(container);
  });

  it('DatePicker — 캘린더 패널', async () => {
    const { container } = render(<DatePicker scrollNavigate={false} />);
    await expectNoA11yViolations(container);
  });

  it('Table — 헤더·선택·정렬 구조', async () => {
    const { container } = render(
      <Table
        columns={[
          { key: 'name', label: '이름' },
          { key: 'role', label: '직무' },
        ]}
        rows={[
          { id: 1, name: '김서연', role: '디자이너' },
          { id: 2, name: '이준호', role: '개발자' },
        ]}
        rowKey="id"
        selectable
      />,
    );
    await expectNoA11yViolations(container);
  });

  it('Pagination — 페이지 이동', async () => {
    const { container } = render(<Pagination totalCount={100} defaultPage={3} />);
    await expectNoA11yViolations(container);
  });

  it('Accordion·Stepper — 펼침·단계 위젯', async () => {
    const { container } = render(
      <div>
        <AccordionItem title="섹션 제목" defaultOpen>
          내용
        </AccordionItem>
        <Stepper
          items={[
            { value: '1', title: '작성' },
            { value: '2', title: '검토' },
            { value: '3', title: '발송' },
          ]}
          value="2"
        />
      </div>,
    );
    await expectNoA11yViolations(container);
  });

  it('SideNavigation·Lnb — 내비게이션', async () => {
    const { container } = render(
      <div>
        <SideNavigation>
          <SideNavigationButton selected>대시보드</SideNavigationButton>
          <SideNavigationButton>설정</SideNavigationButton>
        </SideNavigation>
        <Lnb
          groups={[
            {
              key: 'g1',
              title: '그룹',
              items: [
                { value: 'a', label: '메뉴 A' },
                { value: 'b', label: '메뉴 B' },
              ],
            },
          ]}
          defaultValue="a"
        />
      </div>,
    );
    await expectNoA11yViolations(container);
  });

  it('FileUploadMenu — 파일 업로드 목록', async () => {
    const { container } = render(
      <FileUploadMenu
        files={[{ name: '이력서.pdf', size: 1024 }]}
        guide="PDF 파일만 업로드하세요"
        onAdd={() => {}}
        onDelete={() => {}}
      />,
    );
    await expectNoA11yViolations(container);
  });

  it('FormTemplateA — 라벨·컨트롤 연결(htmlFor/id 정석 사용)', async () => {
    const { container } = render(
      <FormTemplateA
        columns={2}
        fields={[
          {
            key: 'name',
            label: '이름',
            required: true,
            control: <Input width="100%" inputProps={{ id: 'f-name', 'aria-label': '이름' }} />,
          },
          {
            key: 'email',
            label: '이메일',
            control: <Input type="email" width="100%" inputProps={{ id: 'f-email', 'aria-label': '이메일' }} />,
          },
        ]}
      />,
    );
    await expectNoA11yViolations(container);
  });

  it('AlertModal·ConfirmModal — 헤더 없는 변형', async () => {
    render(
      <AlertModal open onClose={() => {}} title="알림" description="처리가 완료되었습니다." />,
    );
    await expectNoA11yViolations(document.body);
  });

  it('ConfirmModal — 재확인 체크박스 포함', async () => {
    render(
      <ConfirmModal
        open
        onClose={() => {}}
        title="삭제하시겠습니까?"
        description="되돌릴 수 없습니다."
        checkboxLabel="확인했습니다."
      />,
    );
    await expectNoA11yViolations(document.body);
  });

  it('조립형 Modal — Root/Header/Body/Footer', async () => {
    render(
      <Modal.Root open onClose={() => {}}>
        <Modal.Header title="조립형 검사" />
        <Modal.Body>본문</Modal.Body>
        <Modal.Footer>
          <Button variant="line">취소</Button>
        </Modal.Footer>
      </Modal.Root>,
    );
    await expectNoA11yViolations(document.body);
  });
});
