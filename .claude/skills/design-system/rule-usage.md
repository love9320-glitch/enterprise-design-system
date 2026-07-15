# 규칙 사용 원장 (Rule Usage Ledger)

규칙을 **튜닝**하기 위한 기록 파일. 각 **세부 규칙 단위**로 (1) 얼마나 적용됐는지, (2) 최근 적용일, (3) 적용 중 애매했던/마찰이 있던 점을 누적한다. 많이 쓰이는 규칙은 다듬고, 안 쓰이는 규칙은 통합·삭제, 마찰 메모가 쌓인 규칙은 문구를 보완한다.

## 유지 방법 (중요)

- **자동 카운트 불가** — 규칙은 도구 호출이 아니라 추론 중 적용되므로 훅으로 셀 수 없다. 따라서 **작업이 끝날 때 클로드가 직접** 이 표를 갱신한다(규율 기반, best-effort).
- 갱신 단위: 해당 세부 규칙이 **그 작업의 판단을 실제로 좌우했을 때만** +1. 단순 언급은 세지 않는다.
- 마찰·애매 메모: 규칙이 모호하거나(해석 분기), 예외가 필요했거나, 다른 규칙과 충돌했을 때 **한 줄**로 누적(날짜 포함).
- 카운트는 **상대 빈도 신호**일 뿐 정밀치가 아니다. 과거치 보정은 세션 transcript 회고 스캔으로 일괄 가능.
- 규칙 식별은 **고유명**으로(번호는 변동 가능). 규칙 본문은 `SKILL.md`·`foundation.md`·`components.md`·`templates/*` 참조.
- **갱신 트리거 = 기능 단위 종료(빌드·lint 검증) 시점.** 소규모 수정 턴이 이어질 땐 놓치기 쉬우니 커밋/검증 때 몰아서라도 반드시 갱신한다(2026-07-14 누락 재발로 명문화).
- **기입 전 오늘 날짜를 확인**한다 — 07-13 작업을 07-16으로 오기입한 재발 사례 있음.

> 시드(seed): 아래 수치는 **2026-06-24 이 세션의 관찰 기준 초기값(추정)** 이다. 이후 작업에서 갱신한다.

## A. 공통 설계 원칙

