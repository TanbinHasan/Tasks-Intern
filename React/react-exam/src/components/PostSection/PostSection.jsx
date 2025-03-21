import React, { useState } from 'react';
import MediaButtons from './MediaButtons';
import TextArea from './TextArea';
import PostButton from './PostButton';
import Modal from './Modal';
import { usePostContext } from '../../contexts/PostContext';
import { useUser } from '../../contexts/UserContext';

const PostSection = ({ userEmail }) => {
  const { user } = useUser();
  const { addPost } = usePostContext();
  const [postContent, setPostContent] = useState('');
  const [mediaType, setMediaType] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePostClick = () => {
    if (postContent.trim() !== '') {
      addPost(postContent, mediaType, mediaFile, user.email);
      setPostContent('');
      setMediaType('');
      setMediaFile(null);
      setIsModalOpen(false);
    }
  };

  const handleMediaSelection = (type, file) => {
    console.log('Selected media type:', type, 'File:', file);
    setMediaType(type);
    setMediaFile(file);
  };

  const openPostModal = () => {
    setIsModalOpen(true);
  };

  const closePostModal = () => {
    setIsModalOpen(false);
  };

  const triggerTextStyle = {
    color: '#757575',
    display: 'flex',
    alignItems: 'center',
    minHeight: '40px',
    cursor: 'pointer'
  };

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

  // Create a compact post input box to trigger the modal
  return (
    <>
      <div className="_feed_inner_text_area _b_radious6 _padd_b16 _padd_t16 _padd_r24 _padd_l24 _mar_b16" onClick={openPostModal}>
        <div className="_feed_inner_text_area_box">
          <div className="_feed_inner_text_area_box_image">
            <img src="assets/images/txt_img.png" alt="Image" className="_txt_img" />
          </div>
          <div className="_feed_inner_text_area_box_form">
            <div className="form-control _textarea" style={triggerTextStyle}>
              What's on your mind?
            </div>
          </div>
        </div>
      </div>

      {/* Modal for creating posts */}
      <Modal isOpen={isModalOpen} onClose={closePostModal}>
        <div className="_feed_inner_text_area_box" style={modalPostBoxStyle}>
          <div className="_feed_inner_text_area_box_image">
            <img src="assets/images/txt_img.png" alt="Image" className="_txt_img" />
          </div>
          <TextArea value={postContent} onChange={(e) => setPostContent(e.target.value)} />
        </div>

        <MediaButtons onMediaClick={handleMediaSelection} />

        <div style={postButtonContainerStyle}>
          <PostButton onClick={handlePostClick} />
        </div>
      </Modal>
    </>
  );
};

export default PostSection;