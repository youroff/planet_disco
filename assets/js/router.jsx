import React from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Dashboard from './Dashboard'
import PlanetDisco from './planet_disco'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from '@apollo/react-hooks'

const client = new ApolloClient({
  uri: '/api',
})

export default () => (
  <Router>
    <ApolloProvider client={client}>
      <Switch>
        <Route path="/">
          <PlanetDisco />
        </Route>
      </Switch>
    </ApolloProvider>
  </Router>
)
