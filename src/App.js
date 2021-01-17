import React from 'react';
import './app.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'components/icon'
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom'
import Admin from 'components/admin/index.js'
import Client from 'components/client'
import Register from 'components/register'
import Login from 'components/login'
import AdminLogin from 'features/login/login.js'

function App() {
  return (
    <div className="app">
      <Router>
        <Route path='/register' component={Register} />
        <Route path='/login' component={Login} />
        <Route path='/admin-login' component={AdminLogin} />
        <Route path='/admin' component={Admin} />
        <Route path='/client' component={Client} />
      </Router>
    </div>
  );
}
export default App;