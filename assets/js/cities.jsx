import React, { useRef, useState, useEffect } from 'react'
import { useLoader, useFrame } from 'react-three-fiber'
import * as THREE from 'three/src/Three'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
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

const fromGPS = ({lat, lng}, r = 1) => {
  const phi = (lat - 90) * Math.PI / 180
  const theta = (180 - lng) * Math.PI / 180

  return [
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  ]
}

export function Cities({zoom}) {
  const mesh = useRef()
  const [rendered, setRendered] = useState(false)
  const { data } = useQuery(CITIES)
  
  useEffect(() => {
    const dummy = new THREE.Object3D()
    if (data && mesh.current) {
      data.cities.entries.forEach(({coord}, i) => {
        dummy.position.set(...fromGPS(coord))
        dummy.lookAt(0, 0, 0)
        dummy.updateMatrix()
        mesh.current.setMatrixAt(i, dummy.matrix)
      })
      mesh.current.instanceMatrix.needsUpdate = true
      setRendered(true)
    }
  }, [data])
  
  useFrame(() => {
    const dummy = new THREE.Object3D()
    if (rendered) {
      data.cities.entries.forEach(({coord, population}, i) => {
        mesh.current.getMatrixAt(i, dummy.matrix)
        dummy.position.set(...fromGPS(coord))
        dummy.lookAt(0, 0, 0)
        if (population > pop_scale.invert(zoom)) {
          dummy.scale.set(1, 1, 1)
        } else {
          dummy.scale.set(0, 0, 0)
        }
        dummy.updateMatrix()
        mesh.current.setMatrixAt(i, dummy.matrix)
      })
      mesh.current.instanceMatrix.needsUpdate = true
    }
  })

  return (<>
    {data && (<instancedMesh ref={mesh} args={[null, null, data.cities.entries.length]} castShadow>
      <boxBufferGeometry attach="geometry" args={[0.005, 0.005, 0.2]} />
      <meshStandardMaterial attach="material" emissive="#ff0000" color="#ff3333" opacity={0.5} />
    </instancedMesh>)}
  </>)
}