import React from 'react';
import { Post } from '../../store/slices/postSlice';

interface RCS_CounterProps {
  post: Post;
}

const RCS_Counter: React.FC<RCS_CounterProps> = ({ post }) => {
  const commentCount = post.comments.reduce((count, comment) => {
    let total = 1;
    if (comment.replies && Array.isArray(comment.replies)) {
      total += comment.replies.length;
    }
    return count + total;
  }, 0);
  
  return (
    <>
      <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26">
        <div className="_feed_inner_timeline_total_reacts_image">
          <img
            src="assets/images/react_img1.png"
            alt="Image"
            className="_react_img1"
          />
          <img
            src="assets/images/react_img2.png"
            alt="Image"
            className="_react_img"
          />
          <img
            src="assets/images/react_img3.png"
            alt="Image"
            className="_react_img _rect_img_mbl_none"
          />
          <img
            src="assets/images/react_img4.png"
            alt="Image"
            className="_react_img _rect_img_mbl_none"
          />
          <img
            src="assets/images/react_img5.png"
            alt="Image"
            className="_react_img _rect_img_mbl_none"
          />
          <p className="_feed_inner_timeline_total_reacts_para">
            9+
          </p>
        </div>
        <div className="_feed_inner_timeline_total_reacts_txt">
          <p className="_feed_inner_timeline_total_reacts_para1">
            <span>
              {commentCount === 0
                ? ""
                : commentCount === 1
                  ? "1 Comment"
                  : `${commentCount} Comments`}
            </span>

          </p>
          <p className="_feed_inner_timeline_total_reacts_para2">
            <span>{0}</span> Share
          </p>
        </div>
      </div>
    </>
  );
};

export default RCS_Counter;