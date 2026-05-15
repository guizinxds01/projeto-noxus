import React from 'react';

const API = '';

const MediaRenderer = ({ url, className, ...props }) => {
  if (!url) return null;

  const isVideo = url.match(/\.(mp4|webm|ogg|mov)$/i);
  const fullUrl = url.startsWith('http') ? url : `${API}${url}`;

  if (isVideo) {
    return (
      <video
        src={fullUrl}
        className={`${className} object-cover`}
        autoPlay
        muted
        loop
        playsInline
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
      style={{ imageRendering: '-webkit-optimize-contrast' }}
      {...props}
    />
  );
};

export default MediaRenderer;
