# 지원자 선택(input_selection) 모달을 Figma에 그리는 재현 레시피 — 완성본 위치 + 구성 컴포넌트 + 토큰 경유

> 이 파일은 저장소가 원본입니다(2026-08-10 노트북 메모리에서 이관 — 집/회사 어느 컴퓨터에서든 공유).
> 내용을 갱신하면 저장소에 커밋할 것. 개인 메모리에는 다시 쌓지 않는다.

"지원자 선택" 모달(input_selection 패턴)을 Figma 파일 `h9jZFkEHfcHUGok1TZjjlP`에 그릴 때 **반드시 어제 방식 = 컴포넌트/템플릿 조립(규칙 3·4)으로** 한다.

## 어제 실제 워크플로우 = 컴포넌트/템플릿 조립 (이게 정답. 복제 아님)
완성본 복제는 **어제 방식이 아니다**(편법 — 어제 결과물에 의존하고 그 흠까지 복사함, 예: 확인 버튼이 detached Disabled로 굳음). 규칙 4의 "큰 단위 먼저"는 "**큰 컴포넌트/템플릿부터 조립**"이지 완성본 복사가 아니다. 순서:
1. **요청 분석 → 필요 요소 파악**.
2. **팝업(Modal) 컴포넌트를 먼저** 인스턴스화 — `Modal` 컴포넌트 `7348:1758354`, `width size`=960. **딤은 `Modal Overlay Bg` 컴포넌트(`7348:1758424`) 인스턴스로** 화면 뒤에 깐다(`target.insertChild(0, dim)` + `dim.resize(화면크기)`, 모달은 그 위 가운데). 이 컴포넌트를 쓰면 딤 색이 **`modal/overlay` 토큰에 바인딩된 채 유지**된다(직접 색·rgba ❌, modal.md 준수). 조립 시 딤을 빠뜨리기 쉬우니 반드시 추가.
3. **테이블 템플릿을 Modal 바디 slot에 삽입** — 검증됨(2026-06-25): Modal 인스턴스 내부 `ModalBody` SLOT을 `modal.findOne(n=>n.type==="SLOT")`로 찾아 `slot.appendChild(tt)`로 삽입 → 삽입 후 `modal.layoutSizingVertical="HUG"`. 테이블 템플릿 = `table template` COMPONENT_SET `7725:55014`(`01_table template` 페이지), 적합 variant `type=table control-table-pagination`(툴바+테이블+페이지네이션 **모두 포함**). 닫기는 ModalHeader의 `03_ghost_icon button`, 푸터 button group은 ModalFooter에 내장.
3b. **⚠️ 잘림 주의(2026-06-25)**: 테이블 템플릿이 **FIXED 960**이면 ModalBody slot에 **이미 있는 좌우 패딩(16/16)을 무시하고 넘쳐 테이블이 잘린다**. 해결 = 테이블 템플릿 프레임(`table.parent`)의 **width를 FILL로**(`layoutSizingHorizontal="FILL"`) → slot 패딩 안(928)에 자동으로 맞춰진다. **테이블 템플릿에 패딩을 직접 주지 말 것** — 모달 바디 패딩은 Modal 컴포넌트가 이미 정의(16/16)하므로 그걸 유지하고 콘텐츠(테이블 템플릿)만 FILL.
4. **테이블 템플릿에서 요소 확인 → 실제 내용에 없는 요소(컬럼/툴바 등)는 끈다(`visible=false`)** (규칙 4-(4)).
5. **컴포넌트로 못 덮는 세부는 그때 테이블을 detach해서 수정**(셀 텍스트·컬럼) (규칙 13 — 슬롯 안 테이블은 detach가 안전).
   - **정렬 컬럼 헤더 셀 주의(2026-06-25)**: 정렬/드롭다운 표시(⌄)가 있는 헤더는 `cell : select (text 20size)`(11_table table 컴포넌트의 `7332:1754317`을 clone)다. 템플릿의 `cell : text + 24 icon button`은 **more 메뉴(⋮ ellipsis-vertical)**라 다르다 — 이미지에 ⌄가 있으면 select 셀로 교체할 것(more ⋮로 착각 금지). clone한 select 셀을 헤더에 `insertChild` 후 기존 셀 `remove`, 너비/sizing 맞추고 텍스트 설정. 헤더에 정렬 아이콘이 불필요하면(이미지에 ⌄ 없으면) `cell:text+24icon` 안의 아이콘 버튼 `visible=false`.
   - **상태 태그 컬럼 유지·재배치(2026-06-25, '지원자 선택' 케이스)**: 태그 컬럼이 필요하면 템플릿 데이터의 `cell : tag`(2번째)를 살린다. 단 이미지에서 상태가 다른 위치(예: 4번째)면 셀을 옮겨야 하는데 **`insertChild(index, cell)`은 같은 부모 내 이동 시 인덱스가 빗나간다 → `cells` 배열을 원하는 순서로 만들어 `appendChild`로 차례로 다시 붙이는 게 안전**. 헤더엔 tag가 없으니(헤더는 select/text+icon) 그 위치 헤더 셀을 텍스트 "상태"로 쓰고 정렬아이콘 끔. **헤더/데이터 컬럼 너비 정렬**: 헤더 각 셀의 `width`/`layoutSizingHorizontal`을 데이터 같은 위치 셀에 `resize`+sizing으로 적용(안 그러면 tag(85) vs 헤더(100) 어긋남). 확인 버튼은 이 템플릿 푸터에선 `01_fill_text button` **인스턴스**(detach 아님) — 비활성은 `setProperties({state:"Disabled"})`.
