import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import LoginBox from '../pages/LoginBox';
import Profile from '../pages/Profile';
import SignIn from '../pages/SignIn';

const SignedRoutes: React.FC = () => {
  return (
    <BrowserRouter>
        <Route component = { LoginBox }  path="/" exact />
        <Route component = { SignIn }  path="/signin" />
        <Route component = { Dashboard } path="/dashboard" />
        <Route component = { Profile } path="/profile" />
    </BrowserRouter>
  );
};

export default SignedRoutes;
