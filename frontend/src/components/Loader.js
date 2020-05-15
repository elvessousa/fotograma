import React from 'react';

export default function Loader({ text }) {
  return <div className="loader">{text ? text : 'Loading...'}</div>;
}
