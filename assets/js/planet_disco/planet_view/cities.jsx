import React, { useRef, useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { toRad } from '../common/utils'
import * as THREE from 'three/src/Three'
import * as d3 from 'd3'

const CITIES = gql`{
  cities(limit: 5000) {
    entries {
      city
      population
      coord
    }
  }
}`

const min_pop = 600
const max_pop = 31480498
const pop_scale = d3.scaleLog([min_pop, max_pop], [2, 7])

export default function({zoom}) {
  const mesh = useRef()
  const { data } = useQuery(CITIES)

  useEffect(() => {
    const dummy = new THREE.Object3D()
    if (data && mesh.current) {
      data.cities.entries.forEach(({coord: {lat, lng}, population}, i) => {
        mesh.current.getMatrixAt(i, dummy.matrix)
        dummy.position.setFromSphericalCoords(1, toRad(lat - 90), toRad(lng - 90))
        dummy.lookAt(0, 0, 0)
        if (population > pop_scale.invert(zoom)) {
          dummy.scale.set(zoom / 10, zoom / 10, zoom / 10)
        } else {
          dummy.scale.set(0, 0, 0)
        }
        dummy.updateMatrix()
        mesh.current.setMatrixAt(i, dummy.matrix)
      })
      mesh.current.instanceMatrix.needsUpdate = true
    }
  }, [data, zoom])

  return (<>
    {data && <instancedMesh
      ref={mesh}
      args={[null, null, data.cities.entries.length]}
      castShadow
    >
      <boxBufferGeometry attach="geometry" args={[0.02, 0.02, 0.002]} />
      <meshStandardMaterial attach="material" emissive="#ff0000" color="#ff3333" opacity={0.5} />
    </instancedMesh>}
  </>)
}