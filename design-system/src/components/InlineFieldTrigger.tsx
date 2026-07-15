// InlineFieldTrigger — 박스 없는 인라인 텍스트형 트리거(리딩 아이콘? + 값 텍스트 + chevron).
// Select(variant="text")와 DatePicker 연.월 선택(DualSelectField)이 공유하는 "트리거 비주얼"이다.
// 클릭·키보드·포커스·위치계산 같은 상호작용은 사용처가 담당한다:
//   - Select: 이 컴포넌트에 role/tabIndex/onClick/onKeyDown/ref를 직접 spread
//   - DatePicker: Popover가 트리거를 감싸 클릭/anchor를 처리(여기엔 open만 전달)
// 따라서 이 컴포넌트는 순수 표현(색·크기·말줄임·hover 밑줄·열림 회색·chevron 회전)만 책임진다.
import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { TruncatingText } from './TruncatingText';

export const InlineFieldTrigger = forwardRef(function InlineFieldTrigger(
  {
    icon: Icon = null, // 좌측 리딩 아이콘(lucide 컴포넌트) — 없으면 미표시
    children, // 표시 텍스트(선택값/플레이스홀더)
    size = '24', // '24'(14px) | '20'(12px)
    open = false, // 펼침 상태 — 텍스트 회색 + chevron 180° 회전
    disabled = false,
    readOnly = false,
    interactive, // 상호작용 가능 여부(미지정 시 !disabled && !readOnly)
    maxWidth, // 텍스트 최대 폭(CSS 길이) — 넘으면 말줄임
    fill = false, // 부모 전체 폭 채움 — 텍스트 왼쪽·chevron 오른쪽 끝(justify-between). 기본 hug
    className = '',
    ...props
  }: any,
  ref,
) {
  const canInteract = interactive ?? (!disabled && !readOnly);

  // 텍스트 색: disabled=흐림 / 열림=회색 / 그 외(readOnly·placeholder·filled)=진함
  const textColor = disabled ? 'text-font-icon-2' : open ? 'text-font-icon-3' : 'text-font-icon-5';
  // 아이콘 색(리딩 아이콘·chevron 공통): disabled·readOnly=흐림 / 그 외=진함
  const iconColor = disabled || readOnly ? 'text-font-icon-2' : 'text-font-icon-5';

  // 글자/아이콘 크기 — size 토큰(24=14px / 20=12px), 아이콘은 16/14
  const sizeTextClass = size === '20' ? 'text-12' : 'text-14';
  const iconSize = size === '20' ? 14 : 16;

  return (
    <span
      ref={ref}
      className={`group min-w-0 select-none items-center gap-spacing-3 focus:outline-none ${
        fill ? 'flex w-full justify-between' : 'inline-flex'
      } ${canInteract ? 'cursor-pointer' : disabled ? 'cursor-not-allowed' : 'cursor-default'} ${className}`}
      {...props}
    >
      {Icon && <Icon size={iconSize} strokeWidth={1.8} className={`shrink-0 ${iconColor}`} />}
      <TruncatingText
        style={maxWidth ? { maxWidth } : undefined}
        className={`min-w-0 font-normal ${fill ? 'flex-1' : ''} ${sizeTextClass} ${textColor} ${
          canInteract ? 'group-hover:underline' : ''
        }`}
      >
        {children}
      </TruncatingText>
      <ChevronDown
        size={iconSize}
        strokeWidth={1.8}
        className={`pointer-events-none shrink-0 transition-transform ${iconColor} ${
          open ? 'rotate-180' : ''
        }`}
      />
    </span>
  );
});
