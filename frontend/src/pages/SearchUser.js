import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import UserAvatar from '../components/UserAvatar';

export default function SearchUser() {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState([]);

  const fetchUsers = (query) => {
    setLoading(true);
    setSearch(query);
    fetch('/search-users', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    }).then(async (res) => {
      const result = await res.json();
      setUserDetails(result.user);
      setLoading(false);
    });
  };
  return (
    <div className="search-users">
      <input
        type="text"
        className="search-input"
        value={search}
        placeholder="Search users"
        onChange={(e) => fetchUsers(e.target.value)}
      />
      {!loading ? (
        <ul className="user-list">
          {userDetails.map((user) => {
            return (
              <li key={user._id}>
                <Link to={`/profile/${user._id}`}>
                  <UserAvatar image={user.avatar} />
                  <h5 className="user-list-name">{user.name}</h5>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="loading-search">Searching users...</div>
      )}

      {userDetails.length === 0 && (
        <div className="user-message">
          <h3>No results found</h3>
          Type a name above to search for a user.
        </div>
      )}
    </div>
  );
}
