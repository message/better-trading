import React, { useState } from 'react';
import Button from '../../app/components/button';
import Header from '@/app/components/header';
import Modal from '@/app/components/modal';

export default () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Header />
      <Button onClick={handleOpenModal}>Open Modal</Button>

      <Modal
        title="Sample Modal"
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      >
        <p>This is a sample modal content using CSS modules!</p>
        <p>The modal has been converted to use CSS modules with nesting optimization.</p>
      </Modal>
    </>
  );
};