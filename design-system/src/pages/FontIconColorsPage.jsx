import { fontIconColors } from '../tokens/index';

const fontIconScale = Object.entries(fontIconColors).sort((a, b) => b[0] - a[0]);

export function FontIconColorsPage() {
  return (
    <section className="mx-auto max-w-3xl px-spacing-7 py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-lg font-semibold">Font / Icon Colors</h2>
      <p className="mb-spacing-8 text-sm text-font-icon-4 dark:text-gray-400">
        폰트·아이콘용 시멘틱 컬러 — Figma "폰트 아이콘 칼라" 토큰. 베이스 그레이
        스케일을 의미에 맞게 재참조했습니다 (5번이 디폴트 적용 컬러).
      </p>

      <div className="space-y-spacing-6">
        {fontIconScale.map(([key, hex]) => (
          <div
            key={key}
            className="flex items-center gap-spacing-6 rounded-round-4 border border-gray-200 p-spacing-6 dark:border-gray-800"
          >
            <div
              className="h-10 w-10 shrink-0 rounded-round-4 border border-gray-200 dark:border-gray-800"
              style={{ backgroundColor: hex }}
            />
            <div className="w-40 shrink-0">
              <p className="text-xs font-medium">
                font / icon {key}
                {key === '5' && (
                  <span className="ml-spacing-3 text-font-icon-3">(디폴트)</span>
                )}
              </p>
              <p className="text-xs text-font-icon-3">{hex}</p>
            </div>
            <div className="flex h-12 flex-1 items-center rounded-round-4 bg-base-white px-spacing-6">
              <p className="font-pretendard text-16" style={{ color: hex }}>
                설정 화면으로 이동
              </p>
            </div>
            <div className="flex h-12 flex-1 items-center rounded-round-4 bg-base-gray-900 px-spacing-6">
              <p className="font-pretendard text-16" style={{ color: hex }}>
                설정 화면으로 이동
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
