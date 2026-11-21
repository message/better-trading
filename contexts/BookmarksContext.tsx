import { bookmarksStorage } from '@/services/bookmarks/storage';
import { generateBackupDataString, restoreFromDataString } from '@/utils/bookmarks/backup';
import { deserialize, serialize } from '@/utils/bookmarks/export';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { PersistFolderOptions } from '@/services/bookmarks/storage';
import type {
  BookmarksFolderStruct,
  BookmarksTradeLocation,
  BookmarksTradeStruct,
  PartialBookmarksTradeLocation,
} from '@/types/bookmarks';
import type { TradeSiteVersion } from '@/types/trade-location';
import type { ReactNode } from 'react';

interface BookmarksContextValue {
  folders: BookmarksFolderStruct[];
  refreshFolders: () => Promise<void>;
  fetchFolders: () => Promise<BookmarksFolderStruct[]>;
  fetchTradesByFolderId: (folderId: string) => Promise<BookmarksTradeStruct[]>;
  fetchTradeByLocation: (location: PartialBookmarksTradeLocation) => Promise<BookmarksTradeStruct | null>;
  persistFolder: (folder: BookmarksFolderStruct, options?: PersistFolderOptions) => Promise<string>;
  persistFolders: (folders: BookmarksFolderStruct[]) => Promise<void>;
  persistTrade: (trade: BookmarksTradeStruct, folderId: string) => Promise<string>;
  persistTrades: (trades: BookmarksTradeStruct[], folderId: string) => Promise<void>;
  deleteTrade: (trade: BookmarksTradeStruct, folderId: string) => Promise<void>;
  deleteFolder: (folder: BookmarksFolderStruct) => Promise<void>;
  toggleTradeCompletion: (trade: BookmarksTradeStruct, folderId: string) => Promise<string>;
  toggleFolderArchive: (folder: BookmarksFolderStruct) => Promise<string>;
  partiallyReorderFolders: (
    allFolders: BookmarksFolderStruct[],
    reorderedFolders: BookmarksFolderStruct[],
  ) => BookmarksFolderStruct[];
  reorderFolders: (reorderedFolders: BookmarksFolderStruct[]) => Promise<void>;
  initializeFolderStruct: (version: TradeSiteVersion) => BookmarksFolderStruct;
  initializeTradeStructFrom: (location: BookmarksTradeLocation) => BookmarksTradeStruct;
  serializeFolder: (folder: BookmarksFolderStruct, trades: BookmarksTradeStruct[]) => string;
  deserializeFolder: (serializedFolder: string) => [BookmarksFolderStruct, BookmarksTradeStruct[]] | null;
  generateBackup: () => Promise<string>;
  restoreBackup: (dataString: string) => Promise<boolean>;
}

const BookmarksContext = createContext<BookmarksContextValue | null>(null);

interface BookmarksProviderProps {
  children: ReactNode;
}

