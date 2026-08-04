// PageHeader — 페이지 상단 타이틀 영역 (Figma "page header" 9216:12647)
// 구성: 타이틀 행(타이틀 + 우측 버튼 슬롯) + 설명 행(설명 + 우측 버튼 슬롯) + 하단 Divider.
// Figma boolean(description / heading button / description button)은 코드에선
// description·actions·descriptionActions "전달 여부"로 표현한다(없으면 해당 요소 미표시).
// padding: Figma 단독 심볼은 상 12/좌우 16, page(9216:16009) 안 인스턴스는 상 16/좌우 20으로
// 오버라이드돼 있어 두 스케일을 prop으로 노출한다 — '16'(기본) | '20'(Page가 사용).
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Divider } from './Divider';

// 키 = 좌우 패딩(px). 상단 패딩·행간 갭은 스케일에 따라 12↔16으로 함께 움직인다.
const PADDING_STYLES = {
  '16': 'gap-spacing-6 px-spacing-7 pt-spacing-6',
  '20': 'gap-spacing-7 px-spacing-8 pt-spacing-7',
};

interface PageHeaderProps extends Omit<ComponentPropsWithoutRef<'header'>, 'title'> {
  title: ReactNode;               // 페이지 타이틀(semibold 18)
  description?: ReactNode;        // 설명 행(regular 14, font-icon-3) — 없으면 행 미표시
  actions?: ReactNode;            // 타이틀 우측 버튼 슬롯(Figma heading button + button group)
  descriptionActions?: ReactNode; // 설명 우측 버튼 슬롯(Figma description button + button group)
  padding?: keyof typeof PADDING_STYLES; // '16'(단독 기본) | '20'(Page 내부 스케일)
}

export function PageHeader({
  title,
  description,
  actions,
  descriptionActions,
  padding = '16',
  className = '',
  ...props
}: PageHeaderProps) {
  return (
    <header
      className={`flex w-full flex-col bg-heading-bg ${PADDING_STYLES[padding] ?? PADDING_STYLES['16']} ${className}`}
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
