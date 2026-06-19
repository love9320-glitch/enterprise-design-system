// Radio — 라디오 버튼 (Figma radio, node 7368:1243)
// 상태: unselected/selected × default/hover/disabled (6가지)
//   - unselected: 회색 원 / selected: blue 원 + 흰 점(point)
//   - hover: 바깥 ring(radio-*-hover-outline) / disabled: 연하게(selected disabled = 연한 blue + blue 점)
// 색은 radio-* 시멘틱 토큰(base 경유)만 사용. 체크박스와 구조는 같으나 원형 + 가운데 점.
// - Radio       : 단일 라디오 버튼 1개(controlled/uncontrolled 모두 지원)
// - RadioGroup  : name 공유로 단일 선택을 관리하는 컨테이너
import { useState } from 'react';

// gap 토큰 키 → gap 클래스 (Tailwind purge 안전하게 정적 매핑) — SegmentControl/ButtonGroup과 동일 규약
const GAP_STYLE = {
  '3': 'gap-spacing-3', // 4px
  '4': 'gap-spacing-4', // 6px
  '5': 'gap-spacing-5', // 8px
  '6': 'gap-spacing-6', // 12px
  '7': 'gap-spacing-7', // 16px (기본 — 라디오 항목 간격)
};

export function Radio({
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  label,
  name,
  value,
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

  // hover ring은 원 바깥에 간격(offset)을 두고 표시
  const HOVER_RING = 'group-hover:ring-2 group-hover:ring-offset-1';
  let boxClass;
  if (disabled) {
    boxClass = isChecked ? 'bg-radio-selected-disabled-bg' : 'bg-radio-disabled-bg';
  } else if (isChecked) {
    boxClass = `bg-radio-selected-bg ${HOVER_RING} group-hover:ring-radio-selected-hover-outline`;
  } else {
    boxClass = `bg-radio-unselected-bg ${HOVER_RING} group-hover:ring-radio-hover-outline`;
  }

  const pointColor = disabled ? 'bg-radio-disabled-point' : 'bg-radio-point';
  const textColor = disabled ? 'text-radio-disabled-text' : 'text-radio-text';

  return (
    <label
      className={`group relative inline-flex items-center gap-spacing-4 ${
        disabled ? 'cursor-not-allowed' : 'cursor-pointer'
      } ${className}`}
    >
      <input
        type="radio"
        className="sr-only"
        checked={isChecked}
        onChange={handleChange}
        disabled={disabled}
        name={name}
        value={value}
        {...props}
      />
      <span
        className={`flex size-[16px] shrink-0 items-center justify-center rounded-round-00 transition-shadow ${boxClass}`}
      >
        {/* 가운데 점은 항상 렌더하고 visibility로만 토글 — 선택/해제 시 레이아웃이 흔들리지 않게 */}
        <span className={`size-[6px] rounded-round-00 ${pointColor} ${isChecked ? '' : 'invisible'}`} />
      </span>
      {label != null && <span className={`text-14 ${textColor}`}>{label}</span>}
    </label>
  );
}

export function RadioGroup({
  items = [],             // [{ value, label, disabled }]
  value,                  // controlled 선택값
  defaultValue,           // uncontrolled 초기 선택값
  onChange,               // (value) => void
  name,                   // 라디오 그룹 name (미지정 시 자동 생성)
  direction = 'vertical', // 'vertical' | 'horizontal'
  gap = '7',              // 간격 토큰 키 — 기본 '7'(16px)
  disabled = false,       // 그룹 전체 비활성
  className = '',
  ...props
}) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue);
  const selected = isControlled ? value : internal;

  // name 미지정 시 그룹 인스턴스마다 고유 name 생성
  const [groupName] = useState(() => name ?? `radio-group-${Math.random().toString(36).slice(2, 9)}`);

  const handleSelect = (val) => {
    if (!isControlled) setInternal(val);
    onChange?.(val);
  };

  const gapStyle = GAP_STYLE[gap] ?? GAP_STYLE['7'];
  const dirStyle = direction === 'horizontal' ? 'flex-row items-center' : 'flex-col items-start';

  return (
    <div
      role="radiogroup"
      className={`inline-flex ${dirStyle} ${gapStyle} ${className}`}
      {...props}
    >
      {items.map((item) => (
        <Radio
          key={item.value}
          name={name ?? groupName}
          value={item.value}
          label={item.label}
          checked={selected === item.value}
          disabled={disabled || item.disabled}
          onChange={() => handleSelect(item.value)}
        />
      ))}
    </div>
  );
}
