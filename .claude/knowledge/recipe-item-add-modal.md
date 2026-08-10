# 항목 추가 모달(입력행+순서/명칭/아이콘 테이블) Figma 재현 레시피 — 2026-07-03 완성본 test 페이지 Frame 8

> 이 파일은 저장소가 원본입니다(2026-08-10 노트북 메모리에서 이관 — 집/회사 어느 컴퓨터에서든 공유).
> 내용을 갱신하면 저장소에 커밋할 것. 개인 메모리에는 다시 쌓지 않는다.

"항목 추가" 모달을 Figma에 그리는 레시피 (2026-07-03 완성: test 페이지 Frame 8 = 8176:37306, 딤 8178:13301 + Modal 8178:13303). ID는 [[reference-figma-component-registry]] 참조. 코드 구현은 `ModalTestPage.jsx`의 `ItemAddModal`(Modal lg + TableTemplate + iconCellWidth(2,{buttonSize:32})=92).

**조립 순서 (6~7회 호출로 압축 가능 — 기계적 루프는 한 호출에 합칠 것):**
1. 딤(Modal Overlay Bg) + Modal(width size=600) 인스턴스 → 타이틀 TEXT="항목 추가"(폰트 로드 후), 푸터 기본(취소/확인) 유지 + "컴포넌트 영역" 라벨 visible=false
2. ModalBody SLOT에 `body content` VERTICAL auto-layout(gap 12) → 입력 행 HORIZONTAL(gap 8): input 인스턴스(placeholder#7202:7="채용 분야 코드를 입력하세요", FILL) + 02_line_left icon text(text#7045:0="추가", 아이콘 plus로 swap — 기본이 image) → 테이블 템플릿 인스턴스 FILL
   - ⚠️ 슬롯 삽입 직후 인스턴스 ID 재생성 → 이후 매 호출 modal→slot부터 재탐색
3. 테이블 템플릿 detach → table control visible=false → table도 detach(슬롯 안 대량 편집)
   - ⚠️ **detach 후 FILL이 풀린다(2026-07-03 재현에서 확인)**: ttFrame·table·**body 컨테이너·각 행** 전부 `layoutSizingHorizontal='FILL'`을 detach 직후 한 번에 재설정할 것 — 빼먹으면 테이블/행이 960 폭으로 남아 보정 호출 2회 추가됨
4. 헤더/데이터 행(10행) 동일 패턴: 6셀 중 [0]check·[1]select/tag·[4]remove → 남은 3셀 appendChild 재정렬 [text280→순서60 FIXED, textFILL→명칭, 마지막→92 FIXED]. 헤더 텍스트 "순서"/"명칭"/" "+아이콘 버튼 visible=false
5. 텍스트+색 (한 호출): 순서 1~10 전부 + 명칭 1~7행(수시/공채/상시/특별채용/추천채용/마이다스인/마이다스아이티)을 font_icon 3 변수 바인딩 회색, 8~10행은 기본색(dsfsdfsdfsdf 등)
6. 아이콘 셀 (한 호출): TEXT visible=false, itemSpacing=8, primaryAxisAlignItems='MAX' → 03_ghost_icon(32) ×2 (1~7행 Disabled/8~10행 Default) + pencil/trash2 swap
7. 페이지네이션: row count visible=false, total count="총 25개", 페이지 1 selected·기존 selected(3) default·4~10 visible=false → 최종 스크린샷 대조
