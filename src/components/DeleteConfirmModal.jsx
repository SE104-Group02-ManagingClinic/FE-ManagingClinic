import React from 'react';
import './DeleteConfirmModal.css';

const DeleteConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, isLoading = false }) => {
  if (!isOpen) return null;

  return (
    <div className="delete-modal-overlay" onClick={onCancel}>
      <div className="delete-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="delete-modal-header">
          <h3>⚠️ Xác nhận xóa</h3>
        </div>
        
        <div className="delete-modal-body">
          <p className="delete-modal-title">{title}</p>
          {message && <p className="delete-modal-message">{message}</p>}
        </div>

        <div className="delete-modal-footer">
          <button 
            className="delete-modal-btn delete-modal-btn-cancel"
            onClick={onCancel}
            disabled={isLoading}
          >
            ✕ Hủy
          </button>
          <button 
            className="delete-modal-btn delete-modal-btn-confirm"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? '⏳ Đang xóa...' : '✓ Xóa'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
