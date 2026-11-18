import styles from './Folder.module.scss';
import BookmarkFolderIcon from '../BookmarkFolderIcon';
import Button from '../Button';
import ContextualMenu from '../ContextualMenu';
import LoadingContainer from '../LoadingContainer';
import ChevronDownIcon from '@/assets/icons/solid/chevron-down.svg?react';
import SortIcon from '@/assets/icons/solid/sort.svg?react';
import { usePreviewOrder, useSortable } from '@/hooks/useSortable';
import { reorder } from '@atlaskit/pragmatic-drag-and-drop/utils/reorder';
import classnames from 'classnames';
import { useState, useCallback, useEffect, useId, useRef } from 'react';
import type { BookmarksFolderStruct, BookmarksTradeStruct } from '@/types/bookmarks';
import type React from 'react';

interface SortableTradeProps {
  listId: string;
  index: number;
  count: number;
  reorderLabel: string;
  onMove: (fromIndex: number, toIndex: number) => void;
  onPreview: (fromIndex: number, toIndex: number) => void;
  onCancel: () => void;
  /** The Trade link */
  children: React.ReactNode;
  /** The Trade contextual menu, shown before the drag handle */
  menu: React.ReactNode;
}

const SortableTrade: React.FC<SortableTradeProps> = ({
  listId,
  index,
  count,
  reorderLabel,
  onMove,
  onPreview,
  onCancel,
  children,
  menu,
}) => {
  const { itemRef, handleProps, isDragging } = useSortable<HTMLLIElement, HTMLButtonElement>({
    listId,
    index,
    count,
    onMove,
    onPreview,
    onCancel,
  });

  return (
    <li ref={itemRef} className={classnames(styles.trade, isDragging && styles.isDragging)}>
      {children}

      <div className={styles.tradeActions}>
        {menu}

        <button
          {...handleProps}
          type="button"
          className={classnames(styles.tradeAction, styles.handle)}
          title={reorderLabel}
          aria-label={reorderLabel}>
          <SortIcon className={styles.handleIcon} />
        </button>
      </div>
    </li>
  );
};

interface FolderProps {
  folder: BookmarksFolderStruct & { id: string };
  /** Position among the displayed Folders, for reordering */
  index: number;
  count: number;
  listId: string;
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
  reorderLabel: string;
  onMove: (fromIndex: number, toIndex: number) => void;
  onPreview: (fromIndex: number, toIndex: number) => void;
  onCancel: () => void;
  onReorderTrades: (trades: BookmarksTradeStruct[]) => Promise<void>;
  onExpansionToggle: () => void;
  onEdit: () => void;
  onArchiveToggle: () => Promise<void>;
  onDelete: () => Promise<void>;
  onFetchTrades: (folderId: string) => Promise<BookmarksTradeStruct[]>;
  onCreateTrade: () => void;
  onEditTrade: (trade: BookmarksTradeStruct) => void;
  onDeleteTrade: (trade: BookmarksTradeStruct) => void;
  onCopyTradeToClipboard: (trade: BookmarksTradeStruct) => void;
  onUpdateTradeLocation: (trade: BookmarksTradeStruct) => Promise<void>;
  onToggleTradeCompletion: (trade: BookmarksTradeStruct) => Promise<void>;
  onExportFolder: () => void;
  getTradeUrl: (trade: BookmarksTradeStruct, league: string | null) => string;
}

const Folder: React.FC<FolderProps> = ({
  folder,
  index,
  count,
  listId,
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
  reorderLabel,
  onMove,
  onPreview,
  onCancel,
  onReorderTrades,
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

  // Run by the LoadingContainer below, which only mounts while the folder is expanded
  // Only the latest fetch may set the trades: quick successive mutations can resolve out of order
  const latestFetchRef = useRef(0);
  const loadTrades = useCallback(async () => {
    const fetchId = ++latestFetchRef.current;
    const fetchedTrades = await onFetchTrades(folder.id);
    if (fetchId === latestFetchRef.current) setTrades(fetchedTrades);
  }, [folder.id, onFetchTrades]);

  // Every Bookmarks mutation (and the window-focus refetch) refreshes the folders with fresh objects: reload the
  // trades then, without the spinner. ponytail: reloads every expanded folder, scope it if storage reads get slow.
  const previousFolderRef = useRef(folder);
  useEffect(() => {
    if (previousFolderRef.current === folder) return;
    previousFolderRef.current = folder;
    if (isExpanded) void loadTrades();
  }, [folder, isExpanded, loadTrades]);

  const { itemRef, handleProps, isDragging } = useSortable<HTMLDivElement, HTMLButtonElement>({
    listId,
    index,
    count,
    onMove,
    onPreview,
    onCancel,
  });

  const { items: displayedTrades, preview: previewTrade, cancel: cancelTradePreview } = usePreviewOrder(trades);

  // Show the new order right away; persisting it refreshes the Folders, which reloads the trades from storage
  const tradesListId = useId();
  const handleMoveTrade = (fromIndex: number, toIndex: number) => {
    // A fetch already in flight read the old order: let it resolve without overwriting the new one
    latestFetchRef.current++;
    const reorderedTrades = reorder({ list: trades, startIndex: fromIndex, finishIndex: toIndex });
    setTrades(reorderedTrades);
    cancelTradePreview();
    void onReorderTrades(reorderedTrades);
  };

  return (
    <div
      ref={itemRef}
      className={classnames(
        styles.folder,
        isExpanded && styles.isExpanded,
        isArchived && styles.isArchived,
        isDragging && styles.isDragging,
      )}>
      <div className={styles.header}>
        <div
          className={styles.expansionWrapper}
          onClick={onExpansionToggle}
          onKeyDown={e => e.key === 'Enter' && onExpansionToggle()}
          role="button"
          tabIndex={0}>
          {folder.icon && <BookmarkFolderIcon icon={folder.icon} className={styles.headerIcon} />}
          <div className={styles.headerLabel}>{folder.title}</div>
          {!isArchived && <ChevronDownIcon className={styles.expansionIndicator} />}
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

          <button
            {...handleProps}
            type="button"
            className={classnames(styles.headerAction, styles.handle)}
            title={reorderLabel}
            aria-label={reorderLabel}>
            <SortIcon className={styles.handleIcon} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <LoadingContainer task={loadTrades} size="small">
          <ul className={styles.trades}>
            {displayedTrades.map((trade, tradeIndex) => (
              <SortableTrade
                key={trade.id}
                listId={tradesListId}
                index={tradeIndex}
                count={displayedTrades.length}
                reorderLabel={reorderLabel}
                onMove={handleMoveTrade}
                onPreview={previewTrade}
                onCancel={cancelTradePreview}
                menu={
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
                }>
                <a href={getTradeUrl(trade, league)} className={styles.tradeLink}>
                  {trade.completedAt && <span className={styles.tradeLinkCompleted}>✓</span>}
                  {trade.title}
                </a>
              </SortableTrade>
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
