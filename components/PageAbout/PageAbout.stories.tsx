import PageAbout from './index.tsx';
import { resolveLocaleValue, defineMessages } from '../../.storybook/locale-utils';
import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * PageAbout component displays the about page with changelog, enhancers, and credits.
 */
const meta = {
  component: PageAbout,
  title: 'Pages/PageAbout',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    appVersion: {
      control: 'text',
      description: 'Application version number',
    },
    githubUrl: {
      control: 'text',
      description: 'GitHub repository URL',
    },
    t: {
      control: false,
      description: 'Translation function (provided by render)',
    },
  },
} satisfies Meta<typeof PageAbout>;

type Story = StoryObj<typeof meta>;

// Localized messages
const enhancersTitleMessages = defineMessages({
  'en-US': 'Item Result Enhancers',
  'fr-FR': 'Améliorations des résultats',
  'es-ES': 'Mejoras de resultados',
  'de-DE': 'Ergebnis-Verbesserungen',
  'pt-BR': 'Melhorias de resultados',
  'ru-RU': 'Улучшения результатов',
  'zh-CN': '结果增强器',
  'ja-JP': '結果エンハンサー',
  'ko-KR': '결과 향상 기능',
  'th-TH': 'ตัวปรับปรุงผลลัพธ์',
});

const enhancerBulkPriceMessages = defineMessages({
  'en-US': 'Show bulk prices',
  'fr-FR': 'Afficher les prix en vrac',
  'es-ES': 'Mostrar precios al por mayor',
  'de-DE': 'Mengenpreise anzeigen',
  'pt-BR': 'Mostrar preços em massa',
  'ru-RU': 'Показывать оптовые цены',
  'zh-CN': '显示批量价格',
  'ja-JP': 'バルク価格を表示',
  'ko-KR': '대량 가격 표시',
  'th-TH': 'แสดงราคาขายส่ง',
});

const enhancerItemAgeMessages = defineMessages({
  'en-US': 'Show item age',
  'fr-FR': "Afficher l'âge de l'article",
  'es-ES': 'Mostrar antigüedad del artículo',
  'de-DE': 'Artikelalter anzeigen',
  'pt-BR': 'Mostrar idade do item',
  'ru-RU': 'Показывать возраст предмета',
  'zh-CN': '显示物品年龄',
  'ja-JP': 'アイテムの経過時間を表示',
  'ko-KR': '아이템 나이 표시',
  'th-TH': 'แสดงอายุไอเทม',
});

const enhancerCollapsedCardsMessages = defineMessages({
  'en-US': 'Collapse divination cards',
  'fr-FR': 'Réduire les cartes de divination',
  'es-ES': 'Contraer cartas de adivinación',
  'de-DE': 'Weissagungskarten einklappen',
  'pt-BR': 'Recolher cartas de adivinhação',
  'ru-RU': 'Свернуть карты гадания',
  'zh-CN': '折叠占卜卡',
  'ja-JP': '占いカードを折りたたむ',
  'ko-KR': '점술 카드 접기',
  'th-TH': 'ยุบการ์ดทำนาย',
});

const enhancerHighlightCorruptedMessages = defineMessages({
  'en-US': 'Highlight corrupted items',
  'fr-FR': 'Surligner les objets corrompus',
  'es-ES': 'Resaltar objetos corruptos',
  'de-DE': 'Verdorbene Gegenstände hervorheben',
  'pt-BR': 'Destacar itens corrompidos',
  'ru-RU': 'Выделять испорченные предметы',
  'zh-CN': '突出显示腐化物品',
  'ja-JP': '汚染されたアイテムを強調',
  'ko-KR': '타락한 아이템 강조',
  'th-TH': 'เน้นไอเทมเสื่อมสภาพ',
});

