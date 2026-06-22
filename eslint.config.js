import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import react from 'eslint-plugin-react'

export default [
    { ignores: ['dist'] },
    // Node.js scripts in npm/ — no React rules
    {
        files: ['npm/**/*.js'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: { ...globals.node },
            sourceType: 'module',
        },
        rules: {
            ...js.configs.recommended.rules,
            'no-unused-vars': 'warn',
        },
    },
    // React source files
    {
        files: ['src/**/*.{js,jsx}', '*.{js,jsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parserOptions: {
                ecmaVersion: 'latest',
                ecmaFeatures: { jsx: true },
                sourceType: 'module',
            },
        },
        settings: { react: { version: '18.3' } },
        plugins: {
            react,
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            ...js.configs.recommended.rules,
            ...react.configs.recommended.rules,
            ...react.configs['jsx-runtime'].rules,
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
            'react/prop-types': 'off',
            'react/no-unescaped-entities': 'warn',
            'react/no-children-prop': 'warn',
            'react-hooks/rules-of-hooks': 'warn',
            'react-hooks/exhaustive-deps': 'warn',
            'no-unused-vars': ['warn', { varsIgnorePattern: '^[A-Z_]', args: 'none' }],
            'no-case-declarations': 'warn',
            'no-empty': 'warn',
        },
    },
]
