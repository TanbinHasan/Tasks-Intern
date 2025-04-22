import React from "react";

interface MediaButtonProps {
  type: 'photo' | 'video';
  onClick: (type: string, media: { url: string }) => void;
  isSelected: boolean;
}

const MediaButton: React.FC<MediaButtonProps> = ({ type, onClick, isSelected }) => {
  const handleButtonClick = () => {
    if (type === 'photo') {
      // Random photo URLs
      const photoUrls = [
        "https://c4.wallpaperflare.com/wallpaper/990/287/677/pink-floyd-album-covers-wallpaper-preview.jpg",
        "https://c4.wallpaperflare.com/wallpaper/538/551/690/pink-floyd-wish-you-were-here-wallpaper-preview.jpg",
        "https://c4.wallpaperflare.com/wallpaper/426/73/129/band-music-pink-floyd-wallpaper-preview.jpg",
        "https://c4.wallpaperflare.com/wallpaper/856/803/659/wall-pink-floyd-pink-hammer-wallpaper-preview.jpg",
        "https://c4.wallpaperflare.com/wallpaper/820/767/725/band-music-iron-maiden-wallpaper-preview.jpg",
        "https://c4.wallpaperflare.com/wallpaper/636/961/185/iron-maiden-metal-artwork-music-wallpaper-preview.jpg",
        "https://c4.wallpaperflare.com/wallpaper/1012/596/909/music-album-covers-iron-maiden-union-jack-wallpaper-preview.jpg"
      ];
      // Pick a random photo URL
      const randomPhotoUrl = photoUrls[Math.floor(Math.random() * photoUrls.length)];
      onClick(type, { url: randomPhotoUrl });
    } else if (type === 'video') {
      // Random video URLs
      const videoUrls = [
        "https://www.youtube.com/watch?v=GIzDsGyxsQM&pp=ygURdGhyb3VnaCB0aGUgZ2xhc3M%3D",
        "https://www.youtube.com/watch?v=LXEKuttVRIo&pp=ygUOc251ZmYgc2xpcGtub3TSBwkJTwkBhyohjO8%3D"
      ];
      // Pick a random video URL
      const randomVideoUrl = videoUrls[Math.floor(Math.random() * videoUrls.length)];
      onClick(type, { url: randomVideoUrl });
    }
  };
  
  const buttonStyle = {
    color: isSelected ? '#1877f2' : 'inherit'
  };

  const iconStyle = {
    fill: isSelected ? '#1877f2' : '#666'
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'photo':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="none" viewBox="0 0 20 20" style={iconStyle}>
            <path
              d="M13.916 0c3.109 0 5.18 2.429 5.18 5.914v8.17c0 3.486-2.072 5.916-5.18 5.916H5.999C2.89 20 .827 17.572.827 14.085v-8.17C.827 2.43 2.897 0 6 0h7.917zm0 1.504H5.999c-2.321 0-3.799 1.735-3.799 4.41v8.17c0 2.68 1.472 4.412 3.799 4.412h7.917c2.328 0 3.807-1.734 3.807-4.411v-8.17c0-2.678-1.478-4.411-3.807-4.411zm.65 8.68l.12.125 1.9 2.147a.803.803 0 01-.016 1.063.642.642 0 01-.894.058l-.076-.074-1.9-2.148a.806.806 0 00-1.205-.028l-.074.087-2.04 2.717c-.722.963-2.02 1.066-2.86.26l-.111-.116-.814-.91a.562.562 0 00-.793-.07l-.075.073-1.4 1.617a.645.645 0 01-.97.029.805.805 0 01-.09-.977l.064-.086 1.4-1.617c.736-.852 1.95-.897 2.734-.137l.114.12.81.905a.587.587 0 00.861.033l.07-.078 2.04-2.718c.81-1.08 2.27-1.19 3.205-.275z"
            />
          </svg>
        );
      case 'video':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width={22} height={24} fill="none" viewBox="0 0 22 24" style={iconStyle}>
            <path
              d="M11.485 4.5c2.213 0 3.753 1.534 3.917 3.784l2.418-1.082c1.047-.468 2.188.327 2.271 1.533l.005.141v6.64c0 1.237-1.103 2.093-2.155 1.72l-.121-.047-2.418-1.083c-.164 2.25-1.708 3.785-3.917 3.785H5.76c-2.343 0-3.932-1.72-3.932-4.188V8.688c0-2.47 1.589-4.188 3.932-4.188h5.726zm0 1.5H5.76C4.169 6 3.197 7.05 3.197 8.688v7.015c0 1.636.972 2.688 2.562 2.688h5.726c1.586 0 2.562-1.054 2.562-2.688v-.686-6.329c0-1.636-.973-2.688-2.562-2.688z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`_feed_inner_text_area_bottom_${type} _feed_common`}
      onClick={handleButtonClick}
    >
      <button 
        type="button" 
        className="_feed_inner_text_area_bottom_photo_link"
        style={buttonStyle}
      >
        <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
          {getIcon(type)}
        </span>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </button>
    </div>
  );
};

export default MediaButton;