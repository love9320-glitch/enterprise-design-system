import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 라이브러리(npm 배포) 빌드 설정.
// 진입점을 여러 개(core/editor/markdown/tokens)로 나누고, 외부 의존성은 번들하지 않는다.
// - react / react-dom / lucide-react : peer 의존성
// - @tiptap/*, prosemirror-*         : editor 서브패스 전용 optional peer
// - react-markdown / remark-gfm      : markdown 서브패스 전용 optional peer
// 스타일(CSS)은 여기서 만들지 않고 tailwindcss CLI(tailwind.lib.config.js)로 dist/style.css를 별도 생성한다.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: false, // dist/style.css(별도 생성)를 지우지 않도록
    lib: {
      entry: {
        index: 'src/index.js',
        editor: 'src/editor.js',
        markdown: 'src/markdown.js',
        tokens: 'src/tokens/index.js',
      },
      formats: ['es'],
    },
    rollupOptions: {
      // 상대경로(./ ../)와 절대경로만 번들. 그 외 bare import(react, lucide, @tiptap ...)는 전부 external.
      external: (id) => !id.startsWith('.') && !id.startsWith('/'),
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
      },
    },
    sourcemap: true,
    minify: false, // 라이브러리는 소비 앱 번들러가 최적화하므로 가독성 유지
  },
})
