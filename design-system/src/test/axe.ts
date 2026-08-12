// axe 접근성 검사 헬퍼 — vitest-axe의 커스텀 매처(toHaveNoViolations)는 타입 선언이
// Vitest 3와 안 맞아(구식 전역 Vi 네임스페이스), 매처 대신 violations 배열을 직접 단언한다.
// 실패 시 위반 규칙 id·대상·도움말이 그대로 출력돼 디버깅도 더 쉽다.
import { expect } from 'vitest';
import { axe } from 'vitest-axe';

export async function expectNoA11yViolations(target: Element | Document) {
  const el = target instanceof Document ? target.documentElement : target;
  const { violations } = await axe(el, {
    rules: {
      // 컴포넌트 단위 렌더에는 페이지 랜드마크(main 등)가 없다 — 페이지 수준 규칙 제외
      region: { enabled: false },
    },
  });
  const summary = violations.map((v) => ({
    rule: v.id,
    impact: v.impact,
    help: v.help,
    nodes: v.nodes.map((n) => n.html),
  }));
  expect(summary).toEqual([]);
}
