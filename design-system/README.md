# @gusun/design-system

코드↔Figma가 1:1로 동기화된 **ATS 디자인 시스템** — 토큰 기반 React 컴포넌트 라이브러리입니다. 60+ 컴포넌트와 6종 템플릿, 디자인 토큰을 TypeScript(strict)로 제공합니다.

- **데모·문서 사이트**: https://love9320-glitch.github.io/enterprise-design-system/ — 모든 컴포넌트의 실행 예제·props 표·복사 가능한 코드
- **처음이라면**: [시작 가이드](https://love9320-glitch.github.io/enterprise-design-system/#getting-started) — 개발 경험이 없어도 0부터 실행까지
- **고쳐 쓰고 싶다면**: [커스텀 가이드](https://love9320-glitch.github.io/enterprise-design-system/#customization) — 토큰 오버라이드부터 기능 훅 재사용까지 5단계

## 설치

```bash
npm install @gusun/design-system
```

React 18/19 프로젝트에서 동작합니다(react·react-dom은 peer — 앱의 것을 사용).

## 빠른 시작

**① 스타일 연결** — Tailwind 없이 컴파일된 CSS 한 장으로 시작하는 게 가장 쉽습니다. 앱 진입 파일(`main.jsx` 등) 맨 위에:

```js
import '@gusun/design-system/styles.css';
```

폰트(Pretendard)는 `index.html`의 `<head>`에 한 줄:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />
```

**② 컴포넌트 사용**:

```jsx
import { Button, Input, Select, Tag } from '@gusun/design-system';

<Button variant="fill" onClick={save}>저장</Button>
<Button asChild variant="line"><a href="/docs">링크를 버튼처럼</a></Button>
```

**Tailwind 프로젝트라면** CSS 대신 preset으로 토큰을 통합할 수 있습니다:

```js
// tailwind.config.js
import preset from '@gusun/design-system/preset';
export default {
  presets: [preset],
  content: ['./src/**/*.{js,jsx,ts,tsx}', './node_modules/@gusun/design-system/dist-lib/*.js'],
};
```

## 엔트리

| import | 내용 | 비고 |
|---|---|---|
| `@gusun/design-system` | 컴포넌트 전체 + 기능 훅 + 유틸 + 타입 | |
| `@gusun/design-system/editor` | Editor·EditorToolbar·공지 작성 템플릿(Tiptap 기반) | `@tiptap/react` `@tiptap/pm` `@tiptap/starter-kit` 등 peer 설치 필요 |
| `@gusun/design-system/tokens` | 디자인 토큰 값(색·간격·라운드·타이포) | |
| `@gusun/design-system/preset` | Tailwind preset(토큰 theme + safelist) | |
| `@gusun/design-system/styles.css` | 컴파일된 전체 스타일 한 장 | Tailwind 불필요 |

동작 훅(`usePopoverPosition`·`useOutsideDismiss`·`useFocusTrap`·`usePanelKeyboard` 등)도 메인 엔트리에서 export됩니다 — 디자인은 직접 만들되 동작만 재사용할 수 있습니다(자세한 건 커스텀 가이드 3단계).

## 규칙·문서

컴포넌트 사용 규칙과 설계 원칙(토큰 경유·완전 옵션화 등)은 패키지에 동봉되지 않고 **문서 사이트의 "디자인시스템 규칙" 섹션**에서 항상 최신 버전으로 제공합니다.

## License

ATS
