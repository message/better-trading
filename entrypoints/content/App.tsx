import ChangelogBanner from '@/components/ChangelogBanner';
import ExpandButton from '@/components/ExpandButton';
import FlashMessages from '@/components/FlashMessages';
import Header from '@/components/Header';
import PageAbout from '@/components/PageAbout';
import PageBookmarks from '@/components/PageBookmarks';
import PageHistory from '@/components/PageHistory';
import PagePinnedItems from '@/components/PagePinnedItems';
import RootPageMenu from '@/components/RootPageMenu';
import { BookmarksProvider } from '@/contexts/BookmarksContext';
import { FlashMessagesProvider, useFlashMessagesContext } from '@/contexts/FlashMessagesContext';
import { ItemResultsProvider } from '@/contexts/ItemResultsContext';
import { TradeHistoryProvider } from '@/contexts/TradeHistoryContext';
import { useMessages } from '@/hooks/useMessages';
import { usePageTitle } from '@/hooks/usePageTitle';
import { RootPage } from '@/types/root-page';
import { currentChangelog } from '@/utils/changelog';
import { getLocalValue, setLocalValue } from '@/utils/storage';
import { useState } from 'react';

const CURRENT_PAGE_STORAGE_KEY = 'current-page';
const GITHUB_URL = 'https://github.com/exile-center/better-trading';

const readStoredPage = (): RootPage => {
  const stored = getLocalValue(CURRENT_PAGE_STORAGE_KEY);
  // Unknown values (e.g. written by a future version) fall back to the default instead of rendering nothing
  return Object.values(RootPage).find(page => page === stored) ?? RootPage.BOOKMARKS;
};

const Shell = () => {
  const messages = useMessages();
  const { flashMessages, dismissFlash } = useFlashMessagesContext();
  const [currentPage, setCurrentPage] = useState<RootPage>(readStoredPage);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  usePageTitle();

  const appVersion = browser.runtime.getManifest().version;

  const changePage = (page: RootPage) => {
    setLocalValue(CURRENT_PAGE_STORAGE_KEY, page);
    setCurrentPage(page);
  };

  return (
    <ItemResultsProvider messages={messages.itemResults} onPinnedItemsChange={() => changePage(RootPage.PINNED_ITEMS)}>
      <ChangelogBanner changelog={currentChangelog} {...messages.changelogBanner(appVersion)} />

      <Header
        {...messages.header}
        isOnRootRoute={!isAboutOpen}
        onBrandClick={() => setIsAboutOpen(false)}
        onToggleClick={() => setIsAboutOpen(isOpen => !isOpen)}
      />
      <ExpandButton {...messages.expandButton} />

      {isAboutOpen ? (
        <PageAbout
          {...messages.pageAbout}
          appVersion={appVersion}
          githubUrl={GITHUB_URL}
          currentChangelog={currentChangelog}
        />
      ) : (
        <>
          <RootPageMenu {...messages.rootPageMenu} currentPage={currentPage} onChange={changePage} />

          {currentPage === RootPage.BOOKMARKS && <PageBookmarks {...messages.pageBookmarks} />}
          {currentPage === RootPage.HISTORY && <PageHistory {...messages.pageHistory} />}
          {currentPage === RootPage.PINNED_ITEMS && <PagePinnedItems {...messages.pagePinnedItems} />}
        </>
      )}

      <FlashMessages flashMessages={flashMessages} onDismiss={flash => dismissFlash(flash.id)} />
    </ItemResultsProvider>
  );
};

const App = () => (
  <FlashMessagesProvider>
    <BookmarksProvider>
      <TradeHistoryProvider>
        <Shell />
      </TradeHistoryProvider>
    </BookmarksProvider>
  </FlashMessagesProvider>
);

export default App;
