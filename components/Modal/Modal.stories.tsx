import Modal from './index';
import Button from '../Button';
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

// Helper types for localized messages
interface LocalizedMessages {
  'en-US': string;
  'fr-FR': string;
  'es-ES': string;
  'de-DE': string;
  'pt-BR': string;
  'ru-RU': string;
  'zh-CN': string;
  'ja-JP': string;
  'ko-KR': string;
  'th-TH': string;
}

type DefineMessages = (messages: LocalizedMessages) => LocalizedMessages;

const defineMessages: DefineMessages = messages => messages;

const resolveLocaleValue = (locale: string, messages: LocalizedMessages): string =>
  messages[locale as keyof LocalizedMessages] || messages['en-US'];

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

type Story = StoryObj<typeof Modal>;

// Localized messages
const openModalButtonLabels = defineMessages({
  'en-US': 'Open Modal',
  'fr-FR': 'Ouvrir la modale',
  'es-ES': 'Abrir modal',
  'de-DE': 'Modal öffnen',
  'pt-BR': 'Abrir modal',
  'ru-RU': 'Открыть модальное окно',
  'zh-CN': '打开模态框',
  'ja-JP': 'モーダルを開く',
  'ko-KR': '모달 열기',
  'th-TH': 'เปิดโมดอล',
});

const basicTitles = defineMessages({
  'en-US': 'Basic Modal',
  'fr-FR': 'Modale de base',
  'es-ES': 'Modal básico',
  'de-DE': 'Basis-Modal',
  'pt-BR': 'Modal básico',
  'ru-RU': 'Базовое модальное окно',
  'zh-CN': '基本模态框',
  'ja-JP': '基本モーダル',
  'ko-KR': '기본 모달',
  'th-TH': 'โมดอลพื้นฐาน',
});

const basicContents = defineMessages({
  'en-US': 'This is a basic modal with some content.',
  'fr-FR': 'Ceci est une modale de base avec du contenu.',
  'es-ES': 'Este es un modal básico con algo de contenido.',
  'de-DE': 'Dies ist ein einfaches Modal mit etwas Inhalt.',
  'pt-BR': 'Este é um modal básico com algum conteúdo.',
  'ru-RU': 'Это базовое модальное окно с некоторым содержимым.',
  'zh-CN': '这是一个带有一些内容的基本模态框。',
  'ja-JP': 'これは基本的なモーダルで、いくつかのコンテンツがあります。',
  'ko-KR': '이것은 일부 콘텐츠가 있는 기본 모달입니다.',
  'th-TH': 'นี่คือโมดอลพื้นฐานที่มีเนื้อหาบางส่วน',
});

const withFormTitles = defineMessages({
  'en-US': 'Modal with Form',
  'fr-FR': 'Modale avec formulaire',
  'es-ES': 'Modal con formulario',
  'de-DE': 'Modal mit Formular',
  'pt-BR': 'Modal com formulário',
  'ru-RU': 'Модальное окно с формой',
  'zh-CN': '带表单的模态框',
  'ja-JP': 'フォーム付きモーダル',
  'ko-KR': '폼이 있는 모달',
  'th-TH': 'โมดอลพร้อมฟอร์ม',
});

const nameLabels = defineMessages({
  'en-US': 'Name:',
  'fr-FR': 'Nom :',
  'es-ES': 'Nombre:',
  'de-DE': 'Name:',
  'pt-BR': 'Nome:',
  'ru-RU': 'Имя:',
  'zh-CN': '姓名：',
  'ja-JP': '名前：',
  'ko-KR': '이름:',
  'th-TH': 'ชื่อ:',
});

const emailLabels = defineMessages({
  'en-US': 'Email:',
  'fr-FR': 'E-mail :',
  'es-ES': 'Correo electrónico:',
  'de-DE': 'E-Mail:',
  'pt-BR': 'E-mail:',
  'ru-RU': 'Эл. почта:',
  'zh-CN': '电子邮件：',
  'ja-JP': 'メール：',
  'ko-KR': '이메일:',
  'th-TH': 'อีเมล:',
});

