import styles from './TradeEdition.module.scss';
import Button from '../Button';
import FormContainer from '../FormContainer';
import FormField from '../FormField';
import FormInput from '../FormInput';
import Modal from '../Modal';
import FloppyDiskIcon from '@/assets/icons/solid/floppy-disk.svg?react';
import { useState } from 'react';
import type { BookmarksTradeLocation, BookmarksTradeStruct } from '@/types/bookmarks';
import type React from 'react';

/** Where a new Trade comes from: the current search or a Trade History entry */
interface TradeSource {
  label: string;
  title: string;
  location: BookmarksTradeLocation;
}

interface TradeEditionProps {
  /** The Trade to edit, or null to create one from `sources` */
  trade: BookmarksTradeStruct | null;
  /** Only used when creating; must not be empty then */
  sources: TradeSource[];
  modalTitle: string;
  modalCloseLabel: string;
  logoAlt: string;
  titleLabel: string;
  sourceLabel: string;
  saveLabel: string;
  onCancel: () => void;
  onSubmit: (trade: BookmarksTradeStruct) => Promise<void>;
}

const tradeFromSource = ({ title, location }: TradeSource): BookmarksTradeStruct => ({
  title,
  location,
  completedAt: null,
});

const TradeEdition: React.FC<TradeEditionProps> = ({
  trade: initialTrade,
  sources,
  modalTitle,
  modalCloseLabel,
  logoAlt,
  titleLabel,
  sourceLabel,
  saveLabel,
  onCancel,
  onSubmit,
}) => {
  const [trade, setTrade] = useState<BookmarksTradeStruct>(() => initialTrade ?? tradeFromSource(sources[0]));
  const [sourceIndex, setSourceIndex] = useState(0);

  const handleChangeSource = (index: number) => {
    setSourceIndex(index);
    setTrade(tradeFromSource(sources[index]));
  };

  return (
    <Modal title={modalTitle} closeLabel={modalCloseLabel} logoAlt={logoAlt} onClose={onCancel} isOpen={true}>
      <FormContainer onSubmit={() => onSubmit(trade)} canSubmit={Boolean(trade.title)}>
        {!initialTrade && sources.length > 1 && (
          <FormField label={sourceLabel}>
            <select
              className={styles.select}
              value={sourceIndex}
              onChange={event => handleChangeSource(Number(event.target.value))}>
              {sources.map((source, index) => (
                <option key={index} value={index}>
                  {source.label}
                </option>
              ))}
            </select>
          </FormField>
        )}

        <FormInput
          label={titleLabel}
          value={trade.title}
          autofocus={true}
          onChange={title => setTrade({ ...trade, title })}
        />

        <Button type="submit" theme="gold" label={saveLabel} icon={FloppyDiskIcon} />
      </FormContainer>
    </Modal>
  );
};

export type { TradeSource };
export default TradeEdition;
