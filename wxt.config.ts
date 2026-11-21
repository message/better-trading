import { pobStatsPath } from './scripts/pob-stats';
import { transformCode } from '@code-inspector/core';
import { defineConfig } from 'wxt';
import path from 'node:path';
import type { Plugin } from 'vite';
import type { UserConfig } from 'wxt';

// Dev only: tags our JSX elements with `data-insp-path="file:line:col:tag"`, visible in DevTools Elements.
// ponytail: only the attribute transform of code-inspector; its click-to-open overlay needs `customElements`,
// which is null in content scripts.
const jsxSourcePath = (): Plugin => ({
  name: 'jsx-source-path',
  enforce: 'pre',
  transform: (code, id) =>
    id.endsWith('.tsx') && !id.includes('/node_modules/')
      ? transformCode({
          content: code,
          filePath: path.relative(import.meta.dirname, id),
          fileType: 'jsx',
          escapeTags: [],
          pathType: 'relative',
        })
      : undefined,
});

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
  vite: ({ command }) => ({ plugins: command === 'serve' ? [jsxSourcePath()] : [] }),
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
