import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import a11yPlugin from 'eslint-plugin-jsx-a11y';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/.turbo/**',
      '**/storybook-static/**',
      '**/*.config.*',
    ],
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': a11yPlugin,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...tsPlugin.configs['recommended'].rules,
      ...reactPlugin.configs['recommended'].rules,
      ...reactHooksPlugin.configs['recommended'].rules,
      ...a11yPlugin.configs['recommended'].rules,
      'react/react-in-jsx-scope': 'off',
      // Redundant in TypeScript projects — types serve as prop documentation
      'react/prop-types': 'off',
      // False positives for forwardRef wrapper components that pass children via {...props} spread;
      // TypeScript enforces correct usage and axe-core catches actual violations at runtime.
      'jsx-a11y/heading-has-content': 'off',
      'jsx-a11y/anchor-has-content': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
  {
    files: [
      'packages/ui/src/components/ui/button.tsx',
      'packages/ui/src/components/ui/input.tsx',
      'packages/ui/src/components/ui/badge.tsx',
      'packages/ui/src/components/ui/textarea.tsx',
      'packages/ui/src/components/ui/card.tsx',
      'packages/ui/src/components/ui/alert.tsx',
      'packages/ui/src/components/ui/skeleton.tsx',
      'packages/ui/src/components/ui/avatar.tsx',
      'packages/ui/src/components/ui/notification-badge.tsx',
      'packages/ui/src/components/ui/checkbox.tsx',
      'packages/ui/src/components/ui/switch.tsx',
      'packages/ui/src/components/ui/radio-group.tsx',
      'packages/ui/src/components/ui/select.tsx',
      'packages/ui/src/components/ui/dialog.tsx',
      'packages/ui/src/components/ui/combobox.tsx',
      'packages/ui/src/components/ui/tabs.tsx',
      'packages/ui/src/components/ui/accordion.tsx',
      'packages/ui/src/components/ui/calendar.tsx',
      'packages/ui/src/components/ui/slider.tsx',
      'packages/ui/src/components/ui/table.tsx',
      'packages/ui/src/components/ui/alert-dialog.tsx',
      'packages/ui/src/components/ui/breadcrumb.tsx',
      'packages/ui/src/components/ui/date-picker.tsx',
      'packages/ui/src/components/ui/dropdown-menu.tsx',
      'packages/ui/src/components/ui/navigation-menu.tsx',
      'packages/ui/src/components/ui/pagination.tsx',
      'packages/ui/src/components/ui/scroll-area.tsx',
      'packages/ui/src/components/ui/sheet.tsx',
      'packages/ui/src/components/ui/toast.tsx',
      'packages/ui/src/components/travel/hotel-card.tsx',
      'packages/ui/src/components/travel/booking-confirmation.tsx',
      'packages/ui/src/components/travel/room-gallery.tsx',
      'packages/ui/src/components/travel/support-chat.tsx',
      'packages/ui/src/components/travel/search-form.tsx',
      'packages/ui/src/components/travel/activity-card.tsx',
      'packages/ui/src/components/travel/booking-stepper.tsx',
      'packages/ui/src/components/travel/car-card.tsx',
      'packages/ui/src/components/travel/filter-panel.tsx',
      'packages/ui/src/components/travel/flight-card.tsx',
      'packages/ui/src/components/travel/price-breakdown.tsx',
    ],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: "JSXAttribute[name.name='className'][value.type='Literal'][value.value=/^(?:\\S+\\s+){10,}\\S+$/]",
          message:
            'Avoid long inline className strings. Move styling into semantic component classes and CVA variants.',
        },
        {
          selector: "CallExpression[callee.name='cn'] Literal[value=/^(?:\\S+\\s+){10,}\\S+$/]",
          message:
            'Avoid long class token literals in cn(). Move styling into semantic component classes and CVA variants.',
        },
      ],
    },
  },
  {
    files: ['apps/web/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: "JSXAttribute[name.name='className'][value.type='Literal'][value.value=/^(?:\\S+\\s+){10,}\\S+$/]",
          message:
            'Avoid long inline className strings. Move styling into semantic app/page classes and CSS contracts.',
        },
        {
          selector: "CallExpression[callee.name='cn'] Literal[value=/^(?:\\S+\\s+){10,}\\S+$/]",
          message:
            'Avoid long class token literals in cn(). Move styling into semantic app/page classes and CSS contracts.',
        },
      ],
    },
  },
  {
    files: ['packages/storybook/stories/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': [
        'warn',
        {
          selector: "JSXAttribute[name.name='className'][value.type='Literal'][value.value=/^(?:\\S+\\s+){12,}\\S+$/]",
          message:
            'Prefer semantic story wrapper classes + CSS contracts over long utility class chains.',
        },
        {
          selector: "CallExpression[callee.name='cn'] Literal[value=/^(?:\\S+\\s+){12,}\\S+$/]",
          message:
            'Prefer semantic story wrapper classes + CSS contracts over long utility class chains.',
        },
      ],
    },
  },
];
