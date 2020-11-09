import React from 'react';
import './app.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'components/icon'
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom'
import Admin from 'components/admin/admin-index.js'
//import Client from 'client'

function App() {
  return (
    <div className="app">
      <Router>
        <Route path='/admin' component={Admin} />
        {/* <Route path='/client' component={Client} /> */}
      </Router>
    </div>
  );
}
export default App;