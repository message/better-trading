import Button from './index.tsx';
import { resolveLocaleValue, defineMessages } from '../../.storybook/locale-utils';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type React from 'react';

/**
 * Button component can render as a button, link, or file input.
 * It supports three themes: blue, gold, and red.
 * Icons can be either strings (for font icons/emoji) or React components (SVGR icons).
 */
const meta = {
  component: Button,
  title: 'Components/Button',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    theme: {
      control: { type: 'radio' },
      options: ['blue', 'gold', 'red'],
      description: 'Button theme/color',
    },
    label: {
      control: false,
      description: '(Derived from locale in render)',
    },
    icon: {
      control: 'text',
      description: 'Icon - string (font icon/emoji) or React component (SVGR icon)',
    },
    onClick: {
      control: false,
      description: 'Click handler (renders as <button>)',
    },
    href: {
      control: 'text',
      description: 'URL to navigate to (renders as <a>)',
    },
    onFileChange: {
      control: false,
      description: 'File change handler (renders as <label> with <input type="file">)',
    },
    fileAccept: {
      control: 'text',
      description: 'File accept attribute (used with onFileChange)',
    },
  },
} satisfies Meta<typeof Button>;

type Story = StoryObj<typeof meta>;

// Localized button labels
const blueButtonLabels = defineMessages({
  'en-US': 'Blue Button',
  'fr-FR': 'Bouton bleu',
  'es-ES': 'Botón azul',
  'de-DE': 'Blauer Button',
  'pt-BR': 'Botão azul',
  'ru-RU': 'Синяя кнопка',
  'zh-CN': '蓝色按钮',
  'ja-JP': '青いボタン',
  'ko-KR': '파란색 버튼',
  'th-TH': 'ปุ่มสีน้ำเงิน',
});

const goldButtonLabels = defineMessages({
  'en-US': 'Gold Button',
  'fr-FR': 'Bouton doré',
  'es-ES': 'Botón dorado',
  'de-DE': 'Goldener Button',
  'pt-BR': 'Botão dourado',
  'ru-RU': 'Золотая кнопка',
  'zh-CN': '金色按钮',
  'ja-JP': '金色のボタン',
  'ko-KR': '금색 버튼',
  'th-TH': 'ปุ่มสีทอง',
});

const redButtonLabels = defineMessages({
  'en-US': 'Red Button',
  'fr-FR': 'Bouton rouge',
  'es-ES': 'Botón rojo',
  'de-DE': 'Roter Button',
  'pt-BR': 'Botão vermelho',
  'ru-RU': 'Красная кнопка',
  'zh-CN': '红色按钮',
  'ja-JP': '赤いボタン',
  'ko-KR': '빨간색 버튼',
  'th-TH': 'ปุ่มสีแดง',
});

const saveButtonLabels = defineMessages({
  'en-US': 'Save',
  'fr-FR': 'Enregistrer',
  'es-ES': 'Guardar',
  'de-DE': 'Speichern',
  'pt-BR': 'Salvar',
  'ru-RU': 'Сохранить',
  'zh-CN': '保存',
  'ja-JP': '保存',
  'ko-KR': '저장',
  'th-TH': 'บันทึก',
});

const editButtonLabels = defineMessages({
  'en-US': 'Edit',
  'fr-FR': 'Modifier',
  'es-ES': 'Editar',
  'de-DE': 'Bearbeiten',
  'pt-BR': 'Editar',
  'ru-RU': 'Редактировать',
  'zh-CN': '编辑',
  'ja-JP': '編集',
  'ko-KR': '편집',
  'th-TH': 'แก้ไข',
});

const deleteButtonLabels = defineMessages({
  'en-US': 'Delete',
  'fr-FR': 'Supprimer',
  'es-ES': 'Eliminar',
  'de-DE': 'Löschen',
  'pt-BR': 'Excluir',
  'ru-RU': 'Удалить',
  'zh-CN': '删除',
  'ja-JP': '削除',
  'ko-KR': '삭제',
  'th-TH': 'ลบ',
});

