import type { Preview } from "@storybook/react-vite";
import React from "react";
// Import extension global styles so components render with correct look & feel
import "../styles/app.scss";

// The preview object configures global Storybook parameters & globals.
const preview: Preview = {
  initialGlobals: {
    locale: "en-US",
  },
  globalTypes: {
    locale: {
      name: "Locale",
      description: "Active language locale (sets <html lang=...>)",
      toolbar: {
        icon: "globe",
        items: [
          { value: "en-US", right: "🇺🇸", title: "English" },
          { value: "ru-RU", right: "🇷🇺", title: "Russian" },
          { value: "zh-CN", right: "🇨🇳", title: "Simplified Chinese" },
            { value: "zh-TW", right: "🇹🇼", title: "Traditional Chinese" },
          { value: "ko-KR", right: "🇰🇷", title: "Korean" },
          { value: "ja-JP", right: "🇯🇵", title: "Japanese" }
        ],
        showName: true,
      },
    },
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "bt-dark",
      values: [
        { name: "bt-dark", value: "#0a0a0a" },
        { name: "transparent", value: "transparent" },
        { name: "white", value: "#ffffff" },
      ],
    },
  },
};

export const decorators = [
  (Story: any, context: { globals?: Record<string, any> }) => {
    if (typeof document !== "undefined") {
      // Ensure our extension body class for styles that scope to body.bt-body
      document.body.classList.add("bt-body");
      // Provide a dark backdrop similar to the target site
      document.body.style.backgroundColor = "#0a0a0a";
      document.body.style.color = "#fff";
      document.body.style.minHeight = "100vh";

      // Apply selected locale to <html lang="...">
      const locale = context.globals?.locale || "en-US";
      if (document.documentElement.lang !== locale) {
        document.documentElement.lang = locale;
      }
    }

    return (
      <div className="sb-font-wrapper" style={{ padding: "1rem" }}>
        <Story />
      </div>
    );
  },
];

export default preview;
