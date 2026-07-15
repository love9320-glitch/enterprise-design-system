// SelectGroup — 셀렉트들을 일정 간격으로 묶는 컨테이너 (간격 규칙은 ButtonGroup과 동일)
// 셀렉트들을 가로/세로로 모아 일관된 간격(기본 8px = spacing-5)으로 배치한다.
// 간격은 등록된 spacing 토큰만 사용하도록 lookup으로 제한한다(임의값 금지).
import { Children, cloneElement, Fragment, isValidElement } from 'react';
import { Select } from './Select';

// gap 토큰 키 → gap 클래스 (Tailwind purge 안전하게 정적 매핑 — ButtonGroup과 동일)
const GAP_STYLE = {
  '3': 'gap-spacing-3', // 4px
  '4': 'gap-spacing-4', // 6px
  '5': 'gap-spacing-5', // 8px (기본)
  '6': 'gap-spacing-6', // 12px
  '7': 'gap-spacing-7', // 16px
};

// fragment·배열·조건부(`{x && <>…</>}`) children을 재귀적으로 평탄화해
// 실제 자식 요소(Select 등)만 추려낸다. (toArray는 fragment를 펴지 않으므로 직접 처리)
function flattenChildren(children: any) {
  const out: any[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement<any>(child) && child.type === Fragment) {
      out.push(...flattenChildren(child.props.children));
    } else if (child != null && typeof child !== 'boolean') {
      out.push(child);
    }
  });
  return out;
}

export function SelectGroup({
  children,
  direction = 'horizontal', // 'horizontal' | 'vertical'
  gap = '5',                // 간격 토큰 키 — 기본 '5'(8px)
  width = 'hug',            // 'hug'(콘텐츠 폭) | 'fill'(부모 전체 폭 — 셀렉트들 균등 분할)
  className = '',
  ...props
}: any) {
  const dirStyle = direction === 'vertical' ? 'flex-col' : 'flex-row';
  const gapStyle = GAP_STYLE[gap] ?? GAP_STYLE['5'];
  const isFill = width === 'fill';

  // 최종 자식 배열 — 모든 요소에 안정 key를 직접 부여한다.
  // fill이면 각 자식을 flex-1 래퍼로 감싸 컨테이너 폭을 균등 분할하고,
  // Select 자식은 width="100%"로 복제해 래퍼를 채운다(명시된 width는 존중).
  const rendered = flattenChildren(children).map((c, i) => {
    if (!isValidElement<any>(c)) return c;
    const key = c.key ?? `sg-${i}`;
    if (!isFill) return cloneElement(c, { key });
    const el = c.type === Select ? cloneElement(c, { width: c.props.width ?? '100%' }) : c;
    return (
      <div key={key} className="min-w-0 flex-1">
        {el}
      </div>
    );
  });

  return (
    <div
      className={`${isFill ? 'flex w-full' : 'inline-flex'} ${dirStyle} ${gapStyle} ${className}`}
      {...props}
    >
      {rendered}
    </div>
  );
}
