// ListEmpty — 목록이 비었을 때 표시 (Figma option list / list empty)
// ListGroup에 List가 없을 때(검색 결과 없음 등) 대신 렌더한다.
// 색은 list-empty-text 시멘틱 토큰.

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
