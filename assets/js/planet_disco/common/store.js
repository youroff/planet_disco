import React, {createContext, useReducer} from 'react'

const initialState = {
  city: undefined,
  genres: new Set(),
  colorMap: {}
}

function reducer(state, action) {
  switch(action.type) {
    // Clearing genres when setting the city and
    // the other way around
    case 'SET_CITY':
      return { ...state, city: action.city, genres: new Set(), colorMap: {} }
    case 'SET_GENRES':
      const { genres, colorMap } = action
      return { ...state, genres, colorMap, city: undefined }
    // case 'SET_GENRE_HANDLER':
    //   return { ...state, genreHandler: action.handler }
    default:
      throw new Error("Unknown action for StoreContext", action)
  }
}

export const StoreContext = createContext(initialState)

export const StoreContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>
}