const BookmarksProvider = ({ children }: BookmarksProviderProps) => {
  const [folders, setFolders] = useState<BookmarksFolderStruct[]>([]);

  const refreshFolders = useCallback(async () => {
    const data = await bookmarksStorage.fetchFolders();
    setFolders(data);
  }, []);

  const fetchFolders = useCallback(async () => bookmarksStorage.fetchFolders(), []);

  const fetchTradesByFolderId = useCallback(
    async (folderId: string) => bookmarksStorage.fetchTradesByFolderId(folderId),
    [],
  );

  const fetchTradeByLocation = useCallback(
    async (location: PartialBookmarksTradeLocation): Promise<BookmarksTradeStruct | null> => {
      const folders = await fetchFolders();
      const foldersWithTrades = await Promise.all(
        folders.map(async folder => ({
          ...folder,

          trades: await fetchTradesByFolderId(folder.id!),
        })),
      );
      let matches = foldersWithTrades
        .map(folderWithTrades => ({
          ...folderWithTrades,
          trades: folderWithTrades.trades.filter(
            trade =>
              trade.location.version === location.version &&
              trade.location.slug === location.slug &&
              trade.location.type === location.type,
          ),
        }))
        .filter(f => f.trades.length > 0);

      if (matches.length === 0) return null;

      const unarchivedMatches = matches.filter(m => !m.archivedAt);
      if (unarchivedMatches.length > 0) matches = unarchivedMatches;

      const matchingTrades = matches.flatMap(m => m.trades);

      // Sort alphabetically by title. "by title" is an arbitrary choice, we just want some
      // consistent sort order to make sure the result stays consistent between repeated calls
      //

      matchingTrades.sort((a, b) => (a.title < b.title ? -1 : a.title > b.title ? 1 : 0));
      return matchingTrades[0] ?? null;
    },
    [fetchFolders, fetchTradesByFolderId],
  );

  const persistFolder = useCallback(
    async (folder: BookmarksFolderStruct, options?: PersistFolderOptions) => {
      const newId = await bookmarksStorage.persistFolder(folder, options);
      await refreshFolders();
      return newId;
    },
    [refreshFolders],
  );

  const persistFolders = useCallback(
    async (folders: BookmarksFolderStruct[]) => {
      await bookmarksStorage.persistFolders(folders);
      await refreshFolders();
    },
    [refreshFolders],
  );

  const persistTrade = useCallback(
    async (trade: BookmarksTradeStruct, folderId: string) => {
      const newId = await bookmarksStorage.persistTrade(trade, folderId);
      await refreshFolders();
      return newId;
    },
    [refreshFolders],
  );

  const persistTrades = useCallback(
    async (trades: BookmarksTradeStruct[], folderId: string) => {
      await bookmarksStorage.persistTrades(trades, folderId);
      await refreshFolders();
    },
    [refreshFolders],
  );

  const deleteTrade = useCallback(
    async (trade: BookmarksTradeStruct, folderId: string) => {
      if (!trade.id) return;

      await bookmarksStorage.deleteTrade(trade.id, folderId);
      await refreshFolders();
    },
    [refreshFolders],
  );

  const deleteFolder = useCallback(
    async (folder: BookmarksFolderStruct) => {
      if (!folder.id) return;

      await bookmarksStorage.deleteFolder(folder.id);
      await refreshFolders();
    },
    [refreshFolders],
  );

  const toggleTradeCompletion = useCallback(
    async (trade: BookmarksTradeStruct, folderId: string) =>
      persistTrade(
        {
          ...trade,
          completedAt: trade.completedAt ? null : new Date().toUTCString(),
        },
        folderId,
      ),
    [persistTrade],
  );

  const toggleFolderArchive = useCallback(
    async (folder: BookmarksFolderStruct) =>
      persistFolder(
        {
          ...folder,
          archivedAt: folder.archivedAt ? null : new Date().toUTCString(),
        },
        { moveToEnd: true },
      ),
    [persistFolder],
  );

  // This function reorders the `reorderedFolders` within `allFolders` relative to
  // one another without affecting the relative order of non-reordered folders.
  //
  // Does *not* persist the changes.
  //
  // Precondition: `reorderedFolders` must be a subset of `allFolders`.
  const partiallyReorderFolders = useCallback(
    (allFolders: BookmarksFolderStruct[], reorderedFolders: BookmarksFolderStruct[]): BookmarksFolderStruct[] => {
      const reorderedSet = new Set(reorderedFolders);
      const result = [...allFolders];
      let reorderedIndex = 0;
      allFolders.forEach((folder, i) => {
        if (reorderedSet.has(folder)) {
          result[i] = reorderedFolders[reorderedIndex]!;
          reorderedIndex++;
        }
      });
      if (reorderedIndex !== reorderedFolders.length) {
        throw new Error(
          'partiallyReorderFolders precondition violated: reorderedFolders was not a subset of allFolders',
        );
      }
      return result;
    },
    [],
  );

  // Shows the new order right away (keyboard moves read the new index on the next key press), then persists it.
  // The refresh afterwards also rolls the order back when persisting fails.
  const reorderFolders = useCallback(
    async (reorderedFolders: BookmarksFolderStruct[]) => {
      const allFolders = partiallyReorderFolders(folders, reorderedFolders);
      setFolders(allFolders);
      try {
        await bookmarksStorage.persistFolders(allFolders);
      } finally {
        await refreshFolders();
      }
    },
    [folders, partiallyReorderFolders, refreshFolders],
  );

  const initializeFolderStruct = useCallback(
    (version: TradeSiteVersion): BookmarksFolderStruct => ({
      version,
      icon: null,
      title: '',
      archivedAt: null,
    }),
    [],
  );

  const initializeTradeStructFrom = useCallback(
    (location: BookmarksTradeLocation): BookmarksTradeStruct => ({
      location,
      title: '',
      completedAt: null,
    }),
    [],
  );

  const serializeFolder = useCallback(
    (folder: BookmarksFolderStruct, trades: BookmarksTradeStruct[]) => serialize(folder, trades),
    [],
  );

  const deserializeFolder = useCallback((serializedFolder: string) => deserialize(serializedFolder), []);

  const generateBackup = useCallback(async () => generateBackupDataString(), []);

  const restoreBackup = useCallback(
    async (dataString: string) => {
      const result = await restoreFromDataString(dataString);
      await refreshFolders();
      return result;
    },
    [refreshFolders],
  );

  const value: BookmarksContextValue = useMemo(
    () => ({
      folders,
      refreshFolders,
      fetchFolders,
      fetchTradesByFolderId,
      fetchTradeByLocation,
      persistFolder,
      persistFolders,
      persistTrade,
      persistTrades,
      deleteTrade,
      deleteFolder,
      toggleTradeCompletion,
      toggleFolderArchive,
      partiallyReorderFolders,
      reorderFolders,
      initializeFolderStruct,
      initializeTradeStructFrom,
      serializeFolder,
      deserializeFolder,
      generateBackup,
      restoreBackup,
    }),
    [
      folders,
      refreshFolders,
      fetchFolders,
      fetchTradesByFolderId,
      fetchTradeByLocation,
      persistFolder,
      persistFolders,
      persistTrade,
      persistTrades,
      deleteTrade,
      deleteFolder,
      toggleTradeCompletion,
      toggleFolderArchive,
      partiallyReorderFolders,
      reorderFolders,
      initializeFolderStruct,
      initializeTradeStructFrom,
      serializeFolder,
      deserializeFolder,
      generateBackup,
      restoreBackup,
    ],
  );

  return <BookmarksContext.Provider value={value}>{children}</BookmarksContext.Provider>;
};

const useBookmarksContext = () => {
  const context = useContext(BookmarksContext);
  if (!context) {
    throw new Error('useBookmarksContext must be used within BookmarksProvider');
  }
  return context;
};

export { BookmarksProvider, useBookmarksContext };
