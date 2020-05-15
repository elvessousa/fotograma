import React from 'react';

export default function Message({ title, text }) {
  return (
    <div className="message">
      <div className="message-content">
        {title && <h2 className="message-title">{title}</h2>}
        {text && <div className="message-text">{text}</div>}
      </div>
    </div>
  );
}
