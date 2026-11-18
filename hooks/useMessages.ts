import { i18n } from '#i18n';
import { useMemo } from 'react';
import type { GeneratedI18nStructure } from '#i18n';

type EnhancerTitleKey = Extract<keyof GeneratedI18nStructure, `pageAboutEnhancers${string}`>;

// 'equivalent-pricings' -> 'EquivalentPricings'
const slugToPascalCase = (slug: string) =>
  slug
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

// Falls back to the slug itself for enhancers without a title (the key is unknown at type level)
const getEnhancerTitle = (slug: string): string =>
  i18n.t(`pageAboutEnhancers${slugToPascalCase(slug)}` as EnhancerTitleKey) || slug;

const buildMessages = () => ({
  genericAlertMessage: i18n.t('genericAlertFlash'),

  header: {
    title: i18n.t('generalTitle'),
    logoAlt: i18n.t('logoAlt'),
    collapseLabel: i18n.t('headerCollapse'),
    showAboutLabel: i18n.t('headerShowAbout'),
    showMainLabel: i18n.t('headerShowMain'),
  },

  expandButton: {
    logoAlt: i18n.t('logoAlt'),
    expandLabel: i18n.t('headerExpand'),
  },

  rootPageMenu: {
    ariaLabel: i18n.t('rootPageMenuLabel'),
    labels: {
      bookmarks: i18n.t('rootPageMenuBookmarks'),
      pinnedItems: i18n.t('rootPageMenuPinnedItems'),
      history: i18n.t('rootPageMenuHistory'),
    },
  },

  /** Modal strings, for callers that render a Modal outside of a Page* component */
  modal: {
    closeLabel: i18n.t('modalClose'),
    logoAlt: i18n.t('logoAlt'),
  },

  /** Depends on the version, so it is a function: `<ChangelogBanner {...messages.changelogBanner(version)} />` */
  changelogBanner: (version: string) => ({
    noticeText: i18n.t('changelogBannerNotice', [version]),
    modalTitle: i18n.t('changelogBannerModalTitle', [version]),
    modalButtonLabel: i18n.t('changelogBannerModalButton'),
    dismissButtonLabel: i18n.t('changelogBannerDismissButton'),
    modalCloseLabel: i18n.t('modalClose'),
    logoAlt: i18n.t('logoAlt'),
  }),

  clipboardTextarea: {
    buttonLabel: i18n.t('clipboardTextareaButton'),
    buttonCopiedLabel: i18n.t('clipboardTextareaButtonCopied'),
  },

  pageAbout: {
    enhancersTitle: i18n.t('pageAboutEnhancersTitle'),
    getEnhancerTitle,
    githubTitle: i18n.t('pageAboutGithubTitle'),
    githubDescription: i18n.t('pageAboutGithubDescription'),
    githubButtonLabel: i18n.t('pageAboutGithubButton'),
    creditsTitle: i18n.t('pageAboutCreditsTitle'),
    creditsDescription: i18n.t('pageAboutCreditsDescription'),
    disclaimer: i18n.t('pageAboutDisclaimer'),
  },

  pagePinnedItems: {
    warningMessage: i18n.t('pagePinnedItemsWarning'),
    clearLabel: i18n.t('pagePinnedItemsClear'),
    emptyMessage: i18n.t('pagePinnedItemsEmpty'),
    unpinItemLabel: i18n.t('pagePinnedItemsUnpinItem'),
    scrollToItemLabel: i18n.t('pagePinnedItemsScrollToItem'),
    genericAlertMessage: i18n.t('genericAlertFlash'),
  },

  pageHistory: {
    clearButtonLabel: i18n.t('pageHistoryClear'),
    emptyMessage: i18n.t('pageHistoryEmpty'),
    clearSuccessMessage: i18n.t('pageHistoryClearSuccessFlash'),
    genericAlertMessage: i18n.t('genericAlertFlash'),
  },

  pageBookmarks: {
    collapseAllLabel: i18n.t('pageBookmarksCollapseAll'),
    showArchivedLabel: i18n.t('pageBookmarksShowArchivedFolders'),
    showUnarchivedLabel: i18n.t('pageBookmarksShowUnarchivedFolders'),
    createFolderLabel: i18n.t('pageBookmarksCreateFolder'),
    importFolderLabel: i18n.t('pageBookmarksImportFolder'),
    foldersWarningMessage: i18n.t('pageBookmarksFoldersWarning'),
    backupTitle: i18n.t('pageBookmarksBackupTitle'),
    generateBackupLabel: i18n.t('pageBookmarksBackupGenerateButton'),
    restoreBackupLabel: i18n.t('pageBookmarksBackupRestoreButton'),
    folderModalTitle: i18n.t('pageBookmarksFolderEditionModalTitle'),
    folderTitleLabel: i18n.t('pageBookmarksFolderEditionTitleLabel'),
    folderIconLabel: i18n.t('pageBookmarksFolderEditionIconLabel'),
    saveLabel: i18n.t('pageBookmarksFolderEditionSave'),
    importModalTitle: i18n.t('pageBookmarksFolderImportModalTitle'),
    importCodeLabel: i18n.t('pageBookmarksFolderImportImportCodeLabel'),
    importPreviewLabel: (name: string, tradesCount: number) =>
      i18n.t('pageBookmarksFolderImportPreview', tradesCount, [name, String(tradesCount)]),
    invalidCodeMessage: i18n.t('pageBookmarksFolderImportInvalidCode'),
    editFolderLabel: i18n.t('pageBookmarksFolderEditFolder'),
    archiveFolderLabel: i18n.t('pageBookmarksFolderArchiveFolder'),
    restoreFolderLabel: i18n.t('pageBookmarksFolderRestoreFolder'),
    deleteFolderLabel: i18n.t('pageBookmarksFolderDeleteFolder'),
    exportFolderLabel: i18n.t('pageBookmarksFolderExportFolder'),
    createTradeLabel: i18n.t('pageBookmarksFolderCreateTrade'),
    copyTradeLabel: i18n.t('pageBookmarksFolderCopyTradeToClipboard'),
    openLiveTradeLabel: i18n.t('pageBookmarksFolderOpenLiveTrade'),
    updateTradeLocationLabel: i18n.t('pageBookmarksFolderUpdateTradeLocation'),
    completeTradeLabel: i18n.t('pageBookmarksFolderCompleteTrade'),
    uncompleteTradeLabel: i18n.t('pageBookmarksFolderUncompleteTrade'),
    editTradeLabel: i18n.t('pageBookmarksFolderEditTrade'),
    deleteTradeLabel: i18n.t('pageBookmarksFolderDeleteTrade'),
    deleteFolderSuccessMessage: (title: string) => i18n.t('pageBookmarksDeleteFolderSuccessFlash', [title]),
    createFolderSuccessMessage: (title: string) => i18n.t('pageBookmarksCreateFolderSuccessFlash', [title]),
    updateFolderSuccessMessage: (title: string) => i18n.t('pageBookmarksUpdateFolderSuccessFlash', [title]),
    importFolderSuccessMessage: (title: string) => i18n.t('pageBookmarksImportFolderSuccessFlash', [title]),
    copyTradeSuccessMessage: (title: string) => i18n.t('pageBookmarksFolderCopyTradeToClipboardSuccessFlash', [title]),
    restoreBackupErrorMessage: i18n.t('pageBookmarksBackupRestoreErrorFlash'),
    genericAlertMessage: i18n.t('genericAlertFlash'),
    modalCloseLabel: i18n.t('modalClose'),
    logoAlt: i18n.t('logoAlt'),
  },

  /** For the item results enhancer services (not React components) */
  itemResults: {
    pinLabel: i18n.t('itemResultsPinnablePin'),
    unpinLabel: i18n.t('itemResultsPinnableUnpin'),
    maximumSocketsWarning: (maximum: number) => i18n.t('itemResultsMaximumSocketsWarning', [maximum]),
    regroupSimilarsLabel: (count: number) => i18n.t('itemResultsRegroupSimilarsButton', count),
    genericAlertMessage: i18n.t('genericAlertFlash'),
  },
});

type Messages = ReturnType<typeof buildMessages>;

const useMessages = (): Messages => useMemo(buildMessages, []);

export { useMessages, getEnhancerTitle };
export type { Messages };