const enhancerHighlightIlvlMessages = defineMessages({
  'en-US': 'Highlight item level',
  'fr-FR': "Surligner le niveau d'objet",
  'es-ES': 'Resaltar nivel de objeto',
  'de-DE': 'Gegenstandsstufe hervorheben',
  'pt-BR': 'Destacar nível do item',
  'ru-RU': 'Выделять уровень предмета',
  'zh-CN': '突出显示物品等级',
  'ja-JP': 'アイテムレベルを強調',
  'ko-KR': '아이템 레벨 강조',
  'th-TH': 'เน้นระดับไอเทม',
});

const githubTitleMessages = defineMessages({
  'en-US': 'Open Source',
  'fr-FR': 'Open Source',
  'es-ES': 'Código abierto',
  'de-DE': 'Open Source',
  'pt-BR': 'Código aberto',
  'ru-RU': 'Открытый исходный код',
  'zh-CN': '开源',
  'ja-JP': 'オープンソース',
  'ko-KR': '오픈 소스',
  'th-TH': 'โอเพ่นซอร์ส',
});

const githubDescriptionMessages = defineMessages({
  'en-US':
    'Better Trading is an open-source project. You can contribute, report issues, or view the source code on GitHub.',
  'fr-FR':
    'Better Trading est un projet open source. Vous pouvez contribuer, signaler des problèmes ou consulter le code source sur GitHub.',
  'es-ES':
    'Better Trading es un proyecto de código abierto. Puedes contribuir, reportar problemas o ver el código fuente en GitHub.',
  'de-DE':
    'Better Trading ist ein Open-Source-Projekt. Sie können beitragen, Probleme melden oder den Quellcode auf GitHub einsehen.',
  'pt-BR':
    'Better Trading é um projeto de código aberto. Você pode contribuir, reportar problemas ou visualizar o código-fonte no GitHub.',
  'ru-RU':
    'Better Trading — это проект с открытым исходным кодом. Вы можете внести свой вклад, сообщить о проблемах или просмотреть исходный код на GitHub.',
  'zh-CN': 'Better Trading 是一个开源项目。您可以在 GitHub 上贡献代码、报告问题或查看源代码。',
  'ja-JP':
    'Better Trading はオープンソースプロジェクトです。GitHub で貢献、問題の報告、またはソースコードの表示ができます。',
  'ko-KR':
    'Better Trading은 오픈 소스 프로젝트입니다. GitHub에서 기여하거나, 문제를 보고하거나, 소스 코드를 볼 수 있습니다.',
  'th-TH': 'Better Trading เป็นโครงการโอเพนซอร์ส คุณสามารถมีส่วนร่วม รายงานปัญหา หรือดูโค้ดต้นฉบับบน GitHub',
});

const githubButtonMessages = defineMessages({
  'en-US': 'View on GitHub',
  'fr-FR': 'Voir sur GitHub',
  'es-ES': 'Ver en GitHub',
  'de-DE': 'Auf GitHub ansehen',
  'pt-BR': 'Ver no GitHub',
  'ru-RU': 'Посмотреть на GitHub',
  'zh-CN': '在 GitHub 上查看',
  'ja-JP': 'GitHub で表示',
  'ko-KR': 'GitHub에서 보기',
  'th-TH': 'ดูบน GitHub',
});

const creditsTitleMessages = defineMessages({
  'en-US': 'Credits',
  'fr-FR': 'Crédits',
  'es-ES': 'Créditos',
  'de-DE': 'Danksagungen',
  'pt-BR': 'Créditos',
  'ru-RU': 'Благодарности',
  'zh-CN': '鸣谢',
  'ja-JP': 'クレジット',
  'ko-KR': '크레딧',
  'th-TH': 'เครดิต',
});

