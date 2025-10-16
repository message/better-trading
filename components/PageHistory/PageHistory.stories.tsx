import PageHistory from './index';
import { tradeLocationServiceStub } from './services-stub';
import { defineMessages, resolveLocaleValue } from '../../.storybook/locale-utils';
import type { TradeLocationHistoryStruct } from './types';
import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * PageHistory displays a list of previously visited trade searches,
 * allowing users to quickly return to their search history.
 */
const meta = {
  component: PageHistory,
  title: 'Pages/PageHistory',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    clearButtonLabel: {
      control: 'text',
      description: 'Label for the clear history button',
    },
    emptyMessage: {
      control: 'text',
      description: 'Message shown when history is empty',
    },
    clearSuccessMessage: {
      control: 'text',
      description: 'Success message after clearing history',
    },
    genericAlertMessage: {
      control: 'text',
      description: 'Generic alert message for errors',
    },
  },
} satisfies Meta<typeof PageHistory>;

type Story = StoryObj<typeof meta>;

// Mock history data generator
const createMockHistoryEntry = (
  id: string,
  title: string,
  slug: string,
  type: string,
  league: string,
  hoursAgo: number,
): TradeLocationHistoryStruct => ({
  id,
  title,
  slug,
  type,
  league,
  version: '2',
  createdAt: new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString(),
});

// Localized messages
const clearButtonMessages = defineMessages({
  'en-US': 'Clear History',
  'fr-FR': "Effacer l'historique",
  'es-ES': 'Borrar historial',
  'de-DE': 'Verlauf löschen',
  'pt-BR': 'Limpar histórico',
  'ru-RU': 'Очистить историю',
  'zh-CN': '清除历史',
  'ja-JP': '履歴をクリア',
  'ko-KR': '기록 지우기',
  'th-TH': 'ล้างประวัติ',
});

const emptyHistoryMessages = defineMessages({
  'en-US': 'Your trade history is empty. Visit a trade page to start building your history.',
  'fr-FR':
    'Votre historique de trades est vide. Visitez une page de trade pour commencer à construire votre historique.',
  'es-ES':
    'Tu historial de intercambios está vacío. Visita una página de intercambio para comenzar a construir tu historial.',
  'de-DE': 'Ihr Handelsverlauf ist leer. Besuchen Sie eine Handelsseite, um Ihren Verlauf aufzubauen.',
  'pt-BR':
    'Seu histórico de negociações está vazio. Visite uma página de negociação para começar a construir seu histórico.',
  'ru-RU': 'Ваша история торговли пуста. Посетите страницу торговли, чтобы начать создавать историю.',
  'zh-CN': '您的交易历史为空。访问交易页面开始建立历史记录。',
  'ja-JP': 'トレード履歴が空です。トレードページにアクセスして履歴の構築を開始してください。',
  'ko-KR': '거래 기록이 비어 있습니다. 거래 페이지를 방문하여 기록을 쌓기 시작하세요.',
  'th-TH': 'ประวัติการซื้อขายของคุณว่างเปล่า เข้าชมหน้าการซื้อขายเพื่อเริ่มสร้างประวัติ',
});

const clearSuccessMessages = defineMessages({
  'en-US': 'Trade history cleared successfully.',
  'fr-FR': "L'historique des trades a été effacé avec succès.",
  'es-ES': 'Historial de intercambios borrado exitosamente.',
  'de-DE': 'Handelsverlauf erfolgreich gelöscht.',
  'pt-BR': 'Histórico de negociações limpo com sucesso.',
  'ru-RU': 'История торговли успешно очищена.',
  'zh-CN': '交易历史已成功清除。',
  'ja-JP': 'トレード履歴が正常にクリアされました。',
  'ko-KR': '거래 기록이 성공적으로 삭제되었습니다.',
  'th-TH': 'ล้างประวัติการซื้อขายสำเร็จแล้ว',
});

