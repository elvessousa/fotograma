import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../App';
import UserInfo from '../components/UserInfo';
import UserGallery from '../components/UserGallery';
import UserAvatar from '../components/UserAvatar';
import { Link } from 'react-router-dom';

export default function Profile() {
  const [pictures, setPictures] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    fetch('/posts', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
    }).then(async (res) => {
      const result = await res.json();
      setPictures(result.userPost);
    });
  }, []);

  useEffect(() => {
    if (avatar) {
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
          fetch('/update-avatar', {
            method: 'put',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('jwt')}`,
            },
            body: JSON.stringify({ avatar: data.secure_url }),
          }).then(async (res) => {
            const result = await res.json();
            localStorage.setItem(
              'user',
              JSON.stringify({ ...state, avatar: result.avatar })
            );
            dispatch({ type: 'UPDATE-AVATAR', payload: result.avatar });
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [avatar]);

  const updateAvatar = (file) => {
    setAvatar(file);
  };

  return (
    <div className="profile">
      <header className="user">
        <UserAvatar image={state ? state.avatar : ''}>
          <label htmlFor="file" className="user-avatar-chooser">
            Choose file
          </label>
          <input
            id="file"
            type="file"
            onChange={(e) => {
              updateAvatar(e.target.files[0]);
            }}
            style={{ display: 'none' }}
          />
        </UserAvatar>
        <UserInfo
          name={state ? state.name : 'loading'}
          description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
          email={state ? state.email : 'loading'}
          posts={pictures.length}
          followers={state ? state.followers.length : '0'}
          following={state ? state.following.length : '0'}
        >
          <Link to="/account" className="user-edit-button">
            Edit
          </Link>
        </UserInfo>
      </header>
      <UserGallery pictures={pictures} />
    </div>
  );
}
