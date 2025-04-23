import React, { useState, useEffect, useRef, CSSProperties } from 'react';
import PostHeader from './PostHeader';
import Content from './Content';
import { useDispatch, useSelector } from 'react-redux';
import { updatePost, deletePost, Post, MediaItem } from '../../store/slices/postSlice';
import { selectUser } from '../../store/slices/userSlice';
import MediaButtons from '../PostSection/MediaButtons';
import Edit_Modal from './Edit_Modal';
import Delete_Modal from './Delete_Modal';
import EditPostButton from './EditPostButton';
import { AppDispatch } from '../../store';

interface PostContentProps {
  post: Post;
}

const PostContent: React.FC<PostContentProps> = ({ post }) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);

  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [editText, setEditText] = useState<string>(post.text);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(post.mediaItems || []);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownButtonRef = useRef<HTMLButtonElement>(null);

  // Check if user is author based on user_id instead of email
  const isAuthor = user && user.id === post.user_id;

  useEffect(() => {
    // Update mediaItems when post changes
    setMediaItems(post.mediaItems || []);
  }, [post]);

  const handleToggleDropdown = () => {
    setDropdownVisible(prevState => !prevState);
  };

  const handleEditClick = () => {
    // Reset form state with current post data
    setEditText(post.text);
    setMediaItems(post.mediaItems || []);
    setIsEditModalOpen(true);
    setDropdownVisible(false);
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
    setDropdownVisible(false);
  };

  const handleConfirmDelete = () => {
    dispatch(deletePost(post.id));
    setIsDeleteModalOpen(false);
  };

  const handleSaveClick = () => {
    dispatch(updatePost({
      id: post.id,
      text: editText,
      mediaItems: mediaItems
    }));
    setIsEditModalOpen(false);
  };

  // Function to convert YouTube URL to embed URL
  const convertYoutubeUrlToEmbed = (url: string): string => {
    if (!url) return '';
    // Extract video ID from YouTube URL
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[7].length === 11) ? match[7] : null;
    
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    return url;
  };

  const handleMediaSelection = (type: string, media: { url: string }) => {
    if (media && media.url) {
      // Add new media to array of media items
      setMediaItems(prevItems => [...prevItems, { type, url: media.url }]);
    }
  };

  const removeMediaItem = (index: number) => {
    setMediaItems(prevItems => prevItems.filter((_, i) => i !== index));
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownButtonRef.current && dropdownButtonRef.current.contains(event.target as Node)) {
        return;
      }

      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const modalPostBoxStyle: CSSProperties = {
    marginBottom: '16px'
  };

  const postButtonContainerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid #eee',
    position: 'sticky',
    bottom: 0,
    backgroundColor: 'white',
    zIndex: 1
  };

  const mediaPreviewContainerStyle: CSSProperties = {
    marginTop: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  };

  const mediaItemStyle: CSSProperties = {
    position: 'relative',
    borderRadius: '8px',
    overflow: 'hidden'
  };

  const removeButtonStyle: CSSProperties = {
    position: 'absolute',
    top: '8px',
    right: '8px',
    background: 'rgba(0, 0, 0, 0.6)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 10
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
          <div className="form-floating _feed_inner_text_area_box_form">
            <textarea
              className="form-control _textarea"
              placeholder="Write something"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={3}
            />
            <label className="_feed_textarea_label">Write something...</label>
          </div>
        </div>

        {/* Media buttons */}
        <div style={{ position: 'sticky', zIndex: 1, backgroundColor: 'white', padding: '8px 0' }}>
          <MediaButtons onMediaClick={handleMediaSelection} />
        </div>

        {/* Media preview section - now showing multiple items */}
        {mediaItems.length > 0 && (
          <div style={mediaPreviewContainerStyle}>
            {mediaItems.map((item, index) => (
              <div key={index} style={mediaItemStyle}>
                <button 
                  style={removeButtonStyle}
                  onClick={() => removeMediaItem(index)}
                >
                  ✕
                </button>
                {item.type === 'photo' ? (
                  <img 
                    src={item.url} 
                    alt={`Media ${index}`} 
                    style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }} 
                  />
                ) : (
                  <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '8px' }}>
                    <iframe 
                      src={convertYoutubeUrlToEmbed(item.url)}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={`YouTube ${index}`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

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