import FormContainer from './index';
import { defineMessages, resolveLocaleValue } from '../../.storybook/locale-utils';
import Button from '@/components/Button';
import FormCheckbox from '@/components/FormCheckbox';
import FormInput from '@/components/FormInput';
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Components/FormContainer',
  component: FormContainer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FormContainer>;

type Story = StoryObj<typeof meta>;

// Locale definitions
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

const emailLabels = defineMessages({
  'en-US': 'Email',
  'fr-FR': 'E-mail',
  'es-ES': 'Correo electrónico',
  'de-DE': 'E-Mail',
  'pt-BR': 'E-mail',
  'ru-RU': 'Электронная почта',
  'zh-CN': '电子邮件',
  'ja-JP': 'メール',
  'ko-KR': '이메일',
  'th-TH': 'อีเมล',
});

const rememberMeLabels = defineMessages({
  'en-US': 'Remember me',
  'fr-FR': 'Se souvenir de moi',
  'es-ES': 'Recuérdame',
  'de-DE': 'Erinnere dich an mich',
  'pt-BR': 'Lembrar de mim',
  'ru-RU': 'Запомнить меня',
  'zh-CN': '记住我',
  'ja-JP': '私を覚えて',
  'ko-KR': '날 기억해',
  'th-TH': 'จำฉันไว้',
});

const termsLabels = defineMessages({
  'en-US': 'I agree to the terms and conditions',
  'fr-FR': "J'accepte les termes et conditions",
  'es-ES': 'Acepto los términos y condiciones',
  'de-DE': 'Ich stimme den Geschäftsbedingungen zu',
  'pt-BR': 'Eu concordo com os termos e condições',
  'ru-RU': 'Я согласен с условиями и положениями',
  'zh-CN': '我同意条款和条件',
  'ja-JP': '利用規約に同意します',
  'ko-KR': '이용 약관에 동의합니다',
  'th-TH': 'ฉันยอมรับข้อกำหนดและเงื่อนไข',
});

const submitButtonLabels = defineMessages({
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

const loginButtonLabels = defineMessages({
  'en-US': 'Login',
  'fr-FR': 'Connexion',
  'es-ES': 'Iniciar sesión',
  'de-DE': 'Anmelden',
  'pt-BR': 'Entrar',
  'ru-RU': 'Войти',
  'zh-CN': '登录',
  'ja-JP': 'ログイン',
  'ko-KR': '로그인',
  'th-TH': 'เข้าสู่ระบบ',
});

const registerButtonLabels = defineMessages({
  'en-US': 'Register',
  'fr-FR': "S'inscrire",
  'es-ES': 'Registrarse',
  'de-DE': 'Registrieren',
  'pt-BR': 'Registrar',
  'ru-RU': 'Зарегистрироваться',
  'zh-CN': '注册',
  'ja-JP': '登録',
  'ko-KR': '등록',
  'th-TH': 'ลงทะเบียน',
});

// Wrapper components to handle state
const LoginFormWrapper = ({ locale }: { locale: string }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const usernameLabel = resolveLocaleValue(locale, usernameLabels);
  const passwordLabel = resolveLocaleValue(locale, passwordLabels);
  const rememberLabel = resolveLocaleValue(locale, rememberMeLabels);
  const submitLabel = resolveLocaleValue(locale, loginButtonLabels);

  const handleSubmit = () => {
    alert(`Login: ${username} / ${password} (Remember: ${remember})`);
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormInput label={usernameLabel} value={username} onChange={setUsername} />
      <FormInput label={passwordLabel} value={password} onChange={setPassword} type="password" />
      <FormCheckbox label={rememberLabel} value={remember} onChange={setRemember} />
      <Button label={submitLabel} type="submit" theme="gold" />
    </FormContainer>
  );
};

const RegistrationFormWrapper = ({ locale }: { locale: string }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [terms, setTerms] = useState(false);

  const usernameLabel = resolveLocaleValue(locale, usernameLabels);
  const emailLabel = resolveLocaleValue(locale, emailLabels);
  const passwordLabel = resolveLocaleValue(locale, passwordLabels);
  const termsLabel = resolveLocaleValue(locale, termsLabels);
  const submitLabel = resolveLocaleValue(locale, registerButtonLabels);

  const handleSubmit = () => {
    alert(`Register: ${username} / ${email} / ${password} (Terms: ${terms})`);
  };

  return (
    <FormContainer onSubmit={handleSubmit} canSubmit={terms}>
      <FormInput label={usernameLabel} value={username} onChange={setUsername} />
      <FormInput label={emailLabel} value={email} onChange={setEmail} type="email" />
      <FormInput label={passwordLabel} value={password} onChange={setPassword} type="password" />
      <FormCheckbox label={termsLabel} value={terms} onChange={setTerms} />
      <Button label={submitLabel} type="submit" theme={terms ? 'gold' : 'blue'} />
    </FormContainer>
  );
};

const DisabledFormWrapper = ({ locale }: { locale: string }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const usernameLabel = resolveLocaleValue(locale, usernameLabels);
  const passwordLabel = resolveLocaleValue(locale, passwordLabels);
  const submitLabel = resolveLocaleValue(locale, submitButtonLabels);

  const handleSubmit = () => {
    alert('This should not be called');
  };

  return (
    <FormContainer onSubmit={handleSubmit} canSubmit={false}>
      <FormInput label={usernameLabel} value={username} onChange={setUsername} />
      <FormInput label={passwordLabel} value={password} onChange={setPassword} type="password" />
      <Button label={submitLabel} type="submit" theme="gold" />
    </FormContainer>
  );
};

const SimpleFormWrapper = ({ locale }: { locale: string }) => {
  const [email, setEmail] = useState('');

  const emailLabel = resolveLocaleValue(locale, emailLabels);
  const submitLabel = resolveLocaleValue(locale, submitButtonLabels);

  const handleSubmit = () => {
    alert(`Email: ${email}`);
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormInput label={emailLabel} value={email} onChange={setEmail} type="email" />
      <Button label={submitLabel} type="submit" theme="blue" />
    </FormContainer>
  );
};

export const LoginForm: Story = {
  args: {} as never,
  render: (args, { globals }) => <LoginFormWrapper locale={globals.locale as string} />,
};

export const RegistrationForm: Story = {
  args: {} as never,
  render: (args, { globals }) => <RegistrationFormWrapper locale={globals.locale as string} />,
};

export const DisabledForm: Story = {
  args: {} as never,
  render: (args, { globals }) => <DisabledFormWrapper locale={globals.locale as string} />,
};

export const SimpleForm: Story = {
  args: {} as never,
  render: (args, { globals }) => <SimpleFormWrapper locale={globals.locale as string} />,
};

export default meta;
