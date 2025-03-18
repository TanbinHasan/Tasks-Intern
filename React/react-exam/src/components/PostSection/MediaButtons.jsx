import React, { useState } from 'react';
import MediaButton from './MediaButton';

const MediaButtons = ({ onMediaClick }) => {
  const types = ['photo', 'video'];
  const [selectedType, setSelectedType] = useState('');

  const handleMediaClick = (type, file) => {
    setSelectedType(type);
    if (file) {
      // Handle the uploaded file here (e.g., save it, display preview)
      console.log('Selected file:', file);
    }
    onMediaClick(type, file); // Pass the selected media type and file back to parent
  };

  return (
    <div className="_feed_inner_text_area_bottom">
      {types.map((type) => (
        <MediaButton
          key={type}
          type={type}
          onClick={handleMediaClick}
          isSelected={selectedType === type}
        />
      ))}
    </div>
  );
};

export default MediaButtons;