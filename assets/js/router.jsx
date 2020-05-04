import React from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Dashboard from './Dashboard'
import PlanetDisco from './planet_disco'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from '@apollo/react-hooks'
// import SpotifySimpleLogin from './planet_disco/common/SpotifySimpleLogin'
import Player from './planet_disco/common/Player'

const client = new ApolloClient({
  uri: '/api',
})

export default () => (
  <Router>
    <ApolloProvider client={client}>
      <Switch>
        {/* <Route path="/login">
          <SpotifySimpleLogin />
        </Route> */}
        <Route path="/player">
          <Player />
        </Route>
        <Route path="/dashboard">
          <Dashboard />
        </Route>
        <Route path="/">
          <PlanetDisco />
        </Route>
      </Switch>
    </ApolloProvider>
  </Router>
)
