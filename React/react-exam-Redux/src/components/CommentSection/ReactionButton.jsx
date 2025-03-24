import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { likePost, likeComment } from '../../store/slices/postSlice';
import { selectUser } from '../../store/slices/userSlice';

const ReactionButtons = ({ postId, commentId, currentLikes }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [localLikes, setLocalLikes] = useState(currentLikes || 0);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    if (!user || !user.email) return;
    
    // Toggle like state
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    
    // Update local likes count based on the new state
    setLocalLikes(prev => newLikedState ? prev + 1 : Math.max(0, prev - 1));
    
    // Call appropriate Redux action
    if (commentId) {
      dispatch(likeComment({ postId, commentId, userEmail: user.email }));
    } else {
      dispatch(likePost({ id: postId, userEmail: user.email }));
    }
  };

  return (
    <div className="_total_react" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span 
        className={`_reaction_like ${isLiked ? '_active' : ''}`} 
        onClick={handleLike} 
        style={{ 
          cursor: 'pointer',
          color: isLiked ? '#1877F2' : 'inherit',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill={isLiked ? '#1877F2' : 'none'}
          stroke={isLiked ? '#1877F2' : 'currentColor'}
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