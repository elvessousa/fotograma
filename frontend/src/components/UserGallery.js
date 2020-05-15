import React from 'react';
import { Link } from 'react-router-dom';
import { GalleryItem } from './GalleryItem';

export default function UserGallery({ pictures }) {
  return (
    <div className="user-gallery">
      {pictures.map((item) => {
        return (
          <GalleryItem key={item._id} image={item.photo} title={item.title} />
        );
      })}
      {pictures.length === 0 && (
        <p className="no-pictures">
          No pictures available yet.
          <br />
          <Link to="/create"> Click here</Link> to add your first!
        </p>
      )}
    </div>
  );
}
