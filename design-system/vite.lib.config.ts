// vite.lib.config — npm 패키지(라이브러리) 빌드 전용 설정(2026-07-19 패키지화).
// 데모 SPA 빌드(vite.config)와 분리 — 산출물은 dist-lib/(데모는 dist/ 유지, GH Pages 배포 경로 불변).
//   - entry 3개: index(공개 API) / editor(Tiptap 서브패스) / tokens(디자인 값만)
//   - react·tiptap·lucide 등은 external(peer/일반 의존성으로 소비자 측에서 해석)
//   - vite-plugin-dts가 .d.ts를 함께 산출(strict tsconfig 기준)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig({
  publicDir: false, // 데모용 public/(favicon 등)은 패키지에 포함하지 않는다
  plugins: [
    react(),
    dts({
      include: ['src'],
      exclude: ['src/pages', 'src/App.jsx', 'src/main.jsx'],
      outDir: 'dist-lib',
    }),
  ],
  build: {
    outDir: 'dist-lib',
    emptyOutDir: true,
    sourcemap: true,
    lib: {
      entry: {
        index: 'src/index.ts',
        editor: 'src/editor.ts',
        tokens: 'src/tokens/index.ts',
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        /^react($|\/)/,
        /^react-dom($|\/)/,
        /^@tiptap\//,
        'lucide-react',
        'react-markdown',
        'remark-gfm',
      ],
    },
  },
});