const genericAlertMessages = defineMessages({
  'en-US': 'An error occurred. Please try again.',
  'fr-FR': "Une erreur s'est produite. Veuillez réessayer.",
  'es-ES': 'Ocurrió un error. Por favor, inténtalo de nuevo.',
  'de-DE': 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
  'pt-BR': 'Ocorreu um erro. Por favor, tente novamente.',
  'ru-RU': 'Произошла ошибка. Пожалуйста, попробуйте еще раз.',
  'zh-CN': '发生错误。请重试。',
  'ja-JP': 'エラーが発生しました。もう一度お試しください。',
  'ko-KR': '오류가 발생했습니다. 다시 시도하세요.',
  'th-TH': 'เกิดข้อผิดพลาด กรุณาลองอีกครั้ง',
});

export const WithHistory: Story = {
  name: 'With History',
  args: {
    clearButtonLabel: '',
    emptyMessage: '',
    clearSuccessMessage: '',
    genericAlertMessage: '',
  },
  render: (_args, context) => {
    const { globals } = context;
    const clearButtonLabel = resolveLocaleValue(globals.locale as string, clearButtonMessages);
    const emptyMessage = resolveLocaleValue(globals.locale as string, emptyHistoryMessages);
    const clearSuccessMessage = resolveLocaleValue(globals.locale as string, clearSuccessMessages);
    const genericAlertMessage = resolveLocaleValue(globals.locale as string, genericAlertMessages);

    // Mock history data
    tradeLocationServiceStub.fetchHistoryEntries = async () => [
      createMockHistoryEntry('1', 'Exalted Orb', 'exalted-orb', 'search', 'Crucible', 2),
      createMockHistoryEntry('2', 'Enlighten Support', 'enlighten-support', 'search', 'Crucible', 5),
      createMockHistoryEntry('3', 'Headhunter', 'headhunter', 'search', 'Crucible', 12),
      createMockHistoryEntry('4', 'Mageblood', 'mageblood', 'search', 'Crucible', 24),
    ];

    return (
      <div data-locale={globals.locale}>
        <PageHistory
          clearButtonLabel={clearButtonLabel}
          emptyMessage={emptyMessage}
          clearSuccessMessage={clearSuccessMessage}
          genericAlertMessage={genericAlertMessage}
        />
      </div>
    );
  },
};

export const EmptyHistory: Story = {
  name: 'Empty History',
  args: {
    clearButtonLabel: '',
    emptyMessage: '',
    clearSuccessMessage: '',
    genericAlertMessage: '',
  },
  render: (_args, context) => {
    const { globals } = context;
    const clearButtonLabel = resolveLocaleValue(globals.locale as string, clearButtonMessages);
    const emptyMessage = resolveLocaleValue(globals.locale as string, emptyHistoryMessages);
    const clearSuccessMessage = resolveLocaleValue(globals.locale as string, clearSuccessMessages);
    const genericAlertMessage = resolveLocaleValue(globals.locale as string, genericAlertMessages);

    // Mock empty history
    tradeLocationServiceStub.fetchHistoryEntries = async () => [];

    return (
      <div data-locale={globals.locale}>
        <PageHistory
          clearButtonLabel={clearButtonLabel}
          emptyMessage={emptyMessage}
          clearSuccessMessage={clearSuccessMessage}
          genericAlertMessage={genericAlertMessage}
        />
      </div>
    );
  },
};

export const SingleEntry: Story = {
  name: 'Single Entry',
  args: {
    clearButtonLabel: '',
    emptyMessage: '',
    clearSuccessMessage: '',
    genericAlertMessage: '',
  },
  render: (_args, context) => {
    const { globals } = context;
    const clearButtonLabel = resolveLocaleValue(globals.locale as string, clearButtonMessages);
    const emptyMessage = resolveLocaleValue(globals.locale as string, emptyHistoryMessages);
    const clearSuccessMessage = resolveLocaleValue(globals.locale as string, clearSuccessMessages);
    const genericAlertMessage = resolveLocaleValue(globals.locale as string, genericAlertMessages);

    // Mock single entry
    tradeLocationServiceStub.fetchHistoryEntries = async () => [
      createMockHistoryEntry('1', "Atziri's Promise", 'atziris-promise', 'search', 'Crucible', 1),
    ];

    return (
      <div data-locale={globals.locale}>
        <PageHistory
          clearButtonLabel={clearButtonLabel}
          emptyMessage={emptyMessage}
          clearSuccessMessage={clearSuccessMessage}
          genericAlertMessage={genericAlertMessage}
        />
      </div>
    );
  },
};

