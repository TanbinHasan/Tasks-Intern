import React from 'react';

const PostMedia = ({ mediaType, mediaUrl }) => {
  if (!mediaUrl) return null;

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

  // Styles for media
  const mediaContainerStyle = {
    marginTop: '15px',
    marginBottom: '15px',
    borderRadius: '8px',
    overflow: 'hidden',
    maxWidth: '100%'
  };

  const imageStyle = {
    width: '100%',
    maxHeight: '500px',
    objectFit: 'cover',
    borderRadius: '8px'
  };

  const videoContainerStyle = {
    position: 'relative',
    paddingBottom: '56.25%', // 16:9 aspect ratio
    height: 0,
    overflow: 'hidden',
    borderRadius: '8px'
  };

  const iframeStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 'none'
  };

  if (mediaType === 'photo') {
    return (
      <div style={mediaContainerStyle}>
        <img 
          src={mediaUrl} 
          alt="Post media" 
          style={imageStyle}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "assets/images/fallback-image.png"; // Fallback image
          }}
        />
      </div>
    );
  } else if (mediaType === 'video') {
    const embedUrl = convertYoutubeUrlToEmbed(mediaUrl);
    return (
      <div style={mediaContainerStyle}>
        <div style={videoContainerStyle}>
          <iframe 
            src={embedUrl}
            style={iframeStyle}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Embedded video"
          />
        </div>
      </div>
    );
  }

  return null;
};

// You can use this component in your Post component like this:
// <PostMedia mediaType={post.mediaType} mediaUrl={post.mediaUrl} />

export default PostMedia;