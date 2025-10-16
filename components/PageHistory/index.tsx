import EntryLink from './EntryLink';
import { flashMessagesServiceStub, tradeLocationServiceStub } from './services-stub';
import styles from './styles.module.scss';
import AlertMessage from '../AlertMessage';
import Button from '../Button';
import LoadingContainer from '../LoadingContainer';
import { useCallback, useEffect, useState } from 'react';
import type { TradeLocationHistoryStruct } from './types';
import type React from 'react';

interface PageHistoryProps {
  clearButtonLabel: string;
  emptyMessage: string;
  clearSuccessMessage: string;
  genericAlertMessage: string;
}

const PageHistory: React.FC<PageHistoryProps> = ({
  clearButtonLabel,
  emptyMessage,
  clearSuccessMessage,
  genericAlertMessage,
}) => {
  const [historyEntries, setHistoryEntries] = useState<TradeLocationHistoryStruct[]>([]);

  const fetchHistoryEntries = useCallback(async () => {
    const entries = await tradeLocationServiceStub.fetchHistoryEntries();
    setHistoryEntries(entries);
  }, []);

  const handleClearHistory = async () => {
    try {
      setHistoryEntries([]);
      await tradeLocationServiceStub.clearHistoryEntries();
      flashMessagesServiceStub.success(clearSuccessMessage);
    } catch {
      flashMessagesServiceStub.alert(genericAlertMessage);
    }
  };

  const handleTradeLocationChange = useCallback(() => {
    fetchHistoryEntries().catch(error => {
      console.error('Failed to refetch history entries:', error);
    });
  }, [fetchHistoryEntries]);

  // Subscribe to trade location changes
  useEffect(() => {
    tradeLocationServiceStub.on('change', null, handleTradeLocationChange);

    return () => {
      tradeLocationServiceStub.off('change', null, handleTradeLocationChange);
    };
  }, [handleTradeLocationChange]);

  // Refetch on window focus
  useEffect(() => {
    const handleWindowFocus = () => {
      fetchHistoryEntries().catch(error => {
        console.error('Failed to refetch history entries on focus:', error);
      });
    };

    window.addEventListener('focus', handleWindowFocus);

    return () => {
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [fetchHistoryEntries]);

  return (
    <LoadingContainer task={fetchHistoryEntries} size="large">
      {historyEntries.length > 0 ? (
        <>
          {historyEntries.map(historyEntry => (
            <EntryLink key={historyEntry.id} historyEntry={historyEntry} />
          ))}
          <Button
            type="button"
            theme="gold"
            label={clearButtonLabel}
            onClick={handleClearHistory}
            icon="times"
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
