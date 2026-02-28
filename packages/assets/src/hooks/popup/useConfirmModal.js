import React, {useCallback, useRef, useState} from 'react';
import {Form, Modal} from '@shopify/polaris';

/**
 * Build a confirmation modal with optional form content.
 * @param {function(string | number | null): (boolean | Promise<boolean>)} confirmAction
 * @param {function(): void} [cancelAction]
 * @param {string} [title='Are you sure to delete?']
 * @param {string | Element} [content='Please be careful because you cannot undo this action.']
 * @param {function(object): React.ReactNode} [ComponentContent=(_p) => <></>]
 * @param {string} [buttonTitle='Confirm']
 * @param {string} [closeTitle='Cancel']
 * @param {React.ReactNode} [footer=null]
 * @param {boolean} [loading=false]
 * @param {boolean} [disabled=false]
 * @param {boolean} [destructive=false]
 * @param {function(object): void} [setValidations=() => {}]
 * @param {function(): void} [closeCallback=() => {}]
 * @param {boolean} [canCloseAfterFinished=true]
 * @param {boolean} [useForm=false]
 * @returns {{openModal: function(string | number | null): void, closeModal: function(): void, modal: React.JSX.Element, open: boolean}}
 */
export default function useConfirmModal({
  confirmAction,
  cancelAction,
  title = 'Are you sure to delete?',
  content = 'Please be careful because you cannot undo this action.',
  ComponentContent = _p => <></>,
  buttonTitle = 'Confirm',
  closeTitle = 'Cancel',
  footer = null,
  loading = false,
  disabled = false,
  destructive = false,
  setValidations = () => {},
  closeCallback = () => {},
  canCloseAfterFinished = true,
  useForm = false
}) {
  const [open, setOpen] = useState(false);
  const currentId = useRef(null);

  const openModal = useCallback((id = null) => {
    setOpen(true);
    if (id !== null) currentId.current = id;
  }, []);

  const closeModal = () => {
    if (loading) return;
    setOpen(false);
    setValidations({});
  };

  const handleConfirm = async () => {
    const success = await confirmAction(currentId.current);
    if (!success) return;
    canCloseAfterFinished && closeModal();
  };

  const modal = (
    <Modal
      sectioned
      open={open}
      onClose={() => {
        closeModal();
        closeCallback();
      }}
      title={title}
      primaryAction={
        buttonTitle && {
          content: buttonTitle,
          loading,
          disabled,
          destructive,
          onAction: () => handleConfirm()
        }
      }
      secondaryActions={[
        closeTitle && {
          content: closeTitle,
          onAction: () => {
            if (cancelAction) {
              cancelAction();
              return;
            }
            closeModal();
            closeCallback();
          }
        }
      ].filter(Boolean)}
      footer={footer}
    >
      {content ||
        (useForm ? (
          <Form onSubmit={() => handleConfirm()} preventDefault>
            <ComponentContent {...{closeModal, currentId}} />
          </Form>
        ) : (
          <ComponentContent {...{closeModal, currentId}} />
        ))}
    </Modal>
  );

  return {modal, open, closeModal, openModal};
}
