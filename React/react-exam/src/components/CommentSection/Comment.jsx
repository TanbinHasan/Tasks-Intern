import React, { useState, useEffect } from 'react';
import ReactionButtons from './ReactionButton';
import { usePostContext } from '../../contexts/PostContext';
import { useUser } from '../../contexts/UserContext';

const Comment = ({ postId, commentId, username, content, reactionCount, timeAgo, replies = [] }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [localReplies, setLocalReplies] = useState(replies || []);
  const [showAllReplies, setShowAllReplies] = useState(false);
  const { addReply, posts } = usePostContext();
  const { user } = useUser();
  
  // Get the latest replies whenever posts change
  useEffect(() => {
    if (postId && commentId) {
      const post = posts.find(p => p.id === postId);
      if (post) {
        const comment = post.comments.find(c => c.id === commentId);
        if (comment && comment.replies) {
          setLocalReplies(comment.replies);
        }
      }
    }
  }, [posts, postId, commentId]);
  
  const handleReply = () => {
    setShowReplyForm(!showReplyForm);
  };

  const handleViewPreviousReplies = () => {
    setShowAllReplies(prevState => !prevState);
  };

  const submitReply = (e) => {
    e.preventDefault();
    if (replyText.trim()) {
      const timestamp = Date.now();
      const newReply = {
        id: timestamp,
        text: replyText,
        username: user ? user.email : 'Anonymous',
        timestamp,
        timeAgo: 'Just now',
        likes: 0
      };
      
      // Update local state immediately
      setLocalReplies(prev => [...prev, newReply]);
      
      // Show all replies when a new reply is added
      setShowAllReplies(true);
      
      // Then update in context
      addReply(postId, commentId, newReply);
      setReplyText('');
      setShowReplyForm(false);
    }
  };

  // Determine which replies to show based on showAllReplies state
  const displayReplies = showAllReplies ? localReplies : localReplies.slice(-2); // Show only 2 recent replies by default

  // Reduced spacing in the commentStyle
  const commentStyle = {
    display: 'flex',
    padding: '4px 16px', // Reduced from 8px to 4px
    marginBottom: '2px', // Reduced from 8px to 2px
    width: '100%',
    boxSizing: 'border-box',
  };

  const commentAreaStyle = {
    flex: 1,
    marginLeft: '10px',
  };

  const commentContentStyle = {
    backgroundColor: '#F0F2F5',
    borderRadius: '18px',
    padding: '8px 12px',
    marginBottom: '2px', // Reduced from 4px to 2px
    wordBreak: 'break-word',
  };

  const replyToggleStyle = {
    fontSize: '0.85rem',
    color: '#65676B',
    cursor: 'pointer',
    fontWeight: '600',
    marginLeft: '8px',
    background: 'none',
    border: 'none',
    padding: '3px 6px', // Reduced padding
    borderRadius: '4px',
  };

  const replyContainerStyle = {
    marginLeft: '40px',
    marginTop: '2px', // Reduced from 4px to 2px
  };

  return (
    <div className="_comment_main" style={commentStyle}>
      <div className="_comment_image">
        <a href="profile.html" className="_comment_image_link">
          <img 
            src="assets/images/txt_img.png" 
            alt="" 
            className="_comment_img1" 
            style={{ width: '36px', height: '36px', borderRadius: '50%' }} 
          />
        </a>
      </div>
      <div className="_comment_area" style={commentAreaStyle}>
        <div className="_comment_details">
          <div className="_comment_status" style={commentContentStyle}>
            <div className="_comment_name" style={{ marginBottom: '2px' }}>
              <a href="profile.html" style={{ textDecoration: 'none' }}>
                <h4 className="_comment_name_title" style={{ 
                  fontSize: '0.9rem', 
                  margin: '0', 
                  fontWeight: 'bold', 
                  color: '#050505' 
                }}>
                  {username || 'Anonymous'}
                </h4>
              </a>
            </div>
            <p className="_comment_status_text" style={{ margin: '0', fontSize: '0.9rem' }}>
              {content}
            </p>
          </div>
          
          <div className="_comment_actions" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            margin: '0 0 0 12px',
            fontSize: '0.8rem'
          }}>
            <ReactionButtons postId={postId} commentId={commentId} currentLikes={reactionCount} />
            <span 
              onClick={handleReply} 
              style={{ 
                cursor: 'pointer', 
                marginLeft: '16px',
                fontWeight: '600',
                color: '#65676B'
              }}
            >
              Reply
            </span>
            <span style={{ marginLeft: '16px', color: '#65676B' }}>
              {timeAgo}
            </span>
          </div>
        </div>
        
        {/* Display replies with reduced spacing */}
        {localReplies && localReplies.length > 0 && (
          <div className="_comment_replies" style={replyContainerStyle}>
            {/* Show "View previous replies" button if needed */}
            {!showAllReplies && localReplies.length > 2 && (
              <button 
                type="button" 
                onClick={handleViewPreviousReplies}
                style={replyToggleStyle}
              >
                View {localReplies.length - 2} more {localReplies.length - 2 === 1 ? 'reply' : 'replies'}
              </button>
            )}
            
            {/* Toggle between showing all replies or just the latest ones */}
            {displayReplies.map(reply => (
              <div key={reply.id} className="_reply_item" style={{
                display: 'flex',
                marginBottom: '4px', // Reduced spacing between replies
                width: '100%',
              }}>
                <div className="_reply_image">
                  <a href="profile.html">
                    <img 
                      src="assets/images/txt_img.png" 
                      alt="" 
                      style={{ width: '28px', height: '28px', borderRadius: '50%' }} 
                    />
                  </a>
                </div>
                <div style={{ flex: 1, marginLeft: '8px' }}>
                  <div style={{
                    backgroundColor: '#F0F2F5',
                    borderRadius: '18px',
                    padding: '6px 12px',
                    marginBottom: '2px',
                  }}>
                    <div style={{ marginBottom: '2px' }}>
                      <a href="profile.html" style={{ textDecoration: 'none' }}>
                        <h4 style={{ 
                          fontSize: '0.85rem', 
                          margin: '0', 
                          fontWeight: 'bold', 
                          color: '#050505' 
                        }}>
                          {reply.username || 'Anonymous'}
                        </h4>
                      </a>
                    </div>
                    <p style={{ margin: '0', fontSize: '0.85rem' }}>
                      {reply.text}
                    </p>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    margin: '0 0 0 12px',
                    fontSize: '0.75rem'
                  }}>
                    <span style={{ fontWeight: '600', color: '#65676B', cursor: 'pointer' }}>Like</span>
                    <span style={{ marginLeft: '8px', color: '#65676B' }}>{reply.timeAgo}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {/* If showing all replies and there are more than 2, add a collapse button */}
            {showAllReplies && localReplies.length > 2 && (
              <button 
                type="button" 
                onClick={() => setShowAllReplies(false)}
                style={replyToggleStyle}
              >
                Hide replies
              </button>
            )}
          </div>
        )}
        
        {/* Reply form */}
        {showReplyForm && (
          <div className="_feed_inner_comment_box" style={{ 
            marginTop: '4px', // Reduced from 8px to 4px
            marginLeft: '40px' 
          }}>
            <form className="_feed_inner_comment_box_form" onSubmit={submitReply} style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#F0F2F5',
              borderRadius: '20px',
              padding: '4px 8px',
              width: '100%'
            }}>
              <div style={{ width: '30px', height: '30px', marginRight: '8px' }}>
                <img 
                  src="assets/images/comment_img.png" 
                  alt="" 
                  style={{ width: '100%', height: '100%', borderRadius: '50%' }} 
                />
              </div>
              <div style={{ flex: 1 }}>
                <textarea
                  className="form-control _comment_textarea"
                  placeholder="Write a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  style={{
                    width: '100%',
                    border: 'none',
                    background: 'transparent',
                    resize: 'none',
                    outline: 'none',
                    padding: '6px 0', // Reduced padding
                    fontSize: '0.9rem'
                  }}
                />
              </div>
              <button 
                type="submit" 
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#1877F2',
                  cursor: 'pointer'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;