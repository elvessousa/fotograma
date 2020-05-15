import React from 'react';

export default function UserInfo({
  name,
  email,
  description,
  posts,
  followers,
  following,
  children,
}) {
  return (
    <div className="user-info">
      <div className="user-name">
        <h2 className="user-title">{name}</h2>
        <div className="user-buttons">{children}</div>
      </div>
      <ul className="user-stats">
        <li>
          <strong>{posts}</strong> posts
        </li>
        <li>
          <strong>{followers}</strong> followers
        </li>
        <li>
          <strong>{following}</strong> following
        </li>
      </ul>
      {description && <p>{description}</p>}
      {email && (
        <a href={email} className="user-site">
          {email}
        </a>
      )}
    </div>
  );
}