6. 헤더 닫기·툴바 버튼(line left-icon)·검색바·페이지네이션·푸터 버튼은 **각각 로컬 컴포넌트 인스턴스**. 색·간격·라운드는 변수(토큰) 바인딩.

- 참고: 어제 결과물 = `test` 페이지(7626:3255) Frame 15 `7729:8738`(딤 `7764:7545` + Modal 인스턴스 `7764:7546`, 960×515). **구조 참고용으로만 보고, 복제로 때우지 말 것.** 딤 색은 `modalColors.overlay`=`gray-900-25`(약 7% 옅음).
- **구성 (전부 이 파일 로컬 컴포넌트 인스턴스 + 변수 토큰 55개 경유, 하드코딩 금지):**
  - 모달 셸 = 로컬 `Modal` 컴포넌트 **7348:1758354** 인스턴스 (수동 프레임·라운드/그림자 하드코딩 ❌)
  - 닫기 = `03_ghost_icon button` 7060:6799 + `x` 아이콘 7032:85
  - 툴바 = `02_line_left icon text button` 7045:203828 ×2 (가져오기=`upload`7032:43 / 내보내기=`download`7725:53803) + 선택해제(`plus`7032:6) + `search bar` 1507:41084 + `search` 7032:60
  - 테이블 = `check box` 7257:2441 ×6(헤더+5행) + **`tag` 7206:9375 ×5**(상태) + 텍스트 셀 조립 (table 컴포넌트는 에러라 미사용)
  - 페이지네이션 = `pagination` 7332:1755014 + `pagenation button` 7263:1752988 ×9 + chevron 아이콘(7259:1750482/7031:20/7031:23/7259:1750481)
  - 푸터 = `02_line_text button` 7057:208(취소) + button group 7626:2719 + 페이지행 select
- 색·간격·라운드는 **Figma 변수(토큰) 바인딩**으로(boundVariable 55개). 직접 색/px 입력 금지. [[feedback_figma_use_local_components]] [[reference_figma_design_system]]

**변형 방법(예: '지원자 배경' = 같은 모달의 변형 — 2026-06-25 검증).** 완성 모달을 복제(딤+모달 둘 다) 후 차이만 손본다:
- 텍스트: 인스턴스 내부 TEXT 노드를 `getStyledTextSegments(['fontName'])`로 폰트 로드 후 `characters` **직접 편집 가능**(제목·검색바·데이터·헤더·페이지수·선택수 모두).
- 컬럼 제거(복제본 편집 시): 해당 셀을 `visible=false`. auto-layout이라 숨기면 컬럼이 사라짐.
- **테이블 템플릿 detach 편집(조립 워크플로우, 2026-06-25 검증)**: 테이블 부분 인스턴스를 `detachInstance()` → 결과 프레임 children = `[table header row, table body]`. **행 줄이기** = `body.children` 뒤에서부터 `.remove()`(헤더행을 바디로 착각 말 것 — `find(len>3)`은 헤더(6셀)를 먼저 잡으니 `children[1]`을 바디로 지정). **컬럼 제거** = 헤더행과 **모든 데이터 행에서 같은 위치 셀을 `.remove()`**(헤더 6셀=check/select/text×3/text+icon, 데이터 6셀=check/tag/text×4 — 셀 구성이 달라 헤더는 `select`, 데이터는 `tag`+여분 `text`를 지워 4셀로 맞춤). **텍스트** = `cell.findOne(n=>n.type==="TEXT")`에 직접 `characters`. **주의: detach하면 형제(페이지네이션 등)의 인스턴스 경로 id가 무효화**되니, 이후 텍스트는 id 대신 `modal.findAll(TEXT)` + 내용 매칭으로 재탐색.
- 체크박스 선택: 인스턴스에 `setProperties({"Property 1":"selected default"})` (값만, "Property 1=" 접두사 빼고).
- 페이지네이션: 현재 페이지 버튼 `setProperties({"state":"selected"})`·이전 현재 버튼은 `"default"`, 여분 페이지 버튼은 `visible` 토글(variant는 state/type 2축).
- 비활성→활성 버튼: 어제 '확인'은 fill text button이 **Disabled 상태로 detach**돼 있었음 → fill Default 인스턴스(`7045:203780`) 생성해 button group의 SLOT에 `insertChild`로 교체 후 텍스트 설정.
- 아이콘 교체: 버튼 안 nested 아이콘 인스턴스를 `swapComponent`(휴지통=`trash2` 7032:24, 플러스=`plus` 7032:6; upload=`7032:43`, download=`7725:53803`; 아이콘 컴포넌트는 `02_Lucide Icons` 페이지 7030:2). 가져오기=upload↑/내보내기=download↓가 이미지 기준(템플릿 기본값은 반대라 교차 swap).

