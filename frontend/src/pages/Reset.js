import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

export default function Reset() {
  // eslint-disable-next-line
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [err, setErr] = useState('');

  const postData = () => {
    if (!/^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/.test(email)) {
      return setErr('Invalid e-mail address');
    }

    fetch('/reset', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
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
      <h2>Did you forget you password?</h2>
      <p>
        No problem. Just write down your e-mail address and we will send you a
        reset link.
      </p>
      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={() => postData()}>Reset my password</button>
    </div>
  );
}
