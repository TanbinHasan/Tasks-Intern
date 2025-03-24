import React, { useState, useEffect, useRef } from 'react';
import PostHeader from './PostHeader';
import Content from './Content';
import { usePostContext } from '../../contexts/PostContext';
import { useUser } from '../../contexts/UserContext';
import MediaButtons from '../PostSection/MediaButtons';
import Edit_Modal from './Edit_Modal';
import Delete_Modal from './Delete_Modal';
import EditPostButton from './EditPostButton';

const PostContent = ({ post }) => {
  const { editPost, deletePost } = usePostContext();
  const { user } = useUser();

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState(post.text);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [mediaType, setMediaType] = useState('');
  const [mediaFile, setMediaFile] = useState(null);

  const dropdownRef = useRef(null);
  const dropdownButtonRef = useRef(null);

  const isAuthor = user && user.email === post.email;

  const handleToggleDropdown = () => {
    setDropdownVisible(prevState => !prevState);
  };

  const handleEditClick = () => {
    setEditText(post.text);
    setMediaType(post.mediaType || '');
    setMediaFile(post.mediaFile || null);
    setIsEditModalOpen(true);
    setDropdownVisible(false);
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
    setDropdownVisible(false);
  };

  const handleConfirmDelete = () => {
    deletePost(post.id);
    setIsDeleteModalOpen(false);
  };

  const handleSaveClick = () => {
    editPost(post.id, editText, mediaType, mediaFile);
    setIsEditModalOpen(false);
  };

  const handleMediaSelection = (type, file) => {
    setMediaType(type);
    setMediaFile(file);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
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

  const modalPostBoxStyle = {
    marginBottom: '16px'
  };

  const postButtonContainerStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid #eee'
  };

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

      {/* Post content */}
      <Content post={post} />

      {/* Edit Post Modal */}
      <Edit_Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
        <div className="_feed_inner_text_area_box" style={modalPostBoxStyle}>
          <div className="_feed_inner_text_area_box_image">
            <img src="assets/images/txt_img.png" alt="Image" className="_txt_img" />
          </div>
          <div className="_feed_inner_text_area_box_form">
            <div className="form-control">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="_textarea"
                placeholder="What's on your mind?"
                style={{
                  width: '100%',
                  minHeight: '100px',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid #e0e0e0',
                  resize: 'none',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>
        </div>

        <MediaButtons onMediaClick={handleMediaSelection} />

        <div style={postButtonContainerStyle}>
          <button
            onClick={closeEditModal}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              border: 'none',
              background: '#f0f0f0',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Cancel
          </button>
          <EditPostButton onClick={handleSaveClick} />
        </div>
      </Edit_Modal>

      {/* Delete Confirmation Modal */}
      <Delete_Modal 
        isOpen={isDeleteModalOpen} 
        onClose={closeDeleteModal} 
        onConfirm={handleConfirmDelete} 
      />
    </>
  );
};

export default PostContent;