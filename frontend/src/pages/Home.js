import React, { useState, useEffect, useContext } from "react";
import PostItem from "../components/PostItem";
import { UserContext } from "../App";

export default function Home() {
  const [data, setData] = useState([]);
  // eslint-disable-next-line
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    fetch("/all", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
      .then(async (res) => {
        const result = await res.json();
        setData(result.posts);
      })
      .catch((err) => {
        console.error("error", err);
      });
  }, []);

  const deletePost = (postId) => {
    fetch(`/deletepost/${postId}`, {
      method: "delete",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
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
    <div className='home'>
      <h1>Explore</h1>
      {data.map((item) => {
        return (
          <div className='post-container' key={item._id}>
            {item.postedBy._id === state._id && (
              <button
                className='delete-post'
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
