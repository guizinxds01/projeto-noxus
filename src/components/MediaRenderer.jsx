import React from 'react';


const MediaRenderer = ({ url, className, ...props }) => {
  if (!url) return null;

  const isVideo = url.match(/\.(mp4|webm|ogg|mov)$/i);
  const fullUrl = url;

  if (isVideo) {
    return (
      <video
        src={fullUrl}
        className={`${className} object-cover`}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        style={{ imageRendering: '-webkit-optimize-contrast' }}
        {...props}
      />
    );
  }

  return (
    <img
      src={fullUrl}
      className={`${className} object-cover`}
      loading="lazy"
      decoding="async"
      style={{ imageRendering: '-webkit-optimize-contrast' }}
      {...props}
    />
  );
};

export default MediaRenderer;
