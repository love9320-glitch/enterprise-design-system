// PopoverMenu — 옵션 목록을 감싸는 팝오버 (Figma option list / popover menu)
// 내부에 ListGroup을 담는다(빈 상태는 ListGroup이 내부에서 ListEmpty로 처리). topArea로 상단 영역을 선택한다
// ('none'|'search'=검색바(SearchBar)|'input'=일반 텍스트 입력(Input)) — 셋 중 하나만 노출.
// footer 옵션을 켜면 하단에 푸터 영역이 추가된다 — 좌측은 footerStart 슬롯(텍스트·체크박스·언더라인 버튼 등
// 임의 노드), 우측은 취소/확인 버튼 그룹. Modal 푸터와 동일한 prop 네이밍·구조를 따른다.
// 추후 다양한 옵션이 추가될 예정이라 확장 가능한 구조로 둔다.
// 컨테이너 색은 list-popover-* 시멘틱 토큰(bg gray100 / outline gray200).
import { RotateCcw } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { Input } from './Input';
import { Button } from './Button';
import { ButtonGroup } from './ButtonGroup';
import { Checkbox } from './Checkbox';

export function PopoverMenu({
  children,
  // ── 상단 영역 ─────────────────────────────────────────
  // 'none'=없음 | 'search'=검색바(SearchBar) | 'input'=일반 텍스트 입력(Input). 셋 중 하나만 선택.
  topArea = 'none',
  // topArea='search'일 때
  searchValue,
  onSearchChange,
  searchPlaceholder = '검색어를 입력하세요',
  searchInputProps = {}, // 검색 input에 전달(autoFocus·onKeyDown 등)
  // topArea='input'일 때 (검색 아이콘 없는 일반 텍스트 입력)
  inputValue,
  onInputChange,
  inputPlaceholder = '텍스트를 입력하세요',
  inputProps = {},           // Input의 inputProps로 전달(autoFocus 등)
  // ── 푸터 ──────────────────────────────────────────────
  footer = false,            // 하단 푸터 영역 표시 여부
  // 푸터 좌측 — 자주 쓰는 3종은 전용 props, 그 외엔 footerStart 범용 슬롯.
  // 우선순위: footerStart > footerCheckbox > footerReset > footerText
  footerStart = null,        // 푸터 좌측 범용 슬롯 — 문자열(자동 텍스트 스타일) 또는 임의 노드
  footerText = null,         // 좌측 텍스트(선택 개수·가이드 문구 등)
  footerCheckbox = false,    // 좌측 전체 선택 체크박스
  footerChecked = false,
  onFooterCheckChange,
  footerCheckLabel = '전체 선택',
  footerReset = false,       // 좌측 초기화 언더라인 버튼
  onFooterReset,
  footerResetLabel = '초기화',
  footerResetIcon: FooterResetIcon = RotateCcw,
  // 푸터 우측 — 취소/확인 버튼
  cancelText = '취소',
  onCancel,
  confirmText = '확인',
  onConfirm,
  confirmVariant = 'fill',   // 확인 버튼 variant ('fill' | 'line' | 'ghost')
  confirmDisabled = false,
  confirmLoading = false,
  showCancel = true,
  showConfirm = true,
  footerButtonsFill = false, // 푸터 버튼 그룹을 fill(균등 분할 전체폭)로 — 좌측 슬롯 없이 버튼만 꽉 채움
  // ──────────────────────────────────────────────────────
  width = 304,
  className = '',
  ...props
}) {
  const widthStyle = typeof width === 'number' ? `${width}px` : width;
  // 푸터 좌측 노드 결정 — footerStart(범용 슬롯)가 최우선, 없으면 전용 props로 조립.
  let footerStartNode = null;
  if (footerStart != null) {
    footerStartNode =
      typeof footerStart === 'string' ? (
        <p className="text-14 text-font-icon-5">{footerStart}</p>
      ) : (
        footerStart
      );
  } else if (footerCheckbox) {
    footerStartNode = (
      <Checkbox label={footerCheckLabel} checked={footerChecked} onChange={onFooterCheckChange} />
    );
  } else if (footerReset) {
    footerStartNode = (
      <Button variant="underline" size="32" leftIcon={FooterResetIcon} onClick={onFooterReset}>
        {footerResetLabel}
      </Button>
    );
  } else if (footerText != null) {
    footerStartNode = <p className="text-14 text-font-icon-5">{footerText}</p>;
  }

  return (
    <div
      style={{ width: widthStyle }}
      className={`flex flex-col gap-spacing-1 overflow-hidden rounded-round-4 outline outline-1 outline-list-popover-outline bg-list-popover-bg shadow-[0px_2px_4px_0px_rgba(13,13,13,0.12)] ${className}`}
      {...props}
    >
      {/* search area — 흰 배경. popover(gray100)와 gap-spacing-1(1px) 틈이 구분선이 된다. */}
      {topArea === 'search' && (
        <div className="w-full bg-list-group-bg p-spacing-5">
          <SearchBar
            value={searchValue}
            onChange={onSearchChange}
            placeholder={searchPlaceholder}
            width="100%"
            inputProps={searchInputProps}
          />
        </div>
      )}
      {/* input area — 검색 아이콘 없는 일반 텍스트 입력. search area와 동일한 패딩·구분선 규칙. */}
      {topArea === 'input' && (
        <div className="w-full bg-list-group-bg p-spacing-5">
          <Input
            value={inputValue}
            onChange={onInputChange}
            placeholder={inputPlaceholder}
            width="100%"
            inputProps={inputProps}
          />
        </div>
      )}
      {children}
      {/* footer area — 흰 배경. 위쪽 gap-spacing-1(1px) 틈이 목록과의 구분선이 된다.
          기본: 좌측 footerStart 슬롯 + 우측 취소/확인 버튼 그룹(justify-between).
          footerButtonsFill: 좌측 슬롯 없이 버튼 그룹을 fill(균등 분할 전체폭)로. */}
      {footer && (
        <div
          className={`flex w-full items-center bg-list-group-bg py-spacing-5 ${
            footerButtonsFill ? 'px-spacing-5' : 'justify-between pl-spacing-6 pr-spacing-5'
          }`}
        >
          {!footerButtonsFill && <div className="flex min-w-0 items-center">{footerStartNode}</div>}
          <ButtonGroup
            gap="5"
            width={footerButtonsFill ? 'fill' : 'hug'}
            className={footerButtonsFill ? '' : 'shrink-0'}
          >
            {showCancel && (
              <Button variant="line" size="32" onClick={onCancel}>
                {cancelText}
              </Button>
            )}
            {showConfirm && (
              <Button
                variant={confirmVariant}
                size="32"
                disabled={confirmDisabled}
                loading={confirmLoading}
                onClick={onConfirm}
              >
                {confirmText}
              </Button>
            )}
          </ButtonGroup>
        </div>
      )}
    </div>
  );
}

