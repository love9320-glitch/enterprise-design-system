// Label — 폼 라벨 텍스트 (Figma label 컴포넌트: Property 1 = 12~16 사이즈 변형)
//
// Figma 원본은 "사이즈 변형(12/13/14/15/16)만" 가진 텍스트 컴포넌트다.
// 코드는 실제 폼 사용을 위해 required(*)·disabled·htmlFor 를 추가로 노출한다
// (규칙 11: 코드가 Figma보다 옵션이 많아도 무방 — 코드를 Figma에 맞춰 깎지 않는다).
//
// 단독으로도 쓰고(<Label htmlFor=…>), Field 내부에서도 재사용한다
// (Checkbox가 단독 + List 내부에서 재사용되는 것과 동일한 합성 패턴).

import type { ComponentPropsWithoutRef } from 'react';

// 행간 = 텍스트 사이즈와 동일 수치(leading-N 토큰, 2026-07-28 지시) — 라벨은 한 줄 텍스트라
// 기본 행간(+8px)의 상하 여백 없이 사이즈에 딱 맞는 높이를 갖는다.
const SIZE_STYLES = {
  '12': 'text-12 leading-12',
  '13': 'text-13 leading-13',
  '14': 'text-14 leading-14',
  '15': 'text-15 leading-15',
  '16': 'text-16 leading-16',
};

interface LabelProps extends ComponentPropsWithoutRef<'label'> {
  size?: keyof typeof SIZE_STYLES; // '12' | '13' | '14' | '15' | '16' (Figma size variant)
  color?: 'default' | 'gray';      // 텍스트 색 — 'default'(#0d0d0d) | 'gray'(#878787, label-field/gray-text)
  required?: boolean;              // 필수 표시(빨강 점) — Figma state=required
  disabled?: boolean;              // 비활성 — Figma state=disabled
}

export function Label({
  children,
  htmlFor,
  size = '14',        // '12' | '13' | '14' | '15' | '16' (Figma size variant)
  color = 'default',  // 'default'(#0d0d0d) | 'gray'(#878787) — disabled가 우선
  required = false,   // 필수 표시(빨강 점) — Figma state=required
  disabled = false,   // 비활성 — Figma state=disabled
  className = '',
  ...props
}: LabelProps) {
  // 색은 label-field 시멘틱 토큰 경유(Figma label-field/* 변수와 1:1)
  const textColor = disabled
    ? 'text-label-field-disabled-text'
    : color === 'gray'
      ? 'text-label-field-gray-text'
      : 'text-label-field-default-text';

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
          className="h-spacing-4 w-spacing-4 shrink-0 rounded-round-00 bg-label-field-required-mark"
          aria-hidden="true"
        />
      )}
    </label>
  );
}
