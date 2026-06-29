// Label — 폼 라벨 텍스트 (Figma label 컴포넌트: Property 1 = 12~16 사이즈 변형)
//
// Figma 원본은 "사이즈 변형(12/13/14/15/16)만" 가진 텍스트 컴포넌트다.
// 코드는 실제 폼 사용을 위해 required(*)·disabled·htmlFor 를 추가로 노출한다
// (규칙 11: 코드가 Figma보다 옵션이 많아도 무방 — 코드를 Figma에 맞춰 깎지 않는다).
//
// 단독으로도 쓰고(<Label htmlFor=…>), Field 내부에서도 재사용한다
// (Checkbox가 단독 + List 내부에서 재사용되는 것과 동일한 합성 패턴).

const SIZE_STYLES = {
  '12': 'text-12',
  '13': 'text-13',
  '14': 'text-14',
  '15': 'text-15',
  '16': 'text-16',
};

export function Label({
  children,
  htmlFor,
  size = '14',        // '12' | '13' | '14' | '15' | '16' (Figma size variant)
  required = false,   // 필수 표시(빨강 점) — Figma state=required
  disabled = false,   // 비활성 — Figma state=disabled
  className = '',
  ...props
}) {
  // 색은 label-field 시멘틱 토큰 경유(Figma label-field/* 변수와 1:1)
  const textColor = disabled ? 'text-label-field-disabled-text' : 'text-label-field-default-text';

  return (
    <label
      htmlFor={htmlFor}
      className={`inline-flex items-center gap-spacing-3 font-pretendard font-normal ${SIZE_STYLES[size]} ${textColor} ${className}`}
      {...props}
    >
      {children}
      {required && (
        // 필수 표시 — 빨강 6px 점(Figma label-field/required mark)
        <span
          className="size-[6px] shrink-0 rounded-round-00 bg-label-field-required-mark"
          aria-hidden="true"
        />
      )}
    </label>
  );
}
