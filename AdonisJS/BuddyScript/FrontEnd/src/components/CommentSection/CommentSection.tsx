import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectPostById } from '../../store/slices/postSlice';
import PreviousComments from './PreviousComments';
import Comment from './Comment';
import CommentForm from './CommentForm';
import { RootState } from '../../store';

interface CommentSectionProps {
  postId: number;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const post = useSelector((state: RootState) => selectPostById(state, postId));
  const [showAllComments, setShowAllComments] = useState<boolean>(false);
  
  // Get comments from post data
  const comments = post?.comments || [];

  // Handle view toggle for comments
  const handleViewPreviousComments = () => {
    setShowAllComments(prevState => !prevState);
  };

  // Define which comments to show (either all or just the most recent 2)
  const visibleComments = showAllComments 
    ? comments 
    : (comments.length > 2 ? comments.slice(-2) : comments);

  return (
    <div className="_comments_container" style={{
      borderTop: '1px solid #E4E6EB',
      borderRadius: '0 0 8px 8px',
      backgroundColor: '#ffffff',
    }}>
      {/* Comment summary count and most relevant */}
      {comments.length > 0 && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '8px 16px 0',
          fontSize: '0.9rem',
          color: '#65676B'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer'
          }}>
            <span style={{ fontWeight: '600' }}>Most Relevant</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px' }}>
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>
      )}

      <div className="_timline_comment_main" style={{
        width: '100%',
        boxSizing: 'border-box',
      }}>
        {/* Show "Previous comments" button at the top when there are more than 2 comments */}
        {!showAllComments && comments.length > 2 && (
          <div style={{ padding: '8px 16px 0' }}>
            <PreviousComments 
              count={comments.length - 2} 
              onClick={handleViewPreviousComments} 
            />
          </div>
        )}
        
        {/* Display comments */}
        <div>
          {visibleComments.map((comment) => {
            // Determine username from different possible formats
            const username = comment.username || 
                            (comment.user ? comment.user.name : 'Anonymous');
                            
            // Determine likes count - it could be a number or an array of like objects
            const likesCount = Array.isArray(comment.likes) ? comment.likes.length : comment.likes;
            
            return (
              <Comment
                key={comment.id}
                postId={postId}
                commentId={comment.id}
                username={username}
                content={comment.text}
                reactionCount={likesCount}
                timeAgo={comment.timeAgo}
                replies={comment.replies || []}
              />
            );
          })}
        </div>
        
        {/* Show hide comments button if showing all */}
        {showAllComments && comments.length > 2 && (
          <div style={{ padding: '0 16px 8px' }}>
            <button 
              onClick={() => setShowAllComments(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '0.9rem',
                color: '#65676B',
                fontWeight: '600',
                cursor: 'pointer',
                padding: '8px 0',
              }}
            >
              Hide comments
            </button>
          </div>
        )}
        
        {/* Comment form */}
        <CommentForm postId={postId} />
      </div>
    </div>
  );
};

export default CommentSection;