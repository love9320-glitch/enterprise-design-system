// EditorToolbar — Editor(편집 모드)의 서식 툴바.
// Tiptap editor 인스턴스를 받아 editor.chain() 명령으로 서식을 적용하고,
// editor.isActive(...)로 현재 커서 위치의 활성 상태를 버튼에 표시한다.
// toolbar prop(키 배열)으로 노출할 기능을 고를 수 있다(미지정 시 전체).
//   키: mergefield · block · bold · italic · underline · strike · color · highlight ·
//       bulletList · orderedList · blockquote · align · link · table · image · hr · code · codeBlock
//   mergefield: Editor의 mergeFields prop이 있을 때만 노출(머지 태그 삽입 드롭다운).
// 색·간격은 editor-*/font-icon-*/spacing-*/round-* 토큰만 사용. 재사용 컴포넌트(Popover/PopoverMenu/
// ListGroup/List/Button)를 그대로 활용한다. 링크·이미지 입력은 PopoverMenu의 input 타입(topArea="input"
// + footer footerButtonsFill)으로 대체했다.
import { Fragment, useState } from 'react';
import type { ElementType, MouseEvent as ReactMouseEvent } from 'react';
import type { Editor, ChainedCommands } from '@tiptap/react';
import {
  Undo2, Redo2,
  Bold, Italic, Underline, Strikethrough, Type, Baseline, Highlighter,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Link as LinkIcon, Table as TableIcon, Image as ImageIcon, Minus,
  Braces, Plus,
} from 'lucide-react';
import { Popover } from './Popover';
import { PopoverMenu } from './PopoverMenu';
import { ListGroup } from './ListGroup';
import { List } from './List';
import { Button } from './Button';
import { editorTextPalette, editorHighlightPalette } from '../tokens';

// 머지필드 목록 항목 — 문자열 또는 {label,value}
type MergeFieldItem = string | { label: string; value: string };

// 셀렉션 유지를 위해 mousedown 기본동작(포커스 이동)을 막는다 — 마크/색이 선택 영역에 적용되도록.
const keepSelection = (e: ReactMouseEvent) => e.preventDefault();

// 아이콘 토글 버튼 — 공용 Button(고스트 아이콘 버튼 size 24).
// active는 시각 표시 없이 aria-pressed(접근성)에만 반영한다(요청에 따라 색 변화 제거).
function ToolbarButton({
  icon,
  label,
  active = false,
  disabled = false,
  onClick,
}: {
  icon: ElementType;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <Button
      variant="ghost"
      size="24"
      icon={icon}
      disabled={disabled}
      onClick={onClick}
      onMouseDown={keepSelection}
      aria-label={label}
      aria-pressed={active}
    />
  );
}

// 드롭다운 트리거 — 공용 Button(ghost, size 24). Popover의 trigger로 사용.
// 라벨이 있으면(블록 '본문') 텍스트+아래 화살표, 없으면 아이콘 전용 버튼.
function DropTrigger({ icon, label, ariaLabel }: { icon: ElementType; label?: string; ariaLabel?: string }) {
  if (label) {
    return (
      <Button
        variant="ghost"
        size="24"
        leftIcon={icon}
        onMouseDown={keepSelection}
      >
        {label}
      </Button>
    );
  }
  return (
    <Button
      variant="ghost"
      size="24"
      icon={icon}
      onMouseDown={keepSelection}
      title={ariaLabel}
      aria-label={ariaLabel}
    />
  );
}

// 그룹 구분선 — 행 높이만큼 세로선(토큰 보더색).
function Divider() {
  return <span className="mx-spacing-2 self-stretch border-l border-editor-divider" />;
}

const BLOCK_OPTIONS = [
  { key: 'paragraph', label: '본문' },
  { key: 'h1', label: '제목 1' },
  { key: 'h2', label: '제목 2' },
  { key: 'h3', label: '제목 3' },
];

// 팔레트 색 항목 — value=null이면 해제(unset), swatch는 원 표시색만 별도 지정
interface PaletteColor {
  label: string;
  value: string | null;
  swatch?: string;
}

