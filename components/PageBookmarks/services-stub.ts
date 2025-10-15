// TODO: These services will be migrated to service or hook layer later
// For now, these are stub implementations for the PageBookmarks component migration

import type { BookmarksFolderStruct, BookmarksTradeStruct, PartialBookmarksTradeLocation } from '@/types/bookmarks';
import type { TradeSiteVersion } from '@/types/trade-location';

// Flash Messages Service Stub
export interface FlashMessagesStub {
  success: (message: string) => void;
  alert: (message: string) => void;
}

export const flashMessagesStub: FlashMessagesStub = {
  success: (message: string) => {
    console.log('[FlashMessages SUCCESS]:', message);
    // TODO: Implement proper flash messages UI
  },
  alert: (message: string) => {
    console.warn('[FlashMessages ALERT]:', message);
    // TODO: Implement proper flash messages UI
  },
};

// Bookmarks Service Stub
export interface BookmarksServiceStub {
  fetchFolders: () => Promise<BookmarksFolderStruct[]>;
  fetchTradesByFolderId: (folderId: string) => Promise<BookmarksTradeStruct[]>;
  deleteFolder: (folder: BookmarksFolderStruct) => Promise<void>;
  toggleFolderArchive: (folder: BookmarksFolderStruct) => Promise<void>;
  persistFolder: (folder: BookmarksFolderStruct) => Promise<string>;
  persistFolders: (folders: BookmarksFolderStruct[]) => Promise<void>;
  persistTrade: (trade: BookmarksTradeStruct, folderId: string) => Promise<void>;
  persistTrades: (trades: BookmarksTradeStruct[], folderId: string) => Promise<void>;
  deleteTrade: (trade: BookmarksTradeStruct, folderId: string) => Promise<void>;
  toggleTradeCompletion: (trade: BookmarksTradeStruct, folderId: string) => Promise<void>;
  initializeFolderStruct: (version: TradeSiteVersion) => BookmarksFolderStruct;
  initializeTradeStructFrom: (location: PartialBookmarksTradeLocation) => BookmarksTradeStruct;
  partiallyReorderFolders: (
    folders: BookmarksFolderStruct[],
    reordered: BookmarksFolderStruct[],
  ) => BookmarksFolderStruct[];
  getExpandedFolderIds: () => string[];
  toggleFolderExpansion: (expandedIds: string[], folderId: string) => string[];
  collapseAllFolders: () => string[];
  generateBackupDataString: () => Promise<string>;
  restoreFromDataString: (dataString: string) => Promise<boolean>;
  deserializeFolder: (input: string) => [BookmarksFolderStruct, BookmarksTradeStruct[]] | null;
}

export const bookmarksServiceStub: BookmarksServiceStub = {
  fetchFolders: async () =>
    // TODO: Implement real API call
    [],
  fetchTradesByFolderId: async () =>
    // TODO: Implement real API call
    [],
  deleteFolder: async () => {
    // TODO: Implement real API call
  },
  toggleFolderArchive: async () => {
    // TODO: Implement real API call
  },
  persistFolder: async folder =>
    // TODO: Implement real API call
    folder.id || String(Date.now()),
  persistFolders: async () => {
    // TODO: Implement real API call
  },
  persistTrade: async () => {
    // TODO: Implement real API call
  },
  persistTrades: async () => {
    // TODO: Implement real API call
  },
  deleteTrade: async () => {
    // TODO: Implement real API call
  },
  toggleTradeCompletion: async () => {
    // TODO: Implement real API call
  },
  initializeFolderStruct: (version: TradeSiteVersion) => ({
    title: '',
    version,
    icon: null,
    archivedAt: null,
  }),
  initializeTradeStructFrom: location => ({
    title: '',
    location: {
      version: location.version,
      type: location.type || 'search',
      slug: location.slug || '',
    },
    completedAt: null,
  }),
  partiallyReorderFolders: folders =>
    // TODO: Implement proper reordering logic
    folders,
  getExpandedFolderIds: () =>
    // TODO: Implement localStorage persistence
    [],
  toggleFolderExpansion: (expandedIds, folderId) =>
    expandedIds.includes(folderId) ? expandedIds.filter(id => id !== folderId) : [...expandedIds, folderId],
  collapseAllFolders: () => [],
  generateBackupDataString: async () =>
    // TODO: Implement real backup generation
    JSON.stringify({ folders: [], trades: [] }),
  restoreFromDataString: async () =>
    // TODO: Implement real restore logic
    true,
  deserializeFolder: () =>
    // TODO: Implement real deserialization
    null,
};

// Trade Location Service Stub
export interface TradeLocationStub {
  version: TradeSiteVersion;
  league: string | null;
  type: string | null;
  slug: string | null;
  getTradeUrl: (version: TradeSiteVersion, type: string, slug: string, league: string) => string;
}

export const tradeLocationStub: TradeLocationStub = {
  version: '1',
  league: 'Standard',
  type: 'search',
  slug: null,
  getTradeUrl: (version, type, slug, league) =>
    // TODO: Implement real URL generation
    `https://www.pathofexile.com/trade/${type}/${league}/${slug}`,
};

// Search Panel Service Stub (for recommending trade titles)
export interface SearchPanelStub {
  recommendTitle: () => string;
}

export const searchPanelStub: SearchPanelStub = {
  recommendTitle: () =>
    // TODO: Implement real title recommendation
    'Untitled Trade',
};

// Copy to Clipboard Utility
export const copyToClipboard = (text: string): void => {
  // TODO: Implement proper clipboard copying
  navigator.clipboard
    .writeText(text)
    .then(() => console.log('[Clipboard] Copied:', text))
    .catch(err => console.error('[Clipboard] Failed to copy:', err));
};