export const ManyEntries: Story = {
  name: 'Many Entries',
  args: {
    clearButtonLabel: '',
    emptyMessage: '',
    clearSuccessMessage: '',
    genericAlertMessage: '',
  },
  render: (_args, context) => {
    const { globals } = context;
    const clearButtonLabel = resolveLocaleValue(globals.locale as string, clearButtonMessages);
    const emptyMessage = resolveLocaleValue(globals.locale as string, emptyHistoryMessages);
    const clearSuccessMessage = resolveLocaleValue(globals.locale as string, clearSuccessMessages);
    const genericAlertMessage = resolveLocaleValue(globals.locale as string, genericAlertMessages);

    // Mock many entries
    tradeLocationServiceStub.fetchHistoryEntries = async () => [
      createMockHistoryEntry('1', 'Exalted Orb', 'exalted-orb', 'search', 'Crucible', 1),
      createMockHistoryEntry('2', 'Divine Orb', 'divine-orb', 'search', 'Crucible', 2),
      createMockHistoryEntry('3', 'Mirror of Kalandra', 'mirror-of-kalandra', 'search', 'Crucible', 3),
      createMockHistoryEntry('4', 'Enlighten Support', 'enlighten-support', 'search', 'Crucible', 4),
      createMockHistoryEntry('5', 'Empower Support', 'empower-support', 'search', 'Crucible', 6),
      createMockHistoryEntry('6', 'Headhunter', 'headhunter', 'search', 'Crucible', 8),
      createMockHistoryEntry('7', 'Mageblood', 'mageblood', 'search', 'Crucible', 10),
      createMockHistoryEntry('8', 'Awakened Gems', 'awakened-gems', 'search', 'Crucible', 12),
      createMockHistoryEntry('9', 'Forbidden Flame', 'forbidden-flame', 'search', 'Crucible', 18),
      createMockHistoryEntry('10', 'Forbidden Flesh', 'forbidden-flesh', 'search', 'Crucible', 24),
    ];

    return (
      <div data-locale={globals.locale}>
        <PageHistory
          clearButtonLabel={clearButtonLabel}
          emptyMessage={emptyMessage}
          clearSuccessMessage={clearSuccessMessage}
          genericAlertMessage={genericAlertMessage}
        />
      </div>
    );
  },
};

export const LongTitles: Story = {
  name: 'Long Titles',
  args: {
    clearButtonLabel: '',
    emptyMessage: '',
    clearSuccessMessage: '',
    genericAlertMessage: '',
  },
  render: (_args, context) => {
    const { globals } = context;
    const clearButtonLabel = resolveLocaleValue(globals.locale as string, clearButtonMessages);
    const emptyMessage = resolveLocaleValue(globals.locale as string, emptyHistoryMessages);
    const clearSuccessMessage = resolveLocaleValue(globals.locale as string, clearSuccessMessages);
    const genericAlertMessage = resolveLocaleValue(globals.locale as string, genericAlertMessages);

    // Mock entries with long titles
    tradeLocationServiceStub.fetchHistoryEntries = async () => [
      createMockHistoryEntry(
        '1',
        'Rare Jewel with 7% Maximum Life, 14% Critical Strike Multiplier, and 12% Cold Resistance',
        'rare-jewel-complex-search',
        'search',
        'Crucible',
        1,
      ),
      createMockHistoryEntry(
        '2',
        'Unique Body Armour with High Energy Shield, Spell Suppression, and Life Regeneration',
        'unique-body-armour-search',
        'search',
        'Crucible',
        3,
      ),
      createMockHistoryEntry(
        '3',
        'This is an extremely long title that should be truncated with ellipsis when displayed in the history list',
        'very-long-search-query',
        'search',
        'Crucible',
        6,
      ),
    ];

    return (
      <div data-locale={globals.locale}>
        <PageHistory
          clearButtonLabel={clearButtonLabel}
          emptyMessage={emptyMessage}
          clearSuccessMessage={clearSuccessMessage}
          genericAlertMessage={genericAlertMessage}
        />
      </div>
    );
  },
};

export default meta;
