import PagePinnedItems from './index.tsx';
import { genericAlertMessages } from '../../.storybook/common-messages';
import { resolveLocaleValue, defineMessages } from '../../.storybook/locale-utils';
import { MockItemResultsProvider, createMockPinnedItem } from '../../.storybook/mock-providers';
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
    warningMessage: { control: false, description: '(Provided by render)' },
    clearLabel: { control: false, description: '(Provided by render)' },
    formatPinnedCount: { control: false, description: '(Provided by render)' },
    emptyTitle: { control: false, description: '(Provided by render)' },
    emptyHint: { control: false, description: '(Provided by render)' },
    pinButtonLabel: { control: false, description: '(Provided by render)' },
    unpinItemLabel: { control: false, description: '(Provided by render)' },
    scrollToItemLabel: { control: false, description: '(Provided by render)' },
    genericAlertMessage: { control: false, description: '(Provided by render)' },
  },
  args: {
    warningMessage: '',
    clearLabel: '',
    formatPinnedCount: () => '',
    emptyTitle: '',
    emptyHint: '',
    pinButtonLabel: '',
    unpinItemLabel: '',
    scrollToItemLabel: '',
    genericAlertMessage: '',
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
  'en-US': 'Unpin All',
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

const pinnedCountMessages = defineMessages({
  'en-US': '{count} pinned',
  'fr-FR': '{count} épinglé(s)',
  'es-ES': '{count} anclado(s)',
  'de-DE': '{count} angeheftet',
  'pt-BR': '{count} fixado(s)',
  'ru-RU': 'Закреплено: {count}',
  'zh-CN': '已固定 {count} 个',
  'ja-JP': '{count} 件ピン留め',
  'ko-KR': '{count}개 고정됨',
  'th-TH': 'ปักหมุด {count} รายการ',
});

const emptyTitleMessages = defineMessages({
  'en-US': 'No pinned items',
  'fr-FR': 'Aucun article épinglé',
  'es-ES': 'No hay artículos anclados',
  'de-DE': 'Keine angehefteten Artikel',
  'pt-BR': 'Nenhum item fixado',
  'ru-RU': 'Нет закреплённых предметов',
  'zh-CN': '没有固定的物品',
  'ja-JP': 'ピン留めされたアイテムはありません',
  'ko-KR': '고정된 아이템이 없습니다',
  'th-TH': 'ไม่มีไอเทมที่ปักหมุด',
});

const emptyHintMessages = defineMessages({
  'en-US':
    'Look for {pin} in the action buttons at the bottom right of each result. Pinned items stay here so you can compare them.',
  'fr-FR':
    "Cherchez {pin} parmi les boutons d'action en bas à droite de chaque résultat. Les objets épinglés restent ici pour que vous puissiez les comparer.",
  'es-ES':
    'Busca {pin} entre los botones de acción en la esquina inferior derecha de cada resultado. Los objetos fijados se quedan aquí para que puedas compararlos.',
  'de-DE':
    'Suchen Sie {pin} bei den Aktionsschaltflächen unten rechts in jedem Ergebnis. Angeheftete Gegenstände bleiben hier, damit Sie sie vergleichen können.',
  'pt-BR':
    'Procure {pin} nos botões de ação no canto inferior direito de cada resultado. Os itens fixados ficam aqui para você compará-los.',
  'ru-RU':
    'Ищите {pin} среди кнопок действий в правом нижнем углу каждого результата. Закреплённые предметы остаются здесь, чтобы их можно было сравнить.',
  'zh-CN': '在每个结果右下角的操作按钮中找到 {pin}。固定的物品会保留在这里，方便你进行比较。',
  'ja-JP':
    '各結果の右下にあるアクションボタンから {pin} を探してください。ピン留めしたアイテムはここに残り、比較できます。',
  'ko-KR': '각 결과 오른쪽 아래의 작업 버튼에서 {pin}을 찾으세요. 고정한 아이템은 비교할 수 있도록 여기에 남습니다.',
  'th-TH':
    'มองหา {pin} ในปุ่มการทำงานที่มุมขวาล่างของแต่ละผลลัพธ์ ไอเทมที่ปักหมุดจะอยู่ที่นี่เพื่อให้คุณเปรียบเทียบได้',
});

const pinButtonMessages = defineMessages({
  'en-US': 'Pin',
  'fr-FR': 'Épingler',
  'es-ES': 'Anclar',
  'de-DE': 'Anheften',
  'pt-BR': 'Fixar',
  'ru-RU': 'Закрепить',
  'zh-CN': '固定',
  'ja-JP': 'ピン留め',
  'ko-KR': '고정',
  'th-TH': 'ปักหมุด',
});

const warningMessages = defineMessages({
  'en-US': 'Pins last until you change the search or reload the page.',
  'fr-FR': "Les épingles restent jusqu'à ce que vous changiez la recherche ou rechargiez la page.",
  'es-ES': 'Los anclajes duran hasta que cambies la búsqueda o recargues la página.',
  'de-DE': 'Angeheftetes bleibt, bis Sie die Suche ändern oder die Seite neu laden.',
  'pt-BR': 'Os itens fixados permanecem até você mudar a busca ou recarregar a página.',
  'ru-RU': 'Закреплённое сохраняется, пока вы не смените поиск или не перезагрузите страницу.',
  'zh-CN': '固定的物品会保留到你更改搜索或重新加载页面为止。',
  'ja-JP': 'ピン留めは検索を変更するかページを再読み込みするまで保持されます。',
  'ko-KR': '검색을 변경하거나 페이지를 새로고침할 때까지 고정이 유지됩니다.',
  'th-TH': 'การปักหมุดจะคงอยู่จนกว่าคุณจะเปลี่ยนการค้นหาหรือโหลดหน้าใหม่',
});

const getMessages = (locale: string) => ({
  warningMessage: resolveLocaleValue(locale, warningMessages),
  clearLabel: resolveLocaleValue(locale, clearMessages),
  formatPinnedCount: (count: number) =>
    resolveLocaleValue(locale, pinnedCountMessages).replace('{count}', String(count)),
  emptyTitle: resolveLocaleValue(locale, emptyTitleMessages),
  emptyHint: resolveLocaleValue(locale, emptyHintMessages),
  pinButtonLabel: resolveLocaleValue(locale, pinButtonMessages),
  unpinItemLabel: resolveLocaleValue(locale, unpinItemMessages),
  scrollToItemLabel: resolveLocaleValue(locale, scrollToItemMessages),
  genericAlertMessage: resolveLocaleValue(locale, genericAlertMessages),
});

const mockPinnedItems = [
  createMockPinnedItem('item-1', 'Tabula Rasa', '1 divine', 5),
  createMockPinnedItem('item-2', 'Headhunter', '40 divine', 2),
];

export const Empty: Story = {
  name: 'Empty State',
  render: (_args, { globals }) => (
    <MockItemResultsProvider>
      <PagePinnedItems {...getMessages(globals.locale as string)} />
    </MockItemResultsProvider>
  ),
};

/** Unpin and clear work; "scroll to item" flashes an alert since the results are not on the page */
export const WithPinnedItems: Story = {
  render: (_args, { globals }) => (
    <MockItemResultsProvider mockPinnedItems={mockPinnedItems}>
      <PagePinnedItems {...getMessages(globals.locale as string)} />
    </MockItemResultsProvider>
  ),
};

export default meta;
