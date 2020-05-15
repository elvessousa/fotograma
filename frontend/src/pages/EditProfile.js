import React, { useContext } from 'react';

import { UserContext } from '../App';
import Loader from '../components/Loader';
import UserAvatar from '../components/UserAvatar';

export default function EditProfile(params) {
  const { state, dispatch } = useContext(UserContext);

  return (
    <>
      {state ? (
        <div className="edit-profile">
          <header className="user-edit">
            <UserAvatar image={state.avatar} />
            <div className="user-edit-info">
              <h2 className="user-edit-title">{state.name}</h2>
              <small>{state.email}</small>
            </div>
          </header>
          <hr />
          <div className="fields">
            <label className="form-label" htmlFor="name">
              Name
            </label>
            <input
              className="text-field"
              id="name"
              type="text"
              placeholder="Your Name"
              value={state.name}
            />
          </div>
          <div className="fields">
            <label className="form-label" htmlFor="username">
              Username
            </label>
            <input
              className="text-field"
              id="username"
              type="text"
              placeholder="user_name"
            />
          </div>
          <div className="fields">
            <label className="form-label" htmlFor="site">
              Site
            </label>
            <input
              className="text-field"
              id="site"
              type="text"
              placeholder="https://yoursite.com"
            />
          </div>
          <div className="fields">
            <label className="form-label" htmlFor="bio">
              Bio
            </label>
            <textarea
              className="text-field"
              id="bio"
              type="text"
              placeholder="All work and no play makes Jack a dull boy."
            />
          </div>
          <h4>Personal information</h4>
          <div className="fields">
            <label className="form-label" htmlFor="phone">
              Phone
            </label>
            <input
              className="text-field"
              id="phone"
              type="phone"
              placeholder="+99 99 99999-9999"
            />
          </div>
          <button>Save settings</button>
        </div>
      ) : (
        <Loader>Teum</Loader>
      )}
    </>
  );
}