// ── rich menu 조립 컴포넌트 (Figma popover menu type=rich menu, node 8416:38124) ──────────
// 선택 항목이 아주 많을 때 쓰는 다중 컬럼 메뉴. PopoverMenu(넓은 width) 안에서
// Columns(가로) > Column(세로) > Section(카테고리 타이틀+행들) 순으로 조립하고,
// 행은 기존 List(rightButton 등)를 그대로 쓴다. 컬럼·섹션 사이 1px 틈(popover bg)이 구분선.
//
// <PopoverMenu width={804}>
//   <PopoverMenuColumns>
//     <PopoverMenuColumn>
//       <PopoverMenuSection title="인적사항">
//         <List title="현주소" rightButton rightButtonIcon={Plus} rightButtonAriaLabel="추가" ... />
//       </PopoverMenuSection>
//     </PopoverMenuColumn>
//     …
//   </PopoverMenuColumns>
// </PopoverMenu>

// 가로 컬럼 컨테이너 — 컬럼들을 균등 폭으로 나란히, 1px 틈이 세로 구분선
export function PopoverMenuColumns({ children, className = '', ...props }) {
  return (
    <div className={`flex w-full items-stretch gap-spacing-1 ${className}`} {...props}>
      {children}
    </div>
  );
}

// 세로 컬럼 — 섹션들을 위에서 아래로, 1px 틈이 가로 구분선. 마지막 섹션이 남는 높이를 채운다
export function PopoverMenuColumn({ children, className = '', ...props }) {
  return (
    <div className={`flex min-w-0 flex-1 flex-col gap-spacing-1 ${className}`} {...props}>
      {children}
    </div>
  );
}

// 카테고리 섹션 — 회색 타이틀 + 행(List)들. grow=true면 컬럼의 남는 높이를 채운다(마지막 섹션용)
export function PopoverMenuSection({ title, children, grow = false, className = '', ...props }) {
  return (
    <div className={`w-full bg-list-group-bg py-spacing-4 ${grow ? 'min-h-0 flex-1' : ''} ${className}`} {...props}>
      {title != null && (
        <p className="px-spacing-6 py-spacing-2 text-12 text-font-icon-3">{title}</p>
      )}
      {children}
    </div>
  );
}