const visitGitHubLabels = defineMessages({
  'en-US': 'Visit GitHub',
  'fr-FR': 'Visiter GitHub',
  'es-ES': 'Visitar GitHub',
  'de-DE': 'GitHub besuchen',
  'pt-BR': 'Visitar GitHub',
  'ru-RU': 'Посетить GitHub',
  'zh-CN': '访问 GitHub',
  'ja-JP': 'GitHub を訪問',
  'ko-KR': 'GitHub 방문',
  'th-TH': 'เยี่ยมชม GitHub',
});

const uploadFileLabels = defineMessages({
  'en-US': 'Upload File',
  'fr-FR': 'Télécharger un fichier',
  'es-ES': 'Subir archivo',
  'de-DE': 'Datei hochladen',
  'pt-BR': 'Enviar arquivo',
  'ru-RU': 'Загрузить файл',
  'zh-CN': '上传文件',
  'ja-JP': 'ファイルをアップロード',
  'ko-KR': '파일 업로드',
  'th-TH': 'อัปโหลดไฟล์',
});

const uploadLabels = defineMessages({
  'en-US': 'Upload',
  'fr-FR': 'Télécharger',
  'es-ES': 'Subir',
  'de-DE': 'Hochladen',
  'pt-BR': 'Enviar',
  'ru-RU': 'Загрузить',
  'zh-CN': '上传',
  'ja-JP': 'アップロード',
  'ko-KR': '업로드',
  'th-TH': 'อัปโหลด',
});

const clickMeLabels = defineMessages({
  'en-US': 'Click me',
  'fr-FR': 'Cliquez-moi',
  'es-ES': 'Haz clic',
  'de-DE': 'Klick mich',
  'pt-BR': 'Clique aqui',
  'ru-RU': 'Нажми меня',
  'zh-CN': '点击我',
  'ja-JP': 'クリックしてください',
  'ko-KR': '클릭하세요',
  'th-TH': 'คลิกที่นี่',
});

const withIconLabels = defineMessages({
  'en-US': 'With icon',
  'fr-FR': 'Avec icône',
  'es-ES': 'Con icono',
  'de-DE': 'Mit Symbol',
  'pt-BR': 'Com ícone',
  'ru-RU': 'С иконкой',
  'zh-CN': '带图标',
  'ja-JP': 'アイコン付き',
  'ko-KR': '아이콘 포함',
  'th-TH': 'มีไอคอน',
});

const noIconLabels = defineMessages({
  'en-US': 'No icon',
  'fr-FR': 'Sans icône',
  'es-ES': 'Sin icono',
  'de-DE': 'Ohne Symbol',
  'pt-BR': 'Sem ícone',
  'ru-RU': 'Без иконки',
  'zh-CN': '无图标',
  'ja-JP': 'アイコンなし',
  'ko-KR': '아이콘 없음',
  'th-TH': 'ไม่มีไอคอน',
});

const blueThemeHeading = defineMessages({
  'en-US': 'Blue Theme:',
  'fr-FR': 'Thème bleu :',
  'es-ES': 'Tema azul:',
  'de-DE': 'Blaues Thema:',
  'pt-BR': 'Tema azul:',
  'ru-RU': 'Синяя тема:',
  'zh-CN': '蓝色主题：',
  'ja-JP': '青のテーマ：',
  'ko-KR': '파란색 테마:',
  'th-TH': 'ธีมสีน้ำเงิน:',
});

const goldThemeHeading = defineMessages({
  'en-US': 'Gold Theme:',
  'fr-FR': 'Thème doré :',
  'es-ES': 'Tema dorado:',
  'de-DE': 'Goldenes Thema:',
  'pt-BR': 'Tema dourado:',
  'ru-RU': 'Золотая тема:',
  'zh-CN': '金色主题：',
  'ja-JP': '金色のテーマ：',
  'ko-KR': '금색 테마:',
  'th-TH': 'ธีมสีทอง:',
});

const redThemeHeading = defineMessages({
  'en-US': 'Red Theme:',
  'fr-FR': 'Thème rouge :',
  'es-ES': 'Tema rojo:',
  'de-DE': 'Rotes Thema:',
  'pt-BR': 'Tema vermelho:',
  'ru-RU': 'Красная тема:',
  'zh-CN': '红色主题：',
  'ja-JP': '赤のテーマ：',
  'ko-KR': '빨간색 테마:',
  'th-TH': 'ธีมสีแดง:',
});

