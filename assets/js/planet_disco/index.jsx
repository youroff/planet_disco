import React, { useState } from 'react'
import { ApolloConsumer, ApolloProvider } from '@apollo/react-hooks'
import { Canvas } from 'react-three-fiber'
import PlanetView from './planet_view/scene'
import Overlay from './common/overlay'
import CitySimilarities from './city_similarities'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import { views } from './common/views'

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    background: {
      paper: 'rgba(66, 66, 66, 0.6)'
    }
  }
})

export default () => {
  const [city, setCity] = useState(null) //{id: "3277", city: "Singapore", humanCountry: "Singapore", coord: {}, __typename: "City"})
  const [currentView, setView] = useState(views.CITY)

  return <>
    <ThemeProvider theme={theme}>
      <Overlay view={currentView} currentCity={city} onCitySelect={setCity} onViewChange={setView} />
    </ThemeProvider>

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
              return <CitySimilarities city={city} onCitySelect={setCity}/>
          }
        })()

      )}
    </ApolloConsumer>
  </>
}