const submitLabels = defineMessages({
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

const cancelLabels = defineMessages({
  'en-US': 'Cancel',
  'fr-FR': 'Annuler',
  'es-ES': 'Cancelar',
  'de-DE': 'Abbrechen',
  'pt-BR': 'Cancelar',
  'ru-RU': 'Отмена',
  'zh-CN': '取消',
  'ja-JP': 'キャンセル',
  'ko-KR': '취소',
  'th-TH': 'ยกเลิก',
});

const longContentTitles = defineMessages({
  'en-US': 'Modal with Long Content',
  'fr-FR': 'Modale avec contenu long',
  'es-ES': 'Modal con contenido largo',
  'de-DE': 'Modal mit langem Inhalt',
  'pt-BR': 'Modal com conteúdo longo',
  'ru-RU': 'Модальное окно с длинным содержимым',
  'zh-CN': '带长内容的模态框',
  'ja-JP': '長いコンテンツのモーダル',
  'ko-KR': '긴 콘텐츠가 있는 모달',
  'th-TH': 'โมดอลที่มีเนื้อหายาว',
});

const loremIpsumContents = defineMessages({
  'en-US':
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  'fr-FR':
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. (C'est un texte d'exemple en français.)",
  'es-ES':
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. (Este es un texto de ejemplo en español.)',
  'de-DE':
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. (Dies ist ein Beispieltext auf Deutsch.)',
  'pt-BR':
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. (Este é um texto de exemplo em português.)',
  'ru-RU':
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. (Это пример текста на русском языке.)',
  'zh-CN':
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. （这是中文的示例文本。）',
  'ja-JP':
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. （これは日本語のサンプルテキストです。）',
  'ko-KR':
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. (이것은 한국어 샘플 텍스트입니다.)',
  'th-TH':
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. (นี่คือข้อความตัวอย่างภาษาไทย)',
});

const customStyledTitles = defineMessages({
  'en-US': 'Custom Styled Modal',
  'fr-FR': 'Modale avec style personnalisé',
  'es-ES': 'Modal con estilo personalizado',
  'de-DE': 'Modal mit benutzerdefiniertem Stil',
  'pt-BR': 'Modal com estilo personalizado',
  'ru-RU': 'Модальное окно с пользовательским стилем',
  'zh-CN': '自定义样式模态框',
  'ja-JP': 'カスタムスタイルのモーダル',
  'ko-KR': '맞춤 스타일 모달',
  'th-TH': 'โมดอลสไตล์กำหนดเอง',
});

const customStyledContents = defineMessages({
  'en-US': 'This modal has a custom className applied to it.',
  'fr-FR': 'Cette modale a un className personnalisé appliqué.',
  'es-ES': 'Este modal tiene un className personalizado aplicado.',
  'de-DE': 'Dieses Modal hat einen benutzerdefinierten className angewendet.',
  'pt-BR': 'Este modal tem um className personalizado aplicado.',
  'ru-RU': 'К этому модальному окну применен пользовательский className.',
  'zh-CN': '此模态框应用了自定义 className。',
  'ja-JP': 'このモーダルにはカスタム className が適用されています。',
  'ko-KR': '이 모달에는 맞춤 className이 적용되어 있습니다.',
  'th-TH': 'โมดอลนี้มีการใช้ className แบบกำหนดเอง',
});

// Story: Basic Modal
export const Basic: Story = {
  render: (args, { globals }) => {
    const [isOpen, setIsOpen] = useState(false);
    const title = resolveLocaleValue(globals.locale as string, basicTitles);
    const content = resolveLocaleValue(globals.locale as string, basicContents);
    const buttonLabel = resolveLocaleValue(globals.locale as string, openModalButtonLabels);

    return (
      <>
        <Button theme="blue" label={buttonLabel} onClick={() => setIsOpen(true)} />
        <Modal isOpen={isOpen} title={title} onClose={() => setIsOpen(false)}>
          <p>{content}</p>
        </Modal>
      </>
    );
  },
};

// Story: Modal with Form
export const WithForm: Story = {
  render: (args, { globals }) => {
    const [isOpen, setIsOpen] = useState(false);
    const title = resolveLocaleValue(globals.locale as string, withFormTitles);
    const nameLabel = resolveLocaleValue(globals.locale as string, nameLabels);
    const emailLabel = resolveLocaleValue(globals.locale as string, emailLabels);
    const submitLabel = resolveLocaleValue(globals.locale as string, submitLabels);
    const cancelLabel = resolveLocaleValue(globals.locale as string, cancelLabels);
    const buttonLabel = resolveLocaleValue(globals.locale as string, openModalButtonLabels);

    return (
      <>
        <Button theme="blue" label={buttonLabel} onClick={() => setIsOpen(true)} />
        <Modal isOpen={isOpen} title={title} onClose={() => setIsOpen(false)}>
          <form
            onSubmit={e => {
              e.preventDefault();
              setIsOpen(false);
            }}
            style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <label htmlFor="name">{nameLabel}</label>
              <input type="text" id="name" style={{ marginLeft: '10px', padding: '5px', width: '200px' }} />
            </div>
            <div>
              <label htmlFor="email">{emailLabel}</label>
              <input type="email" id="email" style={{ marginLeft: '10px', padding: '5px', width: '200px' }} />
            </div>
            <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
              <Button type="submit" theme="blue" label={submitLabel} />
              <Button type="button" theme="red" label={cancelLabel} onClick={() => setIsOpen(false)} />
            </div>
          </form>
        </Modal>
      </>
    );
  },
};

// Story: Modal with Long Content
export const WithLongContent: Story = {
  render: (args, { globals }) => {
    const [isOpen, setIsOpen] = useState(false);
    const title = resolveLocaleValue(globals.locale as string, longContentTitles);
    const content = resolveLocaleValue(globals.locale as string, loremIpsumContents);
    const buttonLabel = resolveLocaleValue(globals.locale as string, openModalButtonLabels);

    return (
      <>
        <Button theme="blue" label={buttonLabel} onClick={() => setIsOpen(true)} />
        <Modal isOpen={isOpen} title={title} onClose={() => setIsOpen(false)}>
          <div>
            <p>{content}</p>
            <p>{content}</p>
            <p>{content}</p>
            <p>{content}</p>
          </div>
        </Modal>
      </>
    );
  },
};

// Story: Custom Styled Modal
export const CustomStyled: Story = {
  render: (args, { globals }) => {
    const [isOpen, setIsOpen] = useState(false);
    const title = resolveLocaleValue(globals.locale as string, customStyledTitles);
    const content = resolveLocaleValue(globals.locale as string, customStyledContents);
    const buttonLabel = resolveLocaleValue(globals.locale as string, openModalButtonLabels);

    return (
      <>
        <Button theme="blue" label={buttonLabel} onClick={() => setIsOpen(true)} />
        <Modal isOpen={isOpen} title={title} onClose={() => setIsOpen(false)} className="custom-modal-class">
          <p>{content}</p>
        </Modal>
      </>
    );
  },
};

export default meta;
