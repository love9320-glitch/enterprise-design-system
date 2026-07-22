# 시작 가이드 — 처음부터 디자인 시스템 사용하기

이 문서는 **개발 경험이 없는 사람**(디자이너 포함)이 **완전히 새로운 컴퓨터**에서 이 디자인 시스템(`@gusun/design-system`)을 받아 화면에 버튼 하나를 띄우기까지의 전 과정을 다룬다. 순서대로 그대로 따라 하면 된다 — 예상 소요 20~30분.

> 용어 미리 알기: **터미널** = 명령어를 입력하는 검은 창(맥: `⌘+스페이스` → "터미널" 검색). **npm** = 자바스크립트 세계의 앱스토어에서 패키지를 내려받는 도구(Node.js에 포함). 아래 코드 블록의 명령은 터미널에 한 줄씩 붙여넣고 Enter.

## 0단계 — 준비물 설치 (컴퓨터당 한 번만)

1. **Node.js 설치** — https://nodejs.org 접속 → 초록색 **LTS** 버튼 다운로드 → 설치 파일 실행(계속 "다음"만 눌러도 됨). 설치 확인은 터미널에서:

```bash
node -v
```

`v20.x.x` 같은 버전이 나오면 성공. (`command not found`가 나오면 터미널을 완전히 껐다 다시 열기)

2. **Visual Studio Code 설치**(코드 에디터) — https://code.visualstudio.com 에서 다운로드·설치. 파일을 열어 코드를 붙여넣을 때 쓴다.

## 1단계 — 새 프로젝트 만들기

터미널에서 아래 세 줄을 순서대로 실행한다(각 줄 입력 후 Enter, 앞 명령이 끝난 뒤 다음 명령):

```bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
```

- 첫 줄에서 뭔가 물어보면 Enter로 기본값 선택하면 된다.
- `my-app`은 프로젝트 폴더 이름 — 원하는 이름으로 바꿔도 된다.
- 이 시점에 바탕 폴더에 `my-app` 폴더가 생긴다. VS Code에서 **파일 → 폴더 열기**로 이 폴더를 열어 두자.

## 2단계 — 디자인 시스템 설치

```bash
npm install @gusun/design-system
```

끝. 이 한 줄로 컴포넌트·스타일·타입이 모두 프로젝트에 들어온다.

## 3단계 — 스타일·폰트 연결 (파일 2개 수정)

**① `index.html`** — VS Code에서 `my-app` 폴더 바로 아래의 `index.html`을 열고, `<head>` 안에 아래 한 줄을 추가한다(폰트 Pretendard — 없으면 글자 모양이 달라 보인다):

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />
```

**② `src/main.jsx`** — 파일 맨 위 import 줄들 사이에 아래 한 줄을 추가한다(디자인 시스템 스타일 한 장):

```js
import '@gusun/design-system/styles.css';
```

> 참고: 이 방식(컴파일 CSS 한 장)은 **Tailwind 설치가 필요 없는 가장 쉬운 길**이다. 개발자가 Tailwind 프로젝트에 통합할 때는 커스텀 가이드의 preset 방식을 쓴다.

## 4단계 — 첫 화면 만들기

`src/App.jsx` 파일을 열고 **내용 전체를 지운 뒤** 아래를 통째로 붙여넣는다:

```jsx
import { useState } from 'react';
import { Button, Input, Select, Tag, Switch } from '@gusun/design-system';

export default function App() {
  const [name, setName] = useState('');
  const [role, setRole] = useState(null);

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h1 style={{ fontSize: 20, fontWeight: 600 }}>
        디자인 시스템 테스트 <Tag color="blue">v0.1.1</Tag>
      </h1>

      <Input
        placeholder="이름을 입력하세요"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <Select
        placeholder="직군 선택"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        options={[
          { value: 'designer', label: '디자이너' },
          { value: 'developer', label: '개발자' },
          { value: 'pm', label: 'PM' },
        ]}
      />

      <Switch label="알림 받기" />

      <Button variant="fill" onClick={() => alert(`${name || '이름 없음'} / ${role || '직군 미선택'}`)}>
        확인
      </Button>
    </div>
  );
}
```

## 5단계 — 실행

```bash
npm run dev
```

터미널에 나오는 주소(보통 `http://localhost:5173`)를 브라우저에서 열면 — 인풋·셀렉트·스위치·버튼이 **데모 사이트와 똑같은 모습**으로 떠 있으면 성공이다. 🎉

(끄는 법: 터미널에서 `Ctrl+C`)

## 다음 단계 — 컴포넌트 구경하고 가져다 쓰기

- **컴포넌트 카탈로그**: 데모 사이트 https://love9320-glitch.github.io/enterprise-design-system/ — 좌측 메뉴에서 컴포넌트를 고르면 각 페이지의 **"사용 예시" 코드 블록을 복사 버튼으로 복사**해 `App.jsx`에 붙여넣는 식으로 쓰면 된다. props 표가 옵션 전체 설명서다.
- **일부 고쳐 쓰고 싶을 때**: 같은 사이트의 **디자인시스템 규칙 → 커스텀 가이드** — 토큰만 바꾸기부터 기능 훅 재사용까지 단계별로 정리돼 있다.
- **에디터(글쓰기 도구)가 필요하면**: Editor·공지 작성 템플릿은 별도 서브패스라 추가 설치가 필요하다 — `npm install @tiptap/react @tiptap/pm @tiptap/starter-kit` 후 `import { Editor } from '@gusun/design-system/editor'`.

## 막혔을 때 (자주 나는 문제)

| 증상 | 원인·해결 |
|---|---|
| `command not found: npm` | Node.js 설치가 안 됐거나 터미널 재시작 필요 — 0단계 다시 |
| `Port 5173 is in use` | 이미 실행 중 — 그 터미널을 찾거나, 안내에 나온 다른 포트 주소로 접속 |
| 글자가 데모 사이트와 다르게 생김 | 3단계 ①(Pretendard 링크)을 빠뜨림 — `index.html` 확인 |
| 화면이 하얗고 아무것도 없음 | 3단계 ②(`styles.css` import)를 빠뜨렸거나, 4단계 코드 붙여넣기가 잘렸는지 확인. 브라우저에서 `F12 → Console`의 빨간 에러를 보면 원인이 나온다 |
| `Cannot find package '@tiptap/react'` | Editor 계열을 import했는데 Tiptap 미설치 — 위 "에디터" 항목 참조(안 쓰면 import 지우기) |
| `npm error 404 @gusun/design-system` | 오타 확인 — 패키지명은 `@gusun/design-system` |
