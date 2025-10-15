import styles from './Folder.module.scss';
import BookmarkFolderIcon from '../BookmarkFolderIcon';
import Button from '../Button';
import ContextualMenu from '../ContextualMenu';
import LoadingContainer from '../LoadingContainer';
import classnames from 'classnames';
import { useState, useEffect, useCallback } from 'react';
import type { BookmarksFolderStruct, BookmarksTradeStruct } from '@/types/bookmarks';
import type React from 'react';

interface FolderProps {
  folder: BookmarksFolderStruct & { id: string };
  isExpanded: boolean;
  isArchived: boolean;
  league: string | null;
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
  onExpansionToggle: () => void;
  onEdit: () => void;
  onArchiveToggle: () => Promise<void>;
  onDelete: () => Promise<void>;
  onFetchTrades: (folderId: string) => Promise<BookmarksTradeStruct[]>;
  onCreateTrade: () => void;
  onEditTrade: (trade: BookmarksTradeStruct) => void;
  onDeleteTrade: (trade: BookmarksTradeStruct) => Promise<void>;
  onCopyTradeToClipboard: (trade: BookmarksTradeStruct) => void;
  onUpdateTradeLocation: (trade: BookmarksTradeStruct) => Promise<void>;
  onToggleTradeCompletion: (trade: BookmarksTradeStruct) => Promise<void>;
  onExportFolder: () => void;
  getTradeUrl: (trade: BookmarksTradeStruct, league: string | null) => string;
}

const Folder: React.FC<FolderProps> = ({
  folder,
  isExpanded,
  isArchived,
  league,
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
  onExpansionToggle,
  onEdit,
  onArchiveToggle,
  onDelete,
  onFetchTrades,
  onCreateTrade,
  onEditTrade,
  onDeleteTrade,
  onCopyTradeToClipboard,
  onUpdateTradeLocation,
  onToggleTradeCompletion,
  onExportFolder,
  getTradeUrl,
}) => {
  const [trades, setTrades] = useState<BookmarksTradeStruct[]>([]);

  const loadTrades = useCallback(async () => {
    if (!isExpanded) return;
    const fetchedTrades = await onFetchTrades(folder.id);
    setTrades(fetchedTrades);
  }, [isExpanded, folder.id, onFetchTrades]);

  useEffect(() => {
    if (isExpanded) {
      loadTrades().catch(error => console.error('Failed to load trades:', error));
    }
  }, [isExpanded, loadTrades]);

  return (
    <div className={classnames(styles.folder, isExpanded && styles.isExpanded, isArchived && styles.isArchived)}>
      <div className={styles.header}>
        <div
          className={styles.expansionWrapper}
          onClick={onExpansionToggle}
          onKeyDown={e => e.key === 'Enter' && onExpansionToggle()}
          role="button"
          tabIndex={0}>
          {folder.icon && <BookmarkFolderIcon icon={folder.icon} className={styles.headerIcon} />}
          <div className={styles.headerLabel}>{folder.title}</div>
          {!isArchived && <span className={styles.expansionIndicator}>▼</span>}
        </div>

        <div className={styles.headerActions}>
          <ContextualMenu
            className={styles.headerAction}
            items={[
              ...(!isArchived ? [{ label: editFolderLabel, onClick: onEdit }] : []),
              { label: isArchived ? restoreFolderLabel : archiveFolderLabel, onClick: onArchiveToggle },
              ...(isArchived ? [{ label: deleteFolderLabel, onClick: onDelete }] : []),
              { label: exportFolderLabel, onClick: onExportFolder },
            ]}
          />

          {/* TODO: Add drag handle for reordering folders */}
          <button type="button" className={styles.headerAction}>
            ⇕
          </button>
        </div>
      </div>

      {isExpanded && (
        <LoadingContainer task={loadTrades} size="small">
          {/* TODO: Add drag-and-drop for reordering trades */}
          <ul className={styles.trades}>
            {trades.map(trade => (
              <li key={trade.id} className={styles.trade}>
                <a href={getTradeUrl(trade, league)} className={styles.tradeLink} target="_blank" rel="noreferrer">
                  {trade.completedAt && <span className={styles.tradeLinkCompleted}>✓</span>}
                  {trade.title}
                </a>

                <div className={styles.tradeActions}>
                  <ContextualMenu
                    className={styles.tradeAction}
                    items={[
                      { label: copyTradeLabel, onClick: () => onCopyTradeToClipboard(trade) },
                      ...(trade.location.type === 'search'
                        ? [{ label: openLiveTradeLabel, href: `${getTradeUrl(trade, league)}/live` }]
                        : []),
                      { label: updateTradeLocationLabel, onClick: () => onUpdateTradeLocation(trade) },
                      {
                        label: trade.completedAt ? uncompleteTradeLabel : completeTradeLabel,
                        onClick: () => onToggleTradeCompletion(trade),
                      },
                      { label: editTradeLabel, onClick: () => onEditTrade(trade) },
                      { label: deleteTradeLabel, onClick: () => onDeleteTrade(trade) },
                    ]}
                  />

                  {/* TODO: Add drag handle for reordering trades */}
                  <button type="button" className={styles.tradeAction}>
                    ⇕
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className={styles.folderActions}>
            <Button
              type="button"
              className={styles.folderActionsNewTrade}
              theme="gold"
              label={createTradeLabel}
              onClick={onCreateTrade}
            />
          </div>
        </LoadingContainer>
      )}
    </div>
  );
};

export default Folder;
