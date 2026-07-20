# 커스텀 가이드 — 디자인 시스템을 그대로 쓰다가 일부 고쳐 쓰기

이 문서는 **디자인 시스템을 소비하는 개발자**(패키지를 설치해 실제 서비스에 쓰는 팀)를 위한 가이드다. 목표는 하나 — **디자인 시스템을 그대로 쓰다가 일부만 바꿔야 할 때, 기능을 처음부터 다시 짜지 않고 최소한으로 확장**하는 것.

핵심 설계: 이 시스템은 **디자인 층(토큰·스타일)** 과 **기능 층(동작 훅·순수 유틸)** 이 이미 모듈로 분리돼 있고, 둘 다 패키지 공개 API로 노출된다. 그래서 아래 4단계 중 필요한 만큼만 내려가면 된다 — **위 단계일수록 저렴하고, 아래로 갈수록 자유롭다.**

> 원칙: **커스텀은 소비 측에서, 가장 얕은 단계로.** 여기서도 안 되면 마지막에 "저장소에 반영"으로 올린다(아래 5단계). 사본을 떠서 고치지 말 것 — 사본은 업스트림 수정과 어긋난다.

---

## 1단계 — 값만 바꾸기 (코드 수정 0)

컴포넌트가 **시멘틱 토큰만** 참조하므로, 소비 팀의 `tailwind.config`에서 토큰을 오버라이드하면 컴포넌트 코드를 건드리지 않고 색·간격이 바뀐다.

```js
// tailwind.config.js (소비 팀)
import preset from '@love9320-glitch/design-system/preset';

export default {
  presets: [preset],
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/@love9320-glitch/design-system/dist-lib/*.js',
  ],
  theme: {
    extend: {
      colors: {
        // 예: 브랜드 강조색만 우리 팀 색으로 — 나머지는 그대로
        'button-fill-default-bg': '#1a73e8',
      },
    },
  },
};
```

Tailwind를 안 쓰는 팀은 `import '@love9320-glitch/design-system/styles.css'` 한 장을 쓰되, 이 경우 토큰 오버라이드는 CSS 변수 재정의로 처리한다.

**언제**: 브랜드 색·간격만 다를 때. 가장 흔한 케이스.

---

## 2단계 — 옵션·래퍼로 확장 (우리 코드 수정 0)

모든 컴포넌트가 **완전 옵션화**(시각 옵션 전부 props) + `className`/`...props` 관통이라, 소비 측에서 감싸는 래퍼로 기본값을 바꾸거나 동작을 덧붙인다.

```tsx
// 소비 팀 — 우리 팀 기본값을 입힌 Button 래퍼
import { Button } from '@love9320-glitch/design-system';
import type { ComponentProps } from 'react';

export function AppButton(props: ComponentProps<typeof Button>) {
  return <Button variant="fill" size="32" {...props} />;
}
```

`className`으로 레이아웃(margin·너비 등)을 덧붙이는 것도 안전하다 — 컴포넌트가 마지막에 `${className}`을 병합한다. 단 **색·간격 토큰을 className으로 덮어쓰지는 말 것**(1단계로 처리 — 토큰 우회 채색은 디자인 출처와 어긋난다).

**언제**: 기본값·조합만 다를 때, 컴포넌트에 얇은 팀 규약을 얹을 때.

---

## 3단계 — 동작(기능 훅)만 가져다 새 UI 조립 ★ 핵심

"디자인은 우리 팀 것이지만 동작은 똑같아야 하는" 새 컴포넌트가 필요할 때. **기능 층이 순수 훅·유틸로 독립돼 공개 export**되므로, 스타일만 새로 만들고 동작은 import해 조립한다 — 위치 계산·바깥 클릭·키보드·정렬 로직을 다시 짤 필요가 없다.

### 공개된 기능 훅·유틸

