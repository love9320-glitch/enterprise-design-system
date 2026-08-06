import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const src = (p) => fileURLToPath(new URL(`./src/${p}`, import.meta.url))

export default defineConfig({
  plugins: [react()],
  base: '/enterprise-design-system/',
  // 데모 페이지는 사용처(소비자) 문법으로 작성한다(2026-08-06 지시) — '@gusun/design-system'
  // import가 빌드된 패키지가 아니라 이 저장소의 소스로 풀리도록 셀프 별칭(HMR·소스 디버깅 유지).
  // 구체 경로가 먼저 매칭되도록 서브패스를 위에 둔다.
  resolve: {
    alias: [
      { find: '@gusun/design-system/editor', replacement: src('editor.ts') },
      { find: '@gusun/design-system/tokens', replacement: src('tokens/index.ts') },
      { find: '@gusun/design-system/styles.css', replacement: src('index.css') },
      { find: '@gusun/design-system', replacement: src('index.ts') },
    ],
  },
  // 규칙 문서(.md)는 Vite 루트(design-system) 바깥의 .claude/skills에 있으므로
  // ?raw import를 위해 상위 디렉터리 접근을 허용한다.
  server: {
    fs: { allow: ['..'] },
  },
})
