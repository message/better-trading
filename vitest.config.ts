import { defineConfig } from 'vitest/config';
import { WxtVitest } from 'wxt/testing/vitest-plugin';

export default defineConfig({
  plugins: [WxtVitest()],
  // The first run downloads the PoB stat data (see scripts/pob-stats.ts)
  test: { hookTimeout: 60_000 },
});
