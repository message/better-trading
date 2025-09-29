import BookmarkFolderIcon from './index.tsx';
import {
  BookmarksFolderAscendancyDuelistIcon,
  BookmarksFolderAscendancyMarauderIcon,
  BookmarksFolderAscendancyPoE2MercenaryIcon,
  BookmarksFolderAscendancyPoE2MonkIcon,
  BookmarksFolderAscendancyPoE2RangerIcon,
  BookmarksFolderAscendancyPoE2SorceressIcon,
  BookmarksFolderAscendancyPoE2WarriorIcon,
  BookmarksFolderAscendancyPoE2WitchIcon,
  BookmarksFolderAscendancyRangerIcon,
  BookmarksFolderAscendancyScionIcon,
  BookmarksFolderAscendancyShadowIcon,
  BookmarksFolderAscendancyTemplarIcon,
  BookmarksFolderAscendancyWitchIcon,
  BookmarksFolderPoE1ItemIcon,
  BookmarksFolderPoE2ItemIcon,
} from '@/types/bookmarks';
import type { BookmarksFolderIcon as BookmarkFolderIconType } from '@/types/bookmarks';
import type { Meta, StoryObj } from '@storybook/react-vite';

// Narrowed option groups per story (kept local to this file for discoverability)
const POE1_ITEM_OPTIONS = Object.values(BookmarksFolderPoE1ItemIcon);
const POE2_ITEM_OPTIONS = Object.values(BookmarksFolderPoE2ItemIcon);
const POE1_ASCENDANCY_OPTIONS = [
  ...Object.values(BookmarksFolderAscendancyDuelistIcon),
  ...Object.values(BookmarksFolderAscendancyShadowIcon),
  ...Object.values(BookmarksFolderAscendancyMarauderIcon),
  ...Object.values(BookmarksFolderAscendancyWitchIcon),
  ...Object.values(BookmarksFolderAscendancyRangerIcon),
  ...Object.values(BookmarksFolderAscendancyTemplarIcon),
  ...Object.values(BookmarksFolderAscendancyScionIcon),
];
const POE2_ASCENDANCY_OPTIONS = [
  ...Object.values(BookmarksFolderAscendancyPoE2WarriorIcon),
  ...Object.values(BookmarksFolderAscendancyPoE2WitchIcon),
  ...Object.values(BookmarksFolderAscendancyPoE2RangerIcon),
  ...Object.values(BookmarksFolderAscendancyPoE2SorceressIcon),
  ...Object.values(BookmarksFolderAscendancyPoE2MercenaryIcon),
  ...Object.values(BookmarksFolderAscendancyPoE2MonkIcon),
];

// Full combined list (items + ascendancies, PoE1 + PoE2) for a playground story
const ALL_ICON_OPTIONS = [
  ...POE1_ITEM_OPTIONS,
  ...POE2_ITEM_OPTIONS,
  ...POE1_ASCENDANCY_OPTIONS,
  ...POE2_ASCENDANCY_OPTIONS,
];

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
      description: 'Icon identifier (subset). Full list in component source.',
    },
    alt: { control: false },
  },
  args: { icon: BookmarksFolderPoE1ItemIcon.ALCHEMY },
} satisfies Meta<typeof BookmarkFolderIcon>;

type Story = StoryObj<typeof meta>;

export const ItemIcon: Story = {
  name: 'Item Icon (PoE1)',
  args: { icon: BookmarksFolderPoE1ItemIcon.DIVINE },
  argTypes: { icon: { options: POE1_ITEM_OPTIONS } },
};

export const AscendancyIcon: Story = {
  name: 'Ascendancy Icon (PoE1)',
  args: { icon: BookmarksFolderAscendancyTemplarIcon.INQUISITOR },
  argTypes: { icon: { options: POE1_ASCENDANCY_OPTIONS } },
};

export const PoE2ItemIcon: Story = {
  name: 'Item Icon (PoE2)',
  args: { icon: BookmarksFolderPoE2ItemIcon.EXALT },
  argTypes: { icon: { options: POE2_ITEM_OPTIONS } },
};

export const PoE2AscendancyIcon: Story = {
  name: 'Ascendancy Icon (PoE2)',
  args: { icon: BookmarksFolderAscendancyPoE2SorceressIcon.STORMWEAVER },
  argTypes: { icon: { options: POE2_ASCENDANCY_OPTIONS } },
};

// A playground story exposing ALL possible icons in a single select for quick ad‑hoc testing
export const Playground: Story = {
  name: 'All Icons (Playground Select)',
  args: { icon: BookmarksFolderPoE1ItemIcon.ALCHEMY },
  argTypes: { icon: { options: ALL_ICON_OPTIONS } },
};

// Visual gallery rendering every icon at once (no select control needed)
export const Gallery: Story = {
  name: 'Gallery (All Icons Grid)',
  parameters: { layout: 'fullscreen' },
  render: () => {
    const categories: { heading: string; icons: string[] }[] = [
      { heading: 'Path of Exile 1 - Items', icons: POE1_ITEM_OPTIONS },
      { heading: 'Path of Exile 1 - Ascendancies', icons: POE1_ASCENDANCY_OPTIONS },
      { heading: 'Path of Exile 2 - Items', icons: POE2_ITEM_OPTIONS },
      { heading: 'Path of Exile 2 - Ascendancies', icons: POE2_ASCENDANCY_OPTIONS },
    ];

    const cardStyle: React.CSSProperties = {
      width: 100,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontSize: 16,
      lineHeight: 1.4,
      textAlign: 'center',
    };

    const gridStyle: React.CSSProperties = {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 16,
      alignItems: 'flex-start',
    };

    return (
      <div style={{ padding: 20, maxWidth: 1300, margin: '0 auto' }}>
        <h3 style={{ margin: '0 0 24px' }}>All Bookmark Folder Icons</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          {categories.map(cat => (
            <section key={cat.heading}>
              <h4 style={{ margin: '0 0 12px', fontSize: 18 }}>{cat.heading}</h4>
              <div style={gridStyle}>
                {cat.icons.map(i => (
                  <div key={i} style={cardStyle}>
                    <BookmarkFolderIcon icon={i as BookmarkFolderIconType} />
                    <span style={{ marginTop: 4 }}>{i}</span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    );
  },
};

export default meta;
