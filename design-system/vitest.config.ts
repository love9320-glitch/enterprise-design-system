// Vitest 설정 — 컴포넌트 단위 테스트(jsdom + RTL + vitest-axe). 2026-08-12 도입.
// 기존 check:*(render/focus/shadow/rules) 스크립트는 별도 유지 — 여긴 정식 단위 테스트.
import { defineConfig } from 'vitest/config';

export default defineConfig({
  esbuild: { jsx: 'automatic' },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    // 데모 SPA·매핑 파일은 테스트 대상 아님
    exclude: ['node_modules', 'dist', 'dist-lib'],
  },
});
