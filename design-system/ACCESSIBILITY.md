# 접근성 계약 (Accessibility Contracts)

복합 위젯 4종의 역할(role)·키보드 조작·포커스 규칙·ARIA 연결을 계약으로 명문화합니다.
여기 적힌 동작은 자동 테스트(Vitest 87종 중 키보드 흐름·ARIA 계약 테스트)가 상시 검증하며,
변경 시 이 문서와 테스트를 함께 갱신합니다. 각 절은 `components.json`의 `accessibility` 필드로도 동봉됩니다(AI 도구용).

공통: 모든 컴포넌트는 axe 자동 검사(위반 0)를 통과하며, `data-state` 꼬리표는 시각 상태를 DOM에 노출합니다(스크린리더용 아님 — ARIA가 담당).

## Modal

- **역할**: 박스에 `role="dialog"` + `aria-modal="true"`. 제목(h2)이 있으면 `aria-labelledby`로 자동 연결.
- **포커스**: 열리면 포커스 트랩 — Tab/Shift+Tab이 모달 안에서 순환. `initialFocus`로 첫 포커스 요소 지정 가능(미지정 시 첫 포커서블). 닫히면 **열었던 트리거로 포커스 복원**.
- **키보드**: `ESC` = 닫기(모달이 겹쳐 있으면 **최상단 모달만**). 배경 스크롤 잠금.
- **로딩**: 확인 버튼 `confirmLoading` 시 `aria-busy`(Button 공통).
- **알려진 제약**: 없음.

## Select

- **역할**: 트리거 `role="combobox"` + `aria-expanded` + `aria-controls`(목록 id). 접근 이름은 `ariaLabel` → `label` → `placeholder` 순 자동. 목록은 `role="listbox"`, 옵션은 `role="option"` + `aria-selected`.
- **키보드**:
  | 키 | 닫힌 상태 | 열린 상태 |
  |---|---|---|
  | `Enter` / `Space` / `↓` | 열기 | `Enter`=현재 강조 옵션 선택(단일 선택은 닫힘, `multiple`은 유지) |
  | `↓` / `↑` | — | 강조 이동 — **disabled 옵션은 건너뜀** |
  | `ESC` | — | 닫기 + 트리거로 포커스 복원(값 변경 없음) |
  | `Tab` | (체인 모드 `tabOpens`) 열기 | 옵션 순회, 끝에서 닫고 다음 요소로 진행 |
- **ARIA 연결**: 강조 이동 시 `aria-activedescendant`가 현재 옵션 id를 가리킴(포커스는 트리거/검색바에 유지).
- **검색(`searchable`)**: 열리면 검색바가 키를 처리, 필터 결과 기준으로 동일 규칙 적용. 결과 없음은 "검색 결과가 없습니다." 텍스트로 표시.
- **알려진 제약**: 타이프어헤드(글자 입력으로 옵션 점프)는 미지원 — `searchable`이 그 역할.

## DatePicker

- **역할**: 날짜는 숫자 이름의 버튼(예: "15"), 월 이동은 `aria-label="이전 달"/"다음 달"` 버튼.
- **키보드**: Tab으로 버튼 간 이동, `Enter`/`Space`로 선택 — 표준 버튼 동작.
- **비활성**: `minDate`/`maxDate`(당일 포함 경계)·`disabledDate`에 걸린 날짜는 `disabled` + `aria-disabled="true"` — 클릭·선택 불가.
- **range 모드**: 시작일 이전 날짜를 찍으면 마감이 아니라 **시작 재지정**, 완성된 범위에서 다시 찍으면 새 범위 시작.
- **알려진 제약**: 캘린더 그리드 방향키 내비게이션(←→↑↓로 날짜 이동, `role="grid"` 패턴) 미구현 — backlog. 현재는 Tab 순회 기반.

## Table

- **역할**: 시맨틱 `<table>` 구조(columnheader/row/cell 자동).
- **정렬**: 정렬 적용된 컬럼 헤더(th)에 `aria-sort="ascending"|"descending"` 자동 표기(정렬 없는 컬럼은 속성 없음). 헤더 메뉴의 "오름차순/내림차순 정렬" 항목은 현재 정렬을 selected로 표시.
- **선택**: 헤더 체크박스 = "전체 선택", 행 체크박스 = 기본 "행 선택" — `getRowSelectionAriaLabel(row)`로 행 식별자 포함 이름 권장(예: "김서연 행 선택"). 체크박스 클릭은 `onRowClick`과 충돌하지 않음.
- **알려진 제약**: 셀 단위 키보드 그리드 내비게이션(`role="grid"`) 미지원 — 읽기 중심 테이블 패턴.
