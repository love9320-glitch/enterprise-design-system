# Figma 파일(h9jZFkEHfcHUGok1TZjjlP) 자주 쓰는 컴포넌트/변수 노드 ID 레지스트리 — 작도 전 조사 호출 생략용

> 이 파일은 저장소가 원본입니다(2026-08-10 노트북 메모리에서 이관 — 집/회사 어느 컴퓨터에서든 공유).
> 내용을 갱신하면 저장소에 커밋할 것. 개인 메모리에는 다시 쌓지 않는다.

Figma 작도 시 매번 조사하지 말고 이 ID를 바로 사용한다 (2026-07-03 검증. 살아있는지 의심되면 getNodeByIdAsync 1회로 확인).

**Code Connect와의 관계**: 이 레지스트리는 캐시, Code Connect 맵은 진실 소스. ID가 죽었으면(null) `get_code_connect_map` 역조회(컴포넌트명→nodeId)로 셋 ID를 복구하고 이 파일을 갱신한다. 단 맵은 셋 단위·서브트리 범위 반환이라 variant별 ID·속성 이름(text#…)·아이콘·변수 ID·구조 지식은 못 주므로 완전 대체 불가 — 그 부분이 이 파일의 존재 이유.

## 셸·오버레이
- `Modal` **(신) COMPONENT_SET 8187:47759 — 2026-07-03 재제작·Code Connect 재연결(SET+7변형 모두 매핑 — SET 매핑 없으면 Dev Mode 미표시)**: 360=8187:47760 / 480=8187:47996 / **600=8187:48037** / 720=8187:48078 / 840=8187:48119 / 960=8187:48160 / 1260=8187:48201. 자식: ModalHeader / ModalBody(SLOT) / ModalFooter — 구조는 구버전과 동일 확인. **작도 시 이 신버전 사용.**
- `Modal` (구) COMPONENT_SET 7348:1758354 — 아직 존재하나 신버전으로 대체됨(기존 완성본들이 참조 중일 수 있어 삭제 여부는 사용자 판단)
- `Modal Overlay Bg` COMPONENT **7348:1758424** — 딤(modal/overlay 토큰 바인딩). target.insertChild(0, dim) + resize(화면)

## 버튼·아이콘
- `01_fill_text button` Default **7045:203780** / `02_line_text button` SET **7057:208** / `02_line_left icon text button` SET **7045:203828** (기본 아이콘이 image라 swap 필요) — 텍스트는 `setProperties({"text#7045:0":"…"})`
- `03_ghost_icon button` SET **7060:6799** — variants: state(Default/Hover/Pressed/Disabled/Loading) × size(32/24). Default32=**7060:6800**, Disabled32=**7060:6818**
- Lucide(페이지 7030:2): x **7032:85** · plus **7032:6** · trash2 **7032:24** · pencil **7032:17** · square-pen 7032:13 · upload 7032:43 · download 7725:53803

## 체크박스·라디오 (2026-07-28 추가)
- `check box` SET **7257:2441** — 변형 속성 실명 **`state`**(unselected/selected × default/hover/disabled — REST 확인, 심볼명 표기와 다름·오타 수정됨) + `right text`(TEXT)·`right text Boolean`(BOOL, 공백 포함 실명)
- `check group` SET **7626:2874** — gap(3~7)×direction(horizontal/vertical)
- `radio` SET **7368:1243** — state 6종(check box와 동일 계약)·`right text`/`right text Boolean`
- `radio group` SET **7626:3318** — gap(3~7)×direction
- `segmented control` 버튼 SET: text **7365:1304** / left icon **7365:1185** / right icon **7365:1228** / icon **7365:1271**(state=Default/Hover/Pressed/Disabled/Selected × size 32/24, 텍스트 'text') / 그룹 **7626:3942**(gap 변형명 미정리)
- `Segmented Tabs` SET **8241:88288**(tabs num=2/3) / `segmented tab button` SET **8241:88277**(state=unselect/hover/select — 내부 버튼)
- `switch` SET **7370:115** — 변형 속성 **`state`**(2026-07-29 개명·오타 수정 — checkbox/radio와 통일) + `right text`/`right text Boolean`

## 인풋·테이블·페이지네이션
- `table` **(신) COMPONENT_SET 8187:48556 — 2026-07-03 재제작·Code Connect 재연결(SET+4변형 모두 매핑)**: state=table=**8187:48557** / table outline=8187:49672 / table outline empty=8187:50512 / table empty=8187:49252. 구 table은 사용자가 삭제. ※ table template(7725:54157) 내부 table 인스턴스는 별도 구컴포넌트 7679:6835(state=table)를 참조하며 생존 — 템플릿 정상
- `input` SET **7202:8720** (페이지 09_input 7967:6157) — props: `placeholder#7202:7`(TEXT) · `input text#7202:22`(TEXT) · state 14종 · type=solid
- **input 파생 4세트(2026-08-12 신설·Code Connect 연결)**: `input unit` SET **9275:316**(state 14종×size 32/22, 우측 단위 suffix — 단위 텍스트 색=solid/default text #878787) / `input transparent unit` SET **9275:364**(32 단일) / `input password` SET **9275:519**(마스킹 점 색=입력 텍스트와 동일(2026-08-12 사용자 지시 — Figma 픽셀은 회색이나 코드 기준 확정), 점 렌더=Verdana(.input-password-mask, 크고 중앙), 눈 아이콘=font_icon 5 #0d0d0d·ghost hover) / `input transparent password` SET **9275:589**(32 단일). 코드 매핑=Input(type/unit props, Input.figma.tsx)
- `table template` SET **7725:55014** / 유일 variant **7725:54157** — 자식: table control(툴바) / table 인스턴스 / pagination 인스턴스. slot 삽입 후 `layoutSizingHorizontal="FILL"` 필수(잘림 방지)
  - table 셀 구성: 헤더 [check44, select85, textFILL, text280, text+icon100 ×2] / 데이터 [check44, tag85, textFILL, text280, text100 ×2]
- pagination 자식: `numer list`(0,1=«‹ 아이콘, 2~11=페이지 1~10, 12,13=›») / `row count`(페이지 행 select) / `total count`(TEXT). 페이지 버튼 `setProperties({state:"selected"/"default"})`

## 폼 템플릿 (2026-08-05 추가)
- `form template type b` SET **8620:13367** — 변형 column(1/2/3/Mixed column) × shadow(on/off) 8개. on: 1=8620:12654 / 2=8620:13368 / 3=8620:13661 / Mixed=8620:13496, off: 1=9241:36178 / 2=9241:36194 / 3=9241:36216 / Mixed=9241:36244(off 4개 column 값 오타 column8/7/6/5 → 2026-08-05 교정). props: `Slot#8620:1`(SLOT) · `title#9241:17`(BOOL — 폼 밖 상단 타이틀) · 폼 안 Sub title 로우는 속성 없이 항상 표시. 코드 FormTemplateB(shadow/title/subtitle prop) — Code Connect는 FormTemplateA.figma.tsx에서 shadow=figma.enum·title=figma.boolean 매핑
- `form template type a` SET **8071:35916** — Property 1(1/2/3/Mixed column) → FormTemplate(columns)
- `multi-step form Template` SET **9249:4529** — 변형 step(1=9249:4124/2=9249:4732/3=9249:4934). 각 변형=stepper line type+20px 간격+form template type b 계열 콘텐츠. 코드 MultiStepFormTemplate(steps 주입형 슬롯, 2026-08-05) + .figma.tsx(step enum→value, main 발행 완료). **매핑 상태(2026-08-05)**: SET=전체 GitHub URL로 정상 / **변형 3개=상대 경로 소스로 잠김(보류 — 사용자 결정)**. source에 상대 경로를 쓰면 Dev Mode GitHub 링크가 깨지므로 **반드시 `https://github.com/love9320-glitch/enterprise-design-system/blob/main/...` 전체 URL 사용**. 이미 매핑된 노드는 API 덮어쓰기 불가 — Figma UI에서 해당 노드 Disconnect 후 재등록(변형 문제 재발 시 이 절차)

## 변수(토큰)
- 컬러: `font_icon 1~5` = VariableID:308:360/363/364/368/369 (3=#878787 회색 텍스트용). 텍스트 회색 = `setBoundVariableForPaint(paint,'color',var)` 바인딩(직접 채색 ❌)
- **spacing FLOAT 변수는 이 파일에 없음** — 조립 프레임 gap은 코드 토큰 값 숫자(8/12px 등) 그대로

## 사이드 내비게이션 (2026-07-06 추가·게시됨)
- `side navigation button` SET **8200:51452** — props: state(default/disabled/hover/select)·line(line/none line)·`new tag#8200:23`(BOOL)·`icon#8200:28`(BOOL)·`arrow icon#8200:33`(BOOL)·`Text#8200:38`(TEXT). select+line=**8200:51448**
- `side navigation` SET **8200:51519** — line(on/off)×width(180/220/260), slot#8200:44. on180=8200:51479
- `side navigation Template` SET **8202:61044** — type(add code type/form type), slot#8202:45. add code=8202:61043
- 코드: `SideNavigation(Button)`=SideNavigation.jsx · `SideNavigationTemplate`=SideNavigationTemplate.jsx — SET+변형 전부 매핑
- ※ 2026-07-06 라이브러리 **게시됨**(사용자). 변형명 정리 이력: 버튼 'select, line' 깨진 명칭 복구, 컨테이너 line3~6→on/off, 템플릿 'add coed'→'add code' — 매핑은 노드 ID 기준이라 개명에 영향 없음

## 스크리닝 조건 카드 (2026-07-16 추가)
- `ConditionCard` SET **8243:88380** — state(Default **8243:88379**/hover 8389:116878/state3=drop 8389:116921), cardName(TEXT). drop=드래그 중(파란 아웃라인·텍스트, 헤더만 접힘)
- 코드: `ScreeningConditionCard`(내부용, ScreeningBuilderTemplate 전용)=ScreeningConditionCard.jsx — SET 매핑→변형 전파. 토큰 condition-card/* = conditionCardColors.js
- 세팅 플로우 컷(참고): 8389:117585 — 조건=tab radio list 팝오버 / 가·감점=radio list 팝오버
- `Formula` SET **8383:112161** — display(full/compact)×state(Default/hover). 코드: `ScreeningFormula`(내부용)=ScreeningFormula.jsx 매핑. 토큰 Formula/* = formulaColors.js — 함수 계열 색: AND·OR=green.400/IF=blue.400/SUM계열=violet.400/CAPMAX계열=pink.400/FITBYSCORE계열=orange.400(=7/13 base 유채색 용처), hover 아웃라인=계열 색(conditional만 blue.300). 그룹 예시: 8384:114161(SUM)·8384:114251(CAPMAX 중첩)·색상표 8384:114813

## 칩·수식 변수 (2026-07-19 동기화)
- `chip` SET **7977:31602**(페이지 11_chip 7964:2147) — 색은 `tag-chip` 컬렉션(**VariableCollectionId:7206:1248**)의 **모드**로 분기: blue/red/gray/black + **green(8560:0)/violet(8560:1)/pink(8560:2)/orange(8560:3)** 8모드. 변형 24개(색 8 × 상태 3). 새 색 추가 = 모드 추가+칩 변수 6종 값 설정+변형 복제·setExplicitVariableModeForCollection
- `Formula/hover bg` 변수 **VariableID:8559:23260**(#fafafa) — hover 변형 2개 fill 바인딩(2026-07-19 신설). 조건 카드 라인 변수는 알파 전환됨(default=gray-900-25, hover=gray-900-75), hover card text=blue.400
- tool bar(8389:126993) 그림자 0 2 5·버튼명 '함수 적용/함수 해제', 세그먼트 탭 '지정보유'(플로우 3곳) — 2026-07-19 코드와 동기화 완료. **underline 버튼 색7×weight2 변형은 미작도(보류)** — 세트당 변형 140개 폭발이라 규칙 11(코드>Figma 옵션 허용)로 기본형 유지 중

## 페이지
test=**7626:3255** · 01_buttons=943:36646 · 09_input=7967:6157 · 17_table=7332:1754313 · 18_modal=7343:1756948 · 01_table template=7332:1754312 · 02_Lucide=7030:2

관련: [[project-input-selection-modal-recipe]] [[project-item-add-modal-recipe]] [[feedback_figma_use_local_components]]
