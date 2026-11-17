import ExpandButton from './index';
import { logoAltMessages, headerExpandMessages } from '../../.storybook/common-messages';
import { resolveLocaleValue } from '../../.storybook/locale-utils';
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
  args: { logoAlt: '', expandLabel: '' },
  render: (args, { globals }) => {
    const locale = globals.locale as string;
    const CollapsedPreview = () => {
      useEffect(() => {
        collapseSidePanel();
        return () => {
          expandSidePanel();
        };
      }, []);

      return (
        <ExpandButton
          logoAlt={resolveLocaleValue(locale, logoAltMessages)}
          expandLabel={resolveLocaleValue(locale, headerExpandMessages)}
        />
      );
    };

    return <CollapsedPreview />;
  },
};

export default meta;
