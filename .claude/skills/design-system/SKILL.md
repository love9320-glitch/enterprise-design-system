---
name: design-system
description: 이 프로젝트(design-system)에서 UI 컴포넌트·페이지·토큰을 만들거나 수정할 때 따라야 할 규칙서. 버튼/카드/뱃지/인풋 등 컴포넌트 생성·수정, 모달·팝업·다이얼로그·confirm 창, 목록/리스트/테이블 페이지, 상세/디테일 페이지, 폼/입력/등록/수정 페이지, 색상·타이포·간격·라운드 등 디자인 토큰 작업 시 사용. 컬러 시멘틱 토큰 경유, 간격 토큰만 사용, 페이지 추가 절차, 컴포넌트 완전 옵션화 규칙 포함.
---

# 디자인 시스템 규칙서

이 프로젝트에서 UI 작업을 할 때 따라야 할 규칙을 작업 유형별로 분리해 정의한다.
**필요한 파일만 읽어** 토큰을 절약하면서 일관성을 유지한다 (progressive disclosure).

## 핵심 원칙 (모든 작업 공통, 반드시 준수)

1. **컬러는 시멘틱 토큰 경유** — Base 토큰 → Semantic 토큰 → 컴포넌트. 하드코딩 HEX/rgba 금지.
2. **간격·라운드·스트로크는 등록 토큰만** — `spacing-*`, `round-*`, `border-*`만 사용. Tailwind 기본값(`p-4`)·임의값(`p-[12px]`) 금지.
3. **새 페이지는 정해진 절차로** — `pages/XxxPage.jsx` 생성 → `pages/index.js` export → `App.jsx`의 `NAV_GROUPS`에 추가.
4. **컴포넌트는 완전 옵션화** — 모든 시각 옵션을 props로 노출, 기본값 명시, 인라인 스타일 금지.
5. **말줄임 텍스트는 hover 툴팁(목표)** — 좁아서 잘릴 수 있는 텍스트(목록·셀렉트 값·칩 등)는 hover 시 전체 값을 툴팁으로 보여주는 것을 지향한다(상세는 components.md 규칙 5). ※ 현재 공용 구현은 보류 상태 — 적용 시 드롭다운/overflow 컨테이너 안에서의 위치·잘림을 충분히 검증할 것.
6. **스크롤 영역은 `ScrollArea`** — 세로 스크롤이 생기는 곳은 네이티브 스크롤바를 쓰지 말고 `ScrollArea`(커스텀 오버레이 스크롤바)로 감싼다. `<ScrollArea maxHeight={…}>…</ScrollArea>`.
7. **날짜·시간 표기는 통일** — 날짜+시간 `YY.MM.DD (HH:MM)` · 날짜만 `YY.MM.DD` · 범위 `A~B`(공백 없는 틸드) · 시작만 `A ~ 마감일 없음` · 마감만 `시작일 없음 ~ B`(모두 2자리 0 패딩). 직접 조립 말고 `src/utils/datetime.js`의 `formatDate`/`formatDateTime`/`formatDateTimeRange` 사용(상세는 foundation.md).
8. **Figma 연결(Code Connect)은 개발환경 기능을 절대 훼손하지 않는다** — Figma 컴포넌트를 코드에 연결할 때, 개발환경에 구현된 컴포넌트의 기능·옵션(props·동작)에 **어떤 문제도 발생시키지 않아야** 한다. Code Connect는 코드↔디자인을 잇는 단방향 메타데이터 매핑일 뿐이므로, 연결을 위해 코드의 기능을 줄이거나 prop을 제거·변경하지 말 것. Figma 컴포넌트가 코드보다 옵션이 적어도(기본형만 있어도) 그대로 매핑하며, 부족한 표현은 코드 기본값/수동 지정으로 둔다(코드를 Figma에 맞춰 깎지 않는다). 매핑 후 코드 컴포넌트가 변경되지 않았는지 확인한다.
9. **에러 툴팁이 있는 입력은 감싸는 프레임의 clip content를 끈다** — Input 등의 에러 상태는 인풋 박스 아래로 absolute 오버레이(툴팁)로 표시된다. 이 인스턴스를 담는 프레임/오토레이아웃에 `clipsContent`(clip content)가 켜져 있으면 툴팁이 잘리므로, 에러 툴팁이 나오는 input을 Figma에 배치할 때는 그 상위 프레임들의 clip content를 **모두 꺼야** 한다.

## 작업 유형별 라우팅 — 아래 표에서 해당 행의 파일을 읽어라

| 작업 유형 | 읽을 파일 |
|-----------|-----------|
| **토큰 정의·수정** (색상/타이포/간격/라운드/보더/아이콘) | `foundation.md` |
| **공통 컴포넌트 생성·수정** (버튼/뱃지/카드/인풋 등) | `foundation.md` + `components.md` |
| **모달·팝업·다이얼로그·confirm 창** | `foundation.md` + `components.md` + `templates/modal.md` |
| **목록·리스트·테이블 페이지** | `foundation.md` + `components.md` + `templates/list-page.md` |
| **상세·디테일 페이지** | `foundation.md` + `components.md` + `templates/detail-page.md` |
| **폼·입력·등록·수정 페이지** | `foundation.md` + `components.md` + `templates/form-page.md` |

> 원칙: **foundation.md는 거의 항상** 읽는다(토큰 없이는 무엇도 못 만든다). 컴포넌트/페이지 작업이면 **components.md를 더한다**. 특정 페이지 유형이면 해당 **templates 파일을 더한다**.

## 작업 전 확인

- 작업 시작 전 해당 유형 파일을 먼저 읽고, 그 안의 **완료 체크리스트**를 작업 종료 시 검증한다.
- 규칙에 없는 새 패턴이 필요하면 임의로 만들지 말고 사용자에게 확인한다.
