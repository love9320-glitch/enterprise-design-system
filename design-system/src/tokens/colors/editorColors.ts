// 텍스트 에디터(Editor) 시멘틱 컬러 토큰
// 에디터 크롬(외곽선/툴바/구분선/활성 버튼/소스·코드 영역/링크)과
// 본문에서 사용자가 고를 수 있는 글자색·형광(highlight) 팔레트를 baseColors 경유로 정의한다.
//   - 크롬 색은 tailwind에 `editor` 그룹으로 노출되어 클래스(bg-editor-*, text-editor-* 등)로 사용.
//   - 팔레트(textPalette/highlightPalette)는 Tiptap color/highlight 명령에 값으로 전달된다.
//     (Tiptap이 style 속성에 색을 인라인으로 박으므로 값 자체가 토큰에서 나와야 규칙을 지킨다 —
//      Tooltip/ScrollArea/Table의 "토큰값 인라인" 예외와 동일.)

import { baseColors } from '../colors.js';
import { tableColors } from './tableColors.js';
import { fontIconColors } from '../fontIconColors.js';

const b = baseColors.base;

export const editorColors = {
  outline: tableColors['cell-line'], // #e3e3e3 — 에디터 외곽선(인라인 표 셀 구분선과 동일 색으로 연동)
  'toolbar-bg': b.gray[25], // #fafafa — 툴바 배경
  divider: b.gray[100], // #e3e3e3 — 툴바 그룹/모드 구분선
  'btn-active-bg': b.gray[100], // #e3e3e3 — 활성(toggle on) 버튼 배경
  'btn-active-fg': b.blue[400], // #0f85f2 — 활성 버튼 아이콘색
  link: b.blue[400], // #0f85f2 — 본문 링크색
  'code-bg': b.gray[100], // #e3e3e3 — 인라인 코드 배경
  'code-text': b.gray[900], // #0d0d0d — 인라인 코드 텍스트
  'block-bg': b.gray[25], // #fafafa — 코드블록/인용 배경
  'source-bg': b.gray[900], // #0d0d0d — HTML 소스 영역 배경(어두운 코드 톤)
  'source-text': b.white, // #ffffff — HTML 소스 텍스트
  placeholder: b.gray[300], // #878787 — 빈 본문 placeholder
};

// 글자색 팔레트 — 본문 텍스트에 적용할 수 있는 토큰 기반 색(자유 HEX 금지).
// swatch: 스와치(원) 표시색만 별도 지정(값은 null이라도 디폴트 글자색을 원 안에 보여줌).
export const editorTextPalette = [
  { label: '기본', value: null, swatch: fontIconColors[5] }, // null = 색 해제(unsetColor), 원은 디폴트 글자색(font-icon-5)
  { label: '회색', value: b.gray[300] }, // #878787
  { label: '빨강', value: b.red[400] }, // #e74a4a
  { label: '파랑', value: b.blue[400] }, // #0f85f2
];

// 형광(highlight) 팔레트 — 옅은 톤 배경 강조.
export const editorHighlightPalette = [
  { label: '없음', value: null }, // null = 형광 해제(unsetHighlight)
  { label: '회색', value: b.gray[100] }, // #e3e3e3
  { label: '빨강', value: b.red[100] }, // #fde1e1
  { label: '파랑', value: b.blue[100] }, // #e6f3fe
];
