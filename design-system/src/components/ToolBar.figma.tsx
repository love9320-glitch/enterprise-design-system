// ToolBar Code Connect 매핑(2026-08-02) — tool bar 단일 컴포넌트(8389:126993).
//   내부는 Select·고스트 버튼·ToolBarDivider 자유 조립(슬롯) — Figma 기본 구성 예시.
// 발행: main 머지 시 자동(.github/workflows/figma-code-connect.yml)
// 파서 제약 — URL·props는 리터럴만(변수·스프레드·as const 금지).
import figma from '@figma/code-connect';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from './Button';
import { Select } from './Select';
import { ToolBar, ToolBarDivider } from './ToolBar';

figma.connect(
  ToolBar,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=8389-126993',
  {
    example: () => (
      <ToolBar>
        <Select options={[{ value: 'a', label: '옵션' }]} width={200} />
        <Button variant="ghost" leftIcon={Plus}>
          함수 적용
        </Button>
        <ToolBarDivider />
        <Button variant="ghost" leftIcon={Trash2}>
          함수 해제
        </Button>
        <ToolBarDivider />
        <Button variant="ghost" icon={Plus} aria-label="추가" />
      </ToolBar>
    ),
  },
);
