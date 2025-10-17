import { useBookmarksContext } from '@/contexts/BookmarksContext';
import { useTradeLocation } from '@/hooks/useTradeLocation';
import { recommendTitle } from '@/utils/search-panel';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { BookmarksTradeStruct } from '@/types/bookmarks';
import type { ExactTradeLocationStruct } from '@/types/trade-location';

const TITLE_MUTATION_THROTTLE_SPACING_MS = 100;
const WOOP_PREFIX_REGEX = /^\((\d+)\) /;

/**
 * Simple throttle helper
 */
const throttle = <T extends (...args: unknown[]) => void>(func: T, waitMs: number): T & { cancel: () => void } => {
  let timeout: number | null = null;
  let lastCallTime: number | null = null;

  const throttled = ((...args: unknown[]) => {
    const now = Date.now();

    if (lastCallTime === null || now - lastCallTime >= waitMs) {
      lastCallTime = now;
      func(...args);
    } else {
      if (timeout !== null) {
        clearTimeout(timeout);
      }
      timeout = window.setTimeout(
        () => {
          lastCallTime = now;
          func(...args);
          timeout = null;
        },
        waitMs - (now - lastCallTime),
      );
    }
  }) as T & { cancel: () => void };

  throttled.cancel = () => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return throttled;
};

interface UsePageTitleOptions {
  enabled?: boolean;
}

/**
 * Hook to manage the page title based on bookmarks, trade location, and live status
 *
 * This hook:
 * - Observes document title mutations to track woop count (trade notifications)
 * - Updates title with bookmark/search name, live status (⚡), and woop count
 * - Uses throttled MutationObserver to prevent infinite loops with other extensions
 *
 * @param options - Configuration options
 * @param options.enabled - Whether the title management is active (default: true)
 *
 * @example
 * usePageTitle(); // Auto-manages page title
 */
const usePageTitle = (options: UsePageTitleOptions = {}) => {
  const { enabled = true } = options;

  const { fetchTradeByLocation } = useBookmarksContext();
  const { currentTradeLocation } = useTradeLocation();

  const [baseSiteTitle, setBaseSiteTitle] = useState<string>('');
  const [lastWoopCount, setLastWoopCount] = useState<number | null>(null);
  const [title, setTitle] = useState<string | null>(null);

  const observerRef = useRef<MutationObserver | null>(null);

  /**
   * Parse woop count from title
   * Returns null if no woop count prefix found
   */
  const parseWoopCount = useCallback((titleText: string): number | null => {
    const woopTitleMatch = WOOP_PREFIX_REGEX.exec(titleText);
    if (!woopTitleMatch) return null;

    const parsedWoopCount = parseInt(woopTitleMatch[1], 10);
    return Number.isNaN(parsedWoopCount) ? null : parsedWoopCount;
  }, []);

  /**
   * Update the document title with woop count prefix
   */
  const updateTitle = useCallback(() => {
    if (title === null) return;

    const woopPrefix = lastWoopCount !== null ? `(${lastWoopCount}) ` : '';
    const newTitle = woopPrefix + title;
    if (document.title !== newTitle) {
      document.title = newTitle;
    }
  }, [title, lastWoopCount]);

  /**
   * Handle document title mutations (to track woop count)
   */
  const onDocumentTitleMutation = useCallback(() => {
    const woopCount = parseWoopCount(document.title);
    setLastWoopCount(woopCount);
  }, [parseWoopCount]);

  /**
   * Throttled mutation handler
   */
  const throttledTitleMutationHandlerRef = useRef(
    throttle(onDocumentTitleMutation, TITLE_MUTATION_THROTTLE_SPACING_MS),
  );

  // Update the throttled handler when the callback changes
  useEffect(() => {
    throttledTitleMutationHandlerRef.current.cancel();
    throttledTitleMutationHandlerRef.current = throttle(onDocumentTitleMutation, TITLE_MUTATION_THROTTLE_SPACING_MS);
  }, [onDocumentTitleMutation]);

  /**
   * Recalculate the trade title segment based on bookmark/location
   */
  const recalculateTradeTitleSegment = useCallback(
    async (location: ExactTradeLocationStruct, bookmark?: BookmarksTradeStruct | null) => {
      let activeTradeTitle = '';

      if (bookmark) {
        activeTradeTitle = bookmark.title;
      } else if (location.type === 'search') {
        activeTradeTitle = recommendTitle();
      }

      const isLiveSegment = location.isLive ? '⚡ ' : '';
      const tradeTitleSegment = activeTradeTitle ? `${activeTradeTitle} - ` : '';

      setTitle(`${isLiveSegment}${tradeTitleSegment}${baseSiteTitle}`);
    },
    [baseSiteTitle],
  );

  /**
   * Initialize base site title and MutationObserver
   */
  useEffect(() => {
    if (!enabled) return;

    const titleElement = document.querySelector('title');
    if (!titleElement) return;

    // Store base site title
    setBaseSiteTitle(document.title);

    // Set up MutationObserver
    observerRef.current = new MutationObserver(throttledTitleMutationHandlerRef.current);
    observerRef.current.observe(titleElement, { childList: true });

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
      throttledTitleMutationHandlerRef.current.cancel();
    };
  }, [enabled]);

  /**
   * Update title when it changes
   */
  useEffect(() => {
    if (!enabled) return;
    updateTitle();
  }, [enabled, updateTitle]);

  /**
   * Recalculate title when trade location or bookmarks change
   */
  useEffect(() => {
    if (!enabled || !baseSiteTitle || !currentTradeLocation) return;

    const updateTitleFromLocation = async () => {
      const activeBookmark = await fetchTradeByLocation(currentTradeLocation);
      await recalculateTradeTitleSegment(currentTradeLocation, activeBookmark);
    };

    updateTitleFromLocation().catch(console.error);
  }, [enabled, baseSiteTitle, currentTradeLocation, fetchTradeByLocation, recalculateTradeTitleSegment]);

  return {
    currentTitle: title,
    woopCount: lastWoopCount,
  };
};

export { usePageTitle };
export type { UsePageTitleOptions };
