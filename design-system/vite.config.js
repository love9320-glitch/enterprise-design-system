import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/enterprise-design-system/',
  // 규칙 문서(.md)는 Vite 루트(design-system) 바깥의 .claude/skills에 있으므로
  // ?raw import를 위해 상위 디렉터리 접근을 허용한다.
  server: {
    fs: { allow: ['..'] },
  },
})
