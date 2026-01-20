import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import nodePlugin from 'eslint-plugin-n';
import globals from 'globals';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  // 1. Глобальные игноры
  {
    ignores: ['dist', 'node_modules', 'coverage', '.env', 'eslint.config.mjs'],
  },

  // 2. База для всех файлов (JS/TS)
  {
    extends: [eslint.configs.recommended, nodePlugin.configs['flat/recommended-module']],
    languageOptions: {
      globals: globals.nodeBuiltin, // Изолируем только Node API
      ecmaVersion: 2024,
    },
    plugins: {
      n: nodePlugin,
    },
    rules: {
      // Node plugin tweaks для TS
      'n/no-missing-import': 'off', // TS сам чекает импорты, плагин тут часто ошибается
      'n/no-unpublished-import': 'off', // Часто ложно срабатывает на devDeps в тестах
      'no-console': ['warn', { allow: ['warn', 'error'] }], // Логи только через логгер, ошибки можно
    },
  },

  // 3. Секция TypeScript (Type-Aware Rules)
  {
    files: ['**/*.ts'],
    extends: [
        ...tseslint.configs.recommendedTypeChecked, 
        ...tseslint.configs.stylisticTypeChecked
    ],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json', // ОБЯЗАТЕЛЬНО для type-aware правил
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Архитектурная база (Zero Tolerance for Fluff)
      '@typescript-eslint/no-explicit-any': 'error', // Никаких any
      '@typescript-eslint/await-thenable': 'error', // Await только там, где есть Promise
      '@typescript-eslint/no-floating-promises': 'error', // Обязательны await/catch для асинхронщины
      '@typescript-eslint/explicit-module-boundary-types': 'error', // Экспортируемые функции обязаны иметь типы
      '@typescript-eslint/consistent-type-imports': 'error', // import type для типов
    },
  },

  // 4. Prettier (всегда последний)
  prettierConfig,
);
