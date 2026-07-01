import { fontSize, lineHeight } from '../tokens/index';

const sizes = Object.keys(fontSize);
const leadings = Object.keys(lineHeight);
const sample =
  '설정 화면으로 이동설정 화면으로 이동설정 화면으로 이동설정 화면으로 이동설정 화면으로 이동설정 화면으로 이동';
const lhSample =
  '행간은 텍스트 줄 사이의 세로 간격입니다.\n사이즈는 그대로 두고 이 값만 바꿀 수 있습니다.\n(에디터 본문처럼 가독성이 필요한 곳에 사용)';

// fontSize 토큰 [size, { lineHeight, letterSpacing }] 에서 기본 행간 추출
const lhOf = (size) => fontSize[size]?.[1]?.lineHeight;

export function TypographyPage() {
  return (
    <section className="mx-auto max-w-5xl px-spacing-7 py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-20 font-semibold">Typography</h2>
      <p className="mb-spacing-8 text-14 text-font-icon-4">
        Pretendard · Regular(400) / SemiBold(600) — Figma "폰트 시스템" 토큰
      </p>

      <div className="grid grid-cols-1 gap-spacing-9 sm:grid-cols-2">
        <div className="space-y-spacing-7">
          <h3 className="text-15 font-semibold text-font-icon-5">
            Regular
          </h3>
          {sizes.map((size) => (
            <div key={`regular-${size}`}>
              <p className="mb-spacing-3 text-xs text-font-icon-3">
                regular {size} · 행간 {lhOf(size)}
              </p>
              <p className={`font-pretendard text-${size} font-normal`}>{sample}</p>
            </div>
          ))}
        </div>

        <div className="space-y-spacing-7">
          <h3 className="text-15 font-semibold text-font-icon-5">
            SemiBold
          </h3>
          {sizes.map((size) => (
            <div key={`semibold-${size}`}>
              <p className="mb-spacing-3 text-xs text-font-icon-3">
                semibold {size} · 행간 {lhOf(size)}
              </p>
              <p className={`font-pretendard text-${size} font-semibold`}>{sample}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Line Height — 행간 토큰(사이즈와 독립) */}
      <div className="mt-spacing-11 border-t border-base-gray-100 pt-spacing-9">
        <h3 className="mb-spacing-3 text-15 font-semibold text-font-icon-5">Line Height (행간)</h3>
        <p className="mb-spacing-7 text-13 text-font-icon-4">
          행간 토큰 — <code className="font-mono text-font-icon-5">leading-{'{key}'}</code>(20~32px).
          폰트 사이즈와 <span className="text-font-icon-5">독립</span>이며, 각{' '}
          <code className="font-mono text-font-icon-5">text-*</code>의 기본 행간도 이 토큰을 참조합니다(폰트 크기 + 8px).
          사이즈는 그대로 두고 행간만 달리 줘야 할 때 <code className="font-mono text-font-icon-5">leading-*</code>을 조합합니다.
        </p>
        <div className="grid grid-cols-1 gap-spacing-6 sm:grid-cols-2 lg:grid-cols-3">
          {leadings.map((key) => (
            <div key={`lh-${key}`} className="rounded-round-4 border border-base-gray-100 p-spacing-6">
              <p className="mb-spacing-4 font-mono text-12 text-font-icon-3">
                leading-{key} · {lineHeight[key]}
              </p>
              <p className={`whitespace-pre-line text-14 leading-${key} text-font-icon-5`}>{lhSample}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
