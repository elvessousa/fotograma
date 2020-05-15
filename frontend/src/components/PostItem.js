import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function PostItem({
  id,
  currentUser,
  author,
  username,
  title,
  text,
  image,
  likes,
  allComments,
}) {
  const [likeNumber, setLikeNumber] = useState(likes.length);
  const [like, setLike] = useState([...likes]);

  const [commentText, setCommentText] = useState('');
  const [postComments, setPostComments] = useState([...allComments]);

  // Like post
  const likePost = (id) => {
    fetch('/like', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then(async (result) => {
        await result;
        if (result.ok) {
          setLikeNumber(likeNumber + 1);
          setLike([...likes, currentUser]);
        }
        console.log(like);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // Unlike post
  const unlikePost = (id) => {
    fetch('/unlike', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then(async (result) => {
        await result;
        if (result.ok) {
          setLikeNumber(likeNumber - 1);
          setLike([]);
        }
        console.log(like);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // Comment
  const makeComment = (text, postId) => {
    fetch('/comment', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
      body: JSON.stringify({
        postId,
        text,
      }),
    })
      .then(async (res) => {
        await res.json();
        setPostComments([
          ...allComments,
          { _id: id, text: commentText, postedBy: currentUser },
        ]);
        setCommentText('');
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="post">
      <h5 className="post-title">
        <Link to={author !== currentUser ? `/profile/${author}` : '/profile'}>
          {username}
        </Link>
      </h5>
      <img className="post-image" src={image} alt="Post" />

      <ul className="post-interaction">
        <li>
          {like.includes(currentUser) ? (
            <button onClick={() => unlikePost(id)}>Unlike</button>
          ) : (
            <button onClick={() => likePost(id)}>Like</button>
          )}
        </li>
        <li>
          <button>Comment</button>
        </li>
        <li>
          <button>Share</button>
        </li>
        <li className="to-left">
          <button className="bookmark">Book</button>
        </li>
      </ul>

      <p className="liked-by">
        Liked by <strong>{likeNumber} people</strong>
      </p>

      <p className="post-content">
        <strong>{username} </strong> {text}
      </p>
      <button className="view-comments">View all 300 comments</button>

      <ul className="post-comments">
        {postComments.map((record) => {
          return (
            <li key={record._id}>
              <strong>
                {record.postedBy.name ? record.postedBy.name : 'You'}{' '}
              </strong>
              {record.text}
            </li>
          );
        })}
      </ul>

      <p className="post-date">Há 1 hora</p>
      <form
        className="comment-form"
        onSubmit={(e) => {
          e.preventDefault();
          makeComment(e.target[0].value, id);
        }}
      >
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="comment-input"
          placeholder="Add a comment..."
        />
        <button type="submit" className="comment-button">
          Publish
        </button>
      </form>
    </div>
  );
}
