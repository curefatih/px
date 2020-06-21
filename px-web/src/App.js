import React from 'react';

import "./statics/css/reset.css";
import "flexiblegs-css";

import "./App.scss";
import Room from './views/Room/Room';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import Home from './views/Home/Home';
import { ToastContainer } from 'react-toastify';
import Private from './routers/Private';

function App() {
  return (
    <div className="App">


      <Router>
        <Switch>
          <Route path="/room/:roomID">
            <Room />
          </Route>
          {/* <Route path="/users">
            <Users />
              </Route>*/}
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/">
            <Redirect to="/" />
          </Route>
        </Switch>
      </Router>

    </div>
  );
}

export default App;