const buttonOnClickHeading = defineMessages({
  'en-US': 'Button (onClick):',
  'fr-FR': 'Bouton (onClick) :',
  'es-ES': 'Botón (onClick):',
  'de-DE': 'Button (onClick):',
  'pt-BR': 'Botão (onClick):',
  'ru-RU': 'Кнопка (onClick):',
  'zh-CN': '按钮 (onClick)：',
  'ja-JP': 'ボタン (onClick)：',
  'ko-KR': '버튼 (onClick):',
  'th-TH': 'ปุ่ม (onClick):',
});

const linkHrefHeading = defineMessages({
  'en-US': 'Link (href):',
  'fr-FR': 'Lien (href) :',
  'es-ES': 'Enlace (href):',
  'de-DE': 'Link (href):',
  'pt-BR': 'Link (href):',
  'ru-RU': 'Ссылка (href):',
  'zh-CN': '链接 (href)：',
  'ja-JP': 'リンク (href)：',
  'ko-KR': '링크 (href):',
  'th-TH': 'ลิงก์ (href):',
});

const fileInputHeading = defineMessages({
  'en-US': 'File Input (onFileChange):',
  'fr-FR': 'Entrée de fichier (onFileChange) :',
  'es-ES': 'Entrada de archivo (onFileChange):',
  'de-DE': 'Dateieingabe (onFileChange):',
  'pt-BR': 'Entrada de arquivo (onFileChange):',
  'ru-RU': 'Выбор файла (onFileChange):',
  'zh-CN': '文件输入 (onFileChange)：',
  'ja-JP': 'ファイル入力 (onFileChange)：',
  'ko-KR': '파일 입력 (onFileChange):',
  'th-TH': 'อินพุตไฟล์ (onFileChange):',
});

const svgrIconLabels = defineMessages({
  'en-US': 'With SVGR Icon',
  'fr-FR': 'Avec icône SVGR',
  'es-ES': 'Con icono SVGR',
  'de-DE': 'Mit SVGR-Symbol',
  'pt-BR': 'Com ícone SVGR',
  'ru-RU': 'С SVGR-иконкой',
  'zh-CN': '带 SVGR 图标',
  'ja-JP': 'SVGR アイコン付き',
  'ko-KR': 'SVGR 아이콘 포함',
  'th-TH': 'พร้อมไอคอน SVGR',
});

// Example SVGR icon component (simulates what you'd get from an imported SVG)
const ExampleSvgrIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.18-.92-6-4.42-6-8V8.3l6-3.27 6 3.27V12c0 3.58-2.82 7.08-6 8z" />
    <path d="M10.5 13.5l-2.12-2.12-1.41 1.41L10.5 16.5l6-6-1.41-1.41z" />
  </svg>
);

export const Blue: Story = {
  name: 'Blue Theme',
  args: { theme: 'blue' },
  render: (args, { globals }) => {
    const label = resolveLocaleValue(globals.locale as string, blueButtonLabels);
    const theme = args.theme ?? 'blue';
    const onClick = args.onClick ?? (() => alert(label));
    return (
      <Button
        theme={theme}
        label={label}
        icon={args.icon}
        className={args.className}
        type={args.type}
        onClick={onClick}
        data-locale={globals.locale}
      />
    );
  },
};

export const Gold: Story = {
  name: 'Gold Theme',
  args: { theme: 'gold' },
  render: (args, { globals }) => {
    const label = resolveLocaleValue(globals.locale as string, goldButtonLabels);
    const theme = args.theme ?? 'gold';
    const onClick = args.onClick ?? (() => alert(label));
    return (
      <Button
        theme={theme}
        label={label}
        icon={args.icon}
        className={args.className}
        type={args.type}
        onClick={onClick}
        data-locale={globals.locale}
      />
    );
  },
};

export const Red: Story = {
  name: 'Red Theme',
  args: { theme: 'red' },
  render: (args, { globals }) => {
    const label = resolveLocaleValue(globals.locale as string, redButtonLabels);
    const theme = args.theme ?? 'red';
    const onClick = args.onClick ?? (() => alert(label));
    return (
      <Button
        theme={theme}
        label={label}
        icon={args.icon}
        className={args.className}
        type={args.type}
        onClick={onClick}
        data-locale={globals.locale}
      />
    );
  },
};

