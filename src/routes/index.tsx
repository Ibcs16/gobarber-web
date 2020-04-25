import React from 'react';
import { Switch } from 'react-router-dom';
import SignUp from '../pages/SignUp';
import SignIn from '../pages/SignIn';
import Dashboard from '../pages/Dashboard';
import Route from './route';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={SignIn}/>
    <Route path="/signup" component={SignUp}/>
    <Route path="/dashboard" component={Dashboard} isPrivate />
  </Switch>
);

export default Routes;
