import React, {createContext, useReducer} from 'react'

const initialState = {
  // currentCity: {id: "3277", city: "Singapore", humanCountry: "Singapore", coord: {}, __typename: "City"}
}

function reducer(state, action) {
  switch(action.type) {
    case 'SET_CITY':
      return { ...state, currentCity: action.city }
    case 'SET_GENRE_HANDLER':
      return { ...state, genreHandler: action.handler }
    default:
      throw new Error("Unknown action for StoreContext", action)
  }
}

export const StoreContext = createContext(initialState)

export const StoreContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>
}
