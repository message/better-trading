import PageBookmarks from './index';
import { resolveLocaleValue, defineMessages } from '../../.storybook/locale-utils';
import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * PageBookmarks component manages bookmark folders for Path of Exile trade searches.
 * Features:
 * - Create, edit, archive, and delete bookmark folders
 * - Organize trades within folders
 * - Backup and restore all bookmarks
 * - Import/export individual folders
 * - Toggle between active and archived folders
 */
const meta = {
  component: PageBookmarks,
  title: 'Pages/PageBookmarks',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    collapseAllLabel: '',
    showArchivedLabel: '',
    showUnarchivedLabel: '',
    createFolderLabel: '',
    importFolderLabel: '',
    foldersWarningMessage: '',
    backupTitle: '',
    generateBackupLabel: '',
    restoreBackupLabel: '',
    folderModalTitle: '',
    folderTitleLabel: '',
    folderIconLabel: '',
    saveLabel: '',
    importModalTitle: '',
    importCodeLabel: '',
    importPreviewLabel: () => '',
    invalidCodeMessage: '',
    editFolderLabel: '',
    archiveFolderLabel: '',
    restoreFolderLabel: '',
    deleteFolderLabel: '',
    exportFolderLabel: '',
    createTradeLabel: '',
    copyTradeLabel: '',
    openLiveTradeLabel: '',
    updateTradeLocationLabel: '',
    completeTradeLabel: '',
    uncompleteTradeLabel: '',
    editTradeLabel: '',
    deleteTradeLabel: '',
    deleteFolderSuccessMessage: () => '',
    createFolderSuccessMessage: () => '',
    updateFolderSuccessMessage: () => '',
    importFolderSuccessMessage: () => '',
    restoreBackupErrorMessage: '',
  },
} satisfies Meta<typeof PageBookmarks>;

type Story = StoryObj<typeof meta>;

// Localized messages for all labels and strings
const collapseAllMessages = defineMessages({
  'en-US': 'Collapse All',
  'fr-FR': 'Tout réduire',
  'es-ES': 'Contraer todo',
  'de-DE': 'Alle einklappen',
  'pt-BR': 'Recolher tudo',
  'ru-RU': 'Свернуть все',
  'zh-CN': '全部折叠',
  'ja-JP': 'すべて折りたたむ',
  'ko-KR': '모두 접기',
  'th-TH': 'ยุบทั้งหมด',
});

const showArchivedMessages = defineMessages({
  'en-US': 'Show Archived Folders',
  'fr-FR': 'Afficher les dossiers archivés',
  'es-ES': 'Mostrar carpetas archivadas',
  'de-DE': 'Archivierte Ordner anzeigen',
  'pt-BR': 'Mostrar pastas arquivadas',
  'ru-RU': 'Показать архивированные папки',
  'zh-CN': '显示已存档文件夹',
  'ja-JP': 'アーカイブしたフォルダを表示',
  'ko-KR': '보관된 폴더 표시',
  'th-TH': 'แสดงโฟลเดอร์ที่เก็บถาวร',
});

const showUnarchivedMessages = defineMessages({
  'en-US': 'Show Active Folders',
  'fr-FR': 'Afficher les dossiers actifs',
  'es-ES': 'Mostrar carpetas activas',
  'de-DE': 'Aktive Ordner anzeigen',
  'pt-BR': 'Mostrar pastas ativas',
  'ru-RU': 'Показать активные папки',
  'zh-CN': '显示活动文件夹',
  'ja-JP': 'アクティブなフォルダを表示',
  'ko-KR': '활성 폴더 표시',
  'th-TH': 'แสดงโฟลเดอร์ที่ใช้งานอยู่',
});

const createFolderMessages = defineMessages({
  'en-US': 'Create Folder',
  'fr-FR': 'Créer un dossier',
  'es-ES': 'Crear carpeta',
  'de-DE': 'Ordner erstellen',
  'pt-BR': 'Criar pasta',
  'ru-RU': 'Создать папку',
  'zh-CN': '创建文件夹',
  'ja-JP': 'フォルダを作成',
  'ko-KR': '폴더 만들기',
  'th-TH': 'สร้างโฟลเดอร์',
});

const importFolderMessages = defineMessages({
  'en-US': 'Import Folder',
  'fr-FR': 'Importer un dossier',
  'es-ES': 'Importar carpeta',
  'de-DE': 'Ordner importieren',
  'pt-BR': 'Importar pasta',
  'ru-RU': 'Импортировать папку',
  'zh-CN': '导入文件夹',
  'ja-JP': 'フォルダをインポート',
  'ko-KR': '폴더 가져오기',
  'th-TH': 'นำเข้าโฟลเดอร์',
});

