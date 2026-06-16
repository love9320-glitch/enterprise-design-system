import { fontSize } from '../tokens/index';

const sizes = Object.keys(fontSize);
const sample =
  '설정 화면으로 이동설정 화면으로 이동설정 화면으로 이동설정 화면으로 이동설정 화면으로 이동설정 화면으로 이동';

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
              <p className="mb-spacing-3 text-xs text-font-icon-3">regular {size}</p>
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
              <p className="mb-spacing-3 text-xs text-font-icon-3">semibold {size}</p>
              <p className={`font-pretendard text-${size} font-semibold`}>{sample}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
