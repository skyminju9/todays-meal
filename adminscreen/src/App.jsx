import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AdminPage from './AdminPage';

const Home = () => {
  return <div>Hello from the backend! (Default screen)</div>;
};

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/admin" component={AdminPage} />
      </Switch>
    </Router>
  );
};

export default App;
