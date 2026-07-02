// MarkdownDoc — 규칙 .md 문서를 디자인 토큰 스타일로 렌더 (규칙 페이지 전용 뷰어)
// 단일 출처: 실제 규칙은 .claude/skills/design-system/*.md 이고, 페이지는 그 원문을 ?raw로 읽어 렌더한다.
// Tailwind typography 플러그인이 없으므로 요소별로 시멘틱 토큰 클래스를 직접 매핑한다.

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const md = {
  h1: ({ node, ...p }) => (
    <h1 className="mb-spacing-6 text-20 font-semibold text-font-icon-5" {...p} />
  ),
  h2: ({ node, ...p }) => (
    <h2
      className="mt-spacing-10 mb-spacing-6 border-t border-base-gray-100 pt-spacing-8 text-18 font-semibold text-font-icon-5"
      {...p}
    />
  ),
  h3: ({ node, ...p }) => (
    <h3 className="mt-spacing-8 mb-spacing-5 text-15 font-semibold text-font-icon-5" {...p} />
  ),
  h4: ({ node, ...p }) => (
    <h4 className="mt-spacing-7 mb-spacing-4 text-14 font-semibold text-font-icon-5" {...p} />
  ),
  p: ({ node, ...p }) => (
    <p className="mb-spacing-5 text-14 text-font-icon-4" {...p} />
  ),
  ul: ({ node, ...p }) => (
    <ul className="mb-spacing-5 list-disc space-y-spacing-2 pl-spacing-9 text-14 text-font-icon-4" {...p} />
  ),
  ol: ({ node, ...p }) => (
    <ol className="mb-spacing-5 list-decimal space-y-spacing-2 pl-spacing-9 text-14 text-font-icon-4" {...p} />
  ),
  li: ({ node, ...p }) => <li {...p} />,
  a: ({ node, ...p }) => (
    <a className="text-font-icon-5 underline underline-offset-2 hover:text-font-icon-4" {...p} />
  ),
  strong: ({ node, ...p }) => <strong className="font-semibold text-font-icon-5" {...p} />,
  em: ({ node, ...p }) => <em className="text-font-icon-4" {...p} />,
  blockquote: ({ node, ...p }) => (
    <blockquote
      className="mb-spacing-5 border-l-2 border-base-gray-200 bg-base-gray-25 px-spacing-6 py-spacing-4 text-13 text-font-icon-3"
      {...p}
    />
  ),
  hr: () => <hr className="my-spacing-8 border-t border-base-gray-100" />,
  code: ({ node, className, children, ...p }) => {
    const isBlock = /language-/.test(className || '');
    if (isBlock) {
      return (
        <code className={`font-mono text-12 ${className || ''}`} {...p}>
          {children}
        </code>
      );
    }
    return (
      <code
        className="rounded-round-3 bg-base-gray-100 px-spacing-2 py-spacing-1 font-mono text-12 text-font-icon-5"
        {...p}
      >
        {children}
      </code>
    );
  },
  pre: ({ node, ...p }) => (
    <pre
      className="mb-spacing-6 overflow-x-auto rounded-round-4 border border-base-gray-100 bg-base-gray-50 p-spacing-6 text-font-icon-5"
      {...p}
    />
  ),
  table: ({ node, ...p }) => (
    <div className="mb-spacing-6 overflow-x-auto">
      {/* 첫 열(세부 규칙/이름 등) 폭을 160px로 통일 — 나머지 열은 남는 폭을 나눔 */}
      <table
        className="w-full border-collapse text-13 [&_td:first-child]:w-[160px] [&_th:first-child]:w-[160px]"
        {...p}
      />
    </div>
  ),
  th: ({ node, ...p }) => (
    <th
      className="border border-base-gray-150 bg-base-gray-50 px-spacing-5 py-spacing-3 text-left font-semibold text-font-icon-5"
      {...p}
    />
  ),
  td: ({ node, ...p }) => (
    // overflow-wrap:anywhere — 공백 없는 긴 토큰(슬래시 구분 props·경로 등)도 쪼개 셀 폭이 넘치지 않게(테이블 가로 스크롤 방지)
    <td className="border border-base-gray-150 px-spacing-5 py-spacing-3 align-top text-font-icon-4 [overflow-wrap:anywhere]" {...p} />
  ),
};

export function MarkdownDoc({ source }) {
  // 선두 YAML 프론트매터(---\n...\n---) 제거 — 페이지엔 본문만 렌더한다
  // (안 지우면 ---가 구분선 2개로, name/description가 텍스트로 노출됨).
  const body = source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
  return (
    <article>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={md}>
        {body}
      </ReactMarkdown>
    </article>
  );
}
