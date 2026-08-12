# @gusun/design-system

코드↔Figma가 1:1로 동기화된 **ATS 디자인 시스템** — 토큰 기반 React 컴포넌트 라이브러리입니다. 60+ 컴포넌트와 9종 템플릿, 디자인 토큰을 TypeScript(strict)로 제공합니다.

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

이 한 장에는 컴포넌트 스타일뿐 아니라 **토큰 유틸리티 클래스**(`gap-spacing-5` · `p-spacing-7` · `text-font-icon-4` · `bg-base-white` 등 스페이싱·권장 컬러 전 조합)도 포함되어 있어(v1.3.0), 데모 사이트의 코드 예제를 여러분 마크업에 그대로 복사해 써도 스타일이 온전히 적용됩니다.

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

**③ (선택) shadow-root 스타일 격리 임베드** — 앱을 shadow-root 안에 넣어 스타일을 격리하는 경우, 모달·팝오버·드롭다운·툴팁 같은 포탈 요소가 기본값(`document.body`)으로 렌더되면 격리 스타일을 받지 못합니다. shadow-root 안에 포탈용 요소를 만들고 `PortalProvider`로 앱을 감싸세요(미사용 시 기존과 동일하게 body 포탈):

```jsx
import { PortalProvider } from '@gusun/design-system';

const shadow = host.attachShadow({ mode: 'open' });
// shadow 안에 styles.css 주입 + appRoot/portalRoot div 생성
createRoot(appRoot).render(
  <PortalProvider container={portalRoot}>
    <App />
  </PortalProvider>
);
```

**Tailwind 프로젝트라면** CSS 대신 preset으로 토큰을 통합할 수 있습니다:

