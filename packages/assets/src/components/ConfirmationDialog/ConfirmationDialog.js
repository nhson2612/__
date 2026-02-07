import React from 'react';

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
    <div style={styles.backdrop}>
      <div style={styles.modal}>
        <h3>{title}</h3>
        <p>{message}</p>

        <div style={styles.actions}>
          <button onClick={onCancel} style={styles.cancel}>
            {cancelText}
          </button>
          <button onClick={onConfirm} style={styles.confirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modal: {
    background: '#fff',
    padding: '20px',
    borderRadius: '8px',
    width: '320px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '20px'
  },
  cancel: {
    background: '#e0e0e0',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  confirm: {
    background: '#d32f2f',
    color: '#fff',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};
