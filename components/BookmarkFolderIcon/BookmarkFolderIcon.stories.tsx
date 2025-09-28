import type { Meta, StoryObj } from '@storybook/react-vite';
import BookmarkFolderIcon, { BookmarkFolderIconName, ITEM_ICON_SET } from './index.tsx';
import {
  BookmarksFolderAscendancyDuelistIcon,
  BookmarksFolderAscendancyMarauderIcon,
  BookmarksFolderAscendancyPoE2SorceressIcon,
  BookmarksFolderAscendancyRangerIcon,
  BookmarksFolderAscendancyShadowIcon,
  BookmarksFolderAscendancyTemplarIcon,
  BookmarksFolderAscendancyWitchIcon,
  BookmarksFolderPoE1ItemIcon,
  BookmarksFolderPoE2ItemIcon,
} from '@/types/bookmarks';

/**
 * BookmarkFolderIcon renders a bookmark folder's icon. It adapts its size based on whether
 * the provided icon represents an item (currency, map, etc.) or an ascendancy.
 */
const meta = {
  title: 'Components/BookmarkFolderIcon',
  component: BookmarkFolderIcon,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    icon: {
      control: { type: 'select' },
      options: Array.from(ITEM_ICON_SET),
      description: 'Icon identifier (subset). Full list in component source.',
    },
    alt: { control: false },
  },
  args: { icon: BookmarksFolderPoE1ItemIcon.ALCHEMY },
} satisfies Meta<typeof BookmarkFolderIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ItemIcon: Story = {
  name: 'Item Icon',
  args: { icon: BookmarksFolderPoE1ItemIcon.DIVINE },
};

export const AscendancyIcon: Story = {
  name: 'Ascendancy Icon',
  args: { icon: BookmarksFolderAscendancyWitchIcon.ELEMENTALIST },
};

export const PoE2ItemIcon: Story = {
  name: 'PoE2 Item Icon',
  args: { icon: BookmarksFolderPoE2ItemIcon.EXALT },
};

export const PoE2AscendancyIcon: Story = {
  name: 'PoE2 Ascendancy Icon',
  args: { icon: BookmarksFolderAscendancyPoE2SorceressIcon.CHRONOMANCER },
};
