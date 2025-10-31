import importPlugin from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
    // Ignore paths
    {
        ignores: [
            'node_modules/**',
            'build/**',
            'dist/**',
            'test/**',
            'src/examples/**',
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
            prettier: prettierPlugin
        },
        languageOptions: {
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true
                }
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
            'no-warning-comments': 'off',

            // Prettier
            'prettier/prettier': 'error'
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
