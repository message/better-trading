import ExpandButton from './index';
import { collapseSidePanel, expandSidePanel } from '@/utils/side-panel-collapse';
import { useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * ExpandButton restores the side panel after it has been collapsed elsewhere.
 */
const meta = {
  component: ExpandButton,
  title: 'Components/ExpandButton',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof ExpandButton>;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const CollapsedPreview = () => {
      useEffect(() => {
        collapseSidePanel();
        return () => {
          expandSidePanel();
        };
      }, []);

      return <ExpandButton />;
    };

    return <CollapsedPreview />;
  },
};

export default meta;