const creditsDescriptionMessages = defineMessages({
  'en-US':
    'Thanks to <strong>Path of Exile</strong> and <strong>Grinding Gear Games</strong> for creating an amazing game.',
  'fr-FR':
    'Merci à <strong>Path of Exile</strong> et <strong>Grinding Gear Games</strong> pour avoir créé un jeu incroyable.',
  'es-ES':
    'Gracias a <strong>Path of Exile</strong> y <strong>Grinding Gear Games</strong> por crear un juego increíble.',
  'de-DE':
    'Danke an <strong>Path of Exile</strong> und <strong>Grinding Gear Games</strong> für die Schaffung eines großartigen Spiels.',
  'pt-BR':
    'Obrigado a <strong>Path of Exile</strong> e <strong>Grinding Gear Games</strong> por criar um jogo incrível.',
  'ru-RU':
    'Спасибо <strong>Path of Exile</strong> и <strong>Grinding Gear Games</strong> за создание удивительной игры.',
  'zh-CN': '感谢 <strong>Path of Exile</strong> 和 <strong>Grinding Gear Games</strong> 创造了一款精彩的游戏。',
  'ja-JP':
    '<strong>Path of Exile</strong> と <strong>Grinding Gear Games</strong> が素晴らしいゲームを作成してくれたことに感謝します。',
  'ko-KR': '멋진 게임을 만들어준 <strong>Path of Exile</strong>과 <strong>Grinding Gear Games</strong>에 감사드립니다.',
  'th-TH': 'ขอบคุณ <strong>Path of Exile</strong> และ <strong>Grinding Gear Games</strong> ที่สร้างเกมที่ยอดเยี่ยม',
});

const disclaimerMessages = defineMessages({
  'en-US': 'This extension is not affiliated with or endorsed by Grinding Gear Games.',
  'fr-FR': "Cette extension n'est pas affiliée à ou approuvée par Grinding Gear Games.",
  'es-ES': 'Esta extensión no está afiliada ni respaldada por Grinding Gear Games.',
  'de-DE': 'Diese Erweiterung ist nicht mit Grinding Gear Games verbunden oder von ihnen unterstützt.',
  'pt-BR': 'Esta extensão não é afiliada ou endossada pela Grinding Gear Games.',
  'ru-RU': 'Это расширение не связано с Grinding Gear Games и не одобрено ими.',
  'zh-CN': '此扩展程序未与 Grinding Gear Games 关联或获得其认可。',
  'ja-JP': 'この拡張機能は Grinding Gear Games と提携または承認されていません。',
  'ko-KR': '이 확장 프로그램은 Grinding Gear Games와 제휴하거나 승인하지 않습니다.',
  'th-TH': 'ส่วนขยายนี้ไม่ได้เกี่ยวข้องหรือได้รับการรับรองโดย Grinding Gear Games',
});

const changelogMarkdownMessages = defineMessages({
  'en-US': `# Version 2.0.0 Release

## New Features
- Complete UI overhaul
- Enhanced performance
- Better accessibility

## Bug Fixes
- Fixed search issues
- Resolved pricing bugs`,
  'fr-FR': `# Version 2.0.0

## Nouvelles fonctionnalités
- Refonte complète de l'interface
- Performances améliorées
- Meilleure accessibilité

## Corrections de bugs
- Problèmes de recherche corrigés
- Bugs de tarification résolus`,
  'es-ES': `# Versión 2.0.0

## Nuevas características
- Renovación completa de la UI
- Rendimiento mejorado
- Mejor accesibilidad

## Correcciones de errores
- Problemas de búsqueda corregidos
- Errores de precios resueltos`,
  'de-DE': `# Version 2.0.0

## Neue Funktionen
- Komplette UI-Überarbeitung
- Verbesserte Leistung
- Bessere Barrierefreiheit

## Fehlerbehebungen
- Suchprobleme behoben
- Preisfehler behoben`,
  'pt-BR': `# Versão 2.0.0

## Novos recursos
- Reformulação completa da UI
- Desempenho aprimorado
- Melhor acessibilidade

## Correções de bugs
- Problemas de pesquisa corrigidos
- Bugs de preços resolvidos`,
  'ru-RU': `# Версия 2.0.0

## Новые функции
- Полное обновление интерфейса
- Улучшенная производительность
- Лучшая доступность

## Исправления ошибок
- Исправлены проблемы с поиском
- Устранены ошибки ценообразования`,
  'zh-CN': `# 版本 2.0.0

## 新功能
- 完整的界面改版
- 性能增强
- 更好的可访问性

## 错误修复
- 修复了搜索问题
- 解决了定价错误`,
  'ja-JP': `# バージョン 2.0.0

## 新機能
- UI の完全刷新
- パフォーマンスの向上
- アクセシビリティの改善

## バグ修正
- 検索の問題を修正
- 価格のバグを解決`,
  'ko-KR': `# 버전 2.0.0

## 새로운 기능
- 전체 UI 개편
- 향상된 성능
- 더 나은 접근성

## 버그 수정
- 검색 문제 수정
- 가격 버그 해결`,
  'th-TH': `# เวอร์ชัน 2.0.0

## คุณสมบัติใหม่
- ปรับปรุง UI ทั้งหมด
- ประสิทธิภาพที่ดีขึ้น
- การเข้าถึงที่ดีขึ้น

## การแก้ไขบั๊ก
- แก้ไขปัญหาการค้นหา
- แก้ไขบั๊กราคา`,
});

