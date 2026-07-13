import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'dist-showcase']),
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
