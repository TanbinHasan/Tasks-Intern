import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectPostById, fetchPostComments } from '../../store/slices/postSlice';
import PreviousComments from './PreviousComments';
import Comment from './Comment';
import CommentForm from './CommentForm';
import { RootState } from '../../store';
import { AppDispatch } from '../../store';

interface CommentSectionProps {
  postId: number;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const post = useSelector((state: RootState) => selectPostById(state, postId));
  const commentsLoading = useSelector((state: RootState) => state.post.commentsLoading[postId] || false);
  
  // Get comments from post data
  const comments = post?.comments || [];
  const totalCommentCount = post?.commentCount || 0;
  
  const COMMENTS_PER_PAGE = 5; // Number of comments to load each time
  const [loadedCommentsCount, setLoadedCommentsCount] = useState<number>(comments.length);
  
  // Update loadedCommentsCount when comments change
  useEffect(() => {
    setLoadedCommentsCount(comments.length);
  }, [comments.length]);
  
  // Handle loading more comments
  const handleLoadMoreComments = () => {
    if (!commentsLoading) {
      dispatch(fetchPostComments({ 
        postId, 
        offset: loadedCommentsCount, 
        limit: COMMENTS_PER_PAGE 
      }));
    }
  };

  // Calculate how many more comments are available - base this on the total count, not the hasMore flag
  const remainingComments = Math.max(0, totalCommentCount - loadedCommentsCount);
  
  // Show "Load more comments" button if there are more comments to load based on count
  const showLoadMoreButton = remainingComments > 0;
  
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
        {/* Show "Load more comments" button when there are more comments to load based on count */}
        {showLoadMoreButton && (
          <div style={{ padding: '8px 16px 0' }}>
            <PreviousComments 
              count={remainingComments} 
              onClick={handleLoadMoreComments}
              isLoading={commentsLoading}
            />
          </div>
        )}
        
        {/* Display loading indicator */}
        {commentsLoading && !showLoadMoreButton && (
          <div style={{ 
            padding: '12px 0', 
            textAlign: 'center', 
            color: '#65676B',
            fontSize: '0.9rem' 
          }}>
            <div style={{
              display: 'inline-block',
              width: '16px',
              height: '16px',
              border: '3px solid #BCC0C4',
              borderTopColor: '#1877F2',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginRight: '8px',
              verticalAlign: 'middle'
            }}></div>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
            Loading comments...
          </div>
        )}
        
        {/* Display comments */}
        <div>
          {comments.map((comment) => {
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
        
        {/* Comment form */}
        <CommentForm postId={postId} />
      </div>
    </div>
  );
};

export default CommentSection;