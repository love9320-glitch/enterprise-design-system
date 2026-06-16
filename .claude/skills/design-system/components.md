# Components — 공통 컴포넌트 규칙

`src/components/`에 두는 재사용 컴포넌트의 공통 규칙. 토큰 사용은 `foundation.md`를 따른다.

## 규칙 4 — 컴포넌트는 완전 옵션화

- variant, size, state 등 **모든 시각 옵션을 props로 노출**한다.
- **기본값(default props)** 을 명시한다.
- 내부 스타일 분기는 **토큰 클래스 문자열 조합**으로 처리한다. 인라인 `style` 금지.
- 복잡한 조합은 **상수 배열/객체로 추출**해 코드 수정이 쉽게 유지한다.
- **Why:** 재사용성과 유지보수성. 옵션이 하드코딩되면 사용처마다 코드를 복사해야 한다.

## 작성 패턴

1. named export 함수 컴포넌트로 작성: `export function Xxx({ ... }) {}`
2. props에서 기본값을 구조분해로 명시: `variant = 'fill', size = '32'`
3. 공통 클래스는 `base` 문자열로, 분기 클래스는 변수(`sizeStyle`, `colorStyle`)로 조합
4. 최종 `className`은 `` `${base} ${sizeStyle} ${colorStyle} ${className}` `` 형태로 합성
5. 나머지 속성은 `...props`로 전달, `onClick` 등 핸들러는 비활성 상태 가드

## 규칙 5 — 말줄임(truncate) 텍스트는 hover 툴팁 필수

영역이 좁아 텍스트가 잘릴 수 있는 곳(목록 항목명, 셀렉트 값, 칩, 표 셀 등)은 **`TruncatingText` 컴포넌트로 감싼다.** 단순히 `truncate` 클래스만 쓰지 말 것.

- 실제로 잘렸을 때만(`scrollWidth > clientWidth`) hover 시 **normal Tooltip**으로 전체 텍스트를 보여준다.
- 툴팁은 **portal(document.body) + fixed**로 부모의 `overflow`를 벗어나고, viewport 경계에서 **위→아래·오른쪽→왼쪽 자동 반전**한다.
- **Why:** 좁은 영역의 말줄임은 정보 손실이다. 전체 값을 확인할 수단을 일관되게 제공한다.
- **How to apply:** `<TruncatingText className="min-w-0 flex-1 text-14 ...">{text}</TruncatingText>` 형태로 사용(내부에서 `truncate` 적용). 레퍼런스: `components/List.jsx`의 옵션 제목.

## 모범 예제 — 패턴 견본 (Button 구조를 표준으로 삼는다)

> 이 예제는 **"이렇게 짜라"는 구조 견본 1개**다. 컴포넌트마다 전체 예제를 이 파일에 복붙하지 않는다(코드와 이중 관리되어 낡는다).
> 각 컴포넌트의 **최신 전체 구현·props·기본값은 해당 `.jsx` 코드가 진실**이다. 작업 시 아래 카탈로그에서 파일을 찾아 코드를 직접 참고하라.

```jsx
export function Button({
  children,
  size = '32',            // '32' | '24'
  variant = 'fill',       // 'fill' | 'line' | 'ghost'
  leftIcon: LeftIcon = null,
  rightIcon: RightIcon = null,
  icon: Icon = null,      // 아이콘 전용
  disabled = false,
  loading = false,
  onClick,
  className = '',
  ...props
}) {
  const inactive = disabled || loading;

  const base =
    'inline-flex items-center justify-center relative font-pretendard ' +
    'font-normal rounded-round-4 transition-colors select-none';

  // 사이즈 분기 — 토큰 클래스 문자열로
  const sizeStyle = size === '24'
    ? 'min-h-[24px] px-spacing-5 py-spacing-2 text-12'
    : 'min-h-[32px] px-spacing-6 py-spacing-3 text-14';

  // 컬러 분기 — 시멘틱 토큰 클래스로 (하드코딩 금지)
  let colorStyle;
  if (variant === 'fill') {
    colorStyle = inactive
      ? 'bg-btn-fill-disabled-bg text-btn-fill-disabled-fg cursor-not-allowed'
      : 'bg-btn-fill-default-bg text-btn-fill-default-fg cursor-pointer hover:bg-btn-fill-hover-bg';
  } else if (variant === 'line') {
    colorStyle = inactive
      ? 'bg-btn-line-disabled-bg text-btn-line-disabled-fg cursor-not-allowed'
      : 'bg-btn-line-default-bg text-btn-line-default-fg ring-1 ring-inset ring-btn-line-default-line cursor-pointer hover:bg-btn-line-hover-bg';
  } else {
    colorStyle = inactive
      ? 'bg-btn-ghost-disabled-bg text-btn-ghost-disabled-fg cursor-not-allowed'
      : 'bg-transparent text-btn-ghost-default-fg cursor-pointer hover:bg-btn-ghost-hover-bg';
  }

  return (
    <button
      className={`${base} ${sizeStyle} ${colorStyle} ${className}`}
      disabled={inactive}
      onClick={!inactive ? onClick : undefined}
      {...props}
    >
      {children}
    </button>
  );
}
```

