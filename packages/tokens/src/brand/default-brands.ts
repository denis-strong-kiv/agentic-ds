import type { BrandConfig } from '../oklch/types.js';

export const DEFAULT_BRANDS: BrandConfig[] = [
  {
    id: 'default',
    displayName: 'Default',
    primarySeed: { lightness: 0.5, chroma: 0.22, hue: 250 },
    accentSeed: { lightness: 0.52, chroma: 0.2, hue: 285 },
    neutralTemperature: 'neutral',
    semanticTemperature: 'neutral',
    shape: 'rounded',
    fonts: {
      display: 'system-ui, sans-serif',
      heading: 'system-ui, sans-serif',
      body: 'system-ui, sans-serif',
    },
  },
  {
    id: 'luxury',
    displayName: 'Luxury Airways',
    primarySeed: { lightness: 0.32, chroma: 0.12, hue: 255 },
    accentSeed: { lightness: 0.72, chroma: 0.16, hue: 85 },
    neutralTemperature: 'cool',
    semanticTemperature: 'cool',
    shape: 'sharp',
    fonts: {
      display: 'system-ui, sans-serif',
      heading: 'system-ui, sans-serif',
      body: 'system-ui, sans-serif',
    },
  },
  {
    id: 'adventure',
    displayName: 'Adventure Co',
    primarySeed: { lightness: 0.46, chroma: 0.15, hue: 150 },
    accentSeed: { lightness: 0.62, chroma: 0.2, hue: 55 },
    neutralTemperature: 'warm',
    semanticTemperature: 'warm',
    shape: 'rounded',
    fonts: {
      display: 'system-ui, sans-serif',
      heading: 'system-ui, sans-serif',
      body: 'system-ui, sans-serif',
    },
  },
  {
    id: 'eco',
    displayName: 'Eco Getaways',
    primarySeed: { lightness: 0.46, chroma: 0.16, hue: 195 },
    accentSeed: { lightness: 0.68, chroma: 0.17, hue: 75 },
    neutralTemperature: 'cool',
    semanticTemperature: 'neutral',
    shape: 'pill',
    fonts: {
      display: 'system-ui, sans-serif',
      heading: 'system-ui, sans-serif',
      body: 'system-ui, sans-serif',
    },
  },
] as const;

export type DefaultBrandId = (typeof DEFAULT_BRANDS)[number]['id'];

