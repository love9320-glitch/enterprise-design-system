// Input — 텍스트 입력 필드 (Figma 02_textfield / input, solid 타입 + input transparent 8616:41229
//   + input unit 9275:316 / input transparent unit 9275:364
//   + input password 9275:519 / input transparent password 9275:589 — 2026-08-12 신설)
// 상태(default/hover/focused/filled)는 CSS와 실제 입력값으로 자동 처리.
// disabled / readOnly / error 는 props로 노출(완전 옵션화).
// variant='transparent': 박스·배경·링 없이 텍스트만(가로 패딩 0) — default(플레이스홀더)도
// filled와 같은 진한색(2026-07-27 지시), hover 시 텍스트 gray 300(2026-07-28 지시),
// 포커스에도 링 없음. 색은 solid와 같은 tf-* 토큰.
//
// 입력 타입(type, 2026-08-12 — 지원서 폼 요구):
//   'text'(기본)   — 제한 없음
//   'number'       — 숫자만. 세부 옵션 decimal(소수점 1개 허용, 기본 true)·comma(천 단위 콤마 자동)
//   'password'     — 마스킹(점 색 = default-text 회색, Figma 스펙) + 우측 눈 토글(보기/숨김)
//   'email'/'url'  — 입력 제한 없음, blur 시 형식 검증 → 실패면 표준 카피 툴팁(잘못된 양식입니다.)
//   'tel'          — 숫자만 + 하이픈 자동(utils/phone.formatPhoneNumber — 3-4-4·02 지역번호)
//   'korean'/'english' — 허용 문자 필터(이름/여권 영문명). IME 조합 중에는 필터를 미뤄
//     compositionEnd에서 정리(조합 중 강제 치환 시 한글 조합이 깨짐)
// 단위(unit): 필드 우측 고정 suffix 텍스트("원"·"점"·"년") — 값과 무관하게 default-text 회색(Figma 스펙).
//
// 에러 표현 규칙: 에러는 인풋 테두리를 바꾸지 않고 "툴팁"으로만 표시한다.
//  - 툴팁은 인풋 박스 아래에 absolute 오버레이로 띄워, 레이아웃 흐름과
//    형제 컴포넌트 영역에 전혀 영향을 주지 않는다(공간을 차지하지 않음).
//  - 형식 검증(email/url) 실패는 내부 상태로 같은 툴팁을 띄운다(consumer error가 항상 우선).
import { useId, useState } from 'react';
import type {
  ChangeEvent,
  ComponentProps,
  ComponentPropsWithoutRef,
  CompositionEvent,
  FocusEvent,
} from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { INVALID_FORMAT_MESSAGE, REQUIRED_INPUT_MESSAGE } from '../utils/validationMessages';
import { formatPhoneNumber } from '../utils/phone';
import { Tooltip } from './Tooltip';

// 편집 가능 상태의 테두리(ring) — hover/focus 모두 2px(border-2 토큰). 색은 시멘틱 토큰.
const RING = 'ring-inset ring-text-field-hover-line hover:ring-2 focus-within:ring-2 focus-within:ring-text-field-focused-line';

// 사이즈 — '32'(기본, 32px·text-14) | '22'(작게, 22px·text-12·leading-18로 핏하게, 좁은 셀/인라인용).
// bare = transparent 변형용(가로 패딩 없이 세로만 — 텍스트가 영역에 플러시하게 붙음).
const SIZE_STYLE = {
  '32': { box: 'min-h-[32px] px-spacing-6 py-spacing-3', bare: 'min-h-[32px] py-spacing-3', text: 'text-14' },
  '22': { box: 'min-h-[22px] px-spacing-5 py-spacing-2', bare: 'min-h-[22px] py-spacing-2', text: 'text-12 leading-18' },
};

// 입력 타입 — 허용 문자 필터·자동 포맷·형식 검증의 단일 축(상세는 파일 상단 주석)
export type InputType = 'text' | 'number' | 'password' | 'email' | 'tel' | 'url' | 'korean' | 'english';