선택지가 더 많아지면 분기 if문 대신 **lookup 객체**로 추출한다:

```jsx
const SIZE_STYLES = {
  '24': 'min-h-[24px] px-spacing-5 py-spacing-2 text-12',
  '32': 'min-h-[32px] px-spacing-6 py-spacing-3 text-14',
};
const sizeStyle = SIZE_STYLES[size];
```

## 컴포넌트 카탈로그

컴포넌트의 명세(진실)는 코드에 있다. 여기에는 **어떤 컴포넌트가 있고 어디 있는지**만 한 줄로 적는다.
새 컴포넌트를 만들면 이 표에 **한 줄 추가**한다 (개별 MD 파일은 만들지 않는다).

| 컴포넌트 | 파일 | 주요 옵션 | 데모 페이지 |
|----------|------|-----------|-------------|
| Button | `components/Button.jsx` | variant(fill/line/ghost/underline) · size(32/24) · leftIcon/rightIcon/icon · disabled · loading. **underline**=배경 없는 밑줄 텍스트 버튼(hover 시 밑줄, ghost 텍스트색 재사용) | `pages/ButtonPage.jsx` |
| ButtonGroup | `components/ButtonGroup.jsx` | children · direction(horizontal/vertical) · gap(spacing 토큰 키, 기본 '5'=8px) — 버튼들을 일정 간격으로 묶는 flex 컨테이너. **자식에 Select가 섞이면 Select를 버튼보다 앞(선두)에 자동 배치** | `pages/ButtonPage.jsx` |
| SearchBar | `components/SearchBar.jsx` | value/onChange · onSubmit · disabled · width — 좌측 검색 아이콘, hover/focus는 ring | `pages/SearchBarPage.jsx` |
| Input | `components/Input.jsx` | value/onChange · disabled · readOnly · error+errorMessage(툴팁) · width | `pages/InputPage.jsx` |
| Select | `components/Select.jsx` | variant(box/text) · size(24/20, text 전용) · options · value/onChange · placeholder · disabled · readOnly · error+errorMessage(툴팁) · width(px/CSS/`'hug'`) · maxWidth · menuWidth · placement(auto/수동) · searchable — 커스텀 PopoverMenu 드롭다운(키보드 ↑↓/Enter/Esc, 외부클릭 닫기, 검색 필터, 너비 커스텀 + 위/아래·좌/우 자동 정렬). **variant="text"** = 박스 없는 인라인 텍스트형(필터·테이블 바디/헤더·문단 사이·폼용, hug+maxWidth만, 드롭다운 기본 너비 120px, hover 밑줄, disabled/readOnly/error 모두 지원) | `pages/SelectPage.jsx` |
| Tooltip | `components/Tooltip.jsx` | variant(error/normal) · beak(top/bottom/none) — 색은 토큰값 인라인 적용 | `pages/TagPage.jsx` (Input·List 내부 사용) |
| TruncatingText | `components/TruncatingText.jsx` | children · as · className — 말줄임 시 hover로 전체 텍스트 normal 툴팁(portal+자동반전) | `components/List.jsx` |
| Tag | `components/Tag.jsx` | type(blue/red/gray) · width(hug/fill) · children — tag-* 토큰 | `pages/TagPage.jsx` |
| Checkbox | `components/Checkbox.jsx` | checked/onChange · defaultChecked · disabled · label — 6상태(unselected/selected×default/hover/disabled), checkbox-* 토큰 | `pages/CheckboxPage.jsx` |
| List | `components/List.jsx` | title · tag · rightButton · endIcon · selected · disabled · onClick · onButtonClick — 옵션 목록 한 행(5상태) | `pages/OptionListPage.jsx` |
| ScrollArea | `components/ScrollArea.jsx` | children · maxHeight · horizontal(가로 오버레이 스크롤바 추가) · contentClassName — 커스텀 오버레이 스크롤바(공용, 세로+가로). 스크롤 생기는 모든 곳에 사용 | `pages/TagPage.jsx` |
| ListGroup | `components/ListGroup.jsx` | children · maxVisible(기본 6) · empty · emptyMessage — 내부 스크롤(ScrollArea 사용). 자식 0개 또는 empty=true면 그룹 안(스크롤 영역 내부)에 ListEmpty를 렌더해 빈 상태도 그룹의 패딩·배경을 따른다 | `pages/OptionListPage.jsx` |
| ListEmpty | `components/ListEmpty.jsx` | message — 목록 빈 상태. **ListGroup이 빈 상태일 때 내부에서 렌더**(단독 사용도 가능) | `pages/OptionListPage.jsx` |
| PopoverMenu | `components/PopoverMenu.jsx` | children · searchable · searchValue · onSearchChange · width — 옵션 목록 컨테이너(검색바 옵션, SearchBar 재사용) | `pages/OptionListPage.jsx` |
| Popover | `components/Popover.jsx` | trigger · children((close)=>) · placement(auto/수동) · menuWidth · open/onOpenChange · disabled — 임의 트리거(버튼 등)에 PopoverMenu 등 패널을 띄움(위치 자동·외부클릭/Esc 닫기·portal). Select 드롭다운 로직의 범용 버전 | `pages/ButtonPage.jsx` |
| Table | `components/Table.jsx` | columns(key/label/width/align/render/renderHeader) · rows · rowKey · selectable+selectedIds/onSelectChange(전체선택) · bordered · wrap(본문 줄바꿈: false 말줄임+행고정 / true 늘어남) · maxHeight(세로 스크롤+헤더 고정) · minWidth(테이블 최소 너비; 실제 최소=max(minWidth, 컬럼최소폭합), fill 컬럼은 40px 유지, 좁아지면 가로 스크롤 자동) · scrollX(가로 스크롤 수동) — 세로·가로 모두 ScrollArea 오버레이 스크롤바 · loading · emptyMessage · onRowClick — table-* 토큰 | `pages/TablePage.jsx` |
| UsageExample | `components/UsageExample.jsx` | code(문자열) · title · note · props(`{name,type,default,desc}[]` 전체 옵션 표) — 데모 페이지 상단 "사용 예시 코드 + 전체 옵션 설명표" 블록(복사 버튼 포함). **문서용 헬퍼**(제품 컴포넌트 아님) | 각 컴포넌트 데모 페이지 상단 |
| TableTemplate | `components/TableTemplate.jsx` | columns/rows · actions(ReactNode/`(ctx)=>` — null이면 버튼그룹 숨김) · searchable · pagination · bordered · selectable · selectedIds/onSelectChange · searchKeys/searchPlaceholder · 페이지네이션 세부 제어(page/onPageChange · defaultPageSize/pageSize/onPageSizeChange/pageSizeOptions · showTotal · showPageSize · maxButtons · paginationClassName) · minWidth/maxHeight(페이지네이션 없을 때 표 높이) · emptyMessage — 버튼그룹+검색바+Table+Pagination을 묶은 목록 페이지 템플릿. 각 요소 on/off, 검색·페이지네이션·행 수·선택 내부 동작 | `pages/TableTemplatePage.jsx` |
| Pagination | `components/Pagination.jsx` | page/onChange(controlled) · defaultPage · totalCount/totalPages · pageSize/onPageSizeChange · pageSizeOptions(기본 5/10/20/50) · maxButtons(번호 윈도우, 기본 10) · showTotal · showPageSize — « ‹ 번호 › » + 총 N개 + 페이지 행 Select, 현재페이지 ghost-select 토큰 | `pages/PaginationPage.jsx` |

