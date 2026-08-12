// 소비자 대표 시나리오 — 메인 엔트리·서브패스(tokens/styles.css/components.json)를 실제 import.
// 의도적으로 tiptap 미설치: 메인 엔트리가 Editor(./editor 전용) 의존에 오염되면 여기 빌드가 깨진다(0.1.0 판례).
import { useState } from 'react';
import {
  Button,
  Input,
  Select,
  Modal,
  ModalRoot,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  TableTemplate,
  MultiStepFormTemplate,
  PortalProvider,
  usePortalContainer,
} from '@gusun/design-system';
import { baseColors, spacing } from '@gusun/design-system/tokens';
import manifest from '@gusun/design-system/components.json';
import '@gusun/design-system/styles.css';

// 배럴에서 값이 실제로 도착했는지(런타임 undefined 방지) — 번들 트리셰이킹 없이 전부 참조
const barrelSymbols = {
  Button, Input, Select, Modal, ModalRoot, ModalHeader, ModalBody, ModalFooter,
  Table, TableTemplate, MultiStepFormTemplate, PortalProvider, usePortalContainer,
};
for (const [name, value] of Object.entries(barrelSymbols)) {
  if (value === undefined) throw new Error(`배럴 누락: ${name}`);
}
if (!Array.isArray((manifest as { components?: unknown[] }).components)) {
  throw new Error('components.json 형식 이상');
}
if (!baseColors || !spacing) throw new Error('tokens 서브패스 이상');

const ROWS = [
  { id: 1, name: '김서연', score: 90 },
  { id: 2, name: '이준호', score: 70 },
];

export function App() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button onClick={() => setOpen(true)}>모달 열기</Button>
      <Input placeholder="이름" />
      <Select
        options={[{ value: 'a', label: '첫 옵션' }]}
        placeholder="선택"
        onChange={() => {}}
      />
      <Table
        columns={[
          { key: 'name', label: '이름' },
          { key: 'score', label: '점수' },
        ]}
        rows={ROWS}
        rowKey="id"
      />
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="소비자 스모크"
        confirmText="확인"
        onConfirm={() => setOpen(false)}
      >
        본문
      </Modal>
    </div>
  );
}
