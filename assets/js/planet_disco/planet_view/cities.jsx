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

export default function({zoom}) {
  const mesh = useRef()
  const { data } = useQuery(CITIES)
  const { dispatch } = useContext(StoreContext)
  const [weights, setWeights] = useState({})

  useEffect(() => {
    dispatch({type: 'SET_GENRE_HANDLER', handler: setWeights})
    return () => { dispatch({type: 'SET_GENRE_HANDLER'}) }
  }, [])

  useEffect(() => {
    const dummy = new THREE.Object3D()
    if (data && mesh.current) {
      // console.log(weights)
      data.cities.entries.forEach(({coord: {lat, lng}, population}, i) => {
        mesh.current.getMatrixAt(i, dummy.matrix)
        dummy.position.setFromSphericalCoords(1, toRad(lat - 90), toRad(lng - 90))
        dummy.lookAt(0, 0, 0)
        
        // if (population > pop_scale.invert(zoom)) {
        dummy.scale.set(zoom / 15, zoom / 15, 100)
        // } else {
        //   dummy.scale.set(0, 0, 0)
        // }
        dummy.updateMatrix()
        mesh.current.setMatrixAt(i, dummy.matrix)
      })
      mesh.current.instanceMatrix.needsUpdate = true
    }
  }, [data, zoom, weights])

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