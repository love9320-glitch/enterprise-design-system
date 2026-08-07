// Page — 페이지 셸 (Figma "page" 9216:16009): page header + page body 슬롯 조립.
// 헤더는 PageHeader(패딩 20 스케일 고정)를 렌더하고,
// 바디는 p 20 / gap 20(spacing-8)의 세로 슬롯이다. 폭은 부모(레이아웃 Page Container)가
// 결정하므로 w-full — Figma의 1200은 standard 컨테이너 폭이며 여기서 고정하지 않는다.
// 바디 배경은 Figma에서 변수 미바인딩(캔버스 흰색 그대로)이라 별도 토큰 없이 투명으로 둔다.
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { PageHeader } from './PageHeader';

// 페이지 상단 여백 — 헤더(또는 바디) 위 패딩. 간격 토큰 경유(spacing-7/9/11), 기본 32(2026-08-07 지시).
// 'none'=여백 없음(pagePadding 표기 관례와 통일)
const PADDING_TOP_CLASS = {
  none: '',
  '16': 'pt-spacing-7',
  '24': 'pt-spacing-9',
  '32': 'pt-spacing-11',
};

interface PageProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title'> {
  title?: ReactNode;              // PageHeader로 전달 — null/미지정이면 헤더 미표시
  description?: ReactNode;        // PageHeader 설명 행
  actions?: ReactNode;            // PageHeader 타이틀 우측 버튼 슬롯
  descriptionActions?: ReactNode; // PageHeader 설명 우측 버튼 슬롯
  header?: ReactNode;             // 커스텀 헤더로 통째 교체(지정 시 title 계열 무시)
  stickyHeader?: boolean;         // 헤더 스크롤 시 상단 고정(PageHeader sticky 전달)
  paddingTop?: keyof typeof PADDING_TOP_CLASS; // 페이지 상단 여백 — 'none' | '16' | '24' | '32'(기본)
  // 페이지 최초 로딩(규칙 22) — 바디 슬롯 대신 중앙 로딩(스피너+불러오는 중…) 표시.
  // 페이지에 포함된 '모든' 데이터가 준비된 뒤 일괄 표시한다. 표시 이후 재조회는 Table loading 등 부분 로딩 담당.
  loading?: boolean;
  loadingMessage?: ReactNode; // 기본 "불러오는 중…"
}

export function Page({
  title,
  description,
  actions,
  descriptionActions,
  header,
  stickyHeader = false,
  paddingTop = '32',
  loading = false,
  loadingMessage,
  children,
  className = '',
  ...props
}: PageProps) {
  return (
    <div
      className={`flex w-full flex-col ${PADDING_TOP_CLASS[paddingTop] ?? PADDING_TOP_CLASS['32']} ${className}`}
      {...props}
    >
      {header !== undefined
        ? header
        : title != null && (
            <PageHeader
              sticky={stickyHeader}
              title={title}
              description={description}
              actions={actions}
              descriptionActions={descriptionActions}
            />
          )}
      {/* page body 슬롯 — FormTemplateA 등 템플릿/콘텐츠 조립 영역. loading이면 중앙 로딩으로 대체 */}
      {loading ? (
        <div className="flex w-full flex-1 flex-col p-spacing-8">
          <LoadingIndicator message={loadingMessage} className="py-spacing-13" />
        </div>
      ) : (
        <div className="flex w-full flex-col gap-spacing-8 p-spacing-8">{children}</div>
      )}
    </div>
  );
}
