import React, { useState, useContext, useMemo } from 'react'
import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { interpolateSpectral } from 'd3'
import { StoreContext } from '../common/store'
import { ContextWormhole } from '../common/wormhole'
import { computeDirection } from '../common/utils'
import GenreSelector from '../common/panel/genre_selector'
import Controls from '../common/controls/basic'
import GenreCloud from './genre_cloud'
import Effects from './effects'
import TrackingLight from './tracking_light'
import GenrePanel from './genre_panel'

const GENRES = gql`{
  clusteredGenres {
    genreId
    masterGenreId
    name
    coord
    pagerank
  }
}`

const useStyles = makeStyles((theme) => ({
  header: {
    marginBottom: theme.spacing(2)
  }
}))

const initCoord = { x: 0, y: 0, z: 0 }
const initDirection = { phi: Math.PI / 2, theta: 2 * Math.PI }

export default () => {
  const classes = useStyles()
  const { data } = useQuery(GENRES)
  const { state: { wormholes: { panel, sidebar } } } = useContext(StoreContext)
  const [clusterId, setClusterId] = useState()
  const [currentGenre, setCurrentGenre] = useState()

  const setCluster = (genreId) => {
    setCurrentGenre()
    setClusterId(genreId)
  }

  const centroids = useMemo(() => {
    const cs = {}
    const mn = Math.min
    const mx = Math.max
    data && data.clusteredGenres.forEach(({ coord: { x, y, z }, masterGenreId }) => {
      if (cs[masterGenreId]) {
        const { x: [xMin, xMax], y: [yMin, yMax], z: [zMin, zMax] } = cs[masterGenreId]
        cs[masterGenreId] = {
          x: [mn(xMin, x), mx(xMax, x)],
          y: [mn(yMin, y), mx(yMax, y)],
          z: [mn(zMin, z), mx(zMax, z)]
        }
      } else {
        cs[masterGenreId] = { x: [x, x], y: [y, y], z: [z, z] }
      }
    })

    for (const [genre_id, { x: [xMin, xMax], y: [yMin, yMax], z: [zMin, zMax] }] of Object.entries(cs)) {
      cs[genre_id] = { x: (xMax + xMin) / 2, y: (yMax + yMin) / 2, z: (zMax + zMin) / 2 }
    }

    return cs
  }, [data])

  const colorMap = useMemo(() => {
    const cm = {}
    const ids = new Set()
    data && data.clusteredGenres.forEach((g) => { ids.add(g.masterGenreId) })
    Array.from(ids).forEach((genreId, i) => {
      cm[genreId] = interpolateSpectral(i / ids.size)
    })
    return cm
  }, [data])

  return <scene>
    {/* <Effects /> */}

    {panel && <ContextWormhole to={panel}>
      <Typography variant="subtitle1">
        Genre clusters
      </Typography>

      <Typography variant="caption" className={classes.header}>
        Pick a master genre to learn more about other genres in the cluster
      </Typography>

      <GenreSelector
        colorMap={clusterId ? { [clusterId]: colorMap[clusterId] } : {}}
        selectGenre={(g) => setCluster(clusterId == g.id ? undefined : g.id)}
      />
    </ContextWormhole>}

    {sidebar && <ContextWormhole to={sidebar}>
      {currentGenre && <GenrePanel genre={currentGenre} selectCluster={setCluster} /> || <div></div>}
    </ContextWormhole>}

    <Controls
      maxDistance={80}
      minDistance={5}
      { ...clusterId ? centroids[clusterId] : initCoord }
      { ...clusterId ? computeDirection(centroids[clusterId]) : initDirection}
      distance={clusterId ? 20 : 80}
    />
    <ambientLight intensity={1} />
    <spotLight
      intensity={0.4}
      lookAt={[0, 0, 0]}
      position={[50, 50, 500]}
    />
    <TrackingLight
      { ...clusterId ? centroids[clusterId] : initCoord }
      color={clusterId ? colorMap[clusterId] : '#000000'}
    />
    {data && <GenreCloud
      centroids={centroids}
      genres={data.clusteredGenres}
      selectedCluster={clusterId}
      colorMap={colorMap}
      selectCluster={setCluster}
      selectGenre={setCurrentGenre}
      currentGenre={currentGenre}
    />}
  </scene>
}