const foldersWarningMessages = defineMessages({
  'en-US': 'You have many folders. Consider archiving old ones to improve performance.',
  'fr-FR': 'Vous avez beaucoup de dossiers. Pensez à archiver les anciens pour améliorer les performances.',
  'es-ES': 'Tienes muchas carpetas. Considera archivar las antiguas para mejorar el rendimiento.',
  'de-DE': 'Sie haben viele Ordner. Erwägen Sie, alte zu archivieren, um die Leistung zu verbessern.',
  'pt-BR': 'Você tem muitas pastas. Considere arquivar as antigas para melhorar o desempenho.',
  'ru-RU': 'У вас много папок. Рассмотрите возможность архивирования старых для повышения производительности.',
  'zh-CN': '你有很多文件夹。考虑归档旧文件夹以提高性能。',
  'ja-JP': 'フォルダが多すぎます。パフォーマンスを向上させるために、古いものをアーカイブすることを検討してください。',
  'ko-KR': '폴더가 많습니다. 성능 향상을 위해 오래된 폴더를 보관하는 것을 고려하세요.',
  'th-TH': 'คุณมีโฟลเดอร์มากมาย พิจารณาเก็บถาวรโฟลเดอร์เก่าเพื่อปรับปรุงประสิทธิภาพ',
});

const backupTitleMessages = defineMessages({
  'en-US': 'Backup & Restore',
  'fr-FR': 'Sauvegarde et restauration',
  'es-ES': 'Copia de seguridad y restauración',
  'de-DE': 'Sicherung & Wiederherstellung',
  'pt-BR': 'Backup e restauração',
  'ru-RU': 'Резервное копирование и восстановление',
  'zh-CN': '备份与恢复',
  'ja-JP': 'バックアップと復元',
  'ko-KR': '백업 및 복원',
  'th-TH': 'สำรองและกู้คืน',
});

const generateBackupMessages = defineMessages({
  'en-US': 'Export Backup',
  'fr-FR': 'Exporter la sauvegarde',
  'es-ES': 'Exportar copia',
  'de-DE': 'Sicherung exportieren',
  'pt-BR': 'Exportar backup',
  'ru-RU': 'Экспортировать резервную копию',
  'zh-CN': '导出备份',
  'ja-JP': 'バックアップをエクスポート',
  'ko-KR': '백업 내보내기',
  'th-TH': 'ส่งออกการสำรอง',
});

const restoreBackupMessages = defineMessages({
  'en-US': 'Restore Backup',
  'fr-FR': 'Restaurer la sauvegarde',
  'es-ES': 'Restaurar copia',
  'de-DE': 'Sicherung wiederherstellen',
  'pt-BR': 'Restaurar backup',
  'ru-RU': 'Восстановить резервную копию',
  'zh-CN': '恢复备份',
  'ja-JP': 'バックアップを復元',
  'ko-KR': '백업 복원',
  'th-TH': 'กู้คืนการสำรอง',
});

const folderModalTitleMessages = defineMessages({
  'en-US': 'Edit Folder',
  'fr-FR': 'Modifier le dossier',
  'es-ES': 'Editar carpeta',
  'de-DE': 'Ordner bearbeiten',
  'pt-BR': 'Editar pasta',
  'ru-RU': 'Редактировать папку',
  'zh-CN': '编辑文件夹',
  'ja-JP': 'フォルダを編集',
  'ko-KR': '폴더 편집',
  'th-TH': 'แก้ไขโฟลเดอร์',
});

const folderTitleLabelMessages = defineMessages({
  'en-US': 'Folder Name',
  'fr-FR': 'Nom du dossier',
  'es-ES': 'Nombre de carpeta',
  'de-DE': 'Ordnername',
  'pt-BR': 'Nome da pasta',
  'ru-RU': 'Имя папки',
  'zh-CN': '文件夹名称',
  'ja-JP': 'フォルダ名',
  'ko-KR': '폴더 이름',
  'th-TH': 'ชื่อโฟลเดอร์',
});

const folderIconLabelMessages = defineMessages({
  'en-US': 'Select Icon',
  'fr-FR': 'Sélectionner une icône',
  'es-ES': 'Seleccionar icono',
  'de-DE': 'Symbol auswählen',
  'pt-BR': 'Selecionar ícone',
  'ru-RU': 'Выбрать иконку',
  'zh-CN': '选择图标',
  'ja-JP': 'アイコンを選択',
  'ko-KR': '아이콘 선택',
  'th-TH': 'เลือกไอคอน',
});

