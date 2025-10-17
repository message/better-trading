import { deserialize, serialize } from './export';
import { bookmarksStorage } from '@/services/bookmarks/storage';
import type { BookmarksFolderStruct } from '@/types/bookmarks';

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

const restoreFromDataString = async (stringData: string): Promise<boolean> => {
  try {
    const [activeSection, archivedSection] = stringData.split(SECTION_DELIMITER);
    const activeFolderStrings = activeSection.split(LINE_DELIMITER).filter(Boolean);
    const archivedFolderStrings = archivedSection.split(LINE_DELIMITER).filter(Boolean);

    const restoredActiveFoldersCount = await restoreFolders(activeFolderStrings);
    const restoredArchivedFoldersCount = await restoreFolders(archivedFolderStrings, {
      archivedAt: new Date().toUTCString(),
    });

    return restoredActiveFoldersCount + restoredArchivedFoldersCount > 0;
  } catch {
    return false;
  }
};

const restoreFolders = async (
  folderStrings: string[],
  folderOverrides: Partial<BookmarksFolderStruct> = {},
): Promise<number> => {
  let restoredFoldersCount = 0;

  for (const folderString of folderStrings) {
    const deserializedData = deserialize(folderString);
    if (!deserializedData) continue;

    const [folder, trades] = deserializedData;

    const folderId = await bookmarksStorage.persistFolder({
      ...folder,
      ...folderOverrides,
    });
    await bookmarksStorage.persistTrades(trades, folderId);
    restoredFoldersCount++;
  }

  return restoredFoldersCount;
};

export { generateBackupDataString, restoreFromDataString };
