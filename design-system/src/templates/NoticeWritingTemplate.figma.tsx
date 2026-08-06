// NoticeWritingTemplate Code Connect 매핑(2026-08-02) — Notice Writing Template SET(7977:31228).
//   - state(Site/Email/Sms) → defaultChannel('site'|'email'|'sms'). 채널 탭+제목/첨부+에디터 일체형.
// 발행: main 머지 시 자동(.github/workflows/figma-code-connect.yml)
// 파서 제약 — URL·props는 리터럴만(변수·스프레드·as const 금지).
import figma from '@figma/code-connect';
import { NoticeWritingTemplate } from './NoticeWritingTemplate';

figma.connect(
  NoticeWritingTemplate,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=7977-31228',
  {
    props: {
      defaultChannel: figma.enum('state', {
        Site: 'site',
        Email: 'email',
        Sms: 'sms',
      }),
    },
    example: ({ defaultChannel }) => (
      <NoticeWritingTemplate
        defaultChannel={defaultChannel}
        mergeFields={['지원자명', '공고명']}
        onChange={() => {}}
      />
    ),
  },
);
