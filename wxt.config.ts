import { pobStatsPath } from './scripts/pob-stats';
import { defineConfig } from 'wxt';
import type { UserConfig } from 'wxt';

// See https://wxt.dev/api/config.html
const config: UserConfig = {
  modules: ['@wxt-dev/module-react', '@wxt-dev/i18n/module'],
  manifest: {
    name: '__MSG_extensionName__',
    description: '__MSG_extensionDescription__',
    default_locale: 'en',
    permissions: ['activeTab', 'storage'],
    // The background script fetches poe.ninja ratios for the content script (see entrypoints/background.ts)
    host_permissions: ['https://poe.ninja/*'],
    // Images are used by the content script on the trade site (see utils/extension-url.ts)
    web_accessible_resources: [
      { resources: ['assets/images/*'], matches: ['https://*.pathofexile.com/*', 'https://poe.game.daum.net/*'] },
    ],
  },
  // Icons are sized like font icons (1em) unless CSS says otherwise
  svgr: { svgrOptions: { icon: true } },
  // outDir: './dist',
  webExt: {
    chromiumArgs: ['https://www.pathofexile.com/trade'],
  },
  hooks: {
    'prepare:publicPaths': (_, paths) => {
      paths.push('pob-stats.ndjson');
    },
    // Stat data for the PoB import, fetched at a pinned commit instead of living in git (see scripts/pob-stats.ts)
    'build:publicAssets': async (_, files) => {
      files.push({ absoluteSrc: await pobStatsPath(), relativeDest: 'pob-stats.ndjson' });
    },
  },
};

export default defineConfig(config);
