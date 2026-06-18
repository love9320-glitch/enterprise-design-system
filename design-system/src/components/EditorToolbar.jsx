// EditorToolbar — Editor(편집 모드)의 서식 툴바.
// Tiptap editor 인스턴스를 받아 editor.chain() 명령으로 서식을 적용하고,
// editor.isActive(...)로 현재 커서 위치의 활성 상태를 버튼에 표시한다.
// toolbar prop(키 배열)으로 노출할 기능을 고를 수 있다(미지정 시 전체).
//   키: block · bold · italic · underline · strike · color · highlight ·
//       bulletList · orderedList · blockquote · align · link · table · image · hr · code · codeBlock
// 색·간격은 editor-*/font-icon-*/spacing-*/round-* 토큰만 사용. 재사용 컴포넌트(Popover/PopoverMenu/
// ListGroup/List/Input/Button/ButtonGroup)를 그대로 활용한다.
import { Fragment, useState } from 'react';
import {
  Undo2, Redo2,
  Bold, Italic, Underline, Strikethrough, Type, Baseline, Highlighter,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Link as LinkIcon, Table as TableIcon, Image as ImageIcon, Minus,
} from 'lucide-react';
import { Popover } from './Popover';
import { PopoverMenu } from './PopoverMenu';
import { ListGroup } from './ListGroup';
import { List } from './List';
import { Input } from './Input';
import { Button } from './Button';
import { ButtonGroup } from './ButtonGroup';
import { editorTextPalette, editorHighlightPalette } from '../tokens';

// 셀렉션 유지를 위해 mousedown 기본동작(포커스 이동)을 막는다 — 마크/색이 선택 영역에 적용되도록.
const keepSelection = (e) => e.preventDefault();

// 아이콘 토글 버튼 — 공용 Button(고스트 아이콘 버튼 size 24).
// active는 시각 표시 없이 aria-pressed(접근성)에만 반영한다(요청에 따라 색 변화 제거).
function ToolbarButton({ icon, label, active = false, disabled = false, onClick }) {
  return (
    <Button
      variant="ghost"
      size="24"
      icon={icon}
      disabled={disabled}
      onClick={onClick}
      onMouseDown={keepSelection}
      title={label}
      aria-label={label}
      aria-pressed={active}
    />
  );
}

// 드롭다운 트리거 — 공용 Button(ghost, size 24). Popover의 trigger로 사용.
// 라벨이 있으면(블록 '본문') 텍스트+아래 화살표, 없으면 아이콘 전용 버튼.
function DropTrigger({ icon, label, ariaLabel }) {
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

// 글자색/형광 색상 선택 패널 — 토큰 기반 팔레트 스와치.
function ColorPanel({ palette, current, onPick }) {
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
              className={`flex w-full cursor-pointer items-center gap-spacing-4 px-spacing-6 py-spacing-3 text-14 transition-colors hover:bg-list-hover-bg ${
                selected ? 'text-list-select-text' : 'text-list-default-text'
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

// 링크 입력 폼(URL 적용/해제).
function LinkForm({ editor, close }) {
  const [url, setUrl] = useState(editor.getAttributes('link').href ?? '');
  const apply = () => {
    const chain = editor.chain().focus().extendMarkRange('link');
    if (url.trim()) chain.setLink({ href: url.trim() }).run();
    else chain.unsetLink().run();
    close();
  };
  const remove = () => {
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
    close();
  };
  return (
    <PopoverMenu width={300}>
      <div className="flex flex-col gap-spacing-4 bg-list-group-bg p-spacing-5">
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          width="100%"
          inputProps={{
            autoFocus: true,
            onKeyDown: (e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                apply();
              }
            },
          }}
        />
        <ButtonGroup width="fill">
          <Button variant="line" size="24" onClick={remove}>해제</Button>
          <Button variant="fill" size="24" onClick={apply}>적용</Button>
        </ButtonGroup>
      </div>
    </PopoverMenu>
  );
}

// 이미지 URL 입력 폼.
function ImageForm({ editor, close }) {
  const [url, setUrl] = useState('');
  const insert = () => {
    if (url.trim()) editor.chain().focus().setImage({ src: url.trim() }).run();
    close();
  };
  return (
    <PopoverMenu width={300}>
      <div className="flex flex-col gap-spacing-4 bg-list-group-bg p-spacing-5">
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="이미지 주소(URL)"
          width="100%"
          inputProps={{
            autoFocus: true,
            onKeyDown: (e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                insert();
              }
            },
          }}
        />
        <ButtonGroup width="fill">
          <Button variant="fill" size="24" onClick={insert}>삽입</Button>
        </ButtonGroup>
      </div>
    </PopoverMenu>
  );
}

export function EditorToolbar({ editor, toolbar }) {
  if (!editor) return null;

  const show = (key) => !toolbar || toolbar.includes(key);
  const run = (fn) => fn(editor.chain().focus()).run();

  const currentBlock = editor.isActive('heading', { level: 1 })
    ? 'h1'
    : editor.isActive('heading', { level: 2 })
      ? 'h2'
      : editor.isActive('heading', { level: 3 })
        ? 'h3'
        : 'paragraph';
  const setBlock = (key, close) => {
    if (key === 'paragraph') run((c) => c.setParagraph());
    else run((c) => c.toggleHeading({ level: Number(key[1]) }));
    close();
  };

  const currentColor = editor.getAttributes('textStyle').color ?? null;
  const currentHighlight = editor.getAttributes('highlight').color ?? null;
  const setColor = (value) =>
    value ? run((c) => c.setColor(value)) : run((c) => c.unsetColor());
  const setHighlight = (value) =>
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
