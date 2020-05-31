import React, { Suspense, useContext, useState, useMemo, useEffect } from 'react'
import { useThree } from 'react-three-fiber'
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
import { useQuery, useApolloClient } from '@apollo/react-hooks'
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
  const [citySync, updateCitySync] = useState({})
  const graphql = useApolloClient()

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

  useEffect(() => {
    if (city) {
      setGenreColors({})
      graphql.query({query: SIMILAR_CITIES, variables: { cityId: city.id }})
        .then(({ data: { similarCities } }) => {
          updateCitySync({ city, similarCities })
        })
    } else {
      updateCitySync({})
    }
  }, [city])

  return <scene>
    {panel && <ContextWormhole to={panel}>
      <GenrePopularity genreColors={genreColors} setGenreColors={(gc) => {
        dispatch({type: 'SET_CITY'})
        setGenreColors(gc)
      }} />
    </ContextWormhole>}

    {sidebar && <ContextWormhole to={sidebar}>
      {!citySync.city && <CityLookup />}
      {citySync.city && <CityPanel { ...citySync } />}
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
    <Stars radius={5} depth={30} particles={10000} />
    <Suspense fallback={null}>
      <Earth />
      <Cities genreColors={genreColors} { ...citySync } />
    </Suspense>
  </scene>
}