import React, { useState } from 'react';
import PostMedia from '../PostSection/PostMedia';

const Content = ({ post }) => {
  // State for lightbox/fullscreen view
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  
  // Check for multiple media items first (new structure)
  const hasMultipleMedia = post.mediaItems && post.mediaItems.length > 0;
  // Check for single media (backward compatibility)
  const hasSingleMedia = !hasMultipleMedia && post.mediaUrl && post.mediaType;

  // Get all media items in a consistent format
  const allMediaItems = hasMultipleMedia 
    ? post.mediaItems 
    : (hasSingleMedia ? [{ type: post.mediaType, url: post.mediaUrl }] : []);
  
  // Function to handle clicking on a media item
  const handleMediaClick = (index) => {
    setSelectedMediaIndex(index);
    setLightboxOpen(true);
  };

  // Function to close the lightbox
  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  // Function to navigate to previous media
  const goToPrevious = () => {
    setSelectedMediaIndex((prevIndex) => 
      prevIndex === 0 ? allMediaItems.length - 1 : prevIndex - 1
    );
  };

  // Function to navigate to next media
  const goToNext = () => {
    setSelectedMediaIndex((prevIndex) => 
      prevIndex === allMediaItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Function to convert YouTube URL to embed URL
  const convertYoutubeUrlToEmbed = (url) => {
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

  // Lightbox component
  const renderLightbox = () => {
    if (!lightboxOpen) return null;
    
    const currentMedia = allMediaItems[selectedMediaIndex];
    
    const lightboxStyles = {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    };
    
    const contentStyles = {
      position: 'relative',
      maxWidth: '90%',
      maxHeight: '80%',
    };
    
    const backButtonStyles = {
      position: 'absolute',
      top: '20px',
      left: '20px',
      background: 'rgba(0, 0, 0, 0.5)',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      fontSize: '16px',
      zIndex: 1001,
    };
    
    const navigationButtonStyles = {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'rgba(0, 0, 0, 0.5)',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      fontSize: '20px',
      zIndex: 1001,
    };
    
    const countStyles = {
      position: 'absolute',
      bottom: '20px',
      color: 'white',
      background: 'rgba(0, 0, 0, 0.5)',
      padding: '5px 10px',
      borderRadius: '15px',
      fontSize: '14px',
    };
    
    return (
      <div style={lightboxStyles} onClick={closeLightbox}>
        <button style={backButtonStyles} onClick={closeLightbox}>
          ✕
        </button>
        
        {allMediaItems.length > 1 && (
          <>
            <button 
              style={{...navigationButtonStyles, left: '20px'}} 
              onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
            >
              &#10094;
            </button>
            
            <button 
              style={{...navigationButtonStyles, right: '20px'}} 
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
            >
              &#10095;
            </button>
            
            <div style={countStyles}>
              {selectedMediaIndex + 1} / {allMediaItems.length}
            </div>
          </>
        )}
        
        <div style={contentStyles} onClick={(e) => e.stopPropagation()}>
          {currentMedia.type === 'photo' ? (
            <img 
              src={currentMedia.url} 
              alt="Full view" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '80vh', 
                objectFit: 'contain',
                borderRadius: '4px'
              }} 
            />
          ) : (
            <div style={{ 
              width: '80vw',
              height: '80vh',
              maxWidth: '1000px',
              maxHeight: '562px',
              position: 'relative'
            }}>
              <iframe 
                src={convertYoutubeUrlToEmbed(currentMedia.url)}
                style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  width: '100%', 
                  height: '100%', 
                  border: 'none',
                  borderRadius: '4px'
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Media view"
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  // Simple media grid
  const renderGrid = () => {
    if (allMediaItems.length === 0) return null;
    
    // Different layouts based on number of items
    let gridTemplateAreas, gridTemplateRows, gridTemplateColumns;
    
    switch (allMediaItems.length) {
      case 1:
        // Single item takes full width
        gridTemplateAreas = '"main"';
        gridTemplateRows = '1fr';
        gridTemplateColumns = '1fr';
        break;
      case 2:
        // Two items side by side
        gridTemplateAreas = '"one two"';
        gridTemplateRows = '1fr';
        gridTemplateColumns = '1fr 1fr';
        break;
      case 3:
        // One large on top, two smaller below
        gridTemplateAreas = 
          '"one one" ' +
          '"two three"';
        gridTemplateRows = '2fr 1fr';
        gridTemplateColumns = '1fr 1fr';
        break;
      case 4:
        // 2x2 grid
        gridTemplateAreas = 
          '"one two" ' +
          '"three four"';
        gridTemplateRows = '1fr 1fr';
        gridTemplateColumns = '1fr 1fr';
        break;
      default:
        // 2x2 grid with "more" indicator
        gridTemplateAreas = 
          '"one two" ' +
          '"three four"';
        gridTemplateRows = '1fr 1fr';
        gridTemplateColumns = '1fr 1fr';
        break;
    }
    
    const gridStyle = {
      display: 'grid',
      gridTemplateAreas,
      gridTemplateRows,
      gridTemplateColumns,
      gap: '2px',
      marginTop: '15px',
      marginBottom: '15px',
      borderRadius: '8px',
      overflow: 'hidden',
      aspectRatio: allMediaItems.length === 1 ? 'auto' : '16/9',
      height: allMediaItems.length === 1 ? 'auto' : '400px',
    };
    
    return (
      <div style={gridStyle}>
        {allMediaItems.slice(0, 4).map((item, index) => {
          // If it's the 4th item and we have more than 4 items, show the "+X" overlay
          const hasMoreOverlay = index === 3 && allMediaItems.length > 4;
          
          return (
            <div 
              key={index} 
              style={{ 
                gridArea: ['one', 'two', 'three', 'four'][index],
                position: 'relative',
                cursor: 'pointer',
                overflow: 'hidden',
              }}
              onClick={() => handleMediaClick(index)}
            >
              {item.type === 'photo' ? (
                <img 
                  src={item.url} 
                  alt={`Media ${index}`} 
                  style={{ 
                    width: '100%', 
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    }
                  }} 
                />
              ) : (
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  {/* Thumbnail/preview for video with play button overlay */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: '#000',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1
                  }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      <div style={{
                        width: 0,
                        height: 0,
                        borderTop: '15px solid transparent',
                        borderBottom: '15px solid transparent',
                        borderLeft: '20px solid white',
                        marginLeft: '5px'
                      }}></div>
                    </div>
                  </div>
                  <img 
                    src={`https://img.youtube.com/vi/${extractYoutubeId(item.url)}/0.jpg`} 
                    alt={`Video ${index} thumbnail`} 
                    style={{ 
                      width: '100%', 
                      height: '100%',
                      objectFit: 'cover',
                      opacity: 0.7
                    }} 
                  />
                </div>
              )}
              
              {hasMoreOverlay && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: 'bold'
                }}>
                  +{allMediaItems.length - 4} more
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };
  
  // Helper function to extract YouTube ID
  const extractYoutubeId = (url) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  return (
    <>
      <h4 className="_feed_inner_timeline_post_title">
        {post.text}
      </h4>
      
      {/* Render media grid */}
      {renderGrid()}
      
      {/* Render lightbox */}
      {renderLightbox()}
    </>
  );
};

export default Content;