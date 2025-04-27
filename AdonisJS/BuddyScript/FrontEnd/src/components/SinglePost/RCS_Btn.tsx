import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { likePost, unlikePost, Post } from '../../store/slices/postSlice';
import { selectUser, setReaction, selectHasReacted } from '../../store/slices/userSlice';
import CommentForm from '../CommentSection/CommentForm';
import { AppDispatch, RootState } from '../../store';

interface RCS_BtnProps {
  post: Post;
}

const RCS_Btn: React.FC<RCS_BtnProps> = ({ post }) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [shared, setShared] = useState<boolean>(false);
  
  // Add state for local like count to ensure it's displayed correctly
  const [localLikeCount, setLocalLikeCount] = useState<number>(post.likes.length || 0);
  // Add processing state to prevent multiple simultaneous requests
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  // Get like status from Redux
  const hasReacted = useSelector((state: RootState) => 
    selectHasReacted(state, 'post', post.id)
  );
  
  // Update local like count when post changes
  useEffect(() => {
    setLocalLikeCount(post.likes.length || 0);
  }, [post.likes]);
  
  // When component mounts, check if post has isLikedByCurrentUser flag and sync to Redux
  useEffect(() => {
    if (user && user.id && post.isLikedByCurrentUser !== undefined) {
      dispatch(setReaction({
        type: 'post',
        id: post.id,
        hasReacted: post.isLikedByCurrentUser
      }));
    }
  }, [user, post.id, post.isLikedByCurrentUser, dispatch]);

  const handleLikeClick = async () => {
    if (!user || isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      if (hasReacted) {
        // Optimistic update UI immediately
        setLocalLikeCount(prev => Math.max(0, prev - 1));
        await dispatch(unlikePost(post.id)).unwrap();
      } else {
        // Optimistic update UI immediately
        setLocalLikeCount(prev => prev + 1);
        await dispatch(likePost(post.id)).unwrap();
      }
    } catch (error) {
      console.error('Error handling like:', error);
      // Revert optimistic update on error
      setLocalLikeCount(post.likes.length || 0);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCommentClick = () => {
    setShowComments(!showComments);
  };

  const handleShareClick = () => {
    setShared(true);
    alert('Post shared!');
  };

  // Debug info - remove in production
  // console.log(`Post ${post.id}: likes=${localLikeCount}, isLiked=${hasReacted}, userId=${user?.id}`);
  // console.log(post.likes);

  return (
    <>
      {/* Like count display */}
      {localLikeCount > 0 && (
        <div className="_feed_inner_timeline_like_count" style={{
          padding: '6px 12px',
          fontSize: '13px',
          color: '#65676b',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <div style={{
            background: '#1877f2',
            borderRadius: '50%',
            width: '18px',
            height: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width={10} height={10} viewBox="0 0 24 24" fill="#ffffff">
              <path d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-6.5" />
            </svg>
          </div>
          <span>{localLikeCount}</span>
        </div>
      )}

      <div className="_feed_inner_timeline_reaction" style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '4px 0',
        borderTop: '1px solid #e4e6eb',
        borderBottom: '1px solid #e4e6eb',
        margin: '0'
      }}>
        {/* Like Button */}
        <button
          className={`_feed_reaction ${hasReacted ? '_feed_reaction_active' : ''}`}
          onClick={handleLikeClick}
          style={{
            background: 'transparent',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: hasReacted ? '600' : 'normal',
            color: hasReacted ? '#1877f2' : '#65676b',
            transition: 'all 0.2s ease',
            flex: '1',
            fontSize: '14px'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f2f5'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={18}
              height={18}
              fill={hasReacted ? '#1877f2' : 'none'}
              viewBox="0 0 24 24"
              stroke={hasReacted ? '#1877f2' : '#65676b'}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-6.5"
              />
            </svg>
            <span>Like</span>
          </span>
        </button>

        {/* Comment Button */}
        <button
          className="_feed_reaction"
          onClick={handleCommentClick}
          style={{
            background: 'transparent',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: showComments ? '#1877f2' : '#65676b',
            fontWeight: showComments ? '600' : 'normal',
            transition: 'all 0.2s ease',
            flex: '1',
            fontSize: '14px'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f2f5'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={18}
              height={18}
              fill="none"
              viewBox="0 0 24 24"
              stroke={showComments ? '#1877f2' : '#65676b'}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
            <span>Comment</span>
          </span>
        </button>

        {/* Share Button */}
        <button
          className="_feed_reaction"
          onClick={handleShareClick}
          style={{
            background: 'transparent',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: shared ? '#1877f2' : '#65676b',
            fontWeight: shared ? '600' : 'normal',
            transition: 'all 0.2s ease',
            flex: '1',
            fontSize: '14px'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f2f5'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={18}
              height={18}
              fill="none"
              viewBox="0 0 24 24"
              stroke={shared ? '#1877f2' : '#65676b'}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            <span>{shared ? "Shared" : "Share"}</span>
          </span>
        </button>
      </div>

      {/* Comment Section - Toggle visibility based on showComments state */}
      {showComments && <CommentForm postId={post.id} />}
    </>
  );
};

export default RCS_Btn;