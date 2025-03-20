import React, { useState } from 'react';
import { usePostContext } from '../../contexts/PostContext';

const ReactionButtons = ({ postId, commentId, currentLikes }) => {
  const { likePost, likeComment } = usePostContext();
  const [localLikes, setLocalLikes] = useState(currentLikes || 0);
  const [activeReaction, setActiveReaction] = useState(null);

  const handleReaction = (type) => {
    setLocalLikes(prev => !prev);
    setActiveReaction(type);
    
    if (commentId) {
      likeComment(postId, commentId);
    } else {
      likePost(postId);
    }
  };

  return (
    <div className="_total_react" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span 
        className={`_reaction_like ${activeReaction === 'like' ? '_active' : ''}`} 
        onClick={() => handleReaction('like')} 
        style={{ 
          cursor: 'pointer',
          color: activeReaction === 'like' ? '#1877F2' : 'inherit',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill={activeReaction === 'like' ? '#1877F2' : 'none'}
          stroke={activeReaction === 'like' ? '#1877F2' : 'currentColor'}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-thumbs-up"
          style={{ marginRight: '4px' }}
        >
          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
        </svg>
        Like
      </span>
      <span 
        className={`_reaction_heart ${activeReaction === 'heart' ? '_active' : ''}`} 
        onClick={() => handleReaction('heart')} 
        style={{ 
          cursor: 'pointer',
          color: activeReaction === 'heart' ? '#E41E3F' : 'inherit',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill={activeReaction === 'heart' ? '#E41E3F' : 'none'}
          stroke={activeReaction === 'heart' ? '#E41E3F' : 'currentColor'}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-heart"
          style={{ marginRight: '4px' }}
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        Love
      </span>
      {localLikes > 0 && (
        <span className="_total" style={{ 
          fontSize: '13px', 
          color: '#65676B', 
          backgroundColor: '#F0F2F5', 
          borderRadius: '10px', 
          padding: '2px 8px',
          marginLeft: '4px'
        }}>
          {localLikes}
        </span>
      )}
    </div>
  );
};

export default ReactionButtons;