// Checkbox — 체크박스 (Figma check box)
// 상태: unselected/selected × default/hover/disabled (6가지)
//   - unselected: 흰 박스 + 회색 테두리 / selected: blue 채움 + 흰 체크
//   - hover: 바깥 ring(checkbox-*-hover-outline) / disabled: 연하게
// 체크 아이콘은 Figma check_small SVG(node 7257:2464)를 인라인으로 사용(fill=currentColor).
// 색은 checkbox-* 시멘틱 토큰(base 경유)만 사용. controlled/uncontrolled 모두 지원.
import { useState } from 'react';

// Figma check_small SVG — fill을 currentColor로 바꿔 텍스트 색 토큰을 따르게 함
function CheckMark({ className }) {
  return (
    <svg
      viewBox="0 0 8.34188 6.51667"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M2.84188 4.11667L6.64188 0.316667C6.85299 0.105556 7.08355 0 7.33355 0C7.58355 0 7.8141 0.105556 8.02521 0.316667C8.23633 0.527778 8.34188 0.761111 8.34188 1.01667C8.34188 1.27222 8.23633 1.50556 8.02521 1.71667L3.54188 6.21667C3.34188 6.41667 3.10577 6.51667 2.83355 6.51667C2.56132 6.51667 2.32521 6.41667 2.12521 6.21667L0.308547 4.4C0.0974359 4.18889 -0.00534188 3.95556 0.000213675 3.7C0.00576923 3.44444 0.114103 3.21111 0.325214 3C0.536325 2.78889 0.769658 2.68333 1.02521 2.68333C1.28077 2.68333 1.5141 2.78889 1.72521 3L2.84188 4.11667Z" />
    </svg>
  );
}

export function Checkbox({
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
  const isChecked = isControlled ? checked : internal;

  const handleChange = (e) => {
    if (!isControlled) setInternal(e.target.checked);
    onChange?.(e);
  };

  // hover ring은 박스 바깥에 간격(offset)을 두고 둥글게 표시
  const HOVER_RING = 'group-hover:ring-2 group-hover:ring-offset-1';
  let boxClass;
  if (disabled) {
    boxClass = isChecked ? 'bg-checkbox-selected-disabled-bg' : 'bg-checkbox-disabled-bg';
  } else if (isChecked) {
    boxClass = `bg-checkbox-selected-bg ${HOVER_RING} group-hover:ring-checkbox-selected-hover-outline`;
  } else {
    boxClass = `bg-checkbox-unselected-bg ${HOVER_RING} group-hover:ring-checkbox-hover-outline`;
  }

  const checkColor = disabled ? 'text-checkbox-disabled-check' : 'text-checkbox-check';
  const textColor = disabled ? 'text-checkbox-disabled-text' : 'text-checkbox-text';

  return (
    <label
      className={`group inline-flex items-center gap-spacing-4 ${
        disabled ? 'cursor-not-allowed' : 'cursor-pointer'
      } ${className}`}
    >
      <input
        type="checkbox"
        className="sr-only"
        checked={isChecked}
        onChange={handleChange}
        disabled={disabled}
        {...props}
      />
      <span
        className={`flex size-[16px] shrink-0 items-center justify-center rounded-round-3 transition-shadow ${boxClass}`}
      >
        {/* 항상 렌더하고 visibility로만 토글 — 체크/해제 시 레이아웃이 흔들리지 않게 */}
        <CheckMark className={`w-[8px] ${isChecked ? checkColor : 'invisible'}`} />
      </span>
      {label != null && <span className={`text-14 ${textColor}`}>{label}</span>}
    </label>
  );
}
