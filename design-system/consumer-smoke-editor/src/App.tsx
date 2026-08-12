// ./editor 서브패스 소비자 검증 — tiptap peer를 설치한 팀의 시나리오.
// Editor 계열이 메인이 아닌 editor 엔트리에서 정상 도착하는지(0.1.1 판례: NoticeWritingTemplate 이동).
import { Editor, NoticeWritingTemplate } from '@gusun/design-system/editor';
import { Button } from '@gusun/design-system';
import '@gusun/design-system/styles.css';

for (const [name, value] of Object.entries({ Editor, NoticeWritingTemplate, Button })) {
  if (value === undefined) throw new Error(`editor 서브패스 누락: ${name}`);
}

export function App() {
  return (
    <div>
      <Editor placeholder="내용을 입력하세요" onChange={() => {}} />
    </div>
  );
}
