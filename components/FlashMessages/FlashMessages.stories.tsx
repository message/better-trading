import FlashMessages from './index.tsx';
import { defineMessages, resolveLocaleValue } from '../../.storybook/locale-utils';
import { useState } from 'react';
import type { FlashMessage } from './types';
import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * FlashMessages displays a stack of dismissable notification messages positioned at the bottom-right.
 *
 * Clicking any message triggers the onDismiss callback. Messages can have an `exiting` state
 * for fade-out animations.
 */
const meta = {
  component: FlashMessages,
  title: 'Components/FlashMessages',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A notification system that displays flash messages in the bottom-right corner. Messages slide in and can be dismissed with a click.',
      },
    },
  },
  argTypes: {
    flashMessages: {
      control: false,
      description: 'Array of flash messages to display',
    },
    onDismiss: {
      control: false,
      description: 'Callback fired when a message is clicked',
    },
  },
  args: {
    flashMessages: [],
  },
} satisfies Meta<typeof FlashMessages>;

type Story = StoryObj<typeof meta>;

const STORYBOOK_WRAPPER_STYLE = {
  position: 'relative' as const,
  width: '100%',
  height: '250px',
  background: '#1a1a1a',
};

// Success message
const successMessages = defineMessages({
  'en-US': 'Successfully saved your changes!',
  'fr-FR': 'Modifications enregistrées avec succès !',
  'es-ES': '¡Cambios guardados exitosamente!',
  'de-DE': 'Änderungen erfolgreich gespeichert!',
  'pt-BR': 'Alterações salvas com sucesso!',
  'ru-RU': 'Изменения успешно сохранены!',
  'zh-CN': '成功保存更改！',
  'ja-JP': '変更が正常に保存されました！',
  'ko-KR': '변경사항이 성공적으로 저장되었습니다!',
  'th-TH': 'บันทึกการเปลี่ยนแปลงสำเร็จแล้ว!',
});

const Success: Story = {
  args: {},
  render: (args, { globals }) => {
    const message = resolveLocaleValue(globals.locale as string, successMessages);
    const [messages, setMessages] = useState<FlashMessage[]>([{ id: '1', type: 'success', message }]);

    return (
      <div style={STORYBOOK_WRAPPER_STYLE}>
        <FlashMessages
          {...args}
          flashMessages={messages}
          onDismiss={flash => {
            setMessages(prev => prev.filter(m => m.id !== flash.id));
          }}
        />
      </div>
    );
  },
};

// Warning message
const warningMessages = defineMessages({
  'en-US': 'Please review your input before proceeding.',
  'fr-FR': 'Veuillez vérifier votre saisie avant de continuer.',
  'es-ES': 'Revisa tu entrada antes de continuar.',
  'de-DE': 'Bitte überprüfen Sie Ihre Eingabe, bevor Sie fortfahren.',
  'pt-BR': 'Revise sua entrada antes de prosseguir.',
  'ru-RU': 'Пожалуйста, проверьте ввод перед продолжением.',
  'zh-CN': '请在继续之前检查您的输入。',
  'ja-JP': '続行する前に入力内容を確認してください。',
  'ko-KR': '계속하기 전에 입력을 확인하세요.',
  'th-TH': 'โปรดตรวจสอบข้อมูลที่กรอกก่อนดำเนินการต่อ',
});

const Warning: Story = {
  args: {},
  render: (args, { globals }) => {
    const message = resolveLocaleValue(globals.locale as string, warningMessages);
    const [messages, setMessages] = useState<FlashMessage[]>([{ id: '1', type: 'warning', message }]);

    return (
      <div style={STORYBOOK_WRAPPER_STYLE}>
        <FlashMessages
          {...args}
          flashMessages={messages}
          onDismiss={flash => {
            setMessages(prev => prev.filter(m => m.id !== flash.id));
          }}
        />
      </div>
    );
  },
};

// Alert message
const alertMessages = defineMessages({
  'en-US': 'An error occurred. Please try again.',
  'fr-FR': 'Une erreur est survenue. Veuillez réessayer.',
  'es-ES': 'Ocurrió un error. Inténtalo de nuevo.',
  'de-DE': 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
  'pt-BR': 'Ocorreu um erro. Tente novamente.',
  'ru-RU': 'Произошла ошибка. Повторите попытку.',
  'zh-CN': '发生错误。请重试。',
  'ja-JP': 'エラーが発生しました。もう一度お試しください。',
  'ko-KR': '오류가 발생했습니다. 다시 시도하세요.',
  'th-TH': 'เกิดข้อผิดพลาด โปรดลองอีกครั้ง',
});

