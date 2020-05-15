import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '../App';

export default function Signin() {
  // eslint-disable-next-line
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const postData = () => {
    if (!/^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/.test(email)) {
      return setErr('Invalid e-mail address');
    }

    fetch('/signin', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        if (data.error) {
          setErr(data.error);
        } else {
          localStorage.setItem('jwt', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          dispatch({ type: 'USER', payload: data.user });
          setErr('');
          history.push('/');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="signin">
      {err && <div className="err-message">{err}</div>}
      <h2>Welcome back!</h2>
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
      <button onClick={() => postData()}>Sign in</button>
      <p className="box-phrase">
        Don't have an account? <Link to="/signup">Click here</Link>.
      </p>
      <p className="box-phrase">
        <Link to="/reset">Forgot my password</Link>
      </p>
    </div>
  );
}
