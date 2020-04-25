import _ from "../css/app.css"

import ReactDOM from 'react-dom'
import React from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import { CitySimilarities } from './city_similarities'
import PlanetDisco from './planet_disco'

ReactDOM.render(
  <Router>
    <Switch>
      <Route path="/cities">
        <CitySimilarities />
      </Route>
      <Route path="/">
        <PlanetDisco />
      </Route>
    </Switch>
  </Router>,
  document.getElementById('root')
)