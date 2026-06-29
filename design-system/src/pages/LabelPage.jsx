import { Label } from '../components/Label';
import { UsageExample } from '../components/UsageExample';

const USAGE = `import { Label } from '../components/Label';

// 기본 — 컨트롤과 htmlFor로 연결
<Label htmlFor="email">이메일</Label>
<input id="email" />

// 필수 표시 / 사이즈 / 비활성
<Label required>이름</Label>
<Label size="16">제목</Label>
<Label disabled>비활성 라벨</Label>`;

const USAGE_PROPS = [
  { name: 'children', type: 'ReactNode', default: '—', desc: '라벨 텍스트' },
  { name: 'htmlFor', type: 'string', default: '—', desc: '연결할 컨트롤 id (클릭 시 포커스)' },
  { name: 'size', type: "'12'|'13'|'14'|'15'|'16'", default: "'14'", desc: 'Figma label Property 1 (텍스트 크기)' },
  { name: 'required', type: 'boolean', default: 'false', desc: '필수 표시 — 빨강 점(●)' },
  { name: 'disabled', type: 'boolean', default: 'false', desc: '비활성 — 회색(font-icon-3)' },
  { name: 'className', type: 'string', default: "''", desc: '추가 클래스' },
];

const SIZES = ['12', '13', '14', '15', '16'];

export function LabelPage() {
  return (
    <section className="mx-auto max-w-5xl px-spacing-7 py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-20 font-semibold text-font-icon-5">Label</h2>
      <p className="mb-spacing-8 text-14 text-font-icon-4">
        폼 라벨 텍스트. Figma <code className="text-font-icon-5">label</code> 컴포넌트(사이즈 변형
        12~16)를 코드로 옮기고, 폼 사용을 위해{' '}
        <span className="text-font-icon-5">required(●)</span>·
        <span className="text-font-icon-5">disabled</span>·
        <span className="text-font-icon-5">htmlFor</span>를 추가로 노출합니다. 단독으로도 쓰고{' '}
        <code className="text-font-icon-5">Field</code> 내부에서도 재사용됩니다.
      </p>

      <UsageExample code={USAGE} props={USAGE_PROPS} />

      {/* 사이즈 — Figma Property 1 = 12~16 */}
      <div className="space-y-spacing-7">
        {SIZES.map((size) => (
          <div key={size} className="grid grid-cols-[100px_1fr] items-center gap-x-spacing-6">
            <p className="text-12 text-font-icon-3">size={size}</p>
            <Label size={size}>Label</Label>
          </div>
        ))}
      </div>

      {/* 상태 */}
      <div className="mt-spacing-9 border-t border-base-gray-100 pt-spacing-8">
        <h3 className="mb-spacing-7 text-15 font-semibold text-font-icon-5">상태 옵션</h3>
        <div className="space-y-spacing-7">
          <div className="grid grid-cols-[100px_1fr] items-center gap-x-spacing-6">
            <p className="text-12 text-font-icon-3">기본</p>
            <Label>이메일</Label>
          </div>
          <div className="grid grid-cols-[100px_1fr] items-center gap-x-spacing-6">
            <p className="text-12 text-font-icon-3">required</p>
            <Label required>이름</Label>
          </div>
          <div className="grid grid-cols-[100px_1fr] items-center gap-x-spacing-6">
            <p className="text-12 text-font-icon-3">disabled</p>
            <Label disabled>비활성 라벨</Label>
          </div>
        </div>
      </div>

      {/* htmlFor 연결 — 라벨 클릭 시 입력에 포커스 */}
      <div className="mt-spacing-9 border-t border-base-gray-100 pt-spacing-8">
        <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">htmlFor 연결</h3>
        <p className="mb-spacing-7 text-12 text-font-icon-4">
          아래 라벨을 클릭하면 <code className="text-font-icon-5">id</code>가 같은 입력칸에 포커스가
          들어갑니다.
        </p>
        <div className="flex items-center gap-spacing-6">
          <Label htmlFor="demo-email" required>
            이메일
          </Label>
          <input
            id="demo-email"
            placeholder="클릭으로 포커스"
            className="min-h-[32px] rounded-round-4 bg-text-field-default-bg px-spacing-6 text-14 outline-none ring-inset ring-text-field-hover-line focus:ring-2 focus:ring-text-field-focused-line"
          />
        </div>
      </div>
    </section>
  );
}
