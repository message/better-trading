import { getLocalValue, setLocalValue } from '@/utils/storage';
import { useCallback, useState } from 'react';

// Same key and comma-separated format as 1.9.1
const STORAGE_KEY = 'bookmark-folders-expansion';

const readExpandedFolderIds = (): string[] => getLocalValue(STORAGE_KEY)?.split(',').filter(Boolean) ?? [];

const useBookmarksState = () => {
  // Read synchronously so remembered folders render expanded on the first paint
  const [expandedFolderIds, setExpandedFolderIds] = useState<string[]>(readExpandedFolderIds);

  const persistExpandedFolderIds = useCallback((ids: string[]) => {
    setLocalValue(STORAGE_KEY, ids.join(','));
    setExpandedFolderIds(ids);
  }, []);

  const toggleFolderExpansion = useCallback(
    (folderId: string) =>
      persistExpandedFolderIds(
        expandedFolderIds.includes(folderId)
          ? expandedFolderIds.filter(id => id !== folderId)
          : [...expandedFolderIds, folderId],
      ),
    [expandedFolderIds, persistExpandedFolderIds],
  );

  const collapseAllFolders = useCallback(() => persistExpandedFolderIds([]), [persistExpandedFolderIds]);

  return { expandedFolderIds, toggleFolderExpansion, collapseAllFolders };
};

export { useBookmarksState };
