// Editor Code Connect 매핑(2026-08-02) — editor SET(7970:17846, mode=Edit/Html/View).
//   - mode: Edit→'edit'(WYSIWYG) / Html→'source'(HTML 코드) / View→'preview'(렌더 결과).
//   - Editor는 './editor' 서브패스 배포(Tiptap peer) — 스니펫 import 경로는 로컬 소스 기준.
// 발행: main 머지 시 자동(.github/workflows/figma-code-connect.yml)
// 파서 제약 — URL·props는 리터럴만(변수·스프레드·as const 금지).
import figma from '@figma/code-connect';
import { Editor } from './Editor';

figma.connect(
  Editor,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7970-17846',
  {
    props: {
      mode: figma.enum('mode', {
        Edit: 'edit',
        Html: 'source',
        View: 'preview',
      }),
    },
    example: ({ mode }) => (
      <Editor mode={mode} defaultValue="<p>안내문 내용을 입력하세요.</p>" onChange={() => {}} />
    ),
  },
);
