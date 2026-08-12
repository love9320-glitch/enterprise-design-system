import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'dist-lib', 'consumer-smoke']),
  // TS 전환분(.ts/.tsx) — typescript-eslint recommended + 동일 react 규칙(2026-07-18 TS 마이그레이션)
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
    },
  },
  {
    // 데모 페이지(사용처 예제) — 데모 데이터·플레이그라운드 특성상 명시적 any 허용(2026-08-06 TS 전환).
    // 라이브러리 코드(components/layouts/templates)는 위 ts 블록의 no-explicit-any가 그대로 적용된다.
    files: ['src/pages/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // `{ node, ...rest }`처럼 특정 prop만 제외하고 나머지를 spread하는 패턴 허용
      // (예: MarkdownDoc에서 react-markdown의 node를 DOM에 넘기지 않으려 분리)
      'no-unused-vars': ['error', { ignoreRestSiblings: true }],
    },
  },
])
