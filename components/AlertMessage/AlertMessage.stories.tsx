import AlertMessage from './index.tsx';
import { defineMessages, resolveLocaleValue } from '../../.storybook/locale-utils';
import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * AlertMessage displays a short status or warning block with an icon.
 *
 * NOTE: The `message` prop is rendered via `dangerouslySetInnerHTML`, so only pass
 * trusted / sanitized HTML. In normal application code you should sanitize user-provided
 * content before passing it here.
 */
const meta = {
  component: AlertMessage,
  title: 'Components/AlertMessage',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    type: {
      control: { type: 'radio' },
      options: ['success', 'warning', 'alert'],
      description: 'Visual style / intent of the alert.',
    },
    message: {
      control: false,
      description: '(Derived from locale in render).',
    },
  },
  // Provide placeholder message to satisfy required prop typing; real value set in render.
  args: { type: 'success', message: '' },
} satisfies Meta<typeof AlertMessage>;

type Story = StoryObj<typeof meta>;

// SUCCESS messages
const successMessages = defineMessages({
  'en-US': 'Everything went smoothly!',
  'fr-FR': "Tout s'est bien passé !",
  'es-ES': '¡Todo salió bien!',
  'de-DE': 'Alles hat reibungslos funktioniert!',
  'pt-BR': 'Tudo correu bem!',
  'ru-RU': 'Все прошло гладко!',
  'ja-JP': 'すべて順調に完了しました！',
  'ko-KR': '모든 것이 순조롭게 진행되었어요!',
  'th-TH': 'ทุกอย่างราบรื่นดี!',
});
const Success: Story = {
  args: { type: 'success', message: '' },
  render: (args, { globals }) => {
    const message = resolveLocaleValue(globals.locale as string, successMessages);
    return <AlertMessage {...args} message={message} data-locale={globals.locale} />;
  },
};

// WARNING messages
const warningMessages = defineMessages({
  'en-US': 'Be careful – double check your input.',
  'fr-FR': 'Faites attention – vérifiez votre saisie.',
  'es-ES': 'Ten cuidado: revisa tu entrada.',
  'de-DE': 'Vorsicht – prüfen Sie Ihre Eingabe.',
  'pt-BR': 'Cuidado – confira sua entrada.',
  'ru-RU': 'Будьте внимательны — проверьте ввод.',
  'ja-JP': '注意してください — 入力内容を再確認してください。',
  'ko-KR': '주의하세요 — 입력을 다시 한번 확인하세요.',
  'th-TH': 'โปรดระวัง — ตรวจสอบข้อมูลที่กรอกอีกครั้ง',
});
const Warning: Story = {
  args: { type: 'warning', message: '' },
  render: (args, { globals }) => {
    const message = resolveLocaleValue(globals.locale as string, warningMessages);
    return <AlertMessage {...args} message={message} data-locale={globals.locale} />;
  },
};

// ALERT messages
const alertMessages = defineMessages({
  'en-US': 'Something went wrong. Please retry.',
  'fr-FR': 'Un problème est survenu. Réessayez.',
  'es-ES': 'Algo salió mal. Inténtalo de nuevo.',
  'de-DE': 'Etwas ist schiefgelaufen. Bitte erneut versuchen.',
  'pt-BR': 'Algo deu errado. Tente novamente.',
  'ru-RU': 'Что-то пошло не так. Повторите попытку.',
  'zh-CN': '出错了。请重试。',
  'ja-JP': '問題が発生しました。再試行してください。',
  'ko-KR': '문제가 발생했습니다. 다시 시도해주세요.',
  'th-TH': 'เกิดข้อผิดพลาด โปรดลองอีกครั้ง',
});
const Alert: Story = {
  args: { type: 'alert', message: '' },
  render: (args, { globals }) => {
    const message = resolveLocaleValue(globals.locale as string, alertMessages);
    return <AlertMessage {...args} message={message} data-locale={globals.locale} />;
  },
};

// HTML messages
const htmlMessages = defineMessages({
  'en-US':
    "<strong>Heads up:</strong> You can include <em>formatted</em> text and <a href='#' onclick='return false;'>links</a>.",
  'fr-FR':
    "<strong>Attention :</strong> Vous pouvez inclure du texte <em>formaté</em> et des <a href='#' onclick='return false;'>liens</a>.",
  'es-ES':
    "<strong>Atención:</strong> Puedes incluir texto <em>formateado</em> y <a href='#' onclick='return false;'>enlaces</a>.",
  'de-DE':
    "<strong>Achtung:</strong> Sie können <em>formatierten</em> Text und <a href='#' onclick='return false;'>Links</a> einfügen.",
  'pt-BR':
    "<strong>Atenção:</strong> Você pode incluir texto <em>formatado</em> e <a href='#' onclick='return false;'>links</a>.",
  'ru-RU':
    "<strong>Внимание:</strong> Можно включить <em>форматированный</em> текст и <a href='#' onclick='return false;'>ссылки</a>.",
  'ja-JP':
    "<strong>注意:</strong> <em>書式付き</em>テキストや<a href='#' onclick='return false;'>リンク</a>を含められます。",
  'ko-KR':
    "<strong>알림:</strong> <em>서식 있는</em> 텍스트와 <a href='#' onclick='return false;'>링크</a>를 포함할 수 있습니다.",
  'th-TH':
    "<strong>แจ้งเตือน:</strong> คุณสามารถใส่ข้อความที่มี<em>รูปแบบ</em> และ <a href='#' onclick='return false;'>ลิงก์</a> ได้",
});
const WithHTML: Story = {
  name: 'With HTML Content',
  args: { type: 'warning', message: '' },
  parameters: {
    docs: { description: { story: 'Localized HTML content based on selected locale.' } },
  },
  render: (args, { globals }) => {
    const message = resolveLocaleValue(globals.locale as string, htmlMessages);
    return <AlertMessage {...args} message={message} data-locale={globals.locale} />;
  },
};

export default meta;
export { Success, Warning, Alert, WithHTML };
