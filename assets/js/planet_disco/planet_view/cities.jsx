import React, { useRef, useEffect, useContext, useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { toRad } from '../common/utils'
import { StoreContext } from '../common/store'
import * as THREE from 'three/src/Three'
import * as d3 from 'd3'

const CITIES = gql`{
  cities(limit: 5000) {
    entries {
      city
      coord
    }
  }
}`

const dummy = new THREE.Object3D()

export default function({zoom}) {
  const mesh = useRef()
  const { data } = useQuery(CITIES)
  const { dispatch } = useContext(StoreContext)
  const [weights, setWeights] = useState({})

  // This attaches and removes handler to context, which allows Genre selector
  // for updating genre weights
  useEffect(() => {
    dispatch({type: 'SET_GENRE_HANDLER', handler: setWeights})
    return () => { dispatch({type: 'SET_GENRE_HANDLER'}) }
  }, [])

  useEffect(() => {
    if (mesh.current) {

    }
  }, [weights])

  useEffect(() => {
    if (data && mesh.current) {
      data.cities.entries.forEach(({coord: {lat, lng}, population}, i) => {
        mesh.current.getMatrixAt(i, dummy.matrix)
        dummy.position.setFromSphericalCoords(1, toRad(lat - 90), toRad(lng - 90))
        dummy.lookAt(0, 0, 0)
        dummy.scale.set(zoom / 15, zoom / 15, 100)
        dummy.updateMatrix()
        mesh.current.setMatrixAt(i, dummy.matrix)
      })
      mesh.current.instanceMatrix.needsUpdate = true
    }
  }, [data])

  useEffect(() => {
    if (data && mesh.current) {
      data.cities.entries.forEach(({coord: {lat, lng}, population}, i) => {
        mesh.current.getMatrixAt(i, dummy.matrix)
        dummy.scale.set(zoom / 15, zoom / 15, 100)
        dummy.updateMatrix()
        mesh.current.setMatrixAt(i, dummy.matrix)
      })
      mesh.current.instanceMatrix.needsUpdate = true
    }
  }, [zoom])

  return (<>
    {data && <instancedMesh
      ref={mesh}
      args={[null, null, data.cities.entries.length]}
      castShadow
    >
      <boxBufferGeometry attach="geometry" args={[0.02, 0.02, 0.02]} />
      <meshStandardMaterial attach="material" emissive="#ececec" color="#ececec" opacity={0.5} />
    </instancedMesh>}
  </>)
}