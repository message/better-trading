import { ClipboardTextarea } from './index';
import { defineMessages, resolveLocaleValue } from '../../.storybook/locale-utils';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ClipboardTextarea> = {
  title: 'Components/ClipboardTextarea',
  component: ClipboardTextarea,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

type Story = StoryObj<typeof ClipboardTextarea>;

// Message definitions for all stories
const shortTextValues = defineMessages({
  'en-US': 'Hello, World!',
  'fr-FR': 'Bonjour le monde !',
  'es-ES': '¡Hola, Mundo!',
  'de-DE': 'Hallo Welt!',
  'pt-BR': 'Olá, Mundo!',
  'ru-RU': 'Привет, мир!',
  'zh-CN': '你好，世界！',
  'ja-JP': 'こんにちは、世界！',
  'ko-KR': '안녕하세요, 세계!',
  'th-TH': 'สวัสดีชาวโลก!',
});

const copyButtonLabels = defineMessages({
  'en-US': 'Copy',
  'fr-FR': 'Copier',
  'es-ES': 'Copiar',
  'de-DE': 'Kopieren',
  'pt-BR': 'Copiar',
  'ru-RU': 'Копировать',
  'zh-CN': '复制',
  'ja-JP': 'コピー',
  'ko-KR': '복사',
  'th-TH': 'คัดลอก',
});

const copiedButtonLabels = defineMessages({
  'en-US': 'Copied!',
  'fr-FR': 'Copié !',
  'es-ES': '¡Copiado!',
  'de-DE': 'Kopiert!',
  'pt-BR': 'Copiado!',
  'ru-RU': 'Скопировано!',
  'zh-CN': '已复制！',
  'ja-JP': 'コピーしました！',
  'ko-KR': '복사됨!',
  'th-TH': 'คัดลอกแล้ว!',
});

const longTextValues = defineMessages({
  'en-US':
    'This is a longer text example that demonstrates how the textarea component handles multi-line content. You can click the copy button to copy this entire text to your clipboard.',
  'fr-FR':
    'Ceci est un exemple de texte plus long qui démontre comment le composant textarea gère le contenu multiligne. Vous pouvez cliquer sur le bouton de copie pour copier tout ce texte dans votre presse-papiers.',
  'es-ES':
    'Este es un ejemplo de texto más largo que demuestra cómo el componente textarea maneja el contenido de varias líneas. Puede hacer clic en el botón copiar para copiar todo este texto en su portapapeles.',
  'de-DE':
    'Dies ist ein längeres Textbeispiel, das zeigt, wie die Textarea-Komponente mehrzeilige Inhalte verarbeitet. Sie können auf die Schaltfläche Kopieren klicken, um diesen gesamten Text in Ihre Zwischenablage zu kopieren.',
  'pt-BR':
    'Este é um exemplo de texto mais longo que demonstra como o componente textarea lida com conteúdo de várias linhas. Você pode clicar no botão copiar para copiar todo este texto para sua área de transferência.',
  'ru-RU':
    'Это пример более длинного текста, который демонстрирует, как компонент textarea обрабатывает многострочный контент. Вы можете нажать кнопку копирования, чтобы скопировать весь этот текст в буфер обмена.',
  'zh-CN': '这是一个较长的文本示例，演示了文本区域组件如何处理多行内容。您可以单击复制按钮将整个文本复制到剪贴板。',
  'ja-JP':
    'これは、textareaコンポーネントが複数行のコンテンツをどのように処理するかを示す、より長いテキストの例です。コピーボタンをクリックすると、このテキスト全体をクリップボードにコピーできます。',
  'ko-KR':
    '이것은 textarea 구성 요소가 여러 줄 콘텐츠를 처리하는 방법을 보여주는 긴 텍스트 예제입니다. 복사 버튼을 클릭하여 이 전체 텍스트를 클립보드에 복사할 수 있습니다.',
  'th-TH':
    'นี่คือตัวอย่างข้อความที่ยาวขึ้นซึ่งแสดงให้เห็นว่าส่วนประกอบ textarea จัดการเนื้อหาหลายบรรทัดอย่างไร คุณสามารถคลิกปุ่มคัดลอกเพื่อคัดลอกข้อความทั้งหมดนี้ไปยังคลิปบอร์ดของคุณ',
});

const tradeUrlValues = defineMessages({
  'en-US': 'https://www.pathofexile.com/trade/search/Standard/abc123',
  'fr-FR': 'https://www.pathofexile.com/trade/search/Standard/abc123',
  'es-ES': 'https://www.pathofexile.com/trade/search/Standard/abc123',
  'de-DE': 'https://www.pathofexile.com/trade/search/Standard/abc123',
  'pt-BR': 'https://www.pathofexile.com/trade/search/Standard/abc123',
  'ru-RU': 'https://www.pathofexile.com/trade/search/Standard/abc123',
  'zh-CN': 'https://www.pathofexile.com/trade/search/Standard/abc123',
  'ja-JP': 'https://www.pathofexile.com/trade/search/Standard/abc123',
  'ko-KR': 'https://www.pathofexile.com/trade/search/Standard/abc123',
  'th-TH': 'https://www.pathofexile.com/trade/search/Standard/abc123',
});

const jsonDataValues = defineMessages({
  'en-US': `{
  "name": "Starforge",
  "type": "Infernal Sword",
  "rarity": "Unique",
  "sockets": "6L",
  "dps": 850
}`,
  'fr-FR': `{
  "nom": "Starforge",
  "type": "Épée infernale",
  "rareté": "Unique",
  "sockets": "6L",
  "dps": 850
}`,
  'es-ES': `{
  "nombre": "Starforge",
  "tipo": "Espada infernal",
  "rareza": "Único",
  "sockets": "6L",
  "dps": 850
}`,
  'de-DE': `{
  "name": "Starforge",
  "typ": "Höllenschwert",
  "seltenheit": "Einzigartig",
  "sockets": "6L",
  "dps": 850
}`,
  'pt-BR': `{
  "nome": "Starforge",
  "tipo": "Espada Infernal",
  "raridade": "Único",
  "sockets": "6L",
  "dps": 850
}`,
  'ru-RU': `{
  "имя": "Starforge",
  "тип": "Адский меч",
  "редкость": "Уникальный",
  "sockets": "6L",
  "dps": 850
}`,
  'zh-CN': `{
  "名称": "Starforge",
  "类型": "地狱剑",
  "稀有度": "传奇",
  "sockets": "6L",
  "dps": 850
}`,
  'ja-JP': `{
  "名前": "Starforge",
  "タイプ": "インフェルナルソード",
  "レアリティ": "ユニーク",
  "sockets": "6L",
  "dps": 850
}`,
  'ko-KR': `{
  "이름": "Starforge",
  "유형": "지옥의 검",
  "희귀도": "고유",
  "sockets": "6L",
  "dps": 850
}`,
  'th-TH': `{
  "ชื่อ": "Starforge",
  "ประเภท": "ดาบนรก",
  "ความหายาก": "ไม่ซ้ำ",
  "sockets": "6L",
  "dps": 850
}`,
});

const copyShareLinkLabels = defineMessages({
  'en-US': 'Copy Share Link',
  'fr-FR': 'Copier le lien de partage',
  'es-ES': 'Copiar enlace para compartir',
  'de-DE': 'Freigabelink kopieren',
  'pt-BR': 'Copiar link de compartilhamento',
  'ru-RU': 'Копировать ссылку для обмена',
  'zh-CN': '复制分享链接',
  'ja-JP': '共有リンクをコピー',
  'ko-KR': '공유 링크 복사',
  'th-TH': 'คัดลอกลิงก์แชร์',
});

const linkCopiedLabels = defineMessages({
  'en-US': 'Link Copied!',
  'fr-FR': 'Lien copié !',
  'es-ES': '¡Enlace copiado!',
  'de-DE': 'Link kopiert!',
  'pt-BR': 'Link copiado!',
  'ru-RU': 'Ссылка скопирована!',
  'zh-CN': '链接已复制！',
  'ja-JP': 'リンクをコピーしました！',
  'ko-KR': '링크가 복사되었습니다!',
  'th-TH': 'คัดลอกลิงก์แล้ว!',
});

const copyItemDataLabels = defineMessages({
  'en-US': 'Copy Item Data',
  'fr-FR': "Copier les données de l'objet",
  'es-ES': 'Copiar datos del artículo',
  'de-DE': 'Gegenstandsdaten kopieren',
  'pt-BR': 'Copiar dados do item',
  'ru-RU': 'Копировать данные предмета',
  'zh-CN': '复制物品数据',
  'ja-JP': 'アイテムデータをコピー',
  'ko-KR': '아이템 데이터 복사',
  'th-TH': 'คัดลอกข้อมูลไอเท็ม',
});

const dataCopiedLabels = defineMessages({
  'en-US': 'Data Copied!',
  'fr-FR': 'Données copiées !',
  'es-ES': '¡Datos copiados!',
  'de-DE': 'Daten kopiert!',
  'pt-BR': 'Dados copiados!',
  'ru-RU': 'Данные скопированы!',
  'zh-CN': '数据已复制！',
  'ja-JP': 'データをコピーしました！',
  'ko-KR': '데이터가 복사되었습니다!',
  'th-TH': 'คัดลอกข้อมูลแล้ว!',
});

export const ShortText: Story = {
  render: (args, { globals }) => {
    const value = resolveLocaleValue(globals.locale as string, shortTextValues);
    const buttonLabel = resolveLocaleValue(globals.locale as string, copyButtonLabels);
    const buttonCopiedLabel = resolveLocaleValue(globals.locale as string, copiedButtonLabels);

    return (
      <ClipboardTextarea
        value={value}
        buttonLabel={buttonLabel}
        buttonCopiedLabel={buttonCopiedLabel}
        data-locale={globals.locale}
      />
    );
  },
};

export const LongText: Story = {
  render: (args, { globals }) => {
    const value = resolveLocaleValue(globals.locale as string, longTextValues);
    const buttonLabel = resolveLocaleValue(globals.locale as string, copyButtonLabels);
    const buttonCopiedLabel = resolveLocaleValue(globals.locale as string, copiedButtonLabels);

    return (
      <ClipboardTextarea
        value={value}
        buttonLabel={buttonLabel}
        buttonCopiedLabel={buttonCopiedLabel}
        data-locale={globals.locale}
      />
    );
  },
};

export const TradeUrl: Story = {
  render: (args, { globals }) => {
    const value = resolveLocaleValue(globals.locale as string, tradeUrlValues);
    const buttonLabel = resolveLocaleValue(globals.locale as string, copyShareLinkLabels);
    const buttonCopiedLabel = resolveLocaleValue(globals.locale as string, linkCopiedLabels);

    return (
      <ClipboardTextarea
        value={value}
        buttonLabel={buttonLabel}
        buttonCopiedLabel={buttonCopiedLabel}
        data-locale={globals.locale}
      />
    );
  },
};

export const JsonData: Story = {
  render: (args, { globals }) => {
    const value = resolveLocaleValue(globals.locale as string, jsonDataValues);
    const buttonLabel = resolveLocaleValue(globals.locale as string, copyItemDataLabels);
    const buttonCopiedLabel = resolveLocaleValue(globals.locale as string, dataCopiedLabels);

    return (
      <ClipboardTextarea
        value={value}
        buttonLabel={buttonLabel}
        buttonCopiedLabel={buttonCopiedLabel}
        data-locale={globals.locale}
      />
    );
  },
};

export default meta;
