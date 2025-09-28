import type { Preview } from "@storybook/react-vite";
import React from "react";
// Import extension global styles so components render with correct look & feel
import "../styles/app.scss";

// The preview object configures global Storybook parameters.
const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        // Any prop name containing 'background' or 'color' (case-insensitive)
        // will be treated as a color control in Storybook's UI.
        color: /(background|color)$/i,
        // Any prop name ending with 'Date' will be treated as a date control in Storybook's UI.
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
  (Story) => {
    if (typeof document !== "undefined") {
      // Ensure our extension body class for styles that scope to body.bt-body
      document.body.classList.add("bt-body");
      // Provide a dark backdrop similar to the target site
      document.body.style.backgroundColor = "#0a0a0a";
      document.body.style.color = "#fff";
      document.body.style.minHeight = "100vh";
    }
    return (
      <div style={{ padding: "1rem" }}>
        <Story />
      </div>
    );
  },
];

export default preview;
