import React from 'react';

const Delete_Modal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="_modal_overlay" 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
    >
      <div 
        className="_modal" 
        style={{
          background: 'white',
          borderRadius: '8px',
          padding: '24px',
          width: '400px',
          maxWidth: '90%',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}
      >
        <div className="_modal_header" style={{ marginBottom: '16px' }}>
          <h3 style={{ margin: 0, color: '#333' }}>Delete Post</h3>
        </div>
        
        <div className="_modal_content" style={{ marginBottom: '24px' }}>
          <p style={{ margin: 0, color: '#666' }}>
            Are you sure you want to delete this post? This action cannot be undone.
          </p>
        </div>
        
        <div 
          className="_modal_footer" 
          style={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: '12px' 
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              border: 'none',
              background: '#f0f0f0',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              border: 'none',
              background: '#ff4d4f',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Delete_Modal;