const saveLabelMessages = defineMessages({
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

const importModalTitleMessages = defineMessages({
  'en-US': 'Import Folder',
  'fr-FR': 'Importer un dossier',
  'es-ES': 'Importar carpeta',
  'de-DE': 'Ordner importieren',
  'pt-BR': 'Importar pasta',
  'ru-RU': 'Импортировать папку',
  'zh-CN': '导入文件夹',
  'ja-JP': 'フォルダをインポート',
  'ko-KR': '폴더 가져오기',
  'th-TH': 'นำเข้าโฟลเดอร์',
});

const importCodeLabelMessages = defineMessages({
  'en-US': 'Paste Import Code',
  'fr-FR': "Coller le code d'importation",
  'es-ES': 'Pegar código de importación',
  'de-DE': 'Importcode einfügen',
  'pt-BR': 'Colar código de importação',
  'ru-RU': 'Вставить код импорта',
  'zh-CN': '粘贴导入代码',
  'ja-JP': 'インポートコードを貼り付け',
  'ko-KR': '가져오기 코드 붙여넣기',
  'th-TH': 'วางรหัสนำเข้า',
});

const invalidCodeMessages = defineMessages({
  'en-US': 'Invalid import code',
  'fr-FR': "Code d'importation invalide",
  'es-ES': 'Código de importación inválido',
  'de-DE': 'Ungültiger Importcode',
  'pt-BR': 'Código de importação inválido',
  'ru-RU': 'Неверный код импорта',
  'zh-CN': '无效的导入代码',
  'ja-JP': '無効なインポートコード',
  'ko-KR': '잘못된 가져오기 코드',
  'th-TH': 'รหัสนำเข้าไม่ถูกต้อง',
});

const editFolderMessages = defineMessages({
  'en-US': 'Edit Folder',
  'fr-FR': 'Modifier le dossier',
  'es-ES': 'Editar carpeta',
  'de-DE': 'Ordner bearbeiten',
  'pt-BR': 'Editar pasta',
  'ru-RU': 'Редактировать папку',
  'zh-CN': '编辑文件夹',
  'ja-JP': 'フォルダを編集',
  'ko-KR': '폴더 편집',
  'th-TH': 'แก้ไขโฟลเดอร์',
});

const archiveFolderMessages = defineMessages({
  'en-US': 'Archive Folder',
  'fr-FR': 'Archiver le dossier',
  'es-ES': 'Archivar carpeta',
  'de-DE': 'Ordner archivieren',
  'pt-BR': 'Arquivar pasta',
  'ru-RU': 'Архивировать папку',
  'zh-CN': '存档文件夹',
  'ja-JP': 'フォルダをアーカイブ',
  'ko-KR': '폴더 보관',
  'th-TH': 'เก็บถาวรโฟลเดอร์',
});

const restoreFolderMessages = defineMessages({
  'en-US': 'Restore Folder',
  'fr-FR': 'Restaurer le dossier',
  'es-ES': 'Restaurar carpeta',
  'de-DE': 'Ordner wiederherstellen',
  'pt-BR': 'Restaurar pasta',
  'ru-RU': 'Восстановить папку',
  'zh-CN': '恢复文件夹',
  'ja-JP': 'フォルダを復元',
  'ko-KR': '폴더 복원',
  'th-TH': 'กู้คืนโฟลเดอร์',
});

const deleteFolderMessages = defineMessages({
  'en-US': 'Delete Folder',
  'fr-FR': 'Supprimer le dossier',
  'es-ES': 'Eliminar carpeta',
  'de-DE': 'Ordner löschen',
  'pt-BR': 'Excluir pasta',
  'ru-RU': 'Удалить папку',
  'zh-CN': '删除文件夹',
  'ja-JP': 'フォルダを削除',
  'ko-KR': '폴더 삭제',
  'th-TH': 'ลบโฟลเดอร์',
});

const exportFolderMessages = defineMessages({
  'en-US': 'Export Folder',
  'fr-FR': 'Exporter le dossier',
  'es-ES': 'Exportar carpeta',
  'de-DE': 'Ordner exportieren',
  'pt-BR': 'Exportar pasta',
  'ru-RU': 'Экспортировать папку',
  'zh-CN': '导出文件夹',
  'ja-JP': 'フォルダをエクスポート',
  'ko-KR': '폴더 내보내기',
  'th-TH': 'ส่งออกโฟลเดอร์',
});

const createTradeMessages = defineMessages({
  'en-US': 'Add Trade',
  'fr-FR': 'Ajouter un échange',
  'es-ES': 'Añadir intercambio',
  'de-DE': 'Handel hinzufügen',
  'pt-BR': 'Adicionar negociação',
  'ru-RU': 'Добавить обмен',
  'zh-CN': '添加交易',
  'ja-JP': '取引を追加',
  'ko-KR': '거래 추가',
  'th-TH': 'เพิ่มการซื้อขาย',
});

const copyTradeMessages = defineMessages({
  'en-US': 'Copy to Clipboard',
  'fr-FR': 'Copier dans le presse-papiers',
  'es-ES': 'Copiar al portapapeles',
  'de-DE': 'In Zwischenablage kopieren',
  'pt-BR': 'Copiar para a área de transferência',
  'ru-RU': 'Скопировать в буфер обмена',
  'zh-CN': '复制到剪贴板',
  'ja-JP': 'クリップボードにコピー',
  'ko-KR': '클립보드에 복사',
  'th-TH': 'คัดลอกไปยังคลิปบอร์ด',
});

const openLiveTradeMessages = defineMessages({
  'en-US': 'Open Live Search',
  'fr-FR': 'Ouvrir la recherche en direct',
  'es-ES': 'Abrir búsqueda en vivo',
  'de-DE': 'Live-Suche öffnen',
  'pt-BR': 'Abrir pesquisa ao vivo',
  'ru-RU': 'Открыть живой поиск',
  'zh-CN': '打开实时搜索',
  'ja-JP': 'ライブ検索を開く',
  'ko-KR': '실시간 검색 열기',
  'th-TH': 'เปิดการค้นหาสด',
});

const updateTradeLocationMessages = defineMessages({
  'en-US': 'Update to Current Search',
  'fr-FR': 'Mettre à jour vers la recherche actuelle',
  'es-ES': 'Actualizar a la búsqueda actual',
  'de-DE': 'Auf aktuelle Suche aktualisieren',
  'pt-BR': 'Atualizar para pesquisa atual',
  'ru-RU': 'Обновить до текущего поиска',
  'zh-CN': '更新为当前搜索',
  'ja-JP': '現在の検索に更新',
  'ko-KR': '현재 검색으로 업데이트',
  'th-TH': 'อัปเดตเป็นการค้นหาปัจจุบัน',
});

const completeTradeMessages = defineMessages({
  'en-US': 'Mark as Complete',
  'fr-FR': 'Marquer comme terminé',
  'es-ES': 'Marcar como completado',
  'de-DE': 'Als abgeschlossen markieren',
  'pt-BR': 'Marcar como concluído',
  'ru-RU': 'Отметить как завершенное',
  'zh-CN': '标记为完成',
  'ja-JP': '完了としてマーク',
  'ko-KR': '완료로 표시',
  'th-TH': 'ทำเครื่องหมายว่าเสร็จสิ้น',
});

const uncompleteTradeMessages = defineMessages({
  'en-US': 'Mark as Incomplete',
  'fr-FR': 'Marquer comme non terminé',
  'es-ES': 'Marcar como incompleto',
  'de-DE': 'Als unvollständig markieren',
  'pt-BR': 'Marcar como incompleto',
  'ru-RU': 'Отметить как незавершенное',
  'zh-CN': '标记为未完成',
  'ja-JP': '未完了としてマーク',
  'ko-KR': '미완료로 표시',
  'th-TH': 'ทำเครื่องหมายว่ายังไม่เสร็จ',
});

const editTradeMessages = defineMessages({
  'en-US': 'Edit Trade',
  'fr-FR': "Modifier l'échange",
  'es-ES': 'Editar intercambio',
  'de-DE': 'Handel bearbeiten',
  'pt-BR': 'Editar negociação',
  'ru-RU': 'Редактировать обмен',
  'zh-CN': '编辑交易',
  'ja-JP': '取引を編集',
  'ko-KR': '거래 편집',
  'th-TH': 'แก้ไขการซื้อขาย',
});

const deleteTradeMessages = defineMessages({
  'en-US': 'Delete Trade',
  'fr-FR': "Supprimer l'échange",
  'es-ES': 'Eliminar intercambio',
  'de-DE': 'Handel löschen',
  'pt-BR': 'Excluir negociação',
  'ru-RU': 'Удалить обмен',
  'zh-CN': '删除交易',
  'ja-JP': '取引を削除',
  'ko-KR': '거래 삭제',
  'th-TH': 'ลบการซื้อขาย',
});

const restoreBackupErrorMessages = defineMessages({
  'en-US': 'Failed to restore backup. The file may be corrupted.',
  'fr-FR': 'Échec de la restauration de la sauvegarde. Le fichier peut être corrompu.',
  'es-ES': 'Error al restaurar la copia. El archivo puede estar dañado.',
  'de-DE': 'Sicherung konnte nicht wiederhergestellt werden. Die Datei ist möglicherweise beschädigt.',
  'pt-BR': 'Falha ao restaurar backup. O arquivo pode estar corrompido.',
  'ru-RU': 'Не удалось восстановить резервную копию. Файл может быть поврежден.',
  'zh-CN': '恢复备份失败。文件可能已损坏。',
  'ja-JP': 'バックアップの復元に失敗しました。ファイルが破損している可能性があります。',
  'ko-KR': '백업 복원에 실패했습니다. 파일이 손상되었을 수 있습니다.',
  'th-TH': 'การกู้คืนการสำรองล้มเหลว ไฟล์อาจเสียหาย',
});

export const Default: Story = {
  name: 'Bookmarks Page',
  args: {},
  render: (args, { globals }) => {
    const locale = globals.locale as string;
    return (
      <PageBookmarks
        collapseAllLabel={resolveLocaleValue(locale, collapseAllMessages)}
        showArchivedLabel={resolveLocaleValue(locale, showArchivedMessages)}
        showUnarchivedLabel={resolveLocaleValue(locale, showUnarchivedMessages)}
        createFolderLabel={resolveLocaleValue(locale, createFolderMessages)}
        importFolderLabel={resolveLocaleValue(locale, importFolderMessages)}
        foldersWarningMessage={resolveLocaleValue(locale, foldersWarningMessages)}
        backupTitle={resolveLocaleValue(locale, backupTitleMessages)}
        generateBackupLabel={resolveLocaleValue(locale, generateBackupMessages)}
        restoreBackupLabel={resolveLocaleValue(locale, restoreBackupMessages)}
        folderModalTitle={resolveLocaleValue(locale, folderModalTitleMessages)}
        folderTitleLabel={resolveLocaleValue(locale, folderTitleLabelMessages)}
        folderIconLabel={resolveLocaleValue(locale, folderIconLabelMessages)}
        saveLabel={resolveLocaleValue(locale, saveLabelMessages)}
        importModalTitle={resolveLocaleValue(locale, importModalTitleMessages)}
        importCodeLabel={resolveLocaleValue(locale, importCodeLabelMessages)}
        importPreviewLabel={(name, count) => `${name} (${count} trades)`}
        invalidCodeMessage={resolveLocaleValue(locale, invalidCodeMessages)}
        editFolderLabel={resolveLocaleValue(locale, editFolderMessages)}
        archiveFolderLabel={resolveLocaleValue(locale, archiveFolderMessages)}
        restoreFolderLabel={resolveLocaleValue(locale, restoreFolderMessages)}
        deleteFolderLabel={resolveLocaleValue(locale, deleteFolderMessages)}
        exportFolderLabel={resolveLocaleValue(locale, exportFolderMessages)}
        createTradeLabel={resolveLocaleValue(locale, createTradeMessages)}
        copyTradeLabel={resolveLocaleValue(locale, copyTradeMessages)}
        openLiveTradeLabel={resolveLocaleValue(locale, openLiveTradeMessages)}
        updateTradeLocationLabel={resolveLocaleValue(locale, updateTradeLocationMessages)}
        completeTradeLabel={resolveLocaleValue(locale, completeTradeMessages)}
        uncompleteTradeLabel={resolveLocaleValue(locale, uncompleteTradeMessages)}
        editTradeLabel={resolveLocaleValue(locale, editTradeMessages)}
        deleteTradeLabel={resolveLocaleValue(locale, deleteTradeMessages)}
        deleteFolderSuccessMessage={title => `Deleted ${title}`}
        createFolderSuccessMessage={title => `Created ${title}`}
        updateFolderSuccessMessage={title => `Updated ${title}`}
        importFolderSuccessMessage={title => `Imported ${title}`}
        restoreBackupErrorMessage={resolveLocaleValue(locale, restoreBackupErrorMessages)}
      />
    );
  },
};

export default meta;
