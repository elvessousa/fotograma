import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

export default function CreatePost() {
  const history = useHistory();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState('');
  const [imageFeedback, setImageFeedback] = useState('');
  const [url, setUrl] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    if (url) {
      fetch('/createpost', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
        body: JSON.stringify({
          title,
          body,
          url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setErr(data.error);
          } else {
            setErr('');
            history.push('/');
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [url, body, history, title]);

  const postDetails = () => {
    const data = new FormData();
    data.append('file', image);
    data.append('upload_preset', 'fotograma');
    data.append('cloud_name', 'fotograma');

    // Post image to Cloudinary
    fetch('https://api.cloudinary.com/v1_1/fotograma/image/upload', {
      method: 'post',
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.secure_url);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="create-post">
      {err && <div className="err-message">{err}</div>}
      <h2>Create your post!</h2>
      <div className="file">
        <h5>Image file</h5>
        <label
          htmlFor="file"
          className="file-chooser"
          style={{
            backgroundImage: imageFeedback ? `url('${imageFeedback}')` : '',
          }}
        >
          Choose file
        </label>
        <input
          id="file"
          type="file"
          onChange={(e) => {
            setImage(e.target.files[0]);
            let reader = new FileReader();
            reader.onload = function (e) {
              setImageFeedback(e.target.result);
            };
            reader.readAsDataURL(e.target.files[0]);
          }}
          style={{ display: 'none' }}
        />
      </div>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <button onClick={() => postDetails()}>Post!</button>
    </div>
  );
}
