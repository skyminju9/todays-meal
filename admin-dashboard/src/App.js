import React from "react";
import {Route, Switch, NavLink} from 'react-router-dom';
import Home from './components/Home';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <div>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/admin-login">Admin Login</NavLink>
      </nav>
      <Switch>
        <Route path="/admin" component={AdminDashboard}/>
        <Route path="/admin-login" component={AdminLogin}/>
        <Route path="/" exact component={Home}/>
      </Switch>
    </div>
  );
}

export default App;
