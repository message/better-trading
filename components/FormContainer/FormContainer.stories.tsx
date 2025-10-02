import FormContainer from './index';
import { defineMessages, resolveLocaleValue } from '../../.storybook/locale-utils';
import Button from '../Button';
import FormCheckbox from '../FormCheckbox';
import FormInput from '../FormInput';
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * FormContainer wraps form elements and handles submission.
 */
const meta = {
  component: FormContainer,
  title: 'Components/FormContainer',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    onSubmit: {
      control: false,
      description: 'Submit handler',
    },
    canSubmit: {
      control: 'boolean',
      description: 'Whether form can be submitted',
    },
    entity: {
      control: false,
      description: 'Entity object to submit',
    },
    children: {
      control: false,
      description: 'Form elements',
    },
  },
} satisfies Meta<typeof FormContainer>;

type Story = StoryObj<typeof meta>;

const usernameLabelMessages = defineMessages({
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

const emailLabelMessages = defineMessages({
  'en-US': 'Email',
  'fr-FR': 'E-mail',
  'es-ES': 'Correo electrónico',
  'de-DE': 'E-Mail',
  'pt-BR': 'E-mail',
  'ru-RU': 'Эл. почта',
  'zh-CN': '电子邮件',
  'ja-JP': 'メール',
  'ko-KR': '이메일',
  'th-TH': 'อีเมล',
});

const rememberMeMessages = defineMessages({
  'en-US': 'Remember me',
  'fr-FR': 'Se souvenir de moi',
  'es-ES': 'Recuérdame',
  'de-DE': 'Angemeldet bleiben',
  'pt-BR': 'Lembre-se de mim',
  'ru-RU': 'Запомнить меня',
  'zh-CN': '记住我',
  'ja-JP': 'ログイン状態を保持',
  'ko-KR': '로그인 상태 유지',
  'th-TH': 'จดจำฉัน',
});

const submitButtonMessages = defineMessages({
  'en-US': 'Submit',
  'fr-FR': 'Soumettre',
  'es-ES': 'Enviar',
  'de-DE': 'Absenden',
  'pt-BR': 'Enviar',
  'ru-RU': 'Отправить',
  'zh-CN': '提交',
  'ja-JP': '送信',
  'ko-KR': '제출',
  'th-TH': 'ส่ง',
});

const loginButtonMessages = defineMessages({
  'en-US': 'Log In',
  'fr-FR': 'Se connecter',
  'es-ES': 'Iniciar sesión',
  'de-DE': 'Anmelden',
  'pt-BR': 'Entrar',
  'ru-RU': 'Войти',
  'zh-CN': '登录',
  'ja-JP': 'ログイン',
  'ko-KR': '로그인',
  'th-TH': 'เข้าสู่ระบบ',
});

const submittedMessages = defineMessages({
  'en-US': 'Form submitted!',
  'fr-FR': 'Formulaire soumis !',
  'es-ES': '¡Formulario enviado!',
  'de-DE': 'Formular gesendet!',
  'pt-BR': 'Formulário enviado!',
  'ru-RU': 'Форма отправлена!',
  'zh-CN': '表单已提交！',
  'ja-JP': 'フォームが送信されました！',
  'ko-KR': '양식이 제출되었습니다!',
  'th-TH': 'ส่งแบบฟอร์มแล้ว!',
});

const DefaultStory = (_args: unknown, { globals }: { globals: { locale: string } }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const usernameLabel = resolveLocaleValue(globals.locale as string, usernameLabelMessages);
  const emailLabel = resolveLocaleValue(globals.locale as string, emailLabelMessages);
  const submitLabel = resolveLocaleValue(globals.locale as string, submitButtonMessages);
  const submittedMessage = resolveLocaleValue(globals.locale as string, submittedMessages);

  const handleSubmit = (entity: unknown) => {
    console.log('Submit:', entity);
    alert(submittedMessage);
  };

  return (
    <FormContainer onSubmit={handleSubmit} entity={{ username, email }} style={{ width: '400px' }}>
      <FormInput label={usernameLabel} value={username} onChange={setUsername} />
      <FormInput label={emailLabel} value={email} onChange={setEmail} />
      <Button type="submit" theme="blue" label={submitLabel} />
    </FormContainer>
  );
};

const WithCheckboxStory = (_args: unknown, { globals }: { globals: { locale: string } }) => {
  const [username, setUsername] = useState('');
  const [remember, setRemember] = useState(false);

  const usernameLabel = resolveLocaleValue(globals.locale as string, usernameLabelMessages);
  const rememberLabel = resolveLocaleValue(globals.locale as string, rememberMeMessages);
  const loginLabel = resolveLocaleValue(globals.locale as string, loginButtonMessages);
  const submittedMessage = resolveLocaleValue(globals.locale as string, submittedMessages);

  const handleSubmit = (entity: unknown) => {
    console.log('Submit:', entity);
    alert(submittedMessage);
  };

  return (
    <FormContainer onSubmit={handleSubmit} entity={{ username, remember }} style={{ width: '400px' }}>
      <FormInput label={usernameLabel} value={username} onChange={setUsername} />
      <FormCheckbox label={rememberLabel} value={remember} onChange={setRemember} />
      <Button type="submit" theme="blue" label={loginLabel} />
    </FormContainer>
  );
};

const DisabledStory = (_args: unknown, { globals }: { globals: { locale: string } }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const usernameLabel = resolveLocaleValue(globals.locale as string, usernameLabelMessages);
  const emailLabel = resolveLocaleValue(globals.locale as string, emailLabelMessages);
  const submitLabel = resolveLocaleValue(globals.locale as string, submitButtonMessages);
  const submittedMessage = resolveLocaleValue(globals.locale as string, submittedMessages);

  const handleSubmit = (entity: unknown) => {
    console.log('Submit:', entity);
    alert(submittedMessage);
  };

  return (
    <FormContainer onSubmit={handleSubmit} entity={{ username, email }} canSubmit={false} style={{ width: '400px' }}>
      <FormInput label={usernameLabel} value={username} onChange={setUsername} />
      <FormInput label={emailLabel} value={email} onChange={setEmail} />
      <Button type="submit" theme="blue" label={submitLabel} />
    </FormContainer>
  );
};

export const Default: Story = {
  render: DefaultStory,
};

export const WithCheckbox: Story = {
  render: WithCheckboxStory,
};

export const Disabled: Story = {
  render: DisabledStory,
};

export default meta;
