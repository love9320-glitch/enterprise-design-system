import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 개발(쇼케이스) 사이트 설정 — 컴포넌트 데모/문서 페이지를 띄운다.
// 루트는 showcase/. 라이브러리 소스(src)는 상위에서 import 하므로 fs 접근을 허용한다.
export default defineConfig({
  root: 'showcase',
  base: '/enterprise-design-system/',
  plugins: [react()],
  build: {
    outDir: '../dist-showcase',
    emptyOutDir: true,
  },
  server: {
    fs: {
      // '..'  = design-system(src 접근), '../..' = 규칙 문서(.claude/skills) ?raw import
      allow: ['..', '../..'],
    },
  },
})
