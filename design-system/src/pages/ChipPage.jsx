import { useState } from 'react';
import { Chip } from '../components/Chip';
import { UsageExample } from '../components/UsageExample';

// 제거형 칩 데모 — X로 삭제, 비면 복원 버튼
function ChipDemo() {
  const initial = ['{지원자명}', '{회사명}', '{면접장소}', '{면접시간}'];
  const [chips, setChips] = useState(initial);
  return (
    <div className="flex flex-wrap items-center gap-spacing-5">
      {chips.map((c) => (
        <Chip key={c} onRemove={() => setChips((prev) => prev.filter((x) => x !== c))}>
          {c}
        </Chip>
      ))}
      {chips.length === 0 && (
        <button
          type="button"
          onClick={() => setChips(initial)}
          className="text-12 text-font-icon-3 underline"
        >
          되돌리기
        </button>
      )}
    </div>
  );
}

const CHIP_USAGE = `import { Chip } from '../components/Chip';

// color: gray(기본) · red · blue · black
<Chip color="blue">라벨</Chip>

// onRemove → X(삭제) 노출 · onClick → 칩 전체 선택
<Chip onRemove={() => remove(id)}>지원자명</Chip>`;

const CHIP_PROPS = [
  { name: 'children', type: 'ReactNode', default: '—', desc: '칩 내용' },
  { name: 'color', type: "'gray' | 'red' | 'blue' | 'black'", default: "'gray'", desc: '색상 종류 (hover/pressed는 chip-* 토큰 경유)' },
  { name: 'onRemove', type: '(e) => void', default: '—', desc: '있으면 X(삭제) 버튼 노출, 클릭 시 호출(칩 onClick과 분리)' },
  { name: 'onClick', type: '(e) => void', default: '—', desc: '칩 전체 클릭(선택 등)' },
  { name: 'removeAriaLabel', type: 'string', default: "'삭제'", desc: 'X 버튼 aria-label' },
  { name: 'className', type: 'string', default: "''", desc: '추가 클래스' },
];

export function ChipPage() {
  return (
    <section className="mx-auto max-w-5xl px-spacing-7 py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-20 font-semibold text-font-icon-5">Chip</h2>
      <p className="mb-spacing-9 text-14 text-font-icon-4">
        제거형 칩. 텍스트 + <code className="text-font-icon-5">X</code>(삭제=
        <code className="text-font-icon-5">onRemove</code>) · <code className="text-font-icon-5">onClick</code>(선택) ·{' '}
        <code className="text-font-icon-5">color</code>(gray/red/blue/black). hover/pressed 상태는 chip 토큰 경유.
        에디터의 머지필드 칩도 같은 토큰을 사용합니다.
      </p>

      <UsageExample code={CHIP_USAGE} props={CHIP_PROPS} />
      <p className="mb-spacing-5 text-12 text-font-icon-3">
        color — <code className="text-font-icon-5">gray</code>(기본) · <code className="text-font-icon-5">red</code> ·{' '}
        <code className="text-font-icon-5">blue</code> · <code className="text-font-icon-5">black</code>
      </p>
      <div className="mb-spacing-7 flex flex-wrap items-center gap-spacing-5">
        {['gray', 'red', 'blue', 'black'].map((c) => (
          <Chip key={c} color={c} onRemove={() => {}}>
            {c}
          </Chip>
        ))}
      </div>

      <p className="mb-spacing-5 text-12 text-font-icon-3">삭제 동작 (X로 제거)</p>
      <ChipDemo />
    </section>
  );
}
