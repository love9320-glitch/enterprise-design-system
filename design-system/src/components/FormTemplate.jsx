// FormTemplate — 폼 템플릿 (Figma "form template", Property 1=1/2/3/mixed column)
// 12칸 그리드(Figma "12 grid") 위에 Field(라벨+컨트롤)를 span으로 배치하는 조립형 템플릿(규칙 4).
//   - columns: 1/2/3 — 필드 기본 폭(12/columns칸). 혼합 배치는 필드별 span(12칸 기준)으로 지정
//   - columnGap/rowGap: 그리드 가로/세로 간격 — 16/20/24/28/32(px, spacing 토큰 7~11)
//   - labelSize: 모든 필드 라벨 크기 일괄 변경('12'~'16', 미지정 시 Field 기본)
// 컨트롤은 소비자가 field.control로 그대로 주입(Input/Select/DateField/EmailField 등 — 손으로 안 짬).
import { Field } from './Field';

// 간격(px) → 등록 spacing 토큰 클래스 (16=7 · 20=8 · 24=9 · 28=10 · 32=11)
const GAP_X = {
  16: 'gap-x-spacing-7',
  20: 'gap-x-spacing-8',
  24: 'gap-x-spacing-9',
  28: 'gap-x-spacing-10',
  32: 'gap-x-spacing-11',
};
const GAP_Y = {
  16: 'gap-y-spacing-7',
  20: 'gap-y-spacing-8',
  24: 'gap-y-spacing-9',
  28: 'gap-y-spacing-10',
  32: 'gap-y-spacing-11',
};

export function FormTemplate({
  fields = [],       // [{ key, label, required?, disabled?, description?, span?(1~12), control: ReactNode }]
  columns = 1,       // 1 | 2 | 3 — 필드 기본 폭(12/columns칸). mixed는 필드별 span으로
  columnGap = 16,    // 가로 간격(px): 16 | 20 | 24 | 28 | 32
  rowGap = 16,       // 세로 간격(px): 16 | 20 | 24 | 28 | 32
  labelSize,         // 라벨 크기 일괄('12'~'16') — 미지정 시 Field 기본(세로 12)
  className = '',
  ...props
}) {
  const cols = Math.min(Math.max(columns, 1), 3);
  const defaultSpan = 12 / cols; // 1→12 · 2→6 · 3→4
  const gapX = GAP_X[columnGap] ?? GAP_X[16];
  const gapY = GAP_Y[rowGap] ?? GAP_Y[16];

  return (
    <div className={`grid grid-cols-12 ${gapX} ${gapY} ${className}`} {...props}>
      {fields.map((f) => {
        const span = Math.min(Math.max(f.span ?? defaultSpan, 1), 12);
        return (
          // span은 12칸 기준 — Tailwind purge를 피해 인라인 grid-column으로 지정
          <div key={f.key} style={{ gridColumn: `span ${span} / span ${span}` }}>
            <Field
              label={f.label}
              required={f.required}
              disabled={f.disabled}
              description={f.description}
              {...(labelSize ? { labelSize } : {})}
            >
              {f.control}
            </Field>
          </div>
        );
      })}
    </div>
  );
}
