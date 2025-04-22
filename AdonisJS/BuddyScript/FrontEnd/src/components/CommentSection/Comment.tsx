import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactionButtons from './ReactionButton';
import { addReply, selectPostById } from '../../store/slices/postSlice';
import { selectUser } from '../../store/slices/userSlice';
import { RootState } from '../../store';

interface Reply {
  id: number;
  text: string;
  username: string;
  userId: string;
  timestamp: number;
  timeAgo: string;
  likes: number;
  likedBy?: string[];
}

interface CommentProps {
  postId: number;
  commentId: number;
  username: string;
  content: string;
  reactionCount: number;
  timeAgo: string;
  replies?: Reply[];
}

const Comment: React.FC<CommentProps> = ({ 
  postId, 
  commentId, 
  username, 
  content, 
  reactionCount, 
  timeAgo, 
  replies = [] 
}) => {
  const [showReplyForm, setShowReplyForm] = useState<boolean>(false);
  const [replyText, setReplyText] = useState<string>('');
  const [localReplies, setLocalReplies] = useState<Reply[]>(replies || []);
  const [showAllReplies, setShowAllReplies] = useState<boolean>(false);
  const dispatch = useDispatch();
  const post = useSelector((state: RootState) => selectPostById(state, postId));
  const user = useSelector(selectUser);
  
  // Get the latest replies whenever posts change
  useEffect(() => {
    if (post && commentId) {
      const comment = post.comments.find(c => c.id === commentId);
      if (comment && comment.replies) {
        setLocalReplies(comment.replies);
      }
    }
  }, [post, commentId]);
  
  const handleReply = () => {
    setShowReplyForm(!showReplyForm);
    if (!showReplyForm) {
      // When opening reply form, automatically show all replies
      setShowAllReplies(true);
    }
  };

  const handleViewPreviousReplies = () => {
    setShowAllReplies(true);
  };

  const handleNameClick = (e: React.MouseEvent, userId?: string) => {
    e.preventDefault();
    console.log(`Navigating to profile of user: ${userId || 'anonymous'}`);
    alert(`This would navigate to ${username}'s profile`);
  };

  const submitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyText.trim()) {
      const timestamp = Date.now();
      const displayName = user?.displayName || user?.name || 'Anonymous User';
      
      const newReply: Reply = {
        id: timestamp,
        text: replyText,
        username: displayName,
        userId: user?.id || 'anonymous',
        timestamp,
        timeAgo: 'Just now',
        likes: 0
      };
      
      dispatch(addReply({ postId, commentId, reply: newReply }));
      setReplyText('');
      setShowReplyForm(false);
    }
  };

  // Show the most recent replies if not showing all
  const displayReplies = showAllReplies ? localReplies : (localReplies.length > 1 ? [localReplies[0], localReplies[localReplies.length-1]] : localReplies);

  return (
    <div className="_comment_main" style={{
      display: 'flex',
      padding: '4px 16px',
      width: '100%',
      boxSizing: 'border-box',
    }}>
      <div className="_comment_image">
        <a href="#" className="_comment_image_link" onClick={(e) => handleNameClick(e)}>
          <img 
            src="assets/images/txt_img.png" 
            alt="" 
            className="_comment_img1" 
            style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} 
          />
        </a>
      </div>
      <div className="_comment_area" style={{
        flex: 1,
        marginLeft: '8px',
      }}>
        <div className="_comment_details">
          <div className="_comment_status" style={{
            backgroundColor: '#F0F2F5',
            borderRadius: '18px',
            padding: '8px 12px',
            marginBottom: '2px',
            wordBreak: 'break-word',
            display: 'inline-block',
            maxWidth: '100%',
          }}>
            <div className="_comment_name" style={{ marginBottom: '1px' }}>
              <a 
                href="#" 
                onClick={(e) => handleNameClick(e)} 
                style={{ textDecoration: 'none' }}
              >
                <h4 
                  className="_comment_name_title" 
                  style={{ 
                    fontSize: '0.8125rem', 
                    margin: '0', 
                    fontWeight: 'bold', 
                    color: '#050505',
                    cursor: 'pointer',
                    lineHeight: '1.2',
                  }}
                >
                  {username || 'Anonymous User'}
                </h4>
              </a>
            </div>
            <p className="_comment_status_text" style={{ 
              margin: '0', 
              fontSize: '0.9375rem',
              lineHeight: '1.3333',
            }}>
              {content}
            </p>
          </div>
          
          <div className="_comment_actions" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            margin: '2px 0 0 12px',
            fontSize: '0.75rem'
          }}>
            <ReactionButtons postId={postId} commentId={commentId} currentLikes={reactionCount} />
            <span 
              onClick={handleReply} 
              style={{ 
                cursor: 'pointer', 
                marginLeft: '8px',
                fontWeight: '600',
                color: '#65676B'
              }}
            >
              Reply
            </span>
            <span style={{ marginLeft: '8px', color: '#65676B' }}>
              {timeAgo}
            </span>
          </div>
        </div>
        
        {/* Display replies */}
        {localReplies && localReplies.length > 0 && (
          <div className="_comment_replies" style={{
            marginLeft: '32px',
            marginTop: '2px',
          }}>
            {/* Show "View previous replies" button if needed */}
            {!showAllReplies && localReplies.length > 2 && (
              <button 
                type="button" 
                onClick={handleViewPreviousReplies}
                style={{
                  fontSize: '0.75rem',
                  color: '#65676B',
                  cursor: 'pointer',
                  fontWeight: '600',
                  background: 'none',
                  border: 'none',
                  padding: '4px 0',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
                {localReplies.length - 2} {localReplies.length - 2 === 1 ? 'reply' : 'replies'}
              </button>
            )}
            
            {/* Display replies */}
            {displayReplies.map(reply => (
              <div key={reply.id} className="_reply_item" style={{
                display: 'flex',
                marginBottom: '2px',
                width: '100%',
              }}>
                <div className="_reply_image">
                  <a href="#" onClick={(e) => handleNameClick(e, reply.userId)}>
                    <img 
                      src="assets/images/txt_img.png" 
                      alt="" 
                      style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} 
                    />
                  </a>
                </div>
                <div style={{ flex: 1, marginLeft: '8px' }}>
                  <div style={{
                    backgroundColor: '#F0F2F5',
                    borderRadius: '18px',
                    padding: '6px 12px',
                    marginBottom: '2px',
                    display: 'inline-block',
                    maxWidth: '100%',
                  }}>
                    <div style={{ marginBottom: '1px' }}>
                      <a 
                        href="#" 
                        onClick={(e) => handleNameClick(e, reply.userId)} 
                        style={{ textDecoration: 'none' }}
                      >
                        <h4 style={{ 
                          fontSize: '0.8125rem', 
                          margin: '0', 
                          fontWeight: 'bold', 
                          color: '#050505',
                          cursor: 'pointer',
                          lineHeight: '1.2',
                        }}>
                          {reply.username || 'Anonymous User'}
                        </h4>
                      </a>
                    </div>
                    <p style={{ 
                      margin: '0', 
                      fontSize: '0.9375rem',
                      lineHeight: '1.3333',
                    }}>
                      {reply.text}
                    </p>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    margin: '2px 0 0 12px',
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
                style={{
                  fontSize: '0.75rem',
                  color: '#65676B',
                  cursor: 'pointer',
                  fontWeight: '600',
                  background: 'none',
                  border: 'none',
                  padding: '4px 0',
                }}
              >
                Hide replies
              </button>
            )}
          </div>
        )}
        
        {/* Reply form */}
        {showReplyForm && (
          <div className="_feed_inner_comment_box" style={{ 
            marginTop: '4px',
            marginLeft: '32px' 
          }}>
            <form className="_feed_inner_comment_box_form" onSubmit={submitReply} style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#F0F2F5',
              borderRadius: '20px',
              padding: '4px 8px',
              width: '100%'
            }}>
              <div style={{ width: '24px', height: '24px', marginRight: '8px' }}>
                <img 
                  src="assets/images/comment_img.png" 
                  alt="" 
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
                />
              </div>
              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  className="form-control _comment_input"
                  placeholder="Write a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  style={{
                    width: '100%',
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    padding: '6px 0',
                    fontSize: '0.9375rem',
                    height: '22px',
                  }}
                />
              </div>
              <button 
                type="submit" 
                disabled={!replyText.trim()}
                style={{
                  background: 'none',
                  border: 'none',
                  color: replyText.trim() ? '#1877F2' : '#BCC0C4',
                  cursor: replyText.trim() ? 'pointer' : 'default',
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