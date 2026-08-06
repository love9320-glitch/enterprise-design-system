// PageHeader — 페이지 상단 타이틀 영역 (Figma "page header" 9216:12647)
// 구성: 타이틀 행(타이틀 + 우측 버튼 슬롯) + 설명 행(설명 + 우측 버튼 슬롯) + 하단 Divider.
// Figma boolean(description / heading button / description button)은 코드에선
// description·actions·descriptionActions "전달 여부"로 표현한다(없으면 해당 요소 미표시).
// 패딩은 20 스케일(상 16/좌우 20/갭 16) 고정 — page(9216:16009) 내 인스턴스 규격으로 통일(2026-08-04 지시).
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Divider } from '../components/Divider';

interface PageHeaderProps extends Omit<ComponentPropsWithoutRef<'header'>, 'title'> {
  title: ReactNode;               // 페이지 타이틀(semibold 18)
  description?: ReactNode;        // 설명 행(regular 14, font-icon-3) — 없으면 행 미표시
  actions?: ReactNode;            // 타이틀 우측 버튼 슬롯(Figma heading button + button group)
  descriptionActions?: ReactNode; // 설명 우측 버튼 슬롯(Figma description button + button group)
  sticky?: boolean;               // 스크롤 시 상단 고정 — 가장 가까운 스크롤 컨테이너 기준(sticky top-0)
}

export function PageHeader({
  title,
  description,
  actions,
  descriptionActions,
  sticky = false,
  className = '',
  ...props
}: PageHeaderProps) {
  return (
    <header
      className={`flex w-full flex-col gap-spacing-7 bg-heading-bg px-spacing-8 pt-spacing-7 ${
        sticky ? 'sticky top-0 z-10' : ''
      } ${className}`}
      {...props}
    >
      <div className="flex w-full flex-col">
        {/* 타이틀 행 — 높이 32 고정, 우측 버튼 슬롯(Figma button group, gap 8) */}
        <div className="flex h-spacing-11 items-center gap-spacing-5-5">
          <h2 className="min-w-0 flex-1 text-18 font-semibold text-font-icon-5">{title}</h2>
          {actions != null && (
            <div className="flex shrink-0 items-center gap-spacing-5">{actions}</div>
          )}
        </div>
        {description != null && (
          <div className="flex h-spacing-11 items-center gap-spacing-5-5">
            <div className="min-w-0 flex-1 text-14 text-font-icon-3">{description}</div>
            {descriptionActions != null && (
              <div className="flex shrink-0 items-center gap-spacing-5">{descriptionActions}</div>
            )}
          </div>
        )}
      </div>
      <Divider />
    </header>
  );
}
