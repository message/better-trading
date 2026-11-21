import EntryLink from './EntryLink';
import styles from './styles.module.scss';
import AlertMessage from '../AlertMessage';
import Button from '../Button';
import LoadingContainer from '../LoadingContainer';
import CloseIcon from '@/assets/icons/filled/close.svg?react';
import { useFlashMessagesContext } from '@/contexts/FlashMessagesContext';
import { useTradeHistoryContext } from '@/contexts/TradeHistoryContext';
import { useEffect } from 'react';
import type React from 'react';

interface PageHistoryProps {
  clearButtonLabel: string;
  emptyMessage: string;
  clearSuccessMessage: string;
  genericAlertMessage: string;
  /** Formats an entry's ISO creation date relative to now, e.g. "5 minutes ago" */
  formatCreatedAt: (createdAt: string) => string;
}

const PageHistory: React.FC<PageHistoryProps> = ({
  clearButtonLabel,
  emptyMessage,
  clearSuccessMessage,
  genericAlertMessage,
  formatCreatedAt,
}) => {
  const { historyEntries, refreshHistoryEntries, clearHistoryEntries } = useTradeHistoryContext();
  const { addFlash } = useFlashMessagesContext();

  const handleClearHistory = async () => {
    try {
      await clearHistoryEntries();
      addFlash(clearSuccessMessage, 'success');
    } catch {
      addFlash(genericAlertMessage, 'alert');
    }
  };

  // Searches made in other tabs show up when coming back to this one
  useEffect(() => {
    const handleWindowFocus = () => {
      refreshHistoryEntries().catch(error => console.error('Failed to refetch history entries on focus:', error));
    };

    window.addEventListener('focus', handleWindowFocus);
    return () => window.removeEventListener('focus', handleWindowFocus);
  }, [refreshHistoryEntries]);

  return (
    <LoadingContainer task={refreshHistoryEntries} size="large">
      {historyEntries.length > 0 ? (
        <>
          {historyEntries.map(historyEntry => (
            <EntryLink key={historyEntry.id} historyEntry={historyEntry} formatCreatedAt={formatCreatedAt} />
          ))}
          <Button
            type="button"
            theme="gold"
            label={clearButtonLabel}
            onClick={handleClearHistory}
            icon={CloseIcon}
            className={styles.clearButton}
          />
        </>
      ) : (
        <AlertMessage message={emptyMessage} type="warning" />
      )}
    </LoadingContainer>
  );
};

export default PageHistory;
