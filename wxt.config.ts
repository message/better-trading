import { defineConfig, UserConfig } from 'wxt';

// See https://wxt.dev/api/config.html
const config: UserConfig = {
  modules: ['@wxt-dev/module-react', '@wxt-dev/i18n/module', './modules/svgr.ts'],
  manifest: {
    name: '__MSG_extension_name__',
    description: '__MSG_extension_description__',
    default_locale: 'en',
    permissions: ['activeTab', 'storage'],
  },
  // outDir: './dist',
  webExt: {
    chromiumArgs: ['https://www.pathofexile.com/trade'],
  },
};

export default defineConfig(config);