// 허용 문자 필터(입력 즉시 차단) — korean/english 전용
const CHAR_FILTER: Partial<Record<InputType, RegExp>> = {
  korean: /[^가-힣ㄱ-ㅎㅏ-ㅣ\s]/g,
  english: /[^A-Za-z\s]/g,
};

// 형식 검증(blur 시) — email/url 전용. 빈 값은 검증하지 않는다(필수 여부는 consumer error 소관).
const FORMAT_VALIDATOR: Partial<Record<InputType, (v: string) => boolean>> = {
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  url: (v) => /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/i.test(v),
};

// 숫자 포맷 — 숫자 외 제거, 소수점 1개 유지(decimal), 정수부 천 단위 콤마(comma)
function formatNumeric(raw: string, decimal: boolean, comma: boolean): string {
  let v = raw.replace(/[^\d.]/g, '');
  if (!decimal) {
    v = v.replace(/\./g, '');
  } else {
    const i = v.indexOf('.');
    if (i !== -1) v = v.slice(0, i + 1) + v.slice(i + 1).replace(/\./g, '');
  }
  if (comma && v) {
    const [int, dec] = v.split('.');
    const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    v = dec !== undefined ? `${grouped}.${dec}` : grouped;
  }
  return v;
}

// 타입별 표시 값 정리 — 필터·자동 포맷을 한 곳에서(변화 없으면 원본 그대로 반환)
function sanitizeValue(type: InputType, raw: string, decimal: boolean, comma: boolean): string {
  if (type === 'number') return formatNumeric(raw, decimal, comma);
  if (type === 'tel') return formatPhoneNumber(raw);
  const filter = CHAR_FILTER[type];
  if (filter) return raw.replace(filter, '');
  return raw;
}

// 네이티브 input의 type/inputMode — number는 스피너 없는 text + 모바일 숫자 키패드
function nativeInputAttrs(type: InputType, passwordVisible: boolean) {
  switch (type) {
    case 'password':
      return { type: passwordVisible ? 'text' : 'password' } as const;
    case 'email':
      return { type: 'email', inputMode: 'email' } as const;
    case 'tel':
      return { type: 'tel', inputMode: 'tel' } as const;
    case 'url':
      return { type: 'url', inputMode: 'url' } as const;
    case 'number':
      return { type: 'text', inputMode: 'decimal' } as const;
    default:
      return { type: 'text' } as const;
  }
}

// ...props는 바깥 필드 컨테이너(div)로, 실제 <input> 속성은 inputProps로 전달한다.
interface InputProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange'> {
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  size?: keyof typeof SIZE_STYLE; // '32'(32px·14px) | '22'(22px·12px, 라인하이트 핏)
  variant?: 'solid' | 'transparent'; // 'transparent'=박스·링 없이 텍스트만(플레이스홀더도 진한색)
  /** 입력 타입 — text(기본)/number/password/email/tel/url/korean/english (파일 상단 주석 참조) */
  type?: InputType;
  /** number 전용: 소수점 1개 허용(기본 true) */
  decimal?: boolean;
  /** number 전용: 천 단위 콤마 자동 표시(기본 false) — 값(e.target.value)도 콤마 포함 문자열 */
  comma?: boolean;
  /** 우측 단위 suffix 텍스트("원"·"점"·"년" 등) — default-text 회색 고정(Figma input unit) */
  unit?: string;
  /** password 전용: 우측 눈(보기/숨김) 토글 표시(기본 true) */
  showPasswordToggle?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  error?: boolean;
  errorMessage?: string;
  /** email/url 형식 검증 실패 툴팁 문구 — 표준 카피 자동 적용(규칙 21) */
  formatErrorMessage?: string;
  width?: number | string; // 너비: 숫자(px) 또는 CSS 길이 문자열('100%' 등). 미지정 시 200px
  inputProps?: ComponentProps<'input'>; // ref 포함(React 19 ref-as-prop) — 커서 삽입 등 DOM 접근용
}

