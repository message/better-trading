// React version of the former Ember `page/bookmarks` component.
// Migrated from: old-extension/app/pods/components/page/bookmarks
// Responsibilities:
//  - Display and manage bookmark folders for Path of Exile trade searches
//  - Handle folder creation, editing, archiving, deletion, and reordering
//  - Handle backup/restore functionality
//  - Show applicable folders based on current PoE version
//  - Toggle between active and archived folders

import Backup from './Backup';
import Folder from './Folder';
import FolderEdition from './FolderEdition';
import FolderExport from './FolderExport';
import FolderImport from './FolderImport';
import styles from './styles.module.scss';
import TradeDeletion from './TradeDeletion';
import TradeEdition from './TradeEdition';
import AlertMessage from '../AlertMessage';
import Button from '../Button';
import LoadingContainer from '../LoadingContainer';
import ArchiveIcon from '@/assets/icons/filled/archive.svg?react';
import CollapseAllIcon from '@/assets/icons/filled/collapse-all-b.svg?react';
import ImportPobIcon from '@/assets/icons/filled/import-pob.svg?react';
import ReturnToActiveFoldersIcon from '@/assets/icons/filled/return-to-active-folders.svg?react';
import FolderPlusIcon from '@/assets/icons/solid/folder-plus.svg?react';
import SquarePlusIcon from '@/assets/icons/solid/square-plus.svg?react';
import { useFlashMessagesContext } from '@/contexts/FlashMessagesContext';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useBookmarksState } from '@/hooks/useBookmarksState';
import { usePreviewOrder } from '@/hooks/useSortable';
import { useTradeLocation } from '@/hooks/useTradeLocation';
import { copyToClipboard } from '@/utils/copy-to-clipboard';
import { convertPobBuildCode } from '@/utils/extension-background';
import { recommendTitle } from '@/utils/search-panel';
import { getTradeUrl } from '@/utils/trade-location';
import { reorder } from '@atlaskit/pragmatic-drag-and-drop/utils/reorder';
import {
  autoScrollForElements,
  autoScrollWindowForElements,
} from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { useState, useCallback, useEffect, useId } from 'react';
import type { BookmarksFolderStruct, BookmarksTradeStruct } from '@/types/bookmarks';
import type React from 'react';

const FOLDERS_WARNING_THRESHOLD = 10;

/** A Trade being created or edited in the Folder `folderId` */
interface StagedTrade {
  folderId: string;
  trade: BookmarksTradeStruct;
}

/** A Trade awaiting deletion confirmation */
interface StagedDeletingTrade {
  folderId: string;
  trade: BookmarksTradeStruct;
}

interface PageBookmarksProps {
  // Localized strings
  collapseAllLabel: string;
  showArchivedLabel: string;
  showUnarchivedLabel: string;
  createFolderLabel: string;
  importFolderLabel: string;
  importPobLabel: string;
  foldersWarningMessage: string;
  backupTitle: string;
  generateBackupLabel: string;
  restoreBackupLabel: string;
  folderModalTitle: string;
  folderTitleLabel: string;
  folderIconLabel: string;
  saveLabel: string;
  importModalTitle: string;
  importCodeLabel: string;
  importPreviewLabel: (name: string, tradesCount: number) => string;
  invalidCodeMessage: string;
  importPobModalTitle: string;
  importPobCodeLabel: string;
  invalidPobCodeMessage: string;
  exportModalTitle: string;
  exportCodeLabel: string;
  exportCodeHelper: string;
  exportCloseLabel: string;
  copyToClipboardLabel: string;
  copiedToClipboardLabel: string;
  // Folder/Trade labels
  editFolderLabel: string;
  archiveFolderLabel: string;
  restoreFolderLabel: string;
  deleteFolderLabel: string;
  exportFolderLabel: string;
  createTradeLabel: string;
  copyTradeLabel: string;
  openLiveTradeLabel: string;
  updateTradeLocationLabel: string;
  completeTradeLabel: string;
  uncompleteTradeLabel: string;
  editTradeLabel: string;
  deleteTradeLabel: string;
  /** Drag handle label of Folders and Trades (also reorderable with the arrow keys) */
  reorderLabel: string;
  tradeModalTitle: string;
  tradeTitleLabel: string;
  tradeDeletionModalTitle: string;
  tradeDeletionConfirmation: (title: string) => string;
  tradeDeletionDeleteLabel: string;
  tradeDeletionCancelLabel: string;
  createTradeSuccessMessage: (title: string) => string;
  updateTradeSuccessMessage: (title: string) => string;
  deleteTradeSuccessMessage: (title: string) => string;
  updateTradeLocationSuccessMessage: (title: string) => string;
  deleteFolderSuccessMessage: (title: string) => string;
  createFolderSuccessMessage: (title: string) => string;
  updateFolderSuccessMessage: (title: string) => string;
  importFolderSuccessMessage: (title: string) => string;
  copyTradeSuccessMessage: (title: string) => string;
  restoreBackupErrorMessage: string;
  genericAlertMessage: string;
  modalCloseLabel: string;
  logoAlt: string;
}

