// Switch — 스위치 토글 (Figma switch, node 7370:115)
// 상태: off(unselected)/on(selected) × default/hover/disabled (6가지)
//   - off: 회색 track + 흰 thumb(좌측) / on: blue track + 흰 thumb(우측)
//   - hover: 바깥 ring(switch-*-hover-outline)
//   - disabled(그림자 없음): off=연한 회색 track + 진회색 thumb / on=연한 blue track + blue thumb
// 색은 switch-* 시멘틱 토큰(base 경유)만 사용. controlled/uncontrolled 모두 지원.
// track 28×16, thumb 12×10, 이동 거리 8px(spacing-5)을 translate로 애니메이션.
import { useState } from 'react';

export function Switch({
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  label,
  className = '',
  ...props
}) {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = useState(defaultChecked);
  const isOn = isControlled ? checked : internal;

  const handleChange = (e) => {
    if (!isControlled) setInternal(e.target.checked);
    onChange?.(e);
  };

  // hover ring은 track 바깥에 간격(offset)을 두고 표시
  const HOVER_RING = 'group-hover:ring-2 group-hover:ring-offset-1';
  let trackClass;
  if (disabled) {
    trackClass = isOn ? 'bg-switch-selected-disabled-bg' : 'bg-switch-disabled-bg';
  } else if (isOn) {
    trackClass = `bg-switch-selected-bg ${HOVER_RING} group-hover:ring-switch-selected-hover-outline`;
  } else {
    trackClass = `bg-switch-unselected-bg ${HOVER_RING} group-hover:ring-switch-hover-outline`;
  }

  // thumb 색 — disabled는 그림자 없음(on=blue, off=진회색), 그 외 흰 thumb + 그림자
  let thumbColor;
  if (disabled) {
    thumbColor = isOn ? 'bg-switch-disabled-thumb' : 'bg-switch-disabled-thumb-off';
  } else {
    thumbColor = 'bg-switch-thumb shadow';
  }
  const textColor = disabled ? 'text-switch-disabled-text' : 'text-switch-text';

  return (
    <label
      className={`group relative inline-flex items-center gap-spacing-4 ${
        disabled ? 'cursor-not-allowed' : 'cursor-pointer'
      } ${className}`}
    >
      <input
        type="checkbox"
        role="switch"
        className="sr-only"
        checked={isOn}
        onChange={handleChange}
        disabled={disabled}
        {...props}
      />
      <span
        className={`relative h-[16px] w-[28px] shrink-0 rounded-round-5 transition-[background-color,box-shadow] ${trackClass}`}
      >
        <span
          className={`absolute left-spacing-3 top-1/2 h-[10px] w-[12px] -translate-y-1/2 rounded-round-4 transition-transform ${thumbColor} ${
            isOn ? 'translate-x-spacing-5' : 'translate-x-0'
          }`}
        />
      </span>
      {label != null && <span className={`text-14 ${textColor}`}>{label}</span>}
    </label>
  );
}
