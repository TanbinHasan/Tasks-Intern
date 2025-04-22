import React from 'react';

interface PreviousCommentsProps {
  count: number;
  onClick: () => void;
}

const PreviousComments: React.FC<PreviousCommentsProps> = ({ count, onClick }) => {
  return (
    <div className="_previous_comment" style={{
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center'
    }}>
      <div style={{
        width: '32px',
        height: '1px',
        backgroundColor: '#CED0D4'
      }}></div>
      <button 
        type="button" 
        className="_previous_comment_txt"
        onClick={onClick}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '0.8125rem',
          color: '#65676B',
          fontWeight: '600',
          cursor: 'pointer',
          padding: '4px 8px',
          borderRadius: '6px',
          marginLeft: '8px'
        }}
      >
        View {count} more {count === 1 ? 'comment' : 'comments'}
      </button>
    </div>
  );
};

export default PreviousComments;