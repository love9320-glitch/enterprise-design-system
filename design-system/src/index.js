// 패키지 코어 진입점 ('@company/design-system')
// 컴포넌트 + 디자인 토큰. 무거운 선택적 기능은 서브패스로 분리:
//   - 리치 텍스트 에디터: '@company/design-system/editor'   (peer: @tiptap/*)
//   - 마크다운 렌더러:   '@company/design-system/markdown' (peer: react-markdown, remark-gfm)
// 스타일: 반드시 '@company/design-system/styles.css' 를 앱에서 한 번 import 할 것.

export * from './components';
export * from './tokens';
