import React from 'react'
import { Canvas } from 'react-three-fiber'
import PlanetView from './planet_view/scene'
import { ApolloConsumer, ApolloProvider } from '@apollo/react-hooks'

export default () => {
  return <ApolloConsumer client>
    {client => (
      <Canvas shadowMap>
        <ApolloProvider client={client}>
          <PlanetView />
        </ApolloProvider>
      </Canvas>
    )}
  </ApolloConsumer>
}
