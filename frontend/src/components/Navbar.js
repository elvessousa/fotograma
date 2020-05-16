import React, { useContext } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { UserContext } from '../App';

export default function Navbar() {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);

  const renderList = () => {
    if (state) {
      return [
        <li key="search">
          <NavLink className="nav-link" activeClassName="active" to="/search">
            Search
          </NavLink>
        </li>,
        <li key="profile">
          <NavLink className="nav-link" activeClassName="active" to="/profile">
            Profile
          </NavLink>
        </li>,
        <li key="creat">
          <NavLink className="nav-link" activeClassName="active" to="/create">
            Create
          </NavLink>
        </li>,
        <li key="feed">
          <NavLink className="nav-link" activeClassName="active" to="/feed">
            Explore
          </NavLink>
        </li>,
        <li key="logout">
          <button
            onClick={() => {
              localStorage.clear();
              dispatch({ type: 'CLEAR' });
              history.push('/signin');
            }}
          >
            Logout
          </button>
        </li>,
      ];
    } else {
      return [
        <li key="signin">
          <NavLink className="nav-link" activeClassName="active" to="/signin">
            Sign in
          </NavLink>
        </li>,
        <li key="signup">
          <NavLink className="nav-link" activeClassName="active" to="/signup">
            Sign up
          </NavLink>
        </li>,
      ];
    }
  };
  return (
    <nav className="navigation">
      <NavLink className="brand" to={state ? '/' : '/signin'}>
        Fotograma
      </NavLink>
      <ul className="nav-links">{renderList()}</ul>
    </nav>
  );
}
