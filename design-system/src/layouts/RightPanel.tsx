// RightPanel — 라이트 패널 (Figma Right Panel SET 8985:21064, width size=360/480/Fullscreen)
// 보조 작업 영역(Secondary Workspace)의 표준 콘텐츠 구조: 헤더(타이틀+닫기) / 바디(자유 슬롯,
// 내부 스크롤) / 푸터(자유 슬롯) 3단이 1px 갭(spacing-1)으로 나뉘고, 갭 사이로 헤어라인
// (right-panel/line, gray 100)이 비친다 — GNB 그룹 구분과 같은 원리.
//   - header/footer는 토글·슬롯(Figma top/bottom/close button 불리언 대응): title=null이면 헤더 미표시,
//     footer=null이면 푸터 미표시, onClose가 있으면 헤더 우측에 닫기(X) 고스트 버튼.
//   - width: '360'(기본) | '480'(상세 작업 밀도) | 'fill'(Figma Fullscreen — 부모 폭 채움).
//     AppLayout rightPanel 슬롯에서는 'fill'로 두고 폭은 AppLayout rightPanelWidth가 결정한다.
//   - 바디는 ScrollArea 내부 스크롤(규칙 9) — 루트가 h-full이므로 부모가 높이를 제공해야 한다.
// 색은 right-panel-* 시멘틱 토큰(Figma 변수 1:1), 닫기 버튼은 DS Button(ghost icon).
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { X } from 'lucide-react';
import { Button } from '../components/Button';
import { ScrollArea } from '../components/ScrollArea';

// 폭 3단 — Figma width size 변형(Fullscreen=fill)
const WIDTH_STYLE = {
  '360': 'w-[360px]',
  '480': 'w-[480px]',
  fill: 'w-full',
};

interface RightPanelProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title'> {
  title?: ReactNode; // 헤더 타이틀(semibold 15) — null이면 헤더 영역 미표시(Figma top=false)
  onClose?: () => void; // 닫기(X) 고스트 버튼 — 미지정 시 버튼 미표시(Figma close button=false)
  children?: ReactNode; // 바디 슬롯 — 내부 스크롤(ScrollArea)
  footer?: ReactNode; // 푸터 슬롯 — null이면 푸터 영역 미표시(Figma bottom=false). 좌우 배치는 슬롯 안에서 자유
  width?: keyof typeof WIDTH_STYLE; // '360'(기본) | '480' | 'fill'(Fullscreen — 부모 폭 채움)
  bodyPadding?: boolean; // 바디 기본 패딩(p-spacing-7) — 기본 false(Figma 바디는 무패딩 슬롯)
}

export function RightPanel({
  title = null, // null이면 헤더 미표시
  onClose,
  children,
  footer = null, // null이면 푸터 미표시
  width = '360', // '360' | '480' | 'fill'
  bodyPadding = false, // 바디 기본 패딩(p-spacing-7)
  className = '',
  ...props
}: RightPanelProps) {
  return (
    <div
      className={`flex h-full flex-col gap-spacing-1 bg-right-panel-line ${
        WIDTH_STYLE[width] ?? WIDTH_STYLE['360']
      } ${className}`}
      {...props}
    >
      {title != null && (
        <header className="flex min-h-[56px] w-full shrink-0 items-center justify-between bg-right-panel-bg py-spacing-6 pl-spacing-7 pr-spacing-6">
          <div className="min-w-0 text-15 font-semibold text-right-panel-title-text">{title}</div>
          {onClose && <Button variant="ghost" icon={X} aria-label="패널 닫기" onClick={onClose} />}
        </header>
      )}
      <div className="min-h-0 w-full flex-1 bg-right-panel-bg">
        <ScrollArea maxHeight="100%" style={{ height: '100%' }}>
          {bodyPadding ? <div className="p-spacing-7">{children}</div> : children}
        </ScrollArea>
      </div>
      {footer != null && (
        <footer className="flex w-full shrink-0 items-center bg-right-panel-bg py-spacing-6 pl-spacing-7 pr-spacing-6">
          {footer}
        </footer>
      )}
    </div>
  );
}
