import React, { useEffect, useRef, useCallback } from 'react';
import SinglePost from '../SinglePost/SinglePost';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllPosts, fetchPosts, selectPostsLoading, selectPagination } from '../../store/slices/postSlice';
import { AppDispatch } from '../../store';

const AllPosts: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const posts = useSelector(selectAllPosts);
  const isLoading = useSelector(selectPostsLoading);
  const pagination = useSelector(selectPagination);
  
  // Observer for the last post element
  const observer = useRef<IntersectionObserver | null>(null);
  // Ref for the last post element
  const lastPostElementRef = useRef<HTMLDivElement | null>(null);

  // Initial fetch of posts
  useEffect(() => {
    console.log("Fetching posts...");
    dispatch(fetchPosts(1));
  }, [dispatch]);

  // Function to load more posts
  const loadMorePosts = useCallback(() => {
    if (!isLoading && pagination.hasMore) {
      const nextPage = pagination.currentPage + 1;
      dispatch(fetchPosts(nextPage));
    }
  }, [dispatch, isLoading, pagination.currentPage, pagination.hasMore]);

  // Set up intersection observer to detect when user scrolls to the bottom
  useEffect(() => {
    // Disconnect previous observer if it exists
    if (observer.current) {
      observer.current.disconnect();
    }

    // Create new observer
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && pagination.hasMore && !isLoading) {
        loadMorePosts();
      }
    }, { threshold: 0.5 });

    // Observe the last post element if it exists
    if (lastPostElementRef.current) {
      observer.current.observe(lastPostElementRef.current);
    }

    // Cleanup observer on unmount
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [loadMorePosts, pagination.hasMore, isLoading]);

  return (
    <>
      {posts.map((post, index) => {
        // Determine if this is the last element
        const isLastElement = index === posts.length - 1;
        
        return (
          <div 
            key={post.id} 
            className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16"
            ref={isLastElement ? lastPostElementRef : null}
          >
            <SinglePost postId={post.id} />
          </div>
        );
      })}
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading more posts...</p>
          </div>
        </div>
      )}
      
      {/* End of posts message */}
      {!isLoading && !pagination.hasMore && posts.length > 0 && (
        <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <p>No more posts to display</p>
          </div>
        </div>
      )}
      
      {/* No posts message */}
      {!isLoading && posts.length === 0 && (
        <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <p>No posts found. Create the first post!</p>
          </div>
        </div>
      )}
    </>
  );
};

export default AllPosts;