export const WithIcon: Story = {
  name: 'With Icon',
  args: { theme: 'blue' },
  render: (args, { globals }) => {
    const label = resolveLocaleValue(globals.locale as string, saveButtonLabels);
    const icon = args.icon ?? '💾';
    const theme = args.theme ?? 'blue';
    const onClick = args.onClick ?? (() => alert(label));
    return (
      <Button
        theme={theme}
        label={label}
        icon={icon}
        className={args.className}
        type={args.type}
        onClick={onClick}
        data-locale={globals.locale}
      />
    );
  },
};

export const IconOnly: Story = {
  name: 'Icon Only',
  args: {
    theme: 'gold',
    icon: '⚙️',
    onClick: () => alert('Settings clicked!'),
  },
};

export const AsLink: Story = {
  name: 'As Link (External)',
  args: { theme: 'blue', href: 'https://www.pathofexile.com' },
  render: (args, { globals }) => {
    const label = resolveLocaleValue(globals.locale as string, visitGitHubLabels);
    const theme = args.theme ?? 'blue';
    const icon = args.icon ?? '🔗';
    const href = args.href ?? 'https://www.pathofexile.com';
    return (
      <Button
        theme={theme}
        label={label}
        icon={icon}
        className={args.className}
        href={href}
        data-locale={globals.locale}
      />
    );
  },
};

export const AsFileInput: Story = {
  name: 'As File Input',
  args: { theme: 'gold', onFileChange: () => {} },
  render: (args, { globals }) => {
    const label = resolveLocaleValue(globals.locale as string, uploadFileLabels);
    const handleFileChange =
      args.onFileChange ??
      ((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        alert(`File selected: ${file?.name || 'none'}`);
      });
    const theme = args.theme ?? 'gold';
    const icon = args.icon ?? '📁';
    const fileAccept = args.fileAccept ?? '.json,.txt';
    return (
      <Button
        theme={theme}
        label={label}
        icon={icon}
        className={args.className}
        onFileChange={handleFileChange}
        fileAccept={fileAccept}
        data-locale={globals.locale}
      />
    );
  },
};

export const MultipleButtons: Story = {
  name: 'Multiple Buttons',
  args: { theme: 'blue' },
  render: (args, { globals }) => {
    const saveLabel = resolveLocaleValue(globals.locale as string, saveButtonLabels);
    const editLabel = resolveLocaleValue(globals.locale as string, editButtonLabels);
    const deleteLabel = resolveLocaleValue(globals.locale as string, deleteButtonLabels);
    const sharedClassName = args.className;
    const sharedOnClick = 'href' in args || 'onFileChange' in args ? undefined : args.onClick;

    return (
      <div data-locale={globals.locale}>
        <Button
          theme="blue"
          className={sharedClassName}
          label={saveLabel}
          icon="💾"
          onClick={sharedOnClick ?? (() => alert(saveLabel))}
        />
        <Button
          theme="gold"
          className={sharedClassName}
          label={editLabel}
          icon="✏️"
          onClick={sharedOnClick ?? (() => alert(editLabel))}
        />
        <Button
          theme="red"
          className={sharedClassName}
          label={deleteLabel}
          icon="🗑️"
          onClick={sharedOnClick ?? (() => alert(deleteLabel))}
        />
      </div>
    );
  },
};

