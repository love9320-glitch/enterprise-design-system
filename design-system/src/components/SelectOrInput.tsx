// SelectOrInput — "등록된 값 선택 OR 직접 입력" 상호 배타 필드 (Select + Input 조립, 규칙 4)
// 마지막에 사용한 수단이 값을 가지며, 반대쪽은 디폴트 상태로 되돌아간다:
//   - Input에 직접 입력하면 → Select는 선택 전(placeholder) 상태로 리셋
//   - Select에서 값을 선택하면 → Input은 입력 전(빈) 상태로 리셋
// 값 계약: value/onChange는 최종 문자열 하나(e.target.value). e.target.source('select'|'input'|null)도 함께 전달.
//   controlled일 때 표시 위치는 값이 options에 있으면 Select, 없으면 Input으로 유도된다.
// EmailField / PhoneField 는 placeholder·inputMode 기본값만 다른 얇은 래퍼.
import { useMemo, useState } from 'react';
import { Select } from './Select';
import { Input } from './Input';
import { formatPhoneNumber } from '../utils/phone';

export function SelectOrInput({
  value,
  defaultValue = '',
  onChange,                 // (e) => void — e.target.value(문자열) · e.target.source('select'|'input'|null)
  options = [],             // 등록된 값 목록: 문자열 | { value, label }
  showSelect = true,        // false면 Select 숨김 — 직접 입력 전용(Input이 전체 폭)
  showInput = true,         // false면 Input 숨김 — 등록값 선택 전용(Select가 전체 폭)
  selectPlaceholder = '선택하세요',
  inputPlaceholder = '직접 입력하세요',
  disabled = false,
  readOnly = false,
  error = false,
  errorMessage = '',        // Input의 에러 툴팁으로 표시
  formatInput,              // (raw) => string — 직접 입력값 변환(예: 전화번호 하이픈). 입력 시마다 적용
  width = 400,              // 전체 너비: 숫자(px) | CSS 길이('100%' 등)
  selectWidth = 160,        // Select 너비 — 나머지는 Input이 채움
  menuWidth,                // Select 드롭다운 너비(미지정 시 트리거와 동일)
  placement = 'auto',
  searchable = false,       // Select 검색 필터
  inputProps = {},          // 내부 <input> 속성 통과(inputMode 등)
  className = '',
  ...props
}: any) {
  const opts = useMemo(
    () => options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o)),
    [options],
  );
  const isControlled = value !== undefined;
  // 값만 보고 출처를 추정(초기값·외부 주입값용) — 한쪽만 쓰면 그 수단으로 고정, 아니면 옵션 포함 여부
  const deriveSource = (val) => {
    if (!val) return null;
    if (!showSelect) return 'input';
    if (!showInput) return 'select';
    return opts.some((o) => o.value === val) ? 'select' : 'input';
  };
  const [internal, setInternal] = useState(defaultValue);
  // 마지막으로 사용한 수단 — controlled여도 추적한다. 입력 중 값이 우연히 등록 옵션과
  // 일치해도(예: 전화번호 자동 포맷 도중) Select로 하이재킹되지 않도록 추정보다 우선.
  const [lastSource, setLastSource] = useState(() => deriveSource(defaultValue));

  const current = isControlled ? value : internal;
  const source = !current
    ? null
    : !showInput
      ? 'select'
      : !showSelect
        ? 'input'
        : (lastSource ?? deriveSource(current));

  const emit = (val, src) => {
    const nextSource = val ? src : null;
    setLastSource(nextSource);
    if (!isControlled) setInternal(val);
    onChange?.({ target: { value: val, source: nextSource } });
  };

  // 상호 배타 표시 — 반대쪽 수단은 항상 디폴트 상태
  const selectValue = source === 'select' ? current : '';
  const inputValue = source === 'input' ? current : '';

  const widthStyle = typeof width === 'number' ? `${width}px` : width;

  return (
    <div className={`flex items-start gap-spacing-5 ${className}`} style={{ width: widthStyle }} {...props}>
      {showSelect && (
        <Select
          options={opts}
          value={selectValue}
          onChange={(e) => emit(e.target.value, 'select')}
          placeholder={selectPlaceholder}
          width={showInput ? selectWidth : '100%'} // Input이 없으면 Select가 전체 폭
          menuWidth={menuWidth}
          placement={placement}
          searchable={searchable}
          disabled={disabled}
          readOnly={readOnly}
          // Select 전용 모드에선 에러 툴팁을 Select가 담당(Input이 없으므로)
          error={!showInput && error}
          errorMessage={!showInput ? errorMessage : ''}
        />
      )}
      {showInput && (
        <div className="min-w-0 flex-1">
          <Input
            value={inputValue}
            onChange={(e) => emit(formatInput ? formatInput(e.target.value) : e.target.value, 'input')}
            placeholder={inputPlaceholder}
            width="100%"
            disabled={disabled}
            readOnly={readOnly}
            error={error}
            errorMessage={errorMessage}
            inputProps={inputProps}
          />
        </div>
      )}
    </div>
  );
}

// EmailField — 등록된 이메일 선택 or 직접 입력
export function EmailField({
  selectPlaceholder = '이메일 선택',
  inputPlaceholder = '이메일을 직접 입력하세요',
  inputProps = {},
  ...props
}: any) {
  return (
    <SelectOrInput
      selectPlaceholder={selectPlaceholder}
      inputPlaceholder={inputPlaceholder}
      inputProps={{ inputMode: 'email', ...inputProps }}
      {...props}
    />
  );
}

// PhoneField — 등록된 전화번호 선택 or 직접 입력(하이픈 자동 삽입 — utils/phone.js)
export function PhoneField({
  selectPlaceholder = '전화번호 선택',
  inputPlaceholder = '전화번호를 직접 입력하세요',
  formatInput = formatPhoneNumber, // 기본: 하이픈 자동 포맷(끄려면 null)
  inputProps = {},
  ...props
}: any) {
  return (
    <SelectOrInput
      selectPlaceholder={selectPlaceholder}
      inputPlaceholder={inputPlaceholder}
      formatInput={formatInput ?? undefined}
      inputProps={{ inputMode: 'tel', ...inputProps }}
      {...props}
    />
  );
}
