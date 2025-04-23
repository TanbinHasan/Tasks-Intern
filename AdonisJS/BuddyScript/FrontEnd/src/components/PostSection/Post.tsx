import React from 'react';
import PostMedia from './PostMedia';
import { Post as PostType } from '../../store/slices/postSlice';

interface PostProps {
  post: PostType;
}

const Post: React.FC<PostProps> = ({ post }) => {
    
  return (
    <div className="post-container">
      <div className="post-header">
        <div className="user-info">
          <img src="assets/images/user-avatar.png" alt={post.user?.name} className="avatar" />
          <div>
            <h4>{post.user?.name}</h4>
            <span className="timestamp">{post.timeAgo}</span>
          </div>
        </div>
        
        {/* Post actions (edit, delete) here */}
      </div>
      
      {/* Post content */}
      <div className="post-content">
        <p>{post.text}</p>
        
        {/* Handle multiple media items */}
        {post.mediaItems && post.mediaItems.length > 0 && (
          post.mediaItems.map((item, index) => (
            <PostMedia key={index} mediaType={item.type} mediaUrl={item.url} />
          ))
        )}
      </div>
      
      {/* Post interaction buttons (like, comment) and comments section here */}
    </div>
  );
};

export default Post;