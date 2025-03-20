import React, { useState } from 'react';
import { usePostContext } from '../../contexts/PostContext';
import PreviousComments from './PreviousComments';
import Comment from './Comment';
import CommentForm from './CommentForm';

const CommentSection = ({ postId }) => {
  const { posts } = usePostContext();
  const [showAllComments, setShowAllComments] = useState(false);
  const post = posts.find(p => p.id === postId);
  const comments = post ? post.comments : [];

  const handleViewPreviousComments = () => {
    setShowAllComments(prevState => !prevState);
  };

  // Define which comments to show
  const visibleComments = showAllComments ? comments : comments.slice(-4);

  return (
    <div className="_comments_container" style={{
      borderRadius: '0 0 8px 8px',
      backgroundColor: '#ffffff',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
    }}>
      <div className="_timline_comment_main" style={{
        padding: '0',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        {/* Display comments */}
        <div style={{ marginTop: '4px' }}>
          {visibleComments.map((comment) => (
            <Comment
              key={comment.id}
              postId={postId}
              commentId={comment.id}
              username={comment.username}
              content={comment.text}
              reactionCount={comment.likes}
              timeAgo={comment.timeAgo}
              replies={comment.replies || []}
            />
          ))}
        </div>
        
        {/* Show "Previous comments" button at the bottom when there are more than 4 comments */}
        {!showAllComments && comments.length > 4 && (
          <div style={{ padding: '0 16px 8px' }}>
            <PreviousComments 
              count={comments.length - 4} 
              onClick={handleViewPreviousComments} 
            />
          </div>
        )}
        
        {/* Show hide comments button if showing all */}
        {showAllComments && comments.length > 4 && (
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
        {/* <CommentForm postId={postId} /> */}
      </div>
    </div>
  );
};

export default CommentSection;