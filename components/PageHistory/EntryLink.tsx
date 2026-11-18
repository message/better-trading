import styles from './EntryLink.module.scss';
import { getTradeUrl } from '@/utils/trade-location';
import type { TradeLocationHistoryStruct } from '@/types/trade-location';
import type React from 'react';

interface EntryLinkProps {
  historyEntry: TradeLocationHistoryStruct;
  formatCreatedAt: (createdAt: string) => string;
}

const EntryLink: React.FC<EntryLinkProps> = ({ historyEntry, formatCreatedAt }) => {
  const formattedSlug = [historyEntry.type, historyEntry.league, historyEntry.slug].join('/');

  const tradeUrl = getTradeUrl(historyEntry.version, historyEntry.type, historyEntry.slug, historyEntry.league);

  return (
    <a href={tradeUrl} className={styles.entryLink}>
      <div className={styles.title}>{historyEntry.title}</div>
      <div className={styles.details}>
        <div className={styles.slug}>{formattedSlug}</div>
        <div>{formatCreatedAt(historyEntry.createdAt)}</div>
      </div>
    </a>
  );
};

export default EntryLink;
