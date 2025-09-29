import ChangelogBanner from './index.tsx';
import { resolveLocaleValue, defineMessages } from '../../.storybook/locale-utils';
import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * ChangelogBanner displays a notification about new changelog entries.
 * It can be dismissed and shows a modal with the full changelog when clicked.
 *
 * NOTE: This component uses localStorage for persistence. In Storybook, dismissing
 * the banner will persist across page reloads until localStorage is cleared.
 */
const meta = {
  component: ChangelogBanner,
  title: 'Components/ChangelogBanner',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    version: {
      control: 'text',
      description: 'Current version of the extension',
    },
    changelog: {
      control: 'object',
      description: 'Changelog data object with slug and markdown content',
    },
    noticeText: {
      control: false,
      description: '(Derived from locale in render)',
    },
    modalButtonLabel: {
      control: false,
      description: '(Derived from locale in render)',
    },
    modalTitle: {
      control: false,
      description: '(Derived from locale in render)',
    },
    dismissButtonLabel: {
      control: false,
      description: '(Derived from locale in render)',
    },
  },
  args: {
    version: '2.0.0',
    changelog: {
      slug: '2.0.0',
      markdown: `
        <h3>What's New</h3>
        <ul>
          <li><strong>New Feature:</strong> Added React 19 support</li>
          <li><strong>Improvement:</strong> Better performance and stability</li>
          <li><strong>Bug Fix:</strong> Fixed various UI issues</li>
        </ul>
      `,
    },
  },
} satisfies Meta<typeof ChangelogBanner>;

type Story = StoryObj<typeof meta>;

// Notice text messages
const noticeMessages = defineMessages({
  'en-US': 'Better Trading has been updated to version {version}!',
  'fr-FR': 'Better Trading a été mis à jour vers la version {version} !',
  'es-ES': '¡Better Trading se ha actualizado a la versión {version}!',
  'de-DE': 'Better Trading wurde auf Version {version} aktualisiert!',
  'pt-BR': 'Better Trading foi atualizado para a versão {version}!',
  'ru-RU': 'Better Trading обновлён до версии {version}!',
  'zh-CN': 'Better Trading 已更新至版本 {version}！',
  'ja-JP': 'Better Trading がバージョン {version} に更新されました！',
  'ko-KR': 'Better Trading이 버전 {version}(으)로 업데이트되었습니다!',
  'th-TH': 'Better Trading อัปเดตเป็นเวอร์ชัน {version} แล้ว!',
});

// Modal button label messages
const modalButtonMessages = defineMessages({
  'en-US': 'View Changelog',
  'fr-FR': 'Voir le journal des modifications',
  'es-ES': 'Ver registro de cambios',
  'de-DE': 'Änderungsprotokoll anzeigen',
  'pt-BR': 'Ver registro de alterações',
  'ru-RU': 'Посмотреть журнал изменений',
  'zh-CN': '查看更新日志',
  'ja-JP': '変更履歴を表示',
  'ko-KR': '변경 로그 보기',
  'th-TH': 'ดูบันทึกการเปลี่ยนแปลง',
});

// Modal title messages
const modalTitleMessages = defineMessages({
  'en-US': "What's new in version {version}",
  'fr-FR': 'Nouveautés de la version {version}',
  'es-ES': 'Novedades de la versión {version}',
  'de-DE': 'Neuerungen in Version {version}',
  'pt-BR': 'Novidades na versão {version}',
  'ru-RU': 'Что нового в версии {version}',
  'zh-CN': '版本 {version} 的新功能',
  'ja-JP': 'バージョン {version} の新機能',
  'ko-KR': '버전 {version}의 새로운 기능',
  'th-TH': 'มีอะไรใหม่ในเวอร์ชัน {version}',
});

// Dismiss button label messages
const dismissButtonMessages = defineMessages({
  'en-US': 'Got it!',
  'fr-FR': "C'est compris !",
  'es-ES': '¡Entendido!',
  'de-DE': 'Verstanden!',
  'pt-BR': 'Entendi!',
  'ru-RU': 'Понятно!',
  'zh-CN': '明白了！',
  'ja-JP': 'わかりました！',
  'ko-KR': '알겠습니다!',
  'th-TH': 'เข้าใจแล้ว!',
});

