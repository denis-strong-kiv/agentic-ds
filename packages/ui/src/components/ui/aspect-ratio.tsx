'use client';

import * as AspectRatioPrimitive from '@radix-ui/react-aspect-ratio';

const AspectRatio = AspectRatioPrimitive.Root;

export { AspectRatio };

// Preset ratios for convenience
export const ASPECT_RATIOS = {
  '16/9': 16 / 9,
  '4/3': 4 / 3,
  '1/1': 1,
  '3/2': 3 / 2,
} as const;
