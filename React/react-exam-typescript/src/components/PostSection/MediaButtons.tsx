import React, { useState } from 'react';
import MediaButton from './MediaButton';

interface MediaButtonsProps {
  onMediaClick: (type: string, file: { url: string }) => void;
}

const MediaButtons: React.FC<MediaButtonsProps> = ({ onMediaClick }) => {
  const types: Array<'photo' | 'video'> = ['photo', 'video'];
  const [selectedType, setSelectedType] = useState<string>('');

  const handleMediaClick = (type: string, file: { url: string }) => {
    setSelectedType(type);
    if (file) {
      console.log('Selected file:', file);
    }
    onMediaClick(type, file);
  };

  const containerStyle = {
    display: 'flex',
    gap: '12px',
    marginTop: '16px'
  };

  return (
    <div className="_feed_inner_text_area_bottom" style={containerStyle}>
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