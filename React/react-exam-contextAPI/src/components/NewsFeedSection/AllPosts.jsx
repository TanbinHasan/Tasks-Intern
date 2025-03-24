import React from 'react';
import SinglePost from '../SinglePost/SinglePost';
import { usePostContext } from '../../contexts/PostContext';

const AllPosts = () => {
  const { posts } = usePostContext();

  return (
    <>
      {posts.map(post => {
        return (
          <div 
            key={post.id} 
            className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16"
          >
            <SinglePost postId={post.id} />
          </div>
        );
      })}
    </>
  );
};

export default AllPosts;