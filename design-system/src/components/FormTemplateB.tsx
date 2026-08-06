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
//   - cellPaddingTop/cellPaddingBottom: 셀 위/아래 패딩 각각 12(기본)/20 — subtitle 로우 포함 공통(좌우는 20 고정)
//     · 셀별 paddingTop/paddingBottom이 공통값보다 우선(labelWidth와 같은 오버라이드 패턴)
//   - title: 폼 밖 상단 타이틀(Figma "TITLE" — text-15 semibold, 32px 행 + 박스와 6px 간격) — 지정 시에만 렌더
//   - subtitle: 폼 안 최상단 전체폭(span 12) 타이틀 로우(Figma "Sub title" — text-14 semibold) — 지정 시에만 렌더
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
  paddingTop?: '12' | '20'; // 이 셀의 위 패딩(공통 cellPaddingTop보다 우선)
  paddingBottom?: '12' | '20'; // 이 셀의 아래 패딩(공통 cellPaddingBottom보다 우선)
  disabled?: boolean; // 라벨 비활성 스타일(Field disabled 패스스루) — 컨트롤 disabled는 컨트롤에 직접(2026-08-06)
}

// 모서리 라운드 옵션(2026-08-05 지시) — 6(기본)/12/16/20px, 등록 라운드 토큰 경유
const ROUND_CLASS = {
  '6': 'rounded-round-4',
  '12': 'rounded-round-7',
  '16': 'rounded-round-8',
  '20': 'rounded-round-9',
};

// 셀 상/하 패딩 옵션(2026-08-05 지시) — 위·아래 각각 12(기본)/20px 선택, spacing 토큰 경유
// (subtitle 로우 포함 공통 적용, 좌우는 20 고정)
const CELL_PADDING_TOP_CLASS = {
  '12': 'pt-spacing-6',
  '20': 'pt-spacing-8',
};
const CELL_PADDING_BOTTOM_CLASS = {
  '12': 'pb-spacing-6',
  '20': 'pb-spacing-8',
};

// title을 ReactNode로 받기 위해 div 기본 title(문자열 툴팁) 속성은 제외한다
interface FormTemplateBProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title'> {
  cells?: FormTemplateBCell[];
  columns?: 1 | 2 | 3; // 셀 기본 폭(12/columns칸). 혼합은 셀별 span으로
  labelWidth?: number | string; // 라벨 영역 공통 너비 — 컨트롤 시작점 정렬용
  shadow?: boolean; // 박스 그림자(Figma 0 2px 5px 12%) — false면 외곽선을 inline 색으로 낮춤(2026-08-05 지시)
  round?: keyof typeof ROUND_CLASS; // 모서리 라운드 — '6'(기본) | '12' | '16' | '20'
  cellPaddingTop?: keyof typeof CELL_PADDING_TOP_CLASS; // 셀 위 패딩 — '12'(기본) | '20'
  cellPaddingBottom?: keyof typeof CELL_PADDING_BOTTOM_CLASS; // 셀 아래 패딩 — '12'(기본) | '20'
  title?: ReactNode; // 폼 밖 상단 타이틀 — 지정 시에만 렌더(2026-08-05 지시)
  subtitle?: ReactNode; // 폼 안 최상단 전체폭 타이틀 로우 — 지정 시에만 렌더(2026-08-05 지시)
}

export function FormTemplateB({
  cells = [],
  columns = 1,
  labelWidth,
  shadow = true,
  round = '6',
  cellPaddingTop = '12',
  cellPaddingBottom = '12',
  title,
  subtitle,
  className = '',
  ...props
}: FormTemplateBProps) {
  const cols = Math.min(Math.max(columns, 1), 3);
  const defaultSpan = 12 / cols; // 1→12 · 2→6 · 3→4
  const hasTitle = title != null;
  // 상/하 패딩 클래스 — 셀별 지정(paddingTop/paddingBottom)이 공통값보다 우선
  const padY = (top = cellPaddingTop, bottom = cellPaddingBottom) =>
    `${CELL_PADDING_TOP_CLASS[top] ?? CELL_PADDING_TOP_CLASS['12']} ${
      CELL_PADDING_BOTTOM_CLASS[bottom] ?? CELL_PADDING_BOTTOM_CLASS['12']
    }`;

  const box = (
    <div
      // 그리드 배경(inline 토큰)이 1px gap 사이로 비쳐 셀 구분 헤어라인이 된다(Figma 구조 그대로)
      // 외곽선: 그림자 있음=outline / 그림자 없음=inline(셀 구분선과 같은 색으로 존재감 축소)
      // title이 있으면 래퍼가 루트가 되므로 className/props는 래퍼로 보낸다
      className={`grid grid-cols-12 gap-spacing-1 overflow-clip ${ROUND_CLASS[round] ?? ROUND_CLASS['6']} border bg-job-posting-template-default-inline ${
        shadow
          ? 'border-job-posting-template-default-outline shadow-[0px_2px_5px_0px_rgba(0,0,0,0.12)]'
          : 'border-job-posting-template-default-inline'
      } ${hasTitle ? '' : className}`}
      {...(hasTitle ? undefined : props)}
    >
      {subtitle != null && (
        // 폼 안 최상단 타이틀 로우 — 전체 폭(span 12), 셀과 같은 패딩(좌우 20·상하 12)에 수직 중앙
        <div
          style={{ gridColumn: 'span 12 / span 12' }}
          className={`flex min-h-[56px] items-center bg-job-posting-template-default-bg px-spacing-8 ${padY()} text-14 font-semibold text-font-icon-5`}
        >
          {subtitle}
        </div>
      )}
      {cells.map((c) => {
        const span = Math.min(Math.max(c.span ?? defaultSpan, 1), 12);
        return (
          // span은 12칸 기준 — Tailwind purge를 피해 인라인 grid-column으로 지정(FormTemplateA와 동일)
          <div
            key={c.key}
            style={{ gridColumn: `span ${span} / span ${span}` }}
            className={`flex min-h-[56px] items-center gap-spacing-5 bg-job-posting-template-default-bg ${
              c.flush ? '' : `px-spacing-8 ${padY(c.paddingTop, c.paddingBottom)}` // 좌우 20 고정·상하는 공통값+셀별 오버라이드
            }`}
          >
            {c.label != null ? (
              <Field
                direction="horizontal"
                label={c.label}
                labelColor="gray"
                disabled={c.disabled}
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

  if (!hasTitle) return box;

  return (
    // 폼 밖 상단 타이틀 — 32px 행(수직 중앙) + 박스와 6px(spacing-4) 간격(Figma title 프레임 그대로)
    <div className={`flex flex-col gap-spacing-4 ${className}`} {...props}>
      <div className="flex min-h-[32px] items-center text-15 font-semibold text-font-icon-5">{title}</div>
      {box}
    </div>
  );
}
