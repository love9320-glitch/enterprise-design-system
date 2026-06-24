# Template — 모달 / 팝업 / 다이얼로그

confirm 창, 알림, 입력 다이얼로그 등 오버레이 UI 규칙. `foundation.md` + `components.md` 전제.

## 구조 규칙

- 오버레이(dim) + 패널(panel) 2층 구조.
- dim 배경색은 시멘틱 알파 토큰 사용 (`bg-base-gray-900-200` 등). 임의 `rgba` 금지.
- 패널: `bg-base-white`, `rounded-round-8`, 적절한 `p-spacing-*`.
- 너비는 콘텐츠 유형별 고정 단계 사용 (sm/md/lg를 props로). 임의 px 금지하고 토큰/규격값 사용.
- 헤더(타이틀) · 본문 · 푸터(액션 버튼) 3영역. 영역 간 간격은 `spacing-*`.

## 동작 규칙

- `open` / `onClose` props 필수. '컴포넌트 완전 옵션화' 규칙 준수.
- 닫기 트리거: dim 클릭, ESC 키, 닫기 버튼 — 모두 `onClose` 호출.
- 푸터 버튼은 공통 `Button` 컴포넌트 사용 (variant: 주동작 `fill`, 보조 `line`/`ghost`).
- 포커스 트랩 + 열렸을 때 body 스크롤 잠금.

## 모범 예제

```jsx
import { Button } from '../components/Button';

export function Modal({
  open,
  onClose,
  title,
  children,
  size = 'md',                 // 'sm' | 'md' | 'lg'
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  confirmVariant = 'fill',
}) {
  if (!open) return null;

  const SIZE = {
    sm: 'w-[320px]',
    md: 'w-[480px]',
    lg: 'w-[640px]',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-base-gray-900-200"
      onClick={onClose}
    >
      <div
        className={`${SIZE[size]} max-w-[90vw] rounded-round-8 bg-base-white p-spacing-9`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {title && (
          <h2 className="mb-spacing-6 text-18 font-semibold text-font-icon-5">{title}</h2>
        )}
        <div className="text-14 text-font-icon-4">{children}</div>
        <div className="mt-spacing-9 flex justify-end gap-spacing-5">
          <Button variant="line" onClick={onClose}>{cancelText}</Button>
          <Button variant={confirmVariant} onClick={onConfirm}>{confirmText}</Button>
        </div>
      </div>
    </div>
  );
}
```

## 완료 체크리스트

- [ ] `open`/`onClose` props로 완전 제어되는가
- [ ] dim 클릭 · ESC · 닫기 버튼 모두 닫히는가
- [ ] dim/패널 색상이 시멘틱 토큰인가 (rgba 하드코딩 X)
- [ ] 간격·라운드가 토큰만 사용하는가
- [ ] 푸터 액션이 공통 `Button` 컴포넌트인가
- [ ] `role="dialog"` `aria-modal="true"` 등 접근성 속성이 있는가
- [ ] 열렸을 때 body 스크롤 잠금 / 포커스 트랩 처리했는가
- [ ] 모바일 너비(`max-w-[90vw]` 등) 대응했는가
