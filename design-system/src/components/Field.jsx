// Field — 라벨 + 컨트롤(Input/Select/DateField/TimeField/Picker 등)을 묶는 폼 행
//
// 컨트롤은 손으로 다시 짜지 않고 기존 DS 컴포넌트를 children으로 그대로 받는다(규칙 4 조립):
//   <Field label="이름" htmlFor="name" required>
//     <Input inputProps={{ id: 'name' }} />
//   </Field>
//
// 복합 필드(한 필드에 컨트롤 2개+ — 인풋+셀렉트·셀렉트2개·인풋+데이트픽커 등)는
// controlsDirection="row"로 컨트롤을 한 줄에 나란히(등분) 배치한다:
//   <Field label="기간" controlsDirection="row"><Select/><DateField/></Field>
//
// 역할 분담:
//  - Field 가 소유: 라벨(내부 Label 재사용)·필수표시·보조설명(description)·레이아웃(세로/가로)
//  - 에러 표시는 소유하지 않는다 — 기존 컨트롤의 error/errorMessage 툴팁을 그대로 사용한다
//    (Input/Select/DateField 등이 이미 하단 오버레이 툴팁을 갖고 있어 중복을 피한다).

import { Children } from 'react';
import { Label } from './Label';

// 라벨↔컨트롤 간격 — Tailwind JIT가 인식하도록 "완성 클래스"를 리터럴로 둔다(동적 조합 금지).
const GAP_CLASS = {
  'spacing-2': 'gap-spacing-2',
  'spacing-3': 'gap-spacing-3',
  'spacing-5': 'gap-spacing-5',
  'spacing-6': 'gap-spacing-6',
  'spacing-7': 'gap-spacing-7',
};
const DEFAULT_GAP = { vertical: 'spacing-3', horizontal: 'spacing-6' };

export function Field({
  label,                    // string | ReactNode — 주면 내부 Label 렌더
  htmlFor,                  // 컨트롤 id와 연결(라벨 클릭 시 포커스). 컨트롤에 같은 id 부여 필요
  required = false,
  disabled = false,         // 라벨 비활성 스타일(컨트롤 disabled는 컨트롤에 직접 전달)
  description,              // 보조 설명(helper) — 컨트롤 아래 회색 텍스트
  direction = 'vertical',   // 'vertical' | 'horizontal' (라벨↔컨트롤 배치)
  controlsDirection = 'column', // 'column' | 'row' — 컨트롤 여러 개일 때 배치(복합 필드, row=한 줄 등분)
  labelWidth,               // horizontal일 때 라벨 영역 너비(number=px | CSS 문자열)
  labelSize,                // Label size (12~16). 미지정 시 '14' (2026-07-06 세로도 12→14 통일)
  gap,                      // 라벨↔컨트롤 간격 토큰 키 override (예: 'spacing-5')
  className = '',
  children,                 // 컨트롤
  ...props
}) {
  const isHorizontal = direction === 'horizontal';
  const isRowControls = controlsDirection === 'row';
  // 라벨 기본 사이즈는 layout에 따라 다름(가로=14 / 세로=12), 명시 지정 시 그것 우선
  const resolvedLabelSize = labelSize ?? '14';
  const gapClass =
    GAP_CLASS[gap] || GAP_CLASS[DEFAULT_GAP[isHorizontal ? 'horizontal' : 'vertical']];

  const wrapper = isHorizontal
    ? `flex flex-row items-start ${gapClass}`
    : `flex flex-col ${gapClass}`;

  const labelWidthStyle =
    isHorizontal && labelWidth != null
      ? { width: typeof labelWidth === 'number' ? `${labelWidth}px` : labelWidth }
      : undefined;

  return (
    <div className={`${wrapper} ${className}`} {...props}>
      {label != null && (
        <div
          style={labelWidthStyle}
          className={isHorizontal ? 'shrink-0 pt-spacing-3' : undefined}
        >
          <Label htmlFor={htmlFor} size={resolvedLabelSize} required={required} disabled={disabled}>
            {label}
          </Label>
        </div>
      )}

      {/* 컨트롤 영역 — controls 컨테이너(가로 등분/세로 스택, 컨트롤 간 8px) + 그 아래 helper(4px).
          가로 레이아웃에선 남은 폭을 채운다 */}
      <div className={`flex min-w-0 flex-col gap-spacing-3 ${isHorizontal ? 'flex-1' : ''}`}>
        {isRowControls ? (
          // 복합 필드(row): 컨트롤을 한 줄에 등분(각 min-w-0 flex-1), 컨트롤 간 8px
          <div className="flex flex-row items-start gap-spacing-5">
            {Children.map(children, (c) => (
              <div className="min-w-0 flex-1">{c}</div>
            ))}
          </div>
        ) : (
          // column: 컨트롤 세로 스택, 컨트롤 간 8px(row와 동일)
          <div className="flex flex-col gap-spacing-5">{children}</div>
        )}
        {description != null && (
          <p className="text-12 text-label-field-helper-text">{description}</p>
        )}
      </div>
    </div>
  );
}
