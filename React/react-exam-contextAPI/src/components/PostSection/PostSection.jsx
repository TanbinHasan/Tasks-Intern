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
  const [mediaUrl, setMediaUrl] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewMedia, setPreviewMedia] = useState(null);

  const handlePostClick = () => {
    if (postContent.trim() !== '' || mediaUrl) {
      addPost(postContent, mediaType, { url: mediaUrl }, user.email, user.name);
      setPostContent('');
      setMediaType('');
      setMediaUrl('');
      setPreviewMedia(null);
      setIsModalOpen(false);
    }
  };

  const handleMediaSelection = (type, media) => {
    console.log('Selected media type:', type, 'Media:', media);
    setMediaType(type);
    if (media && media.url) {
      setMediaUrl(media.url);
      setPreviewMedia(
        <div className="media-preview" style={{ marginTop: '16px', maxWidth: '100%' }}>
          {type === 'photo' ? (
            <img 
              src={media.url} 
              alt="Selected media" 
              style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }} 
            />
          ) : (
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '8px' }}>
              <iframe 
                src={convertYoutubeUrlToEmbed(media.url)}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="YouTube video player"
              />
            </div>
          )}
        </div>
      );
    }
  };

  // Function to convert YouTube URL to embed URL
  const convertYoutubeUrlToEmbed = (url) => {
    // Extract video ID from YouTube URL
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[7].length === 11) ? match[7] : null;
    
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    return url;
  };

  const openPostModal = () => {
    setIsModalOpen(true);
  };

  const closePostModal = () => {
    setIsModalOpen(false);
    setMediaType('');
    setMediaUrl('');
    setPreviewMedia(null);
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

        {/* Media preview section */}
        {previewMedia}

        <MediaButtons onMediaClick={handleMediaSelection} />

        <div style={postButtonContainerStyle}>
          <PostButton onClick={handlePostClick} />
        </div>
      </Modal>
    </>
  );
};

export default PostSection;