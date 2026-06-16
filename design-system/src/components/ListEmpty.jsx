// ListEmpty — 목록이 비었을 때 표시 (Figma option list / list empty)
// ListGroup이 항목 0개(또는 empty)일 때 그룹 안에서 이 컴포넌트를 렌더한다(빈 상태 메시지).
// 단독으로도 쓸 수 있다. 색은 list-empty-text 시멘틱 토큰.

export function ListEmpty({ message = '검색 결과가 없습니다.', className = '', ...props }) {
  return (
    <div
      className={`flex w-full items-center justify-center bg-list-empty-bg px-spacing-6 py-spacing-9 text-14 text-list-empty-text ${className}`}
      {...props}
    >
      {message}
    </div>
  );
}
