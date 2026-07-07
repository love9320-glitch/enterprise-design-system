# Template — 모달 / 팝업 / 다이얼로그

confirm 창, 알림, 입력 다이얼로그 등 오버레이 UI 규칙. `foundation.md` + `components.md` 전제.

## 먼저 — 손으로 만들지 말 것 (규칙 4)

모달/팝업/다이얼로그는 **이미 `components/Modal.jsx`에 구현돼 있다.** dim·패널 셸을 새로 짜지 말고 아래 중 맞는 컴포넌트를 import해 조립한다.

- 일반 팝업 → `Modal`
- 폼(취소/저장, form 래핑·유효성) → `FormModal`
- 알림(헤더 없음, 본문 슬롯 고정) → `AlertModal`
- 확인(재확인 체크박스·전체폭 버튼) → `ConfirmModal`

## 컴포넌트가 이미 처리하는 것 (다시 구현 금지)

- 오버레이(dim, `modal-overlay` 시멘틱 알파 토큰) + 패널(`modal-inline` 배경·`modal-outline` ring·라운드) 2층 셸 — 임의 `rgba`/색 하드코딩 불필요.
- 너비 단계 `size`(sm/md/lg/xl/2xl/3xl/4xl/fill) props. 임의 px 금지.
- 헤더·본문·푸터 3영역, 영역 간 토큰 간격, 본문 70vh 초과 시 내부 `ScrollArea`.
- 푸터 버튼은 내부에서 공통 `Button`(ButtonGroup) 사용 — `confirmVariant`로 주/보조 구분.
- 닫기 트리거(딤 클릭·ESC·X) → 모두 `onClose`, body 스크롤 잠금, portal 처리.

## 호출부가 줄 것

- `open` / `onClose` 필수.
- 본문(children)과 라벨·핸들러(`confirmText`/`onConfirm` 등)만 props로 전달.
- 컴포넌트가 안 덮는 세부만 `footer`/`footerStart` 커스텀 슬롯으로 채운다(규칙 4 — 커스텀은 가장 늦게·좁게).
- **`footerStart`에 버튼(그룹)이 선두로 들어가면 `footerStartType="button"`을 함께 지정한다** — 푸터 왼쪽 여백이 텍스트=16px/버튼=12px(버튼 자체 여백 감안)로 갈린다(2026-07-06 지시, 기본값은 'text'=16).

## 모범 예제 — 기존 `Modal` 컴포넌트를 조립한다 (직접 만들지 않는다)

> ▶ **실행되는 전체 예제 = 데모 페이지 `pages/ModalPage.jsx`** (빌드·lint로 검증되는 살아있는 코드). 아래 스니펫은 **조립 '패턴' 견본**일 뿐 복붙용 정답이 아니다 — prop 이름·값의 진실은 항상 **`Modal.jsx` + components.md 카탈로그**다(예제는 드리프트할 수 있으니 의심되면 코드 확인).

> **핵심(규칙 4): 모달은 손으로 만들지 말고 `components/Modal.jsx`의 `Modal`/`FormModal`/`AlertModal`/`ConfirmModal`을 import해 조립한다.** 아래는 "이미 있는 컴포넌트를 어떻게 쓰는가"의 견본이다. dim·패널·라운드·푸터 버튼·ESC/딤 닫기·body 스크롤잠금·포커스 트랩은 **컴포넌트가 이미 처리**하므로 다시 구현하지 않는다. 전체 옵션은 `components.md`의 Modal 카탈로그 행과 `Modal.jsx` 코드가 진실이다.

### (1) 일반 팝업 — base `Modal`

```jsx
import { Modal } from '../components/Modal';

export function ExampleModal({ open, onClose, onConfirm }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="제목"
      size="md"                 // sm/md/lg/xl/2xl/3xl/4xl/fill
      confirmText="확인"
      cancelText="취소"
      onConfirm={onConfirm}
    >
      {/* ModalBody에 들어갈 본문만 작성 — dim/패널/푸터는 컴포넌트가 만든다 */}
      <p className="text-14 text-font-icon-4">본문 내용</p>
    </Modal>
  );
}
```

### (2) 폼 모달 — `FormModal` (취소/저장 + form 래핑)