const Alert: Story = {
  args: {},
  render: (args, { globals }) => {
    const message = resolveLocaleValue(globals.locale as string, alertMessages);
    const [messages, setMessages] = useState<FlashMessage[]>([{ id: '1', type: 'alert', message }]);

    return (
      <div style={STORYBOOK_WRAPPER_STYLE}>
        <FlashMessages
          {...args}
          flashMessages={messages}
          onDismiss={flash => {
            setMessages(prev => prev.filter(m => m.id !== flash.id));
          }}
        />
      </div>
    );
  },
};

// Multiple messages
const multipleMessage1 = defineMessages({
  'en-US': 'Your profile has been updated.',
  'fr-FR': 'Votre profil a été mis à jour.',
  'es-ES': 'Tu perfil ha sido actualizado.',
  'de-DE': 'Ihr Profil wurde aktualisiert.',
  'pt-BR': 'Seu perfil foi atualizado.',
  'ru-RU': 'Ваш профиль обновлён.',
  'zh-CN': '您的个人资料已更新。',
  'ja-JP': 'プロフィールが更新されました。',
  'ko-KR': '프로필이 업데이트되었습니다.',
  'th-TH': 'อัปเดตโปรไฟล์ของคุณแล้ว',
});

const multipleMessage2 = defineMessages({
  'en-US': 'Remember to verify your email address.',
  'fr-FR': "N'oubliez pas de vérifier votre adresse e-mail.",
  'es-ES': 'Recuerda verificar tu dirección de correo electrónico.',
  'de-DE': 'Vergessen Sie nicht, Ihre E-Mail-Adresse zu bestätigen.',
  'pt-BR': 'Lembre-se de verificar seu endereço de e-mail.',
  'ru-RU': 'Не забудьте подтвердить ваш адрес электронной почты.',
  'zh-CN': '请记得验证您的电子邮件地址。',
  'ja-JP': 'メールアドレスを確認してください。',
  'ko-KR': '이메일 주소를 확인하세요.',
  'th-TH': 'อย่าลืมยืนยันที่อยู่อีเมลของคุณ',
});

const multipleMessage3 = defineMessages({
  'en-US': 'New features are available!',
  'fr-FR': 'De nouvelles fonctionnalités sont disponibles !',
  'es-ES': '¡Nuevas funciones disponibles!',
  'de-DE': 'Neue Funktionen sind verfügbar!',
  'pt-BR': 'Novos recursos disponíveis!',
  'ru-RU': 'Доступны новые функции!',
  'zh-CN': '新功能现已可用！',
  'ja-JP': '新機能が利用可能です！',
  'ko-KR': '새로운 기능을 사용할 수 있습니다!',
  'th-TH': 'มีฟีเจอร์ใหม่แล้ว!',
});

const MultipleMessages: Story = {
  name: 'Multiple Messages',
  args: {},
  render: (args, { globals }) => {
    const msg1 = resolveLocaleValue(globals.locale as string, multipleMessage1);
    const msg2 = resolveLocaleValue(globals.locale as string, multipleMessage2);
    const msg3 = resolveLocaleValue(globals.locale as string, multipleMessage3);

    const [messages, setMessages] = useState<FlashMessage[]>([
      { id: '1', type: 'success', message: msg1 },
      { id: '2', type: 'warning', message: msg2 },
      { id: '3', type: 'alert', message: msg3 },
    ]);

    return (
      <div style={STORYBOOK_WRAPPER_STYLE}>
        <FlashMessages
          {...args}
          flashMessages={messages}
          onDismiss={flash => {
            setMessages(prev => prev.filter(m => m.id !== flash.id));
          }}
        />
      </div>
    );
  },
};

// With exiting animation
const exitingMessage1 = defineMessages({
  'en-US': 'This message will fade out when clicked.',
  'fr-FR': 'Ce message disparaîtra en fondu lorsque vous cliquerez dessus.',
  'es-ES': 'Este mensaje se desvanecerá al hacer clic.',
  'de-DE': 'Diese Nachricht wird beim Klicken ausgeblendet.',
  'pt-BR': 'Esta mensagem desaparecerá quando clicada.',
  'ru-RU': 'Это сообщение исчезнет при нажатии.',
  'zh-CN': '单击时此消息将淡出。',
  'ja-JP': 'クリックするとこのメッセージはフェードアウトします。',
  'ko-KR': '클릭하면 이 메시지가 페이드아웃됩니다.',
  'th-TH': 'ข้อความนี้จะค่อยๆ หายไปเมื่อคลิก',
});

