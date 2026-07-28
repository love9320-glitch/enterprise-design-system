// FormTemplateB — 테이블형 폼 템플릿 (Figma "form template type b" 8620:13367, column=1/2/3/mixed)
// FormTemplateA(여백 그리드형)와 달리, 12칸 그리드 셀들이 1px 헤어라인으로 나뉘는
// 외곽선+그림자 박스 안에 [회색 라벨 + 컨트롤] 셀을 배치한다(규칙 4 조립 — Field/Label 재사용).
//   - cells: [{ key, label?, required?, span?(1~12), control, trailing?, flush?, labelWidth? }]
//     · label: 회색 라벨(label-field/gray-text) — Field(direction=horizontal, labelColor=gray)로 배치
//     · trailing: 셀 오른쪽 끝 부가 요소(예: '마감일 없음' 체크박스)
//     · flush: 셀 패딩 제거 — Button area(영역 채움) 등 셀을 꽉 채우는 콘텐츠용
//   - columns: 1 | 2 | 3 — 셀 기본 폭(12/columns칸). 혼합 배치는 셀별 span(12칸 기준)으로 지정
//   - labelWidth: 라벨 영역 공통 너비(셀별 labelWidth가 우선) — 컨트롤 시작점 정렬용
//   - shadow: 박스 그림자 on/off
// 셀 컨트롤은 소비자가 주입한다 — 투명 계열(Input variant="transparent"·Select variant="text"·
// DateField variant="text" 등)을 쓰면 Figma 원본과 같은 표 형태가 된다.
// 색은 job-posting-template/* 시멘틱 토큰만 사용(default-bg/inline/outline).
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Field } from './Field';

// 폼 셀 한 항목
export interface FormTemplateBCell {
  key: string;
  label?: ReactNode; // 회색 라벨 — 없으면 컨트롤만(버튼 셀 등)
  required?: boolean;
  span?: number; // 1~12 (12칸 기준). 미지정 시 12/columns
  control?: ReactNode;
  trailing?: ReactNode; // 셀 오른쪽 끝 부가 요소('마감일 없음' 체크박스 등)
  flush?: boolean; // 셀 패딩 제거 — Button area 등 영역 채움 콘텐츠용
  labelWidth?: number | string; // 이 셀의 라벨 영역 너비(공통 labelWidth보다 우선)
}

interface FormTemplateBProps extends ComponentPropsWithoutRef<'div'> {
  cells?: FormTemplateBCell[];
  columns?: 1 | 2 | 3; // 셀 기본 폭(12/columns칸). 혼합은 셀별 span으로
  labelWidth?: number | string; // 라벨 영역 공통 너비 — 컨트롤 시작점 정렬용
  shadow?: boolean; // 박스 그림자(Figma 0 2px 5px 12%)
}

export function FormTemplateB({
  cells = [],
  columns = 1,
  labelWidth,
  shadow = true,
  className = '',
  ...props
}: FormTemplateBProps) {
  const cols = Math.min(Math.max(columns, 1), 3);
  const defaultSpan = 12 / cols; // 1→12 · 2→6 · 3→4

  return (
    <div
      // 그리드 배경(inline 토큰)이 1px gap 사이로 비쳐 셀 구분 헤어라인이 된다(Figma 구조 그대로)
      className={`grid grid-cols-12 gap-spacing-1 overflow-clip rounded-round-4 border border-job-posting-template-default-outline bg-job-posting-template-default-inline ${
        shadow ? 'shadow-[0px_2px_5px_0px_rgba(0,0,0,0.12)]' : ''
      } ${className}`}
      {...props}
    >
      {cells.map((c) => {
        const span = Math.min(Math.max(c.span ?? defaultSpan, 1), 12);
        return (
          // span은 12칸 기준 — Tailwind purge를 피해 인라인 grid-column으로 지정(FormTemplateA와 동일)
          <div
            key={c.key}
            style={{ gridColumn: `span ${span} / span ${span}` }}
            className={`flex min-h-[56px] items-center gap-spacing-5 bg-job-posting-template-default-bg ${
              c.flush ? '' : 'px-spacing-7 py-spacing-7' // 상하 12→16(2026-07-28 지시)
            }`}
          >
            {c.label != null ? (
              <Field
                direction="horizontal"
                label={c.label}
                labelColor="gray"
                required={c.required}
                labelWidth={c.labelWidth ?? labelWidth}
                className="min-w-0 flex-1"
              >
                {c.control}
              </Field>
            ) : (
              c.control
            )}
            {c.trailing != null && <span className="ml-auto flex shrink-0 items-center">{c.trailing}</span>}
          </div>
        );
      })}
    </div>
  );
}
