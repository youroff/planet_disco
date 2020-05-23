import React, {createContext, useReducer} from 'react'

const initialState = {
  city: undefined,
  wormholes: {}
}

function reducer(state, action) {
  switch(action.type) {
    case 'SET_CITY':
      return { ...state, city: action.city }
    case 'SET_WORMHOLE':
      return { ...state, wormholes: {...state.wormholes, [action.name]: action.base }}
    default:
      throw new Error("Unknown action for StoreContext", action)
  }
}

export const StoreContext = createContext(initialState)

export const StoreContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>
}
