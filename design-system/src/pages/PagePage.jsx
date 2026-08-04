import { useState } from 'react';
import { Page } from '../components/Page';
import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/Button';
import { Checkbox } from '../components/Checkbox';
import { Select } from '../components/Select';
import { UsageExample } from '../components/UsageExample';

const USAGE = `import { Page, PageHeader } from '../components';

// Page — 페이지 셸: PageHeader + page body 슬롯(p 20 / gap 20).
// 폭은 레이아웃 Page Container(standard 1200 등)가 결정하므로 Page는 w-full.
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
  {/* page body — FormTemplateA/B, TableTemplate 등 템플릿을 조립 */}
</Page>

// PageHeader 단독 사용 — 단독 스케일은 padding '16'(상 12/좌우 16)
<PageHeader
  title="페이지 타이틀"
  description="설명 텍스트"
  actions={<Button>다음 단계</Button>}
/>`;

const USAGE_PROPS = [
  { name: 'Page · title/description', type: 'ReactNode', default: '—', desc: 'PageHeader로 전달 — title이 없으면 헤더 미표시. 헤더는 padding 20 스케일(Figma page 내 인스턴스와 동일)' },
  { name: 'Page · actions / descriptionActions', type: 'ReactNode', default: '—', desc: '헤더 타이틀/설명 우측 버튼 슬롯(Figma button group) — Button 등을 자유 조립' },
  { name: 'Page · header', type: 'ReactNode', default: '—', desc: '커스텀 헤더로 통째 교체(지정 시 title 계열 무시)' },
  { name: 'Page · children', type: 'ReactNode', default: '—', desc: 'page body 슬롯(p 20 / gap 20) — 템플릿·콘텐츠 조립 영역' },
  { name: 'PageHeader · title', type: 'ReactNode', default: '—', desc: '페이지 타이틀(semibold 18, font-icon-5), 행 높이 32' },
  { name: 'PageHeader · description', type: 'ReactNode', default: '—', desc: '설명 행(regular 14, font-icon-3) — 없으면 행 미표시 (Figma description boolean)' },
  { name: 'PageHeader · actions / descriptionActions', type: 'ReactNode', default: '—', desc: '타이틀/설명 우측 버튼 슬롯 (Figma heading button / description button boolean)' },
  { name: 'PageHeader · padding', type: "'16' | '20'", default: "'16'", desc: '패딩 스케일 — 단독 16(상 12), Page 내부 20(상 16). 하단 Divider 포함' },
];

export function PagePage() {
  // PageHeader 옵션 플레이그라운드 — Figma boolean 3종 + padding 스케일
  const [opts, setOpts] = useState({
    description: true,
    headingButton: true,
    descriptionButton: true,
  });
  const [padding, setPadding] = useState('16');
  const toggle = (k) => setOpts((s) => ({ ...s, [k]: !s[k] }));

  const buttons = (
    <>
      <Button variant="line">이전 단계</Button>
      <Button>다음 단계</Button>
    </>
  );

  return (
    <section className="py-spacing-10 text-left">
      <h2 className="mb-spacing-3 text-20 font-semibold text-font-icon-5">Page</h2>
      <p className="mb-spacing-8 text-14 text-font-icon-4">
        페이지 셸 컴포넌트입니다. <span className="text-font-icon-5">PageHeader</span>(타이틀·설명·버튼
        슬롯·하단 구분선)와 <span className="text-font-icon-5">page body 슬롯</span>(패딩 20)으로
        구성되며, 본문에는 FormTemplateA/B·TableTemplate 등 템플릿을 조립합니다. 폭은 레이아웃
        Page Container가 결정합니다.
      </p>

      <UsageExample
        code={USAGE}
        props={USAGE_PROPS}
        note="Figma boolean(description / heading button / description button)은 코드에서 해당 prop 전달 여부로 표현됩니다."
      />

      {/* PageHeader 옵션 플레이그라운드 */}
      <h3 className="mb-spacing-5 text-16 font-semibold text-font-icon-5">PageHeader 옵션</h3>
      <div className="mb-spacing-6 flex flex-wrap items-center gap-spacing-6">
        <Checkbox checked={opts.description} onChange={() => toggle('description')} label="설명 행" />
        <Checkbox checked={opts.headingButton} onChange={() => toggle('headingButton')} label="타이틀 버튼" />
        <Checkbox
          checked={opts.descriptionButton}
          onChange={() => toggle('descriptionButton')}
          label="설명 버튼"
        />
        <Select
          width={200}
          value={padding}
          onChange={(e) => setPadding(e.target.value)}
          options={[
            { value: '16', label: 'padding 16 (단독 기본)' },
            { value: '20', label: 'padding 20 (Page 내부)' },
          ]}
        />
      </div>
      <div className="mb-spacing-9 overflow-hidden rounded-round-4 border border-base-gray-100">
        <PageHeader
          title="페이지 타이틀"
          description={
            opts.description
              ? '고객사를 대신해, 그 고객사에 이미 등록된 발신 정보로 대량 안내를 일괄 발송합니다.'
              : undefined
          }
          actions={opts.headingButton ? buttons : undefined}
          descriptionActions={opts.descriptionButton ? buttons : undefined}
          padding={padding}
        />
      </div>

      {/* Page 전체 조립 예시 */}
      <h3 className="mb-spacing-5 text-16 font-semibold text-font-icon-5">Page 조립</h3>
      <div className="overflow-hidden rounded-round-4 border border-base-gray-100">
        <Page
          title="페이지 타이틀"
          description="고객사를 대신해, 그 고객사에 이미 등록된 발신 정보로 대량 안내를 일괄 발송합니다."
          actions={buttons}
        >
          <div className="flex min-h-[160px] items-center justify-center rounded-round-4 border border-dashed border-base-gray-200 text-14 text-font-icon-3">
            page body 슬롯 — FormTemplateA/B·TableTemplate 등 템플릿 조립 영역
          </div>
        </Page>
      </div>
    </section>
  );
}