> **오버레이 패턴 참고:** 필드 아래 메시지(에러 등)는 레이아웃 공간을 차지하지 않도록, 래퍼를 `relative`로 두고 메시지를 `absolute top-full`로 띄운다. `Input`의 에러 툴팁이 이 방식이다.

> **예외:** 특정 컴포넌트가 공통 규칙으로 안 덮이는 **고유의 복잡한 규약**(예: 데이터 테이블의 정렬·페이지네이션·가상 스크롤)을 가질 때만, 그 컴포넌트 하나를 위한 별도 MD를 추가한다. 그 외에는 이 카탈로그 한 줄로 충분하다.

## 데모 페이지 등록

새 컴포넌트를 만들면 데모 페이지도 추가한다 (페이지 추가는 규칙 3, 각 templates 참고):
1. `src/pages/XxxPage.jsx` — variant × size × state 조합을 표로 보여줌 (`ButtonPage.jsx` 참고)
2. `src/pages/index.js`에 export
3. `App.jsx`의 `NAV_GROUPS` '컴포넌트' 그룹에 항목 추가

## 컴포넌트 완료 체크리스트

- [ ] 모든 시각 옵션(variant/size/state 등)이 props로 노출되고 기본값이 있는가
- [ ] 컬러가 시멘틱 토큰 클래스(`bg-btn-*`, `text-font-icon-*`)만 쓰는가 (하드코딩 X)
- [ ] 간격/라운드/보더가 `spacing-*`/`round-*`/`border-*` 토큰만 쓰는가
- [ ] 인라인 `style`을 쓰지 않았는가
- [ ] `disabled`/`loading` 등 비활성 상태에서 이벤트가 차단되는가
- [ ] 아이콘은 lucide-react 컴포넌트를 props로 받는가 (`<Icon/>`이 아닌 `Icon`)
- [ ] 다크모드 클래스(`dark:`)를 적절히 처리했는가
- [ ] 데모 페이지를 추가/갱신했는가
