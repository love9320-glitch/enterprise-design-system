// Editor — Tiptap(ProseMirror) 기반 리치 텍스트 에디터 (완전 옵션형)
// 이메일 템플릿·공고 상세·약관·문자/메일 본문 작성과, 개발자·운영자의 HTML 구조 확인을 함께 대응한다.
// 엔진(Tiptap)은 이 파일 내부에만 격리하고, 외부에는 value/onChange·mode·toolbar 등 엔진 독립 props만 노출한다.
//
//   - value / defaultValue / onChange(html): 데이터 단위는 HTML 문자열 하나. controlled(value) 또는 uncontrolled(defaultValue).
//   - mode / onModeChange: 'edit'(WYSIWYG) | 'source'(HTML 코드) | 'preview'(렌더 결과). controlled/내부 상태.
//   - toolbar: 노출할 서식 기능 키 배열(미지정 시 전체). EditorToolbar의 TOOLBAR_ITEMS 키 참고.
//   - readOnly: 편집 비활성(툴바 숨김, 본문 read-only). 소스/미리보기 모드 전환은 유지(HTML 확인용).
//   - allowSourceEdit: 소스 모드에서 HTML 직접 편집 허용(false면 읽기 전용 보기).
//   - placeholder / minHeight / maxHeight: 빈 본문 안내 · 본문 높이(maxHeight 시 ScrollArea 세로 스크롤).
//   - width: 'fill'(부모 전체 폭, 기본) | 숫자(px) | CSS 길이 문자열.
// 색·간격·보더는 editor-*/table-*/spacing-*/round-* 토큰만 사용(하드코딩 금지).
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { TextAlign } from '@tiptap/extension-text-align';
import { Image } from '@tiptap/extension-image';
import { Table, TableRow, TableHeader, TableCell } from '@tiptap/extension-table';
import { ScrollArea } from './ScrollArea';
import { EditorToolbar } from './EditorToolbar';
import { SegmentControlGroup } from './SegmentControl';

const MODE_TABS = [
  { value: 'edit', label: '편집' },
  { value: 'source', label: 'HTML' },
  { value: 'preview', label: '미리보기' },
];

