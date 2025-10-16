import PagePinnedItems from './index.tsx';
import { resolveLocaleValue, defineMessages } from '../../.storybook/locale-utils';
import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * PagePinnedItems component displays pinned items from trade searches.
 */
const meta = {
  component: PagePinnedItems,
  title: 'Pages/PagePinnedItems',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    t: {
      control: false,
      description: 'Translation function (provided by render)',
    },
  },
} satisfies Meta<typeof PagePinnedItems>;

type Story = StoryObj<typeof meta>;

// Localized messages
const scrollToItemMessages = defineMessages({
  'en-US': 'Scroll to Item',
  'fr-FR': "Faire défiler vers l'article",
  'es-ES': 'Desplazarse al artículo',
  'de-DE': 'Zum Artikel scrollen',
  'pt-BR': 'Rolar para o item',
  'ru-RU': 'Прокрутить к предмету',
  'zh-CN': '滚动到物品',
  'ja-JP': 'アイテムにスクロール',
  'ko-KR': '아이템으로 스크롤',
  'th-TH': 'เลื่อนไปที่ไอเทม',
});

const unpinItemMessages = defineMessages({
  'en-US': 'Unpin Item',
  'fr-FR': 'Désépingler',
  'es-ES': 'Desanclar',
  'de-DE': 'Lösen',
  'pt-BR': 'Desafixar',
  'ru-RU': 'Открепить',
  'zh-CN': '取消固定',
  'ja-JP': 'ピン解除',
  'ko-KR': '고정 해제',
  'th-TH': 'เลิกปักหมุด',
});

const clearMessages = defineMessages({
  'en-US': 'Clear All',
  'fr-FR': 'Tout effacer',
  'es-ES': 'Limpiar todo',
  'de-DE': 'Alle löschen',
  'pt-BR': 'Limpar tudo',
  'ru-RU': 'Очистить всё',
  'zh-CN': '清除全部',
  'ja-JP': 'すべてクリア',
  'ko-KR': '모두 지우기',
  'th-TH': 'ล้างทั้งหมด',
});

const emptyMessages = defineMessages({
  'en-US': 'No pinned items yet. Pin items from trade searches to see them here.',
  'fr-FR': 'Aucun article épinglé pour le moment. Épinglez des articles depuis les recherches pour les voir ici.',
  'es-ES': 'No hay artículos anclados aún. Ancla artículos de las búsquedas para verlos aquí.',
  'de-DE': 'Noch keine angehefteten Artikel. Heften Sie Artikel aus Suchvorgängen an, um sie hier zu sehen.',
  'pt-BR': 'Nenhum item fixado ainda. Fixe itens de pesquisas para vê-los aqui.',
  'ru-RU': 'Пока нет закрепленных предметов. Закрепите предметы из поиска, чтобы увидеть их здесь.',
  'zh-CN': '尚无固定物品。从交易搜索中固定物品以在此处查看。',
  'ja-JP': 'まだピン留めされたアイテムがありません。検索からアイテムをピン留めするとここに表示されます。',
  'ko-KR': '고정된 아이템이 없습니다. 검색에서 아이템을 고정하여 여기에 표시하세요.',
  'th-TH': 'ยังไม่มีไอเทมที่ปักหมุด ปักหมุดไอเทมจากการค้นหาเพื่อดูที่นี่',
});

const warningMessages = defineMessages({
  'en-US': 'Pinned items are stored locally and will be lost if you clear browser data.',
  'fr-FR': 'Les articles épinglés sont stockés localement et seront perdus si vous effacez les données du navigateur.',
  'es-ES': 'Los artículos anclados se almacenan localmente y se perderán si eliminas los datos del navegador.',
  'de-DE': 'Angeheftete Artikel werden lokal gespeichert und gehen verloren, wenn Sie Browserdaten löschen.',
  'pt-BR': 'Itens fixados são armazenados localmente e serão perdidos se você limpar os dados do navegador.',
  'ru-RU': 'Закрепленные предметы хранятся локально и будут потеряны при очистке данных браузера.',
  'zh-CN': '固定物品存储在本地，如果清除浏览器数据将会丢失。',
  'ja-JP': 'ピン留めされたアイテムはローカルに保存され、ブラウザデータを消去すると失われます。',
  'ko-KR': '고정된 아이템은 로컬에 저장되며 브라우저 데이터를 지우면 손실됩니다.',
  'th-TH': 'ไอเทมที่ปักหมุดจะถูกเก็บไว้ในเครื่องและจะหายไปหากคุณล้างข้อมูลเบราว์เซอร์',
});

// Mock translation function
const createMockTranslationFunction = (locale: string) => {
  const translations: Record<string, Record<string, string>> = {
    'page.pinned-items.scroll-to-item': scrollToItemMessages,
    'page.pinned-items.unpin-item': unpinItemMessages,
    'page.pinned-items.clear': clearMessages,
    'page.pinned-items.empty': emptyMessages,
    'page.pinned-items.warning': warningMessages,
  };

  return (key: string) => {
    const messageMap = translations[key];
    if (!messageMap) return key;
    return resolveLocaleValue(locale, messageMap);
  };
};

export const Empty: Story = {
  name: 'Empty State',
  args: {
    t: () => '',
  },
  render: (args, { globals }) => {
    const t = createMockTranslationFunction(globals.locale as string);

    return <PagePinnedItems t={t} data-locale={globals.locale} />;
  },
};

export const WithWarningOnly: Story = {
  name: 'Warning Message',
  args: {
    t: () => '',
  },
  render: (args, { globals }) => {
    const t = createMockTranslationFunction(globals.locale as string);

    return (
      <div data-locale={globals.locale}>
        <PagePinnedItems t={t} />
      </div>
    );
  },
};

export default meta;
