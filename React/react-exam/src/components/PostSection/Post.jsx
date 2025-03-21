import React from 'react';
import PostMedia from './PostMedia';
import { usePostContext } from '../../contexts/PostContext';
import { useUser } from '../../contexts/UserContext';

const Post = ({ post }) => {
  const { user } = useUser();
  const { likePost, deletePost } = usePostContext();
  
  // Post component logic and state here
  
  return (
    <div className="post-container">
      <div className="post-header">
        <div className="user-info">
          <img src="assets/images/user-avatar.png" alt={post.name} className="avatar" />
          <div>
            <h4>{post.name}</h4>
            <span className="timestamp">{post.timeAgo}</span>
          </div>
        </div>
        
        {/* Post actions (edit, delete) here */}
      </div>
      
      {/* Post content */}
      <div className="post-content">
        <p>{post.text}</p>
        
        {/* Check if media exists and pass correct props to PostMedia */}
        {post.mediaUrl && (
          <PostMedia mediaType={post.mediaType} mediaUrl={post.mediaUrl} />
        )}
      </div>
      
      {/* Post interaction buttons (like, comment) and comments section here */}
    </div>
  );
};

export default Post;