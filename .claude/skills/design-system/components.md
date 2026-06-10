# Components — 공통 컴포넌트 규칙

`src/components/`에 두는 재사용 컴포넌트의 공통 규칙. 토큰 사용은 `foundation.md`를 따른다.

## 규칙 4 — 컴포넌트는 완전 옵션화

- variant, size, state 등 **모든 시각 옵션을 props로 노출**한다.
- **기본값(default props)** 을 명시한다.
- 내부 스타일 분기는 **토큰 클래스 문자열 조합**으로 처리한다. 인라인 `style` 금지.
- 복잡한 조합은 **상수 배열/객체로 추출**해 코드 수정이 쉽게 유지한다.
- **Why:** 재사용성과 유지보수성. 옵션이 하드코딩되면 사용처마다 코드를 복사해야 한다.

## 작성 패턴

1. named export 함수 컴포넌트로 작성: `export function Xxx({ ... }) {}`
2. props에서 기본값을 구조분해로 명시: `variant = 'fill', size = '32'`
3. 공통 클래스는 `base` 문자열로, 분기 클래스는 변수(`sizeStyle`, `colorStyle`)로 조합
4. 최종 `className`은 `` `${base} ${sizeStyle} ${colorStyle} ${className}` `` 형태로 합성
5. 나머지 속성은 `...props`로 전달, `onClick` 등 핸들러는 비활성 상태 가드

## 모범 예제 — 패턴 견본 (Button 구조를 표준으로 삼는다)

> 이 예제는 **"이렇게 짜라"는 구조 견본 1개**다. 컴포넌트마다 전체 예제를 이 파일에 복붙하지 않는다(코드와 이중 관리되어 낡는다).
> 각 컴포넌트의 **최신 전체 구현·props·기본값은 해당 `.jsx` 코드가 진실**이다. 작업 시 아래 카탈로그에서 파일을 찾아 코드를 직접 참고하라.

```jsx
export function Button({
  children,
  size = '32',            // '32' | '24'
  variant = 'fill',       // 'fill' | 'line' | 'ghost'
  leftIcon: LeftIcon = null,
  rightIcon: RightIcon = null,
  icon: Icon = null,      // 아이콘 전용
  disabled = false,
  loading = false,
  onClick,
  className = '',
  ...props
}) {
  const inactive = disabled || loading;

  const base =
    'inline-flex items-center justify-center relative font-pretendard ' +
    'font-normal rounded-round-4 transition-colors select-none';

  // 사이즈 분기 — 토큰 클래스 문자열로
  const sizeStyle = size === '24'
    ? 'min-h-[24px] px-spacing-5 py-spacing-2 text-12'
    : 'min-h-[32px] px-spacing-6 py-spacing-3 text-14';

  // 컬러 분기 — 시멘틱 토큰 클래스로 (하드코딩 금지)
  let colorStyle;
  if (variant === 'fill') {
    colorStyle = inactive
      ? 'bg-btn-fill-disabled-bg text-btn-fill-disabled-fg cursor-not-allowed'
      : 'bg-btn-fill-default-bg text-btn-fill-default-fg cursor-pointer hover:bg-btn-fill-hover-bg';
  } else if (variant === 'line') {
    colorStyle = inactive
      ? 'bg-btn-line-disabled-bg text-btn-line-disabled-fg cursor-not-allowed'
      : 'bg-btn-line-default-bg text-btn-line-default-fg ring-1 ring-inset ring-btn-line-default-line cursor-pointer hover:bg-btn-line-hover-bg';
  } else {
    colorStyle = inactive
      ? 'bg-btn-ghost-disabled-bg text-btn-ghost-disabled-fg cursor-not-allowed'
      : 'bg-transparent text-btn-ghost-default-fg cursor-pointer hover:bg-btn-ghost-hover-bg';
  }

  return (
    <button
      className={`${base} ${sizeStyle} ${colorStyle} ${className}`}
      disabled={inactive}
      onClick={!inactive ? onClick : undefined}
      {...props}
    >
      {children}
    </button>
  );
}
```

선택지가 더 많아지면 분기 if문 대신 **lookup 객체**로 추출한다:

```jsx
const SIZE_STYLES = {
  '24': 'min-h-[24px] px-spacing-5 py-spacing-2 text-12',
  '32': 'min-h-[32px] px-spacing-6 py-spacing-3 text-14',
};
const sizeStyle = SIZE_STYLES[size];
```

## 컴포넌트 카탈로그

컴포넌트의 명세(진실)는 코드에 있다. 여기에는 **어떤 컴포넌트가 있고 어디 있는지**만 한 줄로 적는다.
새 컴포넌트를 만들면 이 표에 **한 줄 추가**한다 (개별 MD 파일은 만들지 않는다).

| 컴포넌트 | 파일 | 주요 옵션 | 데모 페이지 |
|----------|------|-----------|-------------|
| Button | `components/Button.jsx` | variant(fill/line/ghost) · size(32/24) · leftIcon/rightIcon/icon · disabled · loading | `pages/ButtonPage.jsx` |

> **예외:** 특정 컴포넌트가 공통 규칙으로 안 덮이는 **고유의 복잡한 규약**(예: 데이터 테이블의 정렬·페이지네이션·가상 스크롤)을 가질 때만, 그 컴포넌트 하나를 위한 별도 MD를 추가한다. 그 외에는 이 카탈로그 한 줄로 충분하다.

## 데모 페이지 등록

새 컴포넌트를 만들면 데모 페이지도 추가한다 (페이지 추가는 규칙 3, 각 templates 참고):
1. `src/pages/XxxPage.jsx` — variant × size × state 조합을 표로 보여줌 (`ButtonPage.jsx` 참고)
2. `src/pages/index.js`에 export
3. `App.jsx`의 `NAV_GROUPS` '컴포넌트' 그룹에 항목 추가

## 컴포넌트 완료 체크리스트

- [ ] 모든 시각 옵션(variant/size/state 등)이 props로 노출되고 기본값이 있는가
- [ ] 컬러가 시멘틱 토큰 클래스(`bg-btn-*`, `text-font-icon-*`)만 쓰는가 (하드코딩 X)
- [ ] 간격/라운드/보더가 `spacing-*`/`round-*`/`border-*` 토큰만 쓰는가
- [ ] 인라인 `style`을 쓰지 않았는가
- [ ] `disabled`/`loading` 등 비활성 상태에서 이벤트가 차단되는가
- [ ] 아이콘은 lucide-react 컴포넌트를 props로 받는가 (`<Icon/>`이 아닌 `Icon`)
- [ ] 다크모드 클래스(`dark:`)를 적절히 처리했는가
- [ ] 데모 페이지를 추가/갱신했는가