```js
// tailwind.config.js
import preset from '@gusun/design-system/preset';
export default {
  presets: [preset],
  content: ['./src/**/*.{js,jsx,ts,tsx}', './node_modules/@gusun/design-system/dist-lib/**/*.js'],
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
| `@gusun/design-system/components.json` | **AI가 읽는 컴포넌트 매니페스트** — 98개 컴포넌트의 props·기본값·사용 규칙·데모 위치 | AI 코딩 도구에 컨텍스트로 제공 |

동작 훅(`usePopoverPosition`·`useOutsideDismiss`·`useFocusTrap`·`usePanelKeyboard` 등)도 메인 엔트리에서 export됩니다 — 디자인은 직접 만들되 동작만 재사용할 수 있습니다(자세한 건 커스텀 가이드 3단계).

**AI 코딩 도구와 함께 쓰기** — `components.json`은 이 패키지의 모든 컴포넌트를 기계가 읽는 형태(이름·props·타입·기본값·사용 규칙·표준 카피·조립 순서)로 담고 있습니다. Claude Code·Copilot 등 AI 도구에게 `node_modules/@gusun/design-system/dist-lib/components.json`을 읽게 하면, 이 시스템의 규칙에 맞는 코드를 처음부터 정확히 생성합니다. TypeScript 소스와 규칙서에서 배포 시점에 자동 생성되므로 항상 코드와 일치합니다.

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
| [Input](https://love9320-glitch.github.io/enterprise-design-system/#input) | `value/onChange` · `placeholder` · `size`(32·22) · `variant`(solid·transparent — 투명은 박스·링 없이 텍스트만) · `width` · `disabled` `readOnly` · `error`+`errorMessage`(툴팁 — 기본 표준 카피 "필수 입력사항입니다." 자동, 텍스트 red 400, aria-describedby 연결) · `inputProps` |
| [TextArea](https://love9320-glitch.github.io/enterprise-design-system/#textarea) | Input과 동일 계열 + 자동 높이·오버레이 스크롤바 · `maxLength` 카운터 |
| [SearchBar](https://love9320-glitch.github.io/enterprise-design-system/#search-bar) | `value/onChange` · `onSubmit(value)` · `placeholder` · `width` |
| [Select](https://love9320-glitch.github.io/enterprise-design-system/#select) | `options[{value,label,disabled?}]` · `value/onChange({target:{value}})` · `multiple`(+`confirm` 확인 푸터) · `searchable` · `variant`(box·text·chip) · `label`(내부 라벨) · `placement` `menuWidth` |
| [SelectChip](https://love9320-glitch.github.io/enterprise-design-system/#select) | Select의 칩형 별칭 — `color`(8색) · `weight` 추가 |
| [Checkbox / CheckboxGroup](https://love9320-glitch.github.io/enterprise-design-system/#checkbox) | `checked/onChange` · `label` / Group: `items` `value(배열)/onChange` `direction` |
| [Radio / RadioGroup](https://love9320-glitch.github.io/enterprise-design-system/#radio) | Checkbox와 동일 패턴(단일 선택) |
| [Switch](https://love9320-glitch.github.io/enterprise-design-system/#switch) | `checked/onChange` · `label` · `disabled` |
| [DatePicker / DateField / TimeField](https://love9320-glitch.github.io/enterprise-design-system/#date-picker) | `mode`(single·range) · `value/onChange` · `disablePast/Future` `minDate/maxDate` / DateField: 인풋+팝오버 결합 · `variant`(box·text 인라인형) · `showIcon` |
| [ConditionOrderSlot](https://love9320-glitch.github.io/enterprise-design-system/#condition-order-slot) | 조건 카드 순서 편집 — `items[{id,title,enabled}]` · 드래그 순서 변경 + 사용 스위치 · `onReorder/onEnabledChange` |
| [SelectOrInput / PhoneField](https://love9320-glitch.github.io/enterprise-design-system/#input) | 셀렉트↔직접입력 겸용 · Phone은 하이픈 자동 |
| [Editor](https://love9320-glitch.github.io/enterprise-design-system/#editor) | `/editor` 서브패스 — `value/onChange(html)` · `mode`(edit·read·source) · `toolbar`(기능 선택) · `mergeFields` |

### 폼 구성

| 컴포넌트 | 핵심 props |
|---|---|
| [Label](https://love9320-glitch.github.io/enterprise-design-system/#label) | `size` · `color`(default·gray) · `required` · `disabled` |
| [Field](https://love9320-glitch.github.io/enterprise-design-system/#field) | `label` · `required` · `description` · `direction`(vertical·horizontal) · `labelWidth` — 라벨+컨트롤 레이아웃 |

### 내비게이션

| 컴포넌트 | 핵심 props |
|---|---|
| [Tabs](https://love9320-glitch.github.io/enterprise-design-system/#tabs) | `items[{value,label,icon?,tag?}]` · `value/onChange` · `variant`(hug·fill) · `rightSlot` |
| [SegmentedTabs](https://love9320-glitch.github.io/enterprise-design-system/#segmented-tabs) | `items` · `value/onChange` · `width` — 슬라이딩 pill |
| [Pagination](https://love9320-glitch.github.io/enterprise-design-system/#pagination) | `page/onChange` · `totalCount` `pageSize/onPageSizeChange` · `maxButtons` |
| [Stepper](https://love9320-glitch.github.io/enterprise-design-system/#stepper) | 라인형 스텝 표시기: `items[{title,description?,disabled?}]` · `value`(현재 스텝 — 이전=완료·이후=대기 자동) · `onStepClick`(지정 시 클릭 내비게이션) · 양끝 연결선 자동 숨김 |
| [SideNavigation](https://love9320-glitch.github.io/enterprise-design-system/#side-navigation) | `width`(180·220·260) · `showAdd/onAdd` · 버튼: `selected` `icon` `showNewTag` |
| [Lnb](https://love9320-glitch.github.io/enterprise-design-system/#lnb) | `groups`(1/2depth+sub) · `value/onChange` · `siteTitle` · `width/height`(지정 시 내부 스크롤) · `defaultExpanded` · 메뉴: `icon` `iconArea` `wrap` `disabled` |
| [Gnb / GnbGroup / GnbLogo](https://love9320-glitch.github.io/enterprise-design-system/#gnb) | 글로벌 내비 바(그룹 조립): GnbGroup을 자유 추가/삭제(그룹 사이 1px 갭 자동 구분) · Group: `fill` `justify`(start·between·end·center) `gap` · Gnb: `bar`(단독 배치 크롬 54px+구분선) · 구분선은 그룹 안 자유 배치 |

### 레이아웃

| 컴포넌트 | 핵심 props |
|---|---|
| [AppLayout](https://love9320-glitch.github.io/enterprise-design-system/#layout) | 사이트 골격(템플릿 상위 계층): `gnb`(54px+구분선 1px — Gnb 조립 권장)/`lnb`/`rightPanel`(RightPanel 조립 권장) 슬롯(null=미표시) · `panelMode`(auto·push·overlay·fullscreen — auto는 폭 1440 기준 반응형)+`panelBreakpoint`+`onPanelClose`(ESC 닫기) · `pageWidth`(readable 840·standard 1200·wide 1440·fluid)+`pagePadding`(24·32·40·none) · `lnbWidth`(180·220·260) · `rightPanelWidth`(360·480) |
| [Page / PageHeader](https://love9320-glitch.github.io/enterprise-design-system/#page) | 페이지 셸: PageHeader(타이틀 semibold 18+설명 행+우측 버튼 슬롯 2곳+하단 Divider, 패딩 20 고정) + body 슬롯(p 20·gap 20 — 템플릿 조립). `title/description/actions/descriptionActions` · `stickyHeader`(스크롤 시 헤더 상단 고정) · `header`(커스텀 교체) — 폭은 AppLayout Page Container가 결정 |
| [RightPanel](https://love9320-glitch.github.io/enterprise-design-system/#right-panel) | 보조 작업 패널(헤더/바디/푸터 3단+1px 헤어라인): `title`(null=헤더 미표시) · `onClose`(닫기 X) · `footer`(자유 슬롯, null=미표시) · `width`(360·480·fill) · `bodyPadding` — 바디는 내부 스크롤 |

### 데이터 표시

| 컴포넌트 | 핵심 props |
|---|---|
| [Table](https://love9320-glitch.github.io/enterprise-design-system/#table) | `columns[{key,label,width?,render?,filter?,headerMenu?}]` · `rows` · `selectable`+`selectedIds/onSelectChange` · `sort/filters`(controlled 가능) · `maxHeight`(sticky 헤더) · `bordered` · `draggableRows`+`onRowsReorder`(행 드래그, `dragHandleColKey`로 그립을 셀 안에) |
| [Tag / NewTag](https://love9320-glitch.github.io/enterprise-design-system/#tag) | `color`(8색 — blue·red·gray·black·green·violet·pink·orange) · `width` / NewTag: 원형 N 뱃지(blue·red·black) |
| [Chip](https://love9320-glitch.github.io/enterprise-design-system/#chip) | `color`(8색) · `onRemove`(X 버튼) |
| [Avatar](https://love9320-glitch.github.io/enterprise-design-system/#avatar) | `src`(있으면 사진, 없으면 이니셜) · `initial` · `size`(24~56 5단) · `interactive`(false=hover·클릭·포커스 차단, 정적 표시) · `onClick` |
| [Tooltip / Divider / ScrollArea](https://love9320-glitch.github.io/enterprise-design-system/#tooltip-scrollbar) | Tooltip: `variant` `beak` / Divider: `direction` `color` / ScrollArea: `maxHeight` 오버레이 스크롤 |
| [Accordion / AccordionItem](https://love9320-glitch.github.io/enterprise-design-system/#accordion) | Item: `title` · `defaultOpen/open` · `nameEditable/onTitleChange` · `deletable/onDelete` |

### 오버레이 · 메뉴

| 컴포넌트 | 핵심 props |
|---|---|
| [Modal 계열](https://love9320-glitch.github.io/enterprise-design-system/#modal) | `Modal`(범용)·`FormModal`(취소/저장+form)·`AlertModal`·`ConfirmModal`(재확인 체크) — 공통: `open/onClose` · `title` · `size`(sm~4xl·fill) · `confirmText/onConfirm` · `footerStart`. 포커스 트랩·복원 내장. **고급: `Modal.Root/Header/Body/Footer` 조립형 병행(v1.6.0)** — props에 없는 배치(헤더 뱃지·푸터 자유 구성)가 필요할 때, 슬롯 스킨은 고정이라 일관성 유지 |
| [Popover / PopoverMenu / List](https://love9320-glitch.github.io/enterprise-design-system/#option-list) | Popover: `trigger` + children(close 렌더 함수) · PopoverMenu: `footer`(확인/취소·전체선택) `topArea`(검색) · List: `radio/checkbox` `selected` `rightButton` |
| [FileUpload· / ImageUpload·](https://love9320-glitch.github.io/enterprise-design-system/#upload-menu) | 버튼+메뉴 세트 — `files/onAdd/onDelete` · `maxCount` `accept` |
| PortalProvider | `container`(포탈 렌더 컨테이너 — 미지정 시 `document.body`) — 모달·팝오버·드롭다운·툴팁의 포탈 위치를 일괄 지정. shadow-root 스타일 격리 임베드용(빠른 시작 ③) |

### 템플릿

| 컴포넌트 | 용도 |
|---|---|
| [TableTemplate](https://love9320-glitch.github.io/enterprise-design-system/#table-template) | 툴바(제목·버튼·셀렉트·검색)+테이블+페이지네이션 일체형 |
| [FormTemplateA](https://love9320-glitch.github.io/enterprise-design-system/#form-template) | 여백 그리드형 폼 레이아웃(12칸 그리드 + Field) — 구 FormTemplate(v0.2.0 개명) |
| [FormTemplateB](https://love9320-glitch.github.io/enterprise-design-system/#form-template) | 테이블형 폼 박스 — 1px 헤어라인 셀 + 투명 계열 컨트롤 + 영역 채움 버튼 셀 |
| [MultiStepFormTemplate](https://love9320-glitch.github.io/enterprise-design-system/#multi-step-form-template) | Stepper + 스텝별 콘텐츠 주입형 멀티 스텝 폼 — `steps[{title,description?,content}]` · `value/defaultValue/onChange` · `clickableSteps` · `keepMounted`(비활성 스텝 입력 상태 보존) |
| [SideNavigationTemplate](https://love9320-glitch.github.io/enterprise-design-system/#side-nav-template) | 좌 내비 + 우 콘텐츠 슬롯 · 메뉴 추가/이름 수정/삭제(editable) |
| [JobPositionTemplate](https://love9320-glitch.github.io/enterprise-design-system/#job-position-template) | 채용 분야 설정 — 기준 카드 조합 → 칩 테이블 등록(검증·엑셀 대량 등록·행 드래그) |
| [JobPostingTemplate](https://love9320-glitch.github.io/enterprise-design-system/#job-posting-template) | 채용 공고 설정 — 다중 공고 폼(FormTemplateB) + 채용 분야 등록 모달 왕복 + 등록 테이블 |
| [ScreeningBuilderTemplate](https://love9320-glitch.github.io/enterprise-design-system/#screening-builder-template) | 조건 카드 + 수식/자연어 빌더(함수 그룹핑·복수 조건·개별설정) |
| [NoticeWritingTemplate](https://love9320-glitch.github.io/enterprise-design-system/#notice-template) | `/editor` 서브패스 — 채널 탭+에디터 안내문 작성 |

### 기능 훅·유틸 (커스텀용)

`usePopoverPosition` · `useOutsideDismiss` · `useFocusTrap` · `usePanelKeyboard` · `useHoverTooltip` · `popoverLayers` · `Slot` · `applySort/applyColumnFilters/compareValues` · `iconCellWidth` · `formatDate/formatDateTime/formatDateTimeRange` · `formatPhoneNumber` · `REQUIRED_INPUT_MESSAGE/REQUIRED_SELECT_MESSAGE/INVALID_FORMAT_MESSAGE`(벨리데이션 표준 카피) — 용도·조립 예시는 [커스텀 가이드](https://love9320-glitch.github.io/enterprise-design-system/#customization) 3단계 참조.

## 규칙·문서

컴포넌트 사용 규칙과 설계 원칙(토큰 경유·완전 옵션화 등)은 패키지에 동봉되지 않고 **문서 사이트의 "디자인시스템 규칙" 섹션**에서 항상 최신 버전으로 제공합니다.

복합 위젯(Modal·Select·DatePicker·Table)의 **접근성 계약**(역할·키보드·포커스·ARIA)은 [ACCESSIBILITY.md](./ACCESSIBILITY.md)에 명문화돼 있고 패키지에 동봉되며, `components.json`의 `accessibility` 필드로도 제공됩니다(AI 도구용).

## 릴리스·호환 정책

**버전 규칙 (semver)**
- **major**: 기존 코드 수정이 필요한 변경 — export 제거·개명, prop 제거·의미 변경, 기본 동작 변경, peerDependencies 최소 버전 상향
- **minor**: 기존 코드에 영향 없는 추가 — 새 컴포넌트/prop/서브패스, 새 variant, 접근성 속성 추가
- **patch**: 버그·스타일 수정, 문서. 시각 결과가 달라지는 스타일 수정은 변경 내역에 명시합니다

**deprecated 절차**: 제거가 필요한 API는 최소 1개 minor 버전 동안 유지하며 변경 내역과 데모 페이지에 대체 경로를 안내한 뒤, 다음 major에서 제거합니다. (판례: v0.2.0 `FormTemplate`→`FormTemplateA` 개명은 1.0 이전 예외였습니다)

**지원 환경**
- React **19+** (`react`/`react-dom` peer), TypeScript 5+ 권장(JS 사용 가능)
- 브라우저: 최신 Chrome·Edge·Safari·Firefox (에버그린). 데스크톱 1440px 기준으로 설계·검증하며 모바일 대응은 범위 밖입니다
- `./editor` 서브패스만 Tiptap v3 peer가 필요하고, 메인 엔트리는 Tiptap 없이 동작합니다(CI에서 소비자 앱 설치·빌드로 상시 검증)

**배포 전 자동 검증**: 모든 PR에서 타입·린트·테스트(Vitest+RTL+axe)·**공개 API 변경 감지**(export·props 스냅샷 비교 — 의도치 않은 breaking 차단, `api-surface.json` diff가 semver 판정 근거)·`npm pack` 산출물을 실제 소비자 앱에 설치→빌드하는 스모크가 실행되고, 배포 후에는 문서 사이트를 실제 브라우저로 여는 스모크가 실행됩니다.

## 변경 내역

### v1.8.0 (2026-08-12)

**접근성(스크린리더·키보드) 보강**
- Select: 트리거에 접근 이름(`ariaLabel` 옵션, 미지정 시 label/placeholder 자동) + `aria-controls`·`aria-activedescendant` 연결(ARIA 1.2 콤보박스 계약), **방향키 이동이 disabled 옵션을 건너뜁니다**
- Table: 정렬 컬럼 헤더에 `aria-sort`(ascending/descending) 자동 표기, 행 선택 체크박스 접근 이름 커스텀 `getRowSelectionAriaLabel`(예: "김서연 행 선택"), 전체 선택 = "전체 선택"
- Modal: `aria-labelledby` 제목 연결 + `initialFocus` 옵션(열릴 때 첫 포커스 지정) / Button: `aria-busy`(loading 시)
- List/ListGroup: listbox·option 역할 계약 정비(`aria-selected` 등), FileUpload 파일 행은 list/listitem, 내비 landmark 이름 중복 해소, Pagination 행 수 Select 접근 이름

**품질 게이트(소비자 영향 없음)**
- Vitest+RTL+axe 테스트 72개가 PR 게이트로 상시 실행(키보드 흐름·ARIA 계약·axe 위반 0 검사)
- 배포 후 실제 사이트를 브라우저로 열어 검사하는 자동 스모크 추가

### v1.7.0 (2026-08-12)

**Input 입력 타입(type) — 지원서 폼 대응**
- `type` 옵션 신설: `number`(숫자만 + `decimal` 소수점·`comma` 천단위 자동) · `password`(마스킹+눈 토글, 점은 크고 중앙에 렌더) · `email`/`url`(blur 시 형식 검증 → "잘못된 양식입니다." 툴팁) · `tel`(하이픈 자동) · `korean`/`english`(허용 문자 필터, IME 조합 안전)
- `unit` 옵션: 우측 단위 suffix("원"·"점"·"년") — 회색 고정
- Figma `input unit`/`input password` 계열 4세트 Code Connect 연결

**components.json — AI가 읽는 컴포넌트 매니페스트 (신규 엔트리)**
- 98개 컴포넌트의 props·타입·기본값·사용 규칙·표준 카피·조립 순서를 기계가 읽는 JSON으로 동봉
- AI 코딩 도구(Claude Code·Copilot 등)에 `dist-lib/components.json`을 읽히면 이 시스템 규칙에 맞는 코드를 정확히 생성합니다
- TypeScript 소스 + 규칙서 카탈로그에서 배포 시점에 자동 생성 — 항상 코드와 일치

### v1.6.0 (2026-08-11)

**Modal 조립형 API — 두 API 병행 제공**
- 기존 props 방식은 그대로(90% 케이스), props에 없는 배치가 필요할 때 쓰는 고급 API 추가:
  ```jsx
  <Modal.Root open={open} onClose={close}>
    <Modal.Header title="지원자 상세"><Tag color="blue">심사중</Tag></Modal.Header>
    <Modal.Body>본문 자유 구성</Modal.Body>
    <Modal.Footer className="justify-between">…</Modal.Footer>
  </Modal.Root>
  ```
- 기존 Modal이 이 조립형 위에서 구현되어 두 API의 비주얼·동작(딤·ESC·포커스 트랩·푸터 안 가림)이 항상 동일합니다. 슬롯은 패딩·배경·타이포가 고정된 "스타일 슬롯"이라 자유 배치에도 디자인 일관성이 유지됩니다. (named export `ModalRoot/ModalHeader/ModalBody/ModalFooter`도 제공)

**DOM 상태 꼬리표(data-state) — 24개 컴포넌트**
- 컴포넌트가 자기 상태를 DOM에 표기합니다(자동 부착, 시각 변화 없음): `data-state="error|disabled|readonly|…"`(배타 상태 하나·우선순위 보장) + 독립 축 `data-variant/size/open/loading/disabled`, 체크류는 `checked/unchecked`, Tag·Chip은 `data-color`
- DevTools에서 상태를 바로 읽고, 테스트 셀렉터(`[data-state="selected"]`)로 활용하세요. 적용: 입력 계열 전체·Table 행·체크류·탭류·내비류·Accordion 등 (각 데모 페이지 옵션표의 "(DOM 상태 꼬리표)" 행 참고)

### v1.5.0 (2026-08-10)

**PortalProvider — shadow-root 스타일 격리 대응**
- `PortalProvider`/`usePortalContainer` 신설 — 포탈(모달·팝오버·드롭다운·툴팁) 렌더 컨테이너를 지정(미지정 시 `document.body` — 기존 동작 무변경). shadow-root 임베드 시 앱을 감싸면 포탈이 shadow 안에 렌더돼 격리 스타일을 그대로 받습니다(빠른 시작 ③)
- 포탈 9곳 적용: Modal · Popover · Select(드롭다운+에러 툴팁) · DatePicker · DateField · TimeField · TwoDepthList · TruncatingText · useHoverTooltip
- shadow DOM 동반 보정: 외부클릭 판정 `composedPath()` 복원(내부 클릭 오닫힘 방지) · 포커스 트랩/blur 판정 `deepActiveElement` · shadow 안 컨테이너 스크롤 시 드롭다운 위치 추적(ShadowRoot capture 리스너) · Select 에러 툴팁 재측정 옵저버 루트 관찰

**기타**
- Page `paddingTop`('none'/'16'/'24'/'32' 기본) — 페이지 상단 여백 옵션화
- ScrollArea 오버레이 thumb z-20 — sticky 헤더(PageHeader 등)에 스크롤바가 가려지던 문제 해소
- TableTemplate 상단 영역·테이블·페이지네이션 세로 갭 8→12(spacing-6)

### v1.4.0 (2026-08-06)

**로딩 정책 일원화**
- `LoadingIndicator` 신설(스피너+"불러오는 중…") + 컨테이너 최초 로딩 옵션 4종: Page `loading` · Modal `bodyLoading` · RightPanel `loading` · PopoverMenu `loading` — 최초 로딩은 바디 중앙 표시, 데이터 전체 준비 후 일괄 렌더(재조회는 Table `loading` 등 부분 로딩)
- FormTemplateB `subtitleTrailing` 슬롯(subtitle 로우 우측 버튼 등) + subtitle 우측 패딩 12

### v1.3.0 (2026-08-06)

**Tailwind 없는 사용처 완전 지원**
- **`styles.css`에 토큰 유틸리티 클래스 포함** — 스페이싱 유틸(p/px/py/m/mx/my/gap 등 17계열 × 간격 토큰 전 조합)과 권장 컬러 그룹(base·font-icon·label-field·divider·heading × text/bg/border)을 항상 생성. **Tailwind를 안 쓰는 프로젝트도 `import '@gusun/design-system/styles.css'` 한 줄로 문서·데모 예제의 마크업이 그대로 동작**합니다(기존에는 컴포넌트 스타일만 완전했고, 소비자 마크업의 토큰 유틸은 빠질 수 있었음)
- preset safelist도 동일하게 확장 — Tailwind preset 사용처에서도 토큰 유틸이 purge와 무관하게 항상 존재

**데모 사이트 = 사용처 예제**
- 데모 사이트의 모든 코드 예제가 **소비자 import 문법(`@gusun/design-system` · `/editor` · `/tokens`)과 TypeScript**로 전환 — 데모의 코드를 복사하면 여러분 프로젝트에서 수정 없이 동작합니다

**타입·API**
- `TableTemplateColumn` 타입 export — 컬럼 정의를 `satisfies TableTemplateColumn[]` 등으로 정식 타이핑 가능
- Input `inputProps` / TextArea `textareaProps` 타입이 `ref` 전달 허용(React 19 ref-as-prop)

### v1.2.3 (2026-08-06)
- **FormTemplateB 클립 제거** — 에러 툴팁이 폼 박스 경계에 잘리던 문제 해결(`overflow-clip` 제거, 모서리 라운딩은 모서리 셀 단위 계산 적용으로 유지 — 폼 크기 변화 없음)
- DateField `variant="text"` 에러 시 텍스트가 red로 바뀌지 않던 버그 수정
- 데모: 대량 발송 Step 1 벨리데이션 게이트 예제(필수 입력 미충족 시 다음 단계 차단 + 표준 카피 툴팁)

### v1.2.2 (2026-08-06)
- 내부 소스 계층 분리(components/layouts/templates) — **공개 API(배럴·서브패스)는 그대로**, 소비자 코드 영향 없음. Figma Code Connect 소스 경로 동기화

### v1.2.1 (2026-08-06)
- MultiStepFormTemplate가 메인 엔트리에서 export되지 않던 누락 패치

### v1.2.0 (2026-08-06)

**신규**
- **`Stepper`** — 라인형 스텝 표시기: `items[{title,description?,disabled?}]` · `value`(현재 스텝 — 이전 스텝 완료·이후 대기 자동 계산) · `onStepClick`(클릭 내비게이션), 상태 4종(default/progress/complete/disabled) 토큰, 첫/마지막 스텝 양끝 연결선 자동 숨김
- **`MultiStepFormTemplate`** — Stepper + 스텝별 콘텐츠 주입 슬롯 멀티 스텝 폼: `steps[].content`에 폼/테이블 자유 조립, controlled(`value/onChange`)·uncontrolled(`defaultValue`) 모두 지원, `clickableSteps` · `keepMounted`(스텝 전환 시 입력 상태 보존)

**개선**
- FormTemplateB — `title/subtitle` 옵션(박스 상단 타이틀 영역), 셀 상하 패딩 12/20 선택(`paddingTop/paddingBottom` — 템플릿 기본값+셀별 오버라이드), 셀 `disabled`(라벨 dim), 좌우 패딩 20으로 조정, 그림자 없는 변형(Figma 동기화)
- Divider `marginTop/marginBottom`(4~32px 토큰 키) — 구분선 단위 상하 여백 조정
- Select `menuWidth="trigger"`(팝오버 메뉴를 트리거 폭에 맞춤) · 옵션 `rightSlot`(태그 등 우측 슬롯)
- Button — 숨김 상태(`display:none`) 마운트 시 로딩 width가 0으로 고정되던 문제 가드
- 데모: '페이지' 카테고리 신설 — 발송 이력(목록↔상세)·대량 메일/문자 발송(3스텝 실전 예제: 매핑 코드 팝오버·테스트 발송·예약 발송 확인 모달·벨리데이션)

### v1.1.0 (2026-08-04)
- **`Page` / `PageHeader` 신설** — 페이지 셸 컴포넌트. PageHeader(타이틀·설명 행·우측 버튼 슬롯 2곳·하단 Divider, 패딩 20 스케일 고정, 신규 `heading/bg` 토큰) + Page body 슬롯(p 20·gap 20, 템플릿 조립 영역). `sticky`/`stickyHeader`로 스크롤 시 헤더 상단 고정
- **`Tag` 8색 확장** — green·violet·pink·orange 추가(Chip과 동일 팔레트, 함수 계열 색 대응)
- `JobPostingTemplate` 타이틀을 DS Label 컴포넌트로 교체(Figma 동기화)
- 컴포넌트·템플릿 전량 **Code Connect CLI 매핑 완비(112건)** — 코드 동작 무관, Figma Dev Mode 연동 강화
- 데모: Page 데모 페이지 신설, 레이아웃 데모 본문을 Page로 조립(헤더 상단 고정 토글 포함), Component Colors에 Page Header 그룹 추가

### v1.0.2 (2026-07-31)
- 문서 업데이트 — 컴포넌트 API 그룹을 데모 사이트 내비게이션 구조와 일치(액션/입력/폼 구성/내비게이션/데이터 표시/오버레이·메뉴/레이아웃/템플릿), Gnb를 내비게이션 그룹으로 이동, 누락됐던 ConditionOrderSlot 추가

### v1.0.1 (2026-07-31)
- 문서 업데이트 — 컴포넌트 API 표에 Gnb/GnbGroup/GnbLogo·RightPanel·Avatar 추가, AppLayout 최신 API 반영, 벨리데이션 표준 카피 상수 안내

### v1.0.0 (2026-07-31) — 정식 릴리스 🎉

레이아웃 시스템(AppLayout·Gnb·RightPanel)까지 갖춰 정식 버전으로 올립니다. npm 미배포였던 v0.3.0 변경 내역을 포함합니다.

**신규**
- **`Gnb` / `GnbGroup` / `GnbLogo`** — 글로벌 내비게이션 바(그룹 조립 구조): 그룹을 자유 추가/삭제, 그룹 사이 1px 갭으로 `layout/gnb-inline` 배경 노출, 구분선은 그룹 안 자유 배치, `bar` 모드(54px+하단 구분선 1px)
- **`RightPanel`** — 보조 작업 영역 표준 구조: 헤더(타이틀+닫기 X)/바디(내부 스크롤·자유 슬롯)/푸터(자유 슬롯) 3단+1px 헤어라인, 슬롯 null=영역 미표시, `width` 360/480/fill(Fullscreen)
- **`Avatar`** — 이미지/이니셜(text) 자동 전환, size 24~56 5단, hover(text=blue 500·image=오버레이), `interactive=false`(hover·클릭·포커스 차단, 정적 표시)
- AppLayout 통합 — GNB 영역 54px(+구분선 1px)·패널 슬롯 bare 개편(크롬은 Gnb/RightPanel 담당, ESC는 onPanelClose)

**변경**
- **Figma 변형 값 명명 규칙 통일** — 전 세트 변형 값 첫 글자 대문자(Default/Hover/…), Code Connect 매핑 동기화(코드 prop 값은 기존 소문자 API 그대로 — 소비자 코드 영향 없음)
- 신규 토큰: `layout/gnb-inline` · `right-panel/*` 3종 · `avatar/*` 5종(photo-inline 900-25)

### v0.3.0 (2026-07-30) — npm 미배포(코드 반영만, 본 릴리스에 포함)

**신규**
- **`AppLayout`** — 사이트 전체 구조 레이아웃(템플릿보다 한 단위 큰 계층): GNB(54px+구분선 1px)·LNB·Main Content·Right Panel 슬롯 조립. Content/Page 분리(`pageWidth` readable/standard/wide/fluid + `pagePadding` 24/32/40), Right Panel 3모드(`panelMode` push/overlay/fullscreen + `auto` 반응형 — 폭 1440 기준 자동 전환, `onPanelClose`로 닫기 버튼+ESC), Divider 1px 별도 점유 규칙. 데모 사이트 셸도 AppLayout으로 교체(도그푸딩)
- **`Lnb`** — 좌측 내비게이션 메뉴(1/2depth·서브메뉴, 사이트 타이틀 옵션, 내부 스크롤, 말줄임/전체 표시 옵션). 데모 사이트 사이드바 도그푸딩
- **벨리데이션 접근성** — 에러 툴팁을 입력과 `aria-describedby`로 연결하고 `role="alert"` 부여(스크린리더가 같은 문구 낭독). Input·Select·DateField·TimeField·TextArea 공통
- **벨리데이션 카피 표준 3종** — `utils/validationMessages`(`REQUIRED_INPUT_MESSAGE` "필수 입력사항입니다." / `REQUIRED_SELECT_MESSAGE` "필수 선택사항입니다." / `INVALID_FORMAT_MESSAGE` "잘못된 양식입니다.")를 export하고, 각 컴포넌트 `errorMessage`/`formatErrorMessage` **기본값**으로 적용 — `error=true`만 켜면 표준 문구 툴팁이 자동 표시

**변경 주의(동작 변화)**
- `errorMessage` 기본값이 `''`(툴팁 없음)에서 표준 카피로 바뀌어, **`error`만 주던 코드도 이제 툴팁이 뜹니다**(표시를 원치 않으면 `errorMessage=""` 지정)
- 벨리데이션 에러 상태의 필드 텍스트·플레이스홀더가 **red 400**으로 표시됩니다(`text-field/error-text` 토큰)

**개선**
- Lnb 상하 패딩 20px(Figma 동기화), 신규 토큰: `layout/*`(gnb·main·panel bg) · `text-field/error-text` · `spacing-13`(40px)
- 데모 사이트 페이지 폭 정책을 셸 일괄 관리로 개편(레이아웃 데모=Fluid+24 / 일반 페이지=1200+24), 레이아웃 새 창 미리보기(`#layout-preview`) 추가
- Code Connect 확대: Tabs 계열·Tooltip·SearchBar·Input(solid/transparent) CLI 매핑(누적 43건), 에러 카피 표준을 Figma 스니펫에도 반영

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
