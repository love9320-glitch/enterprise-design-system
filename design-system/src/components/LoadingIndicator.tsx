// LoadingIndicator — 로딩 정책(규칙 22)의 공용 표시: 스피너 + "불러오는 중…".
// 컨테이너(Page/Modal/RightPanel/PopoverMenu)의 '최초 로딩 = 바디 중앙 표시'가 이 컴포넌트를
// 쓰고, Table 로딩 행도 동일 구성(스피너 16 + text-14 font-icon-3)이라 시각이 통일된다.
// center=true(기본)면 부모가 준 영역에서 수직·수평 중앙 배치(py-spacing-12 최소 여백 포함),
// false면 인라인(스피너+문구만) — 커스텀 배치용.
import { LoaderCircle } from 'lucide-react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

interface LoadingIndicatorProps extends ComponentPropsWithoutRef<'div'> {
  message?: ReactNode; // 기본 "불러오는 중…" — 카피 통일(규칙 15), Table loadingMessage와 동일
  center?: boolean; // 기본 true — 부모 영역 중앙 배치 래퍼 포함
}

export function LoadingIndicator({
  message = '불러오는 중…',
  center = true,
  className = '',
  ...props
}: LoadingIndicatorProps) {
  const inline = (
    <div
      role="status" // 스크린리더가 로딩 상태로 인지
      className={`flex items-center justify-center gap-spacing-4 text-14 text-font-icon-3 ${center ? '' : className}`}
      {...(center ? undefined : props)}
    >
      <LoaderCircle size={16} strokeWidth={1.8} className="animate-spin" />
      {message}
    </div>
  );
  if (!center) return inline;
  return (
    <div
      className={`flex h-full w-full flex-1 items-center justify-center py-spacing-12 ${className}`}
      {...props}
    >
      {inline}
    </div>
  );
}
