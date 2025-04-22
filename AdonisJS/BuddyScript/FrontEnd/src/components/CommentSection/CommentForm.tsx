import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addComment } from '../../store/slices/postSlice';
import { selectUser } from '../../store/slices/userSlice';

interface CommentFormProps {
  postId: number;
}

const CommentForm: React.FC<CommentFormProps> = ({ postId }) => {
  const [commentText, setCommentText] = useState<string>('');
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      const timestamp = Date.now();
      // Use displayName if available, or use a fallback name instead of email
      const displayName = user?.displayName || user?.name || 'Anonymous User';
      
      const newComment = {
        id: timestamp,
        text: commentText,
        username: displayName,
        userId: user?.id || 'anonymous', // Store user ID for profile linking
        timestamp,
        timeAgo: 'Just now',
        likes: 0,
        replies: []
      };
      
      dispatch(addComment({ postId, comment: newComment }));
      setCommentText('');
    }
  };

  return (
    <div className="_feed_inner_comment_box" style={{
      borderTop: '1px solid #E4E6EB'
    }}>
      <form 
        className="_feed_inner_comment_box_form" 
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#F0F2F5',
          borderRadius: '20px',
          padding: '4px 8px',
          width: '100%'
        }}
      >
        <div style={{ 
          width: '32px',
          height: '32px',
          marginRight: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center' 
        }}>
          <img
            src="assets/images/comment_img.png"
            alt=""
            style={{ width: '100%', height: '100%', borderRadius: '50%' }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <textarea
            className="form-control _comment_textarea"
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            style={{
              width: '100%',
              border: 'none',
              background: 'transparent',
              resize: 'none',
              outline: 'none',
              minHeight: '32px',
              padding: '6px 0',
              fontSize: '0.95rem'
            }}
          />
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '4px'
        }}>
          <button 
            type="button" 
            className="_feed_inner_comment_box_icon_btn"
            style={{
              background: 'none',
              border: 'none',
              color: '#606770',
              cursor: 'pointer',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} fill="none" viewBox="0 0 24 24">
              <path fill="#65676B" d="M19 13.586V10c0-3.217-2.185-5.927-5.145-6.742A1.99 1.99 0 0012 2a1.99 1.99 0 00-1.855 1.258C7.185 4.074 5 6.783 5 10v3.586l-1.707 1.707A1 1 0 003 16v2a1 1 0 001 1h16a1 1 0 001-1v-2a1 1 0 00-.293-.707L19 13.586zM12 24c1.122 0 2.122-.447 2.828-1.172.507-.507.824-1.116.975-1.772.029-.118.046-.24.054-.363.01-.128.143-.693-.357-.693H8.5c-.5 0-.367.565-.357.693.008.123.025.245.054.363.151.656.468 1.265.975 1.772C9.878 23.553 10.878 24 12 24z"/>
            </svg>
          </button>
          <button 
            type="button" 
            className="_feed_inner_comment_box_icon_btn"
            style={{
              background: 'none',
              border: 'none',
              color: '#606770',
              cursor: 'pointer',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#65676B" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
          </button>
          <button 
            type="submit" 
            className="_feed_inner_comment_box_icon_btn"
            style={{
              background: 'none',
              border: 'none',
              color: commentText.trim() ? '#1877F2' : '#BCC0C4',
              cursor: commentText.trim() ? 'pointer' : 'default',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%'
            }}
            disabled={!commentText.trim()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;