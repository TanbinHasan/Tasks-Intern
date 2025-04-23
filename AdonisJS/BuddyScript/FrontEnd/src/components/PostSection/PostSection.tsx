import React, { useState, CSSProperties } from 'react';
import MediaButtons from './MediaButtons';
import TextArea from './TextArea';
import PostButton from './PostButton';
import Modal from './Modal';
import { useDispatch } from 'react-redux';
import { createPost, MediaItem } from '../../store/slices/postSlice';
import { AppDispatch } from '../../store';

interface PostSectionProps {
  userEmail?: string;
}

const PostSection: React.FC<PostSectionProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [postContent, setPostContent] = useState<string>('');
  // Change from single media to array of media items
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handlePostClick = () => {
    if (postContent.trim() !== '' || mediaItems.length > 0) {
      dispatch(createPost({
        text: postContent,
        mediaItems: mediaItems
      }));
      setPostContent('');
      setMediaItems([]);
      setIsModalOpen(false);
    }
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

  // Function to convert YouTube URL to embed URL
  const convertYoutubeUrlToEmbed = (url: string): string => {
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
    setMediaItems([]);
  };

  const triggerTextStyle: CSSProperties = {
    color: '#757575',
    display: 'flex',
    alignItems: 'center',
    minHeight: '40px',
    cursor: 'pointer'
  };

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
          <PostButton onClick={handlePostClick} />
        </div>
      </Modal>
    </>
  );
};

export default PostSection;