/**
 * SVGR Module for WXT
 *
 * This module integrates SVGR (SVG to React component converter) with the WXT framework
 * for browser extensions. It enables importing SVG files as React components using the
 * `?react` query parameter (e.g., `import Icon from './icon.svg?react'`) and provides
 * TypeScript declarations for these imports. The module automatically configures the
 * SVGR Vite plugin for both development and build processes.
 */

import 'wxt';
import svgr, { type VitePluginSvgrOptions } from 'vite-plugin-svgr';
import { defineWxtModule } from 'wxt/modules';
import type { InlineConfig } from 'vite';


export interface SvgrModuleOptions extends VitePluginSvgrOptions {
  /**
   * Enable or disable the SVGR integration.
   * @default true
   */
  enabled?: boolean;
  /**
   * Configure which declaration files are generated.
   */
  types?: {
    /**
     * Generate declarations for `*.svg?react` imports.
     * @default true
     */
    reactQuery?: boolean;
    /**
     * Generate declarations for `*.svg` imports when they export React components.
     * Defaults to the value of `exportAsDefault`.
     */
    exportAsDefault?: boolean;
  };
}

declare module 'wxt' {
  export interface InlineConfig {
    svgr?: SvgrModuleOptions;
  }
}

export default defineWxtModule<SvgrModuleOptions>({
  name: 'svgr',
  configKey: 'svgr',
  setup(wxt, options) {
    const { enabled = true, types, ...rawPluginOptions } = options ?? {};

    if (!enabled) {
      wxt.logger.debug('`[svgr]` module disabled');
      return;
    }

    const pluginOptions: VitePluginSvgrOptions = { ...rawPluginOptions };
    if (pluginOptions.include == null) pluginOptions.include = '**/*.svg?react';

    const resolvedTypes: ResolvedTypeOptions = {
      reactQuery: types?.reactQuery ?? true,
      exportAsDefault:
        types?.exportAsDefault ?? (pluginOptions.svgrOptions?.exportType === 'default'),
    };

    const pluginFactory = () => svgr(pluginOptions);

    const addPlugin = (config: InlineConfig): void => {
      const plugin = pluginFactory();
      if (!config.plugins) {
        config.plugins = [plugin];
      } else if (Array.isArray(config.plugins)) {
        config.plugins.push(plugin);
      } else {
        config.plugins = [config.plugins, plugin];
      }
    };

    wxt.hooks.hook('vite:devServer:extendConfig', (config) => {
      addPlugin(config);
    });

    wxt.hooks.hook('vite:build:extendConfig', (_, config) => {
      addPlugin(config);
    });

    if (resolvedTypes.reactQuery || resolvedTypes.exportAsDefault) {
      wxt.hooks.hook('prepare:types', async (_, entries) => {
        entries.push({
          path: 'svgr/index.d.ts',
          text: generateTypeDeclarations(resolvedTypes),
          tsReference: true,
        });
      });
    }
  },
});

interface ResolvedTypeOptions {
  reactQuery: boolean;
  exportAsDefault: boolean;
}

function generateTypeDeclarations(options: ResolvedTypeOptions): string {
  const lines: string[] = [];

  if (options.reactQuery) {
    lines.push(
      'declare module \'*.svg?react\' {',
      '  import type { FC, SVGProps } from \'react\';',
      '  const Component: FC<SVGProps<SVGSVGElement>>;',
      '  export const ReactComponent: FC<SVGProps<SVGSVGElement>>;',
      '  export default Component;',
      '}',
    );
  }

  if (options.reactQuery && options.exportAsDefault) {
    lines.push('');
  }

  if (options.exportAsDefault) {
    lines.push(
      'declare module \'*.svg\' {',
      '  import type { FC, SVGProps } from \'react\';',
      '  const Component: FC<SVGProps<SVGSVGElement>>;',
      '  export const ReactComponent: FC<SVGProps<SVGSVGElement>>;',
      '  export default Component;',
      '}',
    );
  }

  return lines.join('\n');
}
