import RootPageMenu, { RootPage } from './index.tsx';
import { resolveLocaleValue, defineMessages } from '../../.storybook/locale-utils';
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * RootPageMenu component provides navigation between root pages.
 */
const meta = {
  component: RootPageMenu,
  title: 'Components/RootPageMenu',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    currentPage: {
      control: { type: 'radio' },
      options: Object.values(RootPage),
      description: 'Currently active page',
    },
    onChange: {
      control: false,
      description: 'Callback when page selection changes',
    },
    t: {
      control: false,
      description: 'Translation function (provided by render)',
    },
  },
} satisfies Meta<typeof RootPageMenu>;

type Story = StoryObj<typeof meta>;

// Localized messages
const bookmarksMessages = defineMessages({
  'en-US': 'Bookmarks',
  'fr-FR': 'Favoris',
  'es-ES': 'Marcadores',
  'de-DE': 'Lesezeichen',
  'pt-BR': 'Favoritos',
  'ru-RU': 'Закладки',
  'zh-CN': '书签',
  'ja-JP': 'ブックマーク',
  'ko-KR': '북마크',
  'th-TH': 'บุ๊กมาร์ก',
});

const pinnedItemsMessages = defineMessages({
  'en-US': 'Pinned Items',
  'fr-FR': 'Articles épinglés',
  'es-ES': 'Artículos anclados',
  'de-DE': 'Angeheftete Artikel',
  'pt-BR': 'Itens fixados',
  'ru-RU': 'Закрепленные предметы',
  'zh-CN': '固定物品',
  'ja-JP': 'ピン留めアイテム',
  'ko-KR': '고정된 아이템',
  'th-TH': 'ไอเทมที่ปักหมุด',
});

const historyMessages = defineMessages({
  'en-US': 'History',
  'fr-FR': 'Historique',
  'es-ES': 'Historial',
  'de-DE': 'Verlauf',
  'pt-BR': 'Histórico',
  'ru-RU': 'История',
  'zh-CN': '历史记录',
  'ja-JP': '履歴',
  'ko-KR': '기록',
  'th-TH': 'ประวัติ',
});

const currentPageMessages = defineMessages({
  'en-US': 'Current Page:',
  'fr-FR': 'Page actuelle :',
  'es-ES': 'Página actual:',
  'de-DE': 'Aktuelle Seite:',
  'pt-BR': 'Página atual:',
  'ru-RU': 'Текущая страница:',
  'zh-CN': '当前页面：',
  'ja-JP': '現在のページ：',
  'ko-KR': '현재 페이지:',
  'th-TH': 'หน้าปัจจุบัน:',
});

// Mock translation function
const createMockTranslationFunction = (locale: string) => {
  const translations: Record<string, Record<string, string>> = {
    'components.root-page-menu.bookmarks': bookmarksMessages,
    'components.root-page-menu.pinned-items': pinnedItemsMessages,
    'components.root-page-menu.history': historyMessages,
  };

  return (key: string) => {
    const messageMap = translations[key];
    if (!messageMap) return key;
    return resolveLocaleValue(locale, messageMap);
  };
};

export const BookmarksActive: Story = {
  name: 'Bookmarks Active',
  args: {
    currentPage: RootPage.BOOKMARKS,
    onChange: () => {},
    t: () => '',
  },
  render: (args, { globals }) => {
    const t = createMockTranslationFunction(globals.locale as string);

    return (
      <RootPageMenu
        currentPage={RootPage.BOOKMARKS}
        onChange={page => console.log('Changed to:', page)}
        t={t}
        data-locale={globals.locale}
      />
    );
  },
};

export const PinnedItemsActive: Story = {
  name: 'Pinned Items Active',
  args: {
    currentPage: RootPage.PINNED_ITEMS,
    onChange: () => {},
    t: () => '',
  },
  render: (args, { globals }) => {
    const t = createMockTranslationFunction(globals.locale as string);

    return (
      <RootPageMenu
        currentPage={RootPage.PINNED_ITEMS}
        onChange={page => console.log('Changed to:', page)}
        t={t}
        data-locale={globals.locale}
      />
    );
  },
};

export const HistoryActive: Story = {
  name: 'History Active',
  args: {
    currentPage: RootPage.HISTORY,
    onChange: () => {},
    t: () => '',
  },
  render: (args, { globals }) => {
    const t = createMockTranslationFunction(globals.locale as string);

    return (
      <RootPageMenu
        currentPage={RootPage.HISTORY}
        onChange={page => console.log('Changed to:', page)}
        t={t}
        data-locale={globals.locale}
      />
    );
  },
};

export const Interactive: Story = {
  name: 'Interactive (Stateful)',
  args: {
    currentPage: RootPage.BOOKMARKS,
    onChange: () => {},
    t: () => '',
  },
  render: (args, { globals }) => {
    const [currentPage, setCurrentPage] = useState<RootPage>(RootPage.BOOKMARKS);
    const t = createMockTranslationFunction(globals.locale as string);
    const currentPageLabel = resolveLocaleValue(globals.locale as string, currentPageMessages);

    return (
      <div data-locale={globals.locale}>
        <RootPageMenu currentPage={currentPage} onChange={setCurrentPage} t={t} />
        <div style={{ marginTop: 20, padding: 10, backgroundColor: '#1a1a1a', color: '#fff' }}>
          <strong>{currentPageLabel}</strong> {currentPage}
        </div>
      </div>
    );
  },
};

export default meta;
