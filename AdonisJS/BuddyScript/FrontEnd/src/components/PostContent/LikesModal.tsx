import React from 'react';
import { Like } from '../../store/slices/postSlice';

interface LikesModalProps {
  isOpen: boolean;
  onClose: () => void;
  likes: Like[];
}

const LikesModal: React.FC<LikesModalProps> = ({ isOpen, onClose, likes }) => {
  if (!isOpen) return null;

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  };

  const contentStyle: React.CSSProperties = {
    backgroundColor: 'white',
    width: '90%',
    maxWidth: '400px',
    padding: '16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    borderRadius: '8px',
    maxHeight: '80vh',
    overflow: 'auto'
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '16px',
    borderBottom: '1px solid #eee',
    marginBottom: '16px'
  };

  const titleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1c1e21'
  };

  const closeButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '24px',
    color: '#65676b'
  };

  const userItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid #f0f2f5'
  };

  const avatarStyle: React.CSSProperties = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    marginRight: '12px',
    backgroundColor: '#e4e6eb',
    objectFit: 'cover'
  };

  const userNameStyle: React.CSSProperties = {
    fontWeight: 500,
    fontSize: '15px',
    color: '#050505'
  };

  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '20px 0',
    color: '#65676b'
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <h3 style={titleStyle}>
            {likes.length === 1 ? '1 person liked this' : `${likes.length} people liked this`}
          </h3>
          <button style={closeButtonStyle} onClick={onClose}>×</button>
        </div>
        
        <div>
          {likes.length === 0 ? (
            <p style={emptyStateStyle}>No likes yet</p>
          ) : (
            likes.map((like) => (
              <div key={like.id} style={userItemStyle}>
                <img 
                  src="assets/images/profile.png" 
                  alt="User avatar" 
                  style={avatarStyle} 
                />
                <span style={userNameStyle}>
                  {like.user?.name || `User #${like.userId}`}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LikesModal;