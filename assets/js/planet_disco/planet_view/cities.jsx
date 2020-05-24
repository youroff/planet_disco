import React, { useEffect, useState } from 'react'
import { useApolloClient, useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { max } from 'd3'
import CityBars from './city_bars'
import CityArc from './city_arc'

const CITIES = gql`{
  cities(limit: 5000) {
    entries {
      id
      city
      coord
      humanCountry
    }
  }
}`

const CITY_GENRES = gql`query CityGenres($genreIds: [ID]) {
  genrePopularityNormalized(genreIds: $genreIds) {
    cityId
    genreId
    popularity
  }
}`

export default function({ genreColors, city, similarCities }) {
  const { data } = useQuery(CITIES)
  const graphql = useApolloClient()
  const [weights, setWeights] = useState({})

  useEffect(() => {
    if (Object.keys(genreColors).length > 0) {
      graphql.query({query: CITY_GENRES, variables: { genreIds: Object.keys(genreColors) }})
        .then(({ data: { genrePopularityNormalized: popularities } }) => {
        const cityMap = {}
        const top = max(popularities.map(g => g.popularity))
        popularities.forEach(({ cityId, genreId, popularity }) => {
          cityMap[cityId] = [genreColors[genreId], popularity / top]
        })
        setWeights(cityMap)
      })  
    } else {
      setWeights({})
    }
  }, [genreColors])

  return (<>
    {data && <CityBars
      cities={data.cities.entries}
      weights={weights}
    />}
    
    {city && similarCities && similarCities.map((toCity, i) => <CityArc
      from={city}
      to={toCity}
      key={i}
    />)}
  </>)
}