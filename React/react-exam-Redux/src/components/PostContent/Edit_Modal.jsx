import React from 'react';

const Edit_Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start', // Changed from 'center' to 'flex-start'
    zIndex: 1000,
    overflow: 'auto', // Allow scrolling when content exceeds viewport
    padding: '30px 0' // Add padding for better UX
  };

  const contentStyle = {
    backgroundColor: 'white',
    width: '90%',
    maxWidth: '500px',
    padding: '16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    borderRadius: '6px',
    maxHeight: '80vh', // Limit height to 80% of viewport
    overflow: 'auto', // Enable scrolling within the modal when needed
    margin: 'auto' // Center in the viewport
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '16px',
    borderBottom: '1px solid #eee',
    marginBottom: '16px',
    position: 'sticky', // Keep the header visible
    top: 0,
    backgroundColor: 'white',
    zIndex: 2
  };

  const titleStyle = {
    margin: 0,
    fontSize: '18px',
    fontWeight: 600
  };

  const closeButtonStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px',
    borderRadius: '50%'
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <h3 style={titleStyle}>Edit post</h3>
          <button 
            style={closeButtonStyle} 
            onClick={onClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24">
              <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
            </svg>
          </button>
        </div>
        <div className="modal-body" style={{ overflow: 'visible' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Edit_Modal;