const PageBookmarks: React.FC<PageBookmarksProps> = ({
  collapseAllLabel,
  showArchivedLabel,
  showUnarchivedLabel,
  createFolderLabel,
  importFolderLabel,
  importPobLabel,
  foldersWarningMessage,
  backupTitle,
  generateBackupLabel,
  restoreBackupLabel,
  folderModalTitle,
  folderTitleLabel,
  folderIconLabel,
  saveLabel,
  importModalTitle,
  importCodeLabel,
  importPreviewLabel,
  invalidCodeMessage,
  importPobModalTitle,
  importPobCodeLabel,
  invalidPobCodeMessage,
  exportModalTitle,
  exportCodeLabel,
  exportCodeHelper,
  exportCloseLabel,
  copyToClipboardLabel,
  copiedToClipboardLabel,
  editFolderLabel,
  archiveFolderLabel,
  restoreFolderLabel,
  deleteFolderLabel,
  exportFolderLabel,
  createTradeLabel,
  copyTradeLabel,
  openLiveTradeLabel,
  updateTradeLocationLabel,
  completeTradeLabel,
  uncompleteTradeLabel,
  editTradeLabel,
  deleteTradeLabel,
  reorderLabel,
  tradeModalTitle,
  tradeTitleLabel,
  tradeDeletionModalTitle,
  tradeDeletionConfirmation,
  tradeDeletionDeleteLabel,
  tradeDeletionCancelLabel,
  createTradeSuccessMessage,
  updateTradeSuccessMessage,
  deleteTradeSuccessMessage,
  updateTradeLocationSuccessMessage,
  deleteFolderSuccessMessage,
  createFolderSuccessMessage,
  updateFolderSuccessMessage,
  importFolderSuccessMessage,
  copyTradeSuccessMessage,
  restoreBackupErrorMessage,
  genericAlertMessage,
  modalCloseLabel,
  logoAlt,
}) => {
  const bookmarks = useBookmarks();
  const { addFlash } = useFlashMessagesContext();
  const { expandedFolderIds, toggleFolderExpansion, collapseAllFolders } = useBookmarksState();
  const { version, league, type, slug } = useTradeLocation();

  const [stagedFolder, setStagedFolder] = useState<BookmarksFolderStruct | null>(null);
  const [importing, setImporting] = useState<'folder' | 'pob' | null>(null);
  const [exportString, setExportString] = useState<string | null>(null);
  const [isShowingArchivedFolders, setIsShowingArchivedFolders] = useState(false);
  const [stagedTrade, setStagedTrade] = useState<StagedTrade | null>(null);
  const [stagedDeletingTrade, setStagedDeletingTrade] = useState<StagedDeletingTrade | null>(null);

  const { refreshFolders, fetchTradesByFolderId, serializeFolder, generateBackup } = bookmarks;

  // The initial fetch is the LoadingContainer task; afterwards refetch on window focus so that changes made
  // in another tab show up (same as 1.9.1). Depend on the stable function, not on `bookmarks`: it changes
  // after every refresh.
  useEffect(() => {
    const handleFocus = () => void refreshFolders();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refreshFolders]);

  // Scroll while dragging near an edge: the extension panel scrolls, Storybook (no panel) scrolls the window
  useEffect(() => {
    const panel = document.getElementById('better-trading-container');
    return panel ? autoScrollForElements({ element: panel }) : autoScrollWindowForElements();
  }, []);

  // Computed values
  const applicableFolders = bookmarks.folders.filter(folder => folder.version === version);
  const activeFolders = applicableFolders.filter(folder => !folder.archivedAt);
  const archivedFolders = applicableFolders.filter(folder => Boolean(folder.archivedAt));
  const displayedFolders = isShowingArchivedFolders ? archivedFolders : activeFolders;
  const hasArchivedFolders = archivedFolders.length > 0;
  const hasActiveFolders = activeFolders.length > 0;
  const foldersWarningIsVisible = !isShowingArchivedFolders && displayedFolders.length >= FOLDERS_WARNING_THRESHOLD;

  // Leave the archive view once it runs empty (restore, delete or a change in another tab): its toggle is hidden then
  if (isShowingArchivedFolders && !hasArchivedFolders) setIsShowingArchivedFolders(false);

  const handleDeleteFolder = useCallback(
    async (folder: BookmarksFolderStruct) => {
      try {
        await bookmarks.deleteFolder(folder);
        addFlash(deleteFolderSuccessMessage(folder.title), 'success');
      } catch {
        addFlash(genericAlertMessage, 'alert');
      }
    },
    [bookmarks, deleteFolderSuccessMessage, genericAlertMessage, addFlash],
  );

  const handleToggleFolderArchive = useCallback(
    async (folder: BookmarksFolderStruct) => {
      await bookmarks.toggleFolderArchive(folder);
    },
    [bookmarks],
  );

  const handlePersistFolder = useCallback(
    async (folder: BookmarksFolderStruct) => {
      try {
        const isNewlyCreated = !folder.id;
        const folderId = await bookmarks.persistFolder(folder);

        if (isNewlyCreated) {
          toggleFolderExpansion(folderId);
        }

        const successMessage = isNewlyCreated
          ? createFolderSuccessMessage(folder.title)
          : updateFolderSuccessMessage(folder.title);
        addFlash(successMessage, 'success');
      } catch {
        addFlash(genericAlertMessage, 'alert');
      } finally {
        setStagedFolder(null);
      }
    },
    [
      bookmarks,
      toggleFolderExpansion,
      createFolderSuccessMessage,
      updateFolderSuccessMessage,
      genericAlertMessage,
      addFlash,
    ],
  );

  const handlePersistImportedFolder = useCallback(
    async (data: { folder: BookmarksFolderStruct; trades: BookmarksTradeStruct[] }) => {
      try {
        const folderId = await bookmarks.persistFolder(data.folder);
        await bookmarks.persistTrades(data.trades, folderId);
        toggleFolderExpansion(folderId);
        addFlash(importFolderSuccessMessage(data.folder.title), 'success');
      } catch {
        addFlash(genericAlertMessage, 'alert');
      } finally {
        setImporting(null);
      }
    },
    [bookmarks, toggleFolderExpansion, importFolderSuccessMessage, genericAlertMessage, addFlash],
  );

  const handleGenerateBackup = useCallback(async () => {
    const dataString = await generateBackup();
    const blob = new Blob([dataString], { type: 'text/plain' });
    const linkElement = document.createElement('a');
    linkElement.download = 'poe-better-trading-backup.txt';
    linkElement.href = window.URL.createObjectURL(blob);
    linkElement.click();
  }, [generateBackup]);

  const handleRestoreBackup = useCallback(
    async (dataString: string) => {
      const success = await bookmarks.restoreBackup(dataString).catch(() => false);
      if (!success) {
        addFlash(restoreBackupErrorMessage, 'alert');
      }
    },
    [bookmarks, restoreBackupErrorMessage, addFlash],
  );

  const handleExportFolder = async (folder: BookmarksFolderStruct & { id: string }) => {
    try {
      setExportString(serializeFolder(folder, await fetchTradesByFolderId(folder.id)));
    } catch {
      addFlash(genericAlertMessage, 'alert');
    }
  };

  const handleToggleArchiveDisplay = () => {
    setIsShowingArchivedFolders(!isShowingArchivedFolders);
  };

  const handleCreateFolder = () => {
    const newFolder = bookmarks.initializeFolderStruct(version);
    setStagedFolder(newFolder);
  };

  const handleStageFolder = (folder: BookmarksFolderStruct) => {
    setStagedFolder(folder);
  };

  const handleUnstageFolder = () => {
    setStagedFolder(null);
  };

  const handleToggleFolderExpansion = (folderId: string) => {
    toggleFolderExpansion(folderId);
  };

  const handleCollapseAllFolders = () => {
    collapseAllFolders();
  };

  const handleImportFolder = () => {
    setImporting('folder');
  };

  const handleImportPob = () => {
    setImporting('pob');
  };

  const handleCancelImportFolder = () => {
    setImporting(null);
  };

  const { deserializeFolder } = bookmarks;
  const handleDeserializePob = useCallback(
    async (buildCode: string) => {
      const folderExportString = buildCode.trim() && (await convertPobBuildCode(buildCode));
      return folderExportString ? deserializeFolder(folderExportString) : null;
    },
    [deserializeFolder],
  );

  const handleFetchTrades = useCallback(
    async (folderId: string) => await fetchTradesByFolderId(folderId),
    [fetchTradesByFolderId],
  );

  const handleCopyTradeToClipboard = useCallback(
    async (trade: BookmarksTradeStruct) => {
      if (!league) return;
      const tradeUrl = getTradeUrl(trade.location.version, trade.location.type, trade.location.slug, league);
      try {
        await copyToClipboard(tradeUrl);
        addFlash(copyTradeSuccessMessage(trade.title), 'success');
      } catch {
        addFlash(genericAlertMessage, 'alert');
      }
    },
    [league, copyTradeSuccessMessage, genericAlertMessage, addFlash],
  );

  // A new Trade is always the current search, as in 1.9.1; nothing to save outside a search
  const handleCreateTrade = (folderId: string) => {
    if (!type || !slug) return;
    setStagedTrade({
      folderId,
      trade: { title: recommendTitle(), location: { version, type, slug }, completedAt: null },
    });
  };

  const handlePersistTrade = async (trade: BookmarksTradeStruct) => {
    if (!stagedTrade) return;
    try {
      await bookmarks.persistTrade(trade, stagedTrade.folderId);
      addFlash((trade.id ? updateTradeSuccessMessage : createTradeSuccessMessage)(trade.title), 'success');
    } catch {
      addFlash(genericAlertMessage, 'alert');
    } finally {
      setStagedTrade(null);
    }
  };

  const handleDeleteTrade = async () => {
    if (!stagedDeletingTrade) return;
    const { trade, folderId } = stagedDeletingTrade;
    try {
      await bookmarks.deleteTrade(trade, folderId);
      addFlash(deleteTradeSuccessMessage(trade.title), 'success');
    } catch {
      addFlash(genericAlertMessage, 'alert');
    } finally {
      setStagedDeletingTrade(null);
    }
  };

  const handleUpdateTradeLocation = async (trade: BookmarksTradeStruct, folderId: string) => {
    if (!type || !slug) return;
    try {
      await bookmarks.persistTrade({ ...trade, location: { version, type, slug } }, folderId);
      addFlash(updateTradeLocationSuccessMessage(trade.title), 'success');
    } catch {
      addFlash(genericAlertMessage, 'alert');
    }
  };

  const handleToggleTradeCompletion = async (trade: BookmarksTradeStruct, folderId: string) => {
    try {
      await bookmarks.toggleTradeCompletion(trade, folderId);
    } catch {
      addFlash(genericAlertMessage, 'alert');
    }
  };

  // Reorders the displayed Folders among themselves: archived and other Game Version Folders keep their slots
  const foldersListId = useId();
  const {
    items: sortedFolders,
    preview: previewFolder,
    cancel: cancelFolderPreview,
  } = usePreviewOrder(displayedFolders);
  const handleMoveFolder = (fromIndex: number, toIndex: number) => {
    const reorderedFolders = reorder({ list: displayedFolders, startIndex: fromIndex, finishIndex: toIndex });
    cancelFolderPreview();
    bookmarks.reorderFolders(reorderedFolders).catch(() => addFlash(genericAlertMessage, 'alert'));
  };

  const handleReorderTrades = async (trades: BookmarksTradeStruct[], folderId: string) => {
    try {
      await bookmarks.persistTrades(trades, folderId);
    } catch {
      addFlash(genericAlertMessage, 'alert');
      // Refreshing the Folders reloads the Trades from storage, dropping the order shown optimistically
      await refreshFolders();
    }
  };

  const handleGetTradeUrl = (trade: BookmarksTradeStruct, currentLeague: string | null) => {
    if (!currentLeague) return '#';
    return getTradeUrl(trade.location.version, trade.location.type, trade.location.slug, currentLeague);
  };

  return (
    <LoadingContainer task={bookmarks.refreshFolders} size="large">
      <div className={styles.headerActions}>
        {hasActiveFolders && !isShowingArchivedFolders && (
          <Button
            type="button"
            theme="gold"
            label={collapseAllLabel}
            icon={CollapseAllIcon}
            onClick={handleCollapseAllFolders}
          />
        )}

        {hasArchivedFolders && (
          <Button
            type="button"
            theme="gold"
            label={isShowingArchivedFolders ? showUnarchivedLabel : showArchivedLabel}
            icon={isShowingArchivedFolders ? ReturnToActiveFoldersIcon : ArchiveIcon}
            onClick={handleToggleArchiveDisplay}
          />
        )}
      </div>

      <div className={styles.foldersWrapper}>
        {sortedFolders.map((folder, folderIndex) => {
          const folderId = folder.id;
          if (!folderId) return null;
          return (
            <div key={folderId} className={styles.folderWrapper}>
              <Folder
                folder={folder as BookmarksFolderStruct & { id: string }}
                index={folderIndex}
                count={sortedFolders.length}
                listId={foldersListId}
                isExpanded={!folder.archivedAt && expandedFolderIds.includes(folderId)}
                isArchived={Boolean(folder.archivedAt)}
                league={league}
                editFolderLabel={editFolderLabel}
                archiveFolderLabel={archiveFolderLabel}
                restoreFolderLabel={restoreFolderLabel}
                deleteFolderLabel={deleteFolderLabel}
                exportFolderLabel={exportFolderLabel}
                createTradeLabel={createTradeLabel}
                copyTradeLabel={copyTradeLabel}
                openLiveTradeLabel={openLiveTradeLabel}
                updateTradeLocationLabel={updateTradeLocationLabel}
                completeTradeLabel={completeTradeLabel}
                uncompleteTradeLabel={uncompleteTradeLabel}
                editTradeLabel={editTradeLabel}
                deleteTradeLabel={deleteTradeLabel}
                reorderLabel={reorderLabel}
                onMove={handleMoveFolder}
                onPreview={previewFolder}
                onCancel={cancelFolderPreview}
                onReorderTrades={trades => handleReorderTrades(trades, folderId)}
                onExpansionToggle={() => handleToggleFolderExpansion(folderId)}
                onEdit={() => handleStageFolder(folder)}
                onDelete={() => handleDeleteFolder(folder)}
                onArchiveToggle={() => handleToggleFolderArchive(folder)}
                onFetchTrades={handleFetchTrades}
                onCreateTrade={() => handleCreateTrade(folderId)}
                onEditTrade={trade => setStagedTrade({ folderId: folderId, trade })}
                onDeleteTrade={trade => setStagedDeletingTrade({ folderId: folderId, trade })}
                onCopyTradeToClipboard={handleCopyTradeToClipboard}
                onUpdateTradeLocation={trade => handleUpdateTradeLocation(trade, folderId)}
                onToggleTradeCompletion={trade => handleToggleTradeCompletion(trade, folderId)}
                onExportFolder={() => handleExportFolder({ ...folder, id: folderId })}
                getTradeUrl={handleGetTradeUrl}
              />
            </div>
          );
        })}
      </div>

      {!isShowingArchivedFolders && (
        <div className={styles.actions}>
          <Button
            type="button"
            className={styles.createFolderButton}
            theme="gold"
            label={createFolderLabel}
            icon={FolderPlusIcon}
            onClick={handleCreateFolder}
          />

          <Button
            type="button"
            className={styles.createFolderButton}
            theme="gold"
            label={importFolderLabel}
            icon={SquarePlusIcon}
            onClick={handleImportFolder}
          />

          {/* Path of Building builds are PoE 1 only */}
          {version === '1' && (
            <Button
              type="button"
              className={styles.createFolderButton}
              theme="gold"
              label={importPobLabel}
              icon={ImportPobIcon}
              onClick={handleImportPob}
            />
          )}
        </div>
      )}

      {foldersWarningIsVisible && (
        <AlertMessage className={styles.foldersWarning} type="warning" message={foldersWarningMessage} />
      )}

      <Backup
        title={backupTitle}
        generateButtonLabel={generateBackupLabel}
        restoreButtonLabel={restoreBackupLabel}
        onGenerateBackup={handleGenerateBackup}
        onRestoreBackup={handleRestoreBackup}
      />

      {stagedFolder && (
        <FolderEdition
          folder={stagedFolder}
          version={version}
          modalTitle={folderModalTitle}
          modalCloseLabel={modalCloseLabel}
          logoAlt={logoAlt}
          titleLabel={folderTitleLabel}
          iconLabel={folderIconLabel}
          saveLabel={saveLabel}
          onCancel={handleUnstageFolder}
          onSubmit={handlePersistFolder}
        />
      )}

      {stagedTrade && (
        <TradeEdition
          trade={stagedTrade.trade}
          modalTitle={tradeModalTitle}
          modalCloseLabel={modalCloseLabel}
          logoAlt={logoAlt}
          titleLabel={tradeTitleLabel}
          saveLabel={saveLabel}
          onCancel={() => setStagedTrade(null)}
          onSubmit={handlePersistTrade}
        />
      )}

      {stagedDeletingTrade && (
        <TradeDeletion
          modalTitle={tradeDeletionModalTitle}
          modalCloseLabel={modalCloseLabel}
          logoAlt={logoAlt}
          confirmationMessage={tradeDeletionConfirmation(stagedDeletingTrade.trade.title)}
          deleteLabel={tradeDeletionDeleteLabel}
          cancelLabel={tradeDeletionCancelLabel}
          onCancel={() => setStagedDeletingTrade(null)}
          onConfirm={handleDeleteTrade}
        />
      )}

      {exportString !== null && (
        <FolderExport
          exportString={exportString}
          modalTitle={exportModalTitle}
          modalCloseLabel={modalCloseLabel}
          logoAlt={logoAlt}
          exportCodeLabel={exportCodeLabel}
          exportCodeHelper={exportCodeHelper}
          copyLabel={copyToClipboardLabel}
          copiedLabel={copiedToClipboardLabel}
          closeLabel={exportCloseLabel}
          onClose={() => setExportString(null)}
        />
      )}

      {importing && (
        <FolderImport
          key={importing}
          modalTitle={importing === 'pob' ? importPobModalTitle : importModalTitle}
          modalCloseLabel={modalCloseLabel}
          logoAlt={logoAlt}
          importCodeLabel={importing === 'pob' ? importPobCodeLabel : importCodeLabel}
          previewLabel={importPreviewLabel}
          invalidCodeMessage={importing === 'pob' ? invalidPobCodeMessage : invalidCodeMessage}
          saveLabel={saveLabel}
          onCancel={handleCancelImportFolder}
          onSubmit={handlePersistImportedFolder}
          onDeserialize={importing === 'pob' ? handleDeserializePob : bookmarks.deserializeFolder}
        />
      )}
    </LoadingContainer>
  );
};

export default PageBookmarks;
