import React, { Suspense, useContext, useState, useMemo, useEffect } from 'react'
import Stars from './stars'
import Earth from './earth'
import Cities from './cities'
import ControlsTilted from '../common/controls/tilted'
import { ContextWormhole } from '../common/wormhole'
import { StoreContext } from '../common/store'
import { toRad } from '../common/utils'
import GenrePopularity from './genre_popularity'
import CityPanel from './city_panel'
import CityLookup from './city_lookup'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'

const SIMILAR_CITIES = gql`query CityGenres($cityId: ID) {
  similarCities(id: $cityId) {
    id
    city
    coord
    humanCountry
    similarity
  }
}`

export default () => {
  const { state: { city, wormholes: { panel, sidebar } }, dispatch } = useContext(StoreContext)

  const location = useMemo(() => {
    return city ? {
      distance: 2,
      phi: toRad(90 - city.coord.lat),
      theta: toRad(city.coord.lng + 90)
    } : {
      distance: 4,
      phi: Math.PI / 2 * 0.7,
      theta: 2 * Math.PI * 1.3  
    }
  }, [city])

  const [genreColors, setGenreColors] = useState({})

  useEffect(() => { city && setGenreColors({}) }, [city])

  const { data } = useQuery(SIMILAR_CITIES, {
    variables: { cityId: city && city.id },
    skip: !city,
    fetchPolicy: 'network-only'
  })

  return <scene>
    {panel && <ContextWormhole to={panel}>
      <GenrePopularity genreColors={genreColors} setGenreColors={(gc) => {
        dispatch({type: 'SET_CITY'})
        setGenreColors(gc)
      }} />
    </ContextWormhole>}

    {sidebar && <ContextWormhole to={sidebar}>
      {!city && <CityLookup />}
      {city && <CityPanel city={city} similarCities={data && data.similarCities} />}
    </ContextWormhole>}

    <ControlsTilted {...location} maxDistance={4} />
    <ambientLight intensity={0.5} />
    <spotLight
      castShadow
      intensity={1}
      angle={Math.PI / 8}
      position={[20, 10, 20]}
      shadow-mapSize-width={2048}
      shadow-mapSize-height={2048}
    />
    <Stars radius={5} particles={30000} />
    <Suspense fallback={null}>
      <Earth />
      <Cities genreColors={genreColors} city={city} similarCities={data && data.similarCities} />
    </Suspense>
  </scene>
}