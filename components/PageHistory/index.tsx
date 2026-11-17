import EntryLink from './EntryLink';
import styles from './styles.module.scss';
import AlertMessage from '../AlertMessage';
import Button from '../Button';
import LoadingContainer from '../LoadingContainer';
import XmarkIcon from '@/assets/icons/solid/xmark.svg?react';
import { useFlashMessagesContext } from '@/contexts/FlashMessagesContext';
import { useTradeHistoryContext } from '@/contexts/TradeHistoryContext';
import { useTradeLocation } from '@/hooks/useTradeLocation';
import { useCallback, useEffect, useState } from 'react';
import type { TradeLocationHistoryStruct } from '@/types/trade-location';
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
  const tradeHistory = useTradeHistoryContext();
  const { addFlash } = useFlashMessagesContext();

  const [historyEntries, setHistoryEntries] = useState<TradeLocationHistoryStruct[]>([]);

  const fetchHistoryEntries = useCallback(async () => {
    const entries = await tradeHistory.fetchHistoryEntries();
    setHistoryEntries(entries);
  }, [tradeHistory]);

  const handleClearHistory = async () => {
    try {
      setHistoryEntries([]);
      await tradeHistory.clearHistoryEntries();
      addFlash(clearSuccessMessage, 'success');
    } catch {
      addFlash(genericAlertMessage, 'alert');
    }
  };

  // Subscribe to trade location changes
  useTradeLocation({
    onChange: () => {
      fetchHistoryEntries().catch(error => {
        console.error('Failed to refetch history entries:', error);
      });
    },
  });

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
            icon={XmarkIcon}
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
