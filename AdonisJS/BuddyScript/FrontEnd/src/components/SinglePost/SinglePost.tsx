import React, { useState } from 'react';
import PostContent from '../PostContent/PostContent';
import RCS_Counter from './RCS_Counter';
import RCS_Btn from './RCS_Btn';
import CommentSection from '../CommentSection/CommentSection';
import { useSelector } from 'react-redux';
import { selectPostById } from '../../store/slices/postSlice';
import { RootState } from '../../store';

interface SinglePostProps {
  postId: number;
}

const SinglePost: React.FC<SinglePostProps> = ({ postId }) => {
  const post = useSelector((state: RootState) => selectPostById(state, postId));
  // Add state to control the comments visibility
  const [showComments, setShowComments] = useState<boolean>(false);

  // If the post is not found, return null
  if (!post) return null;

  // Function to toggle comment visibility
  const toggleComments = () => {
    setShowComments(prevState => !prevState);
  };

  return (
    <>
      <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
        <PostContent post={post} />
        <RCS_Counter post={post} onCommentsClick={toggleComments} />
        <RCS_Btn post={post} />
        {/* Only render the comment section if showComments is true */}
        {showComments && <CommentSection postId={post.id} />}
      </div>
    </>
  );
};

export default SinglePost;