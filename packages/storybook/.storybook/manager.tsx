import { addons, types, useGlobals } from 'storybook/manager-api';
import * as React from 'react';

const ADDON_ID = 'theme-toggle';
const TOOL_ID = `${ADDON_ID}/tool`;

function ThemeToggleTool() {
  const [globals, updateGlobals] = useGlobals();
  const isDark = (globals['colorMode'] ?? 'light') === 'dark';

  const toggle = () =>
    updateGlobals({ colorMode: isDark ? 'light' : 'dark' });

  return React.createElement(
    'button',
    {
      key: TOOL_ID,
      title: isDark ? 'Switch to light mode' : 'Switch to dark mode',
      onClick: toggle,
      style: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 28,
        height: 28,
        borderRadius: 4,
        color: 'inherit',
        padding: 0,
      },
    },
    isDark
      ? React.createElement(
          'svg',
          { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
          React.createElement('path', { d: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' }),
        )
      : React.createElement(
          'svg',
          { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
          React.createElement('circle', { cx: 12, cy: 12, r: 4 }),
          React.createElement('line', { x1: 12, y1: 2, x2: 12, y2: 4 }),
          React.createElement('line', { x1: 12, y1: 20, x2: 12, y2: 22 }),
          React.createElement('line', { x1: 4.22, y1: 4.22, x2: 5.64, y2: 5.64 }),
          React.createElement('line', { x1: 18.36, y1: 18.36, x2: 19.78, y2: 19.78 }),
          React.createElement('line', { x1: 2, y1: 12, x2: 4, y2: 12 }),
          React.createElement('line', { x1: 20, y1: 12, x2: 22, y2: 12 }),
          React.createElement('line', { x1: 4.22, y1: 19.78, x2: 5.64, y2: 18.36 }),
          React.createElement('line', { x1: 18.36, y1: 5.64, x2: 19.78, y2: 4.22 }),
        ),
  );
}

addons.register(ADDON_ID, () => {
  addons.add(TOOL_ID, {
    type: types.TOOL,
    title: 'Theme',
    match: () => true,
    render: () => React.createElement(ThemeToggleTool),
  });
});
