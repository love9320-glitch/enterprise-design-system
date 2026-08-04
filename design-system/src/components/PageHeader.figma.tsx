// PageHeader Code Connect 매핑(2026-08-04) — page header(9216:12647)
// boolean 3종: description(설명 행) / heading button(타이틀 우측 버튼) / description button(설명 우측 버튼)
// → 코드에선 description·actions·descriptionActions 전달 여부로 표현.
// 발행: main 머지 시 자동(.github/workflows/figma-code-connect.yml)
// 파서 제약 — URL·props는 리터럴만(변수·스프레드·as const 금지).
import figma from '@figma/code-connect';
import { PageHeader } from './PageHeader';
import { Button } from './Button';

figma.connect(
  PageHeader,
  'https://www.figma.com/design/h9jZFkEHfcHUGok1TZjjlP/?node-id=9216-12647',
  {
    props: {
      description: figma.boolean('description', {
        true: '고객사를 대신해, 그 고객사에 이미 등록된 발신 정보로 대량 안내를 일괄 발송합니다.',
        false: undefined,
      }),
      actions: figma.boolean('heading button', {
        true: (
          <>
            <Button variant="line">이전 단계</Button>
            <Button>다음 단계</Button>
          </>
        ),
        false: undefined,
      }),
      descriptionActions: figma.boolean('description button', {
        true: (
          <>
            <Button variant="line">이전 단계</Button>
            <Button>다음 단계</Button>
          </>
        ),
        false: undefined,
      }),
    },
    example: (props) => (
      <PageHeader
        title="페이지 타이틀"
        description={props.description}
        actions={props.actions}
        descriptionActions={props.descriptionActions}
      />
    ),
  },
);
