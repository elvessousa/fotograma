import React, { useState, useEffect, useContext } from 'react';
import PostItem from '../components/PostItem';
import { UserContext } from '../App';
import Message from '../components/Message';

export default function Home() {
  const [data, setData] = useState([]);
  // eslint-disable-next-line
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    fetch('/feed', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
    })
      .then(async (res) => {
        const result = await res.json();
        setData(result.posts);
      })
      .catch((err) => {
        console.error('error', err);
      });
  }, []);

  const deletePost = (postId) => {
    fetch(`/deletepost/${postId}`, {
      method: 'delete',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
    })
      .then(async (res) => {
        const result = await res.json();
        const newData = data.filter((item) => {
          return item._id !== result._id;
        });
        setData(newData);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="home">
      <Message title="All by myseeelf..." text="Don't wanna be..." />
      {data.map((item) => {
        return (
          <div className="post-container" key={item._id}>
            {item.postedBy._id === state._id && (
              <button
                className="delete-post"
                onClick={() => deletePost(item._id)}
              >
                Delete
              </button>
            )}
            <PostItem
              id={item._id}
              currentUser={state._id}
              author={item.postedBy._id}
              username={item.postedBy.name}
              title={item.title}
              text={item.body}
              image={item.photo}
              likes={item.likes}
              allComments={item.comments}
            />
          </div>
        );
      })}
    </div>
  );
}
