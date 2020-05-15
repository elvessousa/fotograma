import React, { useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';

export default function Signin() {
  const history = useHistory();
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const postData = () => {
    fetch('/new-password', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password,
        token,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        if (data.error) {
          setErr(data.error);
        } else {
          setErr(data.message);
          history.push('/signin');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="signin">
      {err && <div className="err-message">{err}</div>}
      <h2>Almost there!</h2>
      <p>Just write down your new password below.</p>
      <input
        type="password"
        placeholder="Write your new password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={() => postData()}>Apply</button>
      <p className="box-phrase">
        Don't have an account? <Link to="/signup">Click here</Link>.
      </p>
    </div>
  );
}
