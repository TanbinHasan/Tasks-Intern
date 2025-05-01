import React from 'react';

interface PreviousCommentsProps {
  count: number;
  onClick: () => void;
  isLoading?: boolean;
}

const PreviousComments: React.FC<PreviousCommentsProps> = ({ count, onClick, isLoading = false }) => {
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
        disabled={isLoading}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '0.8125rem',
          color: '#65676B',
          fontWeight: '600',
          cursor: isLoading ? 'default' : 'pointer',
          padding: '4px 8px',
          borderRadius: '6px',
          marginLeft: '8px',
          opacity: isLoading ? 0.7 : 1,
          position: 'relative',
          transition: 'background-color 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
        onMouseOver={(e) => {
          if (!isLoading) {
            e.currentTarget.style.backgroundColor = '#F0F2F5';
          }
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        {isLoading && (
          <div style={{
            display: 'inline-block',
            width: '12px',
            height: '12px',
            border: '2px solid #BCC0C4',
            borderTopColor: '#1877F2',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
        )}
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        {isLoading ? 'Loading...' : `View ${count} more ${count === 1 ? 'comment' : 'comments'}`}
      </button>
    </div>
  );
};

export default PreviousComments;