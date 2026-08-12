# Props API 감사 리포트 (2026-08-12)

외부 평가서 권고("기존 컴포넌트 API 중복과 Props 비대화 감사")에 따른 1회성 전수 감사.
분석 대상: `dist-lib/components.json` 98개 컴포넌트 + 소스 union 타입. **이번 감사는 기록·규칙 도출용이며 breaking 개명은 하지 않는다**(정책: deprecated는 major에서만 제거).

## 일관성이 잘 지켜지고 있는 축 (변경 불필요)

- **size = 픽셀 문자열**(`'32' | '24' | '18'` 등) — 전 컴포넌트 공통 컨벤션, Figma variant와 1:1. 유지.
- **controlled 3종 세트** `value / defaultValue / onChange` (21·19·25회) — 전면 통일. Table만 집합이라 `selectedIds/onSelectChange`, 체크류는 `checked` — 역할별 구분이라 정당.
- **에러 3층** `error(10) / errorMessage(10) / formatErrorMessage(3)` — 표준 카피 기본값과 함께 일관.
- **모달 푸터 축** `confirmText/cancelText/confirmVariant/confirmDisabled/confirmLoading/showCancel`(각 9회) — 모달 계열 전체 동일. 유지.
- **로딩 정책 축** `loading / bodyLoading / confirmLoading / loadingMessage` — 규칙 22와 정합.

## 발견된 불일치·비대화 (조치 판정)

### ⚠️ 실제 불일치 1건 — Tabs `variant='hug'|'fill'`
같은 개념을 Button·Tabs가 다른 이름으로 노출: **Button은 `width='hug'|'fill'`, Tabs는 `variant='hug'|'fill'`**. hug/fill은 폭 개념이므로 Tabs가 이탈.
→ **판정: 다음 major에서 `width`로 이동(deprecated 병행)**. 당장은 breaking이라 보류. 신규 컴포넌트는 hug/fill을 반드시 `width`로.

### 📏 placeholder 변형 10종 — 비대화 주범
`placeholder / searchPlaceholder / inputPlaceholder / selectPlaceholder / editorPlaceholder / jobdaGroupPlaceholder …` — 복합 템플릿이 내부 필드마다 `부위+Placeholder`를 1:1 노출한 결과. prop 수 상위(FileUploadButton 55 · ImageUploadButton 49 · FileUploadMenu 47)도 같은 패턴이 원인.
→ **판정: 기존 API 유지**(소비자 호환). **신규 템플릿부터는 부위별 그룹 객체 prop**(예: `search={{ placeholder, width }}`) **을 먼저 검토**하고, 평평한 `부위+속성` 나열은 3개 이상 겹칠 때 중단.

### 📏 높이 계열 이름 8종
`maxHeight / bodyMaxHeight / tableHeight / boxHeight / editorMinHeight …` — 부위 접두사 자체는 정당(어느 박스의 높이인지 명시).
→ **판정: 유지 + 명명 규칙 고정 — "부위 + Height/MaxHeight"** 패턴만 허용, 새 변형 금지.

### 📏 업로드 계열 4종 내부 중복
FileUploadButton/ImageUploadButton/FileUploadMenu/ImageUploadMenu가 유사 props 대량 공유(각 43~55개).
→ **판정: API 불변, 코드 내부 공통 타입 추출은 이 계열을 다음에 수정할 때 함께**(선제 리팩터 금지 원칙).

### 📏 ariaLabel 2곳뿐
Select·Pagination에만 존재. 접근 이름이 필요한 다른 트리거류(아이콘 전용 버튼은 tooltip/aria-label로 해결됨)는 필요 시 같은 이름 `ariaLabel`로 확대.

## 신규 컴포넌트 작성 시 적용 규칙 (요약)

1. hug/fill 폭 옵션은 `width`, 시각 스타일 계열만 `variant`
2. size는 픽셀 문자열 enum
3. 부위별 세부 옵션이 3개 이상 겹치면 평평한 나열 대신 그룹 객체 prop
4. 높이는 "부위+Height" 패턴만
5. controlled는 `value/defaultValue/onChange`(집합은 `~Ids`), 에러는 `error/errorMessage`

다음 감사: 컴포넌트 20개 이상 추가되거나 두 번째 소비 제품이 생길 때.