const exitingMessage2 = defineMessages({
  'en-US': 'Click to dismiss',
  'fr-FR': 'Cliquer pour fermer',
  'es-ES': 'Haz clic para cerrar',
  'de-DE': 'Zum Schließen klicken',
  'pt-BR': 'Clique para dispensar',
  'ru-RU': 'Нажмите, чтобы закрыть',
  'zh-CN': '点击关闭',
  'ja-JP': 'クリックして閉じる',
  'ko-KR': '클릭하여 닫기',
  'th-TH': 'คลิกเพื่อปิด',
});

const WithExitingAnimation: Story = {
  name: 'With Exiting Animation',
  args: {},
  render: (args, { globals }) => {
    const msg1 = resolveLocaleValue(globals.locale as string, exitingMessage1);
    const msg2 = resolveLocaleValue(globals.locale as string, exitingMessage2);

    const [messages, setMessages] = useState<FlashMessage[]>([
      { id: '1', type: 'success', message: msg1 },
      { id: '2', type: 'warning', message: msg2 },
    ]);

    return (
      <div style={STORYBOOK_WRAPPER_STYLE}>
        <FlashMessages
          {...args}
          flashMessages={messages}
          onDismiss={flash => {
            // Mark as exiting first, then remove after animation
            setMessages(prev => prev.map(m => (m.id === flash.id ? { ...m, exiting: true } : m)));
            setTimeout(() => {
              setMessages(prev => prev.filter(m => m.id !== flash.id));
            }, 200); // Match transition duration
          }}
        />
      </div>
    );
  },
};

// Long message content
const longMessages = defineMessages({
  'en-US':
    'This is a longer notification message that demonstrates how the component handles multi-line text. The message will wrap appropriately within the maximum width constraint.',
  'fr-FR':
    'Ceci est un message de notification plus long qui démontre comment le composant gère le texte sur plusieurs lignes. Le message sera enveloppé de manière appropriée dans la contrainte de largeur maximale.',
  'es-ES':
    'Este es un mensaje de notificación más largo que demuestra cómo el componente maneja el texto de varias líneas. El mensaje se ajustará apropiadamente dentro de la restricción de ancho máximo.',
  'de-DE':
    'Dies ist eine längere Benachrichtigungsmeldung, die zeigt, wie die Komponente mehrzeiligen Text behandelt. Die Nachricht wird innerhalb der maximalen Breitenbeschränkung angemessen umbrochen.',
  'pt-BR':
    'Esta é uma mensagem de notificação mais longa que demonstra como o componente lida com texto de várias linhas. A mensagem será quebrada adequadamente dentro da restrição de largura máxima.',
  'ru-RU':
    'Это более длинное уведомление, демонстрирующее, как компонент обрабатывает многострочный текст. Сообщение будет правильно переноситься в пределах максимальной ширины.',
  'zh-CN': '这是一个较长的通知消息，演示了组件如何处理多行文本。消息将在最大宽度约束内适当换行。',
  'ja-JP':
    'これは、コンポーネントが複数行のテキストをどのように処理するかを示す長い通知メッセージです。メッセージは最大幅の制約内で適切に折り返されます。',
  'ko-KR':
    '이것은 컴포넌트가 여러 줄 텍스트를 처리하는 방법을 보여주는 긴 알림 메시지입니다. 메시지는 최대 너비 제약 내에서 적절하게 줄 바꿈됩니다.',
  'th-TH':
    'นี่คือข้อความแจ้งเตือนที่ยาวขึ้นซึ่งแสดงให้เห็นว่าคอมโพเนนต์จัดการข้อความหลายบรรทัดอย่างไร ข้อความจะตัดบรรทัดอย่างเหมาะสมภายในข้อจำกัดความกว้างสูงสุด',
});

const LongMessage: Story = {
  name: 'Long Message',
  args: {},
  render: (args, { globals }) => {
    const message = resolveLocaleValue(globals.locale as string, longMessages);
    const [messages, setMessages] = useState<FlashMessage[]>([{ id: '1', type: 'warning', message }]);

    return (
      <div style={STORYBOOK_WRAPPER_STYLE}>
        <FlashMessages
          {...args}
          flashMessages={messages}
          onDismiss={flash => {
            setMessages(prev => prev.filter(m => m.id !== flash.id));
          }}
        />
      </div>
    );
  },
};

export default meta;
export { Success, Warning, Alert, MultipleMessages, WithExitingAnimation, LongMessage };
