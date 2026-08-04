// Page Code Connect 매핑(2026-08-04) — page(9216:16009)
// PageHeader(내부 인스턴스, padding 20 스케일) + page body 슬롯(p 20/gap 20) 조립.
// body 슬롯에는 FormTemplateA/B·TableTemplate 등 템플릿을 조립한다.
// 발행: main 머지 시 자동(.github/workflows/figma-code-connect.yml)
// 파서 제약 — URL·props는 리터럴만(변수·스프레드·as const 금지).
import figma from '@figma/code-connect';
import { Page } from './Page';
import { Button } from './Button';

figma.connect(
  Page,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=9216-16009',
  {
    example: () => (
      <Page
        title="페이지 타이틀"
        description="고객사를 대신해, 그 고객사에 이미 등록된 발신 정보로 대량 안내를 일괄 발송합니다."
        actions={
          <>
            <Button variant="line">이전 단계</Button>
            <Button>다음 단계</Button>
          </>
        }
      >
        <div>page body — FormTemplateA/B·TableTemplate 등 템플릿 조립</div>
      </Page>
    ),
  },
);
