import importPlugin from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';

export default [
    // Ignore paths
    {
        ignores: [
            'node_modules/**',
            'build/**',
            'dist/**',
            'standalone/**',
            'test/**',
            'src/examples/**',
            // Censored for Scratch policies
            `src/addons/Scr*ns/**`,
            'src/addons/addons/**',
            'src/addons/libraries/**',
            'src/addons/api-libraries/**',
            'src/addons/generated/**'
        ]
    },

    // JS/TS/React files rules
    {
        files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
        plugins: {
            import: importPlugin,
            react: reactPlugin,
            '@typescript-eslint': require('@typescript-eslint/eslint-plugin')
        },
        languageOptions: {
            parser: require('@typescript-eslint/parser'),
            parserOptions: {
                ecmaVersion: 2022,
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true
                },
                project: '../../tsconfig.json'
            },
            globals: {process: 'readonly'}
        },
        rules: {
            // Import rules
            'import/no-mutable-exports': 'error',
            'import/no-commonjs': 'error',
            'import/no-amd': 'error',
            'import/no-nodejs-modules': 'error',

            // React rules
            'react/jsx-no-literals': 'off',

            // Code style / readability
            'no-warning-comments': 'off'
        },
        settings: {
            react: {version: 19}
        }
    },

    // ESLint config file itself
    {
        files: ['**/eslint.config.js'],
        plugins: {import: importPlugin},
        languageOptions: {sourceType: 'module'},
        rules: {
            'import/no-commonjs': 'off' // allow CommonJS in config
        }
    }
];
