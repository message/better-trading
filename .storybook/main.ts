import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: [
    "../{stories,components}/**/*.mdx",
    "../{stories,components}/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-onboarding",
    "@storybook/addon-links",
    "@storybook/addon-docs",
    "@chromatic-com/storybook", // decide on this or test-codegen
    "storybook-addon-test-codegen" // decide on this or chromatic
  ],
  staticDirs: ["fonts"],
  framework: {
    name: "@storybook/react-vite",
    options: {
      builder: {
        viteConfigPath: ".storybook/vite.config.ts",
      },
    },
  },
};
export default config;
