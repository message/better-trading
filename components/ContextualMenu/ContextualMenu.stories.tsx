import ContextualMenu from './index.tsx';
import { defineMessages, resolveLocaleValue } from '../../.storybook/locale-utils';
import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * ContextualMenu displays an ellipsis icon that, when clicked, shows a menu at the click position.
 * The menu auto-hides when the mouse leaves (with a 500ms debounce).
 * Menu items can be buttons (with onClick) or links (with href).
 */
const meta = {
  component: ContextualMenu,
  title: 'Components/ContextualMenu',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS class name',
    },
    items: {
      control: false,
      description: 'Array of menu items with label, href, or onClick',
    },
  },
} satisfies Meta<typeof ContextualMenu>;

type Story = StoryObj<typeof meta>;

// ============================================================================
// Message Definitions
// ============================================================================

// Basic story messages
const basicItem1Labels = defineMessages({
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

const basicItem2Labels = defineMessages({
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

const basicItem3Labels = defineMessages({
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

const basicAlertMessages = defineMessages({
  'en-US': 'Clicked: {action}',
  'fr-FR': 'Cliqué: {action}',
  'es-ES': 'Clic: {action}',
  'de-DE': 'Geklickt: {action}',
  'pt-BR': 'Clicado: {action}',
  'ru-RU': 'Нажато: {action}',
  'zh-CN': '已点击：{action}',
  'ja-JP': 'クリック: {action}',
  'ko-KR': '클릭됨: {action}',
  'th-TH': 'คลิก: {action}',
});

// WithLinks story messages
const withLinksItem1Labels = defineMessages({
  'en-US': 'Go to Documentation',
  'fr-FR': 'Accéder à la documentation',
  'es-ES': 'Ir a la documentación',
  'de-DE': 'Zur Dokumentation gehen',
  'pt-BR': 'Ir para a documentação',
  'ru-RU': 'Перейти к документации',
  'zh-CN': '转到文档',
  'ja-JP': 'ドキュメントに移動',
  'ko-KR': '문서로 이동',
  'th-TH': 'ไปที่เอกสาร',
});

const withLinksItem2Labels = defineMessages({
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

const withLinksItem3Labels = defineMessages({
  'en-US': 'Open Settings',
  'fr-FR': 'Ouvrir les paramètres',
  'es-ES': 'Abrir configuración',
  'de-DE': 'Einstellungen öffnen',
  'pt-BR': 'Abrir configurações',
  'ru-RU': 'Открыть настройки',
  'zh-CN': '打开设置',
  'ja-JP': '設定を開く',
  'ko-KR': '설정 열기',
  'th-TH': 'เปิดการตั้งค่า',
});

// MixedItems story messages
const mixedItem1Labels = defineMessages({
  'en-US': 'View Profile',
  'fr-FR': 'Voir le profil',
  'es-ES': 'Ver perfil',
  'de-DE': 'Profil anzeigen',
  'pt-BR': 'Ver perfil',
  'ru-RU': 'Просмотреть профиль',
  'zh-CN': '查看个人资料',
  'ja-JP': 'プロフィールを見る',
  'ko-KR': '프로필 보기',
  'th-TH': 'ดูโปรไฟล์',
});

const mixedItem2Labels = defineMessages({
  'en-US': 'Share',
  'fr-FR': 'Partager',
  'es-ES': 'Compartir',
  'de-DE': 'Teilen',
  'pt-BR': 'Compartilhar',
  'ru-RU': 'Поделиться',
  'zh-CN': '分享',
  'ja-JP': '共有',
  'ko-KR': '공유',
  'th-TH': 'แบ่งปัน',
});

const mixedItem3Labels = defineMessages({
  'en-US': 'Export Data',
  'fr-FR': 'Exporter les données',
  'es-ES': 'Exportar datos',
  'de-DE': 'Daten exportieren',
  'pt-BR': 'Exportar dados',
  'ru-RU': 'Экспортировать данные',
  'zh-CN': '导出数据',
  'ja-JP': 'データをエクスポート',
  'ko-KR': '데이터 내보내기',
  'th-TH': 'ส่งออกข้อมูล',
});

const mixedItem4Labels = defineMessages({
  'en-US': 'Help & Support',
  'fr-FR': 'Aide et support',
  'es-ES': 'Ayuda y soporte',
  'de-DE': 'Hilfe & Support',
  'pt-BR': 'Ajuda e suporte',
  'ru-RU': 'Помощь и поддержка',
  'zh-CN': '帮助与支持',
  'ja-JP': 'ヘルプとサポート',
  'ko-KR': '도움말 및 지원',
  'th-TH': 'ช่วยเหลือและสนับสนุน',
});

const mixedAlertMessages = defineMessages({
  'en-US': 'Action: {action}',
  'fr-FR': 'Action: {action}',
  'es-ES': 'Acción: {action}',
  'de-DE': 'Aktion: {action}',
  'pt-BR': 'Ação: {action}',
  'ru-RU': 'Действие: {action}',
  'zh-CN': '操作：{action}',
  'ja-JP': 'アクション: {action}',
  'ko-KR': '작업: {action}',
  'th-TH': 'การกระทำ: {action}',
});

// AsyncActions story messages
const asyncItem1Labels = defineMessages({
  'en-US': 'Save Changes',
  'fr-FR': 'Enregistrer les modifications',
  'es-ES': 'Guardar cambios',
  'de-DE': 'Änderungen speichern',
  'pt-BR': 'Salvar alterações',
  'ru-RU': 'Сохранить изменения',
  'zh-CN': '保存更改',
  'ja-JP': '変更を保存',
  'ko-KR': '변경 사항 저장',
  'th-TH': 'บันทึกการเปลี่ยนแปลง',
});

const asyncItem2Labels = defineMessages({
  'en-US': 'Refresh Data',
  'fr-FR': 'Actualiser les données',
  'es-ES': 'Actualizar datos',
  'de-DE': 'Daten aktualisieren',
  'pt-BR': 'Atualizar dados',
  'ru-RU': 'Обновить данные',
  'zh-CN': '刷新数据',
  'ja-JP': 'データを更新',
  'ko-KR': '데이터 새로 고침',
  'th-TH': 'รีเฟรชข้อมูล',
});

const asyncItem3Labels = defineMessages({
  'en-US': 'Sync Now',
  'fr-FR': 'Synchroniser maintenant',
  'es-ES': 'Sincronizar ahora',
  'de-DE': 'Jetzt synchronisieren',
  'pt-BR': 'Sincronizar agora',
  'ru-RU': 'Синхронизировать сейчас',
  'zh-CN': '立即同步',
  'ja-JP': '今すぐ同期',
  'ko-KR': '지금 동기화',
  'th-TH': 'ซิงค์ตอนนี้',
});

const asyncProcessingMessages = defineMessages({
  'en-US': 'Processing {action}...',
  'fr-FR': 'Traitement de {action}...',
  'es-ES': 'Procesando {action}...',
  'de-DE': 'Verarbeitung von {action}...',
  'pt-BR': 'Processando {action}...',
  'ru-RU': 'Обработка {action}...',
  'zh-CN': '正在处理 {action}...',
  'ja-JP': '{action} を処理中...',
  'ko-KR': '{action} 처理 중...',
  'th-TH': 'กำลังประมวลผล {action}...',
});

const asyncCompletedMessages = defineMessages({
  'en-US': '{action} completed!',
  'fr-FR': '{action} terminé !',
  'es-ES': '¡{action} completado!',
  'de-DE': '{action} abgeschlossen!',
  'pt-BR': '{action} concluído!',
  'ru-RU': '{action} завершено!',
  'zh-CN': '{action} 已完成！',
  'ja-JP': '{action} 完了！',
  'ko-KR': '{action} 완료!',
  'th-TH': '{action} เสร็จสิ้น!',
});

// ManyItems story messages
const manyItemLabels = {
  item1: defineMessages({
    'en-US': 'Item 1',
    'fr-FR': 'Élément 1',
    'es-ES': 'Elemento 1',
    'de-DE': 'Element 1',
    'pt-BR': 'Item 1',
    'ru-RU': 'Элемент 1',
    'zh-CN': '项目 1',
    'ja-JP': '項目 1',
    'ko-KR': '항목 1',
    'th-TH': 'รายการ 1',
  }),
  item2: defineMessages({
    'en-US': 'Item 2',
    'fr-FR': 'Élément 2',
    'es-ES': 'Elemento 2',
    'de-DE': 'Element 2',
    'pt-BR': 'Item 2',
    'ru-RU': 'Элемент 2',
    'zh-CN': '项目 2',
    'ja-JP': '項目 2',
    'ko-KR': '항목 2',
    'th-TH': 'รายการ 2',
  }),
  item3: defineMessages({
    'en-US': 'Item 3',
    'fr-FR': 'Élément 3',
    'es-ES': 'Elemento 3',
    'de-DE': 'Element 3',
    'pt-BR': 'Item 3',
    'ru-RU': 'Элемент 3',
    'zh-CN': '项目 3',
    'ja-JP': '項目 3',
    'ko-KR': '항목 3',
    'th-TH': 'รายการ 3',
  }),
  item4: defineMessages({
    'en-US': 'Item 4',
    'fr-FR': 'Élément 4',
    'es-ES': 'Elemento 4',
    'de-DE': 'Element 4',
    'pt-BR': 'Item 4',
    'ru-RU': 'Элемент 4',
    'zh-CN': '项目 4',
    'ja-JP': '項目 4',
    'ko-KR': '항목 4',
    'th-TH': 'รายการ 4',
  }),
  item5: defineMessages({
    'en-US': 'Item 5',
    'fr-FR': 'Élément 5',
    'es-ES': 'Elemento 5',
    'de-DE': 'Element 5',
    'pt-BR': 'Item 5',
    'ru-RU': 'Элемент 5',
    'zh-CN': '项目 5',
    'ja-JP': '項目 5',
    'ko-KR': '항목 5',
    'th-TH': 'รายการ 5',
  }),
  item6: defineMessages({
    'en-US': 'Item 6',
    'fr-FR': 'Élément 6',
    'es-ES': 'Elemento 6',
    'de-DE': 'Element 6',
    'pt-BR': 'Item 6',
    'ru-RU': 'Элемент 6',
    'zh-CN': '项目 6',
    'ja-JP': '項目 6',
    'ko-KR': '항목 6',
    'th-TH': 'รายการ 6',
  }),
  item7: defineMessages({
    'en-US': 'Item 7',
    'fr-FR': 'Élément 7',
    'es-ES': 'Elemento 7',
    'de-DE': 'Element 7',
    'pt-BR': 'Item 7',
    'ru-RU': 'Элемент 7',
    'zh-CN': '项目 7',
    'ja-JP': '項目 7',
    'ko-KR': '항목 7',
    'th-TH': 'รายการ 7',
  }),
  item8: defineMessages({
    'en-US': 'Item 8',
    'fr-FR': 'Élément 8',
    'es-ES': 'Elemento 8',
    'de-DE': 'Element 8',
    'pt-BR': 'Item 8',
    'ru-RU': 'Элемент 8',
    'zh-CN': '项目 8',
    'ja-JP': '項目 8',
    'ko-KR': '항목 8',
    'th-TH': 'รายการ 8',
  }),
};

const manyItemsAlertMessages = defineMessages({
  'en-US': 'Selected: {item}',
  'fr-FR': 'Sélectionné: {item}',
  'es-ES': 'Seleccionado: {item}',
  'de-DE': 'Ausgewählt: {item}',
  'pt-BR': 'Selecionado: {item}',
  'ru-RU': 'Выбрано: {item}',
  'zh-CN': '已选择：{item}',
  'ja-JP': '選択: {item}',
  'ko-KR': '선택됨: {item}',
  'th-TH': 'เลือก: {item}',
});

// BottomPosition story messages
const bottomItem1Labels = defineMessages({
  'en-US': 'Action A',
  'fr-FR': 'Action A',
  'es-ES': 'Acción A',
  'de-DE': 'Aktion A',
  'pt-BR': 'Ação A',
  'ru-RU': 'Действие A',
  'zh-CN': '操作 A',
  'ja-JP': 'アクション A',
  'ko-KR': '작업 A',
  'th-TH': 'การกระทำ A',
});

const bottomItem2Labels = defineMessages({
  'en-US': 'Action B',
  'fr-FR': 'Action B',
  'es-ES': 'Acción B',
  'de-DE': 'Aktion B',
  'pt-BR': 'Ação B',
  'ru-RU': 'Действие B',
  'zh-CN': '操作 B',
  'ja-JP': 'アクション B',
  'ko-KR': '작업 B',
  'th-TH': 'การกระทำ B',
});

const bottomItem3Labels = defineMessages({
  'en-US': 'Action C',
  'fr-FR': 'Action C',
  'es-ES': 'Acción C',
  'de-DE': 'Aktion C',
  'pt-BR': 'Ação C',
  'ru-RU': 'Действие C',
  'zh-CN': '操作 C',
  'ja-JP': 'アクション C',
  'ko-KR': '작업 C',
  'th-TH': 'การกระทำ C',
});

const bottomInstructionMessages = defineMessages({
  'en-US': 'Click the menu at the bottom (notice auto-positioning) ↓',
  'fr-FR': 'Cliquez sur le menu en bas (remarquez le positionnement automatique) ↓',
  'es-ES': 'Haz clic en el menú en la parte inferior (observa el posicionamiento automático) ↓',
  'de-DE': 'Klicken Sie auf das Menü unten (beachten Sie die automatische Positionierung) ↓',
  'pt-BR': 'Clique no menu na parte inferior (observe o posicionamento automático) ↓',
  'ru-RU': 'Нажмите на меню внизу (обратите внимание на автоматическое позиционирование) ↓',
  'zh-CN': '点击底部的菜单（注意自动定位）↓',
  'ja-JP': '下部のメニューをクリック（自動配置に注意）↓',
  'ko-KR': '하단의 메뉴를 클릭하세요(자동 위치 지정 확인) ↓',
  'th-TH': 'คลิกที่เมนูด้านล่าง (สังเกตการจัดตำแหน่งอัตโนมัติ) ↓',
});

// ============================================================================
// Stories
// ============================================================================

/**
 * Basic contextual menu with three action items.
 */
const Basic: Story = {
  args: {
    items: [],
  },
  render: (args, { globals }) => {
    const item1Label = resolveLocaleValue(globals.locale as string, basicItem1Labels);
    const item2Label = resolveLocaleValue(globals.locale as string, basicItem2Labels);
    const item3Label = resolveLocaleValue(globals.locale as string, basicItem3Labels);
    const alertTemplate = resolveLocaleValue(globals.locale as string, basicAlertMessages);

    return (
      <div style={{ padding: '100px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ color: 'white' }}>Click the menu:</span>
        <ContextualMenu
          {...args}
          items={[
            {
              label: item1Label,
              onClick: () => alert(alertTemplate.replace('{action}', item1Label)),
            },
            {
              label: item2Label,
              onClick: () => alert(alertTemplate.replace('{action}', item2Label)),
            },
            {
              label: item3Label,
              onClick: () => alert(alertTemplate.replace('{action}', item3Label)),
            },
          ]}
        />
      </div>
    );
  },
};

/**
 * Menu with link items that navigate to external URLs.
 */
const WithLinks: Story = {
  args: {
    items: [],
  },
  render: (args, { globals }) => {
    const item1Label = resolveLocaleValue(globals.locale as string, withLinksItem1Labels);
    const item2Label = resolveLocaleValue(globals.locale as string, withLinksItem2Labels);
    const item3Label = resolveLocaleValue(globals.locale as string, withLinksItem3Labels);

    return (
      <div style={{ padding: '100px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ color: 'white' }}>Menu with links:</span>
        <ContextualMenu
          {...args}
          items={[
            {
              label: item1Label,
              href: 'https://docs.example.com',
            },
            {
              label: item2Label,
              href: 'https://github.com',
            },
            {
              label: item3Label,
              href: '#settings',
            },
          ]}
        />
      </div>
    );
  },
};

/**
 * Menu with a mix of buttons (onClick) and links (href).
 */
const MixedItems: Story = {
  args: {
    items: [],
  },
  render: (args, { globals }) => {
    const item1Label = resolveLocaleValue(globals.locale as string, mixedItem1Labels);
    const item2Label = resolveLocaleValue(globals.locale as string, mixedItem2Labels);
    const item3Label = resolveLocaleValue(globals.locale as string, mixedItem3Labels);
    const item4Label = resolveLocaleValue(globals.locale as string, mixedItem4Labels);
    const alertTemplate = resolveLocaleValue(globals.locale as string, mixedAlertMessages);

    return (
      <div style={{ padding: '100px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ color: 'white' }}>Mixed items:</span>
        <ContextualMenu
          {...args}
          items={[
            {
              label: item1Label,
              href: '#profile',
            },
            {
              label: item2Label,
              onClick: () => alert(alertTemplate.replace('{action}', item2Label)),
            },
            {
              label: item3Label,
              onClick: () => alert(alertTemplate.replace('{action}', item3Label)),
            },
            {
              label: item4Label,
              href: 'https://support.example.com',
            },
          ]}
        />
      </div>
    );
  },
};

/**
 * Menu with async action handlers that simulate API calls.
 */
const AsyncActions: Story = {
  args: {
    items: [],
  },
  render: (args, { globals }) => {
    const item1Label = resolveLocaleValue(globals.locale as string, asyncItem1Labels);
    const item2Label = resolveLocaleValue(globals.locale as string, asyncItem2Labels);
    const item3Label = resolveLocaleValue(globals.locale as string, asyncItem3Labels);
    const processingTemplate = resolveLocaleValue(globals.locale as string, asyncProcessingMessages);
    const completedTemplate = resolveLocaleValue(globals.locale as string, asyncCompletedMessages);

    const simulateAsyncAction = async (actionName: string) => {
      alert(processingTemplate.replace('{action}', actionName));
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(completedTemplate.replace('{action}', actionName));
    };

    return (
      <div style={{ padding: '100px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ color: 'white' }}>Async actions:</span>
        <ContextualMenu
          {...args}
          items={[
            {
              label: item1Label,
              onClick: async () => await simulateAsyncAction(item1Label),
            },
            {
              label: item2Label,
              onClick: async () => await simulateAsyncAction(item2Label),
            },
            {
              label: item3Label,
              onClick: async () => await simulateAsyncAction(item3Label),
            },
          ]}
        />
      </div>
    );
  },
};

/**
 * Menu with many items to test overflow and positioning.
 */
const ManyItems: Story = {
  args: {
    items: [],
  },
  render: (args, { globals }) => {
    const locale = globals.locale as string;
    const items = Object.values(manyItemLabels).map(messages => ({
      label: resolveLocaleValue(locale, messages),
    }));
    const alertTemplate = resolveLocaleValue(locale, manyItemsAlertMessages);

    return (
      <div style={{ padding: '100px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ color: 'white' }}>Many items:</span>
        <ContextualMenu
          {...args}
          items={items.map(item => ({
            label: item.label,
            onClick: () => alert(alertTemplate.replace('{item}', item.label)),
          }))}
        />
      </div>
    );
  },
};

/**
 * Menu positioned near the bottom of the viewport to demonstrate auto-positioning.
 */
const BottomPosition: Story = {
  args: {
    items: [],
  },
  render: (args, { globals }) => {
    const item1Label = resolveLocaleValue(globals.locale as string, bottomItem1Labels);
    const item2Label = resolveLocaleValue(globals.locale as string, bottomItem2Labels);
    const item3Label = resolveLocaleValue(globals.locale as string, bottomItem3Labels);
    const instruction = resolveLocaleValue(globals.locale as string, bottomInstructionMessages);

    return (
      <div
        style={{
          padding: '100px',
          minHeight: '400px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: 'white' }}>{instruction}</span>
          <ContextualMenu
            {...args}
            items={[
              {
                label: item1Label,
                onClick: () => alert(item1Label),
              },
              {
                label: item2Label,
                onClick: () => alert(item2Label),
              },
              {
                label: item3Label,
                onClick: () => alert(item3Label),
              },
            ]}
          />
        </div>
      </div>
    );
  },
};

export { AsyncActions, Basic, BottomPosition, ManyItems, MixedItems, WithLinks };
export default meta;
