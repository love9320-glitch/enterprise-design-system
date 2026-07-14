// ToolBar — 플로팅 액션 툴바 (Figma tool bar, node 8389:126993) — 공통 컴포넌트
// 체크박스 선택 등으로 나타나 선택 항목에 대한 액션(셀렉트·버튼)을 담는 얕은 바.
//  - 배경: 위(white)→아래(gray.50) 그라데이션 + gray-900 알파 50 라인(배경 투영) + 그림자
//  - 내용은 children 슬롯 — Select·Button(ghost) 등 DS 컴포넌트를 그대로 배치
//  - 항목 사이 구분선은 ToolBarDivider(16px 세로 strong 라인)
// 색은 toolbar-* 시멘틱 토큰만 사용. 표시/숨김·위치(absolute 등)는 사용처가 담당한다.
export function ToolBar({ children, className = '', ...props }) {
  return (
    <div
      role="toolbar"
      // 라인은 outline(바깥 얹기) — 알파 컬러라 border(안쪽)면 자기 그라데이션 배경과 합성돼 뒤 배경이 안 비친다
      className={`inline-flex items-center gap-spacing-4 rounded-round-5 outline outline-1 outline-toolbar-line bg-gradient-to-b from-toolbar-bg-top to-toolbar-bg-bottom p-spacing-5-5 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.12)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

// 툴바 항목 구분선 — 16px 세로 라인(divider strong 토큰)
export function ToolBarDivider() {
  return <span aria-hidden className="h-spacing-7 w-px shrink-0 bg-divider-strong" />;
}
