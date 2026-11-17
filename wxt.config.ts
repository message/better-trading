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
};

export default defineConfig(config);
