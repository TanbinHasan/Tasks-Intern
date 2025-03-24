import React from 'react';
import SinglePost from '../SinglePost/SinglePost';
import { useSelector } from 'react-redux';
import { selectAllPosts } from '../../store/slices/postSlice';

const AllPosts = () => {
  const posts = useSelector(selectAllPosts);

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