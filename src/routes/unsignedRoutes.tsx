import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import LoginBox from '../pages/LoginBox';
import SignIn from '../pages/SignIn';

const UnsignedRoutes: React.FC = () => {
  return (   
    <BrowserRouter>
        <Switch>
          <Route component = { LoginBox }  path="/" exact />
          <Route component = { SignIn }  path="/signin" exact />
        </Switch>
    </BrowserRouter>
  );
};

export default UnsignedRoutes;