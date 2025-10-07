import FormField from './index';
import { defineMessages, resolveLocaleValue } from '../../.storybook/locale-utils';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/FormField',
  component: FormField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FormField>;

type Story = StoryObj<typeof meta>;

// Locale definitions for labels, helpers, and content

const usernameLabels = defineMessages({
  'en-US': 'Username',
  'fr-FR': "Nom d'utilisateur",
  'es-ES': 'Nombre de usuario',
  'de-DE': 'Benutzername',
  'pt-BR': 'Nome de usuário',
  'ru-RU': 'Имя пользователя',
  'zh-CN': '用户名',
  'ja-JP': 'ユーザー名',
  'ko-KR': '사용자 이름',
  'th-TH': 'ชื่อผู้ใช้',
});

const emailLabels = defineMessages({
  'en-US': 'Email Address',
  'fr-FR': 'Adresse e-mail',
  'es-ES': 'Dirección de correo electrónico',
  'de-DE': 'E-Mail-Adresse',
  'pt-BR': 'Endereço de e-mail',
  'ru-RU': 'Адрес электронной почты',
  'zh-CN': '电子邮件地址',
  'ja-JP': 'メールアドレス',
  'ko-KR': '이메일 주소',
  'th-TH': 'ที่อยู่อีเมล',
});

const passwordLabels = defineMessages({
  'en-US': 'Password',
  'fr-FR': 'Mot de passe',
  'es-ES': 'Contraseña',
  'de-DE': 'Passwort',
  'pt-BR': 'Senha',
  'ru-RU': 'Пароль',
  'zh-CN': '密码',
  'ja-JP': 'パスワード',
  'ko-KR': '비밀번호',
  'th-TH': 'รหัสผ่าน',
});

const apiKeyLabels = defineMessages({
  'en-US': 'API Key',
  'fr-FR': 'Clé API',
  'es-ES': 'Clave de API',
  'de-DE': 'API-Schlüssel',
  'pt-BR': 'Chave de API',
  'ru-RU': 'Ключ API',
  'zh-CN': 'API 密钥',
  'ja-JP': 'APIキー',
  'ko-KR': 'API 키',
  'th-TH': 'คีย์ API',
});

const emailHelpers = defineMessages({
  'en-US': "We'll never share your email with anyone else.",
  'fr-FR': 'Nous ne partagerons jamais votre e-mail avec qui que ce soit.',
  'es-ES': 'Nunca compartiremos tu correo electrónico con nadie más.',
  'de-DE': 'Wir werden Ihre E-Mail niemals mit anderen teilen.',
  'pt-BR': 'Nunca compartilharemos seu e-mail com ninguém.',
  'ru-RU': 'Мы никогда не поделимся вашей электронной почтой с кем-либо еще.',
  'zh-CN': '我们永远不会与他人分享您的电子邮件。',
  'ja-JP': 'メールアドレスを他の人と共有することはありません。',
  'ko-KR': '이메일을 다른 사람과 공유하지 않습니다.',
  'th-TH': 'เราจะไม่แบ่งปันอีเมลของคุณกับผู้อื่น',
});

const passwordHelpers = defineMessages({
  'en-US': 'Must be at least 8 characters long.',
  'fr-FR': 'Doit contenir au moins 8 caractères.',
  'es-ES': 'Debe tener al menos 8 caracteres.',
  'de-DE': 'Muss mindestens 8 Zeichen lang sein.',
  'pt-BR': 'Deve ter pelo menos 8 caracteres.',
  'ru-RU': 'Должен содержать не менее 8 символов.',
  'zh-CN': '必须至少包含 8 个字符。',
  'ja-JP': '少なくとも8文字以上である必要があります。',
  'ko-KR': '최소 8자 이상이어야 합니다.',
  'th-TH': 'ต้องมีความยาวอย่างน้อย 8 ตัวอักษร',
});

const apiKeyHelpers = defineMessages({
  'en-US': 'You can generate an API key in your account settings.',
  'fr-FR': 'Vous pouvez générer une clé API dans les paramètres de votre compte.',
  'es-ES': 'Puedes generar una clave de API en la configuración de tu cuenta.',
  'de-DE': 'Sie können einen API-Schlüssel in Ihren Kontoeinstellungen generieren.',
  'pt-BR': 'Você pode gerar uma chave de API nas configurações da sua conta.',
  'ru-RU': 'Вы можете сгенерировать ключ API в настройках вашей учетной записи.',
  'zh-CN': '您可以在帐户设置中生成 API 密钥。',
  'ja-JP': 'アカウント設定でAPIキーを生成できます。',
  'ko-KR': '계정 설정에서 API 키를 생성할 수 있습니다.',
  'th-TH': 'คุณสามารถสร้างคีย์ API ในการตั้งค่าบัญชีของคุณ',
});

export const Default: Story = {
  args: {} as never,
  render: (args, { globals }) => {
    const label = resolveLocaleValue(globals.locale as string, usernameLabels);
    return (
      <FormField label={label}>
        <input type="text" placeholder={label} style={{ padding: '8px', width: '250px' }} />
      </FormField>
    );
  },
};

export const WithHelper: Story = {
  args: {} as never,
  render: (args, { globals }) => {
    const label = resolveLocaleValue(globals.locale as string, emailLabels);
    const helper = resolveLocaleValue(globals.locale as string, emailHelpers);
    return (
      <FormField label={label} helper={helper}>
        <input type="email" placeholder={label} style={{ padding: '8px', width: '250px' }} />
      </FormField>
    );
  },
};

export const PasswordField: Story = {
  args: {} as never,
  render: (args, { globals }) => {
    const label = resolveLocaleValue(globals.locale as string, passwordLabels);
    const helper = resolveLocaleValue(globals.locale as string, passwordHelpers);
    return (
      <FormField label={label} helper={helper}>
        <input type="password" placeholder={label} style={{ padding: '8px', width: '250px' }} />
      </FormField>
    );
  },
};

export const WithApiKey: Story = {
  args: {} as never,
  render: (args, { globals }) => {
    const label = resolveLocaleValue(globals.locale as string, apiKeyLabels);
    const helper = resolveLocaleValue(globals.locale as string, apiKeyHelpers);
    return (
      <FormField label={label} helper={helper}>
        <input type="text" placeholder={label} style={{ padding: '8px', width: '250px', fontFamily: 'monospace' }} />
      </FormField>
    );
  },
};

export default meta;
