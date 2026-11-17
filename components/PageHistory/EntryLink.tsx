import styles from './EntryLink.module.scss';
import { getTradeUrl } from '@/utils/trade-location';
import { formatDistance } from 'date-fns';
import { enUS } from 'date-fns/locale';
import type { TradeLocationHistoryStruct } from '@/types/trade-location';
import type React from 'react';

interface EntryLinkProps {
  historyEntry: TradeLocationHistoryStruct;
}

const EntryLink: React.FC<EntryLinkProps> = ({ historyEntry }) => {
  const formattedCreatedAt = formatDistance(new Date(historyEntry.createdAt), new Date(), {
    addSuffix: true,
    includeSeconds: true,
    locale: enUS,
  });

  const formattedSlug = [historyEntry.type, historyEntry.league, historyEntry.slug].join('/');

  const tradeUrl = getTradeUrl(historyEntry.version, historyEntry.type, historyEntry.slug, historyEntry.league);

  return (
    <a href={tradeUrl} className={styles.entryLink}>
      <div className={styles.title}>{historyEntry.title}</div>
      <div className={styles.details}>
        <div className={styles.slug}>{formattedSlug}</div>
        <div>{formattedCreatedAt}</div>
      </div>
    </a>
  );
};

export default EntryLink;
