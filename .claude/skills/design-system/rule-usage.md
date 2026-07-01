# 규칙 사용 원장 (Rule Usage Ledger)

규칙을 **튜닝**하기 위한 기록 파일. 각 **세부 규칙 단위**로 (1) 얼마나 적용됐는지, (2) 최근 적용일, (3) 적용 중 애매했던/마찰이 있던 점을 누적한다. 많이 쓰이는 규칙은 다듬고, 안 쓰이는 규칙은 통합·삭제, 마찰 메모가 쌓인 규칙은 문구를 보완한다.

## 유지 방법 (중요)

- **자동 카운트 불가** — 규칙은 도구 호출이 아니라 추론 중 적용되므로 훅으로 셀 수 없다. 따라서 **작업이 끝날 때 클로드가 직접** 이 표를 갱신한다(규율 기반, best-effort).
- 갱신 단위: 해당 세부 규칙이 **그 작업의 판단을 실제로 좌우했을 때만** +1. 단순 언급은 세지 않는다.
- 마찰·애매 메모: 규칙이 모호하거나(해석 분기), 예외가 필요했거나, 다른 규칙과 충돌했을 때 **한 줄**로 누적(날짜 포함).
- 카운트는 **상대 빈도 신호**일 뿐 정밀치가 아니다. 과거치 보정은 세션 transcript 회고 스캔으로 일괄 가능.
- 규칙 식별은 **고유명**으로(번호는 변동 가능). 규칙 본문은 `SKILL.md`·`foundation.md`·`components.md`·`templates/*` 참조.

> 시드(seed): 아래 수치는 **2026-06-24 이 세션의 관찰 기준 초기값(추정)** 이다. 이후 작업에서 갱신한다.

## A. 공통 설계 원칙