export const Default: Story = {
  render: (args, { globals }) => {
    const noticeTemplate = resolveLocaleValue(globals.locale as string, noticeMessages);
    const modalButtonLabel = resolveLocaleValue(globals.locale as string, modalButtonMessages);
    const modalTitleTemplate = resolveLocaleValue(globals.locale as string, modalTitleMessages);
    const dismissButtonLabel = resolveLocaleValue(globals.locale as string, dismissButtonMessages);

    return (
      <ChangelogBanner
        {...args}
        noticeText={noticeTemplate.replace('{version}', args.version)}
        modalButtonLabel={modalButtonLabel}
        modalTitle={modalTitleTemplate.replace('{version}', args.version)}
        dismissButtonLabel={dismissButtonLabel}
        data-locale={globals.locale}
      />
    );
  },
};

export const NoChangelog: Story = {
  name: 'No Changelog (Hidden)',
  args: {
    version: '2.0.0',
    changelog: undefined,
  },
  render: (args, { globals }) => {
    const noticeTemplate = resolveLocaleValue(globals.locale as string, noticeMessages);
    const modalButtonLabel = resolveLocaleValue(globals.locale as string, modalButtonMessages);
    const modalTitleTemplate = resolveLocaleValue(globals.locale as string, modalTitleMessages);
    const dismissButtonLabel = resolveLocaleValue(globals.locale as string, dismissButtonMessages);

    return (
      <div>
        <p style={{ marginBottom: 16, fontStyle: 'italic', color: '#666' }}>
          The banner is hidden when no changelog is provided.
        </p>
        <ChangelogBanner
          {...args}
          noticeText={noticeTemplate.replace('{version}', args.version)}
          modalButtonLabel={modalButtonLabel}
          modalTitle={modalTitleTemplate.replace('{version}', args.version)}
          dismissButtonLabel={dismissButtonLabel}
          data-locale={globals.locale}
        />
      </div>
    );
  },
};

export const LongChangelog: Story = {
  name: 'Long Changelog Content',
  args: {
    version: '2.0.0',
    changelog: {
      slug: '2.0.0-long',
      markdown: `
        <h3>Major Release: Version 2.0.0</h3>
        <h4>New Features</h4>
        <ul>
          <li><strong>React 19 Migration:</strong> Complete rewrite using React 19</li>
          <li><strong>TypeScript Support:</strong> Full type safety across the codebase</li>
          <li><strong>Performance:</strong> 50% faster load times</li>
          <li><strong>New UI Components:</strong> Redesigned interface with modern components</li>
          <li><strong>Dark Mode:</strong> Full dark mode support</li>
        </ul>
        <h4>Improvements</h4>
        <ul>
          <li>Better error handling and user feedback</li>
          <li>Improved accessibility (WCAG 2.1 AA compliant)</li>
          <li>Enhanced search functionality</li>
          <li>More responsive layout</li>
          <li>Reduced bundle size</li>
        </ul>
        <h4>Bug Fixes</h4>
        <ul>
          <li>Fixed crash when opening bookmarks</li>
          <li>Resolved layout issues on small screens</li>
          <li>Fixed memory leaks in background processes</li>
          <li>Corrected translation errors</li>
          <li>Fixed race conditions in data loading</li>
        </ul>
      `,
    },
  },
  render: (args, { globals }) => {
    const noticeTemplate = resolveLocaleValue(globals.locale as string, noticeMessages);
    const modalButtonLabel = resolveLocaleValue(globals.locale as string, modalButtonMessages);
    const modalTitleTemplate = resolveLocaleValue(globals.locale as string, modalTitleMessages);
    const dismissButtonLabel = resolveLocaleValue(globals.locale as string, dismissButtonMessages);

    return (
      <ChangelogBanner
        {...args}
        noticeText={noticeTemplate.replace('{version}', args.version)}
        modalButtonLabel={modalButtonLabel}
        modalTitle={modalTitleTemplate.replace('{version}', args.version)}
        dismissButtonLabel={dismissButtonLabel}
        data-locale={globals.locale}
      />
    );
  },
};

export default meta;
