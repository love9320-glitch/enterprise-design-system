// ListGroup — List 묶음 (Figma option list / list group)
// 상하 패딩(py-spacing-4) 안에서 List들을 세로로 쌓고, 개수가 maxVisible(기본 6)을
// 넘으면 내부 스크롤한다. 스크롤바는 공용 ScrollArea(커스텀 오버레이 스크롤바)를 사용.
// 항목이 없으면(자식 0개 또는 empty=true) 같은 컨테이너 안(스크롤 영역 내부)에
// ListEmpty를 렌더해, 빈 상태도 그룹의 패딩·배경을 그대로 따른다.
import { Children } from 'react';
import { ScrollArea } from './ScrollArea';
import { ListEmpty } from './ListEmpty';

const ITEM_HEIGHT = 32;  // List 한 행의 표시 높이(px) — min-h-32
const PADDING_Y = 6;     // 상하 패딩(px) — spacing-4

export function ListGroup({ children, maxVisible = 6, empty = false, emptyMessage, className = '', ...props }) {
  const maxHeight = maxVisible * ITEM_HEIGHT + PADDING_Y * 2;
  const isEmpty = empty || Children.count(children) === 0;

  return (
    <div className={`w-full bg-list-group-bg ${className}`} {...props}>
      {/* 상하 패딩을 스크롤 영역 안(contentClassName)에 두어, 스크롤 시 패딩까지 함께 움직인다 */}
      <ScrollArea maxHeight={maxHeight} contentClassName="py-spacing-4">
        {isEmpty ? <ListEmpty message={emptyMessage} /> : children}
      </ScrollArea>
    </div>
  );
}
