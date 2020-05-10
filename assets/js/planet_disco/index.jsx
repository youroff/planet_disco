import React, { useState } from 'react'
import { ApolloConsumer, ApolloProvider } from '@apollo/react-hooks'
import { Canvas } from 'react-three-fiber'
import PlanetView from './planet_view/scene'
import Overlay from './common/overlay'
import CitySimilarities from './city_similarities/city_similarities'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import { views } from './common/views'
import CssBaseline from '@material-ui/core/CssBaseline';


const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#df616d',
    },
    secondary: {
      main: '#433e60',
    },
    background: {
      default: "#091324",
      paper: 'rgba(71, 80, 98, 0.8)', // 'rgba(89, 100, 117, 0.6)' //'rgba(66, 66, 66, 0.6)'
    },
  },
  typography: {
    fontFamily: [
      'Roboto, Helvetica Neue, sans-serif',
    ].join(','),
  },
})

export default () => {
  const [city, setCity] = useState(null) //{id: "3277", city: "Singapore", humanCountry: "Singapore", coord: {}, __typename: "City"})
  const [currentView, setView] = useState(views.CITY)

  return <>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Overlay view={currentView} currentCity={city} onCitySelect={setCity} onViewChange={setView} />


      <ApolloConsumer client>
        {client => (
          (() => {
            switch (currentView) {
              case views.PLANET:
                return (
                  <Canvas shadowMap>
                    <ApolloProvider client={client}>
                      <PlanetView currentCity={city} />
                    </ApolloProvider>
                  </Canvas>)
              case views.CITY:
                return (
                  <CitySimilarities client={client} city={city} onCitySelect={setCity} />
                )
            }
          })()

        )}
      </ApolloConsumer>

    </ThemeProvider>
  </>
}
