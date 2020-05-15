import React from 'react';

export default function UserAvatar({ image, children }) {
  return (
    <div className="user-avatar">
      <div
        style={{ backgroundImage: image ? `url('${image}')` : '' }}
        alt="Avatar"
        className="user-picture"
      >
        {children}
      </div>
    </div>
  );
}