export const ThemeShowcase: Story = {
  name: 'Theme Showcase',
  parameters: { layout: 'padded' },
  args: { theme: 'blue' },
  render: (args, { globals }) => {
    const blueTheme = resolveLocaleValue(globals.locale as string, blueThemeHeading);
    const goldTheme = resolveLocaleValue(globals.locale as string, goldThemeHeading);
    const redTheme = resolveLocaleValue(globals.locale as string, redThemeHeading);
    const clickMe = resolveLocaleValue(globals.locale as string, clickMeLabels);
    const withIcon = resolveLocaleValue(globals.locale as string, withIconLabels);
    const noIcon = resolveLocaleValue(globals.locale as string, noIconLabels);

    const sharedClassName = args.className;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} data-locale={globals.locale}>
        <div>
          <h4 style={{ margin: '0 0 8px', fontSize: 14, color: '#999' }}>{blueTheme}</h4>
          <Button theme="blue" className={sharedClassName} label={clickMe} icon="✓" onClick={() => {}} />
          <Button theme="blue" className={sharedClassName} label={withIcon} icon="⚡" onClick={() => {}} />
          <Button theme="blue" className={sharedClassName} label={noIcon} onClick={() => {}} />
          <Button theme="blue" className={sharedClassName} icon="★" onClick={() => {}} />
        </div>

        <div>
          <h4 style={{ margin: '0 0 8px', fontSize: 14, color: '#999' }}>{goldTheme}</h4>
          <Button theme="gold" className={sharedClassName} label={clickMe} icon="✓" onClick={() => {}} />
          <Button theme="gold" className={sharedClassName} label={withIcon} icon="⚡" onClick={() => {}} />
          <Button theme="gold" className={sharedClassName} label={noIcon} onClick={() => {}} />
          <Button theme="gold" className={sharedClassName} icon="★" onClick={() => {}} />
        </div>

        <div>
          <h4 style={{ margin: '0 0 8px', fontSize: 14, color: '#999' }}>{redTheme}</h4>
          <Button theme="red" className={sharedClassName} label={clickMe} icon="✓" onClick={() => {}} />
          <Button theme="red" className={sharedClassName} label={withIcon} icon="⚡" onClick={() => {}} />
          <Button theme="red" className={sharedClassName} label={noIcon} onClick={() => {}} />
          <Button theme="red" className={sharedClassName} icon="★" onClick={() => {}} />
        </div>
      </div>
    );
  },
};

export const AllVariants: Story = {
  name: 'All Variants',
  parameters: { layout: 'padded' },
  args: { theme: 'blue' },
  render: (args, { globals }) => {
    const buttonHeading = resolveLocaleValue(globals.locale as string, buttonOnClickHeading);
    const linkHeading = resolveLocaleValue(globals.locale as string, linkHrefHeading);
    const fileHeading = resolveLocaleValue(globals.locale as string, fileInputHeading);
    const clickMe = resolveLocaleValue(globals.locale as string, clickMeLabels);
    const visitGitHub = resolveLocaleValue(globals.locale as string, visitGitHubLabels);
    const upload = resolveLocaleValue(globals.locale as string, uploadLabels);

    const sharedClassName = args.className;
    const buttonVariantOnClick = 'href' in args || 'onFileChange' in args ? undefined : args.onClick;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} data-locale={globals.locale}>
        <div>
          <h4 style={{ margin: '0 0 8px', fontSize: 14, color: '#999' }}>{buttonHeading}</h4>
          <Button
            theme="blue"
            className={sharedClassName}
            label={clickMe}
            icon="👆"
            onClick={buttonVariantOnClick ?? (() => alert(clickMe))}
          />
        </div>

        <div>
          <h4 style={{ margin: '0 0 8px', fontSize: 14, color: '#999' }}>{linkHeading}</h4>
          <Button
            theme="gold"
            className={sharedClassName}
            label={visitGitHub}
            icon={args.icon ?? '🔗'}
            href={args.href ?? 'https://github.com'}
          />
        </div>

        <div>
          <h4 style={{ margin: '0 0 8px', fontSize: 14, color: '#999' }}>{fileHeading}</h4>
          <Button
            theme="red"
            className={sharedClassName}
            label={upload}
            icon={args.icon ?? '📁'}
            onFileChange={
              args.onFileChange ??
              ((event: React.ChangeEvent<HTMLInputElement>) => {
                const file = event.target.files?.[0];
                alert(`File: ${file?.name || 'none'}`);
              })
            }
            fileAccept={args.fileAccept ?? '.json'}
          />
        </div>
      </div>
    );
  },
};

export const WithSvgrIcon: Story = {
  name: 'With SVGR Icon Component',
  args: { theme: 'blue' },
  render: (args, { globals }) => {
    const label = resolveLocaleValue(globals.locale as string, svgrIconLabels);
    const icon = args.icon ?? ExampleSvgrIcon;
    const theme = args.theme ?? 'blue';
    const onClick = args.onClick ?? (() => alert(label));
    return (
      <Button
        theme={theme}
        label={label}
        icon={icon}
        className={args.className}
        type={args.type}
        onClick={onClick}
        data-locale={globals.locale}
      />
    );
  },
};

export default meta;
