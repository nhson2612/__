import React from 'react';
import PropTypes from 'prop-types';
import {Button, Frame, Modal, TextContainer} from '@shopify/polaris';

/**
 * @param {boolean} open
 * @param {string} title
 * @param {string} message
 * @param {string} confirmText
 * @param {string} cancelText
 * @param {function} onConfirm
 * @param {function} onCancel
 * @return {React.JSX.Element|null}
 * @constructor
 */
export default function ConfirmationDialog({
  open,
  title = 'Xác nhận',
  message = 'Bạn có chắc chắn không?',
  confirmText = 'Xóa',
  cancelText = 'Hủy',
  onConfirm,
  onCancel
}) {
  if (!open) return null;

  return (
    <div style={styles.wrapper}>
      <Frame>
        <Modal open={open} onClose={onCancel} title={title}>
          <Modal.Section>
            <TextContainer>
              <p>{message}</p>
            </TextContainer>
          </Modal.Section>
          <Modal.Section>
            <div style={styles.actions}>
              <Button onClick={onCancel}>{cancelText}</Button>
              <Button destructive onClick={onConfirm}>
                {confirmText}
              </Button>
            </div>
          </Modal.Section>
        </Modal>
      </Frame>
    </div>
  );
}

ConfirmationDialog.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  message: PropTypes.string,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func
};

ConfirmationDialog.defaultProps = {
  open: false,
  title: 'Xác nhận',
  message: 'Bạn có chắc chắn không?',
  confirmText: 'Xóa',
  cancelText: 'Hủy',
  onConfirm: () => {},
  onCancel: () => {}
};

const styles = {
  wrapper: {
    minHeight: 0
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '4px'
  }
};
