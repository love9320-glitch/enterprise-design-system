// Gnb — 글로벌 내비게이션 바 (Figma GNB 8932:15601, 2026-07-31 그룹 구조 개정)
// GnbGroup(흰 배경 영역)들의 조립형 구조 — 그룹 사이는 1px 갭(spacing-1)으로 배경(gnb/inline,
// gray 50)이 비쳐 구분되고, 사용자는 필요에 따라 그룹을 자유롭게 추가/삭제한다.
// 구분선(Divider)은 그룹 '안'에서 사용한다(예: <Divider direction="vertical" className="h-[16px] my-auto" />).
//   - Gnb bar=false(기본): 그룹 행만(h/w 100%) — AppLayout gnb 슬롯에 꽂는 용도.
//   - Gnb bar=true: 자체 바 크롬(높이 54px + 하단 구분선 1px = 점유 55) — 단독 배치용.
//   - GnbGroup: 흰 배경(h-full)·좌우 패딩 spacing-7(16px)·내부 갭 spacing-6(12px, gap 옵션).
//     fill이면 남는 폭을 채우고(justify로 내부 정렬 제어), 기본은 콘텐츠 폭(hug).
//   - GnbLogo: 로고 텍스트 스타일 헬퍼(semibold 20, Figma 스펙) — ReactNode 로고는 그대로 배치.
// 색은 layout-* 시멘틱 토큰(Figma gnb/* 변수 1:1), 구분선은 DS Divider.
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Divider } from '../components/Divider';

// 그룹 내부 간격 — ButtonGroup과 동일한 간격 토큰 키 규칙(기본 '6'=12px, Figma)
const GAP_STYLE = {
  '4': 'gap-spacing-4',
  '5': 'gap-spacing-5',
  '6': 'gap-spacing-6',
  '7': 'gap-spacing-7',
};

// 그룹 내부 정렬 — fill 그룹에서 양끝 배치(between) 등 제어
const JUSTIFY_STYLE = {
  start: 'justify-start',
  between: 'justify-between',
  end: 'justify-end',
  center: 'justify-center',
};

interface GnbProps extends ComponentPropsWithoutRef<'div'> {
  children?: ReactNode; // GnbGroup들 — 필요에 따라 자유롭게 추가/삭제(그룹 사이 1px 갭 자동)
  bar?: boolean; // true면 자체 바 크롬(높이 54px+하단 구분선 1px=점유 55) — 단독 배치용. 기본 false(AppLayout 슬롯용)
}

export function Gnb({ children, bar = false, className = '', ...props }: GnbProps) {
  // 그룹 행 — 그룹 사이 1px 갭으로 gnb-inline 배경이 비쳐 구분선 역할(Figma gap=spacing-1)
  const row = (
    <div
      className={`flex h-full w-full items-stretch gap-spacing-1 bg-layout-gnb-inline ${bar ? '' : className}`}
      {...(bar ? {} : props)}
    >
      {children}
    </div>
  );

  if (!bar) return row;
  return (
    <div className={`flex w-full flex-col ${className}`} {...props}>
      <div className="h-[54px]">{row}</div>
      <Divider />
    </div>
  );
}

interface GnbGroupProps extends ComponentPropsWithoutRef<'div'> {
  children?: ReactNode; // 그룹 안 콘텐츠 — 원하는 컴포넌트를 자유 조립(구분선도 그룹 안에서 사용)
  fill?: boolean; // true면 남는 폭 채움(flex-1) — 기본 콘텐츠 폭(hug)
  justify?: keyof typeof JUSTIFY_STYLE; // 내부 정렬 — 'start'(기본) | 'between' | 'end' | 'center'
  gap?: keyof typeof GAP_STYLE; // 내부 간격 토큰 키 — '4'(6px)|'5'(8px)|'6'(12px, 기본)|'7'(16px)
}

export function GnbGroup({
  children,
  fill = false, // 남는 폭 채움(flex-1)
  justify = 'start', // 내부 정렬
  gap = '6', // 내부 간격(12px, Figma)
  className = '',
  ...props
}: GnbGroupProps) {
  return (
    <div
      className={`flex h-full items-center bg-layout-gnb-bg px-spacing-7 ${
        fill ? 'min-w-0 flex-1' : 'shrink-0'
      } ${JUSTIFY_STYLE[justify] ?? JUSTIFY_STYLE.start} ${GAP_STYLE[gap] ?? GAP_STYLE['6']} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

// 로고 텍스트 스타일 헬퍼 — 문자열 로고를 Figma 스펙(semibold 20)으로 표기
export function GnbLogo({ children, className = '', ...props }: ComponentPropsWithoutRef<'span'>) {
  return (
    <span className={`text-20 font-semibold text-font-icon-5 ${className}`} {...props}>
      {children}
    </span>
  );
}