// Mock translation function
const createMockTranslationFunction = (locale: string) => {
  const translations: Record<string, Record<string, string>> = {
    'page.about.enhancers.title': enhancersTitleMessages,
    'page.about.enhancers.bulk-price': enhancerBulkPriceMessages,
    'page.about.enhancers.item-age': enhancerItemAgeMessages,
    'page.about.enhancers.collapsed-cards': enhancerCollapsedCardsMessages,
    'page.about.enhancers.highlight-corrupted': enhancerHighlightCorruptedMessages,
    'page.about.enhancers.highlight-ilvl': enhancerHighlightIlvlMessages,
    'page.about.github.title': githubTitleMessages,
    'page.about.github.description': githubDescriptionMessages,
    'page.about.github.button': githubButtonMessages,
    'page.about.credits.title': creditsTitleMessages,
    'page.about.credits.description': creditsDescriptionMessages,
    'page.about.disclaimer': disclaimerMessages,
  };

  return (key: string) => {
    const messageMap = translations[key];
    if (!messageMap) return key;
    return resolveLocaleValue(locale, messageMap);
  };
};

export const Default: Story = {
  name: 'Default (No Changelog)',
  args: {
    appVersion: '',
    githubUrl: '',
    t: () => '',
  },
  render: (args, { globals }) => {
    const t = createMockTranslationFunction(globals.locale as string);

    return (
      <PageAbout
        appVersion="2.5.3"
        githubUrl="https://github.com/exile-center/better-trading"
        t={t}
        data-locale={globals.locale}
      />
    );
  },
};

export const WithChangelog: Story = {
  name: 'With Changelog',
  args: {
    appVersion: '',
    githubUrl: '',
    t: () => '',
  },
  render: (args, { globals }) => {
    const t = createMockTranslationFunction(globals.locale as string);
    const changelogMarkdown = resolveLocaleValue(globals.locale as string, changelogMarkdownMessages);

    return (
      <PageAbout
        appVersion="2.5.3"
        githubUrl="https://github.com/exile-center/better-trading"
        currentChangelog={{
          slug: '2.0.0',
          markdown: changelogMarkdown,
        }}
        t={t}
        data-locale={globals.locale}
      />
    );
  },
};

export const Complete: Story = {
  name: 'Complete Example',
  args: {
    appVersion: '',
    githubUrl: '',
    t: () => '',
  },
  render: (args, { globals }) => {
    const t = createMockTranslationFunction(globals.locale as string);
    const changelogMarkdown = resolveLocaleValue(globals.locale as string, changelogMarkdownMessages);

    return (
      <PageAbout
        appVersion="2.5.3"
        githubUrl="https://github.com/exile-center/better-trading"
        discordUrl="https://discord.gg/example"
        chaosRecipeOverlayUrl="https://example.com"
        currentChangelog={{
          slug: '2.0.0',
          markdown: changelogMarkdown,
        }}
        t={t}
        data-locale={globals.locale}
      />
    );
  },
};

export default meta;
