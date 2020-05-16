import React, { useRef, useEffect, useContext, useState } from 'react'
import { useApolloClient, useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { StoreContext } from '../common/store'
import { max } from 'd3'
import CityBars from './city_bars'

const CITIES = gql`{
  cities(limit: 5000) {
    entries {
      id
      city
      coord
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

const SIMILAR_CITIES = gql`query CityGenres($genreId: ID, $threshold: Integer) {
  similarCities(id: $genreId, threshold: $threshold) {
    city
    coord
    similarity
  }
}`

export default function({zoom}) {
  const { data } = useQuery(CITIES)
  const graphql = useApolloClient()
  const { state: { city, genres, colorMap } } = useContext(StoreContext)
  const [weights, setWeights] = useState({})

  useEffect(() => {
    if (genres.size > 0) {
      const genreIds = Array.from(genres).map(g => g.id)
      graphql.query({query: CITY_GENRES, variables: { genreIds }}).then(({ data }) => {
        const cityMap = {}
        const top = max(data.genrePopularityNormalized.map(g => g.popularity))
        data.genrePopularityNormalized.forEach(({ cityId, genreId, popularity }) => {
          cityMap[cityId] = [colorMap[genreId], popularity / top]
        })
        setWeights(cityMap)
      })  
    } else {
      setWeights({})
    }
  }, [genres])

  return (<>
    {data && <CityBars cities={data.cities.entries} weights={weights} />}
  </>)
}