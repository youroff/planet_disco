import React from 'react'
import Box from './box'
import { OrbitControls } from 'drei'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'

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
  

  return <scene>
    <OrbitControls />
    <ambientLight intensity={0.3} />
    <spotLight
      castShadow
      intensity={1}
      angle={Math.PI / 8}
      position={[20, 10, 20]}
      shadow-mapSize-width={8192}
      shadow-mapSize-height={8192}
    />
    {data && data.clusteredGenres.map((genre, i) => {
      const { x, y, z } = genre.coord
      return <Box key={i} position={[x, y, z]} />
    })}
  </scene>
}