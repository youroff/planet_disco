import React from 'react'
import Arc from './arc'

export default ({ city, similarCities }) => {

  return <>
    {similarCities.map((toCity, i) => <Arc
      from={city}
      to={toCity}
      key={i}
    />)}
  </>
}
