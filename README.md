# ATS Design System

코드↔Figma가 1:1로 동기화된 **ATS 디자인 시스템** 모노레포입니다. 토큰 기반 React 컴포넌트 60+와 템플릿 8종을 TypeScript(strict)로 제공하고, npm 패키지(`@gusun/design-system`)와 데모·문서 사이트로 배포합니다.

| 바로가기 | |
|---|---|
| 🖥 **데모·문서 사이트** | https://love9320-glitch.github.io/enterprise-design-system/ — 전 컴포넌트 실행 예제·props 표·복사 가능한 코드 |
| 📦 **npm 패키지** | [`@gusun/design-system`](https://www.npmjs.com/package/@gusun/design-system) — `npm install @gusun/design-system` |
| 📖 **패키지 README** | [design-system/README.md](design-system/README.md) — 설치·엔트리·컴포넌트 API 전체 |
| 🎨 **Figma** | 디자인 시스템 파일과 Code Connect로 컴포넌트·템플릿이 코드에 연결되어 있습니다 |

## 저장소 구조

```
design-system/   # 디자인 시스템 본체 — 컴포넌트·토큰·데모 SPA·npm 패키지 소스
  src/components/   # React 컴포넌트(+템플릿)
  src/tokens/       # 디자인 토큰(색·간격·라운드·타이포) — Figma 변수와 1:1
  src/pages/        # 데모·문서 페이지(GitHub Pages 배포)
  tailwind.preset.js# 토큰 단일 진실(Tailwind preset — 패키지로도 배포)
.claude/           # 디자인 시스템 제작 규칙서(스킬)·규칙 사용 원장
```

## 빠른 시작

```bash
npm install @gusun/design-system
```

```jsx
import '@gusun/design-system/styles.css';
import { Button, Input, Select, Table } from '@gusun/design-system';

<Button variant="fill" onClick={save}>저장</Button>
```

자세한 사용법(엔트리 5종·Tailwind preset 통합·Editor 서브패스·기능 훅)은 [패키지 README](design-system/README.md)와 [시작 가이드](https://love9320-glitch.github.io/enterprise-design-system/#getting-started)를 참고하세요.

## 개발

```bash
cd design-system
npm install
npm run dev        # http://localhost:5173/enterprise-design-system/
```

검증 스위트: `npm run check:types` · `lint` · `build` · `check:rules`(디자인 규칙 기계 검사) · `check:render`(SSR 스모크) · `check:focus`(포커스 트랩). main 반영은 PR + CI(verify) 통과 후 머지하며, 머지 시 GitHub Pages로 자동 배포됩니다.

## 설계 원칙

- **컬러·간격·라운드는 토큰만** — Base → Semantic 토큰 경유, 하드코딩 금지
- **조립 우선** — 페이지 → 템플릿 → 컴포넌트 순으로 큰 단위부터 재사용(임의 신규 제작 지양)
- **완전 옵션화** — 모든 시각 옵션을 props로 노출 + 데이터 반출 계약(onChange)
- **코드↔Figma 동기화** — Figma 변수/컴포넌트와 1:1, Code Connect 연결

전체 규칙은 데모 사이트의 "디자인시스템 규칙" 섹션에서 항상 최신으로 제공됩니다.

## License

ATS
