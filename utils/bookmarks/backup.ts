import { deserialize, serialize } from './export';
import { bookmarksStorage } from '@/services/bookmarks/storage';
import type { BookmarksFolderStruct, BookmarksTradeStruct } from '@/types/bookmarks';

const SECTION_DELIMITER = '\n--------------------\n';
const LINE_DELIMITER = '\n';

const generateBackupDataString = async (): Promise<string> => {
  const activeFolderStrings: string[] = [];
  const archivedFolderStrings: string[] = [];

  const folders = await bookmarksStorage.fetchFolders();

  for (const folder of folders) {
    if (!folder.id) continue;

    const trades = await bookmarksStorage.fetchTradesByFolderId(folder.id);
    const serializedFolder = serialize(folder, trades);

    (folder.archivedAt ? archivedFolderStrings : activeFolderStrings).push(serializedFolder);
  }

  return [activeFolderStrings.join(LINE_DELIMITER), archivedFolderStrings.join(LINE_DELIMITER)].join(SECTION_DELIMITER);
};

/** Parses one section of a Backup (one Export String per line); null if any line is not a valid Export String */
const parseSection = (section = '', folderOverrides: Partial<BookmarksFolderStruct> = {}) => {
  const folders: Array<[BookmarksFolderStruct, BookmarksTradeStruct[]]> = [];

  for (const line of section.split(LINE_DELIMITER)) {
    if (!line.trim()) continue;

    const parsed = deserialize(line);
    if (!parsed) return null;

    folders.push([{ ...parsed[0], ...folderOverrides }, parsed[1]]);
  }

  return folders;
};

/**
 * Adds every Folder of a Backup to the existing ones. The whole Backup is parsed first: a Backup with any invalid
 * line, or with no Folder at all, writes nothing and returns false (1.9.1 skipped the invalid lines instead).
 */
const restoreFromDataString = async (stringData: string): Promise<boolean> => {
  // A Backup edited on Windows may come back with CRLF line endings
  const [activeSection, archivedSection] = stringData.replaceAll('\r\n', '\n').split(SECTION_DELIMITER);
  const activeFolders = parseSection(activeSection);
  const archivedFolders = parseSection(archivedSection, { archivedAt: new Date().toUTCString() });
  if (!activeFolders || !archivedFolders) return false;

  const folders = [...activeFolders, ...archivedFolders];
  if (folders.length === 0) return false;

  try {
    for (const [folder, trades] of folders) {
      const folderId = await bookmarksStorage.persistFolder(folder);
      await bookmarksStorage.persistTrades(trades, folderId);
    }
    return true;
  } catch {
    return false;
  }
};

export { generateBackupDataString, restoreFromDataString };
