import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { likeComment, unlikeComment } from '../../store/slices/postSlice';
import { selectUser, setReaction } from '../../store/slices/userSlice';
import { AppDispatch } from '../../store';

interface ReactionButtonsProps {
  postId: number;
  commentId?: number;
  currentLikes: number;
  initialLikedState?: boolean;
}

const ReactionButtons: React.FC<ReactionButtonsProps> = ({ 
  postId, 
  commentId, 
  currentLikes,
  initialLikedState = false
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  
  // Keep all state local to the component for reliable UI updates
  const [localLikes, setLocalLikes] = useState<number>(currentLikes || 0);
  const [isLiked, setIsLiked] = useState<boolean>(initialLikedState);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  // Update local state when props change
  useEffect(() => {
    setIsLiked(initialLikedState);
  }, [initialLikedState]);
  
  useEffect(() => {
    setLocalLikes(currentLikes || 0);
  }, [currentLikes]);

  const handleLike = async () => {
    if (!user || !commentId || isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      // Toggle local state
      const newLikedState = !isLiked;
      setIsLiked(newLikedState);
      
      // Update like count
      setLocalLikes(prev => newLikedState ? prev + 1 : Math.max(0, prev - 1));
      
      // Dispatch appropriate action
      if (newLikedState) {
        await dispatch(likeComment({ postId, commentId }));
      } else {
        await dispatch(unlikeComment({ postId, commentId }));
      }
      
      // Update Redux state
      dispatch(setReaction({
        type: 'comment',
        id: commentId,
        hasReacted: newLikedState
      }));
      
    } catch (error) {
      console.error('Error handling like:', error);
      
      // Revert UI on error
      setIsLiked(!isLiked);
      setLocalLikes(currentLikes);
    } finally {
      setIsProcessing(false);
    }
  };


  return (
    <div className="_total_react" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span 
        className={`_reaction_like ${isLiked ? '_active' : ''}`} 
        onClick={handleLike} 
        style={{ 
          cursor: isProcessing ? 'default' : 'pointer',
          color: isLiked ? '#1877F2' : 'inherit',
          display: 'flex',
          alignItems: 'center',
          opacity: isProcessing ? 0.7 : 1
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