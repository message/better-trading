import { getLocalValue, setLocalValue } from '@/utils/storage';
import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'bookmark-folders-expansion';

const useBookmarksState = () => {
  const [expandedFolderIds, setExpandedFolderIds] = useState<string[]>([]);

  // Load initial state from localStorage
  useEffect(() => {
    const rawIds = getLocalValue(STORAGE_KEY);
    if (!rawIds) {
      setExpandedFolderIds([]);
      return;
    }

    setExpandedFolderIds(rawIds.split(','));
  }, []);

  const persistExpandedFolderIds = useCallback((ids: string[]) => {
    setLocalValue(STORAGE_KEY, ids.join(','));
    setExpandedFolderIds(ids);
    return ids;
  }, []);

  const toggleFolderExpansion = useCallback(
    (bookmarkFolderId: string) => {
      const expandedFolderIdsCopy = [...expandedFolderIds];
      const bookmarkFolderIdIndex = expandedFolderIdsCopy.indexOf(bookmarkFolderId);

      if (bookmarkFolderIdIndex > -1) {
        expandedFolderIdsCopy.splice(bookmarkFolderIdIndex, 1);
      } else {
        expandedFolderIdsCopy.push(bookmarkFolderId);
      }

      return persistExpandedFolderIds(expandedFolderIdsCopy);
    },
    [expandedFolderIds, persistExpandedFolderIds],
  );

  const getExpandedFolderIds = useCallback(() => expandedFolderIds, [expandedFolderIds]);

  const collapseAllFolders = useCallback(() => persistExpandedFolderIds([]), [persistExpandedFolderIds]);

  return {
    expandedFolderIds,
    toggleFolderExpansion,
    getExpandedFolderIds,
    collapseAllFolders,
  };
};

export { useBookmarksState };