| 세부 규칙 | 적용 | 최근 | 마찰·애매 메모 |
|---|---|---|---|
| 1a 컬러 Base→Semantic→컴포넌트 경유 | 5 | 07-01 | (피그마 작도에선 변수 경유라 코드만큼 빈번치 않음) 06-25 모달 딤=`Modal Overlay Bg` 컴포넌트로 `modal/overlay` 토큰 바인딩 유지(복제본은 직접 색이라 어긋났음). **06-26 규칙 1 위반→교정 사례(새 규칙 아님): Label 최초 작성 시 `font-icon-5`로 우회 + required=`base-red-400` 직접 + disabled=`font-icon-3`(#878787)로 값까지 오류(Figma=`label-field/disabled text`=#c9c9c9). foundation.md(라인 7~13·43: '시멘틱 없으면 먼저 정의', '새 컴포넌트 컬러는 colors/xxxColors.js에 시멘틱 먼저 추가')대로 `labelFieldColors.js`(default-text/required-mark/disabled-text) 신설·등록 후 `text-label-field-*`/`bg-label-field-required-mark` 경유로 교정. → 규칙·문서엔 이미 다 있었고 미적용이 문제였음(추가 규칙 불필요).** **06-26 새 방침 첫 적용: Field 헬퍼 텍스트가 `label-field/helper text`(#3f3f3f) 토큰을 쓰는데 코드 `labelFieldColors`에 빠짐 → 임의로 안 넣고 사용자에게 "빠졌으니 추가?"라고 알림 → 승인 후 `helper-text`(gray.600) 등록·Field `text-label-field-helper-text`로 교정. (지시: [[feedback_missing_semantic_token_ask]])** **06-30 Divider도 동일: `divider/*`(subtle gray.50/default gray.100/strong gray.150)가 코드에 없어 사용자에 알림→승인 후 `dividerColors.js` 신설·등록. (정착)** **07-01 Chip도 동일 정착: `chip/*`(default/hover text·icon·bg·line)가 코드에 없어 알림→승인 후 `chipColors.js` 신설·등록(pressed는 Figma가 default 재사용). ask-policy 마찰 없이 1패스.** |
| 1b 하드코딩 HEX/rgba 금지 | 2 | 06-25 | 오버레이 dim을 임시 rgba로 그림 — 시멘틱 알파 변수로 바꿔야 함. 06-25 Component Colors 페이지의 .bg-checker 격자색에 #e3e3e3을 직접 씀 → gray.100 **토큰값 인라인**으로 정당화(Tooltip/ScrollArea 예외와 동일), 단 데모 보조 유틸이라 토큰화는 보류 — **'토큰값 인라인 예외'와 '하드코딩 금지' 경계가 또 등장** |
| 2a 등록 토큰만(spacing/round/border) | 8 | 06-30 | 06-25 모달 바디 패딩(16/16) 토큰 유지+테이블 템플릿 FILL(처음 템플릿에 패딩 직접 줬다 정정). 06-25 ErrorBoundary 작성 전 fontSize(text-12~20)·spacing(none~12) 토큰 정의를 먼저 확인하고 등록 토큰만 사용 — **작성 전 검증이 2b 임의값 재발을 예방**. 06-25 Component Colors 페이지도 spacing/text/round 등록 토큰만 사용. **06-30 Divider 교체 시 기존 `mt-spacing-N`/`pt-spacing-N`을 Divider의 `mt`/`mb`(MB=옛 pt값)로 그대로 이전해 픽셀 간격 보존 — 임의 간격 신규 없음(기존 mt/pt 없으면 mt-9/mb-8 기본).** |
| 2b Tailwind 기본값·임의값 금지 | 1 | 06-24 | 규칙 페이지 뷰어(MarkdownDoc) 작성 시 `text-[12px]`·`py-[1px]`·`leading-[1.7]` 임의값을 썼다가 토큰(`text-12`·`spacing-1`)으로 교정 — **신규 컴포넌트에서 임의값 습관 재발**, 작성 직후 셀프 점검 필요 |
| 3a 페이지→템플릿→컴포넌트 순 매칭 | 6 | 06-25 | **'페이지' 단위 미정의** → 실질 템플릿>컴포넌트만 적용. 06-25 모달=Modal 컴포넌트 + 테이블 템플릿으로 템플릿 단위 매칭 |
| 3b 큰 단위 커버 우선, 안 되면 하위 | 6 | 06-25 | 06-25 Modal+테이블 템플릿으로 대부분 커버, 안 덮이는 셀만 detach |
| 3c 기존 DS 자산 우선·신규 제작 지양 | 10 | 07-01 | 06-25 TablePage 지원서 셀 버튼 교체 시 Button에 이미 있던 `underline` variant 재사용(신규 제작 없음). 06-26 Field가 컨트롤을 손수 안 짜고 기존 Input/Select/DateField를 children으로 조립 + Label을 Field 내부에서 재사용(중복 구현 없음). 06-29 업로드 위젯(File/ImageUploadMenu)을 PopoverMenu+ListGroup+List+Button 조립으로 구성, 트리거(File/ImageUploadButton)는 Button+Popover 조립 — 셸·목록·푸터를 손으로 안 짬. 06-30 TextArea는 Input 구조·`text-field-*` 토큰을 그대로 재사용(멀티라인+카운터만 추가) — 새 토큰/패턴 신규 제작 없음(시멘틱 토큰 점검 결과 0개 추가, 새 방침대로 확인 후 진행). **06-30 데모 페이지 25개의 섹션 구분선(`border-t border-base-gray-100` 69곳)을 손수 border 대신 기존 `Divider` 컴포넌트(default 색)로 전면 교체 — 하드코딩 border 제거·DS 컴포넌트 재사용.** **07-01 에디터 머지필드 칩: 커스텀 Tiptap 노드(`MergeFieldNode` 인라인 atom)의 NodeView에 chip-* 토큰 클래스(=Chip과 동일)를 그대로 써 신규 색 0. 처음엔 React NodeView로 DS `Chip` 컴포넌트를 그대로 재사용했으나 인라인-atom React NodeView가 편집 뷰에서 빈 렌더(삽입돼도 안 보임) → jsdom 헤드리스로 삽입·직렬화는 정상인데 렌더만 실패임을 확인하고 plain DOM NodeView로 교체(토큰은 동일 유지). 컴포넌트 재사용은 못 했지만 토큰·시각 패턴은 재사용. preview 모드만 raw span이라 `[data-merge-field]`에 chip 토큰 CSS로 동일 모양 부여.** |
| 4a 요소 분석(요소·상태 목록화) | 6 | 06-30 | 06-25 모달 2건(지원자 배경/선택) 요소·컴포넌트 분석. **06-30 TextArea 마찰: default 변형만 보고 만들어 disabled/readOnly 세부를 놓침 — disabled 플레이스홀더 색(#c9c9c9) 미적용·readOnly 카운터 숨김 누락(사용자 지적). 각 상태 variant 스크린샷(`get_screenshot`)을 받아 교정. 교훈: 다상태 컴포넌트는 default 외 모든 상태 변형을 개별 확인(플레이스홀더 색·카운터 노출 등 서브요소 포함).** |
| 4b 매핑(페이지>템플릿>컴포넌트) | 7 | 06-26 | **06-25 큰 마찰: 규칙4 '큰 단위 먼저'를 '완성본 복제'로 오해 → 정답은 Modal 컴포넌트 + 테이블 템플릿 slot 조립(사용자 지적). modal.md도 파일명만 출력하고 실제 미확인. CLAUDE.md(작도 전 체크)·레시피로 교정** / 06-25 '지원자 배경' 재작업은 처음부터 복제 없이 Modal 셸+ModalBody slot에 테이블 템플릿 조립으로 진행(교정 정착). **2026-06-26 해소: SKILL.md 규칙4에 '조립이지 복제가 아니다' 경고 블록 명시 + templates(modal/list/form/detail) '모범 예제'를 실제 컴포넌트(Modal/FormModal/Table/TableTemplate/Input) import 조립으로 전면 교체 + 각 완료 체크리스트 최상단에 '손으로 짜지 않고 조립했는가(규칙4)' 추가. 규칙·예제·체크리스트 3곳 정합.** **2026-06-26 정착 확인: '지원자 선택' 모달 신규 요청을 ⓪체크(modal.md 실제로 열어 완료 체크리스트 검증)→복제 없이 Modal(960)+ModalBody slot에 테이블 템플릿 FILL 조립으로 한 번에 완료. 더 이상 복제 유혹/마찰 없음.** |
| 4c 조합/배치 | 6 | 06-29 | 06-25 ModalBody slot에 테이블 템플릿 appendChild 조립. 06-29 업로드: 안내 박스(child)+ListGroup+footer(PopoverMenu footerButtonsFill)로 조립, List에 `rightButtonIcon`만 신설(삭제 trash) — 나머진 기존 조립. 트리거는 Popover trigger=Button + 패널=업로드메뉴 |
| 4d 불필요 요소 제거 | 6 | 06-25 | 인스턴스 토글로 못 끄는 건 detach 후 제거 — 경계 판단 매번 생김. 06-25 모달서 Table Title·추가/내보내기 버튼·불필요 컬럼 `visible=false`. 06-25 '지원자 배경'서 가져오기·내보내기 버튼+Table Title 끔 — **슬롯 고스트로 `findOne`이 버튼 깊은순회 중 'node not found' → 직접 `children` 접근+try/catch로 우회, 내보내기는 1회차에 안 잡혀 2회차 재시도 필요** |
| 4e 세부 정리(커스텀 최소·늦게) | 5 | 06-25 | **06-25 마찰: ① 테이블 잘림 — 테이블 템플릿 FILL + 모달 바디 패딩(16/16) 유지로 해결(처음 템플릿에 패딩 직접 줬다 정정). ② 상태태그 컬럼 재배치 — `insertChild` 인덱스 빗나감 → `appendChild`로 순서 재정렬, 헤더 기준 셀 너비 정렬** |
| 5a 색 차이=상태/분류색 인식 | 6 | 06-25 | (06-25 모달 태그 color(검토중/합격/보류)·체크박스 selected를 variant로) ~~태그 색이 'state'인지 '의미색'인지 애매~~ → **2026-06-24 해소: Tag 속성 `type`→`color`(blue/red/gray)로 개명 확인. 분류색은 상호작용 `state`와 별개의 `color` variant.** 규칙 5에 ①상태(state) ②분류색(color) 구분 반영 완료 |
| 5b recolor 금지·상태로 표현 | 7 | 06-25 | 06-25 태그 color·체크박스 selected·페이지네이션 state·확인 state=Disabled 전부 variant `setProperties`로(수동 채색 X). 06-25 '지원자 선택' 상태 태그 검토중=gray/합격=blue/보류=red를 `color` variant로(직접 채색 X) |
| 5c 변경 어려우면 기본 상태 유지 | 1 | 06-24 | |
| 5d (피그마)variant 먼저→detach / (코드)prop | 7 | 06-25 | 06-25 모달 variant 다수(태그/체크박스/페이지네이션/확인 state). ~~버튼 text는 setProperties로 변경 불가~~ → **2026-06-25 정정: 버튼(line/fill/02_line_left icon text)은 `text#7045:0` TEXT 컴포넌트 속성을 가져 `setProperties({"text#7045:0":…})`로 텍스트 변경 가능 — 중첩 TEXT 노드 직접 편집(getStyledTextSegments)이 슬롯 고스트로 'node not found' 날 때 이게 정답.** 단 **setProperties 직후 같은 노드 readback(componentProperties/characters)은 노드 ID 재생성으로 실패** → set만 하고 readback 금지. 버튼 disabled='지원자 선택' 모달 선택해제·선택완료 state=Disabled. pagination state 옵션 default/hover/pressed/**selected**/disabled('selected'를 정규식으로 찾을 때 'pressed' 먼저 잡힘 주의). 06-25 TablePage 고스트→밑줄 버튼 교체 `variant` prop |

## B. 코드 작성 전용

| 세부 규칙 | 적용 | 최근 | 마찰·애매 메모 |
|---|---|---|---|
| 6a 새 페이지 3단계 절차 | 5 | 06-30 | '규칙' 메뉴 페이지(RulePages) 추가에 적용(page→index→App NAV_GROUPS). 06-25 Component Colors 페이지 추가에 동일 절차 적용(파운데이션 그룹). 06-26 LabelPage/FieldPage 추가(컴포넌트 그룹, Select 다음). 06-29 UploadMenuPage 추가(컴포넌트 그룹, Option List 다음). 06-30 TextAreaPage 추가(컴포넌트 그룹, Input 다음) |
| 7a 모든 시각 옵션 props 노출 | 4 | 06-29 | MarkdownDoc(`source` prop). 06-25 ErrorBoundary: title·description·fallback·onError·resetKey 노출. 06-26 Label(size/required/disabled/htmlFor)·Field(label/direction/labelWidth/labelSize/description/gap…) 전 옵션 노출+기본값. 06-29 File/ImageUploadMenu(files·guide·maxCount·accept·onAdd/onDelete…)·File/ImageUploadButton(buttonProps로 모든 Button 스타일 통과·triggerText·showCount/countSuffix·placement/menuWidth). 06-30 TextArea(value/rows/autoGrow/maxRows/maxLength/showCount/disabled/readOnly/error/width/textareaProps) 전 옵션 노출+기본값 + Playground(체크박스 토글로 옵션 끄고 켜는) 데모. (resize prop은 오버레이 thumb 전환 시 제거) |
| 7b 기본값 명시 | 1 | 06-25 | 06-25 ErrorBoundary title·description 기본 문구 명시 |
| 7c 인라인 스타일 금지 | 2 | 06-25 | 06-25 ErrorBoundary 전부 토큰 클래스(인라인 스타일 0) |
| 8a 말줄임 hover 툴팁(TruncatingText) | 0 | – | 공용 구현 보류 상태 — **'목표(미구현)'이며 활성 제약 아님**(미적용이 위반이 아님). 구현 시 활성화. |
| 8b 적용 시 위치·잘림 검증 | 0 | – | |
| 9a ScrollArea 사용 | 1 | 06-30 | **06-30 첫 적용 + textarea 예외 정립:** TextArea의 네이티브 `<textarea>`는 ScrollArea(div용 JS 오버레이)로 못 감쌈. **시도1: `.custom-scrollbar` CSS로 네이티브 바 스타일링 → hover 불안정(Firefox 불가)으로 실패(사용자 "그대로야").** **시도2: auto-grow+ScrollArea로 감싸기 → 커서 추적(caret) 깨짐(예상).** **정답(채택): 네이티브 스크롤(커서 추적) 유지 + `.hide-native-scroll`로 기본 바만 숨기고, ScrollArea와 같은 오버레이 thumb(scroll-bar 토큰·hover·드래그, ScrollArea 세로 thumb 계산 그대로 포팅)를 textarea 스크롤에 동기화해 얹음.** 규칙 9에 이 패턴을 textarea 예외로 명시, `.custom-scrollbar`는 제거 |
| 10a 날짜·시간 포맷 통일 | 0 | – | |
| 10b datetime.js 유틸 사용 | 0 | – | |

## C. Figma 작도 전용

| 세부 규칙 | 적용 | 최근 | 마찰·애매 메모 |
|---|---|---|---|
| 11a Code Connect 기능 훼손 금지 | 5 | 07-01 | 06-26 Figma `label`(7942:2175) 5개 variant(12~16)→코드 `Label` 매핑(`add_code_connect_map`, source=`design-system/src/components/Label.jsx`, React, hasTemplate:false 단순매핑 — Button/Modal과 동일 방식). 매핑 후 코드 컴포넌트 불변(메타데이터만). `get_design_context`로 연결 검증(`Label`로 해석). **마찰: `get_code_connect_map`이 add 직후 같은 턴엔 `{}`(캐시) — `get_design_context`로 확인하는 게 정답.** **SET 노드(7942:2175)는 매핑 대상 아님, variant 노드에 매핑(Modal과 동일).** 06-26 Field(7942:2299, layout vertical/horizontal)도 연결·검증(`get_code_connect_map`에 Field + 내부 Label·Input 연결 확인). **06-29 업로드/데이트/2depth 연결 — 핵심 학습: Code Connect는 "컴포넌트 셋=코드 컴포넌트 하나" 단위.** 한 셋 안의 variant들을 서로 다른 코드 컴포넌트로 쪼개 연결 불가(popover menu 셋 안 업로드 variant를 File/ImageUploadMenu로 매핑 시도→codegen은 셋 매핑만 반영, variant별 안 먹음). → **별도 셋으로 분리 + 게시**해야 1:1 연결됨: `file upload menu`(7957:5287)→FileUploadMenu·`image upload menu`(7959:5598)→ImageUploadMenu·`date picker`(7594:4368)→DatePicker·`2depth list`(7959:5979)→TwoDepthList 전부 `get_design_context`로 검증. **마찰: ① 미게시 셋은 "Published component not found" → 사용자가 Publish 후 매핑 ② 이미 같은 코드에 매핑돼 있으면 "already mapped"(=이미 원하는 연결, 무시 가능, 예 date picker는 이미 DatePicker였음).** 트리거 프레임(butto+ file/image upload)은 컴포넌트가 아닌 조합 프레임이라 매핑 대상 아님(내부 Button·메뉴는 각자 연결됨). 06-30 `text area` 셋(7963:1674)→TextArea 매핑·검증(filled variant가 `<TextArea>`로 해석). 06-30 `editor` 셋(7970:17846)→기존 Editor·`Divider` 셋(7970:17558)→신규 Divider 매핑·검증(editor 툴바 내부 Button·Divider·SegmentControl도 연결로 표시). 07-01 `chip` 셋(7977:31602)→신규 Chip 매핑(`add_code_connect_map`, source=`design-system/src/components/Chip.jsx`)·성공. 매핑 후 코드 불변. **사용자 지시로 코드의 `disabled` 변형 제거(Figma에 없어 코드만 임의 추가했던 것) — Code Connect가 코드 옵션을 깎은 게 아니라 스펙 정합(Figma=default/hover/pressed, disabled 없음)에 코드를 맞춤. 11b(코드를 Figma에 맞춰 깎지 않음)와 구분: 여기선 Figma에도 없고 실제 미사용인 변형을 사용자가 사후 제거 요청한 케이스.** |
| 11b 코드를 Figma에 맞춰 깎지 않음 | 1 | 06-26 | 06-26 Figma label은 size변형만 있으나 코드 Label은 required(*)·disabled·htmlFor를 추가 노출 — Figma에 맞춰 코드 옵션 깎지 않음 |
| 11c 옵션 적어도 그대로 매핑 | 1 | 06-26 | 06-26 Figma 단순매핑(prop명 Property1↔코드 size 차이는 codegen 표기차일 뿐, 코드 기능 영향 0) |
| 11d 매핑 후 코드 불변 확인 | 0 | – | |
| 12a 에러 툴팁 상위 프레임 clip 끄기 | 0 | – | (과거 Input 작업서 적용) |
| 12b (코드)overflow:visible | 0 | – | |
| 13a table 인스턴스→detach→편집 | 10 | 06-26 | 06-26 '지원자 선택' 재현: ModalBody slot의 table template→table 인스턴스를 각각 detach, 매 use_figma 호출마다 모달부터 `findOne(by name)`+null 가드로 재탐색(슬롯 ID `I…;…` 무효화 회피). header에서 select 셀 remove·text+icon 정렬아이콘 visible=false로 plain화, 데이터 행은 `[check,이름,지원부서,tag,지원일]` appendChild 재정렬·여분 text remove, 너비 44/200/FILL/120/160 헤더·데이터 동일. button group도 detach 후 추가버튼 remove·아이콘 교차 swap(가져오기 download→upload, 내보내기 upload→download)·삭제→선택해제 Disabled. 전 과정 마찰 없이 1패스. / 06-25 모달 3건 — 테이블 템플릿 detach 후 컬럼/행/상태태그 재배치(헤더행을 바디로 착각 주의: `find(len>3)`은 헤더 먼저 잡음 / `insertChild` 인덱스 빗나감→`appendChild` 재정렬 / 헤더 기준 셀 너비 정렬). 06-25 '지원자 배경'(tag 없는 4컬럼): 6컬럼→4컬럼, **정렬(⌄) 헤더는 `select` 셀을 끝 위치로 `appendChild` 재정렬**, 너비 동일 적용. 06-25 '지원자 선택'(tag 5컬럼 check/이름/지원부서/상태(tag)/지원일): select 제거, text+icon 헤더의 정렬아이콘 `visible=false`로 plain text화, **tag 셀을 4번째 위치로 재배치**(`[check,t,t,tag,t]` appendChild), 너비 44/150/FILL/100/140. **슬롯 안 ID가 호출마다 무효화 → 매 호출 모달부터 재탐색, null 가드 필수.** **2026-06-25 추가 마찰: 슬롯 미러링이 모달1보다 훨씬 더 flaky** — footer/toolbar **button group(슬롯 인스턴스)**의 자식 1개만 바꿔도(visible=false 등) 형제 ID가 재생성돼 직후 `appendChild` 실패. → **button group을 `detachInstance()`해 프레임화하면 안정**(내부 버튼은 인스턴스 유지). 결론: 재정렬·visibility·아이콘 swap 등 **다중 편집은 슬롯 인스턴스를 먼저 detach**. 아이콘 방향 불일치(가져오기=upload↑/내보내기=download↓)는 `swapComponent`로 교차 교체. **2026-06-24 검증 종료:** ① 단독 인스턴스 = `findAll`(209)·셀 편집 정상, **고스트 0**(컴포넌트 자체 건강) ② **ModalBody 슬롯에 넣으면 고스트 5개 재현**(슬롯 미러링, 재조회 실패) — 과거 모달-테이블 크래시의 정체. 결론: detach 필요성은 '테이블이라서'가 아니라 '**슬롯 안 편집**'에서 옴. 규칙 13 문구 '필수→대량/슬롯 편집 시 권장'으로 수정 완료 |
| 13b detach해도 디자인 유지 | 8 | 06-25 | 06-25 테이블 템플릿 detach 후에도 셀 색·태그·구분선 유지됨 확인('지원자 배경'서도 컬럼/너비 재구성 후 구분선·정렬 유지) |
| 13c 단순 컴포넌트는 연결 인스턴스 유지 | 5 | 06-24 | Modal은 연결 유지·표만 detach로 운영 |
| 13d 체크박스 셀 44px 고정 | 2 | 06-24 | **세션 중 신설** — 기존 56px로 그렸다가 교체. 규칙 확정 전 작업물 보정 필요했음 |
| 13e (코드)detach 없이 Table 조립 | 0 | – | |
| 14 개별 DS 컴포넌트는 Code Connect로 찾아 인스턴스화 | 1 | 06-26 | **2026-06-26 신설.** 작도 시 개별 컴포넌트는 `get_code_connect_map` 역조회(컴포넌트명→nodeId)로 찾아 createInstance. 마찰: ① 맵이 **조회 노드 서브트리 범위만** 반환 → 부분 결과 보고 "Input·Select·Tag 미연결"이라 잘못 단정(실제 Editor 빼고 전부 연결). ② 컴포넌트 SET 노드도 매핑돼야 Dev Mode "Connected"·`get_code_connect_map` 읽기 안정(Label에서 variant만 매핑 시 `{}`였다 SET 매핑 후 정상). 현황 메모리 [[reference_code_connect_coverage]] |
| ~~구 14 폰트 정책~~ → 규칙 4(요소 분석)로 통합 | – | 06-24 | 2026-06-24 Pretendard 설치로 휴면 → **독립 규칙 폐지**. '작업 시작 시 폰트 점검 · 설치 불가 환경에서만 텍스트 변경 보류'를 규칙 4(요소 분석)에 흡수. (과거 마찰: 구 규칙 14 vs '이미지 내용대로' 충돌로 사용자 확인 필요했음) |

## 튜닝 후보 (메모가 쌓이면 여기로 승격)

- ~~**규칙 4 (조립 vs 복제) — 2026-06-25 가장 큰 마찰**~~ → **2026-06-26 해소.** 규칙4 본문에 '큰 단위 = 큰 컴포넌트/템플릿 조립이지 완성본 복사가 아님' 경고 블록을 명시하고, templates(modal/list/form/detail) 예제를 '손으로 만드는 코드' → '기존 컴포넌트 import 조립'으로 전면 교체, 체크리스트도 정합. (잔여: '라우팅 파일은 파일명만 적지 말고 실제로 읽고 완료 체크리스트 검증' 습관은 CLAUDE.md ⓪에 이미 있음 — 별도 규칙 승격은 보류.)

- ~~**규칙 5 (상태)**: 'state'와 '의미색(type)' 경계 명확화~~ → **2026-06-24 해소.** Tag 속성 `type`→`color` 개명, 규칙 5에 상태(state)/분류색(color) 구분 반영. (후속: 코드 Tag prop `type`→`color` 정렬 여부 결정 필요)
- **규칙 5d / 13 (버튼 텍스트)**: "중첩 인스턴스 버튼 텍스트는 setProperties 불가 → state 적용 후 detach" 를 본문에 명시할지.
- ~~**규칙 14 (폰트)**~~ → **2026-06-24 완료.** Pretendard 설치로 휴면 → 독립 규칙 폐지, 폰트 가용성 점검 절차를 규칙 4(요소 분석)에 통합.
- **규칙 3 (DS 우선)**: '페이지' 단위가 비어 있음 — 페이지 체계 확립 시 보강.
- ~~**규칙 13 (테이블)**~~ → **2026-06-24 해결.** 컴포넌트 자체는 건강, 고스트는 **슬롯(ModalBody) 내부 편집**에서만 발생함을 확인. 규칙 문구를 '필수 → 대량/슬롯 편집 시 권장'으로 수정 완료. (추가 여지: 슬롯 미러링 회피용으로 표를 슬롯 밖에서 만들어 마지막에 넣는 패턴 검토)
