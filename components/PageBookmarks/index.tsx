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
import { bookmarksServiceStub, flashMessagesStub, tradeLocationStub, copyToClipboard } from './services-stub';
import styles from './styles.module.scss';
// TODO: These services will be migrated to service/hook layer later
import AlertMessage from '../AlertMessage';
import Button from '../Button';
import LoadingContainer from '../LoadingContainer';
import { useState, useCallback } from 'react';
import type { BookmarksFolderStruct, BookmarksTradeStruct } from '@/types/bookmarks';
import type { TradeSiteVersion } from '@/types/trade-location';
import type React from 'react';

const FOLDERS_WARNING_THRESHOLD = 10;

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
  deleteFolderSuccessMessage: (title: string) => string;
  createFolderSuccessMessage: (title: string) => string;
  updateFolderSuccessMessage: (title: string) => string;
  importFolderSuccessMessage: (title: string) => string;
  restoreBackupErrorMessage: string;
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
  deleteFolderSuccessMessage,
  createFolderSuccessMessage,
  updateFolderSuccessMessage,
  importFolderSuccessMessage,
  restoreBackupErrorMessage,
}) => {
  const [folders, setFolders] = useState<BookmarksFolderStruct[]>([]);
  const [stagedFolder, setStagedFolder] = useState<BookmarksFolderStruct | null>(null);
  const [expandedFolderIds, setExpandedFolderIds] = useState<string[]>([]);
  const [isImportingFolder, setIsImportingFolder] = useState(false);
  const [isShowingArchivedFolders, setIsShowingArchivedFolders] = useState(false);

  const version: TradeSiteVersion = tradeLocationStub.version;
  const league = tradeLocationStub.league;

  // Computed values
  const applicableFolders = folders.filter(folder => folder.version === version);
  const activeFolders = applicableFolders.filter(folder => !folder.archivedAt);
  const archivedFolders = applicableFolders.filter(folder => Boolean(folder.archivedAt));
  const displayedFolders = isShowingArchivedFolders ? archivedFolders : activeFolders;
  const hasArchivedFolders = archivedFolders.length > 0;
  const hasActiveFolders = activeFolders.length > 0;
  const foldersWarningIsVisible = !isShowingArchivedFolders && displayedFolders.length >= FOLDERS_WARNING_THRESHOLD;

  const fetchFolders = useCallback(async () => {
    const fetchedFolders = await bookmarksServiceStub.fetchFolders();
    setFolders(fetchedFolders);
    setExpandedFolderIds(bookmarksServiceStub.getExpandedFolderIds());
  }, []);

  const handleDeleteFolder = useCallback(
    async (folder: BookmarksFolderStruct) => {
      try {
        await bookmarksServiceStub.deleteFolder(folder);
        await fetchFolders();
        flashMessagesStub.success(deleteFolderSuccessMessage(folder.title));
      } catch {
        flashMessagesStub.alert('An error occurred');
      }
    },
    [fetchFolders, deleteFolderSuccessMessage],
  );

  const handleToggleFolderArchive = useCallback(
    async (folder: BookmarksFolderStruct) => {
      await bookmarksServiceStub.toggleFolderArchive(folder);
      await fetchFolders();
      setIsShowingArchivedFolders(isShowingArchivedFolders && hasArchivedFolders);
    },
    [fetchFolders, isShowingArchivedFolders, hasArchivedFolders],
  );

  // TODO: Implement drag-and-drop folder reordering
  // const handleReorderFolders = useCallback(
  //   async (reordered: BookmarksFolderStruct[]) => {
  //     const newFolders = bookmarksServiceStub.partiallyReorderFolders(folders, reordered);
  //     setFolders(newFolders);
  //     await bookmarksServiceStub.persistFolders(newFolders);
  //   },
  //   [folders],
  // );

  const handlePersistFolder = useCallback(
    async (folder: BookmarksFolderStruct) => {
      try {
        const isNewlyCreated = !folder.id;
        const folderId = await bookmarksServiceStub.persistFolder(folder);

        if (isNewlyCreated) {
          const newExpandedIds = bookmarksServiceStub.toggleFolderExpansion(expandedFolderIds, folderId);
          setExpandedFolderIds(newExpandedIds);
        }

        await fetchFolders();

        const successMessage = isNewlyCreated
          ? createFolderSuccessMessage(folder.title)
          : updateFolderSuccessMessage(folder.title);
        flashMessagesStub.success(successMessage);
      } catch {
        flashMessagesStub.alert('An error occurred');
      } finally {
        setStagedFolder(null);
      }
    },
    [expandedFolderIds, fetchFolders, createFolderSuccessMessage, updateFolderSuccessMessage],
  );

  const handlePersistImportedFolder = useCallback(
    async (data: { folder: BookmarksFolderStruct; trades: BookmarksTradeStruct[] }) => {
      try {
        const folderId = await bookmarksServiceStub.persistFolder(data.folder);
        await bookmarksServiceStub.persistTrades(data.trades, folderId);

        const newExpandedIds = bookmarksServiceStub.toggleFolderExpansion(expandedFolderIds, folderId);
        setExpandedFolderIds(newExpandedIds);

        await fetchFolders();
        flashMessagesStub.success(importFolderSuccessMessage(data.folder.title));
      } catch {
        flashMessagesStub.alert('An error occurred');
      } finally {
        setIsImportingFolder(false);
      }
    },
    [expandedFolderIds, fetchFolders, importFolderSuccessMessage],
  );

  const handleGenerateBackup = useCallback(async () => {
    const dataString = await bookmarksServiceStub.generateBackupDataString();
    const blob = new Blob([dataString], { type: 'text/plain' });
    const linkElement = document.createElement('a');
    linkElement.download = 'poe-better-trading-backup.txt';
    linkElement.href = window.URL.createObjectURL(blob);
    linkElement.click();
  }, []);

  const handleRestoreBackup = useCallback(
    async (dataString: string) => {
      const success = await bookmarksServiceStub.restoreFromDataString(dataString);
      if (!success) {
        flashMessagesStub.alert(restoreBackupErrorMessage);
      }
    },
    [restoreBackupErrorMessage],
  );

  const handleToggleArchiveDisplay = () => {
    setIsShowingArchivedFolders(!isShowingArchivedFolders);
  };

  const handleCreateFolder = () => {
    const newFolder = bookmarksServiceStub.initializeFolderStruct(version);
    setStagedFolder(newFolder);
  };

  const handleStageFolder = (folder: BookmarksFolderStruct) => {
    setStagedFolder(folder);
  };

  const handleUnstageFolder = () => {
    setStagedFolder(null);
  };

  const handleToggleFolderExpansion = (folderId: string) => {
    const newExpandedIds = bookmarksServiceStub.toggleFolderExpansion(expandedFolderIds, folderId);
    setExpandedFolderIds(newExpandedIds);
  };

  const handleCollapseAllFolders = () => {
    setExpandedFolderIds([]);
  };

  const handleImportFolder = () => {
    setIsImportingFolder(true);
  };

  const handleCancelImportFolder = () => {
    setIsImportingFolder(false);
  };

  const handleFetchTrades = useCallback(
    async (folderId: string) => await bookmarksServiceStub.fetchTradesByFolderId(folderId),
    [],
  );

  const handleCopyTradeToClipboard = useCallback(
    (trade: BookmarksTradeStruct) => {
      if (!league) return;
      const tradeUrl = tradeLocationStub.getTradeUrl(
        trade.location.version,
        trade.location.type,
        trade.location.slug,
        league,
      );
      copyToClipboard(tradeUrl);
      flashMessagesStub.success(`Copied ${trade.title} to clipboard`);
    },
    [league],
  );

  const getTradeUrl = (trade: BookmarksTradeStruct, currentLeague: string | null) => {
    if (!currentLeague) return '#';
    return tradeLocationStub.getTradeUrl(
      trade.location.version,
      trade.location.type,
      trade.location.slug,
      currentLeague,
    );
  };

  return (
    <LoadingContainer task={fetchFolders} size="large">
      <div className={styles.headerActions}>
        {hasActiveFolders && !isShowingArchivedFolders && (
          <Button type="button" theme="gold" label={collapseAllLabel} icon="🗜️" onClick={handleCollapseAllFolders} />
        )}

        {hasArchivedFolders && (
          <Button
            type="button"
            theme="gold"
            label={isShowingArchivedFolders ? showUnarchivedLabel : showArchivedLabel}
            icon={isShowingArchivedFolders ? '↶' : '📦'}
            onClick={handleToggleArchiveDisplay}
          />
        )}
      </div>

      {/* TODO: Add drag-and-drop for folder reordering using a library like @dnd-kit */}
      <div className={styles.foldersWrapper}>
        {displayedFolders.map(folder => {
          if (!folder.id) return null;
          return (
            <div key={folder.id} className={styles.folderWrapper}>
              <Folder
                folder={folder as BookmarksFolderStruct & { id: string }}
                isExpanded={expandedFolderIds.includes(folder.id)}
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
                onExpansionToggle={() => handleToggleFolderExpansion(folder.id as string)}
                onEdit={() => handleStageFolder(folder)}
                onDelete={() => handleDeleteFolder(folder)}
                onArchiveToggle={() => handleToggleFolderArchive(folder)}
                onFetchTrades={handleFetchTrades}
                onCreateTrade={() => {
                  /* TODO: Implement trade creation */
                }}
                onEditTrade={() => {
                  /* TODO: Implement trade editing */
                }}
                onDeleteTrade={async () => {
                  /* TODO: Implement trade deletion */
                }}
                onCopyTradeToClipboard={handleCopyTradeToClipboard}
                onUpdateTradeLocation={async () => {
                  /* TODO: Implement trade location update */
                }}
                onToggleTradeCompletion={async () => {
                  /* TODO: Implement trade completion toggle */
                }}
                onExportFolder={() => {
                  /* TODO: Implement folder export */
                }}
                getTradeUrl={getTradeUrl}
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
            icon="📁"
            onClick={handleCreateFolder}
          />

          <Button
            type="button"
            className={styles.createFolderButton}
            theme="gold"
            label={importFolderLabel}
            icon="📥"
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
          titleLabel={folderTitleLabel}
          iconLabel={folderIconLabel}
          saveLabel={saveLabel}
          onCancel={handleUnstageFolder}
          onSubmit={handlePersistFolder}
        />
      )}

      {isImportingFolder && (
        <FolderImport
          modalTitle={importModalTitle}
          importCodeLabel={importCodeLabel}
          previewLabel={importPreviewLabel}
          invalidCodeMessage={invalidCodeMessage}
          saveLabel={saveLabel}
          onCancel={handleCancelImportFolder}
          onSubmit={handlePersistImportedFolder}
          onDeserialize={bookmarksServiceStub.deserializeFolder}
        />
      )}
    </LoadingContainer>
  );
};

export default PageBookmarks;
