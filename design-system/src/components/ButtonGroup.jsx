// ButtonGroup — 버튼들을 일정 간격으로 묶는 컨테이너
// 버튼과 버튼들을 가로/세로로 모아 일관된 간격(기본 8px = spacing-5)으로 배치한다.
// 간격은 등록된 spacing 토큰만 사용하도록 lookup으로 제한한다(임의값 금지).
// 규칙: 자식에 Select가 섞이면 Select를 버튼보다 앞(선두)에 배치한다.
import { Children, cloneElement, Fragment, isValidElement } from 'react';
import { Button } from './Button';
import { Select } from './Select';

// gap 토큰 키 → gap 클래스 (Tailwind purge 안전하게 정적 매핑)
const GAP_STYLE = {
  '3': 'gap-spacing-3', // 4px
  '4': 'gap-spacing-4', // 6px
  '5': 'gap-spacing-5', // 8px (기본)
  '6': 'gap-spacing-6', // 12px
  '7': 'gap-spacing-7', // 16px
};

// fragment·배열·조건부(`{x && <>…</>}`) children을 재귀적으로 평탄화해
// 실제 자식 요소(Button/Select 등)만 추려낸다. (toArray는 fragment를 펴지 않으므로 직접 처리)
function flattenChildren(children) {
  const out = [];
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === Fragment) {
      out.push(...flattenChildren(child.props.children));
    } else if (child != null && typeof child !== 'boolean') {
      out.push(child);
    }
  });
  return out;
}

const isSelect = (c) => isValidElement(c) && c.type === Select;

export function ButtonGroup({
  children,
  direction = 'horizontal', // 'horizontal' | 'vertical'
  gap = '5',                // 간격 토큰 키 — 기본 '5'(8px)
  width = 'hug',            // 'hug'(콘텐츠 폭) | 'fill'(부모 전체 폭 — 버튼들 균등 분할)
  className = '',
  ...props
}) {
  const dirStyle = direction === 'vertical' ? 'flex-col' : 'flex-row';
  const gapStyle = GAP_STYLE[gap] ?? GAP_STYLE['5'];
  const isFill = width === 'fill';

  // Select 자식을 버튼보다 앞으로 — 그 외 순서는 유지(안정 정렬).
  const items = flattenChildren(children);
  const selects = items.filter(isSelect);
  const others = items.filter((c) => !isSelect(c));
  const ordered = selects.length ? [...selects, ...others] : items;

  // fill이면 Button 자식을 width="fill"로 만들어 컨테이너 폭을 균등 분할(명시된 width는 존중).
  const rendered = isFill
    ? ordered.map((c) =>
        isValidElement(c) && c.type === Button
          ? cloneElement(c, { width: c.props.width ?? 'fill' })
          : c,
      )
    : ordered;

  return (
    <div
      className={`${isFill ? 'flex w-full' : 'inline-flex'} ${dirStyle} ${gapStyle} ${className}`}
      {...props}
    >
      {Children.toArray(rendered)}
    </div>
  );
}
