import React from 'react';
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

  // If the post is not found, return null
  if (!post) return null;

  return (
    <>
      <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
        <PostContent post={post} /> {/* Pass post to PostContent */}
        <RCS_Counter post={post} />
        <RCS_Btn post={post} />
        <CommentSection postId={post.id} />
      </div>
    </>
  );
};

export default SinglePost;