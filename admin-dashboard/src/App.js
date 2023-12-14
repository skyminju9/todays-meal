import React from "react";
import {Route, Switch} from 'react-router-dom';
import Home from './components/Home';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <div>
      <Switch>
        <Route path="/admin" component={AdminDashboard}/>
        <Route path="/admin-login" component={AdminLogin}/>
        <Route path="/" exact component={Home}/>
      </Switch>
    </div>
  );
}

export default App;
