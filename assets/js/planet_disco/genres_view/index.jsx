import React, { useEffect, useState } from 'react'
import Box from './box'
import { OrbitControls } from 'drei'
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

  const radScale = scalePow()
    .domain([0.000100067999999999, 0.006100348])
    .range([0.09, 0.7, 1]);

  const masterGenres = {
    3712: 0,
    1047: 1,
    318: 2,
    1214: 3,
    865: 4,
    986: 5,
    3822: 6,
    2193: 7,
    669: 8,
    2668: 9,
    3134: 10,
    1727: 11,
    1861: 12,
    1099: 13,
    1252: 14,
    2177: 15,
    2368: 16,
    3158: 17,
    919: 18,
    2224: 19,
    1674: 20,
    1135: 21,
    1436: 22,
    3488: 23,
    2303: 24,
    251: 25,
    831: 26,
    817: 27,
    2913: 28,
    768: 29,
    1949: 30,
    2019: 31,
    721: 32,
    267: 33,
    1936: 34,
    3618: 35,
    2438: 36,
    2452: 37
}

  const genreNorm = scaleLinear()
    .domain([0, 37])
    .range([0, 1]);
  

  return <scene>
    <OrbitControls />
    <ambientLight intensity={1} />
    {/* <spotLight
      castShadow
      intensity={1}
      angle={Math.PI / 8}
      position={[20, 10, 20]}
      shadow-mapSize-width={8192}
      shadow-mapSize-height={8192}
    /> */}
    {data && data.clusteredGenres.map((genre, i) => {
      const { x, y, z } = genre.coord
      const { name } = genre.name
      const gRaduis = radScale(genre.pagerank)
      const gcolor = interpolateSpectral(genreNorm(masterGenres[genre.masterGenreId]))
      return <Box raduis={gRaduis} color={gcolor} key={i} position={[x, y, z]} />
    })}
  </scene>
}