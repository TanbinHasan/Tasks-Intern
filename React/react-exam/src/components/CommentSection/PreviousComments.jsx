import React from 'react';

const PreviousComments = ({ count, onClick }) => {
  return (
    <div className="_previous_comment" style={{
      marginTop: '4px',
      marginBottom: '4px'
    }}>
      <button 
        type="button" 
        className="_previous_comment_txt"
        onClick={onClick}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '0.9rem',
          color: '#65676B',
          fontWeight: '600',
          cursor: 'pointer',
          padding: '4px 0',
          display: 'block',
          width: '100%',
          textAlign: 'left'
        }}
      >
        Previous {count} comments
      </button>
    </div>
  );
};

export default PreviousComments;