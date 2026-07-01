// MergeField — Tiptap 인라인 atom 노드. 머지필드({지원자명} 등)를 편집기 안에서
// 삭제 가능한 '칩'으로 렌더한다.
//
// NodeView는 plain DOM으로 구성한다(React 인라인-atom NodeView는 빈 렌더가 잦아 회피).
// 시각은 chip-* 시멘틱 토큰(DS Chip과 동일 클래스)으로 맞춘다 — 규칙 1(토큰 경유) 유지.
//
// 데이터 단위(HTML)에는 <span data-merge-field="{값}">{값}</span> 로 직렬화된다(renderHTML):
//   - 재오픈(setContent) 시 parseHTML이 이 span을 다시 mergeField 노드(칩)로 복원
//   - 안에 원문 {값} 텍스트가 남아 백엔드 머지 치환 로직도 그대로 동작
//   - preview 모드(raw span 렌더)는 index.css의 [data-merge-field] 규칙으로 칩 모양을 받는다
//   ※ NodeView의 DOM에는 data-merge-field를 두지 않는다(edit 모드에서 CSS 칩 스타일 이중 적용 방지 —
//     직렬화용 data 속성은 renderHTML이 담당).
// atom 이라 편집기 안에서 한 덩어리로 선택·백스페이스 삭제되고, 칩의 X 버튼으로도 삭제된다.
import { Node, mergeAttributes } from '@tiptap/core';

const CHIP_CLASS =
  'inline-flex items-center gap-spacing-3 rounded-round-4 border border-chip-default-line ' +
  'bg-chip-default-bg pl-spacing-5 pr-spacing-4 py-spacing-1 align-middle font-pretendard ' +
  'text-12 text-chip-default-text transition-colors hover:border-chip-hover-line hover:bg-chip-hover-bg';

// lucide X (size 12) — Chip의 삭제 아이콘과 동일 모양.
const X_SVG =
  '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
  'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';

export const MergeFieldNode = Node.create({
  name: 'mergeField',
  group: 'inline',
  inline: true,
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      value: {
        default: '',
        parseHTML: (el) => el.getAttribute('data-merge-field') || el.textContent || '',
        renderHTML: (attrs) => ({ 'data-merge-field': attrs.value }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'span[data-merge-field]' }];
  },

  // 직렬화(getHTML): <span data-merge-field="{값}">{값}</span> (원문 텍스트 포함)
  renderHTML({ HTMLAttributes, node }) {
    return ['span', mergeAttributes(HTMLAttributes), node.attrs.value];
  },

  addNodeView() {
    return ({ node, editor, getPos }) => {
      const dom = document.createElement('span');
      dom.className = CHIP_CLASS;
      dom.contentEditable = 'false';

      const label = document.createElement('span');
      label.className = 'whitespace-nowrap';
      label.textContent = node.attrs.value;
      dom.appendChild(label);

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'flex shrink-0 items-center justify-center text-chip-default-icon';
      btn.setAttribute('aria-label', '머지필드 삭제');
      btn.innerHTML = X_SVG;
      // mousedown 기본동작(포커스 이동/셀렉션 변경) 차단 후 click으로 노드 삭제.
      btn.addEventListener('mousedown', (e) => e.preventDefault());
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (typeof getPos !== 'function') return;
        const pos = getPos();
        if (pos == null) return;
        editor.chain().focus().deleteRange({ from: pos, to: pos + node.nodeSize }).run();
      });
      dom.appendChild(btn);

      return { dom };
    };
  },
});
