import React, { useEffect, createContext, useReducer, useContext } from 'react';
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom';

import Navbar from './components/Navbar';

import Home from './pages/Home';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';
import EditProfile from './pages/EditProfile';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import CreatePost from './pages/CreatePost';
import Reset from './pages/Reset';
import NewPassword from './pages/NewPassword';

import { reducer, initialState } from './reducers/userReducer';

import './styles/main.css';

export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  // eslint-disable-next-line
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      dispatch({ type: 'USER', payload: user });
    } else {
      if (!history.location.pathname.startsWith('/reset')) {
        history.push('/signin');
      }
    }
  }, [history, dispatch]);

  return (
    <Switch>
      <Route exact path="/">
        <Feed />
      </Route>
      <Route path="/signin">
        <Signin />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route exact path="/reset">
        <Reset />
      </Route>
      <Route path="/reset/:token">
        <NewPassword />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route path="/profile/:userid">
        <UserProfile />
      </Route>
      <Route exact path="/account">
        <EditProfile />
      </Route>
      <Route path="/create">
        <CreatePost />
      </Route>
      <Route path="/feed">
        <Home />
      </Route>
    </Switch>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
