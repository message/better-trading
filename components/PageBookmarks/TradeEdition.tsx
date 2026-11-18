import Button from '../Button';
import FormContainer from '../FormContainer';
import FormInput from '../FormInput';
import Modal from '../Modal';
import FloppyDiskIcon from '@/assets/icons/solid/floppy-disk.svg?react';
import { useState } from 'react';
import type { BookmarksTradeStruct } from '@/types/bookmarks';
import type React from 'react';

interface TradeEditionProps {
  /** The Trade to edit, or a new one staged from the current search */
  trade: BookmarksTradeStruct;
  modalTitle: string;
  modalCloseLabel: string;
  logoAlt: string;
  titleLabel: string;
  saveLabel: string;
  onCancel: () => void;
  onSubmit: (trade: BookmarksTradeStruct) => Promise<void>;
}

const TradeEdition: React.FC<TradeEditionProps> = ({
  trade: initialTrade,
  modalTitle,
  modalCloseLabel,
  logoAlt,
  titleLabel,
  saveLabel,
  onCancel,
  onSubmit,
}) => {
  const [trade, setTrade] = useState(initialTrade);

  return (
    <Modal title={modalTitle} closeLabel={modalCloseLabel} logoAlt={logoAlt} onClose={onCancel} isOpen={true}>
      <FormContainer onSubmit={() => onSubmit(trade)} canSubmit={Boolean(trade.title)}>
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

export default TradeEdition;
