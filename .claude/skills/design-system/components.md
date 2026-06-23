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
      ? 'bg-button-fill-disabled-bg text-button-fill-disabled-fg cursor-not-allowed'
      : 'bg-button-fill-default-bg text-button-fill-default-fg cursor-pointer hover:bg-button-fill-hover-bg';
  } else if (variant === 'line') {
    colorStyle = inactive
      ? 'bg-button-line-disabled-bg text-button-line-disabled-fg cursor-not-allowed'
      : 'bg-button-line-default-bg text-button-line-default-fg ring-1 ring-inset ring-button-line-default-line cursor-pointer hover:bg-button-line-hover-bg';
  } else {
    colorStyle = inactive
      ? 'bg-button-ghost-disabled-bg text-button-ghost-disabled-fg cursor-not-allowed'
      : 'bg-transparent text-button-ghost-default-fg cursor-pointer hover:bg-button-ghost-hover-bg';
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
| Button | `components/Button.jsx` | variant(fill/line/ghost/underline) · size(32/24) · width(hug/fill — fill=부모 전체 폭, underline 제외) · leftIcon/rightIcon/icon · disabled · loading. **underline**=배경 없는 밑줄 텍스트 버튼(hover 시 밑줄, ghost 텍스트색 재사용) | `pages/ButtonPage.jsx` |
| SegmentControl | `components/SegmentControl.jsx` | **SegmentControlButton**: children · size(32/24) · selected · disabled · leftIcon/rightIcon/icon — ghost 기반 토글 버튼(미선택=font-icon-3 회색 텍스트, 선택/hover=button-ghost-hover-bg+font-icon-5). **SegmentControlGroup**: items(`{value,label,leftIcon?,rightIcon?,icon?,disabled?,ariaLabel?}[]`) · value/defaultValue/onChange(controlled·uncontrolled 단일선택) · size(32/24) · gap(spacing 토큰 키, 기본 '5'=8px) · disabled(그룹 전체) — 버튼들을 묶어 단일 선택 관리 | `pages/SegmentControlPage.jsx` |
| ButtonGroup | `components/ButtonGroup.jsx` | children · direction(horizontal/vertical) · gap(spacing 토큰 키, 기본 '5'=8px) · width(hug/fill — fill=부모 전체 폭, Button 자식들 균등 분할) — 버튼들을 일정 간격으로 묶는 flex 컨테이너. **자식에 Select가 섞이면 Select를 버튼보다 앞(선두)에 자동 배치** | `pages/ButtonPage.jsx` |
| SearchBar | `components/SearchBar.jsx` | value/onChange · onSubmit · disabled · width — 좌측 검색 아이콘, hover/focus는 ring | `pages/SearchBarPage.jsx` |
| Input | `components/Input.jsx` | value/onChange · disabled · readOnly · error+errorMessage(툴팁) · width | `pages/InputPage.jsx` |
| Select | `components/Select.jsx` | variant(box/text) · size(24/20, text 전용) · options · value/onChange · placeholder · disabled · readOnly · error+errorMessage(툴팁) · width(px/CSS/`'hug'`) · maxWidth · menuWidth · placement(auto/수동) · searchable — 커스텀 PopoverMenu 드롭다운(키보드 ↑↓/Enter/Esc, 외부클릭 닫기, 검색 필터, 너비 커스텀 + 위/아래·좌/우 자동 정렬). **variant="text"** = 박스 없는 인라인 텍스트형(필터·테이블 바디/헤더·문단 사이·폼용, hug+maxWidth만, 드롭다운 기본 너비 120px, hover 밑줄, disabled/readOnly/error 모두 지원) | `pages/SelectPage.jsx` |
| InlineFieldTrigger | `components/InlineFieldTrigger.jsx` | icon(리딩 아이콘) · children(값 텍스트) · size(24=14px/20=12px) · open(텍스트 회색+chevron 회전) · disabled · readOnly · interactive · maxWidth(말줄임) — 박스 없는 **인라인 텍스트형 트리거 비주얼**(아이콘?+텍스트+chevron). 상호작용(클릭·키보드·anchor)은 사용처가 담당하는 순수 표현 프리미티브. **Select(variant="text")** 와 **DatePicker 연.월 선택**이 공유. (단독 데모 없음, TruncatingText처럼 내부 공용) | `pages/SelectPage.jsx`·`pages/DatePickerPage.jsx` 내부 사용 |
| Tooltip | `components/Tooltip.jsx` | variant(error/normal) · beak(top/bottom/none) — 색은 토큰값 인라인 적용 | `pages/TagPage.jsx` (Input·List 내부 사용) |
| TruncatingText | `components/TruncatingText.jsx` | children · as · className — 말줄임 시 hover로 전체 텍스트 normal 툴팁(portal+자동반전) | `components/List.jsx` |
| Tag | `components/Tag.jsx` | type(blue/red/gray) · width(hug/fill) · children — tag-* 토큰 | `pages/TagPage.jsx` |
| Checkbox | `components/Checkbox.jsx` | **Checkbox**: checked/onChange · defaultChecked · disabled · label — 6상태(unselected/selected×default/hover/disabled), checkbox-* 토큰. **CheckboxGroup**: items(`{value,label,disabled?}[]`) · value/defaultValue/onChange(controlled·uncontrolled **다중선택**, 선택값 **배열**; onChange=(nextValues,{value,checked})) · direction(vertical/horizontal, 기본 vertical) · gap(spacing 토큰 키, 기본 '7'=16px) · disabled(그룹 전체) | `pages/CheckboxPage.jsx` |
| Switch | `components/Switch.jsx` | checked/onChange · defaultChecked · disabled · label — 6상태(off/on×default/hover/disabled), track 28×16 + thumb 12×10(translate 8px 슬라이드 애니메이션), switch-* 토큰(radio/checkbox와 값 공유하나 별도 파일). 그림자: default/hover thumb만. **off+disabled=진회색 thumb(#878787)** / on+disabled=blue thumb | `pages/SwitchPage.jsx` |
| Tabs | `components/Tabs.jsx` | **TabMenu**: children · icon(LucideIcon) · tag/tagText/tagType(blue/red/gray) · selected · disabled · onClick — 탭 1개(default/hover/select/disabled, 선택 시 하단 2px underline). **Tabs**: items(`{value,label,icon?,tag?,tagText?,tagType?,disabled?}[]`) · value/defaultValue/onChange(controlled·uncontrolled 단일선택) · variant(hug=내용 폭 / fill=균등 분할 전체 폭) · rightSlot(우측 임의 요소, justify-between) — 그룹 하단 1px 구분선. tab-* 토큰 | `pages/TabsPage.jsx` |
| Radio | `components/Radio.jsx` | **Radio**: checked/onChange · defaultChecked · disabled · label · name · value — 6상태(unselected/selected×default/hover/disabled), 원형+가운데 점, radio-* 토큰(체크박스와 값 동일하나 별도 파일). **RadioGroup**: items(`{value,label,disabled?}[]`) · value/defaultValue/onChange(controlled·uncontrolled 단일선택) · name(미지정 시 자동) · direction(vertical/horizontal, 기본 vertical) · gap(spacing 토큰 키, 기본 '7'=16px) · disabled(그룹 전체) | `pages/RadioPage.jsx` |
| List | `components/List.jsx` | **left**: title · tag/tagText · icon(LucideIcon) · checkbox+checked/onCheckChange. **right**: showSwitch+switchChecked/onSwitchChange · rightButton/onButtonClick(고스트 ⋯) · endIcon(chevron). 공통: selected · highlighted · disabled · onClick — 옵션 목록 한 행(5상태). 체크박스·스위치는 공용 컴포넌트 재사용 + 행 클릭과 분리(stopPropagation), disabled 시 함께 비활성 | `pages/OptionListPage.jsx` |
| ScrollArea | `components/ScrollArea.jsx` | children · maxHeight · horizontal(가로 오버레이 스크롤바 추가) · variant(default/light — light=어두운 배경 위 흰색 thumb, scroll-bar-light* 토큰) · contentClassName · **onViewport((el)=>void)**(내부 스크롤 요소 콜백 — 부모가 scrollTop 직접 제어) · **onScroll((e)=>void)**(스크롤 이벤트 패스스루) — 커스텀 오버레이 스크롤바(공용, 세로+가로). 스크롤 생기는 모든 곳에 사용 | `pages/TagPage.jsx` |
| ListGroup | `components/ListGroup.jsx` | children · maxVisible(기본 6) · empty · emptyMessage — 내부 스크롤(ScrollArea 사용). 자식 0개 또는 empty=true면 그룹 안(스크롤 영역 내부)에 ListEmpty를 렌더해 빈 상태도 그룹의 패딩·배경을 따른다 | `pages/OptionListPage.jsx` |
| ListEmpty | `components/ListEmpty.jsx` | message — 목록 빈 상태. **ListGroup이 빈 상태일 때 내부에서 렌더**(단독 사용도 가능) | `pages/OptionListPage.jsx` |
| PopoverMenu | `components/PopoverMenu.jsx` | children · width. **상단 영역 topArea**('none'·'search'·'input' 중 택1): 'search'+searchValue/onSearchChange/searchPlaceholder/searchInputProps(검색바, SearchBar) · 'input'+inputValue/onInputChange/inputPlaceholder/inputProps(검색 아이콘 없는 일반 입력, Input 재사용). **footer**(하단 푸터 on/off). **푸터 좌측**(우선순위 footerStart>checkbox>reset>text): footerText(개수·가이드 문구) · footerCheckbox+footerChecked/onFooterCheckChange/footerCheckLabel(전체 선택) · footerReset+onFooterReset/footerResetLabel/footerResetIcon(초기화 언더라인 버튼) · footerStart(그 외 커스텀 범용 슬롯, 문자열=텍스트/노드=임의). **푸터 우측**: cancelText/onCancel · confirmText/onConfirm · confirmVariant · confirmDisabled/confirmLoading · showCancel/showConfirm · **footerButtonsFill**(좌측 슬롯 없이 버튼 그룹 fill 균등 분할 전체폭 — 링크/이미지 URL 입력형) — 옵션 목록 컨테이너. 푸터는 좌측 슬롯 + 우측 취소/확인 ButtonGroup, bg-list-group-bg에 gap-spacing-1 틈이 구분선(Modal 푸터와 동일 네이밍) | `pages/OptionListPage.jsx` |
| Popover | `components/Popover.jsx` | trigger · children((close)=>) · placement(auto/수동) · menuWidth · open/onOpenChange · disabled — 임의 트리거(버튼 등)에 PopoverMenu 등 패널을 띄움(위치 자동·외부클릭/Esc 닫기·portal). Select 드롭다운 로직의 범용 버전 | `pages/ButtonPage.jsx` |
| Table | `components/Table.jsx` | columns(key/label/width/align/render/renderHeader/**filter**/**headerMenu**) · rows · rowKey · selectable+selectedIds/onSelectChange(전체선택) · **filters/onFilterChange**(헤더 필터) · **sort/onSortChange**(헤더 메뉴 정렬) — 둘 다 controlled/내부 · bordered · wrap(본문 줄바꿈: false 말줄임+행고정 / true 늘어남) · maxHeight(세로 스크롤+헤더 고정) · minWidth(테이블 최소 너비; 실제 최소=max(minWidth, 컬럼최소폭합), fill 컬럼은 40px 유지, 좁아지면 가로 스크롤 자동) · scrollX(가로 스크롤 수동) — 세로·가로 모두 ScrollArea 오버레이 스크롤바 · loading · emptyMessage · onRowClick — table-* 토큰. **컬럼 filter={options,allLabel?,placeholder?}**=헤더 라벨 자리에 인라인 텍스트형 Select(size 20), 선택값으로 row[key] 기준 행 필터(맨 앞 전체 옵션=해제, 라벨 기본 '{컬럼명} 전체'). **컬럼 headerMenu={sortable?,items?,icon?,width?}**=헤더 우측 ghost 아이콘 버튼(24)+Popover 메뉴, sortable이면 오름/내림차순 정렬 자동(row[key] 기준 내부 정렬), items=[{label,onClick}]로 임의 기능 추가 | `pages/TablePage.jsx` |
| UsageExample | `components/UsageExample.jsx` | code(문자열) · title · note · props(`{name,type,default,desc}[]` 전체 옵션 표) — 데모 페이지 상단 "사용 예시 코드 + 전체 옵션 설명표" 블록(복사 버튼 포함). **문서용 헬퍼**(제품 컴포넌트 아님) | 각 컴포넌트 데모 페이지 상단 |
| TableTemplate | `components/TableTemplate.jsx` | columns/rows · actions(ReactNode/`(ctx)=>` — null이면 버튼그룹 숨김) · title(헤더 좌측 타이틀 — 버튼그룹 왼쪽, 함께 표시 가능) · searchable · pagination · bordered · selectable · selectedIds/onSelectChange · searchKeys/searchPlaceholder · 페이지네이션 세부 제어(page/onPageChange · defaultPageSize/pageSize/onPageSizeChange/pageSizeOptions · showTotal · showPageSize · maxButtons · paginationClassName) · minWidth/maxHeight(페이지네이션 없을 때 표 높이) · emptyMessage — 버튼그룹+검색바+Table+Pagination을 묶은 목록 페이지 템플릿. 각 요소 on/off, 검색·페이지네이션·행 수·선택 내부 동작. **컬럼 filter/headerMenu(정렬)는 템플릿이 검색 후 전체 행에 먼저 적용한 뒤 페이지를 자른다**(현재 페이지 안에서만 동작하지 않게). 필터·정렬 공유 헬퍼는 `components/tableView.js` | `pages/TableTemplatePage.jsx` |
| Modal | `components/Modal.jsx` | open/onClose · title · size(sm/md/lg/xl/2xl/3xl/4xl=360~1260 · fill=좌우16제외) · placement(top=상단정렬·여백16~화면½−150가변/center; 일반·Form 기본 top, Alert/Confirm 기본 center) · children(ModalBody, 70vh 초과 시 ScrollArea 내부 스크롤) · confirmText/onConfirm · cancelText/onCancel · confirmVariant · confirmDisabled/confirmLoading · showCancel/showClose/showHeader/showFooter · footer/footerStart(푸터 우측 커스텀/좌측 영역) · closeOnOverlayClick/closeOnEsc · bodyMaxHeight · onSubmit(주면 form 래핑+주동작 submit). ModalBox=modal-inline 배경+1px gap 구분선+modal-outline ring, 딤=modal-overlay. **변형**: FormModal(취소/저장, form+유효성)=기본 구조 그대로 · **AlertModal/ConfirmModal**=헤더 없이 본문 고정 슬롯 `title→description→descriptionDetail(회색 박스, modal-description-bg)→checkboxLabel(Confirm 전용 재확인 체크박스)`만 사용(슬롯 고정·텍스트만 자유), 푸터 버튼 전체폭(footerFullWidth), Confirm은 `requireCheck`(기본 true)로 체크해야 확인 활성화·`checked`/`onCheckChange` controlled 지원. base Modal에 `bodyPadding`/`footerPadding`/`footerFullWidth` 옵션. 푸터 버튼은 ButtonGroup, portal+body스크롤잠금+ESC/딤 닫기 — modal-* 토큰 | `pages/ModalPage.jsx` |
| Editor | `components/Editor.jsx` (+ `components/EditorToolbar.jsx`) | value/defaultValue/onChange(HTML 문자열) · mode(edit/source/preview)/onModeChange · toolbar(노출 서식 키 배열) · readOnly · allowSourceEdit · placeholder · minHeight/maxHeight · width(fill 기본/px/CSS) · className — **Tiptap v3 기반** 리치 텍스트 에디터(엔진은 내부 격리). 편집(WYSIWYG)/HTML 소스/미리보기 3모드. 풀 툴바: 블록(본문·H1~3)·강조(굵게/기울임/밑줄/취소선)·글자색/형광(토큰 팔레트)·목록/인용·정렬·링크·표·이미지(URL)·구분선·코드. 본문/미리보기 스타일은 `index.css`의 `.tiptap-prose`(@apply 토큰)·색은 `editor-*` 토큰. StarterKit에 link/underline 포함되어 별도 등록 안 함 | `pages/EditorPage.jsx` |
| DateField | `components/DateField.jsx` | mode(single/range) · value/defaultValue/onChange · showTime · startTime/endTime(+onChange) · placeholder('날짜를 선택하세요') · disabled/readOnly · error/errorMessage(필드 아래 툴팁) · **formatErrorMessage**(직접 입력 형식 오류) · closeOnSelect(선택 완료 시 자동 닫기, showTime이면 유지) · width('hug'/'fill'/px/CSS, 미지정 시 showTime?260:180, 좁으면 말줄임…) · disablePast/minDate/maxDate/disabledDate/weekStartsOn/minYear/maxYear(DatePicker 패스스루) — **DatePicker 트리거 + 직접 입력 필드**(Figma date picker/Input). 캘린더 아이콘+값(input), text-field-* 토큰으로 default·hover·focused·filled·disabled·readOnly·error 상태. 아이콘/필드 클릭 시 Popover로 DatePicker를 띄우고, **입력칸에 직접 타이핑 후 Enter/blur로 파싱·정규화**(날짜: 250520/20250520/0520(올해)/25.05.20, 시간(공백 뒤): 00:10/0010/011, 숫자·구분자·괄호만 입력 허용). **범위에서 마감일 미입력 후 확정 시 end=null → "마감일 없음"**. 값 표기는 utils/datetime로 통일 | `pages/DatePickerPage.jsx` |
| TimeField | `components/TimeField.jsx` | value/defaultValue/onChange('HH:MM'\|null) · placeholder('시간을 선택하세요') · disabled/readOnly · error/errorMessage/formatErrorMessage · width('hug'/'fill'/px, 기본 120, 좁으면 말줄임) — **시간 트리거 + 직접 입력 필드**(DateField의 시간 버전). 시계 아이콘+값(input), 누르면 **인풋 영역 없는** 시/분 2depth 목록(TwoDepthList `showInput={false}`)을 Popover로 띄움. 직접 입력: 12:34/1:1/1230/011(→01:01) → Enter/blur로 'HH:MM' 정규화, 숫자·콜론만 허용. text-field-* 토큰 | `pages/DatePickerPage.jsx` |
| DatePicker | `components/DatePicker.jsx` | mode(single/range) · value/defaultValue/onChange(single=Date·range={start,end}) · disablePast(오늘 이전 선택 불가, 오늘은 가능)/disableFuture(오늘 이후 선택 불가, 오늘은 가능)/minDate/maxDate/disabledDate((date)=>bool 커스텀 비활성) · month/defaultMonth/onMonthChange(표시 월) · showTime(하단 시작/마감 시간) · startTime/endTime/onStartTimeChange/onEndTimeChange('HH:MM') · weekStartsOn(0=일) · weekdayLabels · todayLabel · scrollNavigate(날짜 영역을 ScrollArea 오버레이 스크롤바로 주 단위 무한 세로 스크롤 — 페이지처럼 연속 이동·스크롤 따라 헤더 연.월 자동 갱신, 기본 true; false면 정적 6주 그리드) · rangeTooltip(범위 모드 날짜 hover 시 "시작일/마감일" 안내 툴팁, 기본 true)/rangeStartLabel/rangeEndLabel · minYear/maxYear(연도 범위, 기본 ±12) · width(기본 276) — 캘린더 날짜 선택 패널(Figma date picker). 상단 네비(캘린더 아이콘+연.월 selected-text→연/월 TwoDepthList, 이전/오늘/다음 ghost Button)+요일 헤더+6주 그리드(CalendarDayButton)+(showTime)시간 영역. 패널 자체이므로 트리거엔 Popover로 감쌈. native Date(무라이브러리), controlled/uncontrolled. calendar-* 토큰 | `pages/DatePickerPage.jsx` |
| CalendarDayButton | `components/CalendarDayButton.jsx` | children(날짜 텍스트) · state(default/muted/today/selected/range-start/range-end/in-range) · disabled · onClick — 캘린더 날짜 한 칸(36×24). 뒤쪽 좌/우 반쪽 배경으로 범위(start~end) 연속 칠 + 중앙 24px 원형 하이라이트. calendar-* 시멘틱 토큰 | `pages/DatePickerPage.jsx` |
| TwoDepthList | `components/TwoDepthList.jsx` | inputValue(상단 현재값) · showInput(상단 입력 영역 표시, 기본 true; false면 좌/우 컬럼만 — 트리거가 따로 입력 가질 때) · editable(상단 input 직접 입력 허용, 기본 true; false면 readOnly) · onInputApply((text)=>string|null — 타이핑 텍스트로 좌/우 값 **즉시(라이브) 적용** 후 정규화 문자열 반환(형식오류=null); 포커스 중엔 텍스트 안 덮어씀(자유 입력)·blur 시 정규화 보정·포커스 시 전체선택, 파싱은 호출부) · errorMessage(형식 오류 메시지) · allowedChars(RegExp, 입력 허용 문자 — 기본 숫자·구분자만, null이면 제한 없음) · onInputChange((e)=>void raw) · inputPlaceholder/inputProps · leftOptions/rightOptions(`{value,label,disabled?}[]`) · leftValue/rightValue · onLeftChange/onRightChange · maxVisible(각 컬럼 행 수, 기본 5) · width(기본 201) — 입력 영역 + 좌/우 2컬럼 목록 팝오버(Figma 2depth list). 연/월(year_month)·시/분(time) 등 두 단계로 좁혀 고르는 값에 공용. 각 컬럼 ListGroup(초과 시 내부 스크롤), 선택 행은 List selected(파란 텍스트)+열릴 때 자동 스크롤. DatePicker의 연.월·시간 선택 내부에서도 사용 | `pages/DatePickerPage.jsx` |
| Pagination | `components/Pagination.jsx` | page/onChange(controlled) · defaultPage · totalCount/totalPages · pageSize/onPageSizeChange · pageSizeOptions(기본 5/10/20/50) · maxButtons(번호 윈도우, 기본 10) · showTotal · showPageSize — « ‹ 번호 › » + 총 N개 + 페이지 행 Select, 현재페이지 ghost-select 토큰 | `pages/PaginationPage.jsx` |

> **오버레이 패턴 참고:** 필드 아래 메시지(에러 등)는 레이아웃 공간을 차지하지 않도록, 래퍼를 `relative`로 두고 메시지를 `absolute top-full`로 띄운다. `Input`의 에러 툴팁이 이 방식이다.

> **예외:** 특정 컴포넌트가 공통 규칙으로 안 덮이는 **고유의 복잡한 규약**(예: 데이터 테이블의 정렬·페이지네이션·가상 스크롤)을 가질 때만, 그 컴포넌트 하나를 위한 별도 MD를 추가한다. 그 외에는 이 카탈로그 한 줄로 충분하다.

## 데모 페이지 등록

새 컴포넌트를 만들면 데모 페이지도 추가한다 (페이지 추가는 규칙 3, 각 templates 참고):
1. `src/pages/XxxPage.jsx` — variant × size × state 조합을 표로 보여줌 (`ButtonPage.jsx` 참고)
2. `src/pages/index.js`에 export
3. `App.jsx`의 `NAV_GROUPS` '컴포넌트' 그룹에 항목 추가

### 규칙 — 섹션 사이에는 구분선을 넣는다

페이지를 여러 섹션(`<h3>` 단위 블록)으로 구성할 때, **첫 섹션을 제외한 각 섹션 위에 구분선**을 둬 시각적으로 분리한다.

- 표준 클래스: `mt-spacing-9 border-t border-base-gray-100 pt-spacing-8` (섹션 래퍼 `<div>`에 부여)
- 첫 섹션(보통 `UsageExample` 바로 다음)은 구분선 없이 시작한다.
- **Why:** 항목이 여백만으로 나열되면 경계가 모호하다. 모든 데모/쇼케이스 페이지가 동일한 구분 규약을 따라 일관성을 유지한다.
- 레퍼런스: `ButtonPage.jsx` · `TagPage.jsx` · `EditorPage.jsx`.

## 컴포넌트 완료 체크리스트

- [ ] 모든 시각 옵션(variant/size/state 등)이 props로 노출되고 기본값이 있는가
- [ ] 컬러가 시멘틱 토큰 클래스(`bg-button-*`, `text-font-icon-*`)만 쓰는가 (하드코딩 X)
- [ ] 간격/라운드/보더가 `spacing-*`/`round-*`/`border-*` 토큰만 쓰는가
- [ ] 인라인 `style`을 쓰지 않았는가
- [ ] `disabled`/`loading` 등 비활성 상태에서 이벤트가 차단되는가
- [ ] 아이콘은 lucide-react 컴포넌트를 props로 받는가 (`<Icon/>`이 아닌 `Icon`)
- [ ] 다크모드 클래스(`dark:`)를 적절히 처리했는가
- [ ] 데모 페이지를 추가/갱신했는가
- [ ] 데모 페이지의 섹션 사이에 구분선(`border-t border-base-gray-100 pt-spacing-8`)을 넣었는가 (첫 섹션 제외)