// 글자색/형광 색상 선택 패널 — 토큰 기반 팔레트 스와치.
function ColorPanel({
  palette,
  current,
  onPick,
}: {
  palette: PaletteColor[];
  current: string | null;
  onPick: (value: string | null) => void;
}) {
  return (
    <PopoverMenu width={80}>
      <div className="bg-list-group-bg py-spacing-4">
        {palette.map((c) => {
          const selected = current === c.value || (c.value === null && !current);
          const dot = c.swatch ?? c.value; // 원 표시색(값이 null이어도 swatch가 있으면 그 색을 보여줌)
          return (
            <button
              key={c.label}
              type="button"
              onMouseDown={keepSelection}
              onClick={() => onPick(c.value)}
              className={`flex w-full cursor-pointer items-center gap-spacing-4 px-spacing-6 py-spacing-3 text-14 transition-colors hover:bg-list-hover-bg focus:outline-none focus-visible:bg-list-hover-bg ${
                selected ? 'text-list-selected-text' : 'text-list-default-text'
              }`}
            >
              <span
                className="inline-block h-[14px] w-[14px] shrink-0 rounded-round-00"
                style={dot ? { backgroundColor: dot } : undefined}
              />
              {c.label}
            </button>
          );
        })}
      </div>
    </PopoverMenu>
  );
}

// URL 입력 팝오버 폼 — PopoverMenu input 타입(상단 입력 + fill 버튼) 공통 폼.
// 링크/이미지 등에서 재사용. onRemove가 있으면 좌측 '해제' 버튼이 함께 노출된다(없으면 단일 버튼).
function UrlInputForm({
  initialUrl = '',
  placeholder,
  submitLabel,
  onSubmit,
  onRemove,
  removeLabel = '해제',
}: {
  initialUrl?: string;
  placeholder?: string;
  submitLabel: string;
  onSubmit: (url: string) => void;
  onRemove?: () => void;
  removeLabel?: string;
}) {
  const [url, setUrl] = useState(initialUrl);
  const submit = () => onSubmit(url.trim());
  return (
    <PopoverMenu
      width={300}
      topArea="input"
      inputValue={url}
      onInputChange={(e) => setUrl(e.target.value)}
      inputPlaceholder={placeholder}
      inputProps={{
        autoFocus: true,
        onKeyDown: (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            submit();
          }
        },
      }}
      footer
      footerButtonsFill
      showCancel={!!onRemove}
      cancelText={removeLabel}
      onCancel={onRemove}
      confirmText={submitLabel}
      onConfirm={submit}
    />
  );
}

// 링크 입력 폼(URL 적용/해제).
function LinkForm({ editor, close }: { editor: Editor; close: () => void }) {
  const apply = (url: string) => {
    const chain = editor.chain().focus().extendMarkRange('link');
    if (url) chain.setLink({ href: url }).run();
    else chain.unsetLink().run();
    close();
  };
  const remove = () => {
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
    close();
  };
  return (
    <UrlInputForm
      initialUrl={editor.getAttributes('link').href ?? ''}
      placeholder="https://example.com"
      submitLabel="적용"
      onSubmit={apply}
      onRemove={remove}
    />
  );
}

// 이미지 URL 입력 폼(삽입 단일 버튼).
function ImageForm({ editor, close }: { editor: Editor; close: () => void }) {
  const insert = (url: string) => {
    if (url) editor.chain().focus().setImage({ src: url }).run();
    close();
  };
  return (
    <UrlInputForm placeholder="이미지 주소(URL)" submitLabel="삽입" onSubmit={insert} />
  );
}

// 머지필드 삽입 — search list 타입 PopoverMenu(width 180)에 머지 태그 목록(+ 아이콘).
// 클릭 시 커서 위치에 mergeField 노드(삭제 가능한 칩)를 삽입한다. mergeFields = 문자열 | {label,value}[].
function MergeFieldMenu({
  editor,
  mergeFields,
  close,
}: {
  editor: Editor;
  mergeFields: MergeFieldItem[];
  close: () => void;
}) {
  const [q, setQ] = useState('');
  const items = mergeFields
    .map((m) => (typeof m === 'string' ? { label: m, value: m } : m))
    .filter((m) => !q || m.label.toLowerCase().includes(q.toLowerCase()));
  const insert = (value: string) => {
    editor.chain().focus().insertContent({ type: 'mergeField', attrs: { value } }).run();
    close();
  };
  return (
    <PopoverMenu
      width={180}
      topArea="search"
      searchValue={q}
      onSearchChange={(e) => setQ(e.target.value)}
      searchPlaceholder="필드명 검색"
      searchInputProps={{ autoFocus: true }}
    >
      <ListGroup empty={items.length === 0} emptyMessage="검색 결과 없음">
        {items.map((m) => (
          <List key={m.value} icon={Plus} title={m.label} onClick={() => insert(m.value)} />
        ))}
      </ListGroup>
    </PopoverMenu>
  );
}

