import React, { useContext, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Dom } from 'react-three-fiber'
import { StoreContext } from './store'
import { ApolloConsumer, ApolloProvider } from '@apollo/react-hooks'
import { ThemeProvider, useTheme } from '@material-ui/core/styles'


export const ContextForward = ({ wrapper, children }) => {
  const theme = useTheme()

  return <ApolloConsumer client>{client => (
    <StoreContext.Consumer value>{store => (
      <wrapper.type {...wrapper.props}>
        <ApolloProvider client={client}>
          <StoreContext.Provider value={store}>
            <ThemeProvider theme={theme}>
              {children}
            </ThemeProvider>
          </StoreContext.Provider>
        </ApolloProvider>
      </wrapper.type>
    )}</StoreContext.Consumer>
  )}</ApolloConsumer>
}

export const WormholeBase = ({ name, ...props }) => {
  const { dispatch } = useContext(StoreContext)
  const base = useRef()
  useEffect(() => {
    if (base.current)
      dispatch({ type: 'SET_WORMHOLE', name, base: base.current })
  }, [base])

  return <div ref={base} {...props}></div>
}

export const Wormhole = ({ to, children }) => {
  return <Dom>
    {createPortal(children, to)}
  </Dom>
}

export const ContextWormhole = ({to, children}) => {
  return <ContextForward wrapper={<Wormhole to={to} />}>
    {children}
  </ContextForward>
}
