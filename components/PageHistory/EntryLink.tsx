import styles from './EntryLink.module.scss';
import { generateTradeUrl } from './services-stub';
import { formatDistance } from 'date-fns';
import { enUS } from 'date-fns/locale';
import type { TradeLocationHistoryStruct } from './types';
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

  const tradeUrl = generateTradeUrl(historyEntry);

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
