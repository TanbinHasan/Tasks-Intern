import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { Post } from '../../store/slices/postSlice';

interface PostHeaderProps {
  post: Post;
}

const PostHeader: React.FC<PostHeaderProps> = ({ post }) => {
  // Determine user name with fallbacks
  const userName = post.user?.name || (post.user?.email ? post.user.email.split('@')[0] : "Unknown User");
  
  // console.log('Post header user data:', post.user);
  
  return (
    <>
      <div className="_feed_inner_timeline_post_box">
        <div className="_feed_inner_timeline_post_box_image">
          <img
            src="assets/images/post_img.png"
            alt=""
            className="_post_img"
          />
        </div>
        <div className="_feed_inner_timeline_post_box_txt">
          <h4 className="_feed_inner_timeline_post_box_title">
            {userName}
          </h4>
          <p className="_feed_inner_timeline_post_box_para">
            {post.timeAgo} <a href="#0"><FontAwesomeIcon icon={faGlobe} /> Public</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default PostHeader;