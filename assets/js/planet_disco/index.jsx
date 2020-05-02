import React, { useState } from 'react'
import { ApolloConsumer, ApolloProvider } from '@apollo/react-hooks'
import { Canvas } from 'react-three-fiber'
import PlanetView from './planet_view/scene'
import Panel from './common/panel'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'

const theme = createMuiTheme({
  palette: {type: 'dark'}
})

export default () => {
  const [city, setCity] = useState()

  return <>
    <ThemeProvider theme={theme}>
      <Panel onCitySelect={setCity} />      
    </ThemeProvider>
    <ApolloConsumer client>
      {client => (
        <Canvas shadowMap>
          <ApolloProvider client={client}>
            <PlanetView currentCity={city} />
          </ApolloProvider>
        </Canvas>
      )}
    </ApolloConsumer>
  </>
}
