import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import PlanetDisco from './planet_disco'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from '@apollo/react-hooks'

const client = new ApolloClient({
  uri: '/api',
})

export default () => <Router>
  <ApolloProvider client={client}>
    <Route path='/' component={PlanetDisco} />
  </ApolloProvider>
</Router>
