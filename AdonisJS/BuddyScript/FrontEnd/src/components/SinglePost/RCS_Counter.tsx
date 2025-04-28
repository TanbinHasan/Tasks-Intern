import React from "react";
import { Post } from "../../store/slices/postSlice";

interface RCS_CounterProps {
  post: Post;
  onCommentsClick: () => void; // Add click handler prop
}

const RCS_Counter: React.FC<RCS_CounterProps> = ({ post, onCommentsClick }) => {
  const commentCount = post.comments?.length || 0;
  const shareCount: number = 0; // Currently hardcoded, can be updated later

  return (
    <div
      className="_feed_inner_timeline_total_reacts"
      style={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        color: "#65676B",
        fontSize: "0.9rem",
        padding: "0 24px 10px",
      }}
    >
      <div>
        {commentCount > 0 && (
          <span 
            onClick={onCommentsClick}
            style={{ 
              cursor: 'pointer',
              fontWeight: '500',
              // Add transition for smooth underline effect
              transition: 'color 0.2s ease, text-decoration 0.2s ease',
              textDecoration: 'none'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = '#1877F2';
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = '#65676B';
              e.currentTarget.style.textDecoration = 'none';
            }}
          >
            {commentCount} {commentCount === 1 ? "Comment" : "Comments"}
          </span> 
        )}
        {commentCount > 0 && shareCount > 0 && ' · '}
        {shareCount > 0 && (
          <>
            {shareCount} {shareCount === 1 ? "Share" : "Shares"}
          </>
        )}
      </div>
    </div>
  );
};

export default RCS_Counter;