interface EditorToolbarProps {
  editor: Editor | null; // Tiptap editor 인스턴스(초기화 전 null)
  toolbar?: string[]; // 노출할 기능 키 배열(미지정 시 전체)
  mergeFields?: MergeFieldItem[]; // 머지필드 목록 — 있을 때만 mergefield 드롭다운 노출
}

export function EditorToolbar({ editor, toolbar, mergeFields = [] }: EditorToolbarProps) {
  if (!editor) return null;

  const show = (key: string) => !toolbar || toolbar.includes(key);
  const run = (fn: (chain: ChainedCommands) => ChainedCommands) => fn(editor.chain().focus()).run();

  const currentBlock = editor.isActive('heading', { level: 1 })
    ? 'h1'
    : editor.isActive('heading', { level: 2 })
      ? 'h2'
      : editor.isActive('heading', { level: 3 })
        ? 'h3'
        : 'paragraph';
  const setBlock = (key: string, close: () => void) => {
    if (key === 'paragraph') run((c) => c.setParagraph());
    else run((c) => c.toggleHeading({ level: Number(key[1]) as 1 | 2 | 3 }));
    close();
  };

  const currentColor: string | null = editor.getAttributes('textStyle').color ?? null;
  const currentHighlight: string | null = editor.getAttributes('highlight').color ?? null;
  const setColor = (value: string | null) =>
    value ? run((c) => c.setColor(value)) : run((c) => c.unsetColor());
  const setHighlight = (value: string | null) =>
    value ? run((c) => c.setHighlight({ color: value })) : run((c) => c.unsetHighlight());

  const tableActive = editor.isActive('table');

  // 그룹별 노출 컨트롤 — show()로 필터한 뒤, 비어있지 않은 그룹만 구분선으로 잇는다.
  const groups = [
    // 실행 취소 / 다시 실행 (맨 앞)
    [
      show('undo') && (
        <ToolbarButton key="undo" icon={Undo2} label="실행 취소" disabled={!editor.can().undo()} onClick={() => run((c) => c.undo())} />
      ),
      show('redo') && (
        <ToolbarButton key="redo" icon={Redo2} label="다시 실행" disabled={!editor.can().redo()} onClick={() => run((c) => c.redo())} />
      ),
    ],
    // 머지필드 — mergeFields가 있을 때만
    [
      show('mergefield') && mergeFields.length > 0 && (
        <Popover
          key="mergefield"
          placement="auto-left"
          menuWidth={180}
          trigger={<DropTrigger icon={Braces} label="머지필드" />}
        >
          {(close) => <MergeFieldMenu editor={editor} mergeFields={mergeFields} close={close} />}
        </Popover>
      ),
    ],
    // 블록 타입
    [
      show('block') && (
        <Popover
          key="block"
          placement="auto-left"
          menuWidth={80}
          trigger={
            <DropTrigger
              icon={Type}
              label={BLOCK_OPTIONS.find((b) => b.key === currentBlock)?.label}
            />
          }
        >
          {(close) => (
            <PopoverMenu width={80}>
              <ListGroup>
                {BLOCK_OPTIONS.map((b) => (
                  <List
                    key={b.key}
                    title={b.label}
                    selected={currentBlock === b.key}
                    onClick={() => setBlock(b.key, close)}
                  />
                ))}
              </ListGroup>
            </PopoverMenu>
          )}
        </Popover>
      ),
    ],
    // 강조
    [
      show('bold') && (
        <ToolbarButton key="bold" icon={Bold} label="굵게" active={editor.isActive('bold')} onClick={() => run((c) => c.toggleBold())} />
      ),
      show('italic') && (
        <ToolbarButton key="italic" icon={Italic} label="기울임" active={editor.isActive('italic')} onClick={() => run((c) => c.toggleItalic())} />
      ),
      show('underline') && (
        <ToolbarButton key="underline" icon={Underline} label="밑줄" active={editor.isActive('underline')} onClick={() => run((c) => c.toggleUnderline())} />
      ),
      show('strike') && (
        <ToolbarButton key="strike" icon={Strikethrough} label="취소선" active={editor.isActive('strike')} onClick={() => run((c) => c.toggleStrike())} />
      ),
    ],
    // 색
    [
      show('color') && (
        <Popover key="color" placement="auto-left" menuWidth={80} trigger={<DropTrigger icon={Baseline} ariaLabel="글자 색" />}>
          {() => <ColorPanel palette={editorTextPalette} current={currentColor} onPick={setColor} />}
        </Popover>
      ),
      show('highlight') && (
        <Popover key="highlight" placement="auto-left" menuWidth={80} trigger={<DropTrigger icon={Highlighter} ariaLabel="형광펜" />}>
          {() => <ColorPanel palette={editorHighlightPalette} current={currentHighlight} onPick={setHighlight} />}
        </Popover>
      ),
    ],
    // 정렬
    [
      show('align') && (
        <ToolbarButton key="al" icon={AlignLeft} label="왼쪽 정렬" active={editor.isActive({ textAlign: 'left' })} onClick={() => run((c) => c.setTextAlign('left'))} />
      ),
      show('align') && (
        <ToolbarButton key="ac" icon={AlignCenter} label="가운데 정렬" active={editor.isActive({ textAlign: 'center' })} onClick={() => run((c) => c.setTextAlign('center'))} />
      ),
      show('align') && (
        <ToolbarButton key="ar" icon={AlignRight} label="오른쪽 정렬" active={editor.isActive({ textAlign: 'right' })} onClick={() => run((c) => c.setTextAlign('right'))} />
      ),
      show('align') && (
        <ToolbarButton key="aj" icon={AlignJustify} label="양쪽 정렬" active={editor.isActive({ textAlign: 'justify' })} onClick={() => run((c) => c.setTextAlign('justify'))} />
      ),
    ],
    // 삽입
    [
      show('link') && (
        <Popover key="link" placement="auto-left" menuWidth={300} trigger={<DropTrigger icon={LinkIcon} ariaLabel="링크" />}>
          {(close) => <LinkForm editor={editor} close={close} />}
        </Popover>
      ),
      show('table') && (
        <Popover key="table" placement="auto-left" menuWidth={140} trigger={<DropTrigger icon={TableIcon} ariaLabel="표" />}>
          {(close) => (
            <PopoverMenu width={140}>
              <ListGroup>
                <List title="표 삽입 (3×3)" onClick={() => { run((c) => c.insertTable({ rows: 3, cols: 3, withHeaderRow: true })); close(); }} />
                <List title="위에 행 추가" disabled={!tableActive} onClick={() => { run((c) => c.addRowBefore()); close(); }} />
                <List title="아래에 행 추가" disabled={!tableActive} onClick={() => { run((c) => c.addRowAfter()); close(); }} />
                <List title="행 삭제" disabled={!tableActive} onClick={() => { run((c) => c.deleteRow()); close(); }} />
                <List title="왼쪽에 열 추가" disabled={!tableActive} onClick={() => { run((c) => c.addColumnBefore()); close(); }} />
                <List title="오른쪽에 열 추가" disabled={!tableActive} onClick={() => { run((c) => c.addColumnAfter()); close(); }} />
                <List title="열 삭제" disabled={!tableActive} onClick={() => { run((c) => c.deleteColumn()); close(); }} />
                <List title="표 삭제" disabled={!tableActive} onClick={() => { run((c) => c.deleteTable()); close(); }} />
              </ListGroup>
            </PopoverMenu>
          )}
        </Popover>
      ),
      show('image') && (
        <Popover key="image" placement="auto-left" menuWidth={300} trigger={<DropTrigger icon={ImageIcon} ariaLabel="이미지" />}>
          {(close) => <ImageForm editor={editor} close={close} />}
        </Popover>
      ),
      show('hr') && (
        <ToolbarButton key="hr" icon={Minus} label="구분선" onClick={() => run((c) => c.setHorizontalRule())} />
      ),
    ],
  ]
    .map((g) => g.filter(Boolean))
    .filter((g) => g.length);

  return (
    <div className="flex min-w-0 flex-1 flex-wrap items-center gap-spacing-2">
      {groups.map((g, i) => (
        <Fragment key={i}>
          {i > 0 && <Divider />}
          {g}
        </Fragment>
      ))}
    </div>
  );
}
