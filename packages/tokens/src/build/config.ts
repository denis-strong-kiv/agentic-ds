// ─── Style Dictionary v4 Configuration ────────────────────────────────────────

import StyleDictionary from 'style-dictionary';
import { oklchTransform } from './transforms/oklch.js';
import { cssCustomPropertiesFormat } from './formats/css-custom-properties.js';
import { tailwindThemeFormat } from './formats/tailwind-theme.js';
import { reactNativeFormat } from './formats/react-native.js';
import { jsonFlatFormat } from './formats/json-flat.js';

/** Register custom transforms and formats, then return a configured SD instance. */
export function createStyleDictionary(outputDir: string = 'src/output'): StyleDictionary {
  const sd = new StyleDictionary({
    source: [
      'src/definitions/primitives/**/*.json',
      'src/definitions/semantic/**/*.json',
      'src/definitions/component/**/*.json',
    ],
    platforms: {
      css: {
        transforms: ['attribute/cti', 'name/kebab', 'color/oklch'],
        buildPath: `${outputDir}/`,
        files: [
          {
            destination: 'tokens.css',
            format: 'css/custom-properties',
            options: { selector: ':root' },
          },
        ],
      },
      tailwind: {
        transforms: ['attribute/cti', 'name/kebab', 'color/oklch'],
        buildPath: `${outputDir}/`,
        files: [
          {
            destination: 'tailwind-theme.css',
            format: 'css/tailwind-theme',
          },
        ],
      },
      reactNative: {
        transforms: ['attribute/cti', 'name/camel'],
        buildPath: `${outputDir}/`,
        files: [
          {
            destination: 'tokens.ts',
            format: 'typescript/react-native',
          },
        ],
      },
      json: {
        transforms: ['attribute/cti', 'name/kebab', 'color/oklch'],
        buildPath: `${outputDir}/`,
        files: [
          {
            destination: 'tokens.json',
            format: 'json/flat',
          },
        ],
      },
    },
  });

  // Register custom extensions
  sd.registerTransform(oklchTransform);
  sd.registerFormat(cssCustomPropertiesFormat);
  sd.registerFormat(tailwindThemeFormat);
  sd.registerFormat(reactNativeFormat);
  sd.registerFormat(jsonFlatFormat);

  return sd;
}
