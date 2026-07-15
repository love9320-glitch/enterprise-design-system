// SegmentedTabs — 세그먼트 탭 (Figma segmented tab button 8241:88277 / Segmented Tabs 8241:88288)
// 회색 트랙(segmented-tab-bg) 안에서 흰색 배경 pill이 선택 탭으로 '슬라이드'해 이동한다.
//   - 탭은 items로 필요한 만큼(2·3·4·5…) 추가 — 모든 탭이 균등 폭(flex-1)이라야 pill 이동 계산이 맞다.
//   - pill = 트랙 안 absolute, 폭 100/N%, translateX(선택 index × 100%) + transition-transform로 슬라이드.
//   - 색은 segmented-* 시멘틱 토큰만. controlled(value)/uncontrolled(defaultValue) 단일 선택.
import { useState } from 'react';
import { TruncatingText } from './TruncatingText';

export function SegmentedTabs({
  items = [],             // [{ value, label, disabled? }] — 2개 이상, 개수 가변
  value,                  // controlled 선택값
  defaultValue,           // uncontrolled 초기 선택값
  onChange,               // (value) => void
  width,                  // 컨테이너 너비 — 숫자(px)/CSS 길이. 미지정 시 부모 전체 폭(w-full)
  className = '',
  ...props
}: any) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue);
  // 선택값 폴백은 렌더 파생 — items가 비어 도착해도(비동기) 첫 탭이 선택된다.
  const selected = isControlled ? value : (internal ?? items[0]?.value);

  const n = items.length;
  // pill 위치 index — 선택값이 목록에 없으면 0(첫 탭)으로 폴백해 pill이 항상 유효 위치.
  const selIdx = Math.max(0, items.findIndex((it) => it.value === selected));

  const select = (val) => {
    if (!isControlled) setInternal(val);
    onChange?.(val);
  };

  // 좌우 방향키로 이동(비활성 탭은 건너뜀)
  const move = (dir) => {
    if (n === 0) return;
    let i = selIdx;
    for (let step = 0; step < n; step += 1) {
      i = (i + dir + n) % n;
      if (!items[i].disabled) {
        select(items[i].value);
        return;
      }
    }
  };

  const widthStyle = width == null ? undefined : typeof width === 'number' ? `${width}px` : width;

  return (
    <div
      role="tablist"
      style={{ width: widthStyle }}
      className={`flex ${width == null ? 'w-full' : ''} rounded-round-4 bg-segmented-tab-bg p-spacing-3 ${className}`}
      {...props}
    >
      <div className="relative flex min-w-0 flex-1">
        {/* 슬라이딩 배경 pill — 트랙 안에서 선택 탭으로 이동. 탭 균등 폭 전제(width 100/N%). */}
        {n > 0 && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 rounded-round-3 bg-segmented-select-bg ring-1 ring-segmented-select-line shadow-[0px_2px_4px_0px_rgba(0,0,0,0.12)] transition-transform duration-200 ease-out"
            style={{ width: `${100 / n}%`, transform: `translateX(${selIdx * 100}%)` }}
          />
        )}
        {items.map((it) => {
          const isSel = it.value === selected;
          return (
            <button
              key={it.value}
              type="button"
              role="tab"
              aria-selected={isSel}
              disabled={it.disabled}
              tabIndex={isSel ? 0 : -1}
              onClick={() => !it.disabled && select(it.value)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight') {
                  e.preventDefault();
                  move(1);
                } else if (e.key === 'ArrowLeft') {
                  e.preventDefault();
                  move(-1);
                }
              }}
              className={`relative z-[1] flex min-h-[24px] min-w-0 flex-1 items-center justify-center rounded-round-3 px-spacing-5-5 font-pretendard text-14 leading-24 transition-colors ${
                it.disabled
                  ? 'cursor-not-allowed text-segmented-disabled-text'
                  : isSel
                    ? 'cursor-pointer text-segmented-select-text'
                    : 'cursor-pointer text-segmented-unselect-text hover:text-segmented-hover-text'
              }`}
            >
              <TruncatingText as="span" className="min-w-0">
                {it.label}
              </TruncatingText>
            </button>
          );
        })}
      </div>
    </div>
  );
}