## 2026-06-25 추가 검증 (모달 3건: 지원자 배경/선택 신규 조립)
- **버튼 텍스트는 `text#7045:0` 컴포넌트 속성으로** — line/fill/`02_line_left icon text` 버튼 모두 `setProperties({"text#7045:0":"…", "state":"Disabled"})`로 텍스트·상태 동시 설정 가능. **중첩 TEXT 직접 편집(getStyledTextSegments)이 슬롯 고스트로 'node not found' 날 때 이게 정답.** ⚠️ `setProperties` **직후 같은 노드 readback 금지**(노드 ID 재생성→실패). set만 하고 끝낼 것.
- **슬롯 미러링 불안정 회피 = button group/table template를 `detachInstance()`해 프레임화** — footer/toolbar의 `button group`은 슬롯 인스턴스라 자식 1개만 바꿔도(visible=false) 형제 ID 재생성 → 직후 `appendChild` 실패. 재정렬·visibility·아이콘 swap 등 **다중 편집 전에 그 button group(또는 테이블 템플릿 전체)을 detach**하면 안정(내부 버튼·태그·체크박스 인스턴스는 연결 유지). 헤더 정렬아이콘 제거는 text+icon 셀 안 아이콘 버튼 `visible=false`.
- **tag 컬럼(상태) 케이스**: `tag` 인스턴스는 `text#7206:20`+`color`(blue/red/gray) 속성 → `setProperties`로 텍스트+색 동시(검토중=gray/합격=blue/보류=red). 데이터 행에서 tag 위치 이동은 `[check,text,text,tag,text]` 배열로 `appendChild` 재정렬.

## ✅ 완성 점검 체크리스트 (그린 뒤 반드시 확인 — 2026-06-25 세션에서 실제 지적된 항목들)
- [ ] **딤 배경**: `Modal Overlay Bg` 컴포넌트로 화면 뒤에 깔았는가? 딤이 `modal/overlay` 토큰 바인딩인가? (조립 시 가장 자주 빠뜨림)
- [ ] **모달 셸**: `Modal` 컴포넌트 인스턴스인가? (수동 프레임·라운드/그림자 하드코딩 ❌)
- [ ] **조립 방식**: ModalBody slot에 테이블 템플릿 삽입인가? (완성본 복제 ❌)
- [ ] **잘림**: 테이블 템플릿 width=FILL이고, 모달 바디 패딩(16/16) 유지한 채 테이블이 928로 맞춰졌는가? (헤더·툴바·테이블·푸터 좌측 라인 정렬)
- [ ] **불필요 요소 제거**: 내용에 없는 요소(Table Title, 안 쓰는 툴바 버튼) `visible=false` 했는가?
- [ ] **정렬 헤더**: 정렬 표시(⌄) 컬럼은 `cell : select (text 20size)`인가? (more 메뉴 ⋮ ellipsis-vertical로 착각 ❌)
- [ ] **컬럼/행/데이터**: 컬럼 수·행 수가 이미지와 맞고 텍스트 입력 완료인가?
- [ ] **상태 variant**: 체크박스 selected, 페이지네이션 현재 페이지, 확인 버튼 활성(fill) 반영했는가?
- [ ] **토큰 경유**: 색·간격·라운드를 직접 입력하지 않고 변수(토큰)로 했는가? (하드코딩 ❌)
- [ ] **modal.md 검증**: 딤 알파 토큰·간격/라운드 토큰·푸터 Button 등 완료 체크리스트를 실제로 확인했는가?
