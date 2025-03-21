import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';

const PostHeader = ({ post }) => {
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
            {post.name}
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