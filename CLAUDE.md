모든 응답은 한국어로 해주세요.

## Figma UI 작도 시작 전 필수 절차 (재발 방지)

Figma에 UI를 그리거나 수정하는 작업(`use_figma` 쓰기)을 시작하기 전에, **그 작업의 첫 응답에서 아래 3가지 확인 결과를 먼저 한 줄씩 출력하고 시작한다.** 확인 없이 즉흥적으로 손으로 셸을 그리거나 색·간격·라운드를 하드코딩하지 않는다. (이 출력이 없으면 사용자가 "체크부터"라고 지적한다.)

- **⓪ design-system 규칙서**: 작업 유형 라우팅 파일을 **실제로 읽고 그 "완료 체크리스트"를 검증한다**(파일명 언급만 하고 넘어가지 말 것 — 모달이면 `templates/modal.md`를 열어 dim 시멘틱 알파 토큰·간격/라운드 토큰·푸터 Button 등 체크). + **규칙 4(바로 만들지 말고 분석 → 매핑(페이지>템플릿>컴포넌트) → 조합 → 정리, _큰 단위 먼저 = 큰 컴포넌트/템플릿부터 조립_)** + 규칙 1·2(색·간격·라운드는 토큰/Figma 변수 경유, 하드코딩 금지) + C구역 11~13(Figma 작도 전용: Code Connect 훼손 금지·에러툴팁 clip·테이블 detach, 단 Button·Tag 등은 연결 인스턴스 유지)
- **① 레시피·레지스트리(`.claude/knowledge/`)**: 이 작업의 재현 레시피와 노드 ID 레지스트리가 저장소 `.claude/knowledge/` 폴더에 있는지 확인하고 **실제로 읽는다** (예: 지원자 선택 모달 → `recipe-input-selection-modal.md` · 노드 ID → `figma-component-registry.md` · 파일키/폰트/변수 제약 → `figma-design-system.md` · Code Connect 현황 → `code-connect-coverage.md`). 이 폴더가 Figma 작업 지식의 **원본**이다(개인 메모리 아님 — 깃허브로 모든 컴퓨터에 공유되며, 갱신도 이 폴더 파일에 하고 커밋한다).
- **② 기존 작업물**: 이 Figma 파일(특히 `test` 페이지)에 어제/기존 작업물이 있으면 **구조 참고용으로만** 본다. **완성본을 복제(clone)로 때우지 말 것 — 어제 방식이 아니다.** 실제 작도는 규칙 4대로 **큰 컴포넌트/템플릿부터 조립**한다: ⑴ 팝업(Modal) 컴포넌트 인스턴스 → ⑵ 바디 slot에 테이블 템플릿 삽입 → ⑶ 불필요 요소 `visible=false` → ⑷ 컴포넌트로 안 되는 세부만 detach해 수정. (모달 레시피: `.claude/knowledge/recipe-input-selection-modal.md`)

연결된 디자인 시스템(이 파일 ↔ 코드, Code Connect)의 **로컬 컴포넌트만** 사용하고, 외부 라이브러리(`libraries_available_to_add` 등)는 가져다 쓰지 않는다.
