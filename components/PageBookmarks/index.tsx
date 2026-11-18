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
import FolderImport from './FolderImport';
import styles from './styles.module.scss';
import TradeDeletion from './TradeDeletion';
import TradeEdition from './TradeEdition';
import AlertMessage from '../AlertMessage';
import Button from '../Button';
import LoadingContainer from '../LoadingContainer';
import BoxArchiveIcon from '@/assets/icons/solid/box-archive.svg?react';
import CompressIcon from '@/assets/icons/solid/compress.svg?react';
import FolderPlusIcon from '@/assets/icons/solid/folder-plus.svg?react';
import RotateLeftIcon from '@/assets/icons/solid/rotate-left.svg?react';
import SquarePlusIcon from '@/assets/icons/solid/square-plus.svg?react';
import { useFlashMessagesContext } from '@/contexts/FlashMessagesContext';
import { useTradeHistoryContext } from '@/contexts/TradeHistoryContext';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useBookmarksState } from '@/hooks/useBookmarksState';
import { useTradeLocation } from '@/hooks/useTradeLocation';
import { copyToClipboard } from '@/utils/copy-to-clipboard';
import { recommendTitle } from '@/utils/search-panel';
import { getTradeUrl } from '@/utils/trade-location';
import { reorder } from '@atlaskit/pragmatic-drag-and-drop/utils/reorder';
import {
  autoScrollForElements,
  autoScrollWindowForElements,
} from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { useState, useCallback, useEffect, useId } from 'react';
import type { TradeSource } from './TradeEdition';
import type { BookmarksFolderStruct, BookmarksTradeStruct } from '@/types/bookmarks';
import type React from 'react';

const FOLDERS_WARNING_THRESHOLD = 10;

/** A Trade being created (`trade` null) or edited in the Folder `folderId` */
interface StagedTrade {
  folderId: string;
  trade: BookmarksTradeStruct | null;
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
  tradeSourceLabel: string;
  currentSearchLabel: string;
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
  tradeSourceLabel,
  currentSearchLabel,
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
  const { historyEntries, refreshHistoryEntries } = useTradeHistoryContext();

  const [stagedFolder, setStagedFolder] = useState<BookmarksFolderStruct | null>(null);
  const [isImportingFolder, setIsImportingFolder] = useState(false);
  const [isShowingArchivedFolders, setIsShowingArchivedFolders] = useState(false);
  const [stagedTrade, setStagedTrade] = useState<StagedTrade | null>(null);
  const [stagedDeletingTrade, setStagedDeletingTrade] = useState<StagedDeletingTrade | null>(null);

  const { refreshFolders, fetchTradesByFolderId, generateBackup } = bookmarks;

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

  // A new Trade comes from the current search or from a Trade History entry of this Game Version
  const tradeSources: TradeSource[] = [
    ...(type && slug
      ? [{ label: currentSearchLabel, title: recommendTitle(), location: { version, type, slug } }]
      : []),
    ...historyEntries
      .filter(entry => entry.version === version)
      .map(entry => ({
        label: entry.title || entry.slug,
        title: entry.title,
        location: { version: entry.version, type: entry.type, slug: entry.slug },
      })),
  ];

  // Nothing to save a new Trade from (no current search, no History): close instead of showing an empty form
  if (stagedTrade && !stagedTrade.trade && tradeSources.length === 0) setStagedTrade(null);

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
        setIsImportingFolder(false);
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
      const success = await bookmarks.restoreBackup(dataString);
      if (!success) {
        addFlash(restoreBackupErrorMessage, 'alert');
      }
    },
    [bookmarks, restoreBackupErrorMessage, addFlash],
  );

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
    setIsImportingFolder(true);
  };

  const handleCancelImportFolder = () => {
    setIsImportingFolder(false);
  };

  const handleFetchTrades = useCallback(
    async (folderId: string) => await fetchTradesByFolderId(folderId),
    [fetchTradesByFolderId],
  );

  const handleCopyTradeToClipboard = useCallback(
    async (trade: BookmarksTradeStruct) => {
      if (!league) return;
      const tradeUrl = getTradeUrl(trade.location.version, trade.location.type, trade.location.slug, league);
      await copyToClipboard(tradeUrl);
      addFlash(copyTradeSuccessMessage(trade.title), 'success');
    },
    [league, copyTradeSuccessMessage, addFlash],
  );

  const handleCreateTrade = async (folderId: string) => {
    // The History page may not have loaded the entries yet; they are read when the modal renders
    await refreshHistoryEntries().catch(() => undefined);
    setStagedTrade({ folderId, trade: null });
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
  const handleMoveFolder = async (fromIndex: number, toIndex: number) => {
    const reorderedFolders = reorder({ list: displayedFolders, startIndex: fromIndex, finishIndex: toIndex });
    try {
      await bookmarks.persistFolders(bookmarks.partiallyReorderFolders(bookmarks.folders, reorderedFolders));
    } catch {
      addFlash(genericAlertMessage, 'alert');
    }
  };

  const handleReorderTrades = async (trades: BookmarksTradeStruct[], folderId: string) => {
    try {
      await bookmarks.persistTrades(trades, folderId);
    } catch {
      addFlash(genericAlertMessage, 'alert');
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
            icon={CompressIcon}
            onClick={handleCollapseAllFolders}
          />
        )}

        {hasArchivedFolders && (
          <Button
            type="button"
            theme="gold"
            label={isShowingArchivedFolders ? showUnarchivedLabel : showArchivedLabel}
            icon={isShowingArchivedFolders ? RotateLeftIcon : BoxArchiveIcon}
            onClick={handleToggleArchiveDisplay}
          />
        )}
      </div>

      <div className={styles.foldersWrapper}>
        {displayedFolders.map((folder, folderIndex) => {
          const folderId = folder.id;
          if (!folderId) return null;
          return (
            <div key={folderId} className={styles.folderWrapper}>
              <Folder
                folder={folder as BookmarksFolderStruct & { id: string }}
                index={folderIndex}
                count={displayedFolders.length}
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
                onExportFolder={() => {
                  /* TODO: Implement folder export */
                }}
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
          sources={tradeSources}
          modalTitle={tradeModalTitle}
          modalCloseLabel={modalCloseLabel}
          logoAlt={logoAlt}
          titleLabel={tradeTitleLabel}
          sourceLabel={tradeSourceLabel}
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

      {isImportingFolder && (
        <FolderImport
          modalTitle={importModalTitle}
          modalCloseLabel={modalCloseLabel}
          logoAlt={logoAlt}
          importCodeLabel={importCodeLabel}
          previewLabel={importPreviewLabel}
          invalidCodeMessage={invalidCodeMessage}
          saveLabel={saveLabel}
          onCancel={handleCancelImportFolder}
          onSubmit={handlePersistImportedFolder}
          onDeserialize={bookmarks.deserializeFolder}
        />
      )}
    </LoadingContainer>
  );
};

export default PageBookmarks;
