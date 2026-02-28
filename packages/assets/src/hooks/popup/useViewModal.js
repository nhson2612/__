import React, {useState} from 'react';
import {Modal} from '@shopify/polaris';

/**
 * Build a simple view-only modal.
 * @param {string} title
 * @param {React.ReactNode} content
 * @param {boolean} [large=false]
 * @param {boolean} [instant=true]
 * @param {boolean} [sectioned=false]
 * @param {function(): void} [closeCallback=() => {}]
 * @returns {{openModal: function(): void, closeModal: function(): void, modal: React.JSX.Element, open: boolean}}
 */
export default function useViewModal({
  title,
  content,
  large = false,
  instant = true,
  sectioned = false,
  closeCallback = () => {}
}) {
  const [open, setOpen] = useState(false);

  /**
   * Open the modal.
   * @returns {void}
   */
  const openModal = () => setOpen(true);
  /**
   * Close the modal.
   * @returns {void}
   */
  const closeModal = () => setOpen(false);
  /**
   * Close the modal and invoke the close callback.
   * @returns {void}
   */
  const handleClose = () => {
    closeModal();
    closeCallback();
  };

  const modal = (
    <Modal
      large={large}
      instant={instant}
      sectioned={sectioned}
      open={open}
      onClose={() => handleClose()}
      title={title}
      secondaryActions={[{content: 'Close', onAction: () => handleClose()}]}
    >
      {content}
    </Modal>
  );

  return {modal, open, closeModal, openModal};
}
