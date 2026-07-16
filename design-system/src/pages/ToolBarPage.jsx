import { useState } from 'react';
import { FolderInput, FolderOutput, X } from 'lucide-react';
import { ToolBar, ToolBarDivider } from '../components/ToolBar';
import { Select } from '../components/Select';
import { Button } from '../components/Button';
import { Checkbox } from '../components/Checkbox';
import { UsageExample } from '../components/UsageExample';
import { Divider } from '../components/Divider';

const USAGE = `import { ToolBar, ToolBarDivider } from '../components/ToolBar';

// 체크 선택 시 나타나는 플로팅 액션 툴바 — 내용은 children 슬롯(DS 컴포넌트 배치)
{checkedCount > 0 && (
  <ToolBar>
    <Select width={200} options={FUNCTIONS} placeholder="함수 선택" />
    <Button variant="ghost" size="32" leftIcon={FolderInput}>선택 그룹핑</Button>
    <ToolBarDivider />
    <Button variant="ghost" size="32" leftIcon={FolderOutput}>그룹 해제</Button>
    <ToolBarDivider />
    <Button variant="ghost" icon={X} aria-label="선택 해제" onClick={clear} />
  </ToolBar>
)}`;

const USAGE_PROPS = [
  { name: 'children', type: 'ReactNode', default: '—', desc: '툴바 내용 슬롯 — Select·Button(ghost) 등 DS 컴포넌트 배치' },
  { name: 'className', type: 'string', default: "''", desc: '추가 클래스 — 위치(absolute 등)는 사용처가 지정' },
  { name: 'ToolBarDivider', type: 'component', default: '—', desc: '항목 구분선(16px 세로, divider strong 토큰)' },
];

export function ToolBarPage() {
  const [checked, setChecked] = useState(true);

  return (
    <section className="mx-auto max-w-5xl px-spacing-7 py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-20 font-semibold text-font-icon-5">Tool Bar</h2>
      <p className="mb-spacing-8 text-13 text-font-icon-4">
        체크 선택 시 나타나는 플로팅 액션 툴바 — 위→아래(white→gray.50) 그라데이션 배경 +
        gray-900 알파 라인(배경 투영) + 그림자. 내용은 슬롯으로 자유 구성합니다.
        (Screening Builder Template의 선택 그룹핑 툴바가 실사용 예)
      </p>

      <UsageExample code={USAGE} props={USAGE_PROPS} />

      <Divider className="mt-spacing-9 mb-spacing-8" />
      <div>
        <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">데모 — 체크하면 표시</h3>
        <p className="mb-spacing-7 text-12 text-font-icon-4">
          체크박스를 켜면 아래에 툴바가 나타납니다(Figma tool bar 구성 그대로: 셀렉트 + 선택
          그룹핑 + 그룹 해제 + 닫기).
        </p>
        <Checkbox label="항목 선택" checked={checked} onChange={(e) => setChecked(e.target.checked)} />
        <div className="mt-spacing-7 min-h-[64px]">
          {checked && (
            <ToolBar>
              <Select
                width={200}
                options={[
                  { value: 'sum', label: 'SUM' },
                  { value: 'and', label: 'AND' },
                ]}
                placeholder="함수 선택"
              />
              <Button variant="ghost" size="32" leftIcon={FolderInput}>
                선택 그룹핑
              </Button>
              <ToolBarDivider />
              <Button variant="ghost" size="32" leftIcon={FolderOutput}>
                그룹 해제
              </Button>
              <ToolBarDivider />
              <Button variant="ghost" icon={X} aria-label="선택 해제" onClick={() => setChecked(false)} />
            </ToolBar>
          )}
        </div>
      </div>
    </section>
  );
}
