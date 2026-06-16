import { spacing, radius, borderWidth } from '../tokens/index';

const spacingScale = Object.entries(spacing);
const radiusScale = Object.entries(radius);
const borderScale = Object.entries(borderWidth);

export function SpacingPage() {
  return (
    <section className="mx-auto max-w-5xl px-spacing-7 py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-20 font-semibold">Spacing</h2>
      <p className="mb-spacing-8 text-14 text-font-icon-4">
        갭·마진·패딩에 사용하는 간격 토큰 — Figma "Spacing 토큰".<br />Tailwind 기본
        spacing 스케일과 겹치지 않도록 별도 네임스페이스로 등록했습니다 (예:{' '}
        <code className="text-font-icon-3">p-spacing-4</code>,{' '}
        <code className="text-font-icon-3">gap-spacing-6</code>).
      </p>

      <div className="space-y-spacing-5">
        {spacingScale.map(([key, value]) => (
          <div key={key} className="flex items-center gap-spacing-6">
            <div className="w-32 shrink-0">
              <p className="text-xs font-medium">{key}</p>
              <p className="text-xs text-font-icon-3">{value}</p>
            </div>
            <div className="flex h-6 flex-1 items-center">
              <div
                className="h-3 rounded-round-2 bg-base-gray-800"
                style={{ width: value }}
              />
            </div>
          </div>
        ))}
      </div>

      <h2 className="mb-spacing-3 mt-spacing-10 border-t border-base-gray-100 pt-spacing-8 text-20 font-semibold">Radius</h2>
      <p className="mb-spacing-8 text-14 text-font-icon-4">
        모서리 둥글기 토큰 — Figma "Round 토큰" (예:{' '}
        <code className="text-font-icon-3">rounded-round-7</code>,{' '}
        <code className="text-font-icon-3">rounded-round-00</code>).<br />"round-00"은
        원·필 형태에 사용하는 999px 값입니다.
      </p>

      <div className="grid grid-cols-3 gap-spacing-7 sm:grid-cols-4 lg:grid-cols-6">
        {radiusScale.map(([key, value]) => (
          <div key={key} className="flex flex-col items-center gap-spacing-4">
            <div
              className="h-14 w-14 border-2 border-base-gray-800"
              style={{ borderRadius: value }}
            />
            <p className="text-xs font-medium">{key}</p>
            <p className="text-xs text-font-icon-3">{value}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-spacing-3 mt-spacing-10 border-t border-base-gray-100 pt-spacing-8 text-20 font-semibold">Border</h2>
      <p className="mb-spacing-8 text-14 text-font-icon-4">
        테두리 두께 토큰 — Figma "border 토큰" (예:{' '}
        <code className="text-font-icon-3">border-2</code>,{' '}
        <code className="text-font-icon-3">border-4</code>).
      </p>

      <div className="grid grid-cols-2 gap-spacing-7 sm:grid-cols-4">
        {borderScale.map(([key, value]) => (
          <div key={key} className="flex flex-col items-center gap-spacing-4">
            <div
              className={`h-14 w-14 rounded-round-4 border-${key} border-base-gray-800`}
            />
            <p className="text-xs font-medium">border-{key}</p>
            <p className="text-xs text-font-icon-3">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
