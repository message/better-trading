import { getValue, setValue, deleteValue } from '@/utils/storage';
import { uniqueId } from '@/utils/unique-id';
import type { BookmarksFolderStruct, BookmarksTradeStruct } from '@/types/bookmarks';
import type { TradeSiteVersion } from '@/types/trade-location';

const FOLDERS_KEY = 'bookmark-folders';
const TRADES_PREFIX_KEY = 'bookmark-trades';

interface PersistFolderOptions {
  moveToEnd?: boolean;
}

class BookmarksStorage {
  async fetchFolders(): Promise<BookmarksFolderStruct[]> {
    type PersistedType = Array<Partial<BookmarksFolderStruct>>;
    const persistedFolders = await getValue<PersistedType>(FOLDERS_KEY);
    if (!persistedFolders) return [];

    return persistedFolders.map(f => this.migrateOldFolder(f));
  }

  async fetchTradesByFolderId(folderId: string): Promise<BookmarksTradeStruct[]> {
    const trades = await getValue<BookmarksTradeStruct[]>(`${TRADES_PREFIX_KEY}--${folderId}`);
    if (!trades) return [];

    return trades.map(t => this.migrateOldTrade(t));
  }

  async persistFolder(folderToPersist: BookmarksFolderStruct, options?: PersistFolderOptions): Promise<string> {
    const folders = (await this.fetchFolders()) || [];
    let updatedFolders: BookmarksFolderStruct[];
    let persistingId = folderToPersist.id;

    if (!persistingId) {
      persistingId = uniqueId();
      updatedFolders = [...folders, { ...folderToPersist, id: persistingId }];
    } else {
      updatedFolders = folders.map((folder: BookmarksFolderStruct) => {
        if (folder.id !== folderToPersist.id) return folder;

        return {
          ...folder,
          ...folderToPersist,
        };
      });

      if (options?.moveToEnd) {
        updatedFolders = [
          ...updatedFolders.filter(f => f.id !== folderToPersist.id),
          ...updatedFolders.filter(f => f.id === folderToPersist.id),
        ];
      }
    }

    await this.persistFolders(updatedFolders);

    return persistingId;
  }

  async persistTrade(tradeToPersist: BookmarksTradeStruct, folderId: string): Promise<string> {
    const trades = await this.fetchTradesByFolderId(folderId);
    let updatedTrades: BookmarksTradeStruct[];
    let persistingId: string;

    if (!tradeToPersist.id) {
      persistingId = uniqueId();
      updatedTrades = [...trades, { ...tradeToPersist, id: persistingId }];
    } else {
      persistingId = tradeToPersist.id;
      updatedTrades = trades.map((trade: BookmarksTradeStruct) => {
        if (trade.id !== tradeToPersist.id) return trade;

        return {
          ...trade,
          ...tradeToPersist,
        };
      });
    }

    await this.persistTrades(updatedTrades, folderId);

    return persistingId;
  }

  async persistTrades(bookmarkTrades: BookmarksTradeStruct[], folderId: string): Promise<void> {
    const safeBookmarkTrades = bookmarkTrades.map(bookmarkTrade => ({
      ...bookmarkTrade,
      id: bookmarkTrade.id || uniqueId(),
    }));

    await setValue(`${TRADES_PREFIX_KEY}--${folderId}`, safeBookmarkTrades);
  }

  async persistFolders(bookmarkFolders: BookmarksFolderStruct[]): Promise<void> {
    await setValue(FOLDERS_KEY, bookmarkFolders);
  }

  async deleteFolder(folderId: string): Promise<void> {
    const folders = await this.fetchFolders();

    const updatedFolders = folders.filter((folder: BookmarksFolderStruct) => folder.id !== folderId);

    await this.persistFolders(updatedFolders);
    await deleteValue(`${TRADES_PREFIX_KEY}--${folderId}`);
  }

  async deleteTrade(tradeId: string, folderId: string): Promise<void> {
    const trades = await this.fetchTradesByFolderId(folderId);

    const updatedTrades = trades.filter((trade: BookmarksTradeStruct) => trade.id !== tradeId);

    await this.persistTrades(updatedTrades, folderId);
  }

  initializeFolderStruct(version: TradeSiteVersion): BookmarksFolderStruct {
    return {
      version,
      icon: null,
      title: '',
      archivedAt: null,
    };
  }

  private migrateOldTrade(trade: BookmarksTradeStruct): BookmarksTradeStruct {
    if (!trade.location.version) {
      trade.location.version = '1';
    }
    return trade;
  }

  private migrateOldFolder(folder: Partial<BookmarksFolderStruct>): BookmarksFolderStruct {
    const baseFolder = this.initializeFolderStruct(folder.version ?? '1');

    return {
      ...baseFolder,
      ...folder,
    };
  }
}

const bookmarksStorage = new BookmarksStorage();

export { bookmarksStorage };
export type { PersistFolderOptions };
