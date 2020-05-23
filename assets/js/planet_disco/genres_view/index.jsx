import React, { useEffect, useState } from 'react'
import Box from './box'
import Controls from '../common/controls/basic'
import GenreCloud from './genre_cloud'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { scaleLinear, scalePow, scaleOrdinal } from 'd3-scale'
import { max, min } from 'd3-array'
import { schemeSpectral, interpolateSpectral } from 'd3'

const GENRES = gql`{
  clusteredGenres {
    name
    coord
    pagerank
    masterGenreId
  }
}`

export default () => {
  const { data } = useQuery(GENRES)
  const genreNorm = scaleLinear().domain([0, 37]).range([0, 1])
  
  const groupByMaster = (genres) => {
    const map = genres.reduce((acc, genre) => {
      if (!acc.has(genre.masterGenreId)) acc.set(genre.masterGenreId, [])
      acc.get(genre.masterGenreId).push(genre)
      return acc
    }, new Map())
    return Array.from(map)
  }
  return <scene>
    <Controls maxDistance={80} minDistance={1} />
    <ambientLight intensity={0.3} />
    <spotLight
      intensity={1}
      lookAt={[0, 0, 0]}
      position={[50, 50, 30]}
    />
    <spotLight
      intensity={0.5}
      lookAt={[0, 0, 0]}
      position={[-50, -50, -50]}
    />
    {data && groupByMaster(data.clusteredGenres).map(([id, genres], i) =>
      <GenreCloud
        key={i}
        id={id}
        genres={genres}
        color={interpolateSpectral(genreNorm(i))}
      />
    )}
  </scene>
}
