import React, { useState } from 'react';
import MediaButtons from './MediaButtons';
import TextArea from './TextArea';
import PostButton from './PostButton';
import { usePostContext } from '../../contexts/PostContext';

const PostSection = ({ userEmail }) => {
  const { addPost } = usePostContext();
  const [postContent, setPostContent] = useState('');
  const [mediaType, setMediaType] = useState('');
  const [mediaFile, setMediaFile] = useState(null);

  const handlePostClick = () => {
    if (postContent.trim() !== '') {
      // Add the post using the context method
      addPost(postContent, mediaType, mediaFile, userEmail); // Pass the user email along with the post data
      // Clear the input fields after posting
      setPostContent('');
      setMediaType('');
      setMediaFile(null);
    }
  };

  const handleMediaSelection = (type, file) => {
    console.log('Selected media type:', type, 'File:', file); // Log to check if file is passed correctly
    setMediaType(type);
    setMediaFile(file); // Set the selected file
  };  

  return (
    <div className="_feed_inner_text_area _b_radious6 _padd_b24 _padd_t24 _padd_r24 _padd_l24 _mar_b16">
      <div className="_feed_inner_text_area_box">
        <div className="_feed_inner_text_area_box_image">
          <img src="assets/images/txt_img.png" alt="Image" className="_txt_img" />
        </div>
        <TextArea value={postContent} onChange={(e) => setPostContent(e.target.value)} />
      </div>

      <MediaButtons onMediaClick={handleMediaSelection} /> {/* Handle file selection */}

      <PostButton onClick={handlePostClick} />
    </div>
  );
};

export default PostSection;