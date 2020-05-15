import React, { useState, useEffect, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';

export default function Signup() {
  const history = useHistory();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('');
  const [url, setUrl] = useState(undefined);
  const [imageFeedback, setImageFeedback] = useState('');
  const [err, setErr] = useState('');

  // Upload user profile picture
  const uploadAvatar = () => {
    const data = new FormData();
    data.append('file', avatar);
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

  // Send user data
  const sendFields = useCallback(() => {
    if (!/^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/.test(email)) {
      return setErr('Invalid e-mail address');
    }

    fetch('/signup', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
        avatar: url,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setErr(data.error);
        } else {
          setErr('');
          history.push('/signin');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [email, history, name, password, url]);

  // Post all fields and image
  const postData = () => {
    if (avatar) {
      uploadAvatar();
    } else {
      sendFields();
    }
  };

  useEffect(() => {
    if (url) {
      sendFields();
    }
  }, [url, sendFields]);

  return (
    <div className="signup">
      {err && <div className="err-message">{err}</div>}
      <h2>Create your account!</h2>
      <div className="file">
        <h5>Your avatar image</h5>
        <label
          htmlFor="file"
          className="file-chooser"
          style={{ backgroundImage: `url('${imageFeedback}')` }}
        >
          Choose file
        </label>
        <input
          id="file"
          type="file"
          onChange={(e) => {
            setAvatar(e.target.files[0]);
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
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={() => postData()}>Sign up</button>
      <p className="box-phrase">
        Already have an account? <Link to="/signin">Click here</Link>.
      </p>
      <p className="box-phrase">
        <Link to="/reset">Forgot my password</Link>
      </p>
    </div>
  );
}
