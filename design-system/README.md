# @gusun/design-system

코드↔Figma가 1:1로 동기화된 **ATS 디자인 시스템** — 토큰 기반 React 컴포넌트 라이브러리입니다. 60+ 컴포넌트와 8종 템플릿, 디자인 토큰을 TypeScript(strict)로 제공합니다.

- **데모·문서 사이트**: https://love9320-glitch.github.io/enterprise-design-system/ — 모든 컴포넌트의 실행 예제·props 표·복사 가능한 코드
- **처음이라면**: [시작 가이드](https://love9320-glitch.github.io/enterprise-design-system/#getting-started) — 개발 경험이 없어도 0부터 실행까지
- **고쳐 쓰고 싶다면**: [커스텀 가이드](https://love9320-glitch.github.io/enterprise-design-system/#customization) — 토큰 오버라이드부터 기능 훅 재사용까지 5단계
- **Claude Code(AI)로 개발한다면**: 시작 가이드의 "Claude Code와 함께 쓰기" — 프로젝트 루트에 넣을 소비자용 `CLAUDE.md` 제공

## 설치

```bash
npm install @gusun/design-system
```

React 18/19 프로젝트에서 동작합니다(react·react-dom은 peer — 앱의 것을 사용).

## 빠른 시작

**① 스타일 연결** — Tailwind 없이 컴파일된 CSS 한 장으로 시작하는 게 가장 쉽습니다. 앱 진입 파일(`main.jsx` 등) 맨 위에:

```js
import '@gusun/design-system/styles.css';
```

폰트(Pretendard)는 `index.html`의 `<head>`에 한 줄:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />
```

**② 컴포넌트 사용**:

```jsx
import { Button, Input, Select, Tag } from '@gusun/design-system';

<Button variant="fill" onClick={save}>저장</Button>
<Button asChild variant="line"><a href="/docs">링크를 버튼처럼</a></Button>
```

**Tailwind 프로젝트라면** CSS 대신 preset으로 토큰을 통합할 수 있습니다:

```js
// tailwind.config.js
import preset from '@gusun/design-system/preset';
export default {
  presets: [preset],
  content: ['./src/**/*.{js,jsx,ts,tsx}', './node_modules/@gusun/design-system/dist-lib/*.js'],
};
```

## 엔트리

| import | 내용 | 비고 |
|---|---|---|
| `@gusun/design-system` | 컴포넌트 전체 + 기능 훅 + 유틸 + 타입 | |
| `@gusun/design-system/editor` | Editor·EditorToolbar·공지 작성 템플릿(Tiptap 기반) | `@tiptap/react` `@tiptap/pm` `@tiptap/starter-kit` 등 peer 설치 필요 |
| `@gusun/design-system/tokens` | 디자인 토큰 값(색·간격·라운드·타이포) | |
| `@gusun/design-system/preset` | Tailwind preset(토큰 theme + safelist) | |
| `@gusun/design-system/styles.css` | 컴파일된 전체 스타일 한 장 | Tailwind 불필요 |

동작 훅(`usePopoverPosition`·`useOutsideDismiss`·`useFocusTrap`·`usePanelKeyboard` 등)도 메인 엔트리에서 export됩니다 — 디자인은 직접 만들되 동작만 재사용할 수 있습니다(자세한 건 커스텀 가이드 3단계).

## 컴포넌트 API

각 컴포넌트명을 클릭하면 **실행 예제 + 전체 props 표**가 있는 데모 페이지로 이동합니다. 아래 표는 자주 쓰는 핵심 props 요약이고, **props의 완전한 진실은 데모 페이지의 표와 타입(.d.ts)** 입니다(에디터에서 자동완성으로도 확인 가능).

### 액션

| 컴포넌트 | 핵심 props |
|---|---|
| [Button](https://love9320-glitch.github.io/enterprise-design-system/#button) | `variant`(fill·line·ghost·underline) · `size`(32·24·18) · `leftIcon/rightIcon/icon`(lucide) · `disabled` `loading` · `width`(hug·fill) · `area`(영역 채움 — 셀 안 버튼) · `asChild`(링크를 버튼처럼) · underline 전용 `color`(7색)/`weight` |
| [ButtonGroup](https://love9320-glitch.github.io/enterprise-design-system/#button) | `gap`(간격 토큰 키) — 버튼 나열 래퍼 |
| [SegmentControl](https://love9320-glitch.github.io/enterprise-design-system/#segment-control) | `items` · `value/onChange` · `size` |
| [ToolBar](https://love9320-glitch.github.io/enterprise-design-system/#tool-bar) | 플로팅 툴바 셸 — 내부는 Button·Select 조립, `ToolBarDivider` 포함 |

### 입력

| 컴포넌트 | 핵심 props |
|---|---|
| [Input](https://love9320-glitch.github.io/enterprise-design-system/#input) | `value/onChange` · `placeholder` · `size`(32·22) · `variant`(solid·transparent — 투명은 박스·링 없이 텍스트만) · `width` · `disabled` `readOnly` · `error`+`errorMessage`(툴팁) · `inputProps` |
| [TextArea](https://love9320-glitch.github.io/enterprise-design-system/#textarea) | Input과 동일 계열 + 자동 높이·오버레이 스크롤바 · `maxLength` 카운터 |
| [SearchBar](https://love9320-glitch.github.io/enterprise-design-system/#search-bar) | `value/onChange` · `onSubmit(value)` · `placeholder` · `width` |
| [Select](https://love9320-glitch.github.io/enterprise-design-system/#select) | `options[{value,label,disabled?}]` · `value/onChange({target:{value}})` · `multiple`(+`confirm` 확인 푸터) · `searchable` · `variant`(box·text·chip) · `label`(내부 라벨) · `placement` `menuWidth` |
| [SelectChip](https://love9320-glitch.github.io/enterprise-design-system/#select) | Select의 칩형 별칭 — `color`(8색) · `weight` 추가 |
| [Checkbox / CheckboxGroup](https://love9320-glitch.github.io/enterprise-design-system/#checkbox) | `checked/onChange` · `label` / Group: `items` `value(배열)/onChange` `direction` |
| [Radio / RadioGroup](https://love9320-glitch.github.io/enterprise-design-system/#radio) | Checkbox와 동일 패턴(단일 선택) |
| [Switch](https://love9320-glitch.github.io/enterprise-design-system/#switch) | `checked/onChange` · `label` · `disabled` |
| [DatePicker / DateField / TimeField](https://love9320-glitch.github.io/enterprise-design-system/#date-picker) | `mode`(single·range) · `value/onChange` · `disablePast/Future` `minDate/maxDate` / DateField: 인풋+팝오버 결합 · `variant`(box·text 인라인형) · `showIcon` |
| [SelectOrInput / PhoneField](https://love9320-glitch.github.io/enterprise-design-system/#input) | 셀렉트↔직접입력 겸용 · Phone은 하이픈 자동 |
| [Editor](https://love9320-glitch.github.io/enterprise-design-system/#editor) | `/editor` 서브패스 — `value/onChange(html)` · `mode`(edit·read·source) · `toolbar`(기능 선택) · `mergeFields` |

### 폼 구성 · 내비게이션

| 컴포넌트 | 핵심 props |
|---|---|
| [Label](https://love9320-glitch.github.io/enterprise-design-system/#label) | `size` · `color`(default·gray) · `required` · `disabled` |
| [Field](https://love9320-glitch.github.io/enterprise-design-system/#field) | `label` · `required` · `description` · `direction`(vertical·horizontal) · `labelWidth` — 라벨+컨트롤 레이아웃 |
| [Tabs](https://love9320-glitch.github.io/enterprise-design-system/#tabs) | `items[{value,label,icon?,tag?}]` · `value/onChange` · `variant`(hug·fill) · `rightSlot` |
| [SegmentedTabs](https://love9320-glitch.github.io/enterprise-design-system/#segmented-tabs) | `items` · `value/onChange` · `width` — 슬라이딩 pill |
| [Pagination](https://love9320-glitch.github.io/enterprise-design-system/#pagination) | `page/onChange` · `totalCount` `pageSize/onPageSizeChange` · `maxButtons` |
| [SideNavigation](https://love9320-glitch.github.io/enterprise-design-system/#side-navigation) | `width`(180·220·260) · `showAdd/onAdd` · 버튼: `selected` `icon` `showNewTag` |

### 데이터 표시 · 오버레이

| 컴포넌트 | 핵심 props |
|---|---|
| [Table](https://love9320-glitch.github.io/enterprise-design-system/#table) | `columns[{key,label,width?,render?,filter?,headerMenu?}]` · `rows` · `selectable`+`selectedIds/onSelectChange` · `sort/filters`(controlled 가능) · `maxHeight`(sticky 헤더) · `bordered` · `draggableRows`+`onRowsReorder`(행 드래그, `dragHandleColKey`로 그립을 셀 안에) |
| [Tag / NewTag](https://love9320-glitch.github.io/enterprise-design-system/#tag) | `color`(blue·red·gray·black) · `width` / NewTag: 원형 N 뱃지 |
| [Chip](https://love9320-glitch.github.io/enterprise-design-system/#chip) | `color`(8색) · `onRemove`(X 버튼) |
| [Tooltip / Divider / ScrollArea](https://love9320-glitch.github.io/enterprise-design-system/#tooltip-scrollbar) | Tooltip: `variant` `beak` / Divider: `direction` `color` / ScrollArea: `maxHeight` 오버레이 스크롤 |
| [Accordion / AccordionItem](https://love9320-glitch.github.io/enterprise-design-system/#accordion) | Item: `title` · `defaultOpen/open` · `nameEditable/onTitleChange` · `deletable/onDelete` |
| [Modal 계열](https://love9320-glitch.github.io/enterprise-design-system/#modal) | `Modal`(범용)·`FormModal`(취소/저장+form)·`AlertModal`·`ConfirmModal`(재확인 체크) — 공통: `open/onClose` · `title` · `size`(sm~4xl·fill) · `confirmText/onConfirm` · `footerStart`. 포커스 트랩·복원 내장 |
| [Popover / PopoverMenu / List](https://love9320-glitch.github.io/enterprise-design-system/#option-list) | Popover: `trigger` + children(close 렌더 함수) · PopoverMenu: `footer`(확인/취소·전체선택) `topArea`(검색) · List: `radio/checkbox` `selected` `rightButton` |
| [FileUpload· / ImageUpload·](https://love9320-glitch.github.io/enterprise-design-system/#upload-menu) | 버튼+메뉴 세트 — `files/onAdd/onDelete` · `maxCount` `accept` |

### 템플릿

| 컴포넌트 | 용도 |
|---|---|
| [TableTemplate](https://love9320-glitch.github.io/enterprise-design-system/#table-template) | 툴바(제목·버튼·셀렉트·검색)+테이블+페이지네이션 일체형 |
| [FormTemplateA](https://love9320-glitch.github.io/enterprise-design-system/#form-template) | 여백 그리드형 폼 레이아웃(12칸 그리드 + Field) — 구 FormTemplate(v0.2.0 개명) |
| [FormTemplateB](https://love9320-glitch.github.io/enterprise-design-system/#form-template) | 테이블형 폼 박스 — 1px 헤어라인 셀 + 투명 계열 컨트롤 + 영역 채움 버튼 셀 |
| [SideNavigationTemplate](https://love9320-glitch.github.io/enterprise-design-system/#side-nav-template) | 좌 내비 + 우 콘텐츠 슬롯 · 메뉴 추가/이름 수정/삭제(editable) |
| [JobPositionTemplate](https://love9320-glitch.github.io/enterprise-design-system/#job-position-template) | 채용 분야 설정 — 기준 카드 조합 → 칩 테이블 등록(검증·엑셀 대량 등록·행 드래그) |
| [JobPostingTemplate](https://love9320-glitch.github.io/enterprise-design-system/#job-posting-template) | 채용 공고 설정 — 다중 공고 폼(FormTemplateB) + 채용 분야 등록 모달 왕복 + 등록 테이블 |
| [ScreeningBuilderTemplate](https://love9320-glitch.github.io/enterprise-design-system/#screening-builder-template) | 조건 카드 + 수식/자연어 빌더(함수 그룹핑·복수 조건·개별설정) |
| [NoticeWritingTemplate](https://love9320-glitch.github.io/enterprise-design-system/#notice-template) | `/editor` 서브패스 — 채널 탭+에디터 안내문 작성 |

### 기능 훅·유틸 (커스텀용)

`usePopoverPosition` · `useOutsideDismiss` · `useFocusTrap` · `usePanelKeyboard` · `useHoverTooltip` · `popoverLayers` · `Slot` · `applySort/applyColumnFilters/compareValues` · `iconCellWidth` · `formatDate/formatDateTime/formatDateTimeRange` · `formatPhoneNumber` — 용도·조립 예시는 [커스텀 가이드](https://love9320-glitch.github.io/enterprise-design-system/#customization) 3단계 참조.

## 규칙·문서

컴포넌트 사용 규칙과 설계 원칙(토큰 경유·완전 옵션화 등)은 패키지에 동봉되지 않고 **문서 사이트의 "디자인시스템 규칙" 섹션**에서 항상 최신 버전으로 제공합니다.

## 변경 내역

### v0.2.0 (2026-07-28)

**⚠️ Breaking**
- `FormTemplate` → **`FormTemplateA`로 개명** — import 이름을 바꿔 주세요. (여백 그리드형 폼, 기능 동일)

**신규**
- **`FormTemplateB`** — 테이블형 폼 박스: 12칸 그리드 셀이 1px 헤어라인으로 나뉘는 외곽선+그림자 박스. 투명 계열 컨트롤 주입, `flush` 셀 + Button `area`로 영역 채움 버튼 셀 구성
- **`JobPostingTemplate`** — 채용 공고 설정: 다중 공고 폼(추가/삭제·순번 고정) + 채용 분야 등록 모달 왕복(재오픈 유지·교체 저장) + 등록 테이블(행 드래그·jobda 매칭·사용 스위치)
- Button **`area`**(부모 영역 채움 — 셀 안 버튼), Input **`variant="transparent"`**(박스·링 없는 투명 인풋), DateField **`variant="text"`**(인라인형)·**`showIcon`**, Label **`color="gray"`**, Table **`draggableRows`/`onRowsReorder`/`dragHandleColKey`/`rowDragLabel`**(행 드래그 순서 변경), TableTemplate 행 드래그 패스스루

**개선**
- 인라인 계열(Select text·DateField text·DatePicker 연.월) hover 통일 — 밑줄 제거, 텍스트 gray 300 전환
- JobPositionTemplate 저장 검증 확장 — 기준·값·jobda 매칭 미선택 시 "필수 선택" 툴팁 안내
- Field 가로 레이아웃 라벨 세로 중앙 정렬 + helper 별도 행, Label 행간=텍스트 사이즈 토큰
- Calendar 이전/다음 달(muted, gray 250)과 선택 불가(disabled, gray 100) 상태·색 분리
- 신규 토큰: `job-posting-template/*` · `label-field/gray-text` · `calendar/disabled-text` · `leading-12~15`
- lucide-react 1.27.0 (DatabaseArrowDown 등 최신 아이콘)

### v0.1.x
- 0.1.1 — Editor(Tiptap)를 `./editor` 서브패스로 분리(메인 엔트리 tiptap 무의존)
- 0.1.0 — 최초 공개(컴포넌트·토큰·preset·styles.css·타입)

## License

ATS
