import React, { useEffect, useRef, useCallback } from 'react';
import SinglePost from '../SinglePost/SinglePost';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllPosts, fetchPosts, selectPostsLoading, selectPagination } from '../../store/slices/postSlice';
import { AppDispatch, RootState } from '../../store';

// Create a module-level variable to track if initial fetch has been done
// This ensures the state persists even if the component remounts
let globalInitialFetchDone = false;

const AllPosts: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const posts = useSelector(selectAllPosts);
  const isLoading = useSelector(selectPostsLoading);
  const pagination = useSelector(selectPagination);
  const postsLength = useSelector((state: RootState) => state.post.posts.length);
  
  // Observer for the last post element
  const observer = useRef<IntersectionObserver | null>(null);
  // Ref for the last post element
  const lastPostElementRef = useRef<HTMLDivElement | null>(null);

  // Initial fetch of posts - only when needed
  useEffect(() => {
    // Only fetch if we don't have posts already and haven't fetched before
    if (postsLength === 0 && !globalInitialFetchDone && !isLoading) {
      console.log("Initial posts fetch triggered");
      dispatch(fetchPosts(1));
      globalInitialFetchDone = true;
    }
    
    // When component unmounts, we'll keep the global flag
    return () => {
      // Only reset if navigating away from feed (optional)
      // If you uncomment this, it will refetch when user returns to feed
      // globalInitialFetchDone = false;
    };
  }, [dispatch, postsLength, isLoading]);

  // Function to load more posts
  const loadMorePosts = useCallback(() => {
    if (!isLoading && pagination.hasMore) {
      const nextPage = pagination.currentPage + 1;
      console.log(`Loading more posts: page ${nextPage}`);
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