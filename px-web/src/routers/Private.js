import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import AuthService from '../services/Auth';

const PrivateRoute = ({ children, ...rest }) => {
  console.log("hello", AuthService.isLoggedIn());

  return (
    <Route {...rest} >
      {AuthService.isLoggedIn() ?
        children
        : <Redirect to="/" />}
    </Route>
  );
};

export default PrivateRoute;