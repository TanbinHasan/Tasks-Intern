import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PostContent from '../PostContent/PostContent';
import RCS_Counter from './RCS_Counter';
import RCS_Btn from './RCS_Btn';
import CommentSection from '../CommentSection/CommentSection';
import { selectPostById, fetchPostComments } from '../../store/slices/postSlice';
import { RootState } from '../../store';
import { AppDispatch } from '../../store';

interface SinglePostProps {
  postId: number;
}

const SinglePost: React.FC<SinglePostProps> = ({ postId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const post = useSelector((state: RootState) => selectPostById(state, postId));
  
  // Add state to control the comments visibility
  const [showComments, setShowComments] = useState<boolean>(false);

  // If the post is not found, return null
  if (!post) return null;

  // Function to toggle comment visibility
  const toggleComments = () => {
    // If showing comments for the first time or we need to reload comments, fetch the first batch
    if (!showComments) {
      // Always load only first 5 comments when toggling visibility
      dispatch(fetchPostComments({ postId, offset: 0, limit: 5 }));
    }
    
    setShowComments(prevState => !prevState);
  };

  return (
    <>
      <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
        <PostContent post={post} />
        <RCS_Counter 
          post={post} 
          onCommentsClick={toggleComments} 
        />
        <RCS_Btn 
          post={post} 
          onCommentsClick={toggleComments}
          showingComments={showComments}
        />
        {/* Only render the comment section if showComments is true */}
        {showComments && <CommentSection postId={post.id} />}
      </div>
    </>
  );
};

export default SinglePost;