| 세부 규칙 | 적용 | 최근 | 마찰·애매 메모 |
|---|---|---|---|
| 1a 컬러 Base→Semantic→컴포넌트 경유 | 12 | 07-15 | 시멘틱 신설 ask-정책 정착 — Figma 변수→base 정확 매핑(누락 0이면 ask 없이 신설)이 표준, 없는 중간값은 base 중간 키 신설. 상태별 시각 요소는 border 대신 오버레이(absolute). 07-13~14 스크리닝 토큰 5그룹(함수 계열 색=base 유채색 용처), 미확인 변수는 계열 패턴 유추+사용자 확인, 알파 라인=outline(규칙 19로 승격). 판례 원문 → rule-usage-archive.md §1a 07-15 칩 4색·underline 7색 확장 — 기존 유채색 사다리(400/100/50/150) 재적용으로 ask 없이 신설(base 유채색 풀스케일 덕). |
| 1b 하드코딩 HEX/rgba 금지 | 2 | 06-25 | 오버레이 dim을 임시 rgba로 그림 — 시멘틱 알파 변수로 바꿔야 함. 06-25 Component Colors 페이지의 .bg-checker 격자색에 #e3e3e3을 직접 씀 → gray.100 **토큰값 인라인**으로 정당화(Tooltip/ScrollArea 예외와 동일), 단 데모 보조 유틸이라 토큰화는 보류 — **'토큰값 인라인 예외'와 '하드코딩 금지' 경계가 또 등장** |
| 2a 등록 토큰만(spacing/round/border) | 12 | 07-06 | 등록 토큰만 정착 — 작성 전 토큰 확인이 임의값 재발을 예방. 07-02 없는 간격(10px)은 ask 후 중간 키 spacing-5-5 신설(컬러 ask-방침의 간격 확장 판례). 07-03 SelectGroup도 GAP_STYLE 정적 lookup 재사용. 07-06 side nav 버튼 내부 gap이 Figma에 9px(토큰 없음) → ask 정책대로 확인, 사용자 선택=spacing-5(8px, 디자인 오차 처리) — '없는 간격=ask' 3번째 판례. 텍스트 행간도 text-14 기본(24) 대신 leading-20 토큰 조합으로 Figma(14/20) 일치. 컴포넌트 고정 치수(h-[45px] 등)는 임의 px 허용 관례. 07-06 스크롤 thumb 히트 영역 확장(시각 6px 유지+클릭 8px→당일 10px 확대, `before:-inset-spacing-2`)을 임의값 대신 spacing 토큰으로 — 투명 ::before 확장은 pseudo도 원본 요소 히트 대상이라 이벤트 코드 무수정(ScrollArea·TextArea 동일 적용). 판례 원문 → rule-usage-archive.md §2a |
| 2b Tailwind 기본값·임의값 금지 | 2 | 07-03 | 규칙 페이지 뷰어(MarkdownDoc) 작성 시 `text-[12px]`·`py-[1px]`·`leading-[1.7]` 임의값을 썼다가 토큰(`text-12`·`spacing-1`)으로 교정 — **신규 컴포넌트에서 임의값 습관 재발**, 작성 직후 셀프 점검 필요. **07-01 마찰(토큰 부재): 에디터 본문 행간을 +6px(24→30px) 요청 → `line-height`는 등록 토큰이 없다(typography 토큰이 fontSize에 lineHeight를 묶어 제공, 독립 스케일 없음). 임시로 임의값 사용 후 → **당일 해소: `lineHeight` 토큰(`tokens/lineHeight.js`, 20~32px) 신설·등록(safelist+theme.extend), fontSize가 이 토큰을 참조하도록 리팩터(각 사이즈 기본 행간 값 불변 검증), 에디터는 `leading-30` 토큰으로 교체. 임의값 제거 완료.**(각 사이즈 기본 행간 = 폰트+8px 그대로) 07-03 HomePage에 lineHeight 토큰 신설(07-01) 이전의 `leading-[1.7]`/`[1.6]` 잔재 3곳 발견 → 임의 클래스 제거(text-* 기본 행간 24/28px가 의도값과 일치해 leading-* 추가도 불필요). 토큰 신설 후 기존 임의값 잔재 정리 습관 필요. |
| 3a 페이지→템플릿→컴포넌트 순 매칭 | 6 | 06-25 | **'페이지' 단위 미정의** → 실질 템플릿>컴포넌트만 적용. 06-25 모달=Modal 컴포넌트 + 테이블 템플릿으로 템플릿 단위 매칭 |
| 3b 큰 단위 커버 우선, 안 되면 하위 | 6 | 06-25 | 06-25 Modal+테이블 템플릿으로 대부분 커버, 안 덮이는 셀만 detach |
| 3c 기존 DS 자산 우선·신규 제작 지양 | 20 | 07-15 | 기존 자산 우선 정착 — 새 요구는 새 컴포넌트 대신 기존 옵션 확장/조립로(신규는 셸·토큰만), variant 별칭(SelectChip)·훅 추출·조립 컴포넌트 패턴. 07-14 rich menu=PopoverMenu+List 재사용, 카드·수식 공용 편집 메뉴 추출. **원장 날짜 오기입(07-16→07-13) 교정 — 갱신 시 오늘 날짜 확인.** 판례 원문 → rule-usage-archive.md §3c 07-15 자연어 빌더=신규 컴포넌트 0(ScreeningFormula variant 분기, 같은 존 데이터 공유) · 함수 변경=underline Button+PopoverMenu 조립 — 표기 변형은 variant, 강조는 기존 옵션(color/weight) 확장으로. |
| 4a 요소 분석(요소·상태 목록화) | 6 | 06-30 | 06-25 모달 2건(지원자 배경/선택) 요소·컴포넌트 분석. **06-30 TextArea 마찰: default 변형만 보고 만들어 disabled/readOnly 세부를 놓침 — disabled 플레이스홀더 색(#c9c9c9) 미적용·readOnly 카운터 숨김 누락(사용자 지적). 각 상태 variant 스크린샷(`get_screenshot`)을 받아 교정. 교훈: 다상태 컴포넌트는 default 외 모든 상태 변형을 개별 확인(플레이스홀더 색·카운터 노출 등 서브요소 포함).** |
| 4b 매핑(페이지>템플릿>컴포넌트) | 7 | 06-26 | **06-25 큰 마찰: 규칙4 '큰 단위 먼저'를 '완성본 복제'로 오해 → 정답은 Modal 컴포넌트 + 테이블 템플릿 slot 조립(사용자 지적). modal.md도 파일명만 출력하고 실제 미확인. CLAUDE.md(작도 전 체크)·레시피로 교정** / 06-25 '지원자 배경' 재작업은 처음부터 복제 없이 Modal 셸+ModalBody slot에 테이블 템플릿 조립으로 진행(교정 정착). **2026-06-26 해소: SKILL.md 규칙4에 '조립이지 복제가 아니다' 경고 블록 명시 + templates(modal/list/form/detail) '모범 예제'를 실제 컴포넌트(Modal/FormModal/Table/TableTemplate/Input) import 조립으로 전면 교체 + 각 완료 체크리스트 최상단에 '손으로 짜지 않고 조립했는가(규칙4)' 추가. 규칙·예제·체크리스트 3곳 정합.** **2026-06-26 정착 확인: '지원자 선택' 모달 신규 요청을 ⓪체크(modal.md 실제로 열어 완료 체크리스트 검증)→복제 없이 Modal(960)+ModalBody slot에 테이블 템플릿 FILL 조립으로 한 번에 완료. 더 이상 복제 유혹/마찰 없음.** |
| 4c 조합/배치 | 11 | 07-07 | 조합/배치 정착 — 모달=Modal 셸+템플릿 slot 조립이 표준(안내 작성·안내 및 발표·항목 추가 코드/Figma 양쪽, NoticeWritingTemplate=Tabs+Input+Button+Editor 조립). 07-06 SideNavigationTemplate: 좌 SideNavigation(addPosition=top 내장)+우 children 슬롯 — 템플릿이 콘텐츠를 소유하지 않고 슬롯로 개방(TableTemplate rightActions와 같은 철학), Figma 템플릿 SET+변형 2 매핑까지 세트. **마찰(사용자 지적): 데모 콘텐츠(제목+인풋+추가)를 h3+손조립로 만들었는데 Figma 원본은 `field` 인스턴스(label=제목, slot=인풋+버튼)였음 → Field 조립로 교정. 교훈: 템플릿 '콘텐츠 슬롯 안'도 데모로 재현할 땐 Figma 구조를 확인해 같은 컴포넌트로 조립할 것(슬롯이라고 자유 조립 아님 — 원본이 쓴 컴포넌트 우선). Field controlsDirection=row는 등분이라 input FILL+버튼 hug 조합은 Field children에 행을 통째로 넣는 게 정답(Figma slot 구조와 동일).** 판례 원문 → rule-usage-archive.md §4c |
| 4d 불필요 요소 제거 | 6 | 06-25 | 인스턴스 토글로 못 끄는 건 detach 후 제거 — 경계 판단 매번 생김. 06-25 모달서 Table Title·추가/내보내기 버튼·불필요 컬럼 `visible=false`. 06-25 '지원자 배경'서 가져오기·내보내기 버튼+Table Title 끔 — **슬롯 고스트로 `findOne`이 버튼 깊은순회 중 'node not found' → 직접 `children` 접근+try/catch로 우회, 내보내기는 1회차에 안 잡혀 2회차 재시도 필요** |
| 4e 세부 정리(커스텀 최소·늦게) | 5 | 06-25 | **06-25 마찰: ① 테이블 잘림 — 테이블 템플릿 FILL + 모달 바디 패딩(16/16) 유지로 해결(처음 템플릿에 패딩 직접 줬다 정정). ② 상태태그 컬럼 재배치 — `insertChild` 인덱스 빗나감 → `appendChild`로 순서 재정렬, 헤더 기준 셀 너비 정렬** |
| 5a 색 차이=상태/분류색 인식 | 6 | 06-25 | (06-25 모달 태그 color(검토중/합격/보류)·체크박스 selected를 variant로) ~~태그 색이 'state'인지 '의미색'인지 애매~~ → **2026-06-24 해소: Tag 속성 `type`→`color`(blue/red/gray)로 개명 확인. 분류색은 상호작용 `state`와 별개의 `color` variant.** 규칙 5에 ①상태(state) ②분류색(color) 구분 반영 완료 |
| 5b recolor 금지·상태로 표현 | 8 | 07-01 | 06-25 태그 color·체크박스 selected·페이지네이션 state·확인 state=Disabled 전부 variant `setProperties`로(수동 채색 X). 06-25 '지원자 선택' 상태 태그 검토중=gray/합격=blue/보류=red를 `color` variant로(직접 채색 X). 07-01 Chip color(gray/red/blue/black)를 `COLOR_CLASS` 맵 기반 `color` prop으로 표현(className 채색 X, Tag와 동일 패턴). 07-01 Tag에 4번째 색 추가(Figma 변형명 'color4'=gray500 솔리드+흰 텍스트) → 사용자 확인 후 코드 prop명 `black`으로 결정(Chip black과 동일 값·DS 일관성). tagColors에 black-bg(gray500)/black-text(white) 추가, `COLOR_STYLE`에 black. **Code Connect 마찰: Figma 변형값이 placeholder 'color4'라 codegen은 `color="color4"`로 나오지만 코드 prop은 `black` — 매핑(셋→Tag)은 정상, 값만 불일치(rule 11: Figma placeholder에 코드 API를 맞춰 깎지 않음). Figma 변형명을 black으로 정리하면 codegen까지 일치.** |
| 5c 변경 어려우면 기본 상태 유지 | 1 | 06-24 | |
| 5d (피그마)variant 먼저→detach / (코드)prop | 7 | 06-25 | 06-25 모달 variant 다수(태그/체크박스/페이지네이션/확인 state). ~~버튼 text는 setProperties로 변경 불가~~ → **2026-06-25 정정: 버튼(line/fill/02_line_left icon text)은 `text#7045:0` TEXT 컴포넌트 속성을 가져 `setProperties({"text#7045:0":…})`로 텍스트 변경 가능 — 중첩 TEXT 노드 직접 편집(getStyledTextSegments)이 슬롯 고스트로 'node not found' 날 때 이게 정답.** 단 **setProperties 직후 같은 노드 readback(componentProperties/characters)은 노드 ID 재생성으로 실패** → set만 하고 readback 금지. 버튼 disabled='지원자 선택' 모달 선택해제·선택완료 state=Disabled. pagination state 옵션 default/hover/pressed/**selected**/disabled('selected'를 정규식으로 찾을 때 'pressed' 먼저 잡힘 주의). 06-25 TablePage 고스트→밑줄 버튼 교체 `variant` prop |

## B. 코드 작성 전용

| 세부 규칙 | 적용 | 최근 | 마찰·애매 메모 |
|---|---|---|---|
| 6a 새 페이지 3단계 절차 | 13 | 07-14 | '규칙' 메뉴 페이지(RulePages) 추가에 적용(page→index→App NAV_GROUPS). 06-25 Component Colors 페이지 추가에 동일 절차 적용(파운데이션 그룹). 06-26 LabelPage/FieldPage 추가(컴포넌트 그룹, Select 다음). 06-29 UploadMenuPage 추가(컴포넌트 그룹, Option List 다음). 06-30 TextAreaPage 추가(컴포넌트 그룹, Input 다음). **07-01 NoticeTemplatePage 추가('템플릿' 그룹, Table Template 다음). Editor(Tiptap) 포함이라 EditorPage처럼 App.jsx에서 lazy import(pages/index.js 정적 재export 생략) — 무거운 엔진 지연 로드 관례 따름.** 07-02 ContactFieldPage(Email / Phone Field) 추가 → **당일 사용자 요청으로 FieldPage에 병합**(메뉴는 'Field' 유지, Email/Phone 섹션에 별도 UsageExample). 별도 페이지 생성·병합 모두 3단계 절차 역순 정리(파일 삭제→index→NAV)로 마찰 없음. 07-02 FormTemplatePage 추가('템플릿' 그룹, Table Template 다음). 07-03 통합 페이지 분리 사례: Tag/Tooltip/Scrollbar 페이지에서 Tag·Chip을 각각 단독 페이지로, 잔여(Tooltip/Scrollbar/Divider)는 TooltipScrollbarPage로 — 3단계 절차 + LNB 2뎁스 '데이터 표시' 서브그룹 배치 + components.md 데모 위치 참조 갱신까지 세트로. 07-06 SideNavigationPage 추가('내비게이션' 서브그룹, Pagination 다음) + SideNavTemplatePage 추가('템플릿' 그룹, Form Template 다음 — 데모=채용 코드 생성 콘텐츠를 Input·Button·Table 조립, 메뉴 필터·추가 동작 라이브). 07-13 ScreeningBuilderTemplatePage('템플릿' 그룹, Job Position 다음). 07-14 ToolBarPage('액션' 그룹)+AccordionPage('데이터 표시' 그룹) — 공용 승격 컴포넌트는 데모 페이지 동반 신설, 내부용(카드·수식)은 템플릿 데모에 흡수(별도 페이지 없음) 관례. |
| 7a 모든 시각 옵션 props 노출 | 16 | 07-15 | 완전 옵션화 정착 — 시각 옵션+**데이터 반출 계약(onChange/getX — 없으면 실서비스 저장 불가)**까지가 완전 옵션화. 상태 동기화는 effect 대신 렌더 파생값. 07-14 Accordion(nameEditable/deletable/deleteDisabled/keepMounted/maxHeight)·ScreeningBuilder(cardMenu 등) — deleteDisabled는 사용처 요구를 공용 옵션으로 승격한 판례. 판례 원문 → rule-usage-archive.md §7a 07-15 Button weight(underline 전용)·SelectChip weight·underline color — 특정 사용처(수식 함수) 요구를 공용 옵션으로 승격하는 패턴 반복. |
| 7b 기본값 명시 | 1 | 06-25 | 06-25 ErrorBoundary title·description 기본 문구 명시 |
| 7c 인라인 스타일 금지 | 2 | 06-25 | 06-25 ErrorBoundary 전부 토큰 클래스(인라인 스타일 0) |
| 8a 말줄임 hover 툴팁(TruncatingText) | 2 | 07-06 | 07-03 정합 갱신: TruncatingText 구현 완료·적용 중(Button·Select·List·InlineFieldTrigger, DateField는 동일 패턴 자체 구현) — 규칙 8 문구를 '목표(보류)'→'구현 완료·사용'으로 승격 |
| 8b 적용 시 위치·잘림 검증 | 2 | 07-08 | 07-06 SideNavigationButton ellipsis — 실제 마우스 hover E2E로 포털 툴팁 표시 검증(잘린 라벨 전체 노출 확인). 07-08 아이콘 전용 버튼 hover 명칭 툴팁 — TruncatingText 포털 패턴을 `useHoverTooltip` 공용 훅으로 추출(portal+fixed+아래→위 자동반전+표시 지연 300ms), Button(아이콘 전용일 때 tooltip??aria-label 자동)·Pagination 화살표에 적용, ToolbarButton은 native title 제거(중복 방지). 훅이 JSX 반환이라 `.js`→`.jsx` 확장자 필요(빌드 에러로 확인 — usePopoverPosition/useOutsideDismiss는 JSX 없어 .js). |
| 9a ScrollArea 사용 | 5 | 07-14 | ScrollArea 표준 + 예외 계보 — textarea=네이티브 스크롤+오버레이 thumb 동기화 / 가로+세로 중첩=vScrollEl / 유동 높이=max-h-full / 테이블=헤더 분리+바디만 스크롤. 07-14 영역별 독립 ScrollArea 분리 + **data-scroll-sticky-top 스페이서를 absolute 오버레이 헤더에 응용**(thumb가 고정 헤더·페이드 아래에서 시작). 판례 원문 → rule-usage-archive.md §9a |
| 10a 날짜·시간 포맷 통일 | 1 | 07-03 | 07-03 정합 보정: DateField/TimeField·데모 표기가 이미 이 규칙(YY.MM.DD (HH:MM)·범위 틸드)으로 동작 중 — 집계 누락이었음 |
| 10b datetime.js 유틸 사용 | 1 | 07-03 | 07-03 정합 보정: DateField 표시 문자열이 formatDateTime/formatDateTimeRange 경유(직접 조립 없음) — 집계 누락이었음 |
| 19 알파 라인은 outline(바깥) — border 금지 | 3 | 07-14 | **2026-07-14 승격 신설**(SKILL.md B구역, 재발 3회 충족). 알파 라인을 border/ring-inset으로 그리면 자기 배경과 합성돼 배경 투영 안 됨 → outline/바깥 ring. 판례: SegmentedTabs pill(ring outset)·조건 카드·ToolBar. 예외: 드래그 고스트(setDragImage)는 outline이 캡처에서 잘려 border 유지. |
| 15 카피 띄어쓰기: 맞춤법 + 복수 허용 시 맥락 우선 | 4 | 07-14 | **2026-07-03 사용자 지시로 신설**(SKILL.md A구역). 맞춤법 준수, 둘 다 맞으면 이해하기 쉬운 쪽 — 한 단위 필드명은 붙임("발신주소"), 서술형 구는 띄움("안내 및 발표 명칭" — 붙였다가 사용자 되돌림이 규칙 신설 계기). 같은 용어는 시스템 안에서 표기 통일. 신설 직후 전수 스캔: 위반 6곳 수정(FormTemplatePage 라벨 2곳=모달과 표기 불일치, TextAreaPage '글자수'→'글자 수' 4곳=의존명사 원칙). '안내 문구/문자'는 올바른 띄어쓰기라 오탐 주의. 코드 주석은 카피가 아니라 대상 외. **07-06 재발(사용자 지적): Figma 원문 '채용 코드 명'을 그대로 옮겨 placeholder '채용 코드명'과 표기 불일치 발생 → '채용 코드명' 통일(2곳). 교훈: Figma에서 가져오는 텍스트도 카피 규칙 필터를 거칠 것 — 원문 그대로가 면제 사유 아님(Figma 쪽 원문도 정리 권장).** 07-14 rich menu 더미 카피 교정 2건(보운여부→보훈여부 오타, 지방근무기능여부→지방근무가능여부) — Figma 원문 필터 판례 재적용, 피그마 쪽 수정 안내. |
| 17 아이콘 전용 셀 width=iconCellWidth 계산 | 2 | 07-07 | **2026-07-03 사용자 지시로 신설**(templates/list-page.md + 체크리스트). 고스트 아이콘 버튼만 단독인 셀은 임의 폭 대신 `tableView.iconCellWidth(n,{buttonSize,gap})`=셀 좌우 패딩(spacing-5-5×2)+버튼 폭+간격(spacing-5) 합산 — 토큰 추종. 신설 시점 사용처는 '항목 추가' 모달 1곳(76px)뿐이며 이미 적용됨. render의 gap 클래스와 인자 gap 일치 필요(불일치 시 폭 어긋남) — 주의 메모. 07-07 JobPositionTemplate 관리 열(ghost 32 휴지통 단독)에 재적용 — Figma 명시 60px 대신 iconCellWidth(1,{buttonSize:32})=52px, 사용자 지시로 규칙 우선. |
| (운영) 규칙 거버넌스: 기계 검사·승격 기준·가지치기 | 1 | 07-06 | **2026-07-06 신설**(SKILL.md) — check-rules.mjs(2a·2b 오류/1b·15·18 후보 자동 검출, npm run check:rules), 승격=재발 2회+ 또는 사용자 지시, 5개 신설마다 감사, 체크리스트 종료 시 항목별 출력. 첫 실행에서 실전 위반 1건 적발(Divider 사용 예제의 mx-3 → mx-spacing-3) — 예제 코드도 검사 대상임이 입증. |
| 18 모달 무한 스크롤 테이블=bordered+fill 설정 | 1 | 07-06 | **2026-07-06 사용자 지시로 신설**(templates/modal.md + 체크리스트). 페이지네이션 없는 모달 테이블은 `bordered maxHeight="fill" className="min-h-0 flex-1"`(min=hug, 필요 시 minHeight) — 상한=모달 가용 높이, 헤더 고정 분리, 바디 전체 스크롤 금지. 2단이면 컨테이너 height="fill" 동반. 판례=채용 코드 생성 모달. |
| 16 목록 버튼그룹 순서: 삭제→추가→복사→붙여넣기 | 1 | 07-02 | **2026-07-02 사용자 지시로 신설**(templates/list-page.md + 체크리스트). 선택 연관 버튼은 항상 이 순서, 없는 건 건너뛰고 그 외(가져오기 등)는 뒤에, rightActions엔 미적용. 신설과 동시에 기존 사용처(평가항목 모달·TableTemplate 데모) 정렬 — 지원자 배경 모달은 이미 부합. |

## C. Figma 작도 전용

| 세부 규칙 | 적용 | 최근 | 마찰·애매 메모 |
|---|---|---|---|
| 11a Code Connect 기능 훼손 금지 | 10 | 07-03 | Code Connect 매핑 원칙 정착 — 셋 단위=코드 컴포넌트 1개(variant 쪼개기 불가), 'Published component not found' 오류는 재시도 먼저 — **라이브러리 게시와 무관하게 매핑은 파일 로컬 컴포넌트에 붙으며(게시 없이 전부 연결됨, 2026-07-06 사용자 확인), 이 오류의 실제 원인은 컴포넌트 생성 직후 백엔드 인덱싱 지연**(오해 문구 주의). add 직후 readback·맵 캐시/서브트리 주의, Figma placeholder prop명에 코드 API 안 맞춤(규칙 11b). 07-03 SelectGroup 10변형 매핑. 07-03 Modal 재제작(8187 그룹, SET 아닌 프레임 안 개별 컴포넌트 7변형) 재연결 — **컴포넌트 재제작 시 매핑은 승계되지 않으므로 재연결 필요**, 구 SET(7348) 잔존은 레지스트리에 신/구 병기. 같은 날 table도 재제작(8187 그룹 4변형: table/outline/outline empty/empty) 재연결 — 구 table은 삭제됐지만 table template 내부 인스턴스는 별도 구컴포넌트(7679) 참조라 템플릿 무사(재제작 시 템플릿 참조 확인 습관). **07-03 전수 검사(SET 49개+단독 3개): 검증법="재매핑 시도 → already mapped 오류=정상 / success=누락". 누락 3건 발견·연결: new tag(8187:40848→Tag)·scroll(7206:10245→ScrollArea)·pagenation button(7263:1752988→Pagination). 나머지 전부 정상 — 이 방법이 맵 조회(self-매핑 안 나옴)보다 확실한 전수 검증법. **매핑 대상 원칙(사용자 확정): 코드에 별도 export가 없는 내부 구현 요소(pagenation button 등)는 그 상위 컴포넌트(Pagination)로 연결 — 버튼 15셋→Button과 같은 'N셋→코드 1개' 패턴, Figma 표시를 위해 코드에 export를 추가하지 않는다.** **마찰(Dev Mode 'Not published'): variant만 매핑하면 Dev Mode Code Connect 패널이 빈 상태 — SET 노드도 매핑해야 표시됨(기존 Label 판례 재확인). 추가 함정: `get_metadata`가 COMPONENT_SET을 `<frame>`으로 렌더해 개별 컴포넌트로 오인하기 쉬움 → 타입은 플러그인 API(node.type)로 확인할 것. Modal(8187:47759)·table(8187:48556)·select group(8174:36980) SET 3건 매핑 보완.** 판례 원문 → rule-usage-archive.md §11a |
| 11b 코드를 Figma에 맞춰 깎지 않음 | 1 | 06-26 | 06-26 Figma label은 size변형만 있으나 코드 Label은 required(*)·disabled·htmlFor를 추가 노출 — Figma에 맞춰 코드 옵션 깎지 않음 |
| 11c 옵션 적어도 그대로 매핑 | 1 | 06-26 | 06-26 Figma 단순매핑(prop명 Property1↔코드 size 차이는 codegen 표기차일 뿐, 코드 기능 영향 0) |
| 11d 매핑 후 코드 불변 확인 | 0 | – | |
| 12a 에러 툴팁 상위 프레임 clip 끄기 | 0 | – | (과거 Input 작업서 적용) |
| 12b (코드)overflow:visible | 0 | – | |
| 13a table 인스턴스→detach→편집 | 10 | 06-26 | 슬롯 안 편집=detach 안전 원칙 확립 — 슬롯 미러링 ID 재생성은 모달부터 재탐색+null 가드, 다중 편집 전 button group/테이블 detach, detach 후 FILL 일괄 재설정(규칙 13 본문 반영). 판례 원문 → rule-usage-archive.md §13a |
| 13b detach해도 디자인 유지 | 8 | 06-25 | 06-25 테이블 템플릿 detach 후에도 셀 색·태그·구분선 유지됨 확인('지원자 배경'서도 컬럼/너비 재구성 후 구분선·정렬 유지) |
| 13c 단순 컴포넌트는 연결 인스턴스 유지 | 5 | 06-24 | Modal은 연결 유지·표만 detach로 운영 |
| 13d 체크박스 셀 44px 고정 | 2 | 06-24 | **세션 중 신설** — 기존 56px로 그렸다가 교체. 규칙 확정 전 작업물 보정 필요했음 |
| 13e (코드)detach 없이 Table 조립 | 0 | – | |
| 14 개별 DS 컴포넌트는 Code Connect로 찾아 인스턴스화 | 2 | 07-01 | **2026-06-26 신설.** 작도 시 개별 컴포넌트는 `get_code_connect_map` 역조회(컴포넌트명→nodeId)로 찾아 createInstance. 마찰: ① 맵이 **조회 노드 서브트리 범위만** 반환 → 부분 결과 보고 "Input·Select·Tag 미연결"이라 잘못 단정(실제 Editor 빼고 전부 연결). ② 컴포넌트 SET 노드도 매핑돼야 Dev Mode "Connected"·`get_code_connect_map` 읽기 안정(Label에서 variant만 매핑 시 `{}`였다 SET 매핑 후 정상). 현황 메모리 [[reference_code_connect_coverage]] |
| ~~구 14 폰트 정책~~ → 규칙 4(요소 분석)로 통합 | – | 06-24 | 2026-06-24 Pretendard 설치로 휴면 → **독립 규칙 폐지**. '작업 시작 시 폰트 점검 · 설치 불가 환경에서만 텍스트 변경 보류'를 규칙 4(요소 분석)에 흡수. (과거 마찰: 구 규칙 14 vs '이미지 내용대로' 충돌로 사용자 확인 필요했음) |

## 튜닝 후보 (메모가 쌓이면 여기로 승격)

- ~~**규칙 4 (조립 vs 복제) — 2026-06-25 가장 큰 마찰**~~ → **2026-06-26 해소.** 규칙4 본문에 '큰 단위 = 큰 컴포넌트/템플릿 조립이지 완성본 복사가 아님' 경고 블록을 명시하고, templates(modal/list/form/detail) 예제를 '손으로 만드는 코드' → '기존 컴포넌트 import 조립'으로 전면 교체, 체크리스트도 정합. (잔여: '라우팅 파일은 파일명만 적지 말고 실제로 읽고 완료 체크리스트 검증' 습관은 CLAUDE.md ⓪에 이미 있음 — 별도 규칙 승격은 보류.)

- ~~**규칙 5 (상태)**: 'state'와 '의미색(type)' 경계 명확화~~ → **2026-06-24 해소.** Tag 속성 `type`→`color` 개명, 규칙 5에 상태(state)/분류색(color) 구분 반영. (후속: 코드 Tag prop `type`→`color` 정렬 여부 결정 필요)
- **규칙 5d / 13 (버튼 텍스트)**: "중첩 인스턴스 버튼 텍스트는 setProperties 불가 → state 적용 후 detach" 를 본문에 명시할지.
- ~~**규칙 14 (폰트)**~~ → **2026-06-24 완료.** Pretendard 설치로 휴면 → 독립 규칙 폐지, 폰트 가용성 점검 절차를 규칙 4(요소 분석)에 통합.
- **규칙 3 (DS 우선)**: '페이지' 단위가 비어 있음 — 페이지 체계 확립 시 보강.
- ~~**규칙 2 (행간 토큰 부재)**~~ → **2026-07-01 해소.** `lineHeight` 토큰(20~32px, `leading-*`) 신설·등록하고 fontSize가 참조하도록 리팩터(각 사이즈 기본 행간 값 불변). 이제 사이즈는 두고 행간만 다르게 줄 때 `leading-30` 등 토큰 사용(임의값 불필요).
- ~~**규칙 13 (테이블)**~~ → **2026-06-24 해결.** 컴포넌트 자체는 건강, 고스트는 **슬롯(ModalBody) 내부 편집**에서만 발생함을 확인. 규칙 문구를 '필수 → 대량/슬롯 편집 시 권장'으로 수정 완료. (추가 여지: 슬롯 미러링 회피용으로 표를 슬롯 밖에서 만들어 마지막에 넣는 패턴 검토)
