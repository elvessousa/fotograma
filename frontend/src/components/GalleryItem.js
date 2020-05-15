import React from 'react';

export function GalleryItem({ image, children }) {
  return (
    <div
      className="gallery-item"
      style={{ backgroundImage: `url('${image}')` }}
    >
      {children}
    </div>
  );
}
