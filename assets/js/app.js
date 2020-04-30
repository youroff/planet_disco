import _ from "../css/app.css"

import ReactDOM from 'react-dom'
import React from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Dashboard from './Dashboard'

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route path="/">
          <Dashboard />
        </Route>
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
)