| export | 층 | 용도 | 시그니처 요약 |
|---|---|---|---|
| `usePopoverPosition` | 오버레이 | 트리거 기준 패널 fixed 위치(공간 따라 상하·좌우 자동 반전) | `({ open, anchorRef, menuRef, placement?, menuWidth?, deps? }) → CSSProperties \| null` |
| `useOutsideDismiss` | 오버레이 | 바깥 클릭 닫기(첫 클릭은 닫기 전용으로 삼킴, click-through 방지) | `({ open, refs, onDismiss, guard? })` |
| `popoverLayers` | 오버레이 | 중첩 팝오버/드롭다운 레이어 스택 — 외부클릭·Esc가 맨 위만 닫게 | `pushPopoverLayer/removePopoverLayer/isTopPopoverLayer(ref)` |
| `usePanelKeyboard` | 키보드 | 설정 패널의 Tab 순회·경계 저장 규약(규칙 20) | `({ complete, onCommit, onSkip? }) → { menuRef, handleTabKey }` |
| `useHoverTooltip` | 툴팁 | hover 지연 표시 + 뷰포트 경계 자동 반전 | `(label, { delay? }) → { onMouseEnter, onMouseLeave, tooltip }` |
| `compareValues` / `applyColumnFilters` / `applySort` | 데이터 | 테이블 정렬·필터 순수 함수(숫자/한국어 로케일) | `(rows, …) → rows` |
| `iconCellWidth` | 데이터 | 아이콘 전용 셀 너비 계산(패딩+버튼+간격) | `(count?, { buttonSize?, gap? }) → number` |
| `formatDate` / `formatDateTime` / `formatDateTimeRange` | 유틸 | 날짜·시간 표기 통일(규칙 10) | `(date, …) → string` |
| `formatPhoneNumber` | 유틸 | 한국 전화번호 하이픈 자동 | `(raw) → string` |

### 예시 — 우리 Select와 디자인이 다른 커스텀 드롭다운

```tsx
import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePopoverPosition, useOutsideDismiss } from '@love9320-glitch/design-system';

export function MyDropdown({ trigger, children }) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const menuRef = useRef(null);

  // 위치 계산·바깥 클릭 닫기는 우리 시스템 동작을 그대로 재사용 — 로직 0줄 작성
  const menuStyle = usePopoverPosition({ open, anchorRef, menuRef, placement: 'auto' });
  useOutsideDismiss({ open, refs: [anchorRef, menuRef], onDismiss: () => setOpen(false) });

  return (
    <>
      <span ref={anchorRef} onClick={() => setOpen((o) => !o)}>{trigger}</span>
      {open && createPortal(
        // ↓ 디자인(마크업·클래스)만 우리 팀 자유 — 동작은 위 훅이 담당
        <div ref={menuRef} style={menuStyle} className="my-team-dropdown">{children}</div>,
        document.body,
      )}
    </>
  );
}
```

수식(스크리닝) 도메인을 확장한다면 `formulaFunctions`의 노드 모델 타입(`FormulaNode`·`ConditionMeta` 등)과 `hasPointsScore`·`FORMULA_GROUP_FUNCTIONS`를 import해 같은 데이터 계약 위에서 새 UI를 얹을 수 있다.

**언제**: 디자인이 완전히 다른 새 컴포넌트인데 동작(위치·닫기·키보드·정렬)은 동일해야 할 때.

---

## 4단계 — 토큰만 가져다 완전 자체 제작

동작까지 다르면, 최소한 **디자인 값(토큰)** 이라도 공유해 시각 일관성은 유지한다.

```ts
import { spacing, baseColors, radius } from '@love9320-glitch/design-system/tokens';
// 자체 컴포넌트를 만들되 간격·색·라운드는 시스템 토큰에서 — 룩앤필은 어긋나지 않게
```

**언제**: 컴포넌트를 통째로 새로 만들지만 브랜드 톤은 맞춰야 할 때.

---

## 5단계 — 저장소에 반영 (마지막 수단, 단일 진실 유지)

1~4단계로도 안 되고, **여러 팀이 공통으로 필요한 변경**(새 옵션, 새 컴포넌트, 토큰 신설)이라면 — 사본을 뜨지 말고 **이 저장소에 PR**을 올려 업스트림에 반영한다. 그래야 모두가 다음 버전에서 함께 받는다.

- 새 시각 옵션 → 컴포넌트 props로 추가(규칙 7 완전 옵션화)
- 없는 시멘틱 토큰 → `tokens/`에 신설(규칙 1 — 임의 정의 말고 토큰 추가)
- 새 컴포넌트 → 규칙서 절차대로 만들고 `src/index.ts` 배럴에 export

**사본 금지 이유**: 사본은 업스트림 버그 수정·개선과 즉시 어긋난다. "그대로 쓰다 일부 수정"의 유지보수성은 *사본을 잘 관리*하는 게 아니라 *공유 지점을 늘려 사본을 안 만드는* 데서 나온다.

---

## 단계 선택 요약

| 무엇이 다른가 | 단계 |
|---|---|
| 색·간격 값만 | 1 (토큰 오버라이드) |
| 기본값·조합·얇은 규약 | 2 (래퍼) |
| 디자인은 새로, **동작은 동일** | 3 (기능 훅 재사용) ★ |
| 컴포넌트 전체 자체 제작, 톤만 맞춤 | 4 (토큰만) |
| 여러 팀 공통 변경 | 5 (업스트림 PR) |
