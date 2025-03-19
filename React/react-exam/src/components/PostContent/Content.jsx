import React from 'react';

const Content = ({ post }) => {
  return (
    <>
      <h4 className="_feed_inner_timeline_post_title">
        {post.text}
      </h4>
      {post.mediaType === 'image' && post.mediaFile && (
        <div className="_feed_inner_timeline_image">
          <img
            src={post.mediaFile} // Assuming mediaFile contains the image URL
            alt="Post media"
            className="_time_img"
          />
        </div>
      )}
    </>
  );
};

export default Content;