// Page — 페이지 셸 (Figma "page" 9216:16009): page header + page body 슬롯 조립.
// 헤더는 Figma page 안 인스턴스와 동일한 padding='20' 스케일로 렌더하고,
// 바디는 p 20 / gap 20(spacing-8)의 세로 슬롯이다. 폭은 부모(레이아웃 Page Container)가
// 결정하므로 w-full — Figma의 1200은 standard 컨테이너 폭이며 여기서 고정하지 않는다.
// 바디 배경은 Figma에서 변수 미바인딩(캔버스 흰색 그대로)이라 별도 토큰 없이 투명으로 둔다.
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { PageHeader } from './PageHeader';

interface PageProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title'> {
  title?: ReactNode;              // PageHeader로 전달 — null/미지정이면 헤더 미표시
  description?: ReactNode;        // PageHeader 설명 행
  actions?: ReactNode;            // PageHeader 타이틀 우측 버튼 슬롯
  descriptionActions?: ReactNode; // PageHeader 설명 우측 버튼 슬롯
  header?: ReactNode;             // 커스텀 헤더로 통째 교체(지정 시 title 계열 무시)
}

export function Page({
  title,
  description,
  actions,
  descriptionActions,
  header,
  children,
  className = '',
  ...props
}: PageProps) {
  return (
    <div className={`flex w-full flex-col ${className}`} {...props}>
      {header !== undefined
        ? header
        : title != null && (
            <PageHeader
              padding="20"
              title={title}
              description={description}
              actions={actions}
              descriptionActions={descriptionActions}
            />
          )}
      {/* page body 슬롯 — FormTemplateA 등 템플릿/콘텐츠 조립 영역 */}
      <div className="flex w-full flex-col gap-spacing-8 p-spacing-8">{children}</div>
    </div>
  );
}
