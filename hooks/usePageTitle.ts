import { useBookmarksContext } from '@/contexts/BookmarksContext';
import { useTradeLocation } from '@/hooks/useTradeLocation';
import { recommendTitle } from '@/utils/search-panel';
import { useEffect, useRef } from 'react';

const TITLE_MUTATION_THROTTLE_SPACING_MS = 100;
const WOOP_PREFIX_REGEX = /^\((\d+)\) /;

// null means "no woop count prefix"
const parseWoopCount = (title: string): number | null => {
  const match = WOOP_PREFIX_REGEX.exec(title);
  return match ? parseInt(match[1]!, 10) : null;
};

const applyTitle = (title: string | null, woopCount: number | null) => {
  if (title === null) return;

  const newTitle = (woopCount !== null ? `(${woopCount}) ` : '') + title;
  if (document.title !== newTitle) document.title = newTitle;
};

// Leading and trailing calls, like lodash's throttle defaults
const throttle = (callback: () => void, waitMs: number) => {
  let lastCallAt = 0;
  let timeout: number | null = null;

  const throttled = () => {
    const remainingMs = lastCallAt + waitMs - Date.now();
    if (remainingMs <= 0) {
      lastCallAt = Date.now();
      callback();
    } else if (timeout === null) {
      timeout = window.setTimeout(() => {
        timeout = null;
        lastCallAt = Date.now();
        callback();
      }, remainingMs);
    }
  };
  throttled.cancel = () => {
    if (timeout !== null) window.clearTimeout(timeout);
    timeout = null;
  };

  return throttled;
};

/**
 * Keeps the tab title as "[(woops) ][⚡ ][trade title - ]<site title>", where the trade title is the active
 * bookmark's title or, for searches, the search panel's recommended title.
 *
 * The trade site regularly resets the title and prefixes it with an unread woop count, so every title mutation
 * re-applies ours while keeping that count. The throttling prevents busy loops if another extension or
 * userscript fights over the title.
 */
const usePageTitle = () => {
  const { folders, fetchTradeByLocation } = useBookmarksContext();
  const { currentTradeLocation } = useTradeLocation();

  // The site title without the woop count, e.g. "Trade - Path of Exile" (translated by the site)
  const baseSiteTitleRef = useRef(document.title);
  // null means "uncontrolled": the extension has not computed a title yet
  const titleRef = useRef<string | null>(null);
  const woopCountRef = useRef<number | null>(null);

  useEffect(() => {
    const titleElement = document.querySelector('title');
    if (!titleElement) return;

    const handleTitleMutation = throttle(() => {
      woopCountRef.current = parseWoopCount(document.title);
      applyTitle(titleRef.current, woopCountRef.current);
    }, TITLE_MUTATION_THROTTLE_SPACING_MS);

    const observer = new MutationObserver(handleTitleMutation);
    observer.observe(titleElement, { childList: true });

    return () => {
      observer.disconnect();
      handleTitleMutation.cancel();
    };
  }, []);

  // Recalculated on location changes and on bookmark changes (`folders` is refreshed after every mutation)
  useEffect(() => {
    let isCancelled = false;

    fetchTradeByLocation(currentTradeLocation)
      .then(activeBookmark => {
        if (isCancelled) return;

        let activeTradeTitle = '';
        if (activeBookmark) activeTradeTitle = activeBookmark.title;
        else if (currentTradeLocation.type === 'search') activeTradeTitle = recommendTitle();

        const liveSegment = currentTradeLocation.isLive ? '⚡ ' : '';
        const tradeTitleSegment = activeTradeTitle ? `${activeTradeTitle} - ` : '';

        titleRef.current = `${liveSegment}${tradeTitleSegment}${baseSiteTitleRef.current}`;
        applyTitle(titleRef.current, woopCountRef.current);
      })
      .catch(console.error);

    return () => {
      isCancelled = true;
    };
  }, [currentTradeLocation, folders, fetchTradeByLocation]);
};

export { usePageTitle };
