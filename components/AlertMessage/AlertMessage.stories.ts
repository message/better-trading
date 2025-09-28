import type { Meta, StoryObj } from "@storybook/react-vite";
import AlertMessage from "./index.tsx";

/**
 * AlertMessage displays a short status or warning block with an icon.
 *
 * NOTE: The `message` prop is rendered via `dangerouslySetInnerHTML`, so only pass
 * trusted / sanitized HTML. In normal application code you should sanitize user-provided
 * content before passing it here.
 */
const meta = {
  component: AlertMessage,
  title: "Components/AlertMessage",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    type: {
      control: { type: "radio" },
      options: ["success", "warning", "alert"],
      description: "Visual style / intent of the alert.",
    },
    message: {
      control: "text",
      description: "Message HTML string rendered inside the alert.",
    },
    className: {
      control: false,
      table: { category: "Styling" },
      description: "Optional additional class names.",
    },
  },
  args: {
    type: "success",
    message: "Operation completed successfully!",
  },
} satisfies Meta<typeof AlertMessage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    type: "success",
    message: "Everything went smoothly!",
  },
};

export const Warning: Story = {
  args: {
    type: "warning",
    message: "Be careful – double check your input.",
  },
};

export const Alert: Story = {
  args: {
    type: "alert",
    message: "Something went wrong. Please retry.",
  },
};

export const WithHTML: Story = {
  name: "With HTML Content",
  args: {
    type: "warning",
    message: "<strong>Heads up:</strong> You can include <em>formatted</em> text and <a href='#' onclick='return false;'>links</a>.",
  },
  parameters: {
    docs: {
      description: {
        story: "Demonstrates that the `message` prop supports a limited subset of HTML. Avoid injecting unsanitized user content.",
      },
    },
  },
};

