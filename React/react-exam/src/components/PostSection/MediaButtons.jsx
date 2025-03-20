import React, { useState } from 'react';
import MediaButton from './MediaButton';

const MediaButtons = ({ onMediaClick }) => {
  const types = ['photo', 'video'];
  const [selectedType, setSelectedType] = useState('');

  const handleMediaClick = (type, file) => {
    setSelectedType(type);
    if (file) {
      console.log('Selected file:', file);
    }
    onMediaClick(type, file);
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