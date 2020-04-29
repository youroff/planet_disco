import React from 'react'
import { useLoader } from 'react-three-fiber'
import * as THREE from 'three/src/Three'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'

const CITIES = gql`{
  cities(limit: 5000) {
    entries {
      city
      coord
    }
  }
}`

export function Earth(props) {
  const { loading, error, data } = useQuery(CITIES);
  const texture = useLoader(THREE.TextureLoader, "/images/8081_earthspec10k.gif")
  
  texture.magFilter = THREE.NearestFilter

  return (
    <mesh {...props}>
      <sphereGeometry attach="geometry" args={[1, 32, 32]} />
      <meshLambertMaterial attach="material" map={texture} />
    </mesh>
  )
}