```jsx
import { FormModal } from '../components/Modal';
import { Input } from '../components/Input';

export function MemberFormModal({ open, onClose, onSubmit, submitting }) {
  return (
    <FormModal
      open={open}
      onClose={onClose}
      title="멤버 등록"
      submitText="저장"
      onSubmit={onSubmit}       // 주면 본문+푸터가 <form>으로 감싸지고 저장 버튼이 submit
      loading={submitting}
    >
      <div className="space-y-spacing-7">
        <Input placeholder="이름" />
        <Input placeholder="이메일" />
      </div>
    </FormModal>
  );
}
```

### (3) 확인 다이얼로그 — `ConfirmModal` / `AlertModal`

```jsx
import { ConfirmModal } from '../components/Modal';

// 헤더 없이 title→description→(회색 박스)descriptionDetail→재확인 체크박스 슬롯 고정.
// requireCheck(기본 true)면 체크해야 확인 버튼 활성화.
export function DeleteConfirm({ open, onClose, onConfirm }) {
  return (
    <ConfirmModal
      open={open}
      onClose={onClose}
      title="삭제하시겠습니까?"
      description="이 작업은 되돌릴 수 없습니다."
      confirmText="삭제"
      confirmVariant="fill"
      onConfirm={onConfirm}
    />
  );
}
```

> **Figma 작도 시**: 위와 대응되게 `Modal` **컴포넌트 인스턴스**를 만들고 `ModalBody` slot에 본문(테이블 템플릿 등)을 조립한다. 완성본 복제(clone) 금지 — 규칙 4 참조. 표를 slot 안에서 편집할 땐 detach(규칙 13).

## 규칙 18 — 모달 안 무한 스크롤(페이지네이션 없는) 테이블 설정 (2026-07-06 지시)

모달 본문에서 **페이지네이션 없이 목록이 계속 늘어날 수 있는 테이블**은 아래 설정을 기본값으로 적용한다:

```jsx
<Table bordered maxHeight="fill" className="min-h-0" … />
```

- `bordered`(외곽라인) + `maxHeight="fill"` + `className="min-h-0"` — 바디 스크롤 상한 = **모달 가용 높이**(ModalBodyMaxContext 체인). 헤더는 스크롤 밖 분리(고정)라 알파 헤더 뒤로 행이 비치지 않는다. **`flex-1`(grow)을 주지 말 것 — 내비 등 옆 요소가 더 길면 테이블이 빈 공간까지 늘어나 hug가 깨진다. min-h-0(shrink)만으로 '넘칠 때만 줄어드는' 상한이 된다.**
- **min은 hug(기본)** — 내용만큼만 차지하고, 상한 도달 시 바디만 스크롤. 고정 최소 높이가 꼭 필요할 때만 `minHeight` 추가.
- 2단(사이드 내비) 구성이면 컨테이너(SideNavigationTemplate 등)에도 `height="fill"`을 함께 준다 — 모달 높이는 "내용~가용 상한" 사이에서만 변하고, **모달 바디 전체 스크롤은 발생시키지 않는다**.
- 페이지네이션이 있는 목록(행 수 고정)은 이 규칙 대상이 아니다 — 기존처럼 고정 `maxHeight`(숫자)나 페이지네이션으로 처리.
- 판례: '채용 코드 생성' 모달(ModalTestPage) — 열림 시 내용만큼(387px), 코드 증가 시 상한(가용 높이)에서 멈추고 바디 스크롤.

## 완료 체크리스트

- [ ] dim/패널 셸을 손으로 만들지 않고 `Modal`/`FormModal`/`AlertModal`/`ConfirmModal`을 **import해 조립**했는가 (규칙 4)
- [ ] 용도에 맞는 변형을 골랐는가 (폼=FormModal · 확인=ConfirmModal · 알림=AlertModal · 그 외=Modal)
- [ ] `open`/`onClose`를 호출부에서 제어하는가
- [ ] 본문(children)과 라벨·핸들러만 넘기고, 컴포넌트가 처리하는 dim·스크롤잠금·닫기·포커스를 다시 구현하지 않았는가
- [ ] `size`를 단계값으로 지정했는가 (임의 px 폭 금지)
- [ ] 컴포넌트로 안 덮는 부분만 `footer`/`footerStart` 슬롯으로 좁게 커스텀했는가
- [ ] 페이지네이션 없는 무한 스크롤 테이블에 규칙 18 설정(`bordered maxHeight="fill" min-h-0`)을 적용했는가
- [ ] (Figma) `Modal` 인스턴스 + `ModalBody` slot 조립으로 그렸는가 (완성본 복제 금지)
