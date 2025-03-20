import React, { useState, useEffect, useRef } from 'react';
import PostHeader from './PostHeader';
import Content from './Content';
import { usePostContext } from '../../contexts/PostContext';
import { useUser } from '../../contexts/UserContext';

const PostContent = ({ post }) => {
  const { editPost, deletePost } = usePostContext();
  const { user } = useUser();

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState(post.text);

  const dropdownRef = useRef(null);
  const dropdownButtonRef = useRef(null);

  const isAuthor = user && user.email === post.email;

  const handleToggleDropdown = () => {
    setDropdownVisible(prevState => !prevState);
  };

  const handleEditClick = () => {
    setEditMode(true);
    setDropdownVisible(false);
  };

  const handleDeleteClick = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost(post.id);
    }
    setDropdownVisible(false);
  };

  const handleSaveClick = () => {
    editPost(post.id, editText);
    setEditMode(false);
  };

  const handleCancelClick = () => {
    setEditText(post.text);
    setEditMode(false);
  };
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownButtonRef.current && dropdownButtonRef.current.contains(event.target)) {
        return;
      }

      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="_feed_inner_timeline_post_top">
        <PostHeader post={post} />
        <div className="_feed_inner_timeline_post_box_dropdown">
          {/* Dropdown trigger button */}
          <div className="_feed_timeline_post_dropdown">
            <button
              ref={dropdownButtonRef}
              onClick={handleToggleDropdown}
              className="_feed_timeline_post_dropdown_link"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={4}
                height={17}
                fill="none"
                viewBox="0 0 4 17"
              >
                <circle cx={2} cy={2} r={2} fill="#C4C4C4" />
                <circle cx={2} cy={8} r={2} fill="#C4C4C4" />
                <circle cx={2} cy={15} r={2} fill="#C4C4C4" />
              </svg>
            </button>
          </div>

          {/* Dropdown Menu */}
          {dropdownVisible && (
            <div
              ref={dropdownRef}
              className="_feed_timeline_dropdown show"
              style={{
                position: 'absolute',
                right: '0',
                top: '100%',
                zIndex: 100,
                background: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                borderRadius: '4px',
                width: '200px',
                padding: '8px 0'
              }}
            >
              <ul className="_feed_timeline_dropdown_list" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                <li className="_feed_timeline_dropdown_item">
                  <button
                    className="_feed_timeline_dropdown_link"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                      padding: '8px 16px',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ marginRight: '8px' }}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={18}
                        height={18}
                        fill="none"
                        viewBox="0 0 18 18"
                      >
                        <path
                          stroke="#1890FF"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.2"
                          d="M14.25 15.75L9 12l-5.25 3.75v-12a1.5 1.5 0 011.5-1.5h7.5a1.5 1.5 0 011.5 1.5v12z"
                        />
                      </svg>
                    </span>
                    Save Post
                  </button>
                </li>

                {/* Show Edit/Delete options only to post author */}
                {isAuthor && (
                  <>
                    <li className="_feed_timeline_dropdown_item">
                      <button
                        className="_feed_timeline_dropdown_link"
                        onClick={handleEditClick}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          width: '100%',
                          padding: '8px 16px',
                          background: 'none',
                          border: 'none',
                          textAlign: 'left',
                          cursor: 'pointer'
                        }}
                      >
                        <span style={{ marginRight: '8px' }}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={18}
                            height={18}
                            fill="none"
                            viewBox="0 0 18 18"
                          >
                            <path
                              stroke="#1890FF"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.2"
                              d="M8.25 3H3a1.5 1.5 0 00-1.5 1.5V15A1.5 1.5 0 003 16.5h10.5A1.5 1.5 0 0015 15V9.75"
                            />
                            <path
                              stroke="#1890FF"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.2"
                              d="M13.875 1.875a1.591 1.591 0 112.25 2.25L9 11.25 6 12l.75-3 7.125-7.125z"
                            />
                          </svg>
                        </span>
                        Edit Post
                      </button>
                    </li>
                    <li className="_feed_timeline_dropdown_item">
                      <button
                        className="_feed_timeline_dropdown_link"
                        onClick={handleDeleteClick}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          width: '100%',
                          padding: '8px 16px',
                          background: 'none',
                          border: 'none',
                          textAlign: 'left',
                          cursor: 'pointer'
                        }}
                      >
                        <span style={{ marginRight: '8px' }}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={18}
                            height={18}
                            fill="none"
                            viewBox="0 0 18 18"
                          >
                            <path
                              stroke="#1890FF"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.2"
                              d="M2.25 4.5h13.5M6 4.5V3a1.5 1.5 0 011.5-1.5h3A1.5 1.5 0 0112 3v1.5m2.25 0V15a1.5 1.5 0 01-1.5 1.5h-7.5a1.5 1.5 0 01-1.5-1.5V4.5h10.5zM7.5 8.25v4.5M10.5 8.25v4.5"
                            />
                          </svg>
                        </span>
                        Delete Post
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Conditional rendering for edit mode */}
      {editMode ? (
        <div style={{ padding: '15px', marginBottom: '15px', background: '#f9f9f9', borderRadius: '8px' }}>
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            style={{
              width: '100%',
              minHeight: '100px',
              padding: '12px',
              borderRadius: '6px',
              border: '1px solid #e0e0e0',
              marginBottom: '15px',
              fontFamily: 'inherit',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              onClick={handleCancelClick}
              style={{
                padding: '8px 16px',
                borderRadius: '4px',
                border: 'none',
                background: '#f0f0f0',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveClick}
              style={{
                padding: '8px 16px',
                borderRadius: '4px',
                border: 'none',
                background: '#1890FF',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <Content post={post} />
      )}
    </>
  );
};

export default PostContent;