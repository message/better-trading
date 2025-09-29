import Header from './index';
import { resolveLocaleValue, defineMessages } from '../../.storybook/locale-utils';
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * Header component displays the Better Trading header with logo, title,
 * and collapse/expand functionality.
 */
const meta = {
  component: Header,
  title: 'Components/Header',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    title: {
      control: false,
      description: '(Derived from locale in render)',
    },
    isOnRootRoute: {
      control: 'boolean',
      description: 'Whether currently on root route (affects toggle icon)',
    },
    onBrandClick: {
      control: false,
      description: 'Callback when brand logo is clicked',
    },
    onToggleClick: {
      control: false,
      description: 'Callback when toggle button is clicked',
    },
  },
} satisfies Meta<typeof Header>;

type Story = StoryObj<typeof meta>;

// Localized title messages
const titleMessages = defineMessages({
  'en-US': 'Better Trading',
  'fr-FR': 'Better Trading',
  'es-ES': 'Better Trading',
  'de-DE': 'Better Trading',
  'pt-BR': 'Better Trading',
  'ru-RU': 'Better Trading',
  'zh-CN': 'Better Trading',
  'ja-JP': 'Better Trading',
  'ko-KR': 'Better Trading',
  'th-TH': 'Better Trading',
});

// Localized alert messages for interaction feedback
const brandClickMessages = defineMessages({
  'en-US': 'Brand clicked! Navigating to home...',
  'fr-FR': "Marque cliquée ! Navigation vers l'accueil...",
  'es-ES': '¡Marca clicada! Navegando a inicio...',
  'de-DE': 'Marke geklickt! Navigiere zur Startseite...',
  'pt-BR': 'Marca clicada! Navegando para início...',
  'ru-RU': 'Клик по бренду! Переход на главную...',
  'zh-CN': '品牌已点击！导航到首页...',
  'ja-JP': 'ブランドをクリックしました！ホームに移動中...',
  'ko-KR': '브랜드 클릭됨! 홈으로 이동 중...',
  'th-TH': 'คลิกแบรนด์แล้ว! กำลังไปยังหน้าแรก...',
});

const toggleClickMessages = defineMessages({
  'en-US': 'Toggle clicked! Switching view...',
  'fr-FR': 'Basculer cliqué ! Changement de vue...',
  'es-ES': '¡Alternar clicado! Cambiando vista...',
  'de-DE': 'Umschalten geklickt! Ansicht wird gewechselt...',
  'pt-BR': 'Alternar clicado! Mudando visualização...',
  'ru-RU': 'Клик по переключателю! Смена вида...',
  'zh-CN': '切换已点击！切换视图...',
  'ja-JP': 'トグルをクリックしました！ビューを切り替え中...',
  'ko-KR': '토글 클릭됨! 보기 전환 중...',
  'th-TH': 'คลิกสลับแล้ว! กำลังเปลี่ยนมุมมอง...',
});

/**
 * Default header on root route (shows info icon)
 */
export const OnRootRoute: Story = {
  render: (args, { globals }) => {
    const title = resolveLocaleValue(globals.locale as string, titleMessages);
    const brandClickMessage = resolveLocaleValue(globals.locale as string, brandClickMessages);
    const toggleClickMessage = resolveLocaleValue(globals.locale as string, toggleClickMessages);

    return (
      <Header
        {...args}
        title={title}
        isOnRootRoute={true}
        onBrandClick={() => alert(brandClickMessage)}
        onToggleClick={() => alert(toggleClickMessage)}
      />
    );
  },
};

/**
 * Header on sub-route (shows close icon)
 */
export const OnSubRoute: Story = {
  render: (args, { globals }) => {
    const title = resolveLocaleValue(globals.locale as string, titleMessages);
    const brandClickMessage = resolveLocaleValue(globals.locale as string, brandClickMessages);
    const toggleClickMessage = resolveLocaleValue(globals.locale as string, toggleClickMessages);

    return (
      <Header
        {...args}
        title={title}
        isOnRootRoute={false}
        onBrandClick={() => alert(brandClickMessage)}
        onToggleClick={() => alert(toggleClickMessage)}
      />
    );
  },
};

/**
 * Interactive example showing route toggle behavior
 */
export const Interactive: Story = {
  render: (args, { globals }) => {
    const InteractiveComponent = () => {
      const title = resolveLocaleValue(globals.locale as string, titleMessages);
      const brandClickMessage = resolveLocaleValue(globals.locale as string, brandClickMessages);

      const [isOnRoot, setIsOnRoot] = useState(true);

      const goToAboutMessages = defineMessages({
        'en-US': 'Going to About page',
        'fr-FR': 'Aller à la page À propos',
        'es-ES': 'Ir a la página Acerca de',
        'de-DE': 'Zur Über-Seite gehen',
        'pt-BR': 'Ir para a página Sobre',
        'ru-RU': 'Переход на страницу О программе',
        'zh-CN': '前往关于页面',
        'ja-JP': '概要ページに移動',
        'ko-KR': '정보 페이지로 이동',
        'th-TH': 'ไปยังหน้าเกี่ยวกับ',
      });

      const goToHomeMessages = defineMessages({
        'en-US': 'Going to Home page',
        'fr-FR': "Aller à la page d'accueil",
        'es-ES': 'Ir a la página de inicio',
        'de-DE': 'Zur Startseite gehen',
        'pt-BR': 'Ir para a página inicial',
        'ru-RU': 'Переход на главную страницу',
        'zh-CN': '前往主页',
        'ja-JP': 'ホームページに移動',
        'ko-KR': '홈 페이지로 이동',
        'th-TH': 'ไปยังหน้าแรก',
      });

      const routeChangeMessage = isOnRoot
        ? resolveLocaleValue(globals.locale as string, goToAboutMessages)
        : resolveLocaleValue(globals.locale as string, goToHomeMessages);

      return (
        <Header
          {...args}
          title={title}
          isOnRootRoute={isOnRoot}
          onBrandClick={() => {
            alert(brandClickMessage);
            setIsOnRoot(true);
          }}
          onToggleClick={() => {
            alert(routeChangeMessage);
            setIsOnRoot(!isOnRoot);
          }}
        />
      );
    };

    return <InteractiveComponent />;
  },
};

export default meta;
