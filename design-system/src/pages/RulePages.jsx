// 규칙 페이지 — 규칙서(.md) 원문을 그대로 렌더하는 뷰어 페이지들.
// 단일 출처: .claude/skills/design-system/*.md (Vite ?raw import, vite.config의 server.fs.allow=['..'])
// 규칙을 수정하면 .md만 고치면 되고 이 페이지는 자동 반영된다(이중 관리 없음).

import { MarkdownDoc } from '../components/MarkdownDoc';

import skillMd from '../../../.claude/skills/design-system/SKILL.md?raw';
import foundationMd from '../../../.claude/skills/design-system/foundation.md?raw';
import componentsMd from '../../../.claude/skills/design-system/components.md?raw';
import tplModalMd from '../../../.claude/skills/design-system/templates/modal.md?raw';
import tplListMd from '../../../.claude/skills/design-system/templates/list-page.md?raw';
import tplDetailMd from '../../../.claude/skills/design-system/templates/detail-page.md?raw';
import tplFormMd from '../../../.claude/skills/design-system/templates/form-page.md?raw';
import ruleUsageMd from '../../../.claude/skills/design-system/rule-usage.md?raw';

const templatesMd = [tplModalMd, tplListMd, tplDetailMd, tplFormMd].join('\n\n');

function DocPage({ source }) {
  return (
    <section className="mx-auto max-w-5xl px-spacing-7 py-spacing-10 text-left">
      <MarkdownDoc source={source} />
    </section>
  );
}

export function RuleOverviewPage() {
  return <DocPage source={skillMd} />;
}

export function RuleFoundationPage() {
  return <DocPage source={foundationMd} />;
}

export function RuleComponentsPage() {
  return <DocPage source={componentsMd} />;
}

export function RuleTemplatesPage() {
  return <DocPage source={templatesMd} />;
}

export function RuleUsagePage() {
  return <DocPage source={ruleUsageMd} />;
}
