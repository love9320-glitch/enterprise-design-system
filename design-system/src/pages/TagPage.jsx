import { Tag } from '../components/Tag';

export function TagPage() {
  return (
    <section className="mx-auto max-w-3xl px-spacing-7 py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-18 font-semibold text-font-icon-5">Tag</h2>
      <p className="mb-spacing-8 text-14 text-font-icon-4">
        작은 칩 라벨. 색상은 tag 시멘틱 토큰(base blue 경유)을 사용합니다. 현재는{' '}
        <code className="text-font-icon-5">blue</code> 타입만 있으며, 추후 색상 타입이 추가될 수 있습니다.
      </p>

      <h3 className="mb-spacing-5 text-xs font-semibold uppercase tracking-wide text-font-icon-3">
        Type
      </h3>
      <div className="flex items-center gap-spacing-5">
        <Tag type="blue">태그</Tag>
        <Tag type="blue">blue</Tag>
        <Tag type="blue">라벨 예시</Tag>
      </div>
    </section>
  );
}
