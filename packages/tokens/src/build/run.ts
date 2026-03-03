// ─── Build Entry Point ────────────────────────────────────────────────────────
// Run: tsx src/build/run.ts

import { createStyleDictionary } from './config.js';

async function main() {
  console.log('Building design tokens...');
  const sd = createStyleDictionary();

  try {
    await sd.buildAllPlatforms();
    console.log('Token build complete.');
  } catch (err) {
    console.error('Token build failed:', err);
    process.exit(1);
  }
}

main();
