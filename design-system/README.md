# @your-org/design-system

사내 디자인 시스템 — React 컴포넌트 + 디자인 토큰. npm으로 배포해 원격 앱에서 받아 쓴다.

> `@your-org` 스코프는 실제 사내 npm 레지스트리 스코프로 바꿔서 쓸 것 (`package.json`의 `name`).

## 저장소 구조

```
design-system/
├── src/                  ← 배포되는 라이브러리 소스 (이것만 npm에 올라감)
│   ├── index.js          ← 코어 진입점: 컴포넌트 + 토큰
│   ├── editor.js         ← 에디터 서브패스 진입점 (Tiptap)
│   ├── markdown.js       ← 마크다운 서브패스 진입점
│   ├── components/       ← 컴포넌트 (index.js = 코어 배럴)
│   ├── tokens/           ← 디자인 토큰
│   ├── utils/            ← 내부 유틸
│   └── index.css         ← Tailwind 소스 (→ dist/style.css로 컴파일)
├── showcase/             ← 개발용 데모/문서 사이트 (Storybook 성격, 배포 제외)
│   ├── pages/  App.jsx  main.jsx  index.html  public/
├── dist/                 ← 빌드 산출물 (배포 대상, git 제외)
├── tailwind.theme.js     ← 토큰→Tailwind theme 매핑 (단일 출처)
├── tailwind.config.js    ← 개발(쇼케이스)용
├── tailwind.lib.config.js← 배포 CSS 빌드용
├── vite.config.js        ← 쇼케이스 dev/build
└── vite.lib.config.js    ← 라이브러리 build
```

배포되는 것은 `dist/`뿐이다 (`package.json`의 `files`). `showcase/`, 설정, 소스는 npm 패키지에 포함되지 않는다.

## 개발 (쇼케이스)

이 저장소는 **pnpm**을 사용한다 (`package.json`의 `packageManager` 고정).

```bash
pnpm install
pnpm dev                 # 컴포넌트 데모 사이트
pnpm build:showcase      # 정적 사이트 빌드 (→ dist-showcase, GitHub Pages용)
pnpm check:rules         # 규칙 자동 검사
```

## 배포

```bash
pnpm build      # build:js(컴포넌트) + build:css(dist/style.css)
pnpm publish    # prepublishOnly가 build를 자동 실행
```

산출물: `dist/index.js`, `dist/editor.js`, `dist/markdown.js`, `dist/tokens.js`, `dist/style.css`.

## 소비 앱에서 사용

이 라이브러리는 Tailwind 컴파일 없이 쓸 수 있게 **완성된 CSS 한 장**을 함께 배포한다. 앱 진입점에서 **한 번만** import 한다.

```jsx
import '@your-org/design-system/styles.css';   // 반드시 1회 import
import { Button, Modal, Table } from '@your-org/design-system';

<Button variant="fill">저장</Button>
```

### peer 의존성

소비 앱이 아래를 직접 설치해야 한다 (번들에 포함하지 않음):

```bash
pnpm add react react-dom lucide-react
```

### 서브패스 — 무거운 기능은 분리 배포

에디터/마크다운은 무거운 의존성을 쓰므로 별도 진입점으로 분리했다. **쓰는 앱만** 해당 peer를 설치하면 된다.

```jsx
// 리치 텍스트 에디터 — @tiptap/* 설치 필요
import { Editor, NoticeWritingTemplate } from '@your-org/design-system/editor';

// 마크다운 렌더러 — react-markdown, remark-gfm 설치 필요
import { MarkdownDoc } from '@your-org/design-system/markdown';
```

에디터를 쓰지 않는 앱은 Tiptap을 설치할 필요가 없다. 필요 시:

```bash
# 에디터 사용 앱만
pnpm add @tiptap/react @tiptap/starter-kit @tiptap/pm @tiptap/core \
  @tiptap/extension-color @tiptap/extension-highlight @tiptap/extension-image \
  @tiptap/extension-table @tiptap/extension-table-cell @tiptap/extension-table-header \
  @tiptap/extension-table-row @tiptap/extension-text-align @tiptap/extension-text-style \
  @tiptap/extension-link @tiptap/extension-underline

# 마크다운 사용 앱만
pnpm add react-markdown remark-gfm
```

### 디자인 토큰만 필요할 때

```jsx
import { baseColors, spacing, fontSize } from '@your-org/design-system/tokens';
```

## 폰트

컴포넌트는 Pretendard를 전제로 한다. 소비 앱에서 폰트를 로드할 것 (예: `index.html`):

```html
<link rel="stylesheet" as="style" crossorigin
  href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css" />
```

## 배포 구조화 시 정리된 내용

- **개발/배포 소스 분리**: 데모 페이지(`pages`, `App`, `main`, `index.html`, `public`)를 `showcase/`로 이동. 배포 대상은 `src/`만.
- **export 대상 확정**: `dist/`만 배포(`files: ["dist"]`). 진입점 `.` / `./editor` / `./markdown` / `./tokens` / `./styles.css`.
- **의존성 정리**: `react`/`react-dom`/`lucide-react` → peer. `@tiptap/*`·`react-markdown`·`remark-gfm` → 서브패스 전용 **optional peer**(안 쓰는 앱은 설치 불필요). 미사용 의존성 `clsx` 제거.
- **스타일 배포**: Tailwind 안 쓰는 앱을 위해 토큰 기반 클래스를 담은 `dist/style.css`를 컴파일해 배포.
