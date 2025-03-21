import React, { useState, useEffect } from 'react';
import { usePostContext } from '../../contexts/PostContext';
import { useUser } from '../../contexts/UserContext';
import CommentForm from '../CommentSection/CommentForm';

const RCS_Btn = ({ post }) => {
  const { likePost } = usePostContext();
  const { user, hasReacted, setReaction } = useUser();
  const [showComments, setShowComments] = useState(false);
  const [shared, setShared] = useState(false);
  
  // Check if post is liked directly from the post's likedBy array
  // This ensures the UI is in sync with the actual post data
  const isLiked = user && post.likedBy ? post.likedBy.includes(user.email) : false;

  // Keep UserContext in sync with post data on component mount
  useEffect(() => {
    if (user && post.likedBy) {
      const userHasLiked = post.likedBy.includes(user.email);
      // Sync the UserContext reaction state with post data
      // Only update if there's a difference to prevent infinite loops
      if (hasReacted && hasReacted('post', post.id) !== userHasLiked) {
        setReaction('post', post.id, userHasLiked);
      }
    }
    // Remove setReaction from the dependency array to prevent infinite updates
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, post.id, post.likedBy]);

  const handleLikeClick = () => {
    if (!user) return; // Prevent action if not logged in
    
    // Toggle the like status in PostContext
    const newLikeStatus = likePost(post.id, user.email);
    
    // Update the user's reaction status in UserContext
    setReaction('post', post.id, newLikeStatus);
  };

  const handleCommentClick = () => {
    setShowComments(!showComments);
  };

  const handleShareClick = () => {
    setShared(true);
    alert('Post shared!');
  };

  return (
    <>
      {/* Like count display */}
      {post.likes > 0 && (
        <div className="_feed_inner_timeline_like_count" style={{
          padding: '8px 12px',
          fontSize: '14px',
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
          <span>{post.likes}</span>
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
          className={`_feed_reaction ${isLiked ? '_feed_reaction_active' : ''}`}
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
            fontWeight: isLiked ? '600' : 'normal',
            color: isLiked ? '#1877f2' : '#65676b',
            transition: 'background-color 0.2s',
            flex: '1'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f2f5'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={18}
              height={18}
              fill={isLiked ? '#1877f2' : 'none'}
              viewBox="0 0 24 24"
              stroke={isLiked ? '#1877f2' : '#65676b'}
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
            transition: 'background-color 0.2s',
            flex: '1'
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
            transition: 'background-color 0.2s',
            flex: '1'
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