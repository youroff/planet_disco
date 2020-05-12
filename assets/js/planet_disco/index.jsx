import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { ApolloConsumer, ApolloProvider } from '@apollo/react-hooks'
import { Canvas } from 'react-three-fiber'
import PlanetView from './planet_view/scene'
import Overlay from './common/overlay'
import CitySimilarities from './city_similarities/city_similarities'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import { StoreContextProvider, StoreContext } from './common/store'

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    background: {
      paper: 'rgba(66, 66, 66, 0.6)'
    }
  }
})

export default ({ match }) => {
  return <StoreContextProvider>
    <ThemeProvider theme={theme}>
      <Overlay />      
    </ThemeProvider>

    <Switch>
      <Route path={match.url + "cities"}>
        {/* <CitySimilarities city={city} onCitySelect={setCity} /> */}
      </Route>

      {/* TODO: Move routes inside of this contexts wrapping hack (considering all views would reuse Canvas) */}
      <Route path={match.url}>
        <ApolloConsumer client>
          {client => (
            <StoreContext.Consumer value>
              {store => (

                <Canvas
                  shadowMap
                  updateDefaultCamera
                  resize={{debounce: { scroll: 50, resize: 50 }}}
                >
                  <ApolloProvider client={client}>
                    <StoreContext.Provider value={store}>
                      <PlanetView />                  
                    </StoreContext.Provider>
                  </ApolloProvider>
                </Canvas>

              )}
            </StoreContext.Consumer>
          )}
        </ApolloConsumer>
      </Route>
    </Switch>
  </StoreContextProvider>
}