// Tiptap 확장 구성 — StarterKit에 link/underline가 이미 포함되어 있어 별도 등록하지 않는다(중복 방지).
// Color는 TextStyle에 의존하므로 TextStyle을 먼저 둔다.
function buildExtensions() {
  return [
    StarterKit.configure({
      link: { openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer nofollow' } },
    }),
    TextStyle,
    Color,
    Highlight.configure({ multicolor: true }),
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Image,
    Table.configure({ resizable: false }),
    TableRow,
    TableHeader,
    TableCell,
  ];
}

// 모드 탭(편집/HTML/미리보기) — 공용 세그먼트 컨트롤(size 24).
// 읽기 전용이면 편집 탭을 빼고 HTML·미리보기만 노출한다.
function ModeTabs({ mode, onChange, readOnly }) {
  const items = readOnly ? MODE_TABS.filter((t) => t.value !== 'edit') : MODE_TABS;
  return (
    <SegmentControlGroup size="24" gap="4" value={mode} onChange={onChange} items={items} />
  );
}

export function Editor({
  value,
  defaultValue = '',
  onChange,
  mode: modeProp,
  onModeChange,
  toolbar,
  readOnly = false,
  placeholder = '내용을 입력하세요.',
  minHeight = 240,
  maxHeight,
  width = 'fill', // 'fill'(부모 전체 폭) | 숫자(px) | CSS 길이 문자열('480px','60%' 등)
  allowSourceEdit = true,
  className = '',
  ...props
}) {
  const valueControlled = value !== undefined;
  const modeControlled = modeProp !== undefined;
  // 읽기 전용이면 편집 모드가 없으므로 미리보기를 기본으로 한다.
  const [internalMode, setInternalMode] = useState(() => (readOnly ? 'preview' : 'edit'));
  const mode = modeControlled ? modeProp : internalMode;

  // 소스 모드에서 편집 중인 HTML 초안(편집 모드와 분리해 커서 튐 방지, 모드 이탈 시 에디터에 반영)
  const [sourceDraft, setSourceDraft] = useState('');
  const sourceRef = useRef(null);

  // onChange 최신값을 ref로 유지(editor 'update' 핸들러의 stale 클로저 방지)
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const editor = useEditor({
    editable: !readOnly,
    content: valueControlled ? value : defaultValue,
    extensions: buildExtensions(),
    // 첫 렌더에서 즉시 뷰를 만들지 않는다(effect에서 생성). React StrictMode가 dev에서
    // 마운트를 2번 돌릴 때 뷰가 파괴/재생성되며 throw하는 것을 막는다(Tiptap React 권장값).
    immediatelyRender: false,
  });

  // 본문 변경 → onChange(html) 방출
  useEffect(() => {
    if (!editor) return;
    const handler = () => onChangeRef.current?.(editor.getHTML());
    editor.on('update', handler);
    return () => editor.off('update', handler);
  }, [editor]);

  // readOnly 토글 반영
  useEffect(() => {
    editor?.setEditable(!readOnly);
  }, [editor, readOnly]);

  // 읽기 전용으로 바뀌면 편집 모드(탭이 사라짐)에 머물지 않고 미리보기로 이동(uncontrolled).
  useEffect(() => {
    if (readOnly && !modeControlled && internalMode === 'edit') {
      // readOnly 전환 시 편집 모드 → 미리보기로 1회 이동 — 의도된 effect 내 setState
      setInternalMode('preview'); // eslint-disable-line react-hooks/set-state-in-effect
    }
  }, [readOnly, modeControlled, internalMode]);

  // controlled value 외부 변경 동기화(편집 결과로 같은 값이 돌아오면 no-op)
  useEffect(() => {
    if (!editor || !valueControlled) return;
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [editor, value, valueControlled]);

  const changeMode = (next) => {
    if (next === mode) return;
    if (editor) {
      // 소스 모드를 떠날 때: 초안 HTML을 에디터에 반영하고 onChange 방출
      if (mode === 'source') {
        editor.commands.setContent(sourceDraft, { emitUpdate: false });
        onChangeRef.current?.(editor.getHTML());
      }
      // 소스 모드로 들어갈 때: 현재 에디터 HTML로 초안 시드
      if (next === 'source') {
        setSourceDraft(editor.getHTML());
      }
    }
    if (!modeControlled) setInternalMode(next);
    onModeChange?.(next);
  };

  const handleSourceChange = (e) => {
    const v = e.target.value;
    setSourceDraft(v);
    onChangeRef.current?.(v);
  };

  // 소스 textarea를 내용 높이에 맞춰 늘린다 — 자체(네이티브) 스크롤 대신 ScrollArea 오버레이 스크롤로 위임(규칙 6).
  useLayoutEffect(() => {
    if (mode !== 'source') return;
    const el = sourceRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [mode, sourceDraft]);

  const sourceEditable = allowSourceEdit && !readOnly;
  const previewHtml = editor ? editor.getHTML() : '';
  const bodyMinHeight = typeof minHeight === 'number' ? `${minHeight}px` : minHeight;
  const widthStyle = width === 'fill' ? '100%' : typeof width === 'number' ? `${width}px` : width;

  // 본문 영역 — maxHeight가 있으면 ScrollArea로 감싼다(세로 오버레이 스크롤바, 규칙 6).
  const wrapScroll = (node) =>
    maxHeight != null ? <ScrollArea maxHeight={maxHeight}>{node}</ScrollArea> : node;

  let body;
  if (mode === 'source') {
    body = (
      <textarea
        ref={sourceRef}
        value={sourceDraft}
        onChange={handleSourceChange}
        readOnly={!sourceEditable}
        spellCheck={false}
        className="block w-full resize-none overflow-hidden bg-editor-source-bg px-spacing-7 py-spacing-6 font-mono text-13 text-editor-source-text outline-none"
        style={{ minHeight: bodyMinHeight }}
      />
    );
    // 소스 영역은 어두운 배경이라 흰색(light) 스크롤바 변형을 쓴다.
    body = maxHeight != null ? <ScrollArea maxHeight={maxHeight} variant="light">{body}</ScrollArea> : body;
  } else if (mode === 'preview') {
    body = wrapScroll(
      <div
        className="tiptap-prose px-spacing-7 py-spacing-6"
        style={{ minHeight: bodyMinHeight }}
        dangerouslySetInnerHTML={{ __html: previewHtml }}
      />,
    );
  } else {
    // edit
    body = wrapScroll(
      <div className="relative tiptap-prose px-spacing-7 py-spacing-6" style={{ minHeight: bodyMinHeight }}>
        {editor?.isEmpty && (
          <p className="pointer-events-none absolute left-spacing-7 top-spacing-6 text-14 text-editor-placeholder">
            {placeholder}
          </p>
        )}
        <EditorContent editor={editor} />
      </div>,
    );
  }

  return (
    <div className={`overflow-hidden rounded-round-4 border border-editor-outline bg-white ${className}`} style={{ width: widthStyle }} {...props}>
      {/* 헤더: (편집 모드·편집 가능 시) 서식 툴바 + 모드 탭 */}
      <div className="border-b border-editor-divider bg-editor-toolbar-bg">
        <div className="flex items-center justify-between gap-spacing-5 px-spacing-5 py-spacing-3">
          {mode === 'edit' && !readOnly ? (
            <EditorToolbar editor={editor} toolbar={toolbar} />
          ) : (
            <span className="text-12 text-font-icon-5">
              {mode === 'source' ? 'HTML 소스' : mode === 'preview' ? '미리보기' : ''}
            </span>
          )}
          <div className="shrink-0">
            <ModeTabs mode={mode} onChange={changeMode} readOnly={readOnly} />
          </div>
        </div>
      </div>

      {body}
    </div>
  );
}