export function Input({
  value,
  defaultValue,
  onChange,
  placeholder = '텍스트를 입력하세요',
  size = '32', // '32'(32px·14px) | '22'(22px·12px, 라인하이트 핏)
  variant = 'solid', // 'solid'(필드형, 기본) | 'transparent'(박스·링 없이 텍스트만)
  type = 'text',
  decimal = true,
  comma = false,
  unit,
  showPasswordToggle = true,
  disabled = false,
  readOnly = false,
  error = false,
  errorMessage = REQUIRED_INPUT_MESSAGE, // 표준 카피 자동 적용(규칙 21) — 필요 시만 덮어쓰기
  formatErrorMessage = INVALID_FORMAT_MESSAGE, // 형식 오류 표준 카피(규칙 21)
  width = 200, // 너비: 숫자(px) 또는 CSS 길이 문자열('100%' 등). 미지정 시 200px
  className = '',
  inputProps = {},
  ...props
}: InputProps) {
  const interactive = !disabled && !readOnly;
  // 에러 툴팁 id — 표시 중일 때 aria-describedby로 연결(스크린리더가 같은 문구 낭독)
  const errTipId = useId();
  // 형식 검증(email/url) 실패 — blur 시 판정, 재입력 시작하면 해제
  const [formatError, setFormatError] = useState(false);
  // password 보기 토글
  const [passwordVisible, setPasswordVisible] = useState(false);

  const isPassword = type === 'password';
  const isMasked = isPassword && !passwordVisible;
  const effError = error || formatError; // consumer error가 항상 우선(문구도)
  const showErrTip = (error && !!errorMessage) || (!error && formatError && !!formatErrorMessage);
  const tipText = error ? errorMessage : formatErrorMessage;
  const widthStyle = typeof width === 'number' ? `${width}px` : width;
  const sizeStyle = SIZE_STYLE[size] ?? SIZE_STYLE['32'];
  const isTransparent = variant === 'transparent';

  // 타입별 필터·포맷을 적용해 consumer onChange로 전달. DOM 값을 직접 정리해
  // controlled(값 반영)·uncontrolled(표시) 모두 정돈된 값을 보게 한다.
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // IME 조합 중에는 필터하지 않는다(조합 파괴) — compositionEnd에서 정리
    const composing = (e.nativeEvent as unknown as { isComposing?: boolean }).isComposing;
    if (!composing) {
      const cleaned = sanitizeValue(type, e.target.value, decimal, comma);
      if (cleaned !== e.target.value) e.target.value = cleaned;
    }
    if (formatError) setFormatError(false);
    onChange?.(e);
    inputProps.onChange?.(e);
  };

  const handleCompositionEnd = (e: CompositionEvent<HTMLInputElement>) => {
    const el = e.currentTarget;
    const cleaned = sanitizeValue(type, el.value, decimal, comma);
    if (cleaned !== el.value) {
      el.value = cleaned;
      // 정리된 값을 consumer가 받도록 change 이벤트 재발화(controlled 동기화)
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }
    inputProps.onCompositionEnd?.(e);
  };

  // 형식 검증(email/url) — blur 시. 빈 값은 통과(필수 검증은 consumer error 소관)
  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const validate = FORMAT_VALIDATOR[type];
    if (validate) {
      const v = e.currentTarget.value.trim();
      setFormatError(v !== '' && !validate(v));
    }
    inputProps.onBlur?.(e);
  };

  // error(벨리데이션 툴팁 표시 중)면 값·플레이스홀더 모두 red 400 (2026-07-30 지시)
  // password 마스킹 점 색 = 입력 텍스트(filled)와 동일(2026-08-12 지시 — 회색 아님)
  const textColor = effError
    ? 'text-text-field-error-text'
    : disabled
      ? 'text-text-field-disabled-text'
      : readOnly
        ? 'text-text-field-readonly-text'
        : 'text-text-field-filled-text';
  // disabled면 플레이스홀더도 비활성 색(#c9c9c9) — TextArea와 동일 패턴(Figma disabled 스펙)
  // transparent는 default(플레이스홀더)도 filled와 같은 진한색(2026-07-27 지시)
  const placeholderColor = effError
    ? 'placeholder:text-text-field-error-text'
    : disabled
      ? 'placeholder:text-text-field-disabled-text'
      : isTransparent
        ? 'placeholder:text-text-field-filled-text'
        : 'placeholder:text-text-field-default-text';

  const nativeAttrs = nativeInputAttrs(type, passwordVisible);

  return (
    <div
      style={{ width: widthStyle }}
      data-variant={variant}
      data-size={size}
      data-type={type !== 'text' ? type : undefined}
      data-state={effError ? 'error' : disabled ? 'disabled' : readOnly ? 'readonly' : 'default'}
      className={
        isTransparent
          ? // transparent: 배경·링 없음(포커스에도), 가로 패딩 0 — hover 텍스트 회색은 group으로 전달
            `group relative flex items-center gap-spacing-3 rounded-round-4 ${sizeStyle.bare} ${
              interactive ? '' : 'cursor-not-allowed'
            } ${className}`
          : `relative flex items-center gap-spacing-3 rounded-round-4 bg-text-field-default-bg transition-shadow ${sizeStyle.box} ${
              interactive ? RING : 'cursor-not-allowed'
            } ${className}`
      }
      {...props}
    >
      <input
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={effError || undefined}
        className={`min-w-0 flex-1 bg-transparent outline-none ${sizeStyle.text} ${placeholderColor} ${
          isTransparent && interactive
            ? // hover·입력 중(포커스) 시 '플레이스홀더만' gray 300 — 입력된 값 텍스트는
              // 어떤 상태에도 디폴트 진한색 유지(2026-07-28 지시)
              'transition-colors group-hover:placeholder:text-text-field-default-text focus:placeholder:text-text-field-default-text'
            : ''
        } disabled:cursor-not-allowed read-only:cursor-default ${textColor} ${
          isMasked ? 'input-password-mask' : ''
        }`}
        {...nativeAttrs}
        {...inputProps}
        onChange={handleChange}
        onCompositionEnd={handleCompositionEnd}
        onBlur={handleBlur}
        aria-describedby={
          [showErrTip ? errTipId : null, inputProps['aria-describedby']].filter(Boolean).join(' ') ||
          undefined
        }
      />

      {/* 단위 suffix — 값과 무관하게 default-text 회색 고정(Figma input unit), disabled면 비활성 색 */}
      {unit != null && unit !== '' && (
        <span
          className={`shrink-0 ${sizeStyle.text} ${
            disabled ? 'text-text-field-disabled-text' : 'text-text-field-default-text'
          }`}
        >
          {unit}
        </span>
      )}

      {/* password 눈 토글 — 아이콘 font_icon 5(#0d0d0d), hover는 ghost bg(Figma input password) */}
      {isPassword && showPasswordToggle && (
        <button
          type="button"
          onClick={() => setPasswordVisible((v) => !v)}
          disabled={disabled}
          aria-label={passwordVisible ? '비밀번호 숨기기' : '비밀번호 표시'}
          aria-pressed={passwordVisible}
          className="flex shrink-0 items-center justify-center rounded-round-4 p-spacing-1 text-font-icon-5 transition-colors hover:bg-button-ghost-hover-bg disabled:cursor-not-allowed disabled:text-text-field-disabled-icon disabled:hover:bg-transparent"
        >
          {passwordVisible ? (
            <EyeOff size={size === '22' ? 14 : 16} strokeWidth={1.8} />
          ) : (
            <Eye size={size === '22' ? 14 : 16} strokeWidth={1.8} />
          )}
        </button>
      )}

      {/* 에러 툴팁 — absolute 오버레이라 인풋 아래 공간을 차지하지 않는다.
          role=alert: 등장 시 스크린리더가 즉시 낭독 + id로 aria-describedby 연결 */}
      {showErrTip && (
        <div id={errTipId} role="alert" className="absolute left-0 top-full z-10 mt-spacing-2">
          <Tooltip variant="error" beak="top">
            {tipText}
          </Tooltip>
        </div>
      )}
    </div>
  );
}
