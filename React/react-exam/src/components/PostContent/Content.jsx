import React from 'react';
import PostMedia from '../PostSection/PostMedia';

const Content = ({ post }) => {
  return (
    <>
      <h4 className="_feed_inner_timeline_post_title">
        {post.text}
      </h4>
      {/* Use PostMedia component for consistent media handling */}
      {post.mediaUrl && (
        <PostMedia mediaType={post.mediaType} mediaUrl={post.mediaUrl} />
      )}
    </>
  );
};

export default Content;