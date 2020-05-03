import React, { useState } from 'react'
import { ApolloConsumer, ApolloProvider } from '@apollo/react-hooks'
import { Canvas } from 'react-three-fiber'
import PlanetView from './planet_view/scene'
import Overlay from './common/overlay'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    background: {
      paper: 'rgba(66, 66, 66, 0.6)'
    }
  }
})

export default () => {
  const [city, setCity] = useState()

  return <>
    <ThemeProvider theme={theme}>
      <Overlay onCitySelect={setCity} />      
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
