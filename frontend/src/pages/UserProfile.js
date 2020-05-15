import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../App';
import Loader from '../components/Loader';
import UserGallery from '../components/UserGallery';
import UserInfo from '../components/UserInfo';
import UserAvatar from '../components/UserAvatar';

export default function Profile() {
  const [userProfile, setUserProfile] = useState(null);
  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();
  const [showFollow, setShowFollow] = useState(
    state ? !state.following.includes(userid) : true
  );

  useEffect(() => {
    fetch(`/user/${userid}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
    }).then(async (res) => {
      const result = await res.json();
      setUserProfile(result);
    });
  }, [userid]);

  // Follow user
  const followUser = () => {
    fetch(`/follow`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
      body: JSON.stringify({ followId: userid }),
    }).then(async (res) => {
      const data = await res.json();

      dispatch({
        type: 'UPDATE',
        payload: { following: data.following, followers: data.followers },
      });

      localStorage.setItem('user', JSON.stringify(data));

      setUserProfile((prevState) => {
        return {
          ...prevState,
          user: {
            ...prevState.user,
            followers: [...prevState.user.followers, data._id],
          },
        };
      });

      setShowFollow(false);
    });
  };

  // Unfollow
  const unfollowUser = () => {
    fetch(`/unfollow`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
      body: JSON.stringify({ unfollowId: userid }),
    }).then(async (res) => {
      const data = await res.json();

      dispatch({
        type: 'UPDATE',
        payload: { following: data.following, followers: data.followers },
      });

      localStorage.setItem('user', JSON.stringify(data));

      setUserProfile((prevState) => {
        const newFollower = prevState.user.followers.filter(
          (item) => item !== data._id
        );

        return {
          ...prevState,
          user: {
            ...prevState.user,
            followers: newFollower,
          },
        };
      });

      setShowFollow(true);
    });
  };

  return (
    <>
      {userProfile ? (
        <div className="profile">
          <header className="user">
            <UserAvatar image={userProfile.user.avatar} />

            <UserInfo
              name={userProfile.user.name}
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
              email={userProfile.user.email}
              posts={userProfile.posts.length}
              followers={userProfile.user.followers.length}
              following={userProfile.user.following.length}
            >
              {showFollow ? (
                <button className="follow-button" onClick={() => followUser()}>
                  Follow
                </button>
              ) : (
                <button
                  className="unfollow-button"
                  onClick={() => unfollowUser()}
                >
                  Unfollow
                </button>
              )}
            </UserInfo>
          </header>
          <UserGallery pictures={userProfile.posts